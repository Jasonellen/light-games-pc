<template>
  <div class="gamedetail gamedetail-page">
    <div class="wrap">
      <section class="screen">
        <div class="navbar">
          <ul>
            <li @click="$router.push('/games')" style="cursor: pointer;">游戏库</li>
            <li>></li>
            <li>{{gameData.game_name_cn}}游戏详情页</li>
          </ul>
        </div>
        <div class="gd-main">
          <Carousel
                  v-if="videos.length > 0"
                  :list="videos"
                  :change="videoChange"
          >
            <div class="carousel-header">
              <iframe
                      :src="url"
                      frameborder=0
                      allowfullscreen>
              </iframe>
            </div>
          </Carousel>

          <h3>资讯</h3>
          <p style="line-height: 40px;padding-left: 12px;" v-if="zxList.length <= 0">暂无资讯</p>
          <Zixun  v-for="(item, index) in zxList" :item="item" :zx2="true" :key="index"></Zixun>
          <Moremsg v-if="!maxZx" @click.native="zxNext"></Moremsg>

          <h3>图片</h3>
          <p style="line-height: 40px;padding-left: 12px;" v-if="imgList.length <= 0" >暂无图片</p>
          <Carousel
                  v-if="imgList.length > 0"
                  :list="imgList"
                  :change="imgChange"
          >
            <div class="carousel-header">
              <img :src="lookImg" alt="">
            </div>
          </Carousel>
          <h3>玩家评论</h3>
          <p style="line-height: 40px;padding-left: 12px;" v-if="wjList.length <= 0">暂无评论</p>
          <PlayComment :upDate="upWjpl" isLogin="userInfo.userLevel" v-for="(item,index) in wjList" :key="index" :item="item"></PlayComment>
          <Moremsg v-if="!maxWj" @click.native="wjNext"></Moremsg>
        </div>
        <div class="gd-details">
          <Live v-on:upDate="upWjpl" :isLogin="userInfo.userLevel" :item="gameData"></Live>
        </div>
      </section>
    </div>
    <Footbar></Footbar>
  </div>
</template>

<script>
	import Carousel from './gamesdetail/Carousel'
	import Zixun from './index/ZixunItem.vue'
	import PlayComment from './gamesdetail/PlayComment'
	import Moremsg from '@/components/Moremsg'
	import Live from './gamesdetail/Live'
	import Footbar from '@/components/Footbar'
	import {Paging} from 'core';
	import {mapGetters} from 'vuex';
	export default {
		name: 'gamedetail',
		components: {
			Carousel,
			Zixun,
			Moremsg,
			PlayComment,
			Live,
			Footbar
		},
		data(){
			return {
				disabled : false,
				gameData : {},
				zxList : [],//资讯详情
				maxZx : true,
				zxLoad : false,
				imgList : [],
				wjList : [],
				maxWj : true,//是不是最大玩家评论了
				lookImg : '',
				videos:[],
				url:''
			}
		},
		computed : {
			...mapGetters(['userInfo']),
		},
		methods : {
			//资讯请求更多
			sendZx(){
				this.zxApi.send().then(({data,status})=>{
					if(status === 200){
						let {curIndex,totalRow,pageSize,result} = data;
						this.zxList.push(...result);
						this.maxZx = curIndex >= Math.ceil(totalRow/pageSize);
						this.zxLoad = false;
					}
				})
			},
			//资讯请求更多
			zxNext(){
				if(this.zxLoad)return;
				this.zxApi.curIndex++;
				this.sendZx();
				this.zxLoad = true;
			},
			//玩家评论请求跟多
			wjNext(){
				if(this.zxLoad)return;
				this.wjApi.curIndex++;
				this.sendWj();
				this.zxLoad = true;
			},
			//玩家评论
			sendWj(){
				this.wjApi.send().then(({data,status})=>{
					if(status === 200){
						let {curIndex,totalRow,pageSize,result} = data;
						if(curIndex === 1)this.wjList = [];
						this.wjList.push(...result);
						this.maxWj = curIndex >= Math.ceil(totalRow/pageSize);
						this.zxLoad = false;
					}
				})
			},
			upWjpl(){
				let {id:gameId} = this.$route.params;
				//玩家评论
				this.wjApi = new Paging({
					articleId : gameId,
					articleType : 0,
					pageSize : 4,
				},gameApi.findComment.send);
				this.sendWj();
			},
			//图片选择
			imgChange(item){
				this.lookImg = item.img_name;
			},
			videoChange(item){
				this.url = item.url
			}

		},
    beforeDestroy(){
      sessionStorage.setItem('loaded','')
    },
		created(){
      if(!sessionStorage.getItem('loaded')){
        sessionStorage.setItem('loaded',true)
        location.reload()
      }
			let {id:gameId} = this.$route.params;
			gameApi.findGameMethodById.send({gameId}).then(({data})=>{
				this.gameData = data;
				let {game_name_cn:name} = data;
				//获取资讯
				this.zxApi = new Paging({name,type : 3,pageSize : 4,},gameApi.findGameDetals.send);
				this.sendZx();

				//获取视频
				gameApi.findGameDetals.send({name,type:4, curIndex:1, pageSize:100})
				.then(({msg, data})=>{
					if(msg=='success'){
						this.url = (data.result[0] || {}).url
						this.videos = data.result
						this.videos.map(function(item){
							item.img_name = item.img
						})
					}
				})

				//获取游戏图片
				this.imgApi = new Paging({goodsId:gameId,pageSize : 20,},gameApi.fndMxLoadImgByGoodsIdPage.send);
				this.imgApi.send().then(({data,status})=>{
					this.imgList.push(...(data.result || []));
				})
				this.upWjpl();
			})
		}
	}
</script>


<style lang="scss" rel="stylesheet/scss">
  .gamedetail-page{
    iframe{
      width:100%;
      height:100%;
    }
    .wrap{
      overflow: hidden;
    }
    .title-label{
      li{float: left;}
    }
    .carousel{
      width: 818px;
      padding-bottom: 20px;
      .carousel-header{
        height: 460px;
        text-align: center;
        line-height:460px;
        cursor: pointer;
        img{
          max-height: 100%;
          max-width: 100%;
          vertical-align: middle;
        }
      }
      .carousel-footer{
        position: relative;
        height: 116px;
        margin-top: 16px;
        overflow: hidden;
        .swiper-container,.swiper-wrapper,.swiper-slide,img{
          height: 100%;
        }
        .swiper-slide{
          float: left;
          width: 208px;
          img{width: 100%;}
        }
        .swiper-button-prev,.swiper-button-next{
          position: absolute;
          top: 0;
          width: 54px;
          height: 100%;
          background: rgba(0,0,0,.6);
          color: #fff;
          font-size: 30px;
          text-align: center;
          line-height: 118px;
          cursor: pointer;
        }
        .swiper-button-prev{left: 0;}
        .swiper-button-next{right: 0;}
      }
    }
    .carousel-cell{
      height: 100%;
      text-align: center;
      width: 818px;
      height: 465px;
      img{
        vertical-align: middle;
        max-width: 100%;
        max-height: 100%;
      }
    }

    .screen{
      margin-bottom: 30px;
      overflow: hidden;
    }
    .navbar{
      overflow: hidden;
      margin: 5px 0;
    }
    .navbar li{
      float: left;
      color: #999;
      line-height: 30px;
      margin-left: 8px;
    }
    h3{
      background-color: #fff;
      font-weight: 600;
      height: 50px;
      line-height: 50px;
      padding-left: 12px;
      border-bottom: 2px solid #145fdc
    }
    .gd-main{
      width: 818px;
      float: left;
    }
    .gd-details{
      float: right;
    }

  }

</style>
