<template>
  <div class="guize">
    <div class="gz-head">
      <div class="gz-head-title">新手规则</div>
    </div>
    <div class="gz-main">
      <ul>
        <li v-shadow @click="toPage('/user/rule')">
          <div class="pic"><img src="../../assets/img/index/zupin.png" alt=""></div>
          <div class="title">租凭规则</div>
        </li>
        <li v-shadow @click="toNewsDetail">
          <div class="pic"><img src="../../assets/img/index/huodong.png" alt=""></div>
          <div class="title">新手活动</div>
        </li>
        <li v-shadow @click="toPage('/user/gbi')">
          <div class="pic"><img src="../../assets/img/index/chongzhi.png" alt=""></div>
          <div class="title">G币充值</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
	//	/user/rule
	//	/user/rule
	//	/user/gbi
	export default {
		name: 'guize',
		methods : {
			toPage(page){
				GAME.checkLogin().then(isLigin=>{
					if(!isLigin)return;
					this.$router.push(page);
				})
			},
      toNewsDetail(){
        this.$router.push('/newsdetail/17')
      }
		}
	}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
  .guize{
    width: 285px;
    margin-top: 30px;
    float: right;
  }
  .gz-head{
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #145fdc;
    background-color: #fff;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: 10px;
  }

  .gz-main li{
    text-align: center;
    padding-top: 20px;
    padding-bottom: 20px;
    background-color: #fff;
    margin-bottom: 10px;
    cursor: pointer;
    &:hover{
      box-shadow: 0 0 5px rgba(0,0,0,.6);
    }
  }
  .yuliu{
    width: 100%;
    height: 340px;
    background-color: #ddd;
  }
</style>
