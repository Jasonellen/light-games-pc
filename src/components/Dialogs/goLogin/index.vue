<template>
	<div>
		<div class="checked-img-box">
			<img src="../../../assets/img/weidenglu.svg" alt="">
		</div>

		<div class="text-center">
			<el-button @click="$emit('update:fade', false)">暂不登陆</el-button>
			<el-button type="primary" @click="goLogin">立即登陆</el-button>
		</div>
	</div>
</template>

<script>
	import {publish} from 'core';
	export default {
		methods : {
			goLogin(){
				publish.$emit('dialog-show',{
					title : '登陆',
					view : 'login',
					show : true,
					options : {
						step : 3,
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped rel="stylesheet/scss">
	.checked-img-box{
		text-align: center;
		padding-bottom: 10px;
		img{
			width: 220px;
			height: 220px;
		}

	}
</style>