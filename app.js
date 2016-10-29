/**
 * Everyauth:所有子模块支持链式调用和Promise协议；
 * 这里没有使用持久化存储或者内存存储session信息
 
 */


var TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY || "ABC";           //process.env：存放在环境变量中；用常量来记录这些配置
var TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET || "XYZXYZ";

var express  = require("express");                        //Web服务；提供http、路由视图、cookir等
var path     = require("path");                           //处理系统路径
var http     = require("http");
var mongoose = require("mongoose");
mongoose.Promise = require("bluebird");                   //Promise()对象
var dbUrl    = process.env.MONGOHQ_URL || "mongodb://localhost/blog";   //连接数据库地址
var db       = mongoose.connect(dbUrl,{safe:true});       //连接数据库
var everyauth = require("everyauth");                     //提供第三方登录身份验证策略
var session  = require("express-session");                //session会话
var logger   = require("morgan");                         //logger日志
var errorHandler = require("errorhandler");               //错误处理机制
var cookieParser = require("cookie-parser");              //cookie存储
var bodyParser   = require("body-parser");                //处理POST请求JSON数据
var methodOverride = require("method-override");          //处理请求方法；put;REST API风格 

var models = require("./models");                         //引入模型
var controllers = require("./controllers/index");

everyauth.debug = true;									  //everyauth.debug:调试模式，

//everyauth会默认用户信息存储在session中
everyauth.twitter                                         //Everyauth:所有子模块支持链式调用和Promise协议；
	.consumerKey(TWITTER_CONSUMER_KEY)                    //定义key和secret
	.consumerSecret(TWITTER_CONSUMER_SECRET)
	.findOrCreateUser(function(session,accessToken,accessTokenSecret,twitterUserMetadata){  //findOrCreateUser：通过回调函数，实现用户信息存储在数据库中
		var promise = this.Promise();
		process.nextTick(function(){                      //process.nextTick：模拟异步请求
			if(twitterUserMetadata.screen_name === "azat_co"){
				session.user = twitterUserMetadata;       //把用户信息存储到session中
				session.admin = true; 
			}
			promise.fulfill(twitterUserMetadata);         //fulfill:按流程处理函数，不会同时执行多个函数
		})
		return promise;                                   //返回promise对象
	}) 
	.redirectPath("/admin");                              //配置用户成功后重定向到admin页面
everyauth.everymodule.handleLogout(controllers.user.logout);  //调用user中login登录页面

everyauth.everymodule.findUserById(function(user,callback){   //由于用户信息已经保存到session中，这样可与更具session中保存的用户查询
	callback(user);
})

var app = express();
app.locals.appTitle = "myblog";                           //locals：对象字面量可以在页面中直接渲染；

//设置
app.set("port",process.env.PORT || 3000);                 //设置端口号
app.set("views",path.join(__dirname,"views"));            //设置视图路径
app.set("view engine","jade");                            //模版引擎

//中间件的引用
app.use(logger("dev"));                                   //logger日志
app.use(bodyParser.json());                               //只接受JSON数据
app.use(cookieParser("ADWDWD-31231321-csdcsdcsd"));       //添加字符串是防止cookie被窃取
app.use(session({secret:"ASWFF-e2rfr343-JJDDAD"}));       //对session进行加密操作；session依赖cookie
app.use(everyauth.middleware());                          //启用Everyauth路由规则，必须放在cookie和session后面
app.use(bodyParser.urlencoded());                         //设置编码格式，接受任何数据
app.use(methodOverride());                                //设置请求方法；
app.use("/public",express.static("./public"));            //设置静态文件的目录

app.use(express.static(path.join(__dirname,"views")));    //静态文件

//判断用户是否通过验证，吧通过的验证的信息传递到其它模块中
app.use(function(req,res,next){
	if(req.session && req.session.admin){
		res.locals.admin = true;                          //设置admin字段为true；可以在模版中直接访问
	}
	next();
})

//权限管理
var authorize = function(req,res,next){                   //next():可用于下一个函数执行操作，或者喊出处理报错时next(err)就可以触发Express的错误响应
	//判断session并且admin存在
	if(req.session && req.session.admin){
		return next();
	}else{
		return res.send(401);                             //认证失败
	}
}

if("development" === app.get("env")){
	app.use(errorHandler());                       
}

require("./router/index")(app,authorize);

var server = http.createServer(app);

var boot = function(){                                    
	server.listen(app.get("port"),function(){
		console.log("express server listening " + app.get("port"));
	})
}

var shutdown = function(){
	server.close();                                       //关闭服务
}

if(require.main === module){
	boot();
}else{
	console.log("Running app a module");
	exports.boot = boot;
	exports.shutdown = shutdown;
	exports.port = app.get("port");
}







