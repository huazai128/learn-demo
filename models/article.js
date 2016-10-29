var mongoose = require("mongoose");

var articleSchema = new mongoose.Schema({   
	title:{
		type:String,
		required:true,
		validate:[function(value){return value.length <= 120},"Title is too long(120 max)"],      //验证，判断输入的标题是否大于120个字
		default:"New Post"                   //默认值
	},
	text:String,
	published:{type:Boolean,default:false},  //定义一个是否公开的字段，默认不公开
	slug:{
		type:String,
		set:function(value){
			return value.toLowerCase().replace("","-");  //把sulg输入的字符串转换成小写，把空格转换成－
		}
	}
})

articleSchema.static({                     //静态方法
	list:function(callback){
		this.find({},null,{sort:{_id:-1}},callback)
	}
})
module.exports = mongoose.model("Article",articleSchema);