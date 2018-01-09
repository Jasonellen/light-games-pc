/*
* action
* **/
import {
	USER_INFO,
	SEARCH_LIST,
	HEAD_IMG
} from '../types';

export default {
	login({commit},payload){
		gameApi.findUserMemberLevel.send().then(result=>{
			let {status,data} = result;
			if(status === 200){
				let {userMemberLevel:vipLevel,userIdentity:userLevel} = data;
				commit(USER_INFO,{
					vipLevel,
					userLevel
				})
			}
		})
	},
	logout({commit}){
		commit(USER_INFO,{
			vipLevel:'',
			userLevel:''
		})
	},
	saveSearch({commit},payload){
		commit(SEARCH_LIST,payload)
	},
	headImgAction({commit},payload){
		commit(HEAD_IMG,payload)
	}
}