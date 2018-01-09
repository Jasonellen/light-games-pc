<template>
  <div class="carousel">
    <slot></slot>
    <div class="carousel-footer">
      <swiper :options="swiperOption" ref="xxxx">
        <swiper-slide v-for="(item,i) in list" :key="i">
          <img @click="select(i)" :src="item.img_name" alt="" style="cursor: pointer;">
        </swiper-slide>
        <div class="swiper-button-prev"
             slot="button-prev">
          <i class="el-icon-arrow-left"></i>
        </div>
        <div class="swiper-button-next"
             slot="button-next">
          <i class="el-icon-arrow-right"></i>
        </div>
      </swiper>
    </div>

  </div>
</template>

<script>
	export default {
		name: 'carousel',
		props : {
			list : {type : Array},
			change : {type : Function},
		},
		data(){
			return {
				curIndx : 0,
				swiperOption: {
          slidesPerView : 4,
          spaceBetween : 10,
          setWrapperSize :true,
          observeParents:true,
          prevButton:'.swiper-button-prev',//上一张
          nextButton:'.swiper-button-next',//下一张
				},
			}
		},
    methods:{
      select(index){
        if(index !== this.curIndx){
          console.log(this.list[index],111111)
          this.change && this.change(this.list[index])
          this.curIndx = index;
        }

      },
    },
    created(){
      this.change && this.change(this.list[this.curIndx])
    }
	}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
  .carousel{
    margin-top: 10px;
    margin-bottom: 30px;
  }
</style>
