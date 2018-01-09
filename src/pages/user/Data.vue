<template>
  <div class="userdata">
    <form class="form-horizontal">
      <div class="form-group form-group-1">
        <label class="col-sm-2 control-label"

        >头像
        </label>
        <div class="col-sm-10 form-group-1">
          <div class="touxiang" v-pic-optimize="userPhoto">

          </div>
          <a class="user-btn user-btn-detail float-right" @click="dialogVisible=true">上传图片</a>
        </div>
      </div>
      <el-dialog
              title="上传图片"
              :visible.sync="dialogVisible"
              size="tiny"
              custom-class="custom-class-load"
      >
        <GoAlipay
                :url="userPhoto"
                :loadImg="loadImg"
                @onHidden='hideUpload'
        ></GoAlipay>
      </el-dialog>
      <div class="form-group form-group-1">
        <label class="col-sm-2 control-label">昵称</label>
        <div class="col-sm-10 form-group-1">
          <input v-model="userNickname" type="email" class="form-control" placeholder="请输入昵称">
        </div>
      </div>
      <div class="form-group form-group-1">
        <label class="col-sm-2 control-label">简介</label>
        <div class="col-sm-10 form-group-1">
          <textarea v-model="userSynopsis" name="name" class="form-control" rows="8" cols="80"></textarea>
        </div>
      </div>
      <div class="form-group form-group-1">
        <label class="col-sm-2 control-label">标签</label>
        <div class="col-sm-10 add-label">
          <el-tag v-for="(item,index) in userLabel" :key="index" type="gray">{{item}}</el-tag>
          <a class="user-btn user-btn-detail float-right" @click="dialogVisible1 = true;">添加标签</a>
        </div>
      </div>
      <div class="form-group form-group-20">
        <label class="col-sm-2 control-label">性别</label>
        <div class="col-sm-10">
          <label><input name="Fruit" type="radio" v-model="userSex" value="1" />男 </label>
          <label><input name="Fruit" type="radio" v-model="userSex" value="2"/>女 </label>
        </div>
      </div>
      <div class="form-group form-group-20">
        <label class="col-sm-2 control-label">城市</label>
        <div class="col-sm-10" @click="selectCity">
          {{userCity}}
        </div>
      </div>
      <div class="form-group form-group-1">
        <label class="col-sm-2 control-label">生日</label>
        <div class="col-sm-10">
          <el-date-picker
                  v-model="userBirthday"
                  type="date"
                  placeholder="选择日期"
                  :editable="false"
                  :picker-options="pickerOptions0">
          </el-date-picker>
        </div>
      </div>

      <div class="form-group">
        <div class="float-right">
          <a class="outloginbtn" href="">退出登陆</a>
          <a class="savebtn" href="javascript:;" @click="save">保存</a>
        </div>
      </div>
    </form>
    <el-dialog
            customClass="custom-class-1"
            title="添加标签"
            :visible.sync="dialogVisible1"
            size="tiny">
      <div>
        <el-input class="labIpt" :maxlength="6" v-model="labText" placeholder="请输入你要添加的标签"></el-input><el-button @click="addLab" type="primary">添加</el-button>
      </div>
      <div class="lineBox"><div class="line"></div><div class="lineText">你的标签</div><div class="line"></div></div>
      <div class="labBox">
        <el-button
                v-for="(item,index) in userLabel"
                :plain="true"
                :key="index"
                class="labBtn"
                type="info">
          <span>{{ item }}</span>
          <i class="el-icon-circle-close" @click="closeLab(index)"></i>
        </el-button>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible1 = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
    import {publish} from 'core';
	import GoAlipay from '@/components/LoadPic'
  import {mapActions} from 'vuex';
	export default {
		name: 'userdata',
		data(){
			return {
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() < (new Date([1950,1,1])).getTime() || time.getTime() > (new Date()).getTime();
					}
				},
				userBirthday : '',
				userSynopsis : '',
				userPhoto : '',
				userLabel : [],
				userSex : 1,
				userNickname : '',
				userCity : '',
				cityCode : '',
				dialogVisible : false,
				labText:'',
				dialogVisible1 : false,
			}
		},
		components : {GoAlipay},
		methods:{
      ...mapActions(['headImgAction']),
      hideUpload(){
        this.dialogVisible=false
      },
			//添加标签
			addLab(){
				if( !this.labText ){
					this.$message({
						message: '请输入标签',
						type: 'warning'
					});
				}else{
					this.userLabel.push(this.labText);
					this.labText = '';
				}
			},
			//删除标签
			closeLab(index){
				this.userLabel.splice(index,1)
			},
			//上传图片
			loadImg(url){
				this.userPhoto = url;
        this.headImgAction(url)
			},
			//关闭弹窗
			parSaveImg(){
				this.dialogVisible = false;
			},
			//保存
			save(){
				let {
					userNickname,
					userSynopsis,
					userLabel,
					userSex,
					userCity,
					cityCode,
					userBirthday
				} = this;

				window.userBirthday = userBirthday;
				if(typeof userBirthday === 'object'){
					userBirthday = userBirthday.toLocaleString().split(' ')[0]
				}
				userLabel = userLabel.join(',');
				gameApi.saveUser.send({
					userNickname,
					userSynopsis,
					userLabel,
					userSex,
					userCity,
					cityCode,
					userBirthday,
				})
				.then(({data,status,msg})=>{
					let success = status =='200';
					this.$message({
						message: success ? '保存成功' : msg || '保存失败',
						type: success ? 'success' : 'error',
					});
				})
			},
            //选择城市
      selectCity(){
        let _this = this
  			publish.$emit('dialog-show',{
  				show:true,
  				view : 'addAddress',
  				title : '选择城市',
  				options : {
  					isSelectCity : true,
  					sure(obj){
  						let {pname,pid,cname,cid,isMunicipality} = obj;
              _this.userCity = pname.indexOf('市')>0 ? pname : cname
              _this.cityCode = pname.indexOf('市')>0 ? pid : cid
  						log('选择城市数据----->',pname,pid,cname,cid,'是不是直辖市---',isMunicipality)
  					}
  				}
  			})
      }
		},
		created(){
			//查询用户资料
			gameApi.findUserMessage.send().then(({data})=>{
				this.userNickname = data.userNickname; //名字
				this.userSynopsis = data.userSynopsis; //简介
				this.userPhoto = data.userPhoto || ''; //头像
				this.userLabel = data.userLabel ? data.userLabel.split(',') : []; //标签
				this.userSex = data.userSex; //性别 1男 2 女
				this.userBirthday = data.userBirthday || '1950/1/1'; //生日 userCity
				this.userCity = data.userCity; //城市;
			})
		}
	}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
  .float-right{
    float: right;
  }
  .userdata{
    background: #fff;
    padding: 20px 40px;
    width: 960px;
    color: #666666;
  }
  .form-group{
    width: 100%;
    overflow: hidden;
    margin-top: 15px;
  }
  .col-sm-2{
    float: left;
    height: 40px;
    line-height: 40px;
    width: 80px;
  }
  .touxiang{
    width: 64px;
    height: 64px;
    border-radius: 50%;
    float: left;
    background-color: #eee;
    background-size: cover;
  }
  .form-group-20{
    height: 40px;
    line-height: 40px;
  }
  .col-sm-10{
    float: left;
    width: 780px;
    padding-left: 20px;
    height: 100%;
    border-bottom: 1px solid #eeeeee;
    .form-group-1 &{
      padding-bottom: 10px;
    }
  }
  .user-btn{
    padding: 2px 6px;
    margin-top: 20px;
    font-size: 14px;
    display: inline-block;
    float: right;
    margin-left: 12px;
    border-radius: 10px;
    line-height: 24px;
    min-width: 80px;
    text-align: center;
    text-decoration: none;
    border: 1px solid #145fdc;
  }
  .user-btn-detail{
    color: #fff;
    background-color: #145fdc
  }
  input.form-control{
    height: 40px;
    border: 1px solid #eeeeee;
    background-color: #f7f7f7;
    outline: none;
    padding: 0 10px;
    width: 240px;
  }
  textarea.form-control{
    border: 1px solid #eeeeee;
    background-color: #f7f7f7;
    outline: none;
    padding: 10px 10px;
    width: 756px;
  }
  .outloginbtn{
    padding: 2px 6px;
    font-size: 14px;
    display: inline-block;
    margin-left: 12px;
    border-radius: 10px;
    line-height: 28px;
    min-width: 80px;
    color: #e32132;
    text-align: center;
    margin-top: 40px;
    margin-bottom: 30px;
    text-decoration: none;
    border: none;
    //border: 1px solid #e32132;
  }
  .savebtn{
    padding: 3px 10px;
    font-size: 14px;
    display: inline-block;
    margin-left: 12px;
    border-radius: 10px;
    line-height: 30px;
    min-width: 80px;
    color: #fff;
    text-align: center;
    text-decoration: none;
    background-color: #145fdc;
  }
  .labIpt{
    width: 312px;
    margin-right: 16px;
  }
  .lineBox{
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
  .line{
    width: 134px;
    background: #ccc;
    height: 1px;
    margin-top: 15px;
    float: left;
  }
  .lineText{
    width: 124px;
    float: left;
  }
  .labBox{
    overflow: hidden;
  }
  .labBtn{
    margin-left: 15px;
    margin-top: 10px;
  }
  .el-button{
    margin: 0;
    margin-right: 6px;
    margin-bottom: 6px;
  }
  .add-label{
    position: relative;
    padding-right: 70px;
    min-height: 50px;
    .float-right{
      position: absolute;
      right: 0;
      top: 10px;
      margin-top: 0;
    }
    .el-tag{
      margin: 0 4px 4px 0;
    }
  }
</style>
