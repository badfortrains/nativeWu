/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var BACKEND = "http://192.168.1.129:4000";

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


var AlbumView = React.createClass({
  getInitialState: function(){
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (sec1, sec2) => sec1 !== sec2
      }),
      loaded: false
    }; 
  },
  fetchData: function(){
    CategoryStore.getCategory("Album",this.props.filter)
    .then((albumTracks)=>{
      this.setState({
        images: albumTracks.images,
        dataSource: this.state.dataSource.cloneWithRowsAndSections(albumTracks.tracks),
        loaded: true,
      });
    })
    .done();
  },
  componentDidMount: function(){
    this.fetchData();
  },
  renderTrack: function(track, sectionID, rowID){
    return(
      <TouchableHighlight>
        <View style={styles.container}>
          <Text style={styles.title}>{track.Title}</Text>
        </View>
      </TouchableHighlight>
    )
  },
  renderSection: function(sectionData,sectionID){
    // return (
    //   <View style={styles.sectionHeader}>
    //     <Text style={styles.sectionTitle}>{sectionID}</Text>
    //   </View>
    // )

    var images = (this.state.images || []).filter(i => i.album == sectionID);
    var url;
    if(images[0])
      url = images[0].url;

    return(
      <View style={styles.container}>
        {url ? 
          <Image
            source={{uri: url}}
            style={styles.thumbnail}
          />
          :
          <View style={styles.missingThumbnail}></View>
        }
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{sectionID}</Text>
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
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false
    };
  },
  fetchData: function(){
    CategoryStore.getCategory(this.props.category,this.props.filter)
    .then((artists)=>{
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
  _pressRow: function(artist){
    this.props.navigator.push({
      title: artist,
      component: AlbumView,
      passProps: {filter: {Artist: artist}, category: "Album"}
    })
  },
  renderArtist: function(artist, sectionID, rowID){
    // return(
    //   <TouchableHighlight onPress={() => this._pressRow(artist.Artist)}>
    //     <View style={styles.container} onClick={this.rowClick}>
    //       <Text style={styles.title}>{artist.Artist}</Text>
    //     </View>
    //   </TouchableHighlight>
    // )
    var path =  /[^/]+[.]jpeg[.]jpg$/.exec(artist.thumb) || ["default-artist.png"],
        url =  BACKEND+"/images/cache/"+path;
    return(
      <TouchableHighlight onPress={() => this._pressRow(artist.Artist)}>
        <View style={styles.container}>
          <Image
            source={{uri: url}}
            style={styles.thumbnail}
          />
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{artist.Artist}</Text>
          </View>
        </View>
      </TouchableHighlight>
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
  sectionTitle: {
    fontSize: 25
  },
  sectionHeader: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#000000'
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
    marginLeft: 16,
    textAlign: 'left',
  },
  year: {
    textAlign: 'center',
  },
  thumbnail: {
    width: 75,
    height: 75,
    marginLeft: 8
  },
  missingThumbnail: {
    width: 75,
    height: 75,
    marginLeft: 8,
    backgroundColor: '#C0C0C0'
  },
  listView: {
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('nativeWu', () => nativeWu);
