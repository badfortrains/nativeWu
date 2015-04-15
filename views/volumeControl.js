var React = require('react-native');
var renderer = require("../libraries/renderer")

var {
  StyleSheet,
  View,
  SliderIOS,
  Text,
  TouchableOpacity,
} = React;

var VolumeControl = React.createClass({
  getInitialState: function(){
    return {
      avrState: renderer.avrState || {},
      updating: false,
    }
  },
  componentDidMount: function(){
    renderer.addListener("avrStateChange",this.updateAvrState);
  },
  componentWillUnmount: function(){
    renderer.removeListener("avrStateChange",this.updateAvrState);
  },
  updateAvrState: function(state){
    if(!this.state.updating){
      this.setState({avrState: state})
    }
  },
  onSlidingComplete: function(){
    this.setState({
      updating: false
    })
  },
  setVolume: function(cmd,vol){
    if(!this.state.updating){
      this.setState({updating: true})
    }
    renderer.sendAvrCommand(cmd,Math.floor(vol*70))
  },
  togglePower: function(zoneCmd){
    renderer.sendAvrCommand(zoneCmd)
  },
  render: function(){
    var z1Power = this.state.avrState.z1Power,
        z2Power = this.state.avrState.z2Power;

    return (
      <View style={styles.sliderHolder}>
        <View style={styles.sliderRow}>
          <TouchableOpacity onPress={()=> this.togglePower("z2Power")}>
            <Text style={[styles.power,z1Power ? styles.poweredOn : null]}>Zone 1</Text>
          </TouchableOpacity>
          <SliderIOS  style={styles.slider}
                      value={this.state.avrState.z1Volume / 70}
                      onValueChange={this.setVolume.bind(null,"z1Volume")}/>
        </View>
        <View style={styles.sliderRow}>
          <TouchableOpacity onPress={()=> this.togglePower("z2Power")}>
            <Text style={[styles.power,z2Power ? styles.poweredOn : null]}>Zone 2</Text>
          </TouchableOpacity>
          <SliderIOS  style={styles.slider}
                      value={this.state.avrState.z2Volume / 70}
                      onValueChange={this.setVolume.bind(null,"z2Volume")}/>
        </View>
      </View>
    )
  }
})

var styles = StyleSheet.create({
  sliderHolder: {
    flexDirection: "column",
    marginTop: 16,
  },
  sliderRow: {
    flexDirection: "row"
  },
  slider: {
    width: 200,
    height: 40,
  },
  poweredOn: {
    color: "#AB3C3C"
  },
  power: {
    alignSelf: "center",
    marginRight: 16,
  }
 })

module.exports = VolumeControl;
