var BACKEND = require("../libraries/config").BACKEND;

var React = require('react-native');
var CategoryStore = require('../libraries/category')
var renderer = require("../libraries/renderer")
var EqIcon = require('./EqIcon')
var Icon = require('FAKIconImage');
var Modal = require('./modal');
var DeviceHeight = require('Dimensions').get('window').height;

var {
  StyleSheet,
  Text,
  Image,
  ListView,
  TouchableHighlight,
  TouchableOpacity,
  View,
} = React;


var AlbumTracks = React.createClass({
  getInitialState: function(){
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (sec1, sec2) => sec1 !== sec2
      }),
      loaded: false,
      animation: true,
      showModal: false,
      modalTop: 0,
    }; 
  },
  fetchData: function(){
    CategoryStore.getCategory("Album",this.props.filter)
    .then((albumTracks)=>{

      this.setState({
        images: albumTracks.images,
        tracks: albumTracks.tracks,
        loaded: true,
      });

      this.updateTrack(renderer.playerState.currentPlayingTrack,
                        renderer.playerState.TransportState,
                        true)

    })
    .done();
  },
  componentDidMount: function(){
    this.fetchData();
    renderer.addListener("TransportState",this.updateTrack);
  },
  componentWillUnmount: function(){
    renderer.removeListener("TransportState",this.updateTrack);
  },
  updateTrack: function(track,trackState,initialLoad){
    if(!initialLoad && trackState != "LOADING" && trackState != "PLAYING" && trackState != "PAUSED_PLAYBACK")
      return;

    var id = track ? track._id : null,
        newTracks = {},
        sectionKeys = Object.keys(this.state.tracks),
        trackPath;


    sectionKeys.forEach((k)=>{
        newTracks[k] = Object.assign({},this.state.tracks[k])
        Object.keys(newTracks[k]).forEach((rowKey)=>{
          if(newTracks[k][rowKey]._id == id){
            trackPath = {sectionID: k,rowID: rowKey}
          }
        })
    })

    if(trackPath){
      newTracks[trackPath.sectionID][trackPath.rowID] = Object.assign(
        {
          nowPlaying: true,
          animate: trackState == "PLAYING"
        },
        newTracks[trackPath.sectionID][trackPath.rowID]
      )

      this.setState({
         dataSource: this.state.dataSource.cloneWithRowsAndSections(newTracks)
      })
    }else if(initialLoad){
      this.setState({
         dataSource: this.state.dataSource.cloneWithRowsAndSections(newTracks)
      })
    }
  },
  pressTrack: function(sectionID,rowID, id){
    renderer.playAlbumTracks(this.props.filter.Artist,sectionID,rowID);
    this.updateTrack({_id:id},"LOADING")
  },
  showModal: function(node,trackID,sectionID){
    node.measure((x,y,w,h,px,py) =>{
      this.setState({
        showModal: true,
        modalFilter: sectionID ? {Album: sectionID, Artist: this.props.filter.Artist} : {_id: trackID},
        modalTop: py
      }) 
    });
  },
  renderTrack: function(track, sectionID, rowID){
    return(
        <TouchableHighlight onPress={() => this.pressTrack(sectionID, rowID, track._id)}>
          <View style={styles.trackRowContainer}>
            <View style={styles.trackRow}>
              {
                track.nowPlaying ?
                <EqIcon style={styles.eqIcon} enableAnimation={track.animate} barColor="#AB3C3C"/>
                :
                <Text style={styles.trackNumber}>{track.TrackNumber}</Text>
              }
              <Text numberOfLines={1} style={styles.title}>{track.Title}</Text>
              <TouchableOpacity onPress={(node)=> this.showModal(node,track._id)} style={styles.moreHolder}>
                <Icon
                  name='ion|ios-more-outline'
                  size={24}
                  color='black'
                  style={styles.moreIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableHighlight>
    )
  },
  pressIcon: function(sectionID){
    var rowID = Object.keys(this.state.tracks[sectionID])[0],
        trackId = this.state.tracks[sectionID][rowID]._id;

    this.pressTrack(sectionID,rowID,trackId);
  },
  renderSection: function(sectionData,sectionID){
    var images = (this.state.images || []).filter(i => i.album == sectionID && i.size =="large");
    var url;
    if(images[0] && images[0].filename)
      url = BACKEND + "/images/cache/albums/" + images[0].filename;

    return(
      <View style={styles.sectionHeader}>
        {url ? 
          <Image
            source={{uri: url}}
            style={styles.thumbnailLarge}
          />
          :
          <View style={styles.missingThumbnail}></View>
        }
        <View style={styles.rightContainer} >
          <Text style={styles.sectionTitle} >{sectionID}</Text>
          <View style={styles.sectionButtons}>
            <TouchableOpacity onPress={(node)=> this.pressIcon(sectionID)}>
              <Icon
                name='foundation|play-circle'
                size={45}
                color='#AB3C3C'
                style={styles.largeIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={(node)=> this.showModal(node,null,sectionID)}>
              <Icon
                name='ion|ios-more-outline'
                size={45}
                color='#AB3C3C'
                style={styles.largeIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  },
  renderLoading: function(){
    return (
      <View style={styles.loadingContainer}>
        <Text>
          Loading Artists...
        </Text>
      </View>
    );
  },
  showModalTransition: function(transition) {
    transition('opacity', {duration: 200, begin: 0, end: 1});
    transition('height', {duration: 200, begin: DeviceHeight * 2, end: DeviceHeight});
  },
  hideModalTransition: function(transition) {
    transition('height', {duration: 200, begin: DeviceHeight, end: DeviceHeight * 2, reset: true});
    transition('opacity', {duration: 200, begin: 1, end: 0});
  },
  closeModal: function(){
    this.setState({
      showModal: false
    })
  },
  render: function() {
    if(!this.state.loaded)
      return this.renderLoading();

    return (
      <View style={styles.listContainer}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderTrack}
          renderSectionHeader={this.renderSection}
          pageSize={50}
          ref={"list"}
          initialListSize={150}
          style={styles.listView}
        />
        {this.state.showModal ? 
          <Modal  top={this.state.modalTop || 0} 
                  onClose={this.closeModal}
                  filter={this.state.modalFilter}
          />
          :
          null
        }

      </View>
    );
  }
})

var styles = StyleSheet.create({
  addView: {
    marginLeft: 48,
    marginRight: 48,
    padding: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",
  },
  addOption: {
    fontSize: 16,
    paddingBottom: 8,
  },
  listContainer: {
    flex: 1
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
    marginLeft: 8,
    textAlign: 'left',
    fontWeight: "600"
  },
  sectionHeader: {
    flex: 1,
    paddingTop: 16,
    paddingLeft: 16,
    paddingBottom: 16,
    paddingRight: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.2)'
  },
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: '#FFFFFF'
  },
  trackRowContainer: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "#FFFFFF",
  },
  trackRow: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    flex: 1,
    paddingBottom: 16,
    paddingTop: 16,
    flexDirection: "row",
    overflow: "hidden",
  },
  rightContainer: {
    flex: 1,
  },
  eqIcon: {
    marginRight: 8
  },
  title: {
    flex: 1,
    fontSize: 14,
    marginLeft: 16,
    fontWeight: "600",
    textAlign: 'left',
  },
  trackNumber: {
    fontSize: 16,
    width: 24,
  },
  thumbnailLarge: {
    width: 100,
    height: 100,
  },
  missingThumbnail: {
    width: 75,
    height: 75,
    marginLeft: 8,
    backgroundColor: '#C0C0C0'
  },
  listView: {
    backgroundColor: '#FFFFFF',
  },
  largeIcon: {
    width: 45,
    height: 45,
    marginLeft: 8,
  },
  moreHolder: {
    alignSelf: "flex-end",
  },
  moreIcon: {
    height: 24,
    width: 24,
  },
  sectionButtons: {
    flexDirection: "row",
  },
});

module.exports = AlbumTracks;
