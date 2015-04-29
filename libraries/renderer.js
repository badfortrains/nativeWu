var io = require("../vendor/socket.io-client");
var EventEmitter = require("wolfy87-eventemitter");
var BACKEND = require("./config").BACKEND;
var AppStateIOS = require('react-native').AppStateIOS;
var _ = require("underscore")
var toastMaster = require("./toastMaster")

var serializeFilter = function(obj){
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent("filter["+p+"]") + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

var RendererStore = Object.assign(new EventEmitter(),{
	playerState: {},
	currentAppState: "active",
	connect: function(){
		this.socket = io(BACKEND+'/controller',{jsonp: false});

	    this.socket.on("setRendererResult",(err,uuid)=>{
	      if(err){
	      	console.log("set renderer error",err)
	      }else{
	      	this.playerState = {};
	      	this.uuid = uuid;
	      	this._getRendererInfo(uuid)
	      }
	    })

	    window.io = this.socket;
	    this.socket.on("stateChange",(event)=>{
      		this.playerState[event.name] = event.value;
      		if(event.name == "currentPlayingTrack" || event.name == "TransportState"){
      			console.log(event)
      			this.emit("TransportState",this.playerState.currentPlayingTrack,this.playerState.TransportState)
      		}
    	});

    	this.socket.on("avrStateChange",(state)=>{
    		this.avrState = state;
    		this.emit("avrStateChange",state)
    	})

    	this.socket.emit("avrState")

    	AppStateIOS.addEventListener('change', this._handleStateChange.bind(this));
	},
	_play: function(filter,verb){
		var uuid = this.uuid;

		if(!uuid){
			return Promise.reject(new Error("No renderer selected"));
		}else{
			return (
				fetch(BACKEND+"/api/renderers/"+uuid+"/"+verb,{
					method: "put",
					body: serializeFilter(filter),
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
				})
				.then((res) =>  res.json())
				.then((info) =>{
					toastMaster.message(info.added +' tracks added to queue')
					return info;
				})
				.catch((err)=> console.log("play album err",err))
			)
		}
	},
	playAlbumTracks: function(artist,album,trackNumber,id){
		var filter = {
				Artist: artist,
				Album: album,
				TrackNumberGT: trackNumber,
			}

		return this._play(filter,"playNow");
	},
	queueNext: function(filter){
		return this._play(filter,"playNext");
	},
	addToQueue: function(filter){
		var url = BACKEND + "/api/playlists/" + this.playerState.quickList

		if(!this.playerState.quickList){
			return Promise.reject(new Error("No renderer selected"));
		}else{
			return fetch(url,{
				method: "put",
				body: serializeFilter(filter),
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
			})
			.then((res) => {
				return res.json()
			})
			.catch((err)=> console.log("play addToQueue err",err))
		}
	},
	togglePlay: function(){
		if(this.playerState.TransportState == "PLAYING")
			this.socket.emit("pause")
		else
			this.socket.emit("play")
	},
	playNext: function(){
		this.socket.emit("next")
	},
	currentTrackID: function(){
		return this.playerState.currentPlayingTrack ? this.playerState.currentPlayingTrack.id : null;
	},
	sendAvrCommand: function(command,arg){
		this.socket.emit("avrCommand",command,arg);
	},
	playPlaylistTrack: function(id,playlistID){
		this.socket.emit("playListTrack",id,playlistID);
	},
	_handleStateChange: function(currentAppState){
		console.log(currentAppState)
		console.log("socket is disconnected:" ,this.socket.disconnected)
		if(currentAppState == "active" && this.currentAppState != "active"){
			//back from background try to recconnect
			this.socket.connect();
		}else if(currentAppState == "background"){
			this.socket.disconnect();
		}
		this.currentAppState = currentAppState;

	},
	_getRendererInfo: function(uuid){
		console.log("GET UUID",BACKEND+"/api/renderers/"+uuid)
		fetch(BACKEND+"/api/renderers/"+uuid)
		.then((res) =>  res.json())
		.then((info) =>{
			if(info.currentPlayingTrack || this.playerState.TransportState != info.TransportState){
				this.playerState = info
				this.emit("TransportState",info.currentPlayingTrack,info.TransportState)
			}else{
				this.playerState = info
			}
		})
		.catch((err) => console.log("ERR",err));
	},
})

RendererStore.connect();

module.exports = RendererStore;


