var app = require("express")();
var session = require('express-session')
// var cookieParser = require('cookie-parser');
var connect = require("./model/db.js")
//博文schema
var blog = require("./model/blog.js")
//用户密码
var user = require("./model/user.js")
//邮箱验真码
var emailMsg = require("./model/emailMsg.js")
var bodyParser = require("body-parser");
var sendMails = require("./model/email.js")
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'login',
    // name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    // cookie: {maxAge: 1000*60*60*24*7 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
}));

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://111.230.233.205");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    //application/x-www-form-urlencoded; charset=UTF-8
    //application/json;charset=utf-8
    //X-Requested-With
    next();
});
app.get("/",function(req,res,next) {
	res.send("niha")
})
//新建文章
app.post("/addBlog",function (req,res){
	var ification = req.body.ification
	connect();
	if(req.body.title){
		var t =new Date()
		var dates = t.getFullYear()+"-"+(t.getMonth()+1)+'-'+t.getDate()
		var data = {
			"title":req.body.title,
			"date":dates,
			"body":req.body.body,
			"author":req.body.author,
			"Summary":req.body.Summary,
			"pic":req.body.pic,
		}
		blog.create(ification,data,function (err,result){
			if(err){
				console.log(err)
				res.json({
					status:"0",
					msg:"创建失败"
				})
				return
			}
			res.json({
				status:"1",
				msg:"创建成功"
			})
		});
	}else {
		res.json({
			status:"-1",
			mssg:"未知参数"
		})
	}
})
//登录
app.post("/login",function(req,res){
	var username = req.body.username
	var password = req.body.password
	connect();
	user.find({eMail:username},function(err,result){
		if(err){
			console.log("err");
			return
		}
		console.log(result)
		//没有该用户
		if(result.length == 0){
			res.json({
				status:"-1",
				msg:"用户名或密码错误"
			})
		}else{
			if(result[0].passWord == password){
				req.session.login = "1";
				req.session._id = result[0]._id
				res.json({
					status:"1",
					msg:"登录成功",
					data:{
						"username":result[0].userName,
						"diary":result[0].diary
					}
				})
			}else{
				res.json({
					status:"-1",
					msg:"用户名或密码错误"
				})
			}
		}
	})
})
//退出登录
app.post("/logout",function(req,res){
	req.session.login = "0";
	res.json({
		status:"0",
		msg:"退出登录"
	})
})
//判断是否登录
app.post("/isLogin",function(req,res){
	var id = req.session._id
	if(req.session.login == "1"){
		user.find({_id:id},function(err,result){
			if(err){
				console.log(err);
				return
			}
			res.json({
				isDl:true,
				data:{
					"username":result[0].userName,
					"diary":result[0].diary
				}
			})
		})
		
	}else{
		res.json({
			isDl:false
		})
	}
})
//获得所有文章
app.get("/getAll",function(req,res){
	var ification = req.query.key
	connect();
	blog.find(ification,{},function (err,result){
		if(err){
			console.log("err")
			res.json({
				status:-1
			})
			return
		}
		res.json({
			status:1,
			result:result
		})
	})
})
//博客评论
app.post("/addReply",function(req,res){
	var ification = req.body.ification
	var id = req.body.id
	var body = req.body.body
	var author = req.body.author
	blog.find(ification,{"_id":id},function(err,result){
		if(err){
			return
		}
		var t =new Date()
		var dates = t.getFullYear()+"-"+(t.getMonth()+1)+'-'+t.getDate()
		var obj = {"author":author,"body":body,"date":dates}
		var arr = result[0].comment;
		arr.unshift(obj)
		blog.update(ification,{"_id":id},{$set:{"comment":arr}},function(err,result){
			if(err){
				console.log(err)
				res.json({
					status:"-1",
					msg:"评论失败"
				})
				return
			}
			res.json({
				status:"1",
				msg:"评论成功"
			})
		})
	})
})
//获取评论
app.post("/getReply",function(req,res){
	var ification = req.body.ification
	var id = req.body.id
	blog.find(ification,{"_id":id},function(err,result){
		if(err){
			return
			res.json({
				status:"-1",
				data:''
			})
		}
		res.json({
			status:"1",
			data:result
		})
	})
})
//注册验真码
app.post("/getMsg",function(req,res){
	var email = req.body.email
	//生成随机验证码
	var num = parseInt(Math.random()*9*100000)
	connect();
	//将验证码存进数据库
	emailMsg.find({eMail:email},function(err,result){
		if(err){
			console.log(err)
			return
		}
		//找到相同邮箱，替换验证码
		if(result.length!= 0){
			emailMsg.update({eMail:email},{$set:{msg:num}},function(err,result){
				if(err){
					console.log(err)
					res.json({
						status:"-1",
						msg:"获取验证码失败"
					})
					return
				}
				sendMails(email,num,function(error, info){
			        if (error) {
			            console.log("发送失败");
			            res.json({
							status:"-1",
							msg:"获取验证码失败"
						})
						return
			        }else {
			            console.log('发送成功');
			            console.log(info)
			            res.json({
							status:"1",
							msg:"已发送验证码"
						})
			        }
				})
			})
		}
		//未找到相同邮箱，创建一条
		else{
			var data = {
				"eMail":email,
				"msg":num
			}
			emailMsg.create(data,function(err,result){
				if(err){
					console.log(err)
					res.json({
						status:"-1",
						msg:"获取验证码失败"
					})
					return
				}
				sendMails(email,num,function(error, info){
			        if (error) {
			            console.log("发送失败");
			            res.json({
							status:"-1",
							msg:"获取验证码失败"
						})
						return
			        }else {
			            console.log('发送成功');
			            console.log(info)
			            res.json({
							status:"1",
							msg:"已发送验证码"
						})
			        }
				})
			})
		}
	})
})
//注册
app.post("/zhuce",function(req,res){
	var username = req.body.username
	var password = req.body.password
	var email = req.body.email
	var yzm = req.body.yzm
	connect();
	user.find({eMail:email},function(err,result){
		if(err){
			console.log("err");
			return
		}
		//已经注册过
		if(result.length != 0){
			res.json({
				status:"-1",
				msg:"该邮箱已被注册"
			})
		}
		//没有注册过，新用户
		else{
			emailMsg.find({eMail:email},function(err,result){
				if(result.length != 0){
					if(result[0].msg == yzm){
						var data = {
							"eMail":email,
							"userName":username,
							"passWord":password,
							"diary":[],
						}
						//用户信息存入数据库
						user.create(data,function(err,result){
							if(err){
								console.log(err)
								res.json({
									status:"-1",
									msg:"注册失败"
								})
								return
							}
							res.json({
								status:"1",
								msg:"注册成功,3秒后跳转登录页"
							})
						})
					}else{
						res.json({
							status:"-1",
							msg:'验证码有误'
						})
					}
				}else {
					res.json({
						status:"-1",
						msg:'验证码有误'
					})
				}
			})
		}
	})
})
//添加日记
app.post("/addDiary",function(req,res){
	var body = req.body.body
	var t =new Date()
	var dates = t.getFullYear()+"-"+(t.getMonth()+1)+'-'+t.getDate()
	var id = req.session._id
	if(req.session.login == "1"){
		user.find({"_id":id},function(err,result){
			if(err){
				console.log(err);
				return
			}
			var obj = {"date":dates,"body":body}
			var arr = result[0].diary
			arr.unshift(obj)
			user.update({"_id":id},{$set:{"diary":arr}},function(err,result){
				if(err){
					console.log(err)
					res.json({
						status:"-1",
						msg:"新建日记失败"
					})
					return
				}
				res.json({
					status:"1",
					msg:"新建日记成功"
				})
			})
		})
	}else {
		res.json({
			status:"-1",
			msg:"新建日记失败"
		})
	}
})
app.listen(3000)