var mongo = require("mongodb"); //引入mongodb模块
var assert = require("assert"); //引入断言模块

var MongoClient = mongo.MongoClient;  //开启服务
  
var Urls = "mongodb://localhost:27017/user"; 


//插入
var insert = function (db,collectionName,json) {
	db.collection(collectionName).insert(json,function(err,result){ //连接到数据库上面，并使用参数传入集合
		assert.equal(null,err);
		console.log(result);
		db.close();
	});
}
//查询
var find = function(db,collectionName,json){
  	db.collection(collectionName).find(json).toArray(function(err,result){
		assert.equal(null,err);
		console.log(result);
		db.close();
	})
}
//删除
var deletes = function(db,collectionName,json){
    db.collection(collectionName).deleteOne(json,function(err,result){ //连接到数据库上面，并使用参数传入集合
        assert.equal(null,err);
        find(db,collectionName,{})
        // db.close();
    });
};
//更改
var update = function (db,collectionName,json){
	db.collection(collectionName).update(json,function(err,result){ //连接到数据库上面，并使用参数传入集合
        assert.equal(null,err);
        console.log(result);
        db.close();
    });
}
//操作类型
var methodType = {
	find:find,
	insert:insert,
	deletes:deletes,
	update:update,
};
//暴露接口，开启服务
exports.server = function (method,collectionName,json) {
	MongoClient.connect(Urls,function(err,db){
		assert.equal(null,err);
		methodType[method](db,collectionName,json)
	});
}