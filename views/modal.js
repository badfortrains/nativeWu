

var React = require('react-native');
var renderer = require("../libraries/renderer")

var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableWithoutFeedback,
} = React;

var DeviceHeight = require('Dimensions').get('window').height;

var Modal = React.createClass({
	positionPopup: function(){
		return {
			top: this.props.top + 100 > DeviceHeight ? DeviceHeight - 100 : this.props.top
		}
	},
	playNext: function(){
		renderer.queueNext(this.props.filter);
		this.close();
	},
	addToQueue: function(){
		renderer.addToQueue(this.props.filter);
		this.close();
	},
	close: function(){
		this.props.onClose();
	},
	render: function(){
		return (
			<TouchableWithoutFeedback onPress={this.close}>
				<View style={styles.overlay}> 
					<View  ref="container" style={[styles.popup,this.positionPopup()]}>
						<TouchableHighlight onPress={this.playNext}>
							<View style={[styles.optionDivider,styles.bgWhite]}>
									<Text style={styles.option}>Play next</Text>
							</View>
						</TouchableHighlight>
						<TouchableHighlight onPress={this.addToQueue}>
							<View style={styles.bgWhite}>
								<Text style={styles.option}>Add to queue</Text>
							</View>
						</TouchableHighlight>
					</View>
				</View>
			</TouchableWithoutFeedback>
		)
	}
})

var styles = StyleSheet.create({
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0.3)"
	},
	popup: {
		width: 200,
		position: "absolute",
		right: 48,
		top: 100,
		backgroundColor: "white",
		borderRadius: 3,
		overflow: "hidden",
	},
	optionDivider: {
		borderBottomWidth: 1,
		borderColor: "rgba(0,0,0,0.2)",
	},
	option: {
		fontSize: 16,
		padding: 8,
		backgroundColor: "white",
	},
	bgWhite: {
		backgroundColor: "white",
	}
})

module.exports = Modal;
