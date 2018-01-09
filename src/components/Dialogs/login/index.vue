<template>
	<div>
		<div class="step1" v-if="step==1">
			<div class="cell-fromline">
				<el-input v-model="phone" placeholder="请输入手机号"></el-input>
			</div>
			<div class="cell-fromline fl yzm">
				<el-input v-model="code" placeholder="请输入验证码"></el-input>
			</div>
			<div class="cell-fromline"><el-button class="codeBtn" @click="getCode" type="primary">{{codeText}}</el-button></div>
			<div class="nextBtn" @click="nextClick"></div>
			<p class="text-des" @click="step=3" ><a href="javascript:;">已有账号？马上登陆</a></p>
		</div>

		<div class="step2" v-if="step==2">
			<div class="cell-fromline">
				<el-input v-model="name" placeholder="请输入昵称"></el-input>
			</div>
			<div class="cell-fromline">
				<el-input v-model="psd1" type="password"  placeholder="请输入密码"></el-input>
			</div>
			<div class="cell-fromline">
				<el-input v-model="psd2" type="password"  placeholder="请再次输入密码"></el-input>
			</div>
			<el-button class="logBtn" @click="successRegister" type="primary">完成注册</el-button>
		</div>

		<div class="step3" v-if="step==3">
			<div class="cell-fromline">
				<el-input v-model="username" placeholder="请输入账号"></el-input>
			</div>
			<div class="cell-fromline">
				<el-input v-model="password" type="password" placeholder="请输入密码"></el-input>
			</div>
			<router-link to='' class='forget'><p @click="step=4">忘记密码？</p></router-link>		
			<div class="login-btn-box"><el-button class="logBtn" @click="logIn" type="primary">立即登录</el-button></div>
			<p class="text-des" @click="step=1"><a href="javascript:;">还没有账号？马上注册</a></p>
		</div>

		<div class="step4" v-if="step==4">
			<div class="center"><img src="../../../assets/img/logo.png" alt=""></div>
		    <div class="title">请输入注册时的手机号码</div>
		    <el-input v-model="phone" placeholder="请输入手机号码"></el-input>
		    <div class="cell-line2">
		      <div class="cell-fromline fl">
		      	<el-input v-model="code" placeholder="请输入验证码"></el-input>
		      </div>
		      <div class="fr yzm-btn" @click="getForgetCode">{{codeText}}</div>
		    </div>
		    <div class="next" @click="forgetNext">下一步</div>
		</div>

		<div class="step5" v-if="step==5">
			<div class="center"><img src="../../../assets/img/logo.png" alt=""></div>
		    <div class="title">请重设您的账号密码</div>
		    <el-input class='step5_ipt' type='text' v-model="newPwd" placeholder="请输入新密码"></el-input>
		    <el-input type='text' v-model="cNewPwd" placeholder="请输入确认密码"></el-input>
		    <div class="next" @click="submit">提交</div>
		</div>
	</div>
</template>

<script>
	import {publish,userInfo} from 'core';
	import {mapActions} from 'vuex';
	export default {
		props : {
			options : {type : Object,},
		},
		data(){
			return {
				step:this.options.step || 1,
				phone : '',
				code : '',
				codeText : '获取验证码',
				username:'',
				password:'',
				psd1 : '',
				psd2 : '',
				name : '',
				newPwd:'',
				cNewPwd:''
			}
		},
		timer : null,
		run : false,
		beforeDestroy (){
			clearTimeout(this.$options.timer)
		},
		watch : {
			options(val){
				this.step = val.step || this.step;
			},
			step(v){
				if(v == 3){
					this.$emit('changeTitle','登陆')
				}else if(v == 4 || v == 5){
					this.$emit('changeTitle','重置密码')
				}else{
					this.$emit('changeTitle','注册')
				}
				
			}
		},
		methods : {
			...mapActions(['login','headImgAction']),
			forgetNext(){
				const { phone,code} = this
		         gameApi.checkUserPwdCode.send({phone,code}).then(result=>{
		            let {status,msg,data} = result;
		            if(status == 200){
		              this.step=5
		            }else{
		              this.alert(msg)
		            }
		         })
				
			},
			nextClick(){
				if(this.step == 1){
					let {phone,code} = this;
					phone = phone.trim();
					code = code.trim();
					let tips;
					if(!code)tips = '请输入验证码';
					if(!phone.isPhone())tips = '请输正确的手机号码';
					if(tips){
						this.$message({
							message: tips,
							type: 'warning'
						});
						return;
					}
					gameApi.checkIdentifyingCode.send({phone,code}).then(({status,msg})=>{
						if(status === 200){
							this.step = 2;
						}else{
							this.$message({
								message: msg,
								type: 'warning'
							});
						}
					})
				}
			},
			submit(){
				const { phone,newPwd,cNewPwd } = this
		        if(newPwd !== cNewPwd){
		          this.alert('两次输入的密码不一致！')
		          return
		        }
		        gameApi.updateUserPwd.send({phone,newPwd,cNewPwd}).then(result=>{
		            let {status,msg,data} = result;
		            if(status == 200){
		              	publish.$emit('dialog-show',{
							show : false,
						})
						this.$message({
							message: '密码修改成功！',
							type: 'success'
						});
		            }else{
		              this.alert(msg)
		            }
		         })
				
			},
			//倒计时
			runTime(num) {
				this.$options.timer = setTimeout(() => {
					num--;
					if (num <= 0) {
						this.codeText = '获取验证码';
					} else {
						this.codeText = `${num > 10 ? num : '0' + num}s`;
						this.runTime(num);
						this.$options.run = false;
					}
				}, 1000)
			},
			getForgetCode(){
				if (this.$options.run) return;
				let tips;
				let {phone} = this;
				phone = phone.trim();
				if (!phone) tips = '请输入手机号码';
				if (!phone.isPhone()) tips = '请输入正确的手机号码';
				if (tips) {
					this.$message({
						message: tips,
						type: 'warning'
					});
					return;
				}
				gameApi.updatePwdCode.send({phone}).then(result=>{
					let {status,msg,data} = result;
					if(status == 200){
						//如果返回的的是数字   那么进入倒计时
						let num = parseInt(data);
						if(num){
							this.runTime(num);
							this.$options.run = true;
							this.$message({
								message: '验证码已发送',
								type: 'warning'
							});
						}
					}else{
						this.$message({
							message: msg,
							type: 'warning'
						});
					}
				})
			},
			getCode() {
				if (this.$options.run) return;
				let tips;
				let {phone} = this;
				phone = phone.trim();
				if (!phone) tips = '请输入手机号码';
				if (!phone.isPhone()) tips = '请输入正确的手机号码';
				if (tips) {
					this.$message({
						message: tips,
						type: 'warning'
					});
					return;
				}
				gameApi.sendRegisterMessage.send({phone}).then(result=>{
					let {status,msg,data} = result;
					if(status == 200){
						//如果返回的的是数字   那么进入倒计时
						let num = parseInt(data);
						if(num){
							this.runTime(num);
							this.$options.run = true;
							this.$message({
								message: '验证码已发送',
								type: 'warning'
							});
						}
					}else{
						this.$message({
							message: msg,
							type: 'warning'
						});
					}
				})
			},
			successRegister() {
				let {psd1:userPwd,psd2:userCheckPwd,name:userNickname} = this;
				let tips;
				if(!userNickname)tips = '请输入昵称';
				if(!userPwd || !userCheckPwd)tips = '请输入密码';
				if(userPwd != userCheckPwd)tips = '两次密码输入不一致';
				if(tips){
					this.$message({
						message: tips,
						type: 'warning'
					});
					return;
				}
				let {phone:userPhone} = this;
				gameApi.saveUser.send({
					userPhone,userPwd,userNickname,userCheckPwd,
					type : 'save'
				}).then(({status,msg})=>{
					if(status == 200){
						this.step = 3;
						this.$message({
							message: '注册成功',
							type: 'success'
						});
					}else{
						this.$message({
							message: msg,
							type: 'warning'
						});
					}
				})
				//开始完成注册
			},
			logIn(){
				let {username,password} = this;
				username = this.username.trim();
				password = this.password.trim();
				let tips;
				if(!password)tips = '请输入密码';
				if(!username)tips = '请输入用户名';
				if(tips){
					this.$message({
						message: tips,
						type: 'warning'
					});
					return;
				}
				gameApi.login.send({
					userPhone : username,
					password
				}).then((result)=>{
					let {status,msg,data} = result;
					if(status == 200){
						let {uid:Hid,token:Htoken} = data;
						userInfo.setHead({Hid,Htoken})
						localStorage.setItem('users',JSON.stringify(data.member))
						this.$message({
							message: '登录成功',
							type: 'success'
						});
						publish.$emit('dialog-show',{
							show : false,
						})
						this.headImgAction(data.member.user_photo)
						this.login();
					}else{
						this.$message({
							message: msg,
							type: 'warning'
						});
					}

				})
			},
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss">
	.fl{
		float: left;
	}
	.cell-fromline{
		margin-top: 10px;
	    overflow: hidden;
	}
	.codeBtn{
		margin-left: 10px;
		width: 90%;
    	float: right;
	}
	.nextBtn{
		width: 40px;
		height: 40px;
		border-radius: 50%;
		margin: 10px auto;
		background-image: url(../../../assets/img/xiayigesvg.svg);
		background-size: 20px;
		background-position: center center;
		background-repeat: no-repeat;
		background-color: #20a0ff;
		cursor: pointer;
	}
	.text-des{
		text-align: center;
		font-size: 10px;
	}
	.text-des a{
		color: #999;
	}
	.login-btn-box{
		padding: 10px 0;
		text-align: center;
		.el-button--primary{
			background:#146ef5;
			width:100%;
		}
	}
	.step3{
		p{
		    text-align: right;
    		color: #146ef5;
		    margin-top: 5px;
		}
		a.forget{
			text-decoration:none;
		}
	}
	.step1{
		.yzm{
			width:55%;
		}
	}
	.step4,.step5{
		.cell-fromline{
	    	width:65%;
	  	}
	  	.cell-line2{
	    	overflow: hidden;
	 	}
	 	.yzm-btn{
	 		 width: 142px;
		    background: #146ef5;
		    float: right;
		    height: 34px;
		    line-height: 34px;
		    text-align: center;
		    margin-top: 10px;
		    border-radius: 5px;
		    color: #fff;
	 	}
	 	.next{
	 		line-height: 34px;
	    background: #146ef5;
	    border-radius: 5px;
	    text-align: center;
	    color: #fff;
	    margin-top: 20px;
	 	}
	 	.step5_ipt{
	 		margin-bottom:10px;
	 	}
	}
	.center{
		text-align: center;
	}
	.title{
		font-weight: bold;
		margin-bottom: 10px;
	}
</style>