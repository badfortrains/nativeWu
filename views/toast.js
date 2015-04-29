var React = require('react-native');
var toastMaster = require("../libraries/toastMaster");

var {
	View,
	Text,
} = React;

var Toast = React.createClass({
	getInitialState: function(){
		return {
			message: null
		}
	},
	getMessage: function(m){
		this.setState({
			message: toastMaster.getMessage()
		})
	},
	componentDidMount: function(){
		toastMaster.on("update",this.getMessage);
	},
	renderMessage: function(m){
		return (
			<View style={styles.toast}>
				<Text style={styles.toastText}>{m}</Text>
			</View>
		)
	},
	render: function(){
		return (
			<View>
				{
					this.state.message ? 
					this.renderMessage(this.state.message)
					:
					null
				}

			</View>
		)
	}
})

var styles = {
	toast: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "black",
	},
	toastText: {
		fontSize: 16,
		padding: 16,
		color: "white",
	}
}

module.exports = Toast;
