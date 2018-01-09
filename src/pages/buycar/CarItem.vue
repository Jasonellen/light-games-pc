<template>
  <div class="caritem aaaa" v-shadow>
    <div class="caritem-pic" v-pic-optimize="item.goods_url">
    </div>
    <div class="car-wrap">
      <div class="caritem-head">
        <div class="ci-title">
          {{item.goods_name}}
          <span v-if="item.game_name_en">（{{item.game_name_en}}）</span>
        </div>
        <div class="ci-nums">
          <span class="ci-number">{{type == 2 ? '天数' : '数量'}}
            <el-input-number
                v-if="type== 1"
                size="small"
                :min="min"
                :max="max"
                :step="1"
                v-model="item.amount"
                @change="change"
            >
            </el-input-number>
            <el-input-number
                    v-else
                    size="small"
                    :min="min"
                    :max="max"
                    :step="1"
                    v-model="item.rent_day"
                    @change="change"
            >
            </el-input-number>
          </span>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span class="ci-chenk">选择 <el-checkbox v-model="item.checked"></el-checkbox></span>
        </div>
      </div>
      <div class="caritem-subtitle">
        版本：{{item.edition==0 ? '港行':item.edition==1 ?'国行' :item.edition==2?'美版':'日版' }}
      </div>
      <div class="caritem-info">
        <div class="caritem-pirce">
          {{type == 2 ? '租赁价' : '购买价'}}：￥{{type == 2 ? item.goods_rent_price : item.goods_price}}
          <span>市场价：{{item.goods_price}}元</span>
        </div>
        <div class="caritem-operation">
          <div class="delect-game" @click="delGame(index,type,item.cart_id)">
            删除游戏
          </div>
          <div class="move-game" @click="move(index,type)">
            移到{{type == 1 ? '租赁' : '购买'}}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
	import _ from 'lodash';
	export default {
		name: 'caritem',
		props : {
			item : {type : Object},
			index : {type : Number},
			delGame : {type : Function},
			type : {type : Number,},//租赁还是购买
			move : {type : Function,},//移动
		},
		methods : {
			getAnswer : _.debounce(
				function (amount,orderGoodsType,goodsId) {
					gameApi.updateShoppingCartGoodsCount.send({
						parameter:JSON.stringify([
							{goodsId,amount,orderGoodsType,}
						]),
					})
				},
				// 这是我们为用户停止输入等待的毫秒数
				300
			),
			change(newVal){
				this.getAnswer(newVal,this.type,this.item.goods_id)
			}
		},
		computed:{
			max(){
				return this.type == 1 ? this.item.goods_buy_count : 9999
			},
			min(){
				return this.type == 1 ? 1 : 10
			}
		}
	}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
  .caritem{
    padding: 30px;
    padding-right: 25px;
    margin-top: 15px;
    overflow: hidden;
    background: #fff;
  }

  .caritem-pic{
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
    float: left;
    img{
      max-width: 100%;
      max-height: 100%;
      vertical-align: middle;
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

  .caritem-operation .move-game,.caritem-operation .delect-game{
    float: left;
    padding-left: 30px;
    margin-left: 12px;
    display: inline-block;
  }
  .caritem-operation .move-game{
    background: url('../../assets/img/buycar/move-game.png') no-repeat;
  }
  .caritem-operation .delect-game{
    background: url('../../assets/img/buycar/delect-game.png') no-repeat;
  }
</style>
