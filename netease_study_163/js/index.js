/**
 * 消除字符串两边的空白
 * @param {String} 原字符串
 * @return {String} 处理后字符串
 */
function trim(_string){                          
	var _patten = /^\s*(\S*)\s*$/; 
	_string.match(_patten);   
	return RegExp['$1'];
};
/**
 * 通过类名查找元素对象
 * @param {Object} 父节点
 * @param {String} 类名
 * @return {Array} 结果的对象数组
 */
function getByClass(_parent, _className) {
	if (_parent.getElementsByClassName){                                  
		return _parent.getElementsByClassName(_className);
	} else {                                                          
		var _results = new Array(),                              //将查找的className分割存入数组classname_array
		    _elems = _parent.getElementsByTagName('*');					
		for (var i = 0,len = _elems.length; i < len; i++) { 
			var _patten1 = new RegExp('^'+_className),            //三种情况，类名在最前面，中间，最后面
			    _patten2 = new RegExp('\\s'+_className + '\\s'),
			    _patten3 = new RegExp('\\s'+_className + '$');
			if(_patten1.test(_elems[i].className) || _patten2.test(_elems[i].className) || _patten3.test(_elems[i].className)){
				_results.push(_elems[i]);
			};
		}
		return _results;
	}
};
/**
 * 添加类名
 * @param {Object} 节点
 * @param {String} 类名
 * @return {Void}
 */
function addClassName(_node, _className) {
	var _aClass = _node.className.split(' ');
	var _exist = false;
	for (var i = 0; i < _aClass.length; i++) {
		if(_aClass[i] === _className){
			_exist = true;
		}
	};
	if(!_exist){
		_node.className = _node.className + ' ' + _className;
	}
};
/**
 * 删除类名
 * @param {Object} 节点
 * @param {String} 类名
 * @return {Void}
 */
function delClassName(_node, _className) {
	var _aClass = _node.className.split(' ');
	for (var i = 0; i < _aClass.length; i++) {
		if(_aClass[i] === _className){
			_aClass[i] = '';
		}
	};
	_node.className = _aClass.join(' ');                      
};
/**
* 取得样式，包括非行间样式
* @param  {Object} 节点
* @param  {String} css名
* @return {String} 返回样式结果
*/
function getStyle(_obj, _name) {
	if(_obj.style[_name]){    
		return _obj.style[_name];
	}else{
		if(_obj.currentStyle) {             
			return _obj.currentStyle[_name];
		}else{
			return getComputedStyle(_obj,false)[_name];
		}
	}
}
/**
 * 淡入
 * @param {Object} 淡入对象
 */
function fadeIn(_node){
	clearInterval(_timer);
	delClassName(_node,'f-dn');
	function setOpacity(_node,_num){
    	_node.setAttribute('style','opacity:' + _num + ';filter:alpha(opacity='+parseInt(_num*100)+');');
	};
	setOpacity(_node,0);
	var _num = 0;
	var _timer = setInterval(function(){
		_num += 0.04;
		if(_num < 1){
			setOpacity(_node,_num);
		} else {
			clearInterval(_timer);
			setOpacity(_node,1);
		}
	},20);
}
/**
 * 名值对转换为字符串
 * @param {Object} 数据对象
 * @return {String} 参数序列化
 */
function params(_data) {
	var _arr = [];
	for (var i in _data) {
		_arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(_data[i]));
	}
	return _arr.join('&');
}

/**
 * Ajax
 * @param {Object} 设置对象
 */
function ajax(obj) {
	var xhr = new XMLHttpRequest();
	if(!obj.async) obj.async = true;                     
	if (typeof obj.data === 'object') obj.data = params(obj.data);    //处理传递参数，是对象就序列化

	if (obj.method === 'get') obj.url += obj.url.indexOf('?') === -1 ? '?' + obj.data : '&' + obj.data; //是get方法就将参数加到url
	
	function callback() {
		if (xhr.status == 200) {
			obj.success(xhr.responseText);			                 //回调传递参数
		} else {
			if(obj.fail) obj.fail(xhr.statusText);
		}	
	}
	if (obj.async === true) {
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				callback();
			}
		};
	}
	xhr.open(obj.method, obj.url, obj.async);
	if (obj.method === 'post') {
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(obj.data);	
	} else {
		xhr.send(null);
	}
	if (obj.async === false) {
		callback();
	}
}
/**
 * cookie操作函数
 * @param {string} cookie名
 *        {string} 可选，cookie值
 *        {object} 可选，设置对象
 * @return {string|void} 若只传cookie名则返回值，否则设置不返回
 */
function cookie(_name,_value,_options){
	if(_value){
		var _cookieText = encodeURIComponent(_name) + '=' + encodeURIComponent(_value);
		if(_options.expires){
			var _now = new Date().getTime();
			_now += (_options.expires - 8) * 60 * 60 * 1000;
			_cookieText += ';expires=' + new Date(_now);
		}
		document.cookie = _cookieText;
	}else{
		var _cookieName = encodeURIComponent(_name) + "=",
		    _cookieStart = document.cookie.indexOf(_cookieName),
		    _cookieValue = null;
		if(_cookieStart > -1){
			var _cookieEnd = document.cookie.indexOf(';',_cookieStart);
			if(_cookieEnd == -1){
				_cookieEnd = document.cookie.length;
			}
			_cookieValue = decodeURIComponent(document.cookie.substring(_cookieStart + _cookieName.length, _cookieEnd));
		}
		return _cookieValue;
	}
}
/**
 * 根据字节数截断字符串
 * @param {String} 操作字符串
 *        {Number} 字节数
 * @return {String} 处理后的字符串
 */
function strOmit(_str,_len) {
	var _newStr = '';
	    _i = 0;    
    while(_len > 0){
    	_newStr += _str.substring(_i,_i+1);
    	if (_str.charCodeAt(_i)>127 || _str.charCodeAt(_i)==94){
    		_len -= 2;
    	}else{
    		_len -= 1;
    	};
    	_i++;
    }
    if(_i < _str.length){
    	return _newStr + '...';
    }else{
    	return _newStr;
    }     
} 
/**
 * 缓存节点
 */
var setNode = function(){
	this._loginBtn = document.getElementById('login-sub');                 //登录按钮
	this._loginForm = getByClass(document,'j-loginForm')[0];               //登录框
	this._username = document.getElementById('username');                  //账户input
	this._password = document.getElementById('password');                  //密码input
	this._top = getByClass(document,'g-top')[0];                           //提示模块
	this._notips = getByClass(_top,'j-notips')[0];                         //不再提示按钮
	this._head = getByClass(document,'g-hd')[0];                           //头部
	this._notfan = getByClass(_head,'notfan')[0];                          //未关注
	this._isfan = getByClass(_head,'isfan')[0];                            //已关注
	this._slide = getByClass(document,'m-slide')[0];                       //轮播
	this._slidelist = getByClass(_slide,'j-slidePic');                     //轮播图列表 
	this._slidedot = getByClass(_slide,'u-slidedot');                      //轮播点
	this._course = getByClass(document,'j-course')[0];                     //课程盒子
	this._pager = getByClass(document,'ui-pager')[0];                      //分页器                     
	this._design = getByClass(document,'j-design')[0];                     //设计                     
	this._program = getByClass(document,'j-program')[0];                   //编程                     
	this._rankbox = getByClass(document,'j-rankbox')[0];                   //排行榜                     
	this._close = getByClass(document,'u-close');                          //关闭                     
	this._openVideo = getByClass(document,'j-video')[0];                   //打开视频按钮  
	this._videoPlayer = getByClass(document,'m-videoPlayer')[0];           //视频
	this._video = document.getElementById('video');                        //播放器                   
	this._focus = getByClass(document,'j-focus')[0];                       //关注                  
}
/**
 * 检验表单
 */
var validateForm = function(){
	var _flag = true;
	if(_username.value == ''){
		_flag = false;
		addClassName(_username.parentNode,'u-errorInput');
	}
	if(_password.value == ''){
		_flag = false;
		addClassName(_password.parentNode,'u-errorInput');
	}
	//检验邮箱
	return _flag;
}



window.onload = function(){
	//缓存节点
	setNode();
	//登录
	_loginBtn.onclick = function(_event){
		var _e = _event || window.event;
		if(validateForm()){
			var _user = trim(_username.value),
			    _pwd = trim(_password.value);
			//发送登录请求
			ajax({
				method:'get',
				url:'http://study.163.com/webDev/login.htm',
				data:'userName=' + hex_md5(_user) + '&password=' + hex_md5(_pwd),
				success:function(res){
					if(res == 1){
						cookie('loginSuc','in',{expires:7*24});
						addClassName(_loginForm,'f-dn');
						//检查关注
						if(cookie('loginSuc')){
							ajax({
								method:'get',
								url:'http://study.163.com/webDev/attention.htm',
								success:function(_res){
									if(_res == 1){
										cookie('followSuc','yes',{expires:100*366*24});
										addClassName(_notfan,'f-dn');
										delClassName(_isfan,'f-dn');
									} else {
										delClassName(_notfan,'f-dn');
										addClassName(_isfan,'f-dn');
									}
								}
							})
						}
					};
				},
				fail:function(rex){}
			});
		}
		_event.target.blur();
		_e.preventDefault();
	}
	//输入框变化时消除错误
	_username.onchange = function(){
		if(this.value != ''){
			delClassName(this.parentNode,'u-errorInput');
		}
	}
	_password.onchange = function(){
		if(this.value != ''){
			delClassName(this.parentNode,'u-errorInput');
		}
	}

	//检查提示cookie
	if(!cookie('tips')){
		delClassName(_top,'f-dn');
	}
	//不再提示
	_notips.onclick = function(){
		cookie('tips','no',{expires:366*24});        //1年都不提醒
		addClassName(_top,'f-dn');
	}

	//检查关注
	if(cookie('loginSuc')){
		ajax({
			method:'get',
			url:'http://study.163.com/webDev/attention.htm',
			success:function(_res){
				if(_res == 1){
					cookie('followSuc','yes',{expires:100*366*24});
					addClassName(_notfan,'f-dn');
					delClassName(_isfan,'f-dn');
				} else {
					delClassName(_notfan,'f-dn');
					addClassName(_isfan,'f-dn');
				}
			}
		})
	}
	_focus.onclick = function(){
		//验证cookie
		if(!cookie('loginSuc')){
			delClassName(_loginForm,'f-dn');
		}
	}

	//轮播
	var _slideTimer = null,
        _index = 0,
        _next = 1;
    function startSlide(){
		addClassName(_slidelist[_index],'f-dn');
		delClassName(_slidedot[_index],'z-crt');
		_next = _index == 2?0:_index+1;
		fadeIn(_slidelist[_next]);
		addClassName(_slidedot[_next],'z-crt');
		_index = _next;
	}
	_slideTimer = setInterval(startSlide,5000);
	//鼠标移动停留和离开处理
	for(var i = 0,len = _slidelist.length; i < len; i++){
		_slidelist[i].onmouseover = function(){
			clearInterval(_slideTimer);
		}
		_slidelist[i].onmouseout = function(){
			_slideTimer = setInterval(startSlide,5000);
		}
	}

	//浏览器窗口宽高
	var width = window.innerWidth;
	var height = window.innerHeight;

	if(typeof width != 'number'){
		if(document.compatMode == 'CSS1Compat'){
			width = document.documentElement.clientWidth;
			height = document.documentElement.clientHeight;
		}else{
			width = document.body.clientWidth;
			height = document.body.clientHeight;
		}
	}

	//加载课程
	if(width > 1205){
		var _psize = 20;
	}else{
		var _psize = 15;
	}
	var _type = 10;

	function _loadCourse(_pageNo,_psize,_type){

		function _courseItem(_obj,_classify){
			var _title = _obj.name;
			_title = strOmit(_title,32);
			var _str = '<li class="f-fl f-pr j-courseLi" data-pop="yes">' +
                            '<a class="f-db" class="" href="' + _obj.providerLink + '" target="_blank">' +
                                '<div class="img-box">' +
                                    '<img src="' + _obj.middlePhotoUrl +'" alt="">' +
                                '</div>' +
                                '<h3>' + _title +'</h3>' + 
                                '<span class="teacher f-db">' + _obj.provider + '</span>' +
                                '<span class="count f-ib">' + _obj.learnerCount + '</span>' +
                                '<span class="u-price f-db">¥ ' + _obj.price + '</span>' + 
                            '</a>' +
                            '<div class="detail f-pa  f-dn">' +
                                '<a class="f-db f-cb" class="" href="' + _obj.providerLink + '" target="_blank">' +
                                    '<div class="img-box f-pa">' +
                                        '<img src="' + _obj.middlePhotoUrl +'" alt="">' +
                                    '</div>' +
                                    '<div class="tt-box f-ib">' +
                                        '<h3 class="f-db">' + _obj.name +'</h3>' +
                                        '<span class="count f-ib">' + _obj.learnerCount + '人在学</span>' +
                                        '<span class="teacher f-db">发布者：' + _obj.provider + '</span>' +
                                        '<span class="classify f-db">分类：' + _classify + '</span>' +
                                    '</div>' +
                                    '<p class="f-fl">' + _obj.description + '</p>' +
                                '</a>' +
                            '</div>' +
                        '</li>';
            return _str;
		}

		function setPager(_obj){
            var _str ='',
                _arr = [];

      		if(_obj.totleCount <= _obj.pageSize){
      			return '';
      		}
      		if(_obj.pageIndex > 3){
      			_arr.push(1,'...',_obj.pageIndex);
      		}else{
      			for(var i = 1; i <= _obj.pageIndex; i++){
      				_arr.push(i);
      			}
      		}
      		if(_obj.totlePageCount > _obj.pageIndex + 2){
      			_arr.push('...',_obj.totlePageCount);
      		}else{
      			for(var i = _obj.pageIndex + 1; i <= _obj.totlePageCount; i++){
      				_arr.push(i);
      			}
      		}
      		if(_obj.pageIndex == 1){
      			_str = '<span class="pre f-ib"><</span>';
      		}else{
      			_str = '<span class="pre f-ib" data-index="' + (_obj.pageIndex-1) + '"><</span>';
      		}
            
            for(var i = 0; i < _arr.length; i++){
            	if(_arr[i] ==  _obj.pageIndex){
            		_str += '<span class="f-ib z-crt">' + _arr[i] + '</span>';
            	}else if(_arr[i] == '...'){
            		_str += '<span class="f-ib z-none">...</span>';
            	}else{
            		_str += '<span class="f-ib" data-index="' + _arr[i] + '">' + _arr[i] + '</span>';
            	}
            }
            if(_obj.pageIndex == _obj.totlePageCount){
            	_str += '<span class="next f-ib">></span>';
            }else{
            	_str += '<span class="pre f-ib" data-index="' + (_obj.pageIndex+1) + '">></span>';
            }
            _pager.innerHTML = _str;
		}

		ajax({
			method:'get',
			url:'http://study.163.com/webDev/couresByCategory.htm',
			data:{
				pageNo:_pageNo,
				psize:_psize,
				type:_type
			},
			success:function(res){
				var _listJson = JSON.parse(res),
				    _list = _listJson.list,
				    _typeName = _type == 10?'产品设计':'编程语言';
				_course.innerHTML = '';
				if(_list.length > 0){
					for(var i = 0, len = _list.length; i < len; i++){
						_course.innerHTML += _courseItem(_list[i],_typeName);
					}
					var _courseLi = getByClass(_course,'j-courseLi'),
					    _aList = _course.getElementsByTagName('a');

					for(var i = 0,len = _courseLi.length; i < len; i++){
						_courseLi[i].onmouseover = function(){
								clearTimeout(this.__hoverTimer);
								clearTimeout(this.__leaveTimer);
								var _this = this;
								this.__hoverTimer = setTimeout(function(){
									delClassName(getByClass(_this,'detail')[0],'f-dn');
								},1000);
						};
						_courseLi[i].onmouseout = function(){
							clearTimeout(this.__hoverTimer);
							clearTimeout(this.__leaveTimer);
							var _this = this;
							this.__leaveTimer = setTimeout(function(){
								addClassName(getByClass(_this,'detail')[0],'f-dn');
							},200);
						}
					}
					setPager(_listJson.pagination);
				}else{

				}
				
			}
		})
	}
	_loadCourse(1,_psize,10);
	_pager.onclick = function(_e){
		_ev = window.event || _e;
		if(_ev.target.getAttribute('data-index')){
			_loadCourse(_ev.target.getAttribute('data-index'),_psize,_type);
		}
	}
	_design.onclick = function(){
		addClassName(this,'z-crt');
		delClassName(_program,'z-crt');
		_loadCourse(1,_psize,10);
		_type = 10;
	};
	_program.onclick = function(){
		delClassName(_design,'z-crt');
		addClassName(this,'z-crt');
		_loadCourse(1,_psize,20);
		_type = 20;
	}


	function _loadRank(){
		
		function _rankItem(_obj){
			var _title = _obj.name;
			_title = strOmit(_title,10);
			var _str = '<li class="">' +
                            '<a class="f-db" class="" href="" target="_blank">' +
                            	'<div class="img-box f-ib">' +
                                    '<img src="' + _obj.smallPhotoUrl + '" alt="">' +
                                '</div>' +
                                '<div class="tt-box f-ib">' +
                                    '<h4 class="f-db">' + _title + '</h4>' +
                                    '<span class="count f-ib">' + _obj.learnerCount + '</span>' +
                                '</div>' +
                            '</a>' +
                       '</li>';
            return _str;
		}

		ajax({
			method:'get',
			url:'http://study.163.com/webDev/hotcouresByCategory.htm',
			success:function(res){
				var _listJson = JSON.parse(res);
				console.log(_listJson);
				_rankbox.innerHTML = '';
				for(var i = 0, len = _listJson.length; i < len; i++){
						_rankbox.innerHTML += _rankItem(_listJson[i]);
				}
				for(var i = 0, len = _listJson.length; i < len; i++){
						_rankbox.innerHTML += _rankItem(_listJson[i]);
				}
			}
		})
	}


	_loadRank();

	function rankMove(){
		var _top = parseInt(getStyle(_rankbox,'top')),
			_end = _top - 89,
			_timer;
		if(_top == -1790){
			_top = - 10;
			_end = -99;
		}
		_timer = setInterval(function(){
			_top -= 3;
			_rankbox.style.top = _top + 'px';
			if(_top < _end){
				clearInterval(_timer);
				_rankbox.style.top = _end + 'px';
			}
		},30);
	}
	setInterval(rankMove,5000);


	_openVideo.onclick = function(){
		_video.play();
		delClassName(_videoPlayer,'f-dn');
	}

	for(var i = 0; i < _close.length; i++){
		_close[i].onclick = function(){
			_video.currentTime = 0;
			_video.pause();
			addClassName(this.parentNode.parentNode,'f-dn');
		}
	}





}


