<template>
	<div class="load-pic">
		<div class="warpsss">
			<div class="left">
				<el-button type="primary"
				>本地上传</el-button>
				<input class='imgUpload' type="file" accept="image/png,image/gif,image/jpeg" @change="uploadImg">

				<div class="pic-box" v-pic-optimize="url">
					{{pathName}}
				</div>
			</div>
			<div class="line">

			</div>
			<div class="right">
				<div class="pic-box">
					<p>
						您上传的头像会自动生成三种尺寸，
					</p>
					<p>请注意中小尺寸的头像是否清晰</p>


					<div class="imgWarp">

						<div class="img-item p170">
							<div class="box"  v-pic-optimize="url">
								{{pathName}}
							</div>
							<p>170px</p>
						</div>
						<div class="img-item p70">
							<div class="box"  v-pic-optimize="url">
								{{pathName}}
							</div>
							<p>70px</p>
						</div>
						<div class="img-item p30">
							<div class="box"  v-pic-optimize="url">
								{{pathName2}}
							</div>
							<p>30px</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="save">
			<el-button type="primary" @click="$emit('onHidden')">保存</el-button>
		</div>
	</div>
</template>

<script>
	export default {
		props : {
			loadImg : {type : Function},
			url : {type : String}
		},
		methods : {
			uploadImg(e){
				let file = e.target.files[0];
				let config = {
					apiType : 'file',
					headers:{'Content-Type':'multipart/form-data'}
				};  //添加请求头
				gameApi.userUploadPhoto.send({
					imgFile : file
				},config).then(({data,status})=>{
					if(status == 200 && data){
						this.loadImg(data);
					}

				})
			},
		},
		computed : {
			path (){
				return {'background-image': `url(${this.url})`}
			},
			pathName(){
				return this.url ? '' : '没有预览'
			},
			pathName2(){
				return this.url ? '' : '没有<br>预览'
			}
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	.load-pic{

	}
</style>