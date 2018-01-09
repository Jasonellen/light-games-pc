/**
 * getters
 * */


export default {
	userInfo (state){
		return state.userInfo || {};
	},
	searchList(state){
		return state.searchList || [];
	},
	headImg(state){
		return state.headImg || [];
	}
}