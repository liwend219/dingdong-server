var mongoose = require('mongoose');

var kittySchema = mongoose.Schema({
    eMail:String,
    msg:String,
})

kittySchema.statics.speakStatic = function () {
	console.log("我是静态方法哦");
}

kittySchema.methods.speakMethod = function () {
	console.log("我是对象方法哦");
}


var Kitten = mongoose.model('emailMsg', kittySchema)

module.exports = {
	create:function (data,callback){
		Kitten.create(data,callback)
	},
	remove:function (jsonCX,jsonTJ,callback){
		Kitten.remove(jsonCX,jsonTJ,callback)
	},
	find:function (json,callback){
		Kitten.find(json,callback)
	},
	update:function (jsonCX,jsonXG,callback) {
		Kitten.update(jsonCX,jsonXG,callback)
	},
}


// module.exports = fun
