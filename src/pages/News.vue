<template>
  <div class="news news-page">
    <div class="wrap">
      <div class="news-nav">
        <ul>
          <li  @click="toPage('热门')"  :class="{active:search == '热门'}" class="active-dian">最新</li>
          <li  @click="toPage('PS4')"  :class="{active:search == 'PS4'}" >PS4</li>
          <li  @click="toPage('XBOX')"  :class="{active:search == 'XBOX'}">Xbox</li>
          <li  @click="toPage('VPS')"  :class="{active:search == 'VPS'}">PSV</li>
          <li  @click="toPage('SWITCH')"  :class="{active:search == 'SWITCH'}">Switch</li>
          <li  @click="toPage('WII')"  :class="{active:search == 'WII'}">WII</li>
          <li  @click="toPage('其他')"  :class="{active:search == '其他'}">其他</li>
        </ul>
      </div>
      <div class="news-content">
        <Bigitem v-for="(item,index) in first" :key="index" :item="item"></Bigitem>
        <Item v-for="(item,index) in content" :key="index" :item="item"></Item>
      </div>

      <!-- <div class="news-zhuanti">
        <Zhuanti></Zhuanti>
      </div> -->
      <div class="news-content2">
        <Item v-for="(item,index) in last" :key="index" :item="item"></Item>
      </div>
      <Moremsg @click.native="next" v-if="!max"></Moremsg>
    </div>
    <Footbar></Footbar>
  </div>
</template>

<script>
	import Bigitem from './news/Bigitem'
	import Item from './news/Item'
	import Zhuanti from './news/Zhuanti'
	import Moremsg from '@/components/Moremsg'
	import Footbar from '@/components/Footbar'
	import axios from 'axios'
  import {Paging} from 'core';
	export default {
		name: 'news',
		data: function() {
			return {
        results: [],
        max : true,
        load : false,
        search:'热门'
			}
		},
    watch: {
        // $route(){
        //   log(this.$route,11111)
        // 	this.init();
        // }
    },
		created(){
//			平台资讯传 var param = {platform:'平台名称', curIndex :1, pageSize :5}
        this.init('热门');
		},
		methods: {
      toPage(platform){
        this.search = platform
        this.init(platform);
      },
			init(platform){
  			// let {platform} = this.$route.params;
  			this.findApi = new Paging({
          platform,pageSize:8},gameApi.findGameDetals.send)
  			  this.send();
        },
        next(){
  				if(this.load)return;
  				this.findApi.curIndex++;
  				this.send();
  				this.load = true;
        },
  			send(){
            
  				this.findApi.send().then(({status,msg,data})=>{
            if(status == 200){
              if(data){
                let {curIndex,pageSize,totalRow,result} = data;
                if(curIndex== 1)this.results = [];
                this.max = curIndex >= Math.ceil(totalRow/pageSize);
                this.results.push(...result);
              }else{
                this.results=[]
                this.max=true
              }
            	
            }
            this.load = false;
          })
      }
		},
		computed : {
			first (val){
				return this.results.filter((item,i)=>(i === 0));
			},
			content(){
				return this.results.filter((item,i)=>(i>0 && i<7));
			},
			last(){
				return this.results.filter((item,i)=>(i >= 7));
			},
		},
		components: {
			Bigitem,
			Item,
			Zhuanti,
			Moremsg,
			Footbar
		}
	}
</script>

<style scoped>

  .wrap{
    margin-top: 30px;
    overflow: hidden;
  }
  .news-nav{
    background-color: #fff;
    height: 80px;
    margin-bottom: 20px;
  }
  .news-nav li{
    display: block;
    text-decoration: none;
    height: 78px;
    float: left;
    width: 171px;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    border-bottom: 2px solid #fff;
    line-height: 78px;
    cursor: pointer;
  }
  .news-nav li.active{
    border-bottom: 4px solid #145fdc;
    color: #145fdc;
  }
  .news-content,.news-content2{
    overflow: hidden;
  }
  .active-dian{
    position: relative;
  }
  .active-dian::before{
    position: absolute;
    content: "";
    right: 50px;
    top: 30px;
    width: 8px;
    background-color: #145fdc;
    height: 8px;
    border-radius: 50%;
  }

</style>
