<template>
  <div class="games games-page">
    <div class="wrap">
      <section class="screen">
        <div class="games-banner" @click="$router.push(`gamesdetail/${bigImg.info_id}`)">
          <img :src="bigImg.img_name" alt="">
        </div>
        <div class="games-adver scroll-optimize">
          <AdverImgs :bannerlink="bannerlink" :items='rightImgList'></AdverImgs>
        </div>
      </section>

      <section class="screen">
        <div class="games-hot gameshot1">
          <h3>热门</h3>
          <HotItem v-for="(item, index) in hotList" :item="item" :key="index"></HotItem>
        </div>
        <div class="games-comment">
          <h3>热门评论</h3>
          <div class="hot-warp scroll-optimize">
            <HotComment v-for="(item, index) in hotPl" :item="item" :key="index"></HotComment>
          </div>
        </div>
      </section>
    </div>
    <section class="screen">
      <img width="100%" src="../assets/img/games/longbanner.jpg" alt="">
    </section>
    <div class="wrap">
      <section class="screen">
        <div class="games-hot gameshot2">
          <div class="gameshot-ranking">
            <ul class="select-navs">
              <li v-for="(item,index1) in selectList" :key="index1">
                <el-popover
                    popper-class="login-select-warp"
                    placement="bottom"
                    title=""
                    width="200"
                    top = "-20"
                    trigger="hover">
                  <div class="login-select">
                    <p
                      :class="{cur:item2.checked}"
                      v-for="(item2,index2) in item.sub"
                      :key="index2"
                      @click="selectChange(index1,index2,item2.checked)"
                    >
                      {{item2.label}}
                    </p>
                  </div>
                  <div slot="reference" class="select-label">{{item.title}}
                    <i class="select-icon el-icon-arrow-down"></i>
                    <span class="line"></span>
                  </div>
                </el-popover>
              </li>
            </ul>
          </div>
          <HotItem v-for="(item, index) in selectGages" :index="index" :item="item"  :key="index"></HotItem>

        </div>
        <div class="look-more" @click="loadMoreGames" v-if="!selectMax">更多游戏</div>
      </section>
    </div>
    <Footbar></Footbar>
  </div>
</template>

<script>
	import AdverImgs from './games/AdverImgs'
	import Titlebar from '@/components/Titlebar'
	import HotItem from './games/HotItem'
	import HotComment from './games/HotComment'
	import Footbar from '@/components/Footbar'
	import gamelist from './games/gameList';
	import {Paging} from 'core';
	let arr = ['buzzType','platformType','gameType','language'];
	export default {
		name: 'games',
		components: {
			AdverImgs,
			Titlebar,
			HotItem,
			HotComment,
			Footbar
		},
		data(){
			return {
        bigImg:{},
        rightImgList:[],
				selectList : [],
				selectGages : [],
				selectMax : true,
				selectLoad : false,
				hotList : [],
        hotPl : [],//热门评论
			}
		},
		created(){
			this.selectList = [...gamelist];
			this.createdSelectApi();

			//热门加载
			this.hotGameApi = new Paging({gameType:'hotSale'},gameApi.findNewGame.send);
			this.hotGameApi.send().then(({status,data})=>{
				let {result} = data;
				this.hotList = result || [];
			})

			//热门评论
			gameApi. findHotComment.send().then(({status,data,msg})=>{
              if(status == 200){
              	this.hotPl.push(...(data.result || []))
              }
			})

            //banner图
            gameApi.findUnLoadImg.send({gameImg:2}).then(({status,data})=>{
                // this.home_bannerList = [...data];
                if(status == 200){
                	log(data)
                  this.bigImg = data[0]
                    log('this.bigImg',this.bigImg)
                  this.rightImgList = data || [];
                }
            })
		},
		methods : {
			//下拉选择
			selectChange(i1,i2,checked){
				this.$set(this.selectList[i1].sub[i2],'checked',!checked);
				this.createdSelectApi();
			},
			createdSelectApi(){
				this.findGame = new Paging({...this.filtersGame,...{pageSize : 8}},gameApi.findCheckBoxGame.send);
				this.send();
			},
			//人气排行 游戏平台 ...  请求
			send(){
				this.findGame.send().then(({status,data})=>{
					let {curIndex,pageSize,totalRow,result} = data;
					if(curIndex == 1)this.selectGages = [];
					this.selectGages.push(...result);
					this.selectMax = curIndex >= Math.ceil(totalRow/pageSize);
					this.selectLoad = false;
				})
			},
			//加载更多游戏  人气排行 游戏平台 ...  请求
			loadMoreGames(){
				if(this.selectLoad || this.selectMax)return;
				this.findGame.curIndex++;
				this.send();
				this.selectLoad = true;
			},
			bannerlink(index){
				this.bigImg = this.rightImgList[index];
            }
		},
		computed : {
			filtersGame(){
				let result = {};
				let _index = 0;
				this.selectList.map(({sub},index)=>{
					let names = arr[index];
					sub.forEach(item=>{
						if(item.checked){
							let list = result[names] || [];
							list.push(item.label);
							result[names] = list;
							_index++;
						}
					})
					if(result[names]){
						result[names] = result[names].join(',')
					}
				})        
				return _index ? result : {};
			}
		}
	}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .look-more{cursor: pointer;}
  .games-page{
    .wrap{
      margin-top: 30px;
      overflow: hidden;
    }
    .screen{
      margin-bottom: 30px;
      overflow: hidden;
    }
    .games-banner{
      cursor: pointer;
      float: left;
      width: 892px;
      height: 502px;
      overflow: hidden;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .games-adver{
      float: right;
      width: 298px;
      height: 502px;
      overflow-y: scroll;
      overflow-x: hidden;
    }
    .games-hot{
      width: 890px;
      float: left;
      overflow : hidden;
    }
    .hot-warp{
      height: 882px;
      overflow-y: auto;
    }
    .gameshot2{
      float: none;
      width: auto;
    }
    h3{
      background-color: #fff;
      font-weight: 600;
      height: 50px;
      line-height: 50px;
      padding-left: 12px;
      border-bottom: 2px solid #145fdc
    }
    .games-comment{
      width: 298px;
      float: right;
    }
    .gameshot-ranking{
      margin-bottom: 30px;
      overflow: hidden;
      width: 100%;
      background: #fff;
      .select-label{
        color: #222;
        text-align: center;
      }
    }
    .gameshot-ranking li{
      position: relative;
      float: left;
      height: 68px;
      line-height: 68px;
      border-bottom: 2px solid #145fdc;
      text-align: center;
      width: 300px;
      color: #222;
      font-size: 16px;
      &>span{display: block;width: 100%;}
      .select-icon{
        color: #222;
        margin-left: 6px;
        display: inline-block;
        vertical-align: middle;
      }
      .line{
        height: 20px;
        width: 1px;
        background: #222;
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -10px;
      }
      &:last-child{
        .line{display: none;}
      }
    }
  }

</style>
