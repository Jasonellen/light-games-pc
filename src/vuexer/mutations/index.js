/**
 * mutations
 * */
import Vue from 'vue';
import {
	USER_INFO,
	SEARCH_LIST,
	HEAD_IMG
} from '../types';

export default {
	[USER_INFO](state,payload){
		Object.assign(state.userInfo,payload);
	},
	[SEARCH_LIST](state,payload){
		state.searchList = payload || [];
	},
	[HEAD_IMG](state,payload){
		state.headImg = payload || [];
	}
}