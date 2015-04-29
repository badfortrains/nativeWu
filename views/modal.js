

var React = require('react-native');
var renderer = require("../libraries/renderer")

var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableWithoutFeedback,
} = React;


var NavigatorSceneConfigs = require('NavigatorSceneConfigs');
var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;


var Dimensions = require('Dimensions');
var PixelRatio = require('PixelRatio');

var buildStyleInterpolator = require('buildStyleInterpolator');
var ToTheLeft = {
  transformTranslate: {
    from: {x: 0, y: 0, z: 0},
    to: {x: -100, y: 100, z: 0},
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
  opacity: {
    value: 1.0,
    type: 'constant',
  },
};

var ToTheRight = {
  transformTranslate: {
    from: {x: 0, y: 0, z: 0},
    to: {x: 200, y: 100, z: 0},
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
  opacity: {
    value: 1.0,
    type: 'constant',
  },
};



var Modal = React.createClass({
	ANIMATION_DURATION: 100,
	ANIMATION_LEFT: buildStyleInterpolator(ToTheLeft),
	ANIMATION_RIGHT: buildStyleInterpolator(ToTheRight),
	positionPopup: function(){
		var pos = this.props.position,
			top = pos.top + 100 > DeviceHeight ? DeviceHeight - 100 : pos.top,
			style = {
				top: top,
			};

		if(pos.left < DeviceWidth / 2){
			style.left = pos.left;
		}else{
			style.right = DeviceWidth - pos.left;
		}


		return style;
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
	animate: function(){
		var styleToUse = {}
		var progress = Math.min((Date.now() - this.startTime) / this.ANIMATION_DURATION,1);
		this.animation(styleToUse,progress);
		this.refs.container.setNativeProps(styleToUse);
		this.refs.overlay.setNativeProps({opacity: progress})
		if(progress < 1)
			window.requestAnimationFrame(this.animate);

	},
	componentDidMount: function(){
		this.startTime = Date.now();
		var pos = this.props.position;
		if(pos.left < DeviceWidth / 2){
			this.animation = this.ANIMATION_RIGHT
		}else{
			this.animation = this.ANIMATION_LEFT
		}
		window.requestAnimationFrame(this.animate);
	},
	render: function(){
		var positionStyle = this.positionPopup(),
			popupStyle = positionStyle.left ? styles.popupLeft : styles.popupRight;
		return (
			<TouchableWithoutFeedback onPress={this.close}>
				<View ref="overlay" style={styles.overlay}> 
					<View style={[styles.overflowContainer,positionStyle]}>
						<View  ref="container" style={[styles.popup, popupStyle]}>
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
		opacity: 0,
		backgroundColor: "rgba(0,0,0,0.3)"
	},
	overflowContainer: {
		width: 200,
		height: 200,
		position: "absolute",
		right: 48,
		top: 100,
		borderRadius: 3,
		overflow: "hidden",
	},
	popup: {
		width: 200,
		position: "absolute",
		top: -100,
		backgroundColor: "white",
	},
	popupLeft:{
		left: -200,
	},
	popupRight: {
		right: -100,
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
