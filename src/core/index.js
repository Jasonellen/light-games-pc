/**
 *
 *  公用模块入口
 *
 * **/
import Vue from 'vue';

export const publish = new Vue();//发布订阅者
export {default as userInfo} from './userInfo';//存储用户信息操作 写入local
export {default as Paging} from './Paging';//分页加载