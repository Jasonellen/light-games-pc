<template>
    <div class='nav_box'>
        <div class="navbar">
            <div class="wrap">
                <h1><router-link to="/"><img src="../assets/img/logo.png" alt=""></router-link></h1>
                <div class="nav-right">
                    <div class="nav-list">
                        <router-link to="/">首页</router-link>
                        <router-link to="/news" class='.newss'>新闻</router-link>
                        <router-link to="/games">游戏库</router-link>
                        <a @click='toShop'>购物车</a>
                    </div>

                    <div class="nav-line"></div>
                    <div class="nav-search">
                        <span class="search-icon"></span>
                        <el-select
                                @keydown="alert(2)"
                                ref="select"
                                v-model="searchValue"
                                filterable placeholder="请选择"
                                allow-create
                                @change="selectChange"
                                class="nav-search-input">
                            <el-option
                                    v-for="item in options"
                                    :key="item.hot_id"
                                    :label="item.hot_word"
                                    :value="item.hot_word">
                            </el-option>
                        </el-select>
                        <!-- <input class="nav-search-input" type="text" placeholder="搜索 刺客信条"> -->
                    </div>
                    <div class="nav-user">
                        <el-popover
                                popper-class="login-select-warp"
                                placement="top-start"
                                title=""
                                width="170"
                                trigger="hover">
                            <div class="login-select">
                                <p
                                        v-for="(item,index) in list"
                                        :key="item.id"
                                        @click="handleClick(item.id)"
                                >{{item.label}}</p>
                            </div>
                            <div  class="nav-icon-user" slot="reference" v-pic-optimize="headImg">
                            </div>
                        </el-popover>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
	import {mapGetters} from 'vuex';
	import {publish,Paging} from 'core';
	import  iconUser from '@/assets/img/icon-user.png'
	import {mapActions} from 'vuex';
	export default {
		name: 'navbar',
		data () {
			return {
				msg: 'navbar',
				loginSelect1 : [
					{
						label : '登陆',
						id : '01'
					},
					{
						label : '注册',
						id : '02'
					}
				],
				loginSelect2 : [
					{
						label : '个人资料',
						id : '03',
					},
					{
						label : '我的游戏',
						id : '04',
					},
					{
						label : '会员中心',
						id : '05',
					},
					{
						label : '关于我们',
						id : '06',
					},
					{
						label : '退出登录',
						id : '07',
					}
				],
				options: [],
				searchValue:'',
			}
		},
		computed : {
			...mapGetters(['userInfo','headImg']),
			list(){
				return  this['loginSelect' + (this.userInfo.userLevel ? '2' : '1')]
			},
		},
		methods : {
			...mapActions(['logout','saveSearch','headImgAction']),
			toShop(){
				GAME.checkLogin().then(agu=>{
					if(!agu)return;
					this.$router.push("/buycar")
				})

			},
			searchClick(){
				log('this.searchValue',this.searchValue)
			},
			//搜索
			hotSearch(gameName){
				//创建搜索实例
				this.createdSearchApi({
					gameType:'gameName',
					gameName,
					pageSize : 1000,
				});
				this.send();
			},
			send(){
				this.findGame.send().then(result=>{
					let {status,msg} = result;
					if(status === 200){
						let {result:list,totalRow,pageSize} = result.data;
						this.saveSearch(list || []);
						if(this.$route.fullPath !== '/search'){
							this.$router.push('/search')
						}
					}
				})
			},
			createdSearchApi(params){
				this.findGame = new Paging(params,gameApi.findNewGame.send)
			},
			selectChange(value){
				this.hotSearch(value);
			},
			toUser(){
				this.$router.push('/user')
			},
			handleClick(id){
				switch (id){
					case '01'://登陆

					case '02'://注册
						GAME.login({
							step : id === '01' ? 3 : 1,
						})
						break;
					case '03'://个人资料
						this.$router.push('/user');
						break;
					case '04'://我的游戏
						this.$router.push('/user/game');
						break;
					case '05'://会员中心
						this.$router.push('/user/vip');
						break;
					case '06'://关于我们call
						this.$router.push('/user/call');
						break;
					case '07'://退出登录
						gameApi. outUser.send()
						.then(({status,msg})=>{
							let success = status == 200;
							this.$message({
								message: success ? '退出成功' : msg || '退出失败',
								type: success ? 'success' : 'warning'
							});
							this.headImgAction(iconUser)
							this.logout()
							this.$router.replace('/')
						})
						break;
				}
			}
		},
		mounted(){
			publish.$on('clearSearchValue', ()=> {
				this.searchValue = '';
			})
			//热门搜索
			gameApi.findGameHotSale.send().then(({data})=>{
				this.options = data || [];
			})
			let users = localStorage.getItem('users')

			var $input = this.$refs.select.$el.getElementsByTagName('input')[0];
			$input.onkeydown =(e) =>{
                if(e.keyCode === 13 || e.code === 'Enter'){
					$input.value && this.selectChange($input.value)
                }
			}
		}
	}
</script>

<style lang='scss' rel="stylesheet/scss">

    .nav_box{
        .el-select-dropdown{
            min-width: 170px !important;
        }
        .el-select .el-input .el-input__icon{
            display: none;
        }
        .el-select .el-input .el-input__inner{
            border: none;
            height: 24px;
            padding: 0;
            width: 160px;
        }
        .navbar{
            height: 80px;
            width: 100%;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 999;
            overflow: hidden;
            border-bottom: 1px solid #ddd;
            background:rgba(255,255,255,0.95);
            box-sizing: border-box;
        }

        .navbar h1{
            float: left;
            padding-top: 15px;
            cursor: pointer;
        }
        .nav-right{
            float: right;
            width: 670px;
            z-index: 1000;
            background:rgba(255,255,255,0.95);
        }
        .nav-list{
            float: left;
        }
        .nav-list a{
            float: left;
            height: 80px;
            border-bottom: 4px solid #fff;
            line-height: 80px;
            padding: 0 20px 0 20px;
            cursor: pointer;
            font-size: 18px;
            box-sizing: border-box;
        }
        .nav-list a{
            color: #555;
            display: inline-block;
            text-decoration: none;
        }
        .nav-list .router-link-exact-active{
            color: #145fdc;
            border-bottom: 4px solid #145fdc;
            box-sizing: border-box;
        }
        .nav-search{
            float: left;
            margin-top: 22px;
            padding-left: 20px;
        }
        .nav-search-input{
            display: inline-block;
            background: url('../assets/img/search-bg.png') no-repeat;
            width: 210px;
            height: 30px;
            border: none;
            padding-left: 30px;
            line-height: 30px;
            outline: none
        }
        .nav-line{
            height: 22px;
            float: left;
            width: 1px;
            margin-top: 28px;
            background-color: #ddd;
            margin-left: 15px;
            margin-right: 15px;
        }
        .nav-user{
            /*float: left;
            height: 80px;*/
        }
        .nav-icon-user{
            display: inline-block;
            width: 30px;
            height: 30px;
            margin-top: 20px;
            /*margin-left: 20px;*/
            border-radius: 50%;
            overflow: hidden;
            img{
                width:100%;
                height:100%;
            }
        }
    }
    .nav-search-input{
        display: inline-block;
        background: url('../assets/img/search-bg.png') no-repeat;
        width: 210px;
        height: 30px;
        border: none;
        padding-left: 30px;
        line-height: 30px;
        outline: none
    }
    .nav-line{
        height: 22px;
        float: left;
        width: 1px;
        margin-top: 28px;
        background-color: #ddd;
        margin-left: 15px;
        margin-right: 15px;
    }
    .nav-user{
        /*float: left;
		height: 80px;*/
    }
    .nav-icon-user{
        display: inline-block;
        background: url('../assets/img/icon-user.png') no-repeat;
        width: 30px;
        height: 30px;
        margin-top: 20px;
        /*margin-left: 20px;*/

        .nav-search-input{
            display: inline-block;
            background: url('../assets/img/search-bg.png') no-repeat;
            width: 210px;
            height: 30px;
            border: none;
            padding-left: 30px;
            line-height: 30px;
            outline: none
        }
        .nav-line{
            height: 22px;
            float: left;
            width: 1px;
            margin-top: 28px;
            background-color: #ddd;
            margin-left: 15px;
            margin-right: 15px;
        }
        .nav-user{
            /*float: left;
    		height: 80px;*/
        }
        .nav-icon-user{
            display: inline-block;
            background: url('../assets/img/icon-user.png') no-repeat;
            width: 30px;
            height: 30px;
            margin-top: 20px;
            /*margin-left: 20px;*/
        }
    }


</style>
