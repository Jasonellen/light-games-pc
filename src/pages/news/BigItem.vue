<template>
  <div class="bigitem" @click="entryZx" v-shadow>
    <a>
      <div class="bigitem-pic">
        <img class="bigitem-pic-img" :src="item.img" alt="">
        <img class="big-item-bg" src="../../assets/img/news/big-item-bg.jpg" alt="">
      </div>
      <div class="bigitem-info">
        <div class="bigitem-title">
          {{item.title}}
        </div>
        <div class="bigitem-comment">
          {{item.commentCount}}
        </div>
      </div>
    </a>
  </div>
</template>

<script>
	export default {
		name: 'bigitem',
		props : {
			item : {type : Object}
		},
        methods : {
			entryZx(){
              this.$router.push('/newsdetail/' + this.item.id)
            }
        }

	}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
  .bigitem{
    cursor: pointer;
    width: 588px;
    height: 330px;
    float: left;
    margin-bottom: 30px;
    position: relative;
    .bigitem-pic-img{
      height: 100%;
      width: 100%;
    }
  }
  .bigitem-pic{
    position: relative;
    width: 588px;
    height: 330px;
  }
  .big-item-bg{
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
  .bigitem-info{
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 3;
    width: 548px;
    padding: 18px;
  }
  .bigitem-title{
    font-size: 20px;
    font-weight: 600;
    color: #fff;
  }
  .bigitem-comment{
    position: absolute;
    right: 24px;
    bottom: 20px;
    color: #fff;
    font-size: 18px;
  }
</style>
