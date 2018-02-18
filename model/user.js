var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	eMail:String,
	userName:String,
	passWord:String,
	diary:[{date:String,body:String}],
})
// var diarySchema = mongoose.Schema({
// 	date:String,
// 	body:String,
// })

userSchema.statics.speakStatic = function () {
	console.log("我是静态方法哦");
}

userSchema.methods.speakMethod = function () {
	console.log("我是对象方法哦");
}


var Kitten = mongoose.model('user', userSchema)

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
