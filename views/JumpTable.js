'use strict';

var NativeMethodsMixin = require('NativeMethodsMixin');
var PropTypes = require('ReactPropTypes');
var React = require('React');
var ReactIOSViewAttributes = require('ReactIOSViewAttributes');
var StyleSheet = require('StyleSheet');
var View = require('View');

var createReactIOSNativeComponentClass = require('createReactIOSNativeComponentClass');
var merge = require('merge');

var deepDiffer = require('deepDiffer');




var TableWidthIndex = React.createClass({
  mixins: [NativeMethodsMixin],
  getDefaultProps: function(){
    return {
      dataBlob: {}  
    }
  },
  _onSelectionChange: function(e){
    this.props.onSelectionChange && this.props.onSelectionChange(e);
  },
  render: function() {
    return (
      <JumpTable
        style={this.props.style}
        dataBlob={this.props.dataBlob}
        onSelectionChange={this._onSelectionChange}
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
  dataBlob: {diff: deepDiffer}
});


var JumpTable = createReactIOSNativeComponentClass({
  validAttributes: attributes,
  uiViewClassName: 'JumpTable',
});

module.exports = TableWidthIndex;