<template>
  <div class="gbi user-wrap">
    <div class="user-head">
      <div class="user-text">我的G币：<span v-model="userGCoin" class="user-gbi">{{userGCoin}}</span>个</div>
      <div class="uer-btns">
        <div class="uer-btn uer-btn-whire" @click='dialogVisible1 = true'>邀请好友得G币</div>
        <div class="uer-btn uer-btn-detail" @click='dialogVisible = true'>充值G币</div>
      </div>
    </div>

    <div class="user-main">
      <h4>G币是什么？</h4>
      <ul>
        <li>G币是电玩之光平台通用货币，可以通过充值、邀请注册、点击广告等方式获取。</li>
        <li>获取G币之后，可以在平台上购买、租赁游戏，可用于抵扣人民币支付。</li>
       <!-- <li>黄金会员、钻石会员充值G币将分别获取9.8折以及9.5折的优惠。</li>-->
      </ul>
      <br/>
      <h4>如何获得更多G币？</h4>
      <ul>
        <li>1、进行所有平台的支付</li>
        <li>2、点击广告</li>
        <li>3、点赞评论</li>
        <li>4、下载游戏</li>
      </ul>
    </div>
    <el-dialog
            title="充值"
            :visible.sync="dialogVisible"
            size="tiny">
      <span>请输入充值G币数额</span>
      <el-input v-model="num" @change="handelInput"  type="number" placeholder=""></el-input>
      <p v-show="num.length > 0">需支付{{xzhifu}}元</p>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="sureClick">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
            title="邀请好友"
            :visible.sync="dialogVisible1"
            size="tiny">
      <p class="listText">您的邀请码为</p>
      <p class="listTextCode">{{ inviteCode }}</p>
      <p class="listText">{{ text }}</p>
      <p class="listText1">谁邀请您加入电玩之光？输入邀请人的邀请码</p>
      <el-input v-model="inviteNum" type="text" placeholder=""></el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible1 = false">取 消</el-button>
    <el-button type="primary" @click="submit">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
    name: 'gbi',
    data (){
        return {
            userGCoin : '',
            handleClose:'',
            dialogVisible: false,
            dialogVisible1: false,
            inviteNum:'',
            num:'',
            inviteCode:'',
            text:'',
			xzhifu : '',
        }
    },
    methods: {
    	reduceMoney : _.debounce(
              function(money){
			  gameApi.gCoinToRmb.send({
				  money:money
			  }).then(({status,data})=>{
			  	this.xzhifu = status == 200 ? data : money
              })
          },
          // 这是我们为用户停止输入等待的毫秒数
          300
      ),
		handelInput(num){
          this.reduceMoney(num)
        },
        sureClick(){
            let { num:value } = this;
            if( !value ) {
                this.$message({
                    message: '请输入充值金额',
                    type: 'warning'
                });
                return;
            }
            if(value <= 0){
				this.$message({
					message: '充值G币必须大于0',
					type: 'warning'
				});
				return;
            }
            gameApi.generateGCoinOrder.send({gCoin:value})
                .then(data=>{
                    if(data.msg == 'success'){
//                        toPage.Pay.push(`${data.data}/${value}#GB`)
                        this.dialogVisible = false;
                        this.$router.push(`/paysure/${data.data}#GB`);
                    }
                })
        },
        submit(){
            if(this.inviteNum == this.inviteCode){
                this.$message({
                    message: '不要输入自己的邀请码哦',
                    type: 'warning'
                });
            }else if( !this.inviteNum ){
                this.$message({
                    message: '请输入邀请码哦',
                    type: 'warning'
                });
            }else{
                gameApi.inviteFriends.send({inviteCode:this.inviteNum})
                    .then(data=>{
                        if(data.msg == 'success'){
                            this.dialogVisible1 = false;
                            this.$message({
                                message: '邀请码提交成功',
                                type: 'success'
                            });
                        }else{
                            this.$message({
                                message: data.msg,
                                type: 'warning'
                            });
                        }
                    })
            }

        }
    },
    created(){
        //查询用户G币
        gameApi.findUserGCoin.send().then(({data})=>{
            this.userGCoin = data.userGCoin;
        })
        //邀请码
        gameApi.getRandomStr.send()
            .then(data=>{
                if(data.msg == 'success'){
                    this.inviteCode = data.data
                }
            })
        //文字
        gameApi.getCouponValue.send().then(result=>{
            this.text = result.data;
        })
    },
}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
  .user-gbi{
    color: #666666;
    padding: 0 5px 0 5px;
  }
.user-head{
  color: #999999;
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
.uer-btns{
  float: right;
}
.uer-btn{
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
.uer-btn-whire{
  color: #145fdc;
  background-color: #fff;
}
.uer-btn-detail{
  color: #fff;
  background-color: #145fdc
}
.user-main{
  font-weight: 100;
  width: 900px;
  color: #999999;
  margin-bottom: 10px;
}
.user-main h4{
  margin-bottom: 20px;
}
.user-main li{
  line-height: 34px;
}
.listText{
  text-align: center;
  margin-bottom: 10px;
}
.listTextCode{
  text-align: center;
  margin-bottom: 10px;
  font-weight: bold;
}
.listText1{
  text-align: center;
  margin-top: 30px;
  margin-bottom: 10px;
}
</style>
