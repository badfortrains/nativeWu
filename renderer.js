var io = require("./socket.io-client");
var EventEmitter = require("EventEmitter");

var serializeFilter = function(obj){
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent("filter["+p+"]") + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

var RendererStore = Object.assign(new EventEmitter(),{
	connect: function(){
		this.socket = io('http://localhost:4000/controller',{jsonp: false});

	    this.socket.on("setRendererResult",(err,uuid)=>{
	      if(err){
	      	console.log("set renderer error",err)
	      }else{
	      	this.playerState = {};
	      	this.currentRenderer = {}
	      	this.uuid = uuid;
	      	this._getRendererInfo(uuid)
	      }
	    })

	    this.socket.on("stateChange",(event)=>{
      		this.playerState[event.name] = event.value;
      		if(event.name == "currentPlayingTrack" || event.name == "TransportState"){
      			this.emit("TransportState",this.playerState.currentPlayingTrack,this.playerState.TransportState)
      		}
    	});
	},
	playAlbumTracks: function(artist,album,trackNumber,id){
		var uuid = this.uuid,
			filter = {
				Artist: artist,
				Album: album,
				TrackNumberGT: trackNumber,
			}

		if(!uuid){
			return Promise.reject(new Error("No renderer selected"));
		}else{
			return (
				fetch("http://localhost:4000/api/renderers/"+uuid+"/playNow",{
					method: "post",
					body: serializeFilter(filter),
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
				})
				.then((res) =>  res.json())
				.then((info) => console.log("got info",info))
				.catch((err)=> console.log("play album err",err))
				.done()
			)
		}
	},
	playerState: {},
	currentRenderer: {},
	_getRendererInfo: function(uuid){
		console.log("GET UUID","http://wupnp.com/api/renderers/"+uuid)
		fetch("http://localhost:4000/api/renderers/"+uuid)
		.then((res) =>  res.json())
		.then((info) => this.currentRenderer = info)
		.catch((err) => console.log("ERR",err));
	}
})

RendererStore.connect();

module.exports = RendererStore;


