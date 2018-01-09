// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';//你按保存
import Vue from 'vue';
import App from './App';
import router from './router';
import 'lodash';
import './core/extend';
import './core/components';
import 'element-ui/lib/theme-default/index.css';
import "./scss/base.scss";
import './awesome.less';
Vue.config.productionTip = false;
/* eslint-disable no-new */
import store from './vuexer';
new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
})
