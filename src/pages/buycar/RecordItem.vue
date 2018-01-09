<template>
  <div class="caritem">
    <div class="caritem-pic">
      <img :src="RecordData.goods_url" alt="">
    </div>
    <div class="car-wrap">
      <div class="caritem-head">
        <div class="ci-title">
          {{RecordData.game_name_cn}}
          <span>（{{RecordData.game_name_en}}）</span>
        </div>
        <div class="ci-nums">
          <span class="ci-number">数量：X{{RecordData.amount}}</span>
        </div>
      </div>
      <div class="caritem-subtitle">
        版本：{{RecordData.edition==0 ? '港行':RecordData.edition==1 ?'国行' :RecordData.edition==2?'美版':'日版' }}
      </div>
      <div class="caritem-info">
        <div class="caritem-pirce">
          购买价：￥{{RecordData.goods_price}}
        </div>
        <div class="caritem-operation">
          <el-button type="text" @click="getWuLiu(orderId)" v-if='index == 1'>
            <a class="user-btn user-btn-detail">查看物流</a>
          </el-button>
          <el-button type="text" @click="toComment(orderId)" v-if='index == 2'>
            <a class="user-btn user-btn-detail">立即评价</a>
          </el-button>

        </div><br/>
        <div v-if='index == 3'>
          <div class="content_title">交易评价</div>
          <div v-if='commentText' class='_content'>{{commentText}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'caritem',
  props : {
    RecordData: {type : Object},
    orderId:{type : String},
    index:{type : Number},
    commentText:{type : String},
  },
  methods:{
    getWuLiu(orderId) {
      const h = this.$createElement;
      gameApi.fingWaybill.send({orderId}).then(result=>{
        let {waybill_number,waybill_platform} = result.data;
        this.$msgbox({
          title: '物流',
          message: h('p', null, [
            h('p', { style: 'fontSize: 24px;lineHeight: 40px;' }, `物流公司:${waybill_platform}`),
            h('p', { style: 'fontSize: 24px;lineHeight: 40px;' }, `运单号:${waybill_number}`)
          ]),
          confirmButtonText: '确定',
        }).then(action => {
          this.$message({
            type: 'info',
            message: '查看物流成功'
          });
        });
      })
    },
    toComment(){
      GAME.pingLun({
        title : '评价',
        placeholder : '请发表评价',
        sure : (commentText)=>{
         gameApi.insertComment.send({commentText, articleId:this.orderId, articleType:6})
         .then(({msg,status})=>{
          let success = status == 200;
          this.$message({
           message: success ? '评价成功' : msg || '评论失败',
           type: success ? 'success' : 'error',
          });
          if(success && this.upDate)this.upDate();
          GAME.close();
          this.$emit('reload')
         })
        }
       })
    }
  },
  mounted(){
    
  }
}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
.caritem{
  /*width: 838px;*/
  padding: 13px 30px;
  padding-right: 25px;
  overflow: hidden;
  background: #fff;
  border-top: 1px solid #ddd;
}
.caritem-pic{
  width: 120px;
  float: left;
  height: 120px;
  img{width: 120px;height: 120px;}
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
.user-btn{
  padding: 2px 6px;
  font-size: 14px;
  float: left;
  margin-left: 12px;
  border-radius: 5px;
  line-height: 24px;
  text-decoration: none;
  min-width: 80px;
  text-align: center;
  border: 1px solid #145fdc;
}
.user-btn-detail{
  color: #fff;
  background-color: #145fdc
}
.content_title{
  border-bottom: 3px solid #33a9fc;
  display: inline-block;
  margin-top: 10px;
  margin-bottom: -3px;
}
._content{
  background: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  word-break: break-all;
}
</style>
