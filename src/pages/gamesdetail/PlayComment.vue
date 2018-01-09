<template>
  <div class="playcomment">
    <div class="pc-avatar">
      <img :src="item.user_photo" alt="">
    </div>
    <div class="pc-main">
      <div class="pc-head">
        <div class="pc-name">
          {{item.user_nicekname}}
        </div>
        <div class="pc-date">
          {{item.create_date}}
        </div>
      </div>
      <div class="pc-content">
        {{item.comment_text}}
      </div>
      <div class="pc-content-after" v-for="(item2,index) in (item.children || [])" :key="index">
        {{item2.user_nicekname}}：{{item2.comment_text}}
      </div>
      <div class="pc-info">
        <div class="pc-tip" @click="jubao">举报</div>
        <div class="pc-huifu"
             @click="huifu"
        >回复</div>
        <div class="pc-zan" :class="{active:item.comment_status == 1}"
             @click="zan"
        >
          <i class="el-icon-fa-thumbs-o-up" aria-hidden="true"></i>赞
        </div>
      </div>
    </div>
  </div>
</template>

<script>
	import {publish} from 'core';
	export default {
		name: 'playcomment',
		props : {
			item : {type: Object},
			isLogin : {},
			upDate : {type : Function}
		},
		methods : {
			jubao(){
				GAME.checkLogin().then(agu=>{
					if(!agu)return;
					// if(this.disabled)return;
					publish.$emit('dialog-show',{
						title : '举报',
						show : true,
						view : 'report',
                        options : {
							id : this.item.comment_id
                        }
					})

				})

			},
			//回复
			huifu(){
				GAME.checkLogin().then(agu=>{
					if(!agu)return;
					// if(this.disabled)return;
					GAME.pingLun({
						title : '回复',
						placeholder : '请回复',
						sure : (commentText)=>{
							let {id:articleId} = this.$route.params;
							let {article_type:articleType,comment_id:parentId} = this.item;
							gameApi.insertComment.send({parentId,articleId,articleType,commentText}).then(result=>{
								let {msg,status} = result;
								let success = status == 200;
								this.$message({
									message: success ? '回复成功' : msg || '回复失败',
									type: success ? 'success' : 'error',
								});
								if(success && this.upDate)this.upDate();
								GAME.close();
							})
						}
					})
				})

			},
			//点赞
			zan(){
				GAME.checkLogin().then(agu=>{
					if(!agu)return;
					// if(this.disabled)return;
					let {comment_grade:commentGrade,comment_id:commentId,comment_status} = this.item;
					if(comment_status == 1)return;
					if(!this.isLogin){
						GAME.login()
					}else{
						gameApi.udpateUserCommentGrade.send({
							commentGrade,commentId
						}).then(({status})=>{
							if(status == 200){
								this.item.comment_status = 1;
								this.$message({
									message: '点赞成功',
									type: 'success',
								});
							}
						})
					}

				})

			}
		}

	}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
  .playcomment{
    padding: 30px;
    background: #fff;
    overflow: hidden;
    margin-top: 15px;
    margin-bottom: 20px;
  }
  .pc-avatar{
    width: 64px;
    height: 64px;
    background: #145fdc;
    border-radius: 50%;
    float: left;
    overflow: hidden;
    img{width: 100%;height: 100%;display: block;border-radius: 50%;}
  }
  .pc-main{
    margin-left: 25px;
    float: left;
    width: 600px;
  }
  .pc-head{
    line-height: 64px;
    height: 64px;
    overflow: hidden;
  }
  .pc-name{
    font-size: 18px;
    float: left;
  }
  .pc-date{
    float: right;
    color: #999;
  }
  .pc-content{
    color: #737373
  }
  .pc-content-after{
    background: #eeeeee;
    padding: 20px;
    margin-top: 10px;
    color: #737373
  }
  .pc-info{
    overflow: hidden;
    margin-top: 20px;
  }
  .pc-info .pc-tip,.pc-info .pc-zan,.pc-info .pc-huifu{
    cursor: pointer;
    width: 67px;
    border: 1px solid #b7b6b6;
    border-radius: 8px;
    height: 30px;
    line-height: 30px;
    color: #999;
    padding-left: 27px;
    text-align: center;
  }

  .pc-info .pc-tip{
    float: left;
    background: url('../../assets/img/gamesdetail/tip.png') no-repeat  center left;
  }
  .pc-info .pc-zan{
    float: right;
    padding-left: 0;
    .el-icon-fa-thumbs-o-up{
      margin-right: 4px;
    }
  }
  .active .el-icon-fa-thumbs-o-up{color: red;}
  .pc-info .pc-huifu{
    float: right;
    margin-left: 15px;
    background: url('../../assets/img/gamesdetail/huifu.png') no-repeat  center left;
  }
</style>
