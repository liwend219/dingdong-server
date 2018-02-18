var app = require("express")();
var dbs = require("./moudel/mongo.js")
var session = require('express-session');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
	secret: 'keyboard cat', 
	// cookie: ('name', 'value', { path: '/', httpOnly: true,secure: false, maxAge:  60000 }),
	//重新保存：强制会话保存即使是未修改的。默认为true但是得写上
	resave: true, 
	//强制“未初始化”的会话保存到存储。 
  	saveUninitialized: true,
}));
// dbs.server('insert','student',{'name':'xiaoming'})
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.get('/', function (req, res) {
    if(req.session.login == "1"){
    	res.send("已经登录")
    }else {
    	req.session.login = "1"
    	res.send("登陆了")
    }
});
//登录验证
app.post('/login',function (req,res){
	console.log(req.body.username)
	console.log(req.body.password)
	res.json({
		status:"1",
		msg:"登陆成功"
	})
})
// dbs.server('deletes','student',{'name':'xiaoming'})
// app.get("/",function(req,res){
// 	res.send("niaho")
// })
app.get('/du',function(req,res){
	if(req.session.login == "1"){
    	res.send("已经登录")
    }else {
    	// req.session.login = "1"
    	res.send("对不起，没有登录")
    }


	// dbs.server('find','student',{'name':'xiaoming'})
	// res.send("读取成功")
})
app.get('/add',function(req,res){
	let name = req.query.name
	let age = req.query.age
	dbs.server('insert','student',{'name':name,'age':age})
	res.send({status:1,msg:'添加成功'})
})
app.listen(3000)