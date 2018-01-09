<template>
	<el-dialog
			:title="title"
			:visible.sync="dialogVisible"
			size="tiny"
			custom-class="custom-class-1"
	>
		<component :is="currentView" v-on:changeTitle = 'changeTitle' :dialogVisible="dialogVisible" :options="options" :fade.sync="dialogVisible">
			<!-- 组件在 vm.currentview 变化时改变！ -->
		</component>
	</el-dialog>
</template>

<script>
	import {publish} from 'core';
	import Login from './login';
	import PligLun from './pingl';
	import addAddress from './addAddress';
	import report from './report';
	import gologin from './goLogin';
	import govip from './goVip';
	export default {
		name : 'dialogs',
		data(){
			return {
				dialogVisible : false,
				title : '',
				currentView : '',
                options : {},
			}
		},
		components : {
			Login,PligLun,addAddress,report,gologin,govip
		},
		methods:{
			changeTitle(title){
				this.title = title
			},
		},
		mounted(){
            publish.$emit('dialog-show',{
				show : false,
				view : 'govip'
			})
		},
		created(){
			publish.$on('dialog-show',data=>{
				let {title,show,view,options} = data;
				this.title = title || '提示';
				this.dialogVisible = show;
				this.currentView = view;
				this.options = options || {};
			})
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss">

</style>