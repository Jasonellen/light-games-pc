<template>
  <div class="useraddr">
    <ul>
      <li v-for="(item,index) in addressList" :key="item.locationId">
        <div class="useraddr-name">{{item.name}}（{{item.phone}}）</div>
        <div class="useraddr-addr">{{item.pname}}{{item.cname}}{{item.aname}}{{item.details}}</div>
        <div class="useraddr-info">
          <div class="useraddr-left"> <el-checkbox @change="change($event,index)" v-model="item.checked" :checked="item.defaultLocation == 1"></el-checkbox> 设为默认</div>
          <div class="useraddr-operation">
            <span class="useraddr-delect" @click="delAddress(item.locationId)"><i class="el-icon-delete"></i>删除</span>
            <span class="useraddr-aditor" @click="editAddress(index)"><i class="el-icon-edit"></i>编辑</span>
          </div>
        </div>
      </li>
    </ul>
    <div class="add-useraddr">
      <a class="user-btn user-btn-detail" href="javascript:;" @click="addAddress">新增地址</a>
    </div>
  </div>
</template>

<script>
	import {publish} from 'core';
	export default {
		name: 'useraddr',
		data(){
			return{
				addressList : [],
			}
		},
		methods:{
			//checked改变事件
			change(e,index){
			  let {checked} = e.target;
			  if(!checked){
                  this.$set(this.addressList[index],'checked',!checked)
              }else{
				  this.addressList = this.addressList.map((item,i)=>(
					  {...item,...{defaultLocation : index === i ? 1 : 2,checked : index === i}}
				  ))
				  gameApi.setDefaultLocation.send({
					  locationId : this.addressList[index].locationId
				  })
              }

            },
			selectRadio(index,isActive){
				if(!isActive){
					this.addressList = this.addressList.map((item,i)=>(
						{...item,...{defaultLocation : index === i ? 1 : 2}}
					))
					gameApi.setDefaultLocation.send({
						locationId : this.addressList[index].locationId
					})
				}else{

				}
			},
			//修改地址
			editAddress(index){
				let item = this.addressList[index];
				let {pid,cid,aid,phone,name,details,defaultLocation,locationId} = item;
				let _this = this;
				publish.$emit('dialog-show',{
					show:true,
					view : 'addAddress',
					title : '修改地址',
                    options : {
						pid,cid,aid,phone,name,details,
						defaultAds : defaultLocation == 1,
                        sure(obj){
                          let{defaultAds} = obj;
                          delete obj.defaultAds;
                          let params = {...obj,...{defaultLocation : defaultAds ? 1 : 2,locationId}}
                          log('params',params)
                          gameApi.updateUserLocation.send(params).then(({status,msg})=>{
                              let success = status === 200;
							  _this.$message({
								  message: success ? '修改成功' : msg || '修改失败',
								  type: success ? 'success' : 'error'
							  });
							  success && _this.reloadData();
                          })
                        }
                    }
				})
			},
			//删除地址
			delAddress(locationId){
				gameApi.deleteUserLocation.send({locationId}).then(({status})=>{
					if(status === 200){
						this.reloadData();
					}
				})
			},
			reloadData(){
				//获取地址
				gameApi.queryUserLocation.send().then(({status,data})=>{
					if(status === 200){
						this.addressList = data.map(item=>({...item,...{checked : item.defaultLocation == 1}}));
					}
				})
			},
            addAddress(){
				let _this = this;
				publish.$emit('dialog-show',{
					show:true,
					view : 'addAddress',
					title : '新增地址',
					options : {
						sure(obj){
							let{defaultAds} = obj;
							delete obj.defaultAds;
							let params = {...obj,...{defaultLocation : defaultAds ? 1 : 2}}
							log('params',params)
							gameApi.addUserLocation.send(params).then(({status,msg})=>{
								let success = status === 200;
								_this.$message({
									message: success ? '新增成功' : msg || '新增失败',
									type: success ? 'success' : 'error'
								});
								success && _this.reloadData();
							})
						}
					}
				})
            },
			toSubmit(){
				let orderId = localStorage.getItem('orderId')
				if(orderId){
					localStorage.setItem('orderId','')
					this.$router.push('/submitOrder/' + orderId)
					// toPage.submitOrder.push(orderId)
				}

			}
		},
		filters : {
			filterAddress(obj){
				return (obj.pname || '') + (obj.cname || '') + (obj.aname || '') + obj.details
			}
		},
		components:{
		},
		created(){
			this.reloadData();
		},

	}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
  .useraddr{
    background-color: #f7f7f7;
  }
  .useraddr li{
    padding: 10px 20px 0 20px;
    overflow: hidden;
    background: #fff;
    margin-bottom: 15px;
  }
  .useraddr li .useraddr-name{
    font-size: 16px;
    line-height: 50px;
  }
  .useraddr li .useraddr-addr{
    color: #777;
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
  }
  .useraddr li .useraddr-info{
    overflow: hidden;
    line-height: 30px;
    color: #999;
    line-height: 45px;
  }
  .useraddr li .useraddr-left{
    float: left;
    width: 120px;
  }
  .useraddr li .useraddr-operation{
    float: right;
  }
  .useraddr li .useraddr-delect{
    float: left;
  }
  .useraddr li .useraddr-aditor{
    float: left;
    margin-left: 20px;
  }
  .user-btn{
    padding: 2px 14px;
    font-size: 14px;
    display: inline-block;
    margin-left: 12px;
    border-radius: 5px;
    line-height: 32px;
    min-width: 80px;
    text-align: center;
    text-decoration: none;
    border: 1px solid #145fdc;
  }
  .user-btn-detail{
    color: #fff;
    background-color: #145fdc
  }
  .add-useraddr{
    text-align: center;
    margin-top: 30px;
  }
</style>
