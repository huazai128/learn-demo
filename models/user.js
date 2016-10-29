var mongoose = require("mongoose");

//存储用户信息集合
var userSchema = new mongoose.Schema({
	email:{                                        //定义email字段
		type:String,
		required:true,                             //必填
		set:function(value){                       //设置字段
			return value.trim().toLowerCase();     //获取的值去空格，转换为小写
		},
		validate: [
	      function(email) {                        //验证email的合法性
	        return (email.match(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i) != null)},
	      'Invalid email'
	    ]
	},
	password:String,
	admin:{
		type:Boolean,
		default:false                             //admin字段默认为
	}
})

module.exports = mongoose.model("User",userSchema);     //导出集合模型