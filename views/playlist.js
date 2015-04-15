var BACKEND = require("../libraries/config").BACKEND;

var React = require('react-native');
var CategoryStore = require('../libraries/category')
var renderer = require("../libraries/renderer")
var EqIcon = require('./EqIcon')
var Icon = require('FAKIconImage');

var {
  StyleSheet,
  Text,
  Image,
  ListView,
  TouchableHighlight,
  TouchableOpacity,
  View,
} = React;

var Playlist = React.createClass({
  getInitialState: function(){
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
      animation: true,
    }; 
  },
  fetchData: function(){
    CategoryStore.getPlaylist(renderer.playerState.quickList)
    .then((list)=>{
      this.setState({
        tracks: list,
      }, ()=>{
        this.updateTrack(renderer.playerState.currentPlayingTrack,
                          renderer.playerState.TransportState,
                          true)
      })
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
        position = track ? track.position : null
        newTracks = this.state.tracks.map((t)=>{
          if(t._id == id && t.position == position){
            return Object.assign({
              nowPlaying: true,
              animate: trackState == "PLAYING"
            },t)
          }else{
            return t;
          }
        })

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(newTracks),
      loaded: true,
    })
  },
  pressTrack: function(sectionID,rowID, id){
    renderer.playPlaylistTrack(this.state.tracks[rowID].id,
                                renderer.playerState.quickList)
    this.updateTrack(this.state.tracks[rowID],"LOADING")
  },
  renderTrack: function(track, sectionID, rowID){
    var url = url = BACKEND + "/images/cache/albums/" + track.filename;
    return(
        <TouchableHighlight onPress={() => this.pressTrack(sectionID, rowID, track._id)}>
          <View style={styles.trackRowContainer}>
            <View style={styles.trackRow}>
              {
                track.nowPlaying ?
                <EqIcon style={styles.eqIcon} enableAnimation={track.animate} barColor="#AB3C3C"/>
                :
                <Text style={styles.trackNumber}>{track.position+1}</Text>
              }
              <Text numberOfLines={1} style={styles.title}>{track.Title}</Text>
            </View>
            {track.filename ? 
              <Image
                source={{uri: url}}
                style={styles.thumbnail}
              />
              :
              null
            }
          </View>
        </TouchableHighlight>
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
  render: function() {
    if(!this.state.loaded)
      return this.renderLoading();

    return (
      <View style={styles.listContainer}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderTrack}
          pageSize={50}
          initialListSize={150}
          style={styles.listView}
        />
      </View>
    );
  }
})

var styles = StyleSheet.create({
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
    flexDirection: "row",
  },
  trackRow: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    flex: 1,
    paddingBottom: 8,
    paddingTop: 8,
    flexDirection: "row",
  },
  rightContainer: {
    flex: 1,
  },
  eqIcon: {
    marginRight: 8
  },
  title: {
    flex: 1,
    fontSize: 13,
    marginLeft: 16,
    fontWeight: "600",
    textAlign: 'left',
    overflow: "hidden",
  },
  trackNumber: {
    fontSize: 16,
    width: 24,
  },
  listView: {
    backgroundColor: '#FFFFFF',
  },
  largeIcon: {
    width: 45,
    height: 45,
    marginLeft: 8,
  },
  thumbnail: {
    width: 32,
    height: 32,
    alignSelf: "center",
  }
});

module.exports = Playlist;
