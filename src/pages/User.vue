<template>
  <div class="user-page">
    <div class="user-boxs">
      <UserNav></UserNav>
      <div class="user-main">
        {{$route.params.id}}
        <router-view></router-view>
      </div>

    </div>


  </div>
</template>

<script>
import UserNav from "./user/Nav"


export default {
  name: 'user',
  components: {
    UserNav
  }
}
</script>


<style lang="scss" scoped rel="stylesheet/scss">
.user-page{
  padding-top: 30px;
  width: 1200px;
  margin: 0 auto;
  position: relative;
  padding-bottom: 40px;
  min-height: 700px;
  .user-boxs{
    position: relative;
    height: 100%;
  }
  .user-main{
    width: 960px;
    margin-left: 235px;
    background: #fff;
    margin-bottom: 20px;
  }
  .user-wrap{
    background-color: #fff;
    padding: 30px;
    min-height: 700px;
  }
}



</style>
