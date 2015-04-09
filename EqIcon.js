

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
      enableAnimation: true
    }
  },
  render: function() {
    return (
      <RCTSegmentedControl
        style={styles.eqIcon}
        enableAnimation={this.props.enableAnimation}
      />
    );
  }
});


var styles = StyleSheet.create({
  eqIcon: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "black",
  },
});

var attributes = merge(ReactIOSViewAttributes.UIView, {
  enableAnimation: true
});


var RCTSegmentedControl = createReactIOSNativeComponentClass({
  validAttributes: attributes,
  uiViewClassName: 'EqView',
});

module.exports = EqIcon;