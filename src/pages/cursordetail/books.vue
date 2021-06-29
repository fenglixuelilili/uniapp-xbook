<template>
  <view class="book">
    <template v-show="!isend">
      <books :booklist="list" v-show="loadingtype === ''"></books>
    </template>
    <xw-back></xw-back>
    <loading-question
      :type="loadingtype"
      v-if="loadingtype !== ''"
      :end="loadingend"
      :progress="6"
    ></loading-question>
    <xw-activity-end v-if="isend" @again="again" @next="next"></xw-activity-end>
    <template>
      <view class="zhiyin" v-if="iszhiyin">
        <image
          src="https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/other/shou.png"
          mode="widthFix"
        />
      </view>
      <view class="play" @click="bookplay" v-if="showplay">
        <image
          src="https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/other/yinpin.png"
          mode="widthFix"
        />
      </view>
      <view class="auto" @click="auto" v-if="showplay">
        <image
          :src="
            autostatus
              ? 'https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/other/course.png'
              : 'https://naughty-kid-system.oss-cn-beijing.aliyuncs.com/image/public/wxApp/other/again.png'
          "
          mode="widthFix"
        />
      </view>
      <view class="dealy">
        <text>正在疯狂为您加载中，请耐心等待一下哦 ~~</text>
      </view>
    </template>
  </view>
</template>
<script>
import books from '@/components/books/books'
let _index = ''
export default {
  components: { books },
  data() {
    return {
      listTotal: [],
      currentBook: 0,
      list: [],
      index: 0,
      loadingtype: '',
      isend: false,
      showplay: false,
      timer: null,
      loadingend: false
    }
  },
  methods: {
    end(reset) {
      setTimeout(() => {
        reset()
      }, 1000)
      this.isend = true
      this.currentBook = 0
    },
    next() {
      console.log('下一步')
    },
    again() {
      this.isend = false
      // 重新播放
      this.$xw.playAudio(this.list[0].voice_url)
    },
    nextBook(i) {
      if (_index === i) {
        return
      } else {
        _index = i
      }
      if (this.listTotal[this.currentBook].content_list.length === i + 1) {
        console.log('最后一页了')
        this.currentBook++
      }
    },
    bookplay() {
      this.$children.forEach(child => {
        if (child && child.bookplay) {
          child.bookplay()
        }
      })
    },
    auto() {
      this.$store.state.book.auto = !this.$store.state.book.auto
      if (this.$store.state.book.auto) {
        this.$xw.Toast.success('已经打开自动播放')
      } else {
        this.$xw.Toast.success('已经关闭自动播放')
      }
      this.bookplay()
    },
    clear() {
      // console.log('清理工作')
      this.$store.state.book.iscourse = false
      // 退出页面后 将自动播放关闭 否则会有问题
      this.$store.state.book.auto = false
      this.$xw.playAudio('')
    },
    getBaseSrc(url) {
      let that = this
      return new Promise((resolve, reject) => {
        uni.getImageInfo({
          src: url,
          success: res => {
            resolve({ basesrc: res.path, image_url: url })
          },
          fail: err => {
            that.$xw.Toast('绘本下载失败，正在重新尝试！')
            let routes = getCurrentPages() // 获取当前打开过的页面路由数组
            let curRoute = routes[routes.length - 1].route // 获取当前页面路由，也就是最后一个打开的页面路由
            let params = routes[routes.length - 1].options // 获取当前页面路由，也就是最后一个打开的页面路由
            let newrouter = []
            for (let key in params) {
              newrouter.push(`${key}=${params[key]}`)
            }
            let resultrouter = newrouter.join('&')
            resultrouter = '?' + resultrouter
            uni.redirectTo({
              url: curRoute + resultrouter
            })
            reject(err)
            // modal('获取图片信息失败，请稍后重试！')
          }
        })
      })
    },
    getBook_init(data) {
      this.listTotal = data
      let books = []
      data.forEach(item => {
        books.push(...item.content_list)
      })
      let that = this
      let arr = []
      books.forEach(item => {
        that.getBaseSrc(item.image_url).then(data => {
          const { image_url, basesrc } = data
          arr.push({
            image_url,
            basesrc
          })
        })
        return item
      })

      let timer = () => {
        setTimeout(() => {
          if (arr.length !== books.length) {
            timer()
          } else {
            // this.$xw.Toast('温馨提示：未加载出来请退出重试下哦')
            this.list = books.map(item => {
              arr.forEach(ar => {
                if (ar.image_url === item.image_url) {
                  item.image_url = ar.basesrc
                }
              })
              return item
            })
            console.log('计算完毕')
            this.loadingend = true
            setTimeout(() => {
              this.showplay = true
              this.loadingtype = ''
              // 打开自动播放
              this.$store.state.book.auto = true
            }, 1000)
          }
        }, 100)
      }
      timer()
    },
    init(e) {
      // 保持亮屏
      uni.setKeepScreenOn({
        keepScreenOn: true
      })
      this.clear()
      // ajax返回数据
      this.loadingtype = 'book'
      let data = [
        {
          content_list: [
            {
              image_url:
                'https://img2.baidu.com/it/u=28541236,4107248362&fm=26&fmt=auto&gp=0.jpg',
              voice_url:
                'https://voice.xwsxedu.com/303fcfec1697ecd89ed21764626e8b74.mp3'
            },
            {
              image_url:
                'https://img0.baidu.com/it/u=2784862033,2668338252&fm=26&fmt=auto&gp=0.jpg',
              voice_url:
                'https://voice.xwsxedu.com/481113974eeb64aac2ab1f934b250562.mp3'
            },
            {
              image_url:
                'https://img0.baidu.com/it/u=2898675182,3991212596&fm=26&fmt=auto&gp=0.jpg',
              voice_url:
                'https://voice.xwsxedu.com/9fc46a5bc085822492419e6ada1d6d64.mp3'
            },
            {
              image_url:
                'https://img1.baidu.com/it/u=3562116068,3792326334&fm=26&fmt=auto&gp=0.jpg',
              voice_url:
                'https://voice.xwsxedu.com/c38dd7088328fdb7007feec840cbf4fd.mp3'
            },
            {
              image_url:
                'https://img2.baidu.com/it/u=1052437126,3032284531&fm=26&fmt=auto&gp=0.jpg',
              voice_url:
                'https://voice.xwsxedu.com/2ff4b8c4198b327a36d4103c221302c3.mp3'
            },
            {
              image_url:
                'https://img2.baidu.com/it/u=3424693135,535029859&fm=11&fmt=auto&gp=0.jpg',
              voice_url:
                'https://voice.xwsxedu.com/5ac56395e531b592326324240640d268.mp3'
            },
            {
              image_url:
                'https://img0.baidu.com/it/u=795132588,653282595&fm=26&fmt=auto&gp=0.jpg',
              // interactive_elements: [],
              // question_list: [
              //   {
              //     answer_list: ['d'],
              //     assembly: 'E6S2xsSVyQ',
              //     background_image_path: '',
              //     background_image_url: '',
              //     correct_option_list: [
              //       {
              //         image_path: '3cf6a12566f16d827f5c2bc1822e7b5a.png',
              //         image_url:
              //           'https://image.xwsxedu.com/3cf6a12566f16d827f5c2bc1822e7b5a.png',
              //         value: 'd'
              //       }
              //     ],
              //     create_time: 1606828684,
              //     describe: '小朋友，请你数一数，这里一共有几块正方体？',
              //     difficulty: 'low',
              //     disturb_option_list: [
              //       {
              //         image_path: '689b294870cb5955c2056e8151762b29.png',
              //         image_url:
              //           'https://image.xwsxedu.com/689b294870cb5955c2056e8151762b29.png',
              //         value: 'c1'
              //       },
              //       {
              //         image_path: 'ae8cc2e519e060efc18e623358e8a559.png',
              //         image_url:
              //           'https://image.xwsxedu.com/ae8cc2e519e060efc18e623358e8a559.png',
              //         value: 'c3'
              //       }
              //     ],
              //     explain_image_path: '',
              //     option_list: [
              //       {
              //         image_path: '3cf6a12566f16d827f5c2bc1822e7b5a.png',
              //         image_url:
              //           'https://image.xwsxedu.com/3cf6a12566f16d827f5c2bc1822e7b5a.png',
              //         value: 'd'
              //       },
              //       {
              //         image_path: '689b294870cb5955c2056e8151762b29.png',
              //         image_url:
              //           'https://image.xwsxedu.com/689b294870cb5955c2056e8151762b29.png',
              //         value: 'c1'
              //       },
              //       {
              //         image_path: 'ae8cc2e519e060efc18e623358e8a559.png',
              //         image_url:
              //           'https://image.xwsxedu.com/ae8cc2e519e060efc18e623358e8a559.png',
              //         value: 'c3'
              //       }
              //     ],
              //     question_id: '3KVX8RyBSh',
              //     question_stem_path:
              //       '16dac55c8bb751403177aaddaa7b5d77.png',
              //     question_stem_url:
              //       'https://image.xwsxedu.com/16dac55c8bb751403177aaddaa7b5d77.png',
              //     question_type: 'choice',
              //     question_voice_path:
              //       '262627e8fb1e374ef8014930b2c04bf7.mp3',
              //     question_voice_url:
              //       'https://voice.xwsxedu.com/262627e8fb1e374ef8014930b2c04bf7.mp3',
              //     subject: 'mathematics',
              //     title: 'C版5-6岁体验课第4节例题1',
              //     update_time: 1606916524
              //   },
              //   {
              //     answer_list: ['d'],
              //     assembly: 'E6S2xsSVyQ',
              //     background_image_path: '',
              //     background_image_url: '',
              //     correct_option_list: [
              //       {
              //         image_path: 'eb391fbb4c636d4540ec2717d401cc75.png',
              //         image_url:
              //           'https://image.xwsxedu.com/eb391fbb4c636d4540ec2717d401cc75.png',
              //         value: 'd'
              //       }
              //     ],
              //     create_time: 1606828754,
              //     describe: '小朋友，请你数一数，这里一共有几块正方体？',
              //     difficulty: 'low',
              //     disturb_option_list: [
              //       {
              //         image_path: '3cf6a12566f16d827f5c2bc1822e7b5a.png',
              //         image_url:
              //           'https://image.xwsxedu.com/3cf6a12566f16d827f5c2bc1822e7b5a.png',
              //         value: 'c1'
              //       },
              //       {
              //         image_path: '689b294870cb5955c2056e8151762b29.png',
              //         image_url:
              //           'https://image.xwsxedu.com/689b294870cb5955c2056e8151762b29.png',
              //         value: 'c2'
              //       }
              //     ],
              //     explain_image_path: '',
              //     option_list: [
              //       {
              //         image_path: 'eb391fbb4c636d4540ec2717d401cc75.png',
              //         image_url:
              //           'https://image.xwsxedu.com/eb391fbb4c636d4540ec2717d401cc75.png',
              //         value: 'd'
              //       },
              //       {
              //         image_path: '3cf6a12566f16d827f5c2bc1822e7b5a.png',
              //         image_url:
              //           'https://image.xwsxedu.com/3cf6a12566f16d827f5c2bc1822e7b5a.png',
              //         value: 'c1'
              //       },
              //       {
              //         image_path: '689b294870cb5955c2056e8151762b29.png',
              //         image_url:
              //           'https://image.xwsxedu.com/689b294870cb5955c2056e8151762b29.png',
              //         value: 'c2'
              //       }
              //     ],
              //     question_id: 'H6RYvrz8tt',
              //     question_stem_path:
              //       '4fd983f05402cf57383497c26f9bd5fc.png',
              //     question_stem_url:
              //       'https://image.xwsxedu.com/4fd983f05402cf57383497c26f9bd5fc.png',
              //     question_type: 'choice',
              //     question_voice_path:
              //       '262627e8fb1e374ef8014930b2c04bf7.mp3',
              //     question_voice_url:
              //       'https://voice.xwsxedu.com/262627e8fb1e374ef8014930b2c04bf7.mp3',
              //     subject: 'mathematics',
              //     title: 'C版5-6岁体验课第4节例题2',
              //     update_time: 1606916794
              //   },
              //   {
              //     answer_list: ['d'],
              //     assembly: 'E6S2xsSVyQ',
              //     background_image_path: '',
              //     background_image_url: '',
              //     correct_option_list: [
              //       {
              //         image_path: '6b76de6a9b7af0771a3238c85e65e173.png',
              //         image_url:
              //           'https://image.xwsxedu.com/6b76de6a9b7af0771a3238c85e65e173.png',
              //         value: 'd'
              //       }
              //     ],
              //     create_time: 1606828869,
              //     describe: '小朋友，请你数一数，这里一共有几块正方体？',
              //     difficulty: 'low',
              //     disturb_option_list: [
              //       {
              //         image_path: '175f66ba121d3beb4ad692250c6a5b45.png',
              //         image_url:
              //           'https://image.xwsxedu.com/175f66ba121d3beb4ad692250c6a5b45.png',
              //         value: 'c1'
              //       },
              //       {
              //         image_path: '10d434152f424108a3c618048986bbbb.png',
              //         image_url:
              //           'https://image.xwsxedu.com/10d434152f424108a3c618048986bbbb.png',
              //         value: 'c2'
              //       }
              //     ],
              //     explain_image_path: '',
              //     option_list: [
              //       {
              //         image_path: '6b76de6a9b7af0771a3238c85e65e173.png',
              //         image_url:
              //           'https://image.xwsxedu.com/6b76de6a9b7af0771a3238c85e65e173.png',
              //         value: 'd'
              //       },
              //       {
              //         image_path: '175f66ba121d3beb4ad692250c6a5b45.png',
              //         image_url:
              //           'https://image.xwsxedu.com/175f66ba121d3beb4ad692250c6a5b45.png',
              //         value: 'c1'
              //       },
              //       {
              //         image_path: '10d434152f424108a3c618048986bbbb.png',
              //         image_url:
              //           'https://image.xwsxedu.com/10d434152f424108a3c618048986bbbb.png',
              //         value: 'c2'
              //       }
              //     ],
              //     question_id: 'EryuTxCKcz',
              //     question_stem_path:
              //       '0c79672c3eb51bf8fe47564fb266336e.png',
              //     question_stem_url:
              //       'https://image.xwsxedu.com/0c79672c3eb51bf8fe47564fb266336e.png',
              //     question_type: 'choice',
              //     question_voice_path:
              //       '262627e8fb1e374ef8014930b2c04bf7.mp3',
              //     question_voice_url:
              //       'https://voice.xwsxedu.com/262627e8fb1e374ef8014930b2c04bf7.mp3',
              //     subject: 'mathematics',
              //     title: 'C版5-6岁体验课第4节例题3',
              //     update_time: 1606916752
              //   }
              // ],
              voice_url:
                'https://voice.xwsxedu.com/3f07e62442f40ae7ab2fec4eef6187f1.mp3'
            }
          ],
          create_time: 1606550952,
          describe: 'C版5-6岁体验课第4节',
          picture_book_id: 'F436q2EXGc',
          state: 1,
          title: '吨吨号上丢失的货箱',
          update_time: 1608198299
        }
      ]
      this.getBook_init(data)
    }
  },
  onLoad(e) {
    this.init(e)
  },
  onUnload() {
    // 将数据清理掉
    this.clear()
  },
  computed: {
    iszhiyin() {
      return this.$store.state.book.iscourse
    },
    autostatus() {
      return this.$store.state.book.auto
    }
  }
}
</script>
<style scoped lang="scss">
.dealy {
  position: absolute;
  color: #ccc;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.book {
  position: relative;
  width: 100vw;
  height: 100vh;
}
.play {
  position: absolute;
  color: #fff;
  font-size: r(12);
  right: r(50);
  top: r(10);
  z-index: 10;
  width: r(24);
  height: r(24);
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  image {
    width: r(14);
  }
}
.auto {
  position: absolute;
  color: #fff;
  font-size: r(12);
  right: r(80);
  top: r(10);
  z-index: 10;
  width: r(24);
  height: r(24);
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  image {
    width: r(14);
  }
}
@keyframes shou {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-150px);
  }
}
.zhiyin {
  position: absolute;
  color: #fff;
  font-size: r(12);
  right: r(10);
  top: r(0);
  bottom: 0;
  margin: auto 0;
  z-index: 10;
  // width: 100%;
  height: r(50);
  height: r(50);
  display: flex;
  align-items: center;
  justify-content: center;
  // animation: shou 0.5s;
  animation: shou 2s infinite;
  image {
    width: r(40);
    height: auto;
  }
}
</style>
