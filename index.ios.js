/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var BACKEND = require("./libraries/config").BACKEND;

var React = require('react-native');
var CategoryStore = require('./libraries/category')
var Icon = require('FAKIconImage');
var EqIcon = require('./views/EqIcon')
var renderer = require("./libraries/renderer")
var {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  ListView,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  View,
  NavigatorIOS
} = React;

var TableWidthIndex = require("./views/JumpTable")

var NowPlaying = React.createClass({
  render: function(){
    return (
      <View>  
        <Text>Render Now playing</Text>
      </View>
    )
  }
})

var AlbumView = React.createClass({
  getInitialState: function(){
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (sec1, sec2) => sec1 !== sec2
      }),
      loaded: false,
      animation: true,
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
  // componentWillUnmount: function(){
  //   renderer.removeListener("TransportState",this.updateTrack);
  // },
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
              <Text style={styles.title}>{track.Title}</Text>
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
          <TouchableOpacity onPress={()=> this.pressIcon(sectionID)}>
            <Icon
              name='foundation|play-circle'
              size={45}
              color='#AB3C3C'
              style={styles.largeIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  },
  renderLoading: function(){
    return (
      <View style={styles.container}>
        <Text>
          Loading Artists...
        </Text>
      </View>
    );
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
          initialListSize={150}
          style={styles.listView}
        />
      </View>
    );
  }


})

var CategoryView = React.createClass({
  getInitialState: function(){
    return {
      loaded: false
    };
  },
  genDataBlob: function(artists){
    var blob = {};

    artists.forEach( (a)=>{
      var path =  /[^/]+[.]jpeg[.]jpg$/.exec(a.thumb) || ["default-artist.png"],
          url =  BACKEND+"/images/cache/"+path,
          letter = a.Artist.toUpperCase()[0]


      a.imageUrl = url

      if(!blob[letter]){
        blob[letter] = [];
      }

      blob[letter].push(a)
    })
    return blob;
  },
  fetchData: function(){
    CategoryStore.getCategory(this.props.category,this.props.filter)
    .then((artists)=>{
      this.setState({
        artists: artists,
        loaded: true,
        dataBlob: this.genDataBlob(artists)
      });
    })
    .catch((e)=>{
      this.setState({
        loaded: true,
        error: e.message
      })
    });
  },
  componentDidMount: function(){
    this.fetchData();
  },
  _pressRow: function(e){
    var artist = e.nativeEvent.rowData.Artist;
    this.props.navigator.push({
      title: artist,
      component: AlbumView,
      passProps: {filter: {Artist: artist}, category: "Album"}
    })
  },
  renderError: function(){
    return (
      <View style={styles.container}>
        <Text>
          Error: {this.state.error}
        </Text>
      </View>
    )
  },
  renderLoading: function(){
    return (
      <View style={styles.container}>
        <Text>
          Loading Artists...
        </Text>
      </View>
    );
  },
  render: function() {
    if(!this.state.loaded){
      return this.renderLoading();
    }

    if(this.state.error){
      return this.renderError();
    }

    return (
      <View style={styles.listContainer}>
        <TableWidthIndex 
          dataBlob={this.state.dataBlob} 
          style={styles.table} 
          onSelectionChange={this._pressRow}
        />
      </View>
    );
  }
});

var nativeWu = React.createClass({
  _pressNowPlaying: function(){
    this.refs.navigator.push({
      title: "Now Playing",
      component: NowPlaying
    })
  },
  render: function(){
    return (
      <NavigatorIOS
        ref="navigator"
        style={styles.listContainer}
        tintColor="#AB3C3C"
        initialRoute={{
          title: 'Artist',
          component: CategoryView,
          rightButtonTitle: "Now Playing",
          onRightButtonPress: this._pressNowPlaying,
          passProps: {category: "Artist"}
        }}
      />
    )
  }
})

var styles = StyleSheet.create({
  table: {
    marginTop: 70,
    flex: 1,
  },
  listContainer: {
    flex: 1
  },
  smallPadding: {
    padding: 8
  },
  largeWidthPadding: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8
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
  container: {
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
  },
  rightContainer: {
    flex: 1,
  },
  eqIcon: {
    marginRight: 8
  },
  title: {
    fontSize: 16,
    marginLeft: 16,
    fontWeight: "600",
    textAlign: 'left',
  },
  trackNumber: {
    fontSize: 16,
    width: 24,
  },
  year: {
    textAlign: 'center',
  },
  thumbnailLarge: {
    width: 100,
    height: 100,
  },
  thumbnail: {
    width: 75,
    height: 75,
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
  searchTextInput: {
    backgroundColor: 'white',
    borderColor: '#cccccc',
    borderRadius: 3,
    borderWidth: 1,
    height: 30,
    paddingLeft: 8,
  },
  largeIcon: {
    width: 45,
    height: 45,
    marginLeft: 8,
  },
});

AppRegistry.registerComponent('nativeWu', () => nativeWu);
