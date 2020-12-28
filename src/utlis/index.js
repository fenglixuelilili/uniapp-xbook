import store from '../store/index'
const platform = uni.getSystemInfoSync().platform
export const isPad = () => {
  return new Promise((resolve, reject) => {
    uni.getSystemInfo({
      success(info) {
        if (info.windowWidth >= 768) {
          resolve('ipad')
        } else {
          resolve('iphone')
        }
      },
      fail() {
        reject()
      }
    })
  })
}
function Toast(text, fn) {
  uni.showToast({
    icon: 'none',
    title: text,
    duration: 2000
  })
  setTimeout(() => {
    fn && fn()
  }, 200)
}
Toast.success = text => {
  uni.showToast({
    icon: 'success',
    title: text,
    duration: 2000
  })
}
Toast.loading = text => {
  uni.showToast({
    icon: 'loading',
    title: text,
    duration: 2000
  })
}

const innerAudioContext = uni.createInnerAudioContext()
const interactiveAudio = uni.createInnerAudioContext()
// 隐藏/显示 tab栏
export default {
  Toast: Toast,
  // 全局音频播放
  playAudio(src, fn = null, err = null) {
    // console.log(src, audiosrc, src === audiosrc)
    // if (audiosrc === src) return
    // audiosrc = src
    store.state.book.iscourse = false //将小手关闭
    innerAudioContext.stop()
    innerAudioContext.autoplay = false
    if (src) {
      innerAudioContext.src = src
    } else {
      return
    }
    innerAudioContext.play()
    innerAudioContext.onPlay(() => {
      // console.log('开始播放音频', src)
    })
    innerAudioContext.onError(res => {
      console.log(res.errMsg)
      console.log(res.errCode)
      err && err()
    })
    innerAudioContext.onEnded(res => {
      fn && fn()
    })
  },
  pauseAudio() {
    innerAudioContext.pause()
  },
  // 另一个音频播放实例 interactiveAudio
  playAudiointeractive(src, fn = null) {
    interactiveAudio.stop()
    interactiveAudio.autoplay = false
    if (src) {
      interactiveAudio.src = src
    } else {
      return
    }
    interactiveAudio.play()
    interactiveAudio.onPlay(() => {
      // console.log('开始播放音频', src)
    })
    interactiveAudio.onError(res => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    interactiveAudio.onEnded(res => {
      fn && fn()
    })
  },
  pauseinteractiveAudio() {
    interactiveAudio.pause()
  },
  // 全局配置时间的地方
  getbufferTime() {
    return {
      // 开场动画加载时间
      buffer: 4000,
      // 做对了的你真棒的动画多少秒消失
      correcttime: num => {
        let time = 3500
        if (platform === 'ios') {
          // ios 平台
          if (num === 0) {
            // 全对
            time = 5000
          } else if (num === 1) {
            time = 3500
          } else {
            time = 2500
          }
        } else {
          if (num === 0) {
            // 全对
            time = 4000
          } else if (num === 1) {
            time = 3500
          } else {
            time = 2500
          }
        }
        console.log(time, '时间....')
        return time
      }
    }
  },
  // 全局配置音频的地方
  getbufferAudioSrc() {
    return {
      // 绘本
      book:
        'https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/audio/loading/%E7%BB%98%E6%9C%AC%E4%B8%96%E7%95%8C.mp3',
      //生活中的数学
      math:
        'https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/audio/loading/%E7%94%9F%E6%B4%BB%E4%B8%AD%E7%9A%84%E6%95%B0%E5%AD%A6.mp3',
      // 视频互动课
      video: '',
      // 闯关冒险
      adventure:
        'https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/audio/loading/%E9%97%AF%E5%85%B3%E7%BB%83%E4%B9%A0.mp3',
      // 小小创作家
      composition:
        'https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/audio/loading/%E5%B0%8F%E5%B0%8F%E5%88%9B%E4%BD%9C%E5%AE%B6.mp3',
      // 报告
      report:
        'http://em.sycdn.kuwo.cn/cf1f8ba49e18ea4fbc6c61669cc6c9da/5fb51a8e/resource/n3/30/66/2205407643.mp3',
      // 亲子课堂
      Parenting:
        'https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/audio/qinzi.mp3',
      err:
        'https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/audio/errortip.mp3',
      // 一颗星
      start1:
        'https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/audio/1start.MP3',
      // 二颗星
      start2:
        'https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/audio/2start.MP3',
      // 三颗星
      start3:
        'https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/audio/3start.MP3',
      // 动手视频暂停提示
      doitvideotip:
        'https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/audio/doitvideo.MP3'
    }
  },
  // 监测数据对象是否有空值
  isNull(obj) {
    let flag = false
    for (let key in obj) {
      if (obj[key] === '') {
        flag = true
      }
    }
    return flag
  }
}
