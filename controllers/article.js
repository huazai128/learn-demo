/*
	node：获取请求参数的三种形式，
	req.body：用于获取post请求参数
	req.query：用于获取get请求参数
	req.params:获取url中的地址

*/
var mongoose = require("mongoose");
var Article = mongoose.model("Article");

exports.index = function(req,res,next){         //没有用户登录时，只能查看公开的文章，并且根据id进行降序
	Article.find({published:true},null,{$set:{_id:-1}}).exec(function(err,articles){
		if(err){
			return next(err);   //next():接受一个err作为参数，表示停止请求，这时候会触发Express.js的错误模式
		}
		res.render("index",{articles:articles});
	})
}

exports.show = function(req,res,next){
	//req.params:用于获取请求连接参数
	if(!req.params.slug) return next(new Error("No article slug."))
	Article.findOne({slug:req.params.slug},function(err,article){
		if(err){
			return next(err);  //next():接受一个err作为参数，表示停止请求，这时候就会触发Express.js的错误模式
		}
		if(!article.published && !req.session.admin){ return res.send(401)}
		res.render("article",article)
	})
}


//查询所有的文章
exports.list = function(req,res,next){
	Article.list(function(err,articles){
		if(err){return next(err)};
		res.send({articles:articles})
	})
}
//增加文章
exports.add = function(req,res,next){
	if(!req.body.article) return next(new Error("No articles payload"))
	var article = req.body.article;
	article.published = false;
	Article.create(article,function(err,articleResponse){
		if(err) return next(err);                     //next():接受一个err作为参数，表示停止请求，这时候会触发Express.js的错误模式
		res.send(articleResponse)
	})
}
//根据ID编辑
exports.edit = function(req,res,next){
	//根据ID修article信息
	if(!req.params.id) return next(new Error("没有当前文章的ID"));          //parmas:用于获取请求连接参数
	var userId  = req.params.id;
	Article.findByIdAndUpdate({_id:userId},function(err,result){
		if(err) return next(err);
		res.send(result)
	})
}

//根据ID删除
exports.del = function(req,res,next){
	if(!req.params.id) return next(new Error("请选中您要删除的文章"));
	Article.findByIdAndRemove({_id:req.params.id},function(err,result){
		if(err) return next(err);
		res.send(result);
	})
}

exports.post = function(req,res,next){
	if(!req.body.title){
		res.render("post");
	}
}

//添加新的article
exports.postArticle = function(req,res,next){
	if(!req.body.title || !req.body.slug || !req.body.text){
		return res.render("post",{err:"Fill title ,slug and text"});
	}
	var article = {
		title:req.body.title,
		slug:req.body.slug,
		text:req.body.text,
		published:false
	}
	Article.create(article,function(err,articleResponse){
		if(err) return next(err);
		res.render("post",{err:'Article was added. Publish it on Admin page.'})
	})
}


exports.admin = function(req,res,next){
	Article.list(function(err,articles){    //查询用户所用的数据
		res.render("admin",{articles:articles});
	})
}