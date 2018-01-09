
<template>
  <div id="app">
    <Navbar></Navbar>
    <Dialogs></Dialogs>
    <div class="content" style="overflow: hidden;">
      <router-view></router-view>
    </div>

  </div>
</template>

<script>
  import {mapActions} from 'vuex';
	import Navbar from '@/components/Navbar'
	import Dialogs from '@/components/Dialogs/index.vue'

	export default {
		name: 'app',
		components: {
			Navbar,
			Dialogs
		},
    methods : {
	     ...mapActions(['login'])
    },
    created(){
      this.login();
    }
	}
</script>

<style  lang="scss" rel="stylesheet/scss">
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .content{
    margin-top: 80px;
  }
  #app {
    font-family: 'noto sans s chinese';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f7f7f7;
    color: #333;
    min-width:1200px;
  }
  li{
    list-style: none;
  }
  .wrap{
    max-width: 1200px;
    margin: 0 auto;
  }
  .bannerwrap{
    position: relative;
  }
  .flickity-page-dots{
    position: absolute;
    bottom: 200px;
    left: 50%;
    margin-left: -100px;
    width: 200px;
    z-index: 999;
  }
  .flickity-page-dots .dot{
    width: 24px;
    height: 24px;
    border-radius: 12px;
    border: 2px solid #ffffff;
    float: left;
    margin-left: 20px;
    //background: url('assets/img/index/bn-btn.png') no-repeat;
    box-sizing: border-box;
  }
  .flickity-page-dots .dot.is-selected{
    background: #ffffff;
    //background: url('assets/img/index/bn-btn-active.png') no-repeat;
  }
</style>
