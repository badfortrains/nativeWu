var BACKEND = require("../libraries/config").BACKEND;
var React = require('react-native');
var renderer = require("../libraries/renderer")
var Icon = require('FAKIconImage');
var VolumeControl = require("./volumeControl")
var Dimensions = require("Dimensions")

var {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
} = React;

var NowPlaying = React.createClass({
	updateTrack: function(track,state){
    this.setState({
      track: track,
      TransportState: state
    })
  },
  getInitialState: function(){
    return {
      track: renderer.playerState.currentPlayingTrack,
      TransportState: renderer.playerState.TransportState,
    }
  },
  componentDidMount: function(){
    renderer.addListener("TransportState",this.updateTrack);
  },
  componentWillUnmount: function(){
    renderer.removeListener("TransportState",this.updateTrack);
  },
  renderNoTrack: function(){
    return (
      <View style={styles.containerCenter}>  
        <Text>No track playing</Text>
      </View>
    )
  },
  getBestImage: function(){
    var images = this.state.track.images || [],
        megaImages = images.filter( (i) => i.size == "mega" ),
        imageObj = megaImages[0] || images[0];


    return imageObj ? (BACKEND + "/images/cache/albums/" + imageObj.filename) : null;
  },
  pressIcon: function(name){
    if(name == "play"){
      renderer.togglePlay();
    }else if(name == "next"){
      renderer.playNext();
    }
  },
  render: function(){
    if(!this.state.track)
      return this.renderNoTrack();

    var imageUrl = this.getBestImage(),
        track = this.state.track,
        width = Dimensions.get("window").width - 16,
        height = Dimensions.get("window").height;

    return (
      <View style={styles.playingContainer}> 
        { imageUrl && height > 400 ?
          <Image source={{uri: imageUrl}} 
                  style={[styles.flex1,{
                    alignSelf: "center",
                    width: Math.min(width,400),
                    height: Math.min(width,400),
                  }]} 
          />
          :
          <View style={[styles.placeholder,styles.flex1]}></View>
        }
        <View style={[styles.flex1,styles.detailSection]}>
          <Text style={styles.title}>{track.Title}</Text>
          <Text style={styles.info}>{track.Artist} - {track.Album}</Text>
          <View style={styles.IconHolder}>
            <TouchableOpacity onPress={()=> this.pressIcon("previous")}>
              <Icon
                name='foundation|rewind'
                size={30}
                style={styles.largeIcon}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.pressIcon("play")}>
              <Icon
                name={this.state.TransportState == "PLAYING" ? 'foundation|pause' : 'foundation|play'}
                size={30}
                style={styles.largeIcon}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.pressIcon("next")}>
              <Icon
                name='foundation|fast-forward'
                size={30}
                style={styles.largeIcon}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <VolumeControl />
        </View>
      </View>
    )
  }
})

var styles = StyleSheet.create({
  containerCenter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: '#FFFFFF',
  },
  playingContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: 70,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
  },
  flex1: {
    flex: 1,
  },
  albumArt: {

  },
  placeholder: {
    backgroundColor: "#C0C0C0",
  },
  detailSection: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title:{
    marginTop: 16,
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
  info: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  IconHolder: {
    flexDirection: "row",
    marginTop: 16
  },
  largeIcon: {
    width: 30,
    height: 30,
    marginLeft: 16,
    marginRight: 16,
  },
 })

module.exports = NowPlaying;