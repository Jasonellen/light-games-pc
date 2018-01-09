<template>
  <router-link to="/games">
  <div class="caritem" v-shadow>
    <div class="caritem-pic">
      <img src="../../assets/img/buycar/addgame.png" alt="">
    </div>
    
       
      <div class="car-wrap">
        添加游戏
      </div>
  
    
  </div>
   </router-link>
</template>

<script>
export default {
  name: 'caritem'

}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
.caritem{
  width: 898px;
  padding: 30px;
  padding-right: 25px;
  margin-top: 15px;
  margin-bottom: 15px;
  overflow: hidden;
  background: #fff;
}
.caritem-pic{
  float: left;
  width: 120px;
  margin-top: 10px;
}
.car-wrap{
  float: right;
  line-height: 150px;
  text-align: right;
  font-size: 18px;
  padding-right: 20px;
  color: #999;
}
</style>
