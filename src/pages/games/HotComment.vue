<template>
  <div class="hotcomment" v-shadow>
    <div class="hotcomment-info">
      <span class="hc-avatar" :style="{backgroundImage : `url(${item.user_photo})`}"></span>
      <span class="hc-name">{{item.user_nicekname}}</span>
      <span class="hc-date">{{item.create_date.split(' ').shift()}}</span>
    </div>
    <div class="hotcomment-title">
      {{item.comment_text}}</div>
    <div class="hotcomment-author">
      ——转自{{item.compiler}}
    </div>
  </div>
</template>

<script>
	export default {
		name: 'hotcomment',
		props : {
			item : {type : Object}
		}

	}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
  .hotcomment{
    background-color: #fff;
    margin-top: 15px;
    padding: 12px;
    height: 132px;
  }
  .hotcomment-info{
    overflow: hidden;
  }
  .hotcomment-info .hc-avatar{
    float: left;
    width: 24px;
    height: 24px;
    background-size: cover;
    border-radius: 50%;
  }
  .hotcomment-info .hc-name{
    float: left;
    color: #999;
    margin-left: 12px;
    font-size: 14px;
    width: 136px;
    height: 20px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .hotcomment-info .hc-date{
    float: right;
    color: #999;
    font-size: 14px;
  }
  .hotcomment-title{
    margin: 10px 0;
    line-height: 25px;
    height: 50px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .hotcomment-author{
    text-align: right;
    color: #999;
    font-size: 14px;
    margin-top: -20px;
  }
</style>
