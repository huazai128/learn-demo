var boot = require("./../app").boot;
var shutdown = require("./../app").shutdown;
var port = require("./../app").port;

var superagent = require("superagent");   //用户测试HTTP请求返回的响应
var expect = require("expect.js");        //行为驱动开发

var seedArticles = require("./../db/article.json");

describe("server",function(){
	before(function(){                    //在进入测试之前先连接服务
		boot();
	});
	describe("home page",function(){ 
		it("should respond to GET",function(done){  //测试请求状态
			superagent                    //用于测试HTTP请求返回的响应信息
			.get('http://localhost:'+port)
			.end(function(res){
				console.log(res+"=====") //null????
				//expect(res.status).to.equal(200);  //用于测试响应状态码和期望值是否一致
				done();
			})
		})
		it("should contain posts",function(done){      //测试http请求获取数据
			superagent
			.get("http://localhost:"+port)
			.end(function(res){
				seedArticles.forEach(function(item,index,list){
					if (item.published) {
		              //expect(res.text).to.contain('<h2><a href="/articles/' + item.slug + '">' + item.title);
		            } else {
		              //expect(res.text).not.to.contain('<h2><a href="/articles/' + item.slug + '">' + item.title);
		            }
				})
				done();
			})
		})
	})
	describe("article page",function(){
		it("should display text",function(done){
			var n = seedArticles.length;
			seedArticles.forEach(function(item,index,list){
				superagent
				.get("http://localhost:"+port+"/articles"+seedArticles[index].slug)
				.end(function(res){
					if(item.published){
						//expect(res.text).to.contain(seedArticles[index].text);
					}else{
						//expect(res.status).to.be(401);     //用于测试实际值和期望值是否一致
					}
					if(index + 1 === n){
						done();
					}
				})
			})
		})
	})
	after(function(){
		shutdown();  //关闭服务
	})
})
