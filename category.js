var fetch = require("node-fetch")

var BACKEND = "http://192.168.1.110:3000"

var serialize = function(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

var CategoryStore = {
	getCategory: function(category,filter){
		var url = BACKEND + "/api/categories/"+category

		if(filter){
			url += "?" + serialize(filter)
		}

		return fetch(url).then(res => {
			return res.json().docs;
		})
	}
} 

module.exports = CategoryStore;