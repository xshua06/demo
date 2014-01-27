(function($){
	var cross, state, storage, timeoutid, listenFn = [];
	state = {
		set: function(name, value){
			if(name){
				if(typeof localStorage == "undefined"){								
					document.cookie = name + "=" + escape(value) || "";
				}else{
					localStorage[name] = value || "";
				}
			}
		},
		get: function(name){
			var cookies, start, end, str;
			if(!name) return;
			if(typeof localStorage == "undefined"){	
				cookies = document.cookie.split(";");
				for(var i = 0; i < cookies.length; i++){
					str = cookies[i].split("=")[0];
					if(str.replace(/^\s*|\s*$/, "") == name){
						return unescape(cookies[i].split("=")[1]);
					}
				}
			}else{
				return localStorage[name];
			}
		},
		destory: function(name){
			if(typeof localStorage == "undefined"){
				document.cookie = name + '=; expires=' + (new Date('1970-01-01')).toGMTString();
			}else{
				delete localStorage[name];
			}
		}
	}
	
	cross = {
		oldValue: state.get("__statechange__"),
		newValue: state.get("__statechange__"),
		addListener: function(fn){
			typeof fn == "function" && listenFn.push(fn);
		},
		init: function(){
			var self = this;
			if(!self.newValue){
				state.set("__statechange__", "");
			}
			self._initListener();
		},
		_initListener: function(){
			var self = this;
			function temp(d){
				self.newValue = state.get("__statechange__");
				if(self.oldValue != self.newValue){
					self.oldValue = self.newValue;
					for(var i = 0; i < listenFn.length; i++){
						listenFn[i](d);
					}
				}
				
				timeoutid = setTimeout(function(){
					temp(d);
				}, 500);
			}
			temp(self);
		},
		set: function(value){
			state.set("__statechange__", value);
		},
		get: function(){
			return state.get("__statechange__");
		},
		destory: function(){
			clearTimeout(timeoutid);
			timeoutid = null;
			state.destory("__statechange__");
			listenFn = [];
		}
	}
	$.communication = cross;
})(window);