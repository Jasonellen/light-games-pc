<template>
  <div class="newsitem" @click="entryZx" v-shadow>
    <div class="item-pic" v-pic-optimize="item.img">
    </div>
    <div class="item-title">
      {{item.title}}
    </div>
    <div class="item-subtitle">
      <p>{{item.title_desc}}</p>
    </div>
    <div class="item-info">
      <div class="item-date">
        {{item.time && item.time.slice(0,10)}}
      </div>
      <div class="item-comment">
        <img :src="pl_icon" alt="">{{item.commentCount}}
      </div>
    </div>

  </div>
</template>

<script>
  import pl_icon from '@/assets/img/newsdetail/pl-icon.png'
	export default {
		name: 'newsitem',
    data(){
      return{
        pl_icon,
      }
    },
		props:['item'],
		methods : {
			entryZx(){
				this.$router.push('/newsdetail/' + this.item.id)
			}
		}
	}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
  .newsitem{
    width: 284px;
    height: 330px;
    float: left;
    margin-left: 20px;
    margin-bottom: 30px;
    background-color: #fff;
    cursor: pointer;
  }
  .news-content .newsitem:nth-child(4){
    margin-left: 0;
  }
  .news-content2 .newsitem:nth-child(1),.news-content2 .newsitem:nth-child(5),.news-content2 .newsitem:nth-child(9){
    margin-left: 0;
  }
  .news-content2 .newsitem:nth-child(13),.news-content2 .newsitem:nth-child(17),.news-content2 .newsitem:nth-child(21){
    margin-left: 0;
  }
  .newsitem .item-pic{
    width: 284px;
    height: 160px;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .newsitem .item-title{
    font-size: 16px;
    font-weight: 600;
    color: #222;
    line-height: 22px;
    overflow: hidden;
    padding: 12px;

    text-overflow:ellipsis;
    display:-webkit-box; 
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2; 
    height: 55px; 
  }
  .newsitem .item-subtitle{
    font-size: 16px;
    color: #777;
    padding: 12px;
    margin-bottom: 50px;

    overflow:hidden; 
    text-overflow:ellipsis;
    display:-webkit-box; 
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2; 
    height: 55px; 

  }
  .newsitem .item-info{
    overflow: hidden;
    padding-left: 12px;
    padding-right: 12px;
    margin-top:-20px;
  }
  .newsitem .item-date{
    float: left;
    color: #777;
    font-size: 14px;
  }
  .newsitem .item-comment{
    float: right;
    color: #777;
    font-size: 14px;
    img{
      vertical-align: middle;
      margin-right: 5px;
      width:20px;
    }
  }
</style>
