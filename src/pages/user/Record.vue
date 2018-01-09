<template>
  <div class="record">
    <div class="user-tabs">
      <ul>
        <li :class="{ active: showIndex == 1 }" @click='changeShowIndex(1)'>正在交易</li>
        <li :class="{ active: showIndex == 2 }" @click='changeShowIndex(2)'>交易完成</li>
        <li :class="{ active: showIndex == 3 }" @click='changeShowIndex(3)'>交易评价</li>
      </ul>
    </div>

    <div class="record-items" v-for='items in listData'>
      <div v-for='item in items.data'>
        <div class="record-items-head">
          <span class="cricle"></span>{{item.order_goods_type == 1 ? '购买交易' : '租凭交易'}}
        </div>
        <ul>
          <RecordItem  
            @reload='initData'
            :index ='showIndex' 
            :RecordData="item" 
            :commentText='items.commentText'
            :orderId='items.orderId' 
            v-if='item.order_goods_type == 1' >
            </RecordItem>
          <RecordItem  
            @reload='initData'
            :index ='showIndex' 
            :RecordData="item" 
            :commentText='items.commentText'
            :orderId='items.orderId' v-else >
            </RecordItem>
        </ul>
      </div>
    </div>
    <div v-if="max" class="zx-foot-more" @click="loadMore">更多记录》</div>
  </div>
</template>

<script>
import RecordItem from '../buycar/RecordItem' //购买
import RecordItem2 from '../buycar/RecordItem' //租赁

export default {
  name: 'record',
  data(){
    return{
      showIndex:1,
      goingData:[],
      finshedData:[],
      commentData:[],
      goingMax:true,
      finshedMax:true,
      commentMax:true,
      goingCurIndex:2,
      finshedCurIndex:2,
      commentCurIndex:2,
    }
  },
  components: {
    RecordItem,
    RecordItem2
  },
  methods:{
    initData(){
      //获取正在交易数据
      this.getData(1,'goingData','goingMax')   
      //获取交易完成数据
      this.getData(2,"finshedData","finshedMax") 
      //获取交易评价数据
      this.getData(3,'commentData','commentMax')
    },
    changeShowIndex(index){
      this.showIndex = index
    },
    getData(type,selfData,max){
      gameApi.findUserTransactionList.send({
        type,curIndex:1, pageSize:6
      })
        .then(({msg, data})=>{
          if(msg == 'success'){
            this[selfData] = data.result
            this[max] = data.curIndex < Math.ceil(data.totalRow/6)
          }
        })
    },
    loadMore(){
      const {type, curIndex} = this
      gameApi.findUserTransactionList.send({
        type,curIndex, pageSize:6
      })
        .then(({msg, data})=>{
          if(msg == 'success'){
            if(this.showIndex == 1 ){
              this.goingData = this.goingData.concat(data.result)
              this.goingMax = data.curIndex < Math.ceil(data.totalRow/6)
              this.goingCurIndex++
            }else if(this.showIndex == 2){
              this.finshedData = this.finshedData.concat(data.result)
              this.finshedMax = data.curIndex < Math.ceil(data.totalRow/6)
              this.finshedCurIndex++
            }else{
              this.commentData = this.commentData.concat(data.result)
              this.commentMax = data.curIndex < Math.ceil(data.totalRow/6)
              this.commentCurIndex++
            }
          }
        })
    }
  },
  computed:{
    max(){
      const {showIndex, goingMax, finshedMax, commentMax} = this
      return showIndex == 1 ? goingMax : showIndex == 2 ?  finshedMax : commentMax
    },
    curIndex(){
      const {showIndex, goingCurIndex, finshedCurIndex, commentCurIndex} = this
      return showIndex == 1 ? goingCurIndex : showIndex == 2 ?  finshedCurIndex : commentCurIndex
    },
    type(){
      const {showIndex} = this
      return showIndex == 1 ? 1 : showIndex == 2 ?  2 : 3
    },
    listData(){
      const {showIndex, goingData, finshedData, commentData} = this
      return showIndex == 1 ? goingData : showIndex == 2 ?  finshedData : commentData
    },
  },
  mounted(){
     this.initData()
  }
}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
  .record{
  background-color: #f7f7f7;
}
.user-tabs{
  background-color: #fff;
  height: 77px;
  padding: 0 30px;
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
  width: 838px;
}
.zx-foot-more{
  text-align: center;
  background-color: #fff;
  margin-bottom: 20px;
  height: 45px;
  line-height: 45px;
  width: 838px;
  margin-top: 20px;
  cursor: pointer;
}
</style>
