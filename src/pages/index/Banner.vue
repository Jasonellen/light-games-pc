<template>
    <div class="Banner">

        <el-carousel indicator-position="outside" :autoplay="false">
            <el-carousel-item v-for="(item,index) in home_bannerList" :key="index">
                <div class="carousel-cell">
                    <img
                        :src="item.img_name"
                        class="banner-img"
                        alt="图片加载失败"
                        @click='linkTo(item.banner_type,item.info_id)'
                    >
                </div>
            </el-carousel-item>
        </el-carousel>
        <div class="bn-nav">
            <ul>
                <li v-shadow v-for="(item,index) in linklist"
                    :key="index" @click="toLink(index)"><a href="javascript:;">{{item.label}}</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    var Child = {
        template: ''
    }
    export default {

        name: 'banner',
        created(){
			gameApi.findUnLoadImg.send().then(({status,data})=>{
                this.home_bannerList = [...data];
            })
        },
        mounted(){

        },
        methods: {
			linkTo(banner_type,info_id){
                if(banner_type == '1'){
                    this.$router.push('/gamesdetail/' + info_id)
                }else{
                    this.$router.push('/newsdetail/' + info_id)
                }
            },
			toLink(index){
				let item = this.linklist[index];
                if(index === 0){
                	GAME.checkedVip().then((agu)=>{
                		if(!agu)return;
                		this.$router.push(item.link)
                    })
                	return;
                }
                if(item.link){
                	if(index === 1 || index === 3){
						this.$router.push({
							path: item.link,
							query: {scrollTop: 1700}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
						})
                    }else{
						this.$router.push(item.link)
                    }

                }
            }
        },
        components: {
            Child
        },
        data () {
            return {
                home_bannerList: [

                ],
                linklist : [
                    {
                    	label : '聚划算会员',
                        link : '/user/vip',
                    },{
                	    label : '新品上线',
                        link : '/games',
                    },{
                	    label : '人气单品',
                        link : '/games',
                    }
                    // ,{
                	   //  label : '主机租凭',
                    //     link : '/games',
                    // }
                ]
            }
        }
    }

</script>


<style lang="scss" rel="stylesheet/scss">
    .Banner {
        max-width: 100%;
        margin: 0 auto;
        height: 850px;
        overflow: hidden;
        position: relative;
        .el-carousel{height: 100%;}
        .el-carousel__container{
            height: 100%;
        }
        .el-carousel__indicators--outside{
            position: absolute;
            left: 0;
            bottom: 200px;
            width: 100%;
        }
        .el-carousel__indicator.is-active button{background: red;}
    }

    .carousel-cell {
        width: 100%;
        cursor: pointer;
        overflow: hidden;
        height: 100%;
        text-align: center;
        img{width: 100%;height: 100%;vertical-align: middle;}
    }


    .bn-nav {
        position: absolute;
        bottom: 35px;
        left: 0;
        height: 160px;
        width: 100%;
        z-index: 2;
        margin: 0 auto;
        text-align: center;
    }

    .bn-nav li {
        width: 370px;
        height: 160px;
        display: inline-block;
        margin-left: 45px;
        text-align: center;
        line-height: 160px;
        background-repeat: no-repeat;
        border-radius: 10px;
    }

    .bn-nav li a {
        color: #fff;
        display: inline-block;
        width: 100%;
        height: 100%;
        font-size: 20px;
        font-weight: 600;
        text-decoration: none;
    }

    .bn-nav li:nth-child(1) {
        margin-left: 0;
        background: url('../../assets/img/index/bn-huiyuan.png') no-repeat;
        background-size:370px 160px;
    }

    .bn-nav li:nth-child(2) {
        background: url('../../assets/img/index/bn-xinpin.png');
        background-size:370px 160px;
    }

    .bn-nav li:nth-child(3) {
        background: url('../../assets/img/index/bn-danpin.png');
        background-size:370px 160px;
    }

    .bn-nav li:nth-child(4) {
        background: url('../../assets/img/index/bn-zupin.png');
        margin-right: 0;
    }

    .bannerwrap {
        position: relative;
    }

    .flickity-page-dots {
        position: absolute;
        left: 50%;
        margin-left: -100px;
        width: 200px;
        height: 100px;
        background-color: #000;
        bottom: 100px;
        z-index: 9;
    }

    .flickity-page-dots .dot {

    }

    .flickity-page-dots .dot.is-selected {

    }
</style>
