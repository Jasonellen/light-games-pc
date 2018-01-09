<template>
    <div>
        <span>请选择举报类型：</span>
        <el-checkbox-group class="reportList" v-model="cheList">
            <el-checkbox
                    v-for="(item,index) in checkedList"
                    :key="index"
                    :label="item"
            ></el-checkbox>
            <el-input
                    class="reportText"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入内容"
                    v-model="textarea">
            </el-input>
        </el-checkbox-group>
        <div class="reportBtnBox"><el-button @click.native="submit" type="primary">提交</el-button></div>
    </div>
</template>
<script>
    export default {
    	props : {options : {type : Object}},
        name : 'report',

        data(){
            return {
				cheList : [],
                textarea:'',
				checkedList : [ '垃圾营销','淫秽色情','有害信息','人身攻击我','违法信息','违法链接',]
            }
        },
        methods : {
            submit(){
				let arr = [...this.cheList];

				this.textarea && arr.push(this.textarea)

				if(!arr.length){
					this.$message({
						message:'请选择',
						type: 'success' ,
					});
					return;
				}else{
					arr = arr.map(({label})=>label);
				}
				gameApi.insertReport.send({commentId : this.options.id,reportText : arr.join(',')}).then(({status,msg})=>{
					let success = status == 200;
					this.$message({
						message:success ?  '举报成功' : msg || '举报失败',
						type: success ? 'success' : 'warning'
					});
					this.$emit('update:fade', false);
				})
            }
        }
    }
</script>
<style lang="scss" scoped rel="stylesheet/scss">
.reportList label{
    margin: 10px 105px 0 0;
}
.reportText{
    resize: none;
    margin-top: 10px;
}
.reportBtnBox{
    width: 100%;
    margin: 10px auto 0;
}
.reportBtnBox button{
    margin: 0 auto;
    display: block;
}
</style>