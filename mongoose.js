
//引包，使用数据库
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
// 连接数据库
var db = mongoose.connection;
//是否连接成功
db.on('error', console.error.bind(console, 'connection error:'));
// 连接成功后回调
db.once('open', function () {
  console.log("连接成功")  //  2.执行
});

// 定义一个schema结构
var kittySchema = mongoose.Schema({
    name: String
})

//查询
kittySchema.methods.find = function (json,callback) {
	// var silence = new Kitten()
	this.model("test").find(json,callback)
}

//增加
kittySchema.methods.add11 = function () {
	console.log("hahahaah")
}

// 使用这个schema  test是向数据库创建的集合名称，一般会自动在后面加上s，即tests
// 如果数据库中有tests这个集合，则使用这个集合，否则将自动创建一个新的集合
var Kitten = mongoose.model('test', kittySchema)
//创建一个实例

// silence.name = "haha"

// silence.speak();  //   1.执行

// Kitten.save(function (err) {
// 	if (err){
// 		console.log("err")
// 		return
// 	}
// 	console.log("保存成功")  // 3. 执行
// });


//查找
// Kitten.find({name:'liwend'},function (err, result) {
// 	if(err){
// 		console.log(err)
// 		return
// 	}
// 	console.log("结果\n")
// 	console.log(result)
// })
Kitten.add11();