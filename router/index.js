module.exports = function(app,authorize){
	var controllers = require("./../controllers/index");
	app.get("/",controllers.article.index);                //首页，获取所有articles数据
	app.get("/login",controllers.user.login);              //登录，根据用户信息登录
	app.post("/login",controllers.user.authenticate);      //POST请求登录
	app.get("/logout",controllers.user.logout);            //退出登录
	app.get("/admin",authorize,controllers.article.admin); //
	app.get("/post",authorize,controllers.article.post);   //
	app.post("/post",authorize,controllers.article.postArticle);  //
	app.get("/articles/:slug",controllers.article.show);   //


	//REST API
	app.all("/api",authorize);                              //要验证所有的/api请求，如果不满足authorize要求下面请求就不会通过
	app.get("/api/articles",controllers.article.list);      //获取用户所有的文章
	app.post("/api/articles",controllers.article.add);      //增加文章
	app.put("/api/articles/:id",controllers.article.edit);  //编辑文章
	app.del("/api/articles/:id",controllers.article.del);   //删除文章
}