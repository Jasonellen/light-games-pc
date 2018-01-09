<template>
    <div class="contentBox">
        <div v-if="!isSelectCity">
            <div class="nameBox">
                <div>收件人姓名</div><el-input class="input" v-model="name" placeholder="请输入姓名"></el-input>
            </div>
            <div class="nameBox">
                <div>联系电话</div><el-input class="input" v-model="phone" placeholder="请输入电话"></el-input>
            </div>
        </div>
        <div class="selectBox">
            <div>省</div>
            <el-select class="selectInput" v-model="value1" @change="change1" placeholder="请选择">
                <el-option
                    v-for="(value,key) in provinceList"
                    :key="key"
                    :label="value"
                    :value="key">
                </el-option>
            </el-select>
            <div>市</div>
            <el-select class="selectInput" v-model="value2" @change="change2" placeholder="请选择">
                <el-option
                    v-for="(value,key) in cityList"
                    :key="key"
                    :label="value"
                    :value="key"
                >
                </el-option>
            </el-select>
            <div class="qu">区/县</div>
            <el-select class="selectInput"  @change="change3"
                       v-model="value3" placeholder="请选择">
                <el-option
                    v-for="(value,key) in areaList"
                    :key="key"
                    :label="value"
                    :value="key"

                >
                </el-option>
            </el-select>
        </div>
        <div v-if="!isSelectCity">
            <el-input
                    class="textarea"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入详细地址：街道、小区、房号"
                    v-model="details"
            >
            </el-input>
            <div class="defaultAds">
                <el-checkbox v-model="defaultAds">设为默认地址</el-checkbox>
            </div>
        </div>
        <div class="btnBox">
            <el-button @click.native="$emit('update:fade', false)">取消</el-button>
            <el-button type="primary" @click="submit">保存</el-button>
        </div>
    </div>
</template>
<script>
	import locationData from './list';
	const Province = {}; // 省（自治区、直辖市、特别行政区）
	const locationCode = Object.keys(locationData);
	locationCode.forEach((key) => {
		// 省
		if (key.match(/^\d{2}0000$/)) {
			Province[key] = locationData[key];
		}
	});
	// const Area = {}; // 县（市辖区、县级市、旗)
	function getCitys(provinceCode) {
		const citys = {};
		const area = {};
		let isMunicipality = true; // 是否是自治区、直辖市、特别行政区
		locationCode.forEach((key) => {
			const cityCode = key - provinceCode;
			if (cityCode > 0 && cityCode < 1e4) {
				// 存在 xxxx00 的为非直辖市
				if (/00$/.test(cityCode)) {
					isMunicipality = false;
					citys[key] = locationData[key];
				} else {
					area[key] = locationData[key];
				}
			}
		});
		return {
			isMunicipality,
			values: isMunicipality ? area : citys,
		};
	}
	function getAreas(cityCode) {
		const area = {};
		locationCode.forEach((key) => {
			const areaCode = key - cityCode;
			if (areaCode > 0 && areaCode < 1e2) {
				area[key] = locationData[key];
			}
		});
		return area;
	}


	export default {
		name : 'selectSite',
		props : {
			options : {type : Object},
			dialogVisible : {type : Boolean},
		},
		data(){
			return {
				value1: '',
				value2: '',
				value3: '',
				phone : '',
				name : '',
				details : '',
				provinceList : {...Province},
				cityList : {},
                areaList : {},
				isMunicipality : false,//是不是直辖市
				defaultAds : false,//默认地址
                isSelectCity : false,//是不是专门选择城市
			}
		},
		created(){
			this.upLoad();
		},
        watch:{
			dialogVisible(newVal){
				newVal && this.upLoad();
            }
        },
		methods : {
			submit(){
				let {value1,value2,value3,phone,name,details,isMunicipality,defaultAds} = this;
                let errText;
                if(!value1){
					errText = '请选择省';
                }

				if(!value2){
					!errText && (errText = '请选择市');
                }

				if(this.isSelectCity){
					if(errText && !this.isMunicipality){
						this.$message({
							message: errText,
							type: 'warning'
						});
						return;
					}
					let obj = {
						pid : value1,
						cid : value2,
						pname : this.provinceList[value1] || '',
						cname : this.cityList[value2] || '',
						isMunicipality : isMunicipality,
					}
					this.$emit('update:fade', false)
					this.options.sure && this.options.sure(obj)
                    return;
				}

				if(!value3 && !isMunicipality){
					!errText && (errText = '请选择区');
				}

				if(!phone.isPhone()){
					!errText && (errText = '请输入正确的手机号码');
                }
				if(!name){
					!errText && (errText = '请输入名字');
				}
				if(!details){
					!errText && (errText = '请输入详细地址');
				}

				if(errText){
					this.$message({
						message: errText,
						type: 'warning'
					});
					return;
                }

				let obj = {
					pid : value1,
                    cid : value2,
                    aid : value3,
                    pname : this.provinceList[value1],
                    cname : this.cityList[value2],
                    aname : this.areaList[value3] || '',
					phone,
                    name,
					details,
					defaultAds,
                }
				this.$emit('update:fade', false)

				this.options.sure && this.options.sure(obj)
			},
            clear(index){
                let list = ['provinceList','cityList','areaList'];
                while(index<=3){
					this['value' + index] = '';
                    this.$set(this,list[index - 1],{});
					index++;
                }
            },
            //跟新
			upLoad(){
				let {pid='',cid='',aid='',phone='',name='',details='',defaultAds,isSelectCity} = this.options;
				this.value1 = pid;//省ID
				this.value2 = cid;//城市ID
				this.value3 = aid;//县ID
				this.phone = phone;//手机号码
				this.name = name;//联系人
				this.details = details;//详细地址
				this.defaultAds = defaultAds;//默认地址
				this.isSelectCity = isSelectCity;//是不是专门的选择城市

				if(pid){
					let obj = getCitys(pid);
					let {isMunicipality,values} = obj;
					this.$set(this,'cityList',values);
					this.isMunicipality = isMunicipality;
					if(!isMunicipality){
						this.$set(this,'areaList',getAreas(cid))
					}else{
						this.value3 = '';
					}
				}
            },
			change1(id){
				let obj = getCitys(id);
				let {isMunicipality,values} = obj;
				this.isMunicipality = isMunicipality;
				this.clear(2);
                this.$set(this,'cityList',values)
            },
			change2(id){
				this.clear(3);
				this.$set(this,'areaList',getAreas(id))
			},
			change3(id){

			},
		}
	}
</script>
<style lang="scss" scoped rel="stylesheet/scss">
    .nameBox,.selectBox{
        margin-bottom: 10px;
        overflow: hidden;
    }
    .defaultAds{
        padding-top: 10px;
    }
    .nameBox .input{
        width: 370px;
        float: left;
    }
    .selectBox .selectInput{
        width: 111px;
        float: left;
    }
    .nameBox div{
        float: left;
        width: 70px;
        height: 36px;
        line-height: 36px;
        margin-right: 10px;
    }
    .selectBox div{
        float: left;
        width: 15px;
        height: 36px;
        line-height: 36px;
        margin-right: 10px;
    }
    .selectBox .qu{
        float: left;
        width: 37px;
        height: 36px;
        line-height: 36px;
        margin-right: 10px;
    }
    .btnBox{
        width: 100%;
        text-align: center;
    }
    .textarea{
        width: 451px;
    }
</style>