<template>
  <div class="live">
    <div class="live-pic"  v-pic-optimize="item.img">
    </div>
    <div class="live-main">
      <div class="live-title">
        {{item.game_name_cn}}
      </div>
      <div class="live-title-en">
        {{item.game_name_en}}
      </div>
      <div class="live-pingfen">
        评分：<Evaluation :score="item.score"/></div>

      <div class="live-date">
        上市时间:  {{(item.create_date || '').split(' ').shift()}}
      </div>
      <div class="live-attr">
        游戏属性:  {{item.game_type}}
      </div>
      <div class="live-lang">
        官方中文:  {{item.is_support_CN | supportCh}}
      </div>
      <div class="live-platform">
        支持平台:
        <PlatformImg :type="item.platform" />
      </div>

      <div class="live-info">
        <span class="addplay" @click="addWantPay(item.goods_id)">
          加入想玩
        </span>
        <span class="nowbuy" @click="addToShop(1)">
          立即购买
        </span>
      </div>
      <div class="live-zupin" @click="addToShop(2)">
        立即租凭
      </div>

      <div class="live-comment" @click="pingl">
        发表评论
      </div>
    </div>
  </div>

  </div>

</template>

<script>
	export default {
		name: 'live',
		props : {
			item : {type : Object,},
			isLogin : {},
		},
		methods: {
			//添加想玩
			addWantPay(goodsId){
				GAME.checkLogin().then(agu=>{
					if(!agu)return;
					gameApi.saveUserPlay.send({goodsId}).then(({msg,status})=>{
						let success = status == 200;
						this.$message({
							message: success ? '加入成功' : msg,
							type: success ? 'success' : 'error'
						});
					})
				})
			},
			//立即购买或立即租赁
			addToShop(orderGoodsType){
				GAME.checkLogin().then(agu=>{
					if(!agu)return;
					// if(this.disabled)return;
					gameApi.putInShoppingCart.send({
						goodsId:this.item.goods_id,
						orderGoodsType,
						goodsPrice:this.item.goods_price,
						goodsRentPrice:this.item.goods_rent_price,
						rentDay:orderGoodsType == 1 ? 0 : 10, amount:1
					})
					.then(({status,msg})=>{
						let success = status == 200;
						this.$message({
							message: success ? '成功' : (msg || '失败'),
							type: success ? 'success' : 'error'
						});
					})
				})

			},
			pingl(){

				GAME.checkLogin().then(agu=>{
					if(!agu)return;
					GAME.pingLun({
						title : '评论',
						placeholder : '请发表评论',
						sure : (commentText)=>{
							let {id:articleId} = this.$route.params;
							gameApi.insertComment.send({commentText, articleId, articleType:0})
							.then(({msg,status})=>{
								let success = status == 200;
								this.$message({
									message: success ? '评论成功' : msg || '评论失败',
									type: success ? 'success' : 'error',
								});
								if(success)this.$emit('upDate');
								GAME.close();
							})
						}
					})
				})

			}
		},
		computed : {
			disabled(){
				return this.item.goods_count <= 0;
			}
		}
	}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
  .live{
    width: 364px;
    background: #fff;
    overflow: hidden;
    margin-bottom: 30px;
  }
  .live-pic{
    width: 364px;
    height: 460px;
    line-height: 460px;
    img{
      max-width: 100%;
      max-height: 100%;
      display: inline-block;
      vertical-align: middle;
    }
  }
  .live-main{
    padding: 20px;
  }
  .game-des{
    padding: 0 20px;
  }
  .live-main .live-title{
    font-size: 22px;
    margin-bottom: 4px;
  }
  .live-main > div{
    margin-bottom: 10px;
  }
  .live-platform img{
    vertical-align: bottom;
  }
  .live-main .live-title-en{
    color: #777;
    margin-bottom: 25px;
  }
  .nowbuy,.addplay,.live-zupin,.live-comment{
    cursor: pointers;
    border: 1px solid #145fdc;
    display: inline-block;
    width: 145px;
    line-height: 45px;
    color: #145fdc;
    border-radius: 10px;
    padding-left: 50px;
    height: 45px;
    background-repeat: no-repeat;
    font-size: 16px;
    background-position: 20px 7px;
    margin-top: 20px;
  }
  .addplay:visited{
    background-color: #999999;
  }
  .nowbuy{
    background-image: url('../../assets/img/gamesdetail/buy.png');
    margin-left: 15px;
    cursor:pointer;
  }
  .addplay{
    background-image: url('../../assets/img/gamesdetail/add.png');
    cursor:pointer;
  }
  .live-zupin{
    cursor:pointer;
    width: 320px;
    color: #fff;
    padding-left: 120px;
    background:#145fdc url('../../assets/img/gamesdetail/zupin.png') no-repeat 90px 7px;
  }
  .live-comment{
    width: 320px;
    padding-left: 130px;
    border-radius: 0;
    border: 1px solid #999;
    height: 55px;
    color: #777;
    font-size: 18px;
    line-height: 55px;
    background:#fff url('../../assets/img/gamesdetail/pinglun.png') no-repeat 90px 12px;
  }
</style>
