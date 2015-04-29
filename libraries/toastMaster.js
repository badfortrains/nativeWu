var EventEmitter = require("wolfy87-eventemitter");

var RendererStore = Object.assign(new EventEmitter(),{
	_queue: [],
	_timer: null,
	_removeCurrent: function(){
		this._queue.shift();
		if(this._queue[0]){
			this._timer = setTimeout(this._removeCurrent.bind(this),2000)	
		}else{
			this._timer = null;
		}
		this.emit("update");
	},
	_queueUpdate: function(){
		if(!this._timer){
			this._timer = setTimeout(this._removeCurrent.bind(this),2000)
			this.emit("update");
		}
	},
	getMessage: function(){
		return this._queue[0];
	},
	message: function(text){
		this._queue.push(text);
		this._queueUpdate();
	},
});


module.exports = RendererStore;
