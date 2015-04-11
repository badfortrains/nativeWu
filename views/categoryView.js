var BACKEND = require("../libraries/config").BACKEND;

var React = require('react-native');
var CategoryStore = require('../libraries/category')
var AlbumTracks  = require("./albumTracks")
var JumpTable = require("./JumpTable")
var {
  StyleSheet,
  Text,
  Image,
  View,
} = React;

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
      component: AlbumTracks,
      passProps: {filter: {Artist: artist}, category: "Album"}
    })
  },
  renderError: function(){
    return (
      <View style={styles.containerCenter}>
        <Text>
          Error: {this.state.error}
        </Text>
      </View>
    )
  },
  renderLoading: function(){
    return (
      <View style={styles.containerCenter}>
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
        <JumpTable 
          dataBlob={this.state.dataBlob} 
          style={styles.table} 
          onSelectionChange={this._pressRow}
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  table: {
    marginTop: 70,
    flex: 1,
  },
  listContainer: {
    flex: 1
  },
  containerCenter: {
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
});

module.exports = CategoryView;
