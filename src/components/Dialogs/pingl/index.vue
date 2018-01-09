<template>
    <div>
        <el-input
            type="textarea"
            :rows="8"
            :placeholder="options.placeholder || 请输入内容"
            v-model="textarea">
        </el-input>
        <el-button class="sureBtn" type="primary" @click="submit">提交</el-button>
    </div>

</template>
<script>
    export default {
        name : 'ping-lun',
        props : {
            options : {type : Object}
        },
        data(){
            return {
                textarea : ''
            }
        },
        methods : {
            submit(){
            	if(!this.textarea){
					this.$message({
						message: '请输入内容',
						type: 'warning',
					});
            		return;
                }
                this.options.sure && this.options.sure(this.textarea)
            }
        }
    }
</script>
<style lang="scss" scoped rel="stylesheet/scss">
.sureBtn{
    margin: 10px auto 0;
    display: block;
}
</style>