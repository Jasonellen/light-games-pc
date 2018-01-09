import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import News from '@/pages/News'
import Games from '@/pages/Games'
import Buycar from '@/pages/Buycar'
import GamesDetail from '@/pages/GamesDetail'
import NewsDetail from '@/pages/NewsDetail'
import SureOrder from '@/pages/SureOrder'
import PaySure from '@/pages/Pay'
import Search from '@/pages/Search'

import User from '@/pages/User'
import UserData from '@/pages/user/Data'
import UserGbi from '@/pages/user/Gbi'
import Userwallet from '@/pages/user/Wallet'
import UserRecord from '@/pages/user/Record'
import UserGame from '@/pages/user/Game'
import UserVip from '@/pages/user/Vip'
import UserAddr from '@/pages/user/Addr'
import UserRule from '@/pages/user/Rule'
import UserIssue from '@/pages/user/Issue'
import UserCall from '@/pages/user/Call'
import Test from '@/pages/test'

import {publish} from '../core';

import Api from '@/pages/API'



Vue.use(Router);


let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/news',
      name: 'News',
      component: News
    },
    {
      path: '/games',
      name: 'Games',
      component: Games
    },
    {
      path: '/buycar',
      name: 'Buycar',
      component: Buycar
    },
    {
      path: '/gamesdetail/:id',
      name: 'GamesDetail',
      component: GamesDetail
    },
    {
      path: '/newsdetail/:id',
      name: 'NewsDetail',
      component: NewsDetail
    },
	  {
		  path: '/search',
		  name: 'search',
		  component: Search
	  },
	  {
		  path: '/pay/:orderId',
		  name: 'SureOrder',
		  component: SureOrder
	  },
	  {
		  path: '/paysure/:orderId',
		  name: 'PaySure',
		  component: PaySure
	  },
	  {
		  path: '/test',
		  name: 'Test',
		  component: Test
	  },
    {
      path: '/user',
      name: 'User',
      component: User,
      children: [
        {  path: '', component: UserData },
        {  path: 'gbi',  component: UserGbi},
        {  path: 'wallet', component: Userwallet },
        {  path: 'record',  component: UserRecord},
        {  path: 'game', component: UserGame },
        {  path: 'vip',  component: UserVip},
        {  path: 'addr', component: UserAddr },
        {  path: 'rule',  component: UserRule},
        {  path: 'issue', component: UserIssue },
        {  path: 'call',  component: UserCall},
      ]
    },
    {
        path: '/api',
        name: 'Api',
        component: Api
    },
  ],

})

router.beforeEach((to, from, next) => {
	if(to.name !== 'search')publish.$emit('clearSearchValue');
  document.documentElement.scrollTop = to.query.scrollTop || 0;
  next()
})

export default router
