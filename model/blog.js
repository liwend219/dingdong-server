var mongoose = require('mongoose');

var kittySchema = mongoose.Schema({
    title:String,
	date:String,
	body:String,
	Summary:String,
	author:String,
	pic:String,
	comment:[{author:String,body:String,date:String}]
})
kittySchema.statics.speakStatic = function () {
	console.log("我是静态方法哦");
}

kittySchema.methods.speakMethod = function () {
	console.log("我是对象方法哦");
}




module.exports = {
	create:function (ification,data,callback){
		var Kitten = mongoose.model(ification, kittySchema)
		Kitten.create(data,callback)
	},
	remove:function (ification,jsonCX,jsonTJ){
		Kitten.remove(jsonCX,jsonTJ,function (err,result){
			var Kitten = mongoose.model(ification, kittySchema)
			if(err){
				console.log(err)
				return
			}
			console.log("删除成功")
			console.log(result)
		})
	},
	find:function (ification,json,callback){
		var Kitten = mongoose.model(ification, kittySchema)
		Kitten.find(json,callback)
	},
	update:function (ification,jsonCX,jsonXG,jsonTJ) {
		var Kitten = mongoose.model(ification, kittySchema)
		Kitten.update(jsonCX,jsonXG,jsonTJ,function (err,result){
			if(err){
				console.log("err")
				return
			}
			console.log("修改成功")
			console.log(result)
		})
	},
}
