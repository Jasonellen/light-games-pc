<template>
  <div class="zixun">
    <div class="zx-head">
      <div class="zx-head-title">资讯</div>
      <div class="zx-head-more"><router-link tag="span" to="news">更多资讯》</router-link></div>
    </div>
    <div class="zx-main">
      <ZixunItem v-for="(item,index) in list" :item="item" :key="index"></ZixunItem>
    </div>
    <div v-if="!max" class="zx-foot-more" @click="load">加载更多》</div>
  </div>
</template>

<script>
	import ZixunItem from './ZixunItem'
	export default {
		name: 'zixun',
		props : {
			list : {type : Array,},
			load : {type : Function},
			max : {type : Boolean}
		},
		components: {
			ZixunItem
		}
	}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
  .zixun{
    width: 895px;
    margin-top: 30px;
    float: left;
    overflow: hidden;
  }
  .zx-head{
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #145fdc;
    background-color: #fff;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: 10px;
  }
  .zx-head-title{
    float: left;
  }
  .zx-head-more{
    float: right;
    color: #666666;
    cursor: pointer;
  }
  .zx-foot-more{
    text-align: center;
    background-color: #fff;
    margin-bottom: 20px;
    height: 45px;
    line-height: 45px;
    cursor:pointer;
  }
</style>
