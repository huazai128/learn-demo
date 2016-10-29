//ajaxSetup:设置全局的AJAX默认选项；用于处理所有AJAX请求错误处理
$.ajaxSetup({     //这是全局
	xhrFields:{withCredentials:true},   //xhrFields：非跨域的请求中使用xhrFields: withCredentials: true 也是可以请求成功的
	error:function(xhr,status,error){
		console.log(xhr);
		$(".alert").removeClass("hidden");
		$(".alert").html("Status:" + status +",error:"+error);
	}
})

//查找当前元素的父元素
var findTr = function(event){
	var target = event.srcElement || event.target;
	var $target = $(target);
	console.log($target);
	var $tr = $target.parents("tr");   //在当前时间中找到父类的tr元素
	return $tr;
}

//获取当前ID
var remove = function(e){
	var $tr = findTr(e);
	var id = $tr.data("id");  //获取当前元素的id

	$.ajax({
		url:"/api/articles/" + id,
		type:"DELETE",
		success:function(data,status,xhr){
			$(".alert").addClass("hidden");
			$tr.remove();  //删除当前tr
		}
	})
}

var update = function(e){
	var $tr = findTr(e);  //根据事件获取当前元素的父元素
	$tr.find("button").attr("disabled","disabled");   //禁止按钮事件
	var data = {
		published:$tr.hasClass("unpulished")    //判断class：unpulished是否存在；结果是一个Boolean
	}
	var id =  $tr.attr("data-id");              //获取tr元素上的data-id属性
	$.ajax({
		url:"/api/articles/" + id,
		type:"PUT",
		contentType:"application/json",         //数据类型
		data:JSON.stringify({articles:data}),   //把JSON对象转换成JSON字符串
		success:function(dataResponse,status,xhr){
			console.log(dataResponse)
			$tr.find("button").removeAttr("disabled");  //解除禁止按钮
			$(".alert").addClass("hidden");     
			if(data.published){
				$tr.removeClass("unpulished").find(".glyphicon-play").removeClass('glyphicon-play').addClass('glyphicon-pause');
			}else{
				$tr.addClass('unpublished').find('.glyphicon-pause').removeClass('glyphicon-pause').addClass('glyphicon-play');
			}
		}
	})
}


$(document).ready(function(){
  var $element = $('.admin tbody');
  $element.on('click', 'button.remove', remove);
  $element.on('click', 'button', update);
})