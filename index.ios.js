/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  View,
} = React;
var CategoryView = require("./views/categoryView")
var NowPlaying = require("./views/nowPlaying")
var Playlist = require("./views/playlist")
var Toast = require("./views/toast")
var toastMaster = require('./libraries/toastMaster')

var nativeWu = React.createClass({
  _pressQueue: function(){
    this.refs.navigator.push({
      title: "Queue",
      component: Playlist,
    })   
  },
  _pressNowPlaying: function(){
    this.refs.navigator.push({
      title: "Now Playing",
      component: NowPlaying,
      rightButtonTitle: "Queue",
      onRightButtonPress: this._pressQueue
    })
  },
  render: function(){
    return (
      <View style={styles.listContainer}>
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
        <Toast></Toast>
      </View>
    )
  }
})

var styles = StyleSheet.create({
  listContainer: {
    flex: 1
  }
});

AppRegistry.registerComponent('nativeWu', () => nativeWu);
