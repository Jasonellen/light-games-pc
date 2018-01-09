import Vue from 'vue';

import ElementUI from 'element-ui'

Vue.use(ElementUI);

import Evaluation from '../components/Evaluation.vue';
import PlatformImg from '../components/PlatformImg.vue';

Vue.component(Evaluation.name,Evaluation);
Vue.component(PlatformImg.name,PlatformImg);

//swiper插件
import VueAwesomeSwiper from 'vue-awesome-swiper';
Vue.use(VueAwesomeSwiper);





//filters

Vue.filter('supportCh',function (val) {
	return val === '1' ?'支持' : '不支持';
})

Vue.directive('shadow', {
  bind: function (el) {
  	el.onmouseover = function(){
  		el.style['-webkit-box-shadow'] = '0 0 20px #888888'
  		el.style['-moz-box-shadow'] = '0 0 20px #888888'
  		el.style.boxShadow = '0 0 20px #888888'
  	}
  	el.onmouseout = function(){
  		el.style['-webkit-box-shadow'] = 'none'
  		el.style['-moz-box-shadow'] = 'none'
  		el.style.boxShadow = 'none'
  	}
  }
})

// 注册 (指令函数)
Vue.directive('pic-optimize', {
	bind (el, binding, vnode) {
		el.style.backgroundImage = `url(${binding.value})`;
		el.style.backgroundSize = `cover`;
		el.style.backgroundPosition = `center center`;
		el.style.backgroundRepeat =  'no-repeat';
	},
	update(el, binding, vnode){
		el.style.backgroundImage = `url(${binding.value})`;
	}
})