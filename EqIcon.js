

'use strict';

var NativeMethodsMixin = require('NativeMethodsMixin');
var PropTypes = require('ReactPropTypes');
var React = require('React');
var ReactIOSViewAttributes = require('ReactIOSViewAttributes');
var StyleSheet = require('StyleSheet');
var View = require('View');

var createReactIOSNativeComponentClass = require('createReactIOSNativeComponentClass');
var merge = require('merge');




var EqIcon = React.createClass({
  mixins: [NativeMethodsMixin],
  getDefaultProps: function(){
    return {
      enableAnimation: false,
      barColor: "rgb(0,0,250)",
    }
  },
  render: function() {
    return (
      <RCTSegmentedControl
        style={[styles.eqIcon,this.props.style]}
        enableAnimation={this.props.enableAnimation}
        barColor={this.props.barColor}
      />
    );
  }
});


var styles = StyleSheet.create({
  eqIcon: {
    width: 16,
    height: 16,
  },
});

var attributes = merge(ReactIOSViewAttributes.UIView, {
  enableAnimation: true,
  barColor: true
});


var RCTSegmentedControl = createReactIOSNativeComponentClass({
  validAttributes: attributes,
  uiViewClassName: 'EqView',
});

module.exports = EqIcon;