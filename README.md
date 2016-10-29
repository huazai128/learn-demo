1、cookie:避免cookie中存储任何蜜柑信息，因为cookie不安全，而且存储长度存在限制
2、Express.js默认使用内存储存session的数据，session的数据很容易丢失；这样可以用Redis或者MongodDB存储session数据，这样就可以保存session数据能够持久化存储，也可以实现session数据可跨服务器读取
3、node：获取请求参数的三种形式，
	req.body：用于获取post请求参数
	req.query：用于获取get请求参数
	req.params:获取url中的地址