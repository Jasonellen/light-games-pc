<template>
	<img :src="ptImg" alt="">
</template>

<script>
	let XBOXONE = require('@/assets/img/XBOXONE.svg');
	let PS4 = require('@/assets/img/PS4.svg');
	let SWITCH = require('@/assets/img/SWITCH.png');
	let WII = require('@/assets/img/WII.svg');
	let VR = require('@/assets/img/VR.png');
	export default {
		name : 'PlatformImg',
		props : {
			type : {type : String}
		},
		computed : {
			ptImg(){
				let platform;
				switch (this.type){
//					case 'VR':
//						platform = VR;
//						break;
					case 'XBOXONE':
						platform = XBOXONE;
						break;
					case 'PS4':
						platform = PS4;
						break;
					case 'SWITCH':
						platform = SWITCH;
						break;
					case 'WII':
						platform = WII;
						break;
				}
				return platform || XBOXONE;
			}
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	img{height: 22px;width: 22px;vertical-align: top;margin-right: 4px;}
</style>