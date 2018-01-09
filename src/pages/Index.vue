<template>
  <div class="index">
    <Banner></Banner>
    <div class="wrap">
      <Zixun
        :list="list"
        :load="load"
        :max="max"
      ></Zixun>
      <Guize></Guize>

    </div>
    <Footbar></Footbar>
  </div>
</template>

<script>
	import Banner from './index/Banner'
	import Zixun from './index/Zixun'
	import Guize from './index/Guize'
	import vmodal from 'vue-js-modal'
	import Vue from 'vue'
	import GoAlipay from '@/components/GoAlipay';
	import Report from '@/components/Report'
	import Footbar from '@/components/Footbar'
    import vue from 'vue';
	vue.use(vmodal)
	import {Paging} from 'core';


	export default {
		name: 'index',
		components: {
			Banner,
			Zixun,
			Guize,
			GoAlipay,
			Report,
			Footbar
		},
		data(){
			return {
				list : [],
                max : true,
                isLoad : false,
			}
		},
		methods : {
			//获取资讯信息
			zxSend(){
				this.zxApi.send().then(({status,data})=>{
                    let {curIndex,pageSize,totalRow,result} = data;
                    this.list.push(...result);
                    this.max = curIndex >= Math.ceil(totalRow/pageSize);
					this.isLoad = false;
				})
			},
            //加载更多
			load(){
                if(this.max || this.isLoad)return;
                this.isLoad = true;
				this.zxApi.curIndex++;
				this.zxSend();
            }
		},
		created(){
			this.zxApi = new Paging({
				type : 3,
				pageSize : 4,
			},gameApi.findGameDetals.send);
			this.zxSend();
		}
	}
</script>

<style lang="sass" scoped>
  @import "../assets/css/common"
  @import "../assets/css/index.css"
</style>
