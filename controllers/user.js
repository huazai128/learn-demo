var mongoose = require("mongoose");
var User = mongoose.model("User");

exports.list = function(req,res){
	res.send("respond with a resource");
}

//GET 登录页面

exports.login = function(req,res,next){
	// var user = new User({
	// 	  email: "941154174@qq.com",
	// 	  admin: true,
	// 	  password: "123456"
	// 	})
	// user.save(function(err,user){
	// 	console.log(user);
	// })
	res.render("login");
}


//GET 退出页面
exports.logout = function(req,res,next){
	req.session.destroy();     //删除session会话信息
	res.redirect("/");         //重定向到首页
}

//用户登录
exports.authenticate = function(req,res,next){
	if(!req.body.email || !req.body.password){  //判断表单信息是否为空
		return res.render("login",{err:"请输入您的email和password"})
	}
	//根据email和password查询数据
	User.findOne({
		email:req.body.email,
		password:req.body.password
	}).exec(function(err,user){
		if(err){
			return next(err);   //next():接受一个err作为参数，表示停止请求，这时候会触发Express.js的错误模式
		}
		if(!user){
			return res.render("login",{err:"你输入的email或密码不对"});
		}
		req.session.user = user;
		req.session.admin = user.admin;
		res.redirect("/admin")
	})
}