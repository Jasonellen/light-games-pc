<template>
    <div class="newsdetail-page">
        <div class="wrap">
            <section class="screen">
                <div class="_navbar">
                    <ul>
                        <li>游戏详情</li>
                        <li>></li>
                        <li>游戏资讯</li>
                    </ul>
                </div>
                <div class="gd-main">
                    <h1>
                        {{info.title}}
                    </h1>
                    <div class="nd-info">
                        <div class="nd-user">{{info.author}}</div>
                        <div class="nd-date">
                            {{info.time && info.time.slice(0,10)}}
                        </div>
                    </div>
                    <article v-if = 'info.content.length>0' class="article" v-html="info.content[content_index]"></article>
                    <el-pagination
                      small
                      @current-change="handleCurrentChange"
                      :page-size="1"
                      layout="prev, pager, next, jumper"
                      :total="info.content.length">
                    </el-pagination>
                </div>
                <div class="gd-details">
                    <h3>相关资讯</h3>
                    <SmallItem  v-for="(item, index) in list" :item="item"  :key="index"></SmallItem>
                </div>
            </section>
        </div>
        <div style='width:750px'>
        <div class="wrap">
            <section class="screen">
                <div class="pinglun">
                    <div class="pinglun-num">
                        <img src="../assets/img/newsdetail/pl-icon.png" alt="">
                        <span>{{info.commentCount > 999 ? '999+' : info.commentCount}}</span>
                    </div>
                    
                    <div class="pinglun-say">
                        <input type="text" name="" placeholder="输入你想说的，发表评论" v-model="commentText">
                        <div class="pinglun-send" @click="comment">
                            发送
                        </div>
                    </div>
                    
                </div>
            </section>
        </div>
        <PlayComment :upDate="upWjpl" isLogin="userInfo.userLevel" v-for="(item,index) in wjList" :key="index" :item="item"></PlayComment>
        <Moremsg v-if="!maxWj" @click.native="wjNext"></Moremsg>
        </div>
        <Footbar></Footbar>
    </div>
</template>

<script>
	import SmallItem from './news/SmallItem';
	import Comments from '@/components/Comments';
	import Footbar from '@/components/Footbar';
    import PlayComment from './gamesdetail/PlayComment'
    import {mapGetters} from 'vuex';
    import {Paging} from 'core';
    import Moremsg from '@/components/Moremsg'

	export default {
		name: 'newsdetail',
		components: {
			SmallItem,
			Footbar,
            Moremsg,
            PlayComment
		},
        data(){
		    return {
				info : {content:[]},
                list : [],
				commentText : '',
                wjList : [],
                maxWj:true,
                content_index:0
            }
        },
        computed : {
            ...mapGetters(['userInfo']),
        },
		methods: {
            //玩家评论
            sendWj(){
                this.wjApi.send().then(({data,status})=>{
                    if(status === 200){
                        let {curIndex,totalRow,pageSize,result} = data;
                        if(curIndex === 1)this.wjList = [];
                        this.wjList.push(...result);
                        this.maxWj = curIndex >= Math.ceil(totalRow/pageSize);
                        this.zxLoad = false;
                    }
                })
            },
            upWjpl(){
                let {id:gameId} = this.$route.params;
                //玩家评论
                this.wjApi = new Paging({
                    articleId : gameId,
                    articleType : 1,
                    pageSize : 4,
                },gameApi.findComment.send);
                this.sendWj();
            },
            wjNext(){
                this.wjApi.curIndex++;
                this.sendWj()
            },
            handleCurrentChange(val) {
                this.content_index = val - 1
                console.log(`当前页: ${val}`);
            },
			comment(){
				GAME.checkLogin().then(agu=>{
					if(!agu)return;
					let {commentText} = this;

					if(!commentText.trim()){
						this.$message({
							message: '请输入评论内容',
							type: 'warning'
						});
						return;
					}
					let {id:articleId,commentCount:commentGrade} = this.info;
					gameApi.insertComment.send({articleId,commentGrade,articleType:1,commentText}).then(({status,msg})=>{
						let success = status == 200;
						this.$message({
							message: success ? '评论成功' : msg|| '评论失败',
							type: success ? 'success' : 'warning'
						});
						success && this.sendWj()
					})
                })

			},
            upLoad(){
                let {id} = this.$route.params;
                this.commentText = '';
                gameApi.findGameDetalsById.send({id}).then(({status,data})=>{
                    this.info = data;
                    this.info.content = data.content.split('[page_break]')
                    let {contentLabel = []} = data;
                    this.list = contentLabel;
                })
            }

		},
		created(){
            this.upLoad()
            this.upWjpl()
		},
	}
</script>


<style lang="scss" rel="stylesheet/scss">
    .newsdetail-page{
        .wrap{
            overflow: hidden;
        }
        .article{
            text-indent: 2em;
            line-height: 26px;
            img{
                max-width: 100%;
                margin:14px 0;
            }
        }
        .screen{
            margin-bottom: 30px;
            overflow: hidden;
        }
        ._navbar{
            overflow: hidden;
            margin: 5px 0;
        }
        ._navbar li{
            float: left;
            color: #999;
            line-height: 30px;
            margin-left: 8px;
        }
        h3{
            background-color: #fff;
            font-weight: 600;
            height: 50px;
            line-height: 50px;
            padding-left: 12px;
            border-bottom: 2px solid #145fdc
        }
        .gd-main{
            width: 750px;
            float: left;
            padding: 45px 30px;
            background-color: #fff;
        }
        .gd-main h1{
            font-size: 30px;
            color: #333333;
            margin-bottom: 25px;
            overflow:hidden; 
            text-overflow:ellipsis;
            display:-webkit-box; 
            -webkit-box-orient:vertical;
            -webkit-line-clamp:2; 
            max-height: 80px; 
        }
        .nd-info{
            overflow: hidden;
            height: 30px;
            margin-bottom: 50px;
            border-bottom: 1px solid #ddd;
        }
        .nd-info .nd-user{
            float: left;
        }
        .nd-info .nd-date{
            float: right;
        }
        .newsdetail article p{
            font-size: 20px;
            padding: 20px 0;
            color: #555;
        }
        .gd-details{
            float: right;
            width: 368px;
        }
        .pinglun{
            height: 90px;
            line-height: 50px;
            padding: 20px;
            background-color: #fff;
        }
        .pinglun-num{
            float: left;
            color: #999;
        }
        .pinglun-num img{
            vertical-align: middle;
        }
        .pinglun-say{
            float: right;
            width: 635px;
            border: 1px solid #eee;
            border-radius: 5px;
        }
        .pinglun-say input{
            float: left;
            border: none;
            width: 500px;
            outline: none;
            height: 47px;
            line-height: 47px;
            text-indent: 12px;
            font-size: 16px;
            color: #999;
        }
        .pinglun-send{
            cursor: pointer;
            float: right;
            border-radius: 5px;
            color: #fff;
            text-align: center;
            background-color: #145fdc;
            width: 120px;
        }
        .el-pagination{
            margin: 30px auto 0;
            text-align: center;
        }
    }

</style>
