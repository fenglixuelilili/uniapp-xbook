<template>
  <view class="loadingQuestion">
    <view
      class="bgmt math  fadeIn animated"
      v-if="type === 'math' && !vertical"
    ></view>
    <view
      class="bgmt mathvertical  fadeIn animated"
      v-if="type === 'math' && vertical"
    ></view>
    <!-- <view class="bgmt math  fadeIn animated" v-if="type === 'math' && "></view> -->
    <view class="bgmt book  fadeIn animated" v-if="type === 'book'"></view>
    <view class="bgmt video  fadeIn animated" v-if="type === 'video'"></view>
    <view
      class="bgmt adventure  fadeIn animated"
      v-if="type === 'adventure'"
    ></view>
    <view
      class="bgmt composition  fadeIn animated"
      v-if="type === 'composition'"
    ></view>
    <view class="bgmt report  fadeIn animated" v-if="type === 'report'"></view>
    <view
      class="bgmt Parenting  fadeIn animated"
      v-if="type === 'Parenting'"
    ></view>
    <!-- 进度条 -->
    <view class="progress" v-if="progress">
      <progress
        :percent="end ? 100 : percent"
        stroke-width="6"
        activeColor="#FFC854"
        :border-radius="10"
        backgroundColor="#fff"
      />
    </view>
  </view>
</template>
<script>
export default {
  props: {
    type: {
      type: String
    },
    vertical: {
      type: Boolean,
      default: false
    },
    progress: {
      type: Number
    },
    end: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      percent: 0
    }
  },
  methods: {
    setprogress() {
      if (!this.progress) return
      this.timer = setInterval(() => {
        if (this.percent >= 90) {
          clearInterval(this.timer)
          this.timer = null
        }
        this.percent += (100 * 100) / (this.progress * 1000)
      }, 100)
    }
  },
  destroyed() {
    console.log('销毁')
    clearInterval(this.timer)
    this.timer = null
  },
  mounted() {
    this.$xw.playAudio(this.$xw.getbufferAudioSrc()[this.type])
    this.$store.state.book.iscourse = false
    setTimeout(() => {
      this.$xw.playAudio('')
    }, this.$xw.getbufferTime().buffer)
    //
    this.setprogress()
  }
}
</script>
<style lang="scss" scoped>
.loadingQuestion {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  .progress {
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
    bottom: r(10);
    width: 65%;
  }
  .bgmt {
    width: 100vw;
    height: 100vh;
  }
  .book {
    // 绘本
    background: url('https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/3-10-2%E8%BF%9B%E5%85%A5%E9%A1%B5%E7%BB%98%E6%9C%AC%E7%BB%83%E4%B9%A0.png')
      no-repeat center center;
    background-size: cover;
  }
  .math {
    // 生活中的数学
    background: url('https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/3-10-1%E8%BF%9B%E5%85%A5%E9%A1%B5%E7%94%9F%E6%B4%BB%E4%B8%AD%E7%9A%84%E6%95%B0%E5%AD%A6%20(1).png')
      no-repeat center center;
    background-size: cover;
  }
  .mathvertical {
    // 生活中的数学 竖图
    background: url('https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/buffer/verticalmath.png')
      no-repeat center center;
    background-size: cover;
  }
  .video {
    // 视频互动课
    background: url('https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/3-10-3%E8%BF%9B%E5%85%A5%E9%A1%B5%E8%A7%86%E9%A2%91%E4%BA%92%E5%8A%A8%E8%AF%BE.png')
      no-repeat center center;
    background-size: cover;
  }
  .adventure {
    // 闯关冒险
    background: url('https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/3-10-4%E9%97%AF%E5%85%B3%E5%86%92%E9%99%A9.png')
      no-repeat center center;
    background-size: cover;
  }
  .composition {
    // 小小创作家
    background: url('https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/buffer/3-10-5%E5%B0%8F%E5%B0%8F%E5%88%9B%E4%BD%9C%E5%AE%B6.png')
      no-repeat center center;
    background-size: cover;
  }
  .report {
    background: url('https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/3-10-6%E8%BF%9B%E5%85%A5%E9%A1%B5%E5%AD%A6%E4%B9%A0%E6%8A%A5%E5%91%8A.png')
      no-repeat center center;
    background-size: cover;
  }
  .Parenting {
    background: url('https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/%E4%BA%B2%E5%AD%90%E8%AF%BE%E5%A0%82.jpg')
      no-repeat center center;
    background-size: cover;
  }
  // image {
  //   // width: 100vw;
  //   height: 100%;
  //   position: absolute;
  //   left: 0;
  //   right: 0;
  //   top: 0;
  //   // bottom: 0;
  //   margin: 0 auto;
  // }
}
</style>
