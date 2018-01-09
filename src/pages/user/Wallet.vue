<template>
  <div class="wallet user-wrap">
    <div class="user-head">
      <div class="user-text">余额： <span class="user-gbi">{{ balance }}</span>元</div>
      <div class="user-btns">
        <div class="user-btn user-btn-not" @click="dialogVisible2 = true">查看明细</div>
        <div class="user-btn user-btn-whire" @click="addBalance">充值</div>
        <div class="user-btn user-btn-detail" @click="shouTiXian">提现</div>
      </div>
    </div>

    <div class="user-main">
      <h4>我的优惠券</h4>
      <ul>
        <li
                @click="overflash && $router.push('/games')"
                :class="['wallet-item', !overflash && 'over']"
                tag="li"
                v-for="(item,index) in conponList"
                :key="index"
        >
          <div class="money">{{item.couponValue}}元</div>
          <div class="state">使用条件<a href="javascript:;">{{ item.couponDescription }}</a></div>
          <div class="date-info">
            <p>{{item.couponStartDate | time}} 开始</p>
            <p>{{item.couponEndDate | time}} 截止</p>
          </div>
          <div class="date-last">
            <a href="javascript:;">{{couponText(item)}}</a>
          </div>
        </li>
      </ul>
    </div>
    <el-dialog
            title="提现"
            :visible.sync="dialogVisible1"
            size="tiny">
      <div>
        <span class="">姓名</span>
        <el-input class="inputIpt" type="text" placeholder="请输入姓名" v-model="username"></el-input>
      </div>
      <div>
        <span class="">银行</span>
        <el-input class="inputIpt" type="text" placeholder="请输入银行"  v-model="bank"></el-input>
      </div>
      <div>
        <span class="">卡号</span>
        <el-input class="inputIpt" type="number" placeholder="请输入卡号" v-model="bankCard"></el-input>
      </div>
      <div>
        <span class="">金额</span>
        <el-input class="inputIpt" type="number" placeholder="请输入金额" v-model="money"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="tiXian">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
            title="明细"
            :visible.sync="dialogVisible2"
            size="small">
      <div class="detailList" v-for="item in list">
        <div>{{ item.trade_type }}</div>
        <div class="balance">余额:{{ item.surplus_money }}</div>
        <div class="trade_money">{{item.trade_money}}</div>
        <div class="date">{{ item.create_date }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
	import {Paging} from 'core';
	export default {
		name: 'wallet',
		data (){
			return {
				dialogVisible1:false,
				dialogVisible2:false,
				num:'',
				allLoaded : true,
				list : [],
				balance:'',
				conponList:[],
				//充值
				username:'',//姓名
				bank:'',//银行
				bankCard:'',//银行卡号
				money:'',//充值金额

				value:'',
				overflash:''
			}
		},
		methods:{
			//显示体现
			shouTiXian(){
				if(!this.balance || this.balance == 0){
					this.$message({
						message: '您的账户目前没有余额',
						type: 'warning'
					});
					return;
				}
				this.dialogVisible1 = true;
			},
			//当有效的实话  返回 null   过期返回1   没到时间返回2
			isInValid({couponStartDate = '',couponEndDate = ''}){
				let curDate = +new Date();
				let start = (new Date(couponStartDate)).getTime();
				let end = (new Date(couponEndDate)).getTime();

				if(start > curDate){
					this.overflash = false
					return 2;
				}
				if(end < curDate){
					this.overflash = false
					return 1;
				}
				this.overflash = true
				return null;
			},
			couponText(item){
				let status = this.isInValid(item);
				return !status ? '立即使用' : (status == 1 ? '已过期' : '未开始');
			},
			send(){
				this.mxApi.send().then(({data,status})=>{
					if(status == 200){
						let {result,totalRow,pageSize,curIndex} = data;
						this.list.push(...result);
					}
				})
				this.conponApi.send().then(({status,data})=>{
					if(status == 200){
						let {result,totalRow,pageSize,curIndex} = data;
						this.conponList.push(...result);
						log(this.conponList)
					}
				})
			},
			addBalance(){
				this.$prompt('请输入充值金额', '充值', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({ value }) => {
					if(!value || !parseInt(value)){
						this.$message({
							message: !value ? '请输入充值金额' : (value == 0 ? '充值金额不能小于0' : '请输入正确的数字'),
							type: 'warning'
						});
						return;
					};
					gameApi.generateBalanceOrder.send({balance:value})
					.then(({status,data,msg})=>{
						let success = status == 200;
						if(!success){
							this.$message({
								message: msg || '充值失败',
								type: 'warning'
							});
						}else{
							this.$router.push('/paysure/' + data)
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消充值'
					});
				});

			},
			tiXian(){
				const {username,bank,bankCard,money} = this
				if(!username || !bank || !bankCard || !money){
					this.$message({
						message: '请填写信息',
						type: 'warning'
					});
					return;
				};

				if(money <= 0){
					this.$message({
						message: '提现金额必须大于0',
						type: 'warning'
					});
					return;
				}

				gameApi.withdrawMoney.send({
					withdrawMoney:money,
					bankName:bank,
					bankCard,
					withdrawName:username
				})
				.then(({status,msg,data})=>{
					let success = status == 200;
					this.dialogVisible1 = false;
					this.$message({
						message: success ? '申请提现成功' : msg || '提现失败',
						type: success ? 'success' : 'warning'
					});
					success && this.reloadBalance();
				})
			},
            reloadBalance(){
				gameApi.findUserBalance.send()
				.then(data=>{
					if(data.msg == 'success'){
						this.balance = data.data.result.userBalance
					}
				})
            }
		},
		filters : {
			time(val){
				val = val || '';
				return val.split(' ').shift();
			}
		},
		created(){
			this.mxApi = new Paging({pageSize : 1000},gameApi.queryWalletRecord.send);
			this.conponApi = new Paging({pageSize : 1000},gameApi.queryAllOrUseConpon.send);
			this.send();
			this.reloadBalance();
		},
	}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
  .user-gbi{
    color: #666666;
    padding: 0 5px 0 5px;
  }
  .user-wrap{
    overflow: hidden;
  }
  .user-head{
    border-bottom: 1px solid #ddd;
    overflow: hidden;
    padding-bottom: 30px;
    margin-bottom: 30px;
    margin-top: 10px;
  }
  .user-text{
    float: left;
    font-size: 16px;
    color: #999999;
  }
  .user-text span{
    font-weight: 600;
    font-size: 20px;
  }
  .user-btns{
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
  }
  .user-btn-not{
    color: #145fdc;
    background-color: #fff;
    border-color: #fff;
  }
  .user-btn-whire{
    color: #145fdc;
    background-color: #fff;
  }
  .user-btn-detail{
    color: #fff;
    background-color: #145fdc
  }

  .user-main{
    width: 900px;
  }

  .user-main h4{
    font-size: 16px;
    margin-bottom: 20px;
    font-weight: 500;
    color: #999999;
  }

  .wallet-item{
    padding: 20px;
    margin-bottom: 12px;
    background-color: #fffbec;
    border: 1px solid #fef6d8;
    overflow: hidden;
  }
  .over{
    background: #ddd;
  }
  .wallet-item > div{
    float: left;
    width: 210px;
    text-align: center;
    color: #999;
    padding-top: 8px;
  }
  .wallet-item .money{
    width: 120px;
    font-size: 18px;
    color: #e32132;
  }
  .wallet-item .state{
    width: 260px;
    font-size: 14px;
  }
  .wallet-item .state a{
    color: #999;
  }
  .wallet-item .date-info{
    font-size: 14px;
    padding-top: 0;
  }
  .wallet-item .date-last{
    font-size: 14px;
    width: 180px;
  }
  .wallet-item .date-last a{
    color: #145fdc;
  }
  .wallet-item-die{
    background-color: #f7f7f7;
    border-color: #eeeeee;
  }
  .wallet-item-die .money{
    color: #999
  }
  .dialogBox{
    width: 50%;
  }
  .inputIpt{
    width: 300px;
    margin-left: 30px;
    margin-top: 10px;
  }

  .detailList{
    margin-bottom: 10px;
    overflow: hidden;
  }

  .detailList div{
    float: left;
    width: 25%;
    overflow: hidden;
  }
  .detailList .date{
    text-align: right;
  }
</style>
