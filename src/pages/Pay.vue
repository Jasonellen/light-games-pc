<template>
	<div class="pay-page">
		<p class="needNum">需要支付:<span>{{ showPrice }}{{radio == 2 ? 'G币':'元'}}</span></p>
		<p class="payText">支付方式</p>
		<ul>
			<li v-for=" (item,index) in dataList ">
				<img :src="item.route" alt="">
				<p>{{ item.name }}</p>
				<el-radio class="radio" v-model="radio" :label="index" />
			</li>
		</ul>
		<el-button class="sureBtn" type="primary" @click="handleSubmit">确认支付（{{showPrice}}{{radio == 2 ? 'G币':'元'}}）</el-button>
		<div class='modal' v-show='modalShow'>
			<div id="code"></div>
			<p style="color: #fff;padding-top: 20px;">  <el-button type="success">请使用微信扫码支付</el-button></p>
		</div>
	</div>
	
</template>

<script>
	const img1 = require('../assets/img/pay/1.svg');
	const img2 = require('../assets/img/pay/2.svg');
	const img3 = require('../assets/img/pay/3.svg');
	import {mapActions} from 'vuex';
	export default {
		data(){
			return {
				radio:0,
				dataList:[{
					name:'支付宝',
					route:img1
					},
					{
						name:'微信',
						route:img2
					},
					{
						name:'G币',
						route:img3
					}],
				price:'',
				orderId:'',
				GB:false,
				modalShow:false,
				timer:null
			}
		},
		computed:{
			showPrice(){
				return this.radio == 2  ? this.GBPrice : this.price
			}
		},
		methods: {
			...mapActions(['login']),
			select(index,checked){
				this.checked = this.checked.map((item,index1)=>({...item,...{
					checked : index == index1 ? !checked : false}}))
			},
			toGB(){
				gameApi.rmbToGCoin.send({money:this.price})
				.then(data=>{
					if(data.msg == 'success'){
						this.GBPrice = data.data
					}
				})

			},
			success(){
				this.$router.replace('/user/record');
				this.login();
			},
			xyqrcode(options) {

				var settings = {
				  dom:'#code',
				  render: 'canvas',
				  background:"#ffffff",
				};
				if (options) {
				  $.extend(settings, options);
				}
				settings.text=settings.url;
				$(settings.dom).qrcode(settings);
			},
			handleSubmit(){
				let {orderId} = this.$route.params
				let {radio} = this;

				if(radio === 2){
					gameApi.updateGCoin.send({orderId:orderId})
					.then(({status,msg})=>{
						let success = status == 200;
						this.$message({
							message: success ? '支付成功' : msg || '支付失败',
							type: success ? 'success' : 'warning'
						});
						success && this.success()
					})
				}
				if(radio === 0){
					gameApi.alipayPcWapPay.send({
						orderId:this.orderId
					})
					.then(data=>{
						document.body.innerHTML= document.body.innerHTML + data
						var form = document.querySelector('form')
						form.submit()
					})
				}
				if(radio === 1){
					
					gameApi.weChatUnifiedorder.send({
						orderId:this.orderId
					})
						.then(data=>{
							if(data.msg == 'success'){
								this.modalShow = true
	   							this.xyqrcode({"url":data.data.codeUrl});
							}
						})
					clearInterval(this.timer)
					this.timer = setInterval(()=>{
						gameApi.weixinSuccess.send({
							orderId:this.orderId
						})
							.then(data=>{
								if(data.data.tradeState == 'SUCCESS'){
									this.$message({
										message: '微信支付成功',
										type: 'success'
									});
									this.modalShow = false
									clearInterval(this.timer)
									this.success()
								}
							})
					},1000)
					
				}

			}

		},
		mounted(){
			let {orderId} = this.$route.params
			this.orderId = orderId
			gameApi.queryOrderMessage.send({orderId}).then(({status,data})=>{
				let {orderType,orderMoney} = data;
				if(orderType == 2 || orderType == 4){
					this.dataList.pop();
				}
				this.price = orderMoney;
				this.toGB();
			})
		},
	}
</script>

<style lang="scss" rel="stylesheet/scss">
	.modal{
		width: 100%;
	    height: 100%;
	    position: fixed;
	    background: rgba(0,0,0,.4);
	    z-index: 999;
	    top: 0;
	    left: 0;
	    text-align: center;
	    #code{
	    	display:inline-block;
	    	margin-top:200px;
	    	background:#fff;
	    	padding:30px;
	    	border-radius:20px;
	    }
	}
	.pay-page{
		width: 960px;
		/*height: 300px;*/
		margin: 0 auto;
	}
	.needNum{
		width: 100%;
		height: 60px;
		line-height: 60px;
		background: #fff;
		font-size: 25px;
		text-align: right;
		padding-right: 20px;
		margin-top: 10px;
	}
	.needNum span{
		color: #e51d08;
	}
	.payText{
		width: 100%;
		height: 40px;
		line-height: 40px;
		padding-left: 15px;
	}
	ul{
		overflow: hidden;
	}
	ul li{
		overflow: hidden;
		background: #fff;
		margin-bottom: 10px;
	}
	ul li img {
		width: 90px;
		height: 70px;
		margin: 10px 20px 0 20px;
		float: left;
	}
	ul li p {
		height: 90px;
		line-height: 90px;
		float: left;
		font-size: 30px;
	}
	ul li label{
		float: right;
		height: 90px;
		line-height: 90px;
		margin-right: 20px;
	}
	.el-radio__label{
		display: none;
	}
	.sureBtn{
		width: 100%;
		height: 60px;
		font-size: 30px;
		padding: 0;
		font-weight: bold;

	}
</style>