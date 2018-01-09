<template>
  <div class="sureorder">
    <div class="head">

    </div>
    <div class="wrap">
      <div class="addrinfo">
        <div class="addrinfo-title">
          收货人信息
        </div>
        <div class="addrinfos" v-for="(item,index) in formatAddressList" :key="index">
          <div class="add-left">
            <div class="addrname">
              {{item.name}}
            </div>
            <span>{{item.name}}</span>
            <span>{{item.pname}}{{item.cname}}{{item.aname}}{{item.details}}</span>
            <span>{{item.phone}}</span>
          </div>
          <div class="add-right">
            <label><el-radio class="radio" v-model="radio" :label="item.locationId">设为默认</el-radio> </label>
            <span class="addrbtn" @click="editAddress(index)">编辑</span>
            <span class="addrbtn" @click="delAddress(item.locationId)">删除</span>
          </div>
        </div>
        <div class="bala">
          <div class="bala-left" v-if="addressList.length">
            <div class="yajin" @click="showAll = !showAll">{{showAll ? '收起更多' : '更多地址'}}</div>
          </div>
          <div class="bala-right">
            <div class="add-addr" @click="addAddress">添加地址</div>
          </div>
        </div>
      </div>
      <div class="payway">
        {{realCouponPrice}}
        <div class="payway-title">
          优惠劵
        </div>
        <el-select v-model="couponId" placeholder="请选择优惠劵">
          <el-option
                  v-for="item in conponListFormat"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled">
          </el-option>
        </el-select>
      </div>
      <div class="orderlist">
        <div class="orderlist-title">
          商品清单
        </div>

        <div class="caritem"
             v-for="(item,index) in shopList"
             :key="index"
        >
          <div class="car-main">
            <div class="caritem-pic">
              <img :src="item.url" alt="">
            </div>
            <div class="car-wrap">
              <div class="caritem-head">
                <div class="ci-title">
                  {{item.gameNameCn}}
                  <span v-if="item.gameNameEn">（{{item.gameNameEn}}）</span>
                </div>
                <div class="ci-nums">
                  <span class="ci-number">{{item.orderGoodsType == 1 ? '购买' : '租赁'}}</span>
                  <span class="ci-chenk">数量：x{{getNum(item)}}</span>
                </div>
              </div>
              <div class="caritem-subtitle">
                版本：{{item.edition}}
              </div>
              <div class="caritem-info">
                <div class="caritem-pirce">
                  {{item.orderGoodsType == 1 ? '购买价' : '租赁价'}}：￥{{getPrice(item)}}
                </div>
              </div>
            </div>
          </div>
          <div class="bala">
            <div class="bala-left">
              <div class="yajin" v-if="item.orderGoodsType == 2">押金：￥{{deposit}}</div>
              <div class="yunfei" v-if="index === shopList.length - 1">运费：￥{{mailMoney}}（顺丰 <span href="">平台自主选择发货快递</span>）</div>
            </div>
            <div class="bala-right">
              总价：￥{{showPrice}}
            </div>
          </div>
        </div>

      </div>
      <div class="balance">
        <div class="balance-info">
          <p><span>实付款：</span><em>￥{{showPrice}}</em></p>
          <p><span>收件人：</span>{{defaultAds.name}} :{{defaultAds.phone}}</p>
          <p><span>寄送至：</span>{{defaultAds.pname}}{{defaultAds.cname}}</p>
        </div>
        <div class="balance-btn" @click="submit">结算</div>

      </div>
    </div>

    <div class="notfoot"></div>
  </div>
</template>

<script>

	import {publish,Paging} from 'core';

	export default {
		name: 'sureorder',
		data(){
			return {
				price : '',
				addressList : [],//收货地址
				showAll : false,//是否显示所有地址   默认不显示
				radio : '',//地址选择
				shopList : [],//商品列表
				deposit : '',//押金
				mailMoney : '',//邮费
				orderMoney : '',//总购买价
				couponId: '',
				conponList : [],//优惠劵列表
			}
		},
		computed : {
			formatAddressList(){
				let {addressList} = this;
				if(!addressList.length)return [];
				return this.showAll ? addressList : [addressList[0]];
			},
            //默认地址
      defaultAds(){
        if(!this.radio)return {};
        return this.addressList.filter(({locationId})=>locationId == this.radio)[0] || {}
      },
      conponListFormat(){

        var realArr = this.conponList.length>0 ? this.conponList.filter((item)=>{
            let curDate = +new Date();
            let start = (new Date(item.couponStartDate)).getTime();
            let end = (new Date(item.couponEndDate)).getTime();
            return  (curDate >= start) && (curDate <= end) && (item.couponCondition <= (this.orderMoney + this.mailMoney))
          }) : []

         return realArr.map((item)=>{
          let {couponId,couponDescription,couponValue} = item;
            return {
                label: `${couponValue}(${couponDescription})`,
                value: couponId,
                couponValue,
                disabled : this.isInValid(item) ? true : false
              }
        })
      },
      realCouponPrice(){
        let obj =  this.conponListFormat.length>0 && this.conponListFormat.find((item)=>{
          return this.couponId == item.value
        })
        return obj && obj.couponValue || ''
      },
      showPrice(){
        return this.orderMoney - this.realCouponPrice
      },
			conponVal(){
        return (this.conponListFormat().filter(({value})=>value == this.couponId)[0] || {}).couponValue || 0
      },
      totalPay(){
	       return this.orderMoney - this.conponVal();
      }
		},

		methods : {
			//当有效的实话  返回 null   过期返回1   没到时间返回2
			isInValid({couponStartDate = '',couponEndDate = ''}){
				let curDate = +new Date();
				let start = (new Date(couponStartDate)).getTime();
				let end = (new Date(couponEndDate)).getTime();

				if(start > curDate)return 2;
				if(end < curDate)return 1;
				return null;
			},
			//获取数量
			getNum({orderGoodsType,rentDay,amount}){
				return orderGoodsType == 1 ? amount : rentDay
			},
			//获取价格
			getPrice({orderGoodsType,goodsRentPrice,goodsPrice}){
				return orderGoodsType == 1 ? goodsPrice : goodsRentPrice
			},
			reloadData(){
				this.addressList = [];
				this.radio = '';
				//获取地址
				gameApi.queryUserLocation.send().then(({status,data})=>{
					if(status === 200){
						data = data || [];
						let firstIndex = -1;
						data.forEach(({defaultLocation,locationId},index)=>{
							!~firstIndex && defaultLocation == 1 && (firstIndex = index);
							!this.radio && defaultLocation == 1 &&(this.radio = locationId);
						})
						if(~firstIndex){
							this.addressList.push(...data.splice(firstIndex,1))
						}
						this.addressList.push(...data);
					}
				})
			},
			//新增地址
			addAddress(){
				let _this = this;
				publish.$emit('dialog-show',{
					show:true,
					view : 'addAddress',
					title : '新增地址',
					options : {
						sure(obj){
							let{defaultAds} = obj;
							delete obj.defaultAds;
							let params = {...obj,...{defaultLocation : defaultAds ? 1 : 2}}
							log('params',params)
							gameApi.addUserLocation.send(params).then(({status,msg})=>{
								let success = status === 200;
								_this.$message({
									message: success ? '新增成功' : msg || '新增失败',
									type: success ? 'success' : 'error'
								});
								success && _this.reloadData();
							})
						}
					}
				})
			},
			//删除地址
			delAddress(locationId){
				gameApi.deleteUserLocation.send({locationId}).then(({status})=>{
					let success = status == 200;
					this.$message({
						message: success ? '删除成功' : msg || '删除失败',
						type: success ? 'success' : 'error'
					});
					success && this.reloadData();
				})
			},
			//修改地址
			editAddress(index){
				let item = this.addressList[index];
				let {pid,cid,aid,phone,name,details,defaultLocation,locationId} = item;
				let _this = this;
				publish.$emit('dialog-show',{
					show:true,
					view : 'addAddress',
					title : '修改地址',
					options : {
						pid,cid,aid,phone,name,details,
						defaultAds : defaultLocation == 1,
						sure(obj){
							let{defaultAds} = obj;
							delete obj.defaultAds;
							let params = {...obj,...{defaultLocation : defaultAds ? 1 : 2,locationId}}
							gameApi.updateUserLocation.send(params).then(({status,msg})=>{
								let success = status === 200;
								_this.$message({
									message: success ? '修改成功' : msg || '修改失败',
									type: success ? 'success' : 'error'
								});
								success && _this.reloadData();
							})
						}
					}
				})
			},
			submit(){

				let {radio:locationId,addressList,couponId} = this;
				let {orderId} = this.$route.params

				if(!locationId){
					this.$message({
						showClose: true,
						message: !addressList.length ? '请添加地址':'请选择地址',
						type: 'warning'
					});
					return;
				}

        gameApi.commitOrder.send({orderId,locationId,couponId})
          .then(data=>{
            if(data.msg == 'success'){
              this.$router.push('/paysure/' + orderId);
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
			//收货地址
			this.reloadData();
			//订单信息
			let {orderId} = this.$route.params
			gameApi.queryOrderMessage.send({orderId}).then(({status,data,})=>{
				this.price = data.orderMoney;
				this.shopList = data.message;
				let {deposit,mailMoney,orderMoney} = data;
				this.deposit = deposit;
				this.mailMoney = mailMoney;
				this.orderMoney = orderMoney;
			})

			this.conponApi = new Paging({pageSize : 1000},gameApi.queryAllOrUseConpon.send);
			this.conponApi.send().then(({status,data})=>{
				if(status == 200){
					let {result,totalRow,pageSize,curIndex} = data;
					this.conponList.push(...result);
				}
			})
		}
	}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
  .wrap{
    margin: 30px auto;
  }
  .payway-title{
    line-height: 40px;
  }
  .orderlist{
    background-color: #fff;
    margin: 20px 0;
    padding: 20px;
  }
  .orderlist-title{

  }
  .caritem{
    width: 1104px;
    padding: 30px;
    padding-bottom: 15px;
    border: 1px solid #ddd;
    padding-right: 25px;
    margin-top: 15px;
    overflow: hidden;
    background: #fff;
  }

  .caritem-pic{
    width: 120px;
    height: 120px;
    float: left;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .car-wrap{
    margin-left: 30px;
    width: 940px;
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
  .ci-nums span{
    display: block;
    text-align: right;
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
  .car-main{
    overflow: hidden;
  }
  .bala{
    border-top: 1px solid #ddd;
    overflow: hidden;
    margin-top: 20px;
    padding-top: 10px;
  }
  .bala .bala-left{
    float: left;
  }
  .bala .bala-left .yajin{
    float: left;
    margin-right: 30px;
  }
  .bala .bala-left .yunfei{
    float: left;
  }
  .bala .bala-right{
    float: right;
    color: #ff6c00;
    font-size: 18px;
    font-weight: 600;
  }


  .addrinfo{
    padding: 20px;
    background-color: #fff;
    overflow: hidden;
    margin-bottom: 20px;
  }


  .payway{
    padding: 20px;
    background-color: #fff;
    overflow: hidden;
  }
  .payways div{
    margin-top: 20px;
    width: 140px;
    height: 34px;
    text-align: center;
    line-height: 34px;
    border: 1px solid #ddd;
    float: left;
    margin-right: 20px;
  }
  .payways div.active{
    border-color: #145fdc
  }
  .addrinfos {
    margin-top: 20px;
    overflow: hidden;
  }
  .addrinfos .addrname{
    width: 140px;
    height: 34px;
    text-align: center;
    line-height: 34px;
    border: 1px solid #145fdc;
    float: left;
    margin-right: 20px;
  }
  .addrinfos .add-left span{
    float: left;
    margin-left: 20px;
    line-height: 34px;
  }
  .add-addr{
    border: 1px solid #145fdc;
    color: #145fdc;
    padding: 4px 10px;
    font-size: 16px;
    font-weight: 400;
    border-radius: 12px;
  }
  .add-right{
    padding-top: 6px;
    float: right;
  }
  .add-right a{
    margin-left: 20px;
    border: 1px solid #999;
    text-decoration: none;
    color: #999;
    padding: 4px 10px;
    font-size: 16px;
    font-weight: 400;
    border-radius: 10px;
  }
  .balance{
    background-color: #fff;
    padding: 22px 30px;
    overflow: hidden;
    border: 2px solid #145fdc;
  }
  .balance-info{
    float: left;
    line-height: 30px;
  }
  .balance-info span{
    color: #999;
  }
  .balance-info em{
    font-style: normal;
    color: red;
    font-weight: 600;
    font-size: 18px;
  }
  .balance-btn{
    float: right;
    background-color: #145fdc;
    color: #fff;
    margin-top: 20px;
    padding: 8px 30px;
    border-radius: 5px;
  }
</style>
