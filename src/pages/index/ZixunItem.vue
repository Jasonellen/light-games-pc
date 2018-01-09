<template>
    <div class="zixunItem" v-shadow :class="{zixunItem2 : zx2}" @click="toDetail">
        <div class="item-pic" v-pic-optimize="item.img"></div>
        <div class="item-info">
            <div class="item-title">{{item.title}}</div>
            <div class="item-content">{{item.title_desc}}</div>
            <div class="item-date">{{item.time.split(' ').shift()}} <span><img :src="pl_icon" alt="" >{{item.commentCount}}</span></div>
        </div>
    </div>
</template>

<script>
import pl_icon from '@/assets/img/newsdetail/pl-icon.png'
	export default {
		name: 'zixunItem',
        data(){
            return{
                pl_icon,
            }
        },
        props : {
			item : {type : Object},
			zx2 : {type : Boolean},
        },
        methods : {
			toDetail(){
				this.$router.push('/newsdetail/' + this.item.id)
            }
        }
	}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
    .zixunItem{
        padding: 20px;
        margin-bottom: 10px;
        background-color: #fff;
        overflow: hidden;
        cursor: pointer;
    }
    .item-content:hover{
        /*color:#145fdc !important;
        text-decoration:underline;*/
    }
    .item-pic{
        width: 284px;
        height: 160px;
        float: left;
        line-height: 160px;
        text-align: center;
        img{
            max-width: 100%;
            max-height: 100%;
            display: inline-block;
            vertical-align: middle;
        }
    }
    .item-info{
        float: left;
        width: 551px;
        padding-left: 20px;
        .zixunItem2 &{
            width: 474px;
        }
    }
    .item-info .item-title{
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 20px;
    }
    .item-info .item-content,.item-info .item-date{
        font-size: 14px;
        color: #777;
    }
    .item-info .item-date{
        margin-top: 20px;
        overflow:hidden;
        span{
            float:right;
            img{
                vertical-align: middle;
                margin-right: 5px;
                width:20px;
            }
        }
    }
</style>
