'use strict';

var NativeMethodsMixin = require('NativeMethodsMixin');
var PropTypes = require('ReactPropTypes');
var React = require('React');
var ReactIOSViewAttributes = require('ReactIOSViewAttributes');
var StyleSheet = require('StyleSheet');
var View = require('View');

var createReactIOSNativeComponentClass = require('createReactIOSNativeComponentClass');
var merge = require('merge');




var TableWidthIndex = React.createClass({
  mixins: [NativeMethodsMixin],
  getDefaultProps: function(){
    return {
      dataBlob: {}  
    }
  },
  render: function() {
    return (
      <JumpTable
        style={this.props.style}
        dataBlob={this.props.dataBlob}
      />
    );
  }
});


// var styles = StyleSheet.create({
//   jump: {
//     width: 200,
//     height: 400,
//   },
// });

var attributes = merge(ReactIOSViewAttributes.UIView, {
  dataBlob: true
});


var JumpTable = createReactIOSNativeComponentClass({
  validAttributes: attributes,
  uiViewClassName: 'JumpTable',
});

module.exports = TableWidthIndex;