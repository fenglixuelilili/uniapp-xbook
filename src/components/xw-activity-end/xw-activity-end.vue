<template>
  <view class="xw-activity-end fadeIn animated">
    <view class="top-img animated bounceIn">
      <image
        src="https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/commponents/tv.png"
        mode="widthFix"
      />
    </view>
    <view class="btns">
      <view class="btn" @click="again">
        再来一遍
      </view>
      <view class="btn" @click="next">下一步</view>
    </view>
  </view>
</template>
<script>
export default {
  methods: {
    again() {
      this.$emit('again')
    },
    next() {
      this.$emit('next')
    }
  }
}
</script>
<style lang="scss" scoped>
.xw-activity-end {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  background: url('https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/commponents/bgmTv.png')
    no-repeat;
  background-size: contain;
  background-color: #4ec3ff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .top-img {
    width: r(117.5);
    height: r(90.5);
    margin-bottom: r(22);
    image {
      width: r(117.5);
    }
  }
  .btns {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: r(13);
    .btn {
      width: r(113.5);
      height: r(34);
      background: url('https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/commponents/zkyb.png')
        no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: r(34);
      color: #fff;
      font-weight: 800;
    }
    .btn:last-child {
      background: url('https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/commponents/next.png')
        no-repeat;
      background-size: 100% 100%;
      margin-left: r(18);
      font-weight: 800;
    }
  }
}
</style>
