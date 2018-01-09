<template>
  <div class="caritem">
    <div class="caritem-pic">
      <img :src="item.url" alt="">
    </div>
    <div class="car-wrap">
      <div class="caritem-head">
        <div class="ci-title">
          {{item.gameNameCn}}
          <span v-if="item.gameNameEn">（{{item.gameNameEn}}）</span>
        </div>
      </div>
      <div class="caritem-subtitle">
        <span>{{(item.nowPlayCount || item.inThePlay || '0')}}人在玩</span>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span>{{(item.wantPlayCount || item.wantGame || '0')}}人想玩</span>
      </div>
      <div class="caritem-info">
        <div class="caritem-pirce">
          {{storeage}}
        </div>
        <div class="caritem-operation" v-if="type==1">
          <span class="user-btn user-btn-detail"  v-if ='type == 1' :class="{disabled:item.goodsBuyCount <= 0}" @click="buyOrRent(item,1)">再次购买</span>
          <!--<span class="user-btn user-btn-detail" v-if ='item.orderGoodsType != 1' @click="buyOrRent(item,1)">购买</span>-->
          <!--<span class="user-btn user-btn-detail" v-if ='item.orderGoodsType != 1' @click="inThePlayGive(item)" >归还</span>-->
          <!--<span class="user-btn user-btn-detail" v-if ='item.orderGoodsType != 1' @click="inThePlayRelet(item)">续租</span>-->
        </div>
        <div class="caritem-operation" v-if="type==2">
          <span class="user-btn user-btn-detail" :class="{disabled:item.goodsBuyCount <= 0}" @click="buyOrRent(item,1)">购买</span>
          <span class="user-btn user-btn-detail" :class="{disabled:item.goodsRentCount <= 0}" @click="buyOrRent(item,2)">立即租</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
	export default {
		name: 'caritem',
		props : {
			item : {type : Object},
			type : {type : String},
			inThePlayGive : {type:Function},
			inThePlayRelet : {type:Function},
		},
		methods : {
			//购买或租
			buyOrRent({goodsId,goodsCount,goodsBuyCount,goodsRentCount},type){
				if(type == 1 && goodsBuyCount <= 0)return;
				if(type == 2 && goodsRentCount <= 0)return;

				let params = {
					orderGoodsType : type,
					rentDay : type == 1 ? 0 : 30,
					amount : 1,
					goodsId
				}
				gameApi.putInShoppingCart.send(params).then(({status,msg})=>{
					let success = status === 200;
					this.$message({
						message: success ? '成功' : msg || '失败',
						type: success ? 'success' : 'error',
					});
				})
			},

		},
		computed : {
			storeage(){
				let {item} = this;
				if(this.type == 2){
					return item.goodsCount > 0 ? '库存：'+ item.goodsCount : '等待商品返库';
				}else{
					return item.order_goods_type == 2 ? `剩余归还时间${item.day}天${item.hour}小时` : '';
				}
			}
		}

	}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
  .caritem{
    /*width: 838px;*/
    padding: 13px 30px;
    padding-right: 25px;
    overflow: hidden;
    background: #fff;
    margin-bottom: 15px;
  }
  .caritem-pic{
    width: 120px;
    float: left;
    height: 120px;
    img{
      width: 120px;
      height: 120px;
    }
  }
  .car-wrap{
    margin-left: 30px;
    width: 680px;
    float: left;
  }
  .caritem-head{
    overflow: hidden;
  }
  .ci-title{
    font-size: 22px;
    float: left;
  }
  .ci-title span{
    font-size: 14px;
    color: #999;
  }
  .ci-nums{
    float: right;
  }
  .caritem-subtitle{
    font-size: 16px;
    margin-top: 10px;
  }
  .caritem-info{
    overflow: hidden;
    margin-top: 32px;
  }
  .caritem-pirce{
    float: left;
    font-size: 16px;
    color: #ff6c00;
  }
  .caritem-pirce span{
    color: #999;
    font-size: 14px;
    padding-left: 10px;
    text-decoration: line-through;
  }
  .caritem-operation{
    float: right;
  }
  .user-btn{
    padding: 2px 6px;
    font-size: 14px;
    float: left;
    margin-left: 12px;
    border-radius: 5px;
    line-height: 24px;
    min-width: 80px;
    text-align: center;
    border: 1px solid #145fdc;
    text-decoration: none;
  }
  .user-btn-detail{
    color: #fff;
    background-color: #145fdc
  }
  .user-btn-detail.disabled{
    background: #ccc;
    border: #ccc;
  }
</style>
