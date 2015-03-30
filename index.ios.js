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
  TouchableHighlight,
  View,
  NavigatorIOS
} = React;

var CategoryView = React.createClass({
  getInitialState: function(){
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false
    };
  },
  fetchData: function(){
    CategoryStore.getCategory(this.props.category,this.props.filter)
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
  rowClick: function(e){
    console.log("row clicked")
  },
  _pressRow: function(artist){
    this.props.navigator.push({
      title: artist,
      component: CategoryView,
      passProps: {filter: {Artist: artist}, category: "Album"}
    })
  },
  renderArtist: function(artist, sectionID, rowID){
    return(
      <TouchableHighlight onPress={() => this._pressRow(artist)}>
        <View style={styles.container} onClick={this.rowClick}>
          <Text style={styles.title}>{artist}</Text>
        </View>
      </TouchableHighlight>
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
      <View style={styles.listContainer}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderArtist}
          pageSize={50}
          initialListSize={150}
          style={styles.listView}
        />
      </View>
    );
  }
});

var nativeWu = React.createClass({
  render: function(){
    return (
      <NavigatorIOS
        style={styles.listContainer}
        initialRoute={{
          title: 'Artist',
          component: CategoryView,
          passProps: {category: "Artist"}
        }}
      />
    )
  }
})

var styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    paddingLeft: 8,
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
