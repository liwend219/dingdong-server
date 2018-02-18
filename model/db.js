
function connect() {
	var mongoose = require('mongoose');
	mongoose.connect('mongodb://111.230.233.205/blog');
	// 连接数据库
	var db = mongoose.connection;
	//是否连接成功
	db.on('error', console.error.bind(console, 'connection error:'));
	// 连接成功后回调
	db.once('open', function () {
	  console.log("连接成功")  //  2.执行
	});
}

module.exports = connect;