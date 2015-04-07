/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var BACKEND = "http://localhost:4000";

var React = require('react-native');
var CategoryStore = require('./category')
var {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  ListView,
  TouchableHighlight,
  TextInput,
  View,
  NavigatorIOS
} = React;

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
      console.log("artists",artists)
      this.setState({
        artists: artists,
        dataSource: this.state.dataSource.cloneWithRows(artists),
        loaded: true,
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
  _pressRow: function(artist){
    this.props.navigator.push({
      title: artist,
      component: AlbumView,
      passProps: {filter: {Artist: artist}, category: "Album"}
    })
  },
  renderArtist: function(artist, sectionID, rowID){
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
  _search: function(text) {
    var regex = new RegExp(text, 'i');
    var filter = (row) => regex.test(row.Artist);

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.state.artists.filter(filter))
    });
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
        <View style={styles.searchRow}>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="always"
            onChangeText={this._search.bind(this)}
            placeholder="Search..."
            style={styles.searchTextInput}
          />
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderArtist}
          pageSize={50}
          onEndReachedThreshold={200}
          initialListSize={150}
          style={styles.listView}
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
  searchRow: {
    backgroundColor: '#eeeeee',
    paddingTop: 75,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  searchTextInput: {
    backgroundColor: 'white',
    borderColor: '#cccccc',
    borderRadius: 3,
    borderWidth: 1,
    height: 30,
    paddingLeft: 8,
  },
});

AppRegistry.registerComponent('nativeWu', () => nativeWu);
