var BACKEND = "http://192.168.1.129:4000"

var serialize = function(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

var serializeFilter = function(obj){
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent("filter["+p+"]") + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

var CategoryStore = {
	getCategory: function(category,filter){
		var url = BACKEND + "/api/categories/details/"+category

		if(filter){
			url += "?" + serializeFilter(filter)
		}

		return fetch(url).then(res => {
			return res.json().then( d =>{ return d.docs });
		})
	}
} 




module.exports = CategoryStore;