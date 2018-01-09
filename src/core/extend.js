/*
 *
 *这里是公用函数扩展的地方
 * */

import gameApi from '../API/api';
import userInfo from './userInfo';
import {publish} from './index';
import store from '../vuexer';
//扩展对象
if (typeof Object.assign != 'function') {
	Object.assign = function(target) {
		'use strict';
		if (target == null) {
			throw new TypeError('Cannot convert undefined or null to object');
		}
		
		target = Object(target);
		for (var index = 1; index < arguments.length; index++) {
			var source = arguments[index];
			if (source != null) {
				for (var key in source) {
					if (Object.prototype.hasOwnProperty.call(source, key)) {
						target[key] = source[key];
					}
				}
			}
		}
		return target;
	};
}
if (!Array.prototype.filter)
{
	Array.prototype.filter = function(fun /* , thisArg*/)
	{
		"use strict";
		
		if (this === void 0 || this === null)
			throw new TypeError();
		
		var t = Object(this);
		var len = t.length >>> 0;
		if (typeof fun !== "function")
			throw new TypeError();
		
		var res = [];
		var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
		for (var i = 0; i < len; i++)
		{
			if (i in t)
			{
				var val = t[i];
				
				// NOTE: Technically this should Object.defineProperty at
				//       the next index, as push can be affected by
				//       properties on Object.prototype and Array.prototype.
				//       But that method's new, and collisions should be
				//       rare, so use the more-compatible alternative.
				if (fun.call(thisArg, val, i, t))
					res.push(val);
			}
		}
		
		return res;
	};
}

//扩展localhost

let local = {
	get(name){
		return window.localStorage[name];
	},
	set(name,val){
		window.localStorage[name] = val;
	},
	del(name){
		delete window.localStorage[name];
	}
}



/**
 * 常见控制台函数
 * */
let log,warn,info;
log = (...agu)=>console.log(...agu);
warn = (...agu)=>console.warn(...agu);
info = (...agu)=>console.info(...agu);


/**
 * 登陆 注册 会员
 * */

let GAME = {
	
	//登陆
	login(config = {}){
		let step = config.step || 3;
		publish.$emit('dialog-show',{
			title : step == 3 ? '登陆' : '注册',
			view : 'Login',
			show : true,
			options : {
				step,
			}
		})
	},
	pingLun(config = {}){
		publish.$emit('dialog-show',{
			title : config.title,
			view : 'PligLun',
			show : true,
			options : config
		})
	},
	close(){
		publish.$emit('dialog-show',{
			show : false,
		})
	},
	checkLogin(){
		if(!store.state.userInfo.userLevel){
			publish.$emit('dialog-show',{
				view : 'gologin',
				show : true
			})
			return Promise.resolve(false);
		}
		return Promise.resolve(true);
	},
	checkedVip(){
		return GAME.checkLogin().then((agu)=>{
			if(!agu)return;
			if(!store.state.userInfo.vipLevel){
				publish.$emit('dialog-show',{
					view : 'govip',
					show : true
				})
				return Promise.resolve(false);
			}
			return Promise.resolve(true);
		})
	}
}



//扩展window对象上面的属性
Object.assign(window,{
	log,warn,info,gameApi,local,GAME,
})



Object.assign(String.prototype,{
	isPhone(){
		return /^1[34578]\d{9}$/.test(this);
	},
	isCode(){
		
	}
})



