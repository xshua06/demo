(function(win){

	var autoFixIframeHeight,
		doc = document,
		docEle = doc.documentElement,
		body = doc.body;
	
	autoFixIframeHeight = new function(){
		var self = this,
			
			//获取url中的参数
			getRequest = function(name){
				var reg = new RegExp("(?:^|&)" + name + "=([^&]*)(?:&|$)", "i");
				var arr = window.location.search.substr(1).match(reg);
				return arr ? unescape(arr[2]) : "";
			},
			
			//获取配置，script的优先级大于url中的参数
			getConfig = function(){
				var scripts = doc.getElementsByTagName('script'),
					script = scripts[scripts.length - 1];
					
				return function(cfg){
					var p = script.getAttribute(cfg);
					return p ? p : getRequest(cfg);
				};
			}(),
			
			//代理高度
			proxyheight = 0,
			
			//top页frame的id
			frameid = getConfig("data-iframeid"),
			
			//监听实时更新高度间隔
			timer = isNaN(parseInt(getConfig("data-timer"))) ? 200 : parseInt(getConfig("data-timer")),
			fixHeight = getConfig("data-fixheight") || "40",
			
			//获取代理的url
			getProxyUrl = getConfig("data-proxy"),
			
			//创建代理的iframe
			proxyframe = function(){
				var el = doc.createElement("iframe");
				el.style.display = "none";
				el.name = "proxy";
				return el;
			}(),
			
			//判断是否跨域
			isCrossDomain = function(){
				var isCross = false;
				try{
					parent.document;
				}catch(e){
					isCross = true;
				}
				return isCross;
			}();
			
		
		//获取第三方页面的高度
		this.getHeight = function(){
			return Math.max(body.offsetHeight, docEle.offsetHeight);
		}
		
		//重置高度
		this.resize = function(){
			proxyheight = this.getHeight();
			
			//判断是否跨域
			if(isCrossDomain){
				//跨域
				proxyframe.src =  getProxyUrl + "?data-iframeid=" + frameid+ "&data-iframeheight=" + (proxyheight + parseInt(fixHeight));
			}else{
				//未跨域
				try{
					window.parent.document.getElementById(frameid).style.height = (proxyheight + parseInt(fixHeight)) + "px";
				}catch(e){};
			}
		}
		
		//初始化
		this.init = function(){
			var self = this,
				_timer = timer < 200 ? 200 : timer,
				_handler = function(){
					//是否update
					if(self.getHeight() != proxyheight){
						self.resize();
					}
					setTimeout(_handler, _timer);
				},
				_init = function(){
					if(isCrossDomain){
						body.appendChild(proxyframe);
					}
					_handler();
				};
			
			if(doc.addEventListener){
				window.addEventListener("load", _init, false);
			}else{
				window.attachEvent("onload", _init);
			}
		}
	};

	autoFixIframeHeight.init();
	
})(window);
