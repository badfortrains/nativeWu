/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var CategoryStore = require("./category")
var {
  AppRegistry,
  StyleSheet,
  Text,
  ListView,
  View,
} = React;

var nativeWu = React.createClass({
  getInitialState: function(){
    return {
      loaded: false
    }
  },  
  componentDidMount: function(){
    CategoryStore.getCategory("Artist")
    .then((artists)=>{
      this.setState({
        artists: artists,
        loaded: true
      })
    })
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
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js{'\n'}
          Press Cmd+R to reload
        </Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
  },
});

AppRegistry.registerComponent('nativeWu', () => nativeWu);
