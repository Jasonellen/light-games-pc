<template>
	<div class="games games-page">
		<div class="wrap"  style="min-height: 300px">
			<section class="screen">
				<el-alert
						v-if="searchList.length <= 0"
						title="没有搜索到结果"
						:closable="false"
						type="info">
				</el-alert>
				<div class="games-hot gameshot2">
					<HotItem v-for="(item, index) in searchList" :item="item"  :key="index"></HotItem>
				</div>
			</section>
		</div>
		<Footbar></Footbar>
	</div>
</template>

<script>
	import AdverImgs from './games/AdverImgs'
	import Titlebar from '@/components/Titlebar'
	import HotItem from './games/HotItem'
	import HotComment from './games/HotComment'
	import Footbar from '@/components/Footbar'
	import {Paging} from 'core';
	import {mapGetters} from 'vuex';
	export default {
		name: 'games',
		components: {
			HotItem,
			Footbar,
		},
		data(){
			return {
				selectGages : [],
			}
		},
		created(){
			log('this.searchList',this.searchList)
		},
		methods : {

		},
		computed : {
			...mapGetters(['searchList'])
		}
	}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
	.games-page{
		.wrap{
			margin-top: 30px;
			overflow: hidden;
		}
		.screen{
			margin-bottom: 30px;
			overflow: hidden;
		}
		.games-banner{
			float: left;
			width: 892px;
			height: 502px;
			overflow: hidden;
			img{
				width: 100%;
				height: 100%;
			}
		}
		.games-adver{
			float: right;
			width: 298px;
			height: 502px;
			overflow-y: scroll;
			overflow-x: hidden;
		}
		.games-hot{
			width: 890px;
			float: left;
			overflow : hidden;
		}
		.hot-warp{
			height: 882px;
			overflow-y: auto;
		}
		.gameshot2{
			float: none;
			width: auto;
		}
		h3{
			background-color: #fff;
			font-weight: 600;
			height: 50px;
			line-height: 50px;
			padding-left: 12px;
			border-bottom: 2px solid #145fdc
		}
		.games-comment{
			width: 282px;
			float: right;
		}
		.gameshot-ranking{
			margin-bottom: 30px;
			overflow: hidden;
			width: 100%;
			background: #fff;
			.select-label{
				color: #222;
				text-align: center;
			}
		}
		.gameshot-ranking li{
			position: relative;
			float: left;
			height: 68px;
			line-height: 68px;
			border-bottom: 2px solid #145fdc;
			text-align: center;
			width: 300px;
			color: #222;
			font-size: 16px;
			&>span{display: block;width: 100%;}
			.select-icon{
				color: #222;
				margin-left: 6px;
				display: inline-block;
				vertical-align: middle;
			}
			.line{
				height: 20px;
				width: 1px;
				background: #222;
				position: absolute;
				right: 0;
				top: 50%;
				margin-top: -10px;
			}
			&:last-child{
				.line{display: none;}
			}
		}
	}

</style>
