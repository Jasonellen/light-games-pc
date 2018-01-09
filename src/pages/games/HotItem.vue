<template>


  <div class="hotitem" :class="{'not-margin': notMarhin}" v-shadow>
    <router-link tag="div" :to="page">
      <div class="hotitem-pic" v-pic-optimize="item.goods_url">
      </div>
    
      <div class="hotitem-title">
          <div class="hotitem-text">
            <PlatformImg :type="item.platform" />
            <span class="game-cnname">{{item.game_name_cn}}</span>
          </div>
        <div class="hotitem-sale">
          <span v-if="item.goods_rent_count"><img src="../../assets/img/games/hot-zu.png" alt=""></span>
          <span v-if="item.goods_buy_count"><img src="../../assets/img/games/hot-shou.png" alt=""></span>
        </div>
      </div>
      <div class="hotitem-info">
        <div class="hotitem-star"><Evaluation :score="item.score"/></div>
        <div class="hotitem-surplus">库存：{{item.goods_count}}</div>
      </div>
    </router-link>
  </div>

</template>

<script>

export default {
  name: 'hotitem',
    props : {
  	  item : {type : Object,},
      index : {type:Number},
    },
    computed:{
  	  page(){
  	  	return `gamesdetail/${this.item.goods_id}`;
      },
		notMarhin(){
  	  	  if(this.index === undefined){
            return false;
          }else{
            return (this.index + 1)%4 === 1;
          }
        }
    },
}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
.gameshot1 .hotitem{
  cursor: pointer;
  margin-left: 17px;
}
.gameshot2 .hotitem{
  cursor: pointer;
  margin-left: 18px;
}
.hotitem{
  cursor: pointer;
  float: left;
  background-color: #fff;
  margin-top: 12px;
  .hotitem-pic{
    width: 285px;
    height: 356px;
    // line-height: 356px;
    img{
      height: 100%;
      width: 100%;
      vertical-align: middle;
      display: inline-block;
    }
  }
}
.game-cnname{
  width: 160px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.gameshot1 .hotitem:nth-child(2),.gameshot1 .hotitem:nth-child(5),.gameshot1 .hotitem:nth-child(8){
  margin-left: 0;
}
.gameshot2 .hotitem:nth-child(2),.gameshot2 .hotitem:nth-child(6),.gameshot2 .hotitem:nth-child(10){
  margin-left: 0;
}
.gameshot2 .hotitem.not-margin{margin-left: 0;}
.hotitem-title{
  padding: 8px 10px;
  overflow: hidden;
  height: 50px;
}
.hotitem-title .hotitem-text{
  font-size: 22px;
  line-height: 22px;
  height: 22px;
  float: left;
  /*background: url('../../assets/img/games/hot-icon-title.jpg') no-repeat center left;*/

  span{
    display: inline-block;
  }
}
.hotitem-title  a{
  color: #777;
}
.hotitem-title .hotitem-sale{
  float: right;
}
.hotitem-info{
  padding: 0px 10px;
  padding-bottom: 10px;
  overflow: hidden;
}
.hotitem-info .hotitem-star{
  float: left;
}
.hotitem-info .hotitem-surplus{
  float: right;
}
</style>
