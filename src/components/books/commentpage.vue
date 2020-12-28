<template>
  <view class="commentpage ">
    <view class="box">
      <image v-if="data.url" :src="data.url" mode="widthFix" />
    </view>
  </view>
</template>
<script>
export default {
  props: ['data'],
  created() {},
  data() {
    return {}
  },
  methods: {
    play() {
      this.$parent.play()
    }
  }
}
</script>
<style lang="scss" scoped>
.commentpage {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  .box {
    width: 100%;
    height: auto;
    position: relative;
    image {
      width: 100%;
      height: auto;
    }
  }

  .control {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
  }
  .play {
    position: absolute;
    color: #fff;
    font-size: r(12);
    right: r(50);
    top: r(10);
  }
}
</style>
