<template>
    <div class="smallitem" @click='toDetail'>
        <div class="smallitem-pic" v-pic-optimize="item.img">
        </div>
        <div class="smallitem-info">
            <div class="smallitem-title">{{item.title}}</div>
            <div class="smallitem-date">
                {{(item.time || '').split(' ').shift()}}
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		name: 'smallitem',
        props : {item : Object,},
        methods:{
            toDetail(){
                this.$router.replace('/newsdetail/' + this.item.id)
                location.reload()
            }
        }
	}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
    .smallitem{
        margin-top: 15px;
        padding: 20px;
        padding-right: 12px;
        background: #fff;
        overflow: hidden;
        cursor: pointer;
    }
    .smallitem-pic{
        float: left;
        height: 100px;
        width: 100px;
        line-height: 100px;
        text-align: center;
        img{
            max-width: 100%;
            max-height: 100%;
            vertical-align: middle;
        }
    }
    .smallitem-info{
        float: left;
        width: 220px;
        margin-left: 12px;
    }
    .smallitem-title{
        font-size: 16px;
        text-overflow:ellipsis;
        display:-webkit-box; 
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2; 
        height: 45px; 
        overflow:hidden;
    }
    .smallitem-date{
        text-align: right;
        color: #999;
        margin-top: 30px;
    }
</style>
