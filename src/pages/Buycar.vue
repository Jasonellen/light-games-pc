<template>
  <div class="buycar">
    <div class="wrap">
      <section class="screen">
        <div class="buycar-zupin">
          <h3>租凭
            <span class="allchenk">
              全选 <el-checkbox @change="allCheckZuFn" v-model="allCheckZu"></el-checkbox>
            </span>
          </h3>
          <CarItem
              v-for="(item, index) in rentItems"
              :key="item.cart_id"
              :item="item"
              :index="index"
              :type="2"
              :delGame="delGame"
              :move="move"
              :allCheck="allCheckZu"
          >
          </CarItem>
          <AddItem></AddItem>
          <h3>购买
            <span class="allchenk">
              全选 <el-checkbox @change="allCheckByFn" v-model="allCheckBy"></el-checkbox>
            </span>
          </h3>
          <CarItem
                  v-for="(item, index) in buyItems"
                  :key="item.cart_id"
                  :item="item"
                  :index="index"
                  :type="1"
                  :delGame="delGame"
                  :move="move"
          >
          </CarItem>
        </div>
        <div class="buycar-groom">
          <h3>更多推荐</h3>
          <HotItem v-for="(item, index) in recommendList" :item="item" :key="index"></HotItem>
        </div>
      </section>
    </div>
    <div class="wrap">
      <section class="screen">
        <div class="buycar-all">
          <div class="all-left">
            <span>
              租凭总价
              <strong>￥{{zlTotal}}</strong>
            </span>
            <span>
              购买总价
              <strong>￥{{ByTotal}}</strong>
            </span>
          </div>
          <div class="all-right">
            <div class="all-price">
              总价：<strong>￥{{total}}</strong>
            </div>
            <div class="all-btn" @click="submit">
              提交订单
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="notfoot"></div>
  </div>
</template>

<script>
	import HotItem from './games/HotItem'
	import CarItem from './buycar/CarItem'
	import AddItem from './buycar/AddItem'
	export default {
		name: 'buycar',
		components: {
			HotItem,
			CarItem,
			AddItem,
		},
		data(){
			return {
				recommendList : [],
				rentItems : [],//租
				buyItems : [],//买
				allCheckZu:false,
				allCheckBy:false,
			}
		},
		methods : {
			//租赁总
			allCheckZuFn(e){
				let {checked} = e.target;
				this.rentItems = this.rentItems.map(item=>({...item,...{checked} }))
			},
			//购买总
			allCheckByFn(e){
              let {checked} = e.target;
              this.buyItems = this.buyItems.map(item=>({...item,...{checked}}))
			},
			//删除游戏
			delGame(index,type,cartId){
				this.$confirm('确定要删除游戏?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					gameApi.deleteShopping.send({cartId})
					.then(({data,status})=>{
						let success = status == 200;
						if(success){
							this[type === 2 ? 'rentItems' : 'buyItems'].splice(index,1)
						}
						this.$message({
							type: success ? 'success' : 'warning',
							message: success ? '删除成功!' : '删除失败'
						});
					})

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			//立即购买或立即租赁
			move(index,type){
				let item = this[type === 2 ? 'rentItems' : 'buyItems'][index];
				this.$confirm(`你确定要移到${type === 1 ? '租赁' : '购买'}?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					gameApi.putInShoppingCart.send({
						goodsId:item.goods_id,
						orderGoodsType:type === 2 ? 1 : 2,
						goodsPrice:item.goods_price,
						goodsRentPrice:item.goods_rent_price,
						rentDay:type == 2 ? 0 : 10,
						amount:1
					})
					.then(({status,msg})=>{
						let success = status == 200;
						if(success)this.getCar();
						this.$message({
							message: success ? '成功' : (msg || '失败'),
							type: success ? 'success' : 'error'
						});
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消移动'
					});
				});

			},
			getCar(){
				//查询购物车
				gameApi.findShoppingCartByUserId.send({curIndex:1,pageSize:1000})
				.then(data=>{
					if(data.msg == 'success'){
						let newData = data.data.result
						newData.forEach(function(item){
							item.checked = false
						})
						this.rentItems = newData.filter((item)=>{
							return item.order_goods_type == 2
						})
						this.buyItems = newData.filter((item)=>{
							return item.order_goods_type == 1
						})
					}
				})
			},
      submit(){
				let list = [];
				list = this.buyItems.filter(({checked})=>checked).concat(this.rentItems.filter(({checked})=>checked))
                .map(({goods_id})=>goods_id);
				log(list)
                if(!list.length){
					this.$message({
						message: '请选择商品',
						type: 'warning'
					});
          	return;
          }
	      gameApi.generateOrder.send({goodsIdList:list.join(',')}).then(({status,msg,data})=>{
        	let success = status == 200;
        	if(success){
        		this.$router.push('/pay/' + data);
            }else{
  						this.$message({
  							message: msg,
  							type: 'warning'
  						});
            }
        })
      }
		},
		created(){
			//获取推荐数据
			gameApi.findDownRecommend.send({ curIndex:1, pageSize:4})
			.then(({data,status})=>{
				if(status!= 200)return;
				this.recommendList = data.result;
			})

			this.getCar();
		},
		computed : {
			total(){
				return this.zlTotal + this.ByTotal;
			},
			zlTotal(){
				return this.rentItems.reduce((pre,cur)=>{
					return pre + (cur.checked ? cur.rent_day * cur.goods_rent_price : 0);
				},0)
			},
			ByTotal(){
				return this.buyItems.reduce((pre,cur)=>{
					return pre + (cur.checked ? cur.goods_price * cur.amount : 0);
				},0)
			},
		}
	}

</script>


<style scoped lang="scss" rel="stylesheet/scss">
  .wrap{
    margin-top: 30px;
    overflow: hidden;
  }
  .screen{
    margin-bottom: 30px;
    overflow: hidden;
  }
  .buycar-zupin{
    float: left;
    width: 892px;
    overflow: hidden;
  }
  .buycar-zupin .allchenk{
    float: right;
    padding-right: 20px;
  }
  .buycar-groom{
    float: right;
    width: 286px;
  }
  h3{
    background-color: #fff;
    font-weight: 600;
    height: 50px;
    line-height: 50px;
    padding-left: 12px;
    border-bottom: 2px solid #145fdc
  }
  .buycar-all{
    width: 1200px;
    height: 78px;
    line-height: 80px;
    font-size: 18px;
    border: 1px solid #ddd;
    background-color: #e5e5e5;
    position: fixed;
    bottom: 0;
    left: 50%;
    z-index: 3;
    margin-left: -600px;
  }
  .buycar-all .all-left{
    float: left;
  }
  .buycar-all .all-left span{
    color: #333333;
    margin-left: 25px;
  }
  .buycar-all .all-left strong{
    color: #ff6c00;
  }
  .buycar-all .all-right{
    float: right;
    width: 300px;
  }
  .buycar-all .all-right .all-price{
    color: #ff6c00;
    float: left;
  }
  .buycar-all .all-right .all-btn{
    width: 140px;
    color: #fff;
    float: right;
    height: 78px;
    line-height: 80px;
    text-align: center;
    background-color: #145fdc;
  }
  .buycar{
    position: relative;
  }
  .buycar::before{
    content: "";
    background-color: #f7f7f7;
    height: 300px;
    width: 100%;
    position: absolute;
    bottom: -300px;
    left: 0;
    z-index: 2;
  }

</style>
