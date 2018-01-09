<template>
	<div>
		<div class="checked-img-box">
			<img src="../../../assets/img/huiyuan.svg" alt="">
		</div>

		<div class="text-center">
			<el-button @click="$emit('update:fade', false)">取消</el-button>
			<el-button type="primary" @click="govip">立即加入</el-button>
		</div>
	</div>
</template>

<script>
	export default {
		methods : {
			govip (){
				this.$emit('update:fade', false);
				this.$router.push('/user/vip');
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