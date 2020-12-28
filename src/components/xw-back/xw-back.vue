<template>
  <cover-view class="back" @click="back">
    <cover-image
      src="https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/other/back%20(2).png"
      mode="widthFix"
    />
  </cover-view>
</template>
<script>
export default {
  methods: {
    back() {
      uni.showToast({
        title: '返回按钮',
        duration: 2000
      })
      // return
      // uni.navigateBack({})
    }
  }
}
</script>
<style lang="scss" scoped>
.back {
  position: absolute;
  left: r(10);
  top: r(10);
  z-index: 1000;
  width: r(21);
  height: r(21);
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cover-image {
    width: r(14);
    height: auto;
  }
}
</style>
