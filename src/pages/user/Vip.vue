<template>
  <div class="uservip">
    <div class="user-head">
      <div class="user-text">你当前会员： <span>{{isVip ? vipType : '非会员'}}</span></div>
      <div class="user-lastdate"  v-if="isVip && day !=undefined">
        您的{{vipType}}剩余: {{day}}天
      </div>
    </div>
    <div class="user-main">
      <div class="uservip-pic">
        <el-carousel
                indicator-position="none"
                :autoplay="false"
                @change="change"
                type="card" height="270px">
          <el-carousel-item v-for="(item,i) in items" :key="i">
            <img style="border-bottom: 6px;" :src="item" alt="" width='100%' height='270px' >
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="uservip-select">已选择：{{vipType}}</div>

      <div class="uservip-table">
        <el-select v-model="couponId" placeholder="请选择优惠劵">
          <el-option
                  v-for="item in conponListFormat"
                  :key="item.couponId"
                  :label="`${item.couponValue}(${item.couponDescription})`"
                  :value="item.couponId"
                  :disabled="item.disabled">
          </el-option>
        </el-select>
        <ul>
          <li v-for="({label,value,key},index) in vipInfoList" key="{{index}}">
            <span class="ub-type">{{label}}</span>
            <span class="ub-price" v-if="key!='coupon'">&yen;{{filterVal(value,key)}}</span>
            <span class="ub-price" v-else>&yen;{{couponVal || 0}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div @click="submit" v-show="!isHideSubmit" class="ub-allprice"><span class="ub-type">{{submitText}}</span></div>

  </div>
</template>

<script>
	const silver = require('@/assets/img/user/silver.png');
	const gold = require('@/assets/img/user/gold.png');
	const diamond = require('@/assets/img/user/diamond.png');
	import {mapGetters} from 'vuex';
	export default {
		name: 'uservip',
		data(){

			return {
				vipInfoList: [
					{label: '会员费', value: [], key: 'recharge'},
					{label: '押金', value: [], key: 'deposit'},
					{label: '往返邮费', value: [], key: 'charges'},
					//{label: '优惠劵', value: [], key: 'coupon'},
					{label: '总价', value: [], key: 'total'},
				],
				day: '',
				level : 1,
				items:[gold,silver,diamond],
				couponId : '',
				couponVal : '',
				quanArr:[],
				realCoupon:[]
			}
		},
		methods : {
			change(level){
				this.level = level;
				this.couponId = '';
			},
			filterVal(val,type){
				let oldVal = val;
				let {level,isVip,userInfo} = this;
				val = val[level];
				try {
					if(type === 'coupon'){
						val = val || [];
						val = (val[0] || {}).couponValue;
					}
					if(type === 'total' && this.isVip){
						val = val - (this.vipInfoList.filter(({key})=>(key === 'deposit'))[0].value[userInfo.vipLevel - 1] || 0);
					}
					if(type === 'deposit' && this.isVip){
						val += `(已交￥${oldVal[userInfo.vipLevel - 1]})`
					}
				}catch (e){
					val = 0;
				}
				return type == 'total' ? this.showPrice || 0 : val || 0;
			},
			//去支付
			toPay(memberMonth,couponId,userMemberLevel,apiName){
				gameApi[apiName].send({memberMonth,couponId,userMemberLevel})
				.then(({status,data})=>{
					if(status != 200)return;
					this.$router.push(`/paysure/${data}`)
				})
			},
			//支付按钮
			submit(){
				let {isVip,level,couponId} = this;//couponId
				let couponIdData = this.vipInfoList.filter(({key})=>(key === 'coupon'))[0]
				if(isVip){
					if(this.userInfo.vipLevel > level + 1){

					}else if(this.userInfo.vipLevel == level + 1){
						this.$prompt('请输入续租月数', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
						}).then(({ value }) => {
							value = value.trim();
							this.toPay(value,couponId,level + 1,'generateRenewMemberOrder')
						}).catch(() => {
							this.$message({
								type: 'info',
								message: '取消输入'
							});
						});
					}else{
						this.toPay(1,couponId,level + 1,'generateMemberUpdateOrder')
					}

				}else{

					this.toPay(1,couponId,level + 1,'generateMemberOrder')
				}

			}
		},
		computed : {
			...mapGetters(['userInfo']),
			realCouponPrice(){
				let obj =  this.realCoupon.length>0 && this.realCoupon.find((item)=>{
						return this.couponId == item.couponId
					})
				return obj && obj.couponValue || ''
			},
			showPrice(){
				var value = this.vipInfoList[3].value[this.level] - (this.realCouponPrice || 0);
				if(this.isVip){
					value = value - (this.vipInfoList.filter(({key})=>(key === 'deposit'))[0].value[this.userInfo.vipLevel - 1] || 0)
                }
				return value

			},
			isVip(){
				return this.userInfo.vipLevel ? true : false;
			},
			vipType(){
				return ['黄金会员', '白金会员', '钻石会员'][this.level];
			},
			submitText(){
				let {isVip,level} = this;
				if(!isVip)return '去支付';
				return level+1 > this.userInfo.vipLevel ? '去升级' : '去续费';
			},
			isHideSubmit(){
				let {level} = this;
				return (level+1 < this.userInfo.vipLevel);
			},
			conponListFormat(){
				var realArr = this.quanArr.length>0 && this.quanArr.filter((item)=>{
						let curDate = +new Date();
						let start = (new Date(item.couponStartDate)).getTime();
						let end = (new Date(item.couponEndDate)).getTime();
						return (curDate >= start) && (curDate <= end) && (item.couponCondition<= this.vipInfoList[3].value[this.level]) ? item : ''
					})
				this.realCoupon = realArr
				return realArr || []
			}
		},
		created(){
			this.level = this.userInfo.vipLevel ? this.userInfo.vipLevel - 1 : this.level;
			gameApi.findMemberInfo.send().then(({status,data}) => {
				this.day = (data.filter(({day})=>day !== undefined)[0] || {}).day;
				data = data.sort((n1,n2)=> n1.memberType - n2.memberType);
				this.vipInfoList = this.vipInfoList.map((item,index)=>{
					let arr = data.map((item2)=>(item2[item.key]))
					return {...item,...{value : arr}}
				})
				this.quanArr = data[this.level].coupon
			})
		}
	}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .user-head{
    overflow: hidden;
    padding-bottom: 30px;
    margin-bottom: 30px;
    line-height: 50px;
    padding: 20px;
    background-color: #fff;
  }
  .uservip-pic{
    height: 294px;
    padding: 12px 20px;

  }
  .uservip{
    position: relative;
    padding-bottom: 70px;
  }
  .user-text{
    float: left;
    font-size: 16px;
    color: #666666;
  }
  .user-text span{
    font-weight: 600;
    font-size: 18px;
  }
  .user-lastdate{
    float: right;
  }
  .user-main{
    background: #fff;
    overflow: hidden;
    margin-bottom: 30px;
  }
  .uservip-select{
    text-align: center;
    margin-bottom: 20px;
    font-size: 18px;
    color: #777;
    font-weight: 600;
  }
  .uservip-table{
    background-color: #fff;
    padding: 30px;
  }
  .uservip-table li{
    overflow: hidden;
    line-height: 70px;
    height: 70px;
    border-bottom: 1px solid #ddd;
  }
  .uservip-table li .ub-type{
    float: left;
    color: #666666;
  }
  .uservip-table li .ub-price{
    float: right;
    color: #333333;
  }

  div.ub-allprice{
    cursor: pointer;
    height: 70px;
    line-height: 70px;
    padding: 0 20px;
    margin: 0 30px;
    margin-bottom: 20px !important;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 900px;
    z-index: 3;
    background-color: #145fdc;
    .ub-price small{
      font-size: 14px;
      font-weight: 100;
      padding: 0 10px;
    }
    .ub-type{
      color: #fff;
      font-size: 18px;
      font-weight: 600;
    }
  }
</style>
