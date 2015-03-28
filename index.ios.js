/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var CategoryStore = require('./category')
var {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  ListView,
  View,
} = React;

var nativeWu = React.createClass({
  getInitialState: function(){
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false
    };
  },
  fetchData: function(){
    CategoryStore.getCategory("Artist")
    .then((artists)=>{
      console.log(artists)
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(artists),
        loaded: true,
      });
    })
    .done();
  },
  componentDidMount: function(){
    this.fetchData();
  },
  renderArtist: function(artist){
    return(
       <View style={styles.container}>
        <Text style={styles.title}>{artist}</Text>
       </View>
    )
    // return(
    //   <View style={styles.container}>
    //     <Image
    //       source={{uri: "http://resizing.flixster.com/ejBKOxK_lsUDmuR2iOqnTHEDoe8=/175x270/dkpu1ddg7pbsk.cloudfront.net/movie/11/18/90/11189059_ori.jpg"}}
    //       style={styles.thumbnail}
    //     />
    //     <View style={styles.rightContainer}>
    //       <Text style={styles.title}>{artist}</Text>
    //       <Text style={styles.year}>{2012}</Text>
    //     </View>
    //   </View>
    // )

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
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderArtist}
        pageSize={50}
        initialListSize={this.state.dataSource.getRowCount()}
        style={styles.listView}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('nativeWu', () => nativeWu);
