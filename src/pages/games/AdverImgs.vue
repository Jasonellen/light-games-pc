<template>
  <div class="adverimgs">
    <ul>
      <li v-for='(item,index) in items' @click="bannerlink(index)" v-pic-optimize="item.img_name">
     </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'adverimgs',
  props : {
    items : {type : Array},
	bannerlink : {type : Function},
  },
}
</script>


<style lang='scss' scoped lang="scss" rel="stylesheet/scss">
.adverimgs li{
  cursor: pointer;
  margin-bottom: 10px;
  width: 283px;
height: 160px;
}
</style>
