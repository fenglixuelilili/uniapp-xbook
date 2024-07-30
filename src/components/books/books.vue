<template>

  <view class="wrapper" @touchstart="start" @touchend="end">

    <view class="content">

      <!-- 左侧翻页逻辑 -->

      <template>

        <!-- 正常的当前左侧 -->

        <view
          class="left"
          :class="{ animate: direction == 'backoff' && !animateStatic }"
          :style="{ zIndex: direction == 'backoff' && !animateStatic ? 4 : 3 }"
          style="backface-visibility: hidden;"
        >

          <view class="animate-wrapper">

            <activecomponent
              @next="next"
              @pre="pre"
              :i="i"
              :booklist="booklist"
            ></activecomponent>

            <!--  #endif -->

          </view>

        </view>

        <!-- 左侧背面 -->

        <view
          class="left left-hide"
          :class="{ animate: direction == 'backoff' && !animateStatic }"
          :style="{
            zIndex: direction == 'backoff' && !reading && !animateStatic ? 4 : 2
          }"
        >

          <view class="animate-wrapper">

            <activecomponent
              @next="next"
              @pre="pre"
              :i="i - 1"
              :booklist="booklist"
            ></activecomponent>

            <!--  #endif -->

          </view>

        </view>

        <!-- 上一页 -->

        <view
          class="left left-next"
          :style="{ zIndex: direction == 'backoff' ? 2 : 1 }"
        >

          <view class="animate-wrapper">

            <activecomponent
              @next="next"
              @pre="pre"
              :i="i - 1"
              :booklist="booklist"
            ></activecomponent>

            <!--  #endif -->

          </view>

        </view>

      </template>

      <!-- 右侧翻页逻辑 -->

      <template>

        <!-- 正常的右侧 -->

        <view
          class=" right "
          :class="{ animateRight: direction == 'forward' && !animateStatic }"
          style="backface-visibility: hidden;"
          :style="{ zIndex: direction == 'forward' && !animateStatic ? 4 : 3 }"
          v-show="rightnormal"
        >

          <!-- 正常的右侧 -->

          <view class="animate-wrapper">

            <activecomponent
              @next="next"
              @pre="pre"
              :i="i"
              :booklist="booklist"
            ></activecomponent>

            <!--  #endif -->

          </view>

        </view>

        <!-- 背面 -->

        <view
          class="right  right-hide"
          :class="{ animateRight: direction == 'forward' && !animateStatic }"
          :style="{ zIndex: direction == 'forward' && !animateStatic ? 3 : 2 }"
        >

          <view class="animate-wrapper">

            <activecomponent
              @next="next"
              @pre="pre"
              :i="i + 1"
              :booklist="booklist"
            ></activecomponent>

            <!--  #endif -->

          </view>

        </view>

        <!-- 底层下一页 -->

        <view
          class="right right-next"
          :style="{ zIndex: direction == 'forward' ? 2 : 1 }"
        >

          <view class="animate-wrapper">

            <activecomponent
              @next="next"
              @pre="pre"
              :i="i + 1"
              :booklist="booklist"
            ></activecomponent>

            <!--  #endif -->

          </view>

        </view>

      </template>

    </view>

  </view>

</template>

<script>
import activecomponent from './activecomponent'
export default {
  props: ['booklist'],
  created() {
    // this.resetCom()
  },
  computed: {
    platform() {
      return this.$store.state.platform
    }
  },
  data() {
    // 阅读数据
    return {
      i: 0,
      lists: [],
      direction: 'backoff', //forward 前进 backoff 后退
      reading: false,
      animateStatic: true,
      timer1: null,
      timer2: null,
      rightnormal: true,
      timer: null,
      // 触摸
      startData: {
        clientX: 0,
        clientY: 0,
        threshold: 80
      }
    }
  },
  methods: {
    // 语音播放完成的回调
    callback() {
      return () => {
        // 关掉小手
        this.clearTimer()
        if (this.$store.state.book.auto) {
          this.next()
          return
        }
        this.timer = setTimeout(() => {
          this.$store.state.book.iscourse = true
        }, this.$store.state.book.coursetime)
      }
    },
    // 语音播放完成的错误回调
    errcallback() {
      this.$xw.Toast('语音播放失败，请点击右上角重新播放，或者退出重试')
    },
    clearTimer() {
      clearTimeout(this.timer)
      this.timer = null
      this.$store.state.book.iscourse = false
    },
    startReading(type) {
      if (this.reading && !this.animateStatic) {
        console.log('翻页中，等待一下再翻页')
        this.startReading()
        return
      }
      this.animateStatic = false
      this.reading = true
      clearTimeout(this.timer1)
      clearTimeout(this.timer2)
      if (this.timer2 || this.timer1) {
        return
      }
      this.timer1 = setTimeout(() => {
        this.reading = false
        if (type === 'next') {
          this.rightnormal = false
        }
        this.timer1 = null
      }, 500)
      this.timer2 = setTimeout(() => {
        this.rightnormal = true
        this.animateStatic = true
        if (type === 'next') {
          this.i++
        } else {
          this.i--
        }
        this.timer2 = null
      }, 1000)
    },
    pre() {
      clearTimeout(this.timer)
      if (!this.animateStatic) {
        return
      }
      if (this.i == 0) {
        console.log('第一页了哦')
        return
      }
      // 翻页上一页
      this.direction = 'backoff'
      this.startReading('pre')
      // 播放语音
      console.log('播放语音')
      this.$xw.playAudio(this.booklist[this.i - 1].voice_url)
      // 开始上报
    },
    next() {
      // 以下是翻页逻辑
      this.$parent.nextBook(this.i)
      if (!this.animateStatic) {
        return
      }
      let ComponentArrLength = this.$children[0]
        ? this.$children[0].books.length
        : 0
      // 当组件是动态组件 而不是判断渲染组件的话： this.ComponentArr.length
      if (this.i == ComponentArrLength - 1) {
        // console.log('最后一页了哦')
        this.$parent.end(() => {
          this.i = 0
        })
        this.$children.forEach(child => {
          if (child && child.end) {
            child.end()
          }
        })
        return
      }
      this.direction = 'forward'
      this.startReading('next')
      // 播放语音
      this.$xw.playAudio(
        this.booklist[this.i + 1].voice_url,
        this.callback && this.callback(),
        this.errcallback
      )
      // 开始上报
    },
    bookplay() {
      this.$xw.playAudio(
        this.booklist[this.i].voice_url,
        this.callback && this.callback(),
        this.errcallback
      )
    },
    // 触摸事件
    start(e) {
      this.startData.clientX = e.changedTouches[0].clientX
      this.startData.clientY = e.changedTouches[0].clientY
    },
    end(e) {
      const subX = e.changedTouches[0].clientX - this.startData.clientX
      const subY = e.changedTouches[0].clientY - this.startData.clientY
      if (subY > 45 || subY < -45) {
        // console.log('上下滑')
      } else {
        if (subX > this.startData.threshold) {
          // console.log('右滑')
          if (this.$store.state.book.auto) {
            this.$xw.Toast('已开启自动播放')
            return
          }
          this.pre()
        } else if (subX < -this.startData.threshold) {
          // console.log('左滑')
          if (this.$store.state.book.auto) {
            this.$xw.Toast('已开启自动播放')
            return
          }
          this.next()
        } else {
          // console.log('无效')
        }
      }
    }
  },
  components: {
    activecomponent
  },
  watch: {
    booklist: {
      handler() {
        setTimeout(() => {
          if (!this.booklist[0]) return
          this.$store.state.book.makequesing = false
          this.$store.state.book.iscourse = false
          this.$xw.playAudio(
            this.booklist[0].voice_url,
            this.callback && this.callback(),
            this.errcallback
          )
          this.question_list = this.booklist[0].question_list
        }, this.$xw.getbufferTime().buffer)
      },
      deep: true, //true 深度监听
      immediate: true //开启首次监听赋值（不开启首次监听不到）
    }
  },
  destroyed() {
    // console.log('组件的清理工作')
    this.callback = null
    // 通知外面我正在做题
    this.$store.state.book.makequesing = false
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100vw;
  height: 100vh;
  position: relative;
  .content {
    width: 100vw;
    height: 100vh;
    position: relative;
    .left {
      width: 50vw;
      height: 100vh;
      // background: blue;
      overflow: hidden;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 0;
      transform-style: preserve-3d;
      transform-origin: right center;
    }
    .left-hide {
      .animate-wrapper {
        transform: translate(100%, 0) scale(-1, 1);
      }
    }
    .left-next {
      .animate-wrapper {
        transform: translate(0, 0);
      }
    }
    .right {
      transform-style: preserve-3d;
      position: absolute;
      right: 0;
      top: 0;
      width: 50vw;
      height: 100vh;
      overflow: hidden;
      transform-origin: left center;
      .animate-wrapper {
        transform: translate(-100%, 0);
      }
    }
    .right-hide {
      .animate-wrapper {
        transform: translate(0%, 0) scale(-1, 1);
      }
    }
    .right-next {
      .animate-wrapper {
        transform: translate(-100%, 0);
      }
    }
  }
  .play {
    position: absolute;
    color: #fff;
    font-size: r(12);
    right: r(50);
    top: r(10);
  }
}
@keyframes rotate {
  0% {
    transform: rotateY(0deg);
    // perspective(2000px)
  }
  100% {
    transform: rotateY(-180deg);
    // perspective(2000px)
  }
}
@keyframes rotateforword {
  0% {
    transform: rotateY(0deg);
    // perspective(2000px)
  }
  100% {
    transform: rotateY(180deg);
    // perspective(2000px)
  }
}
.animate {
  animation: rotateforword 1s ease-in-out forwards;
  // transition: transform 1s;
  // transform: perspective(1000px) rotateY(180deg);
}
.animateRight {
  animation: rotate 1s ease-in-out forwards;
  // transition: transform 1s;
  // transform: perspective(800px) rotateY(-180deg);
}
</style>

