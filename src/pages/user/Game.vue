<template>
  <div class="usergame">
    <div class="user-tabs">
      <ul>
        <li @click="index=1" :class="{active:index==1}">在玩</li>
        <li @click="index=2" :class="{active:index==2}">想玩</li>
      </ul>
    </div>
    <div class="record-items">
      <ul v-show="index==1">
        <GameItem
            type="1"
            v-for="(item, index) in inThePlayList"
            :item="item" :key="index"
            :inThePlayGive="inThePlayGive"
            :inThePlayRelet="inThePlayRelet"
        >
        </GameItem>
      </ul>
      <ul v-show="index==2">
        <GameItem type="2"  v-for="(item, index) in wantPayList" :item="item" :key="index"></GameItem>
      </ul>
    </div>
    <el-dialog
            :title="flag == 1 ? '退还租赁商品' : '续租'"
            :visible.sync="dialogVisible"
            custom-class="custom-class-3"
            size="tiny">
      <div v-if="flag == 1">
        <p class="text-left-ccc">请退还到以下收货地址</p>
        <p class="text-left-ccc">商家:{{contactName}}</p>
        <p class="text-left-ccc">地址:{{address}}</p>
        <p class="text-left-ccc">联系方式:{{contactMobile}}</p>
        <p class="text-left-ccc">请填写您的退货物流信息</p>
        <p class="text-left-ccc text-left">请输入物流平台</p>
        <el-input v-model="input1" placeholder="请输入物流平台"></el-input>
        <p class="text-left-ccc text-left">请输入物流订单号</p>
        <el-input v-model="input2" placeholder="请输入物流订单号"></el-input>
      </div>
      <div v-if="flag == 2">
        <p class="text-left-ccc text-left">请输入续租天数</p>
        <el-input v-model="input3" placeholder="请输入续租天数"></el-input>
      </div>
      <div class="custom-class-3-btn">
        <el-button @click.native="dialogVisible=!dialogVisible">取消</el-button>
        <el-button type="primary" @click="sureHandle">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
	import {Paging} from 'core';
	import GameItem from '../buycar/GameItem'
	export default {
		name: 'usergame',
		data(){
			return {
				index : 1,
				inThePlayList : [],//在玩
				wantPayList : [],//想玩
				dialogVisible : false,
				contactName : '',
				address : '',
				contactMobile : '',
				input1 : '',//请输入物流平台
				input2 : '',//请输入物流订单号
				input3 : '',//续租
				goodsId : '',
				recordId : '',
				flag : '',//区别是续租还是归还  1归还  2续租
			}
		},
		components: {
			GameItem
		},
		methods : {
			//续租
			inThePlayRelet(goodsId){
				this.flag=2;//这是续租
				this.goodsId=goodsId;//这是续租
				this.dialogVisible = true;
				this.input3 = 10;
			},
			inThePlayReletHandle(goodsId){
				let {input3:amount} = this;
				amount = amount.trim();
				let parameter = [];
				if(amount < 10){
					this.$message({
						message: '最小续租天数为10',
						type: 'error',
					});
					return;
				}
				gameApi.updateShoppingCartGoodsCount.send({
					parameter:JSON.stringify([{goodsId, amount, orderGoodsType:2}]),
				})
				.then(({msg,status,data})=>{
					if(status == 200){
						gameApi.generateOrder.send({goodsIdList:goodsId})
						.then(({status,msg,data})=>{
							let success = status == 200;
							if(success){
								//这里跳转到 确认订单页
								this.$router.push('/pay/' + data);
							}else{
								this.$message({
									message: msg || '续租失败',
									type: 'error',
								});
							}
						})
					}else{
						this.$message({
							message: msg || '续租失败',
							type: 'error',
						});
					}
					this.dialogVisible = false;
				})
			},
			//在玩归还
			inThePlayGive({contactName,address,contactMobile,goodsId,tradeId:recordId}){
				this.flag=1;//这是归还
				this.input1 = '';
				this.input2 = '';
				this.goodsId = goodsId;
				this.recordId = recordId;
				this.dialogVisible = true;
				this.contactName = contactName;
				this.address = address;
				this.contactMobile = contactMobile;
			},
			sureHandle(){
				let {input1 : logisticsNumber,input2 : logisticsPlatformd,goodsId,recordId,flag} = this;
				if(flag == 2){
					this.inThePlayReletHandle(goodsId);
					return;
				}
				logisticsNumber = logisticsNumber.trim();
				logisticsPlatformd = logisticsPlatformd.trim();
				let errText;
				if(!logisticsNumber){
					errText = '请填写物流平台';
				}
				if(!logisticsPlatformd){
					errText = '请填写物流订单号';
				}

				if(errText){
					this.$message({
						message: errText,
						type: 'error',
					});
					return;
				}
				gameApi.returnGoods.send({goodsId,logisticsNumber,logisticsPlatformd,recordId}).then(result=>{
					let {status,msg} = result;
					if(status == 200){
//						toPage.TransactionRecord.push(1)
						//去交易记录
						this.dialogVisible = false;
					}else{
						this.$message({
							message: msg || '归还失败',
							type: 'error',
						});
					}
				})
			}
		},
		created(){
			//想玩
			this.wantPlay = new Paging({pageSize : 1000},gameApi.findUserPlay.send);
			this.wantPlay.send().then(({status,data})=>{
				if(status === 200){
					let {result,curIndex,pageSize,totalRow} = data;
					this.wantPayList.push(...result);
				}
			})
			//在玩
			this.inThePlay = new Paging({pageSize : 1000},gameApi.findUserNowPlay.send);
			this.inThePlay.send().then(({status,data})=>{
				if(status === 200){
					let {result,curIndex,pageSize,totalRow} = data;
					this.inThePlayList.push(...result);
				}
			})
		}

	}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
  .record{

  }
  .usergame{
    background-color: #f7f7f7;
  }
  .user-tabs{
    background-color: #fff;
    height: 77px;
    padding: 0 30px;
    margin-bottom: 15px;
  }
  .user-tabs li{
    cursor: pointer;
    float: left;
    padding: 0 20px;
    line-height: 75px;
    border-bottom: 2px solid #fff;
    color: #666666;
  }
  .user-tabs li.active{
    border-bottom: 2px solid #145fdc;
    color: #145fdc;
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
  }
  .user-btn-detail{
    color: #fff;
    background-color: #145fdc
  }
  .record-items-head .cricle{
    display: inline-block;
    width: 20px;
    vertical-align: middle;
    margin-top: -2px;
    height: 20px;
    border-radius: 50%;
    background: #145fdc;
  }
  .record-items-head{
    background-color: #fff;
    margin-top: 20px;
    padding-left: 20px;
    line-height: 40px;
    color: #999;
    width: 873px;
  }
</style>
