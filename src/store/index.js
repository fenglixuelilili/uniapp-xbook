import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    visableNoCourse: false,
    loading: false,
    // 平台
    platform: uni.getSystemInfoSync().platform,
    // 绘本相关
    book: {
      // 多少秒出现小手
      coursetime: 1000,
      iscourse: false,
      auto: true,
      src: ''
    }
  },
  mutations: {},
  actions: {}
})
export default store
