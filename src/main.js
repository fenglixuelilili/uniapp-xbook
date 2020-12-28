import Vue from 'vue'
import App from './App'
import store from './store'
import './commen.scss'
import './static/css/animate.css'
import xwutlis from './utlis'
import lodash from 'lodash'
Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$store = store
Vue.prototype._ = lodash
// 全局公共方法
Vue.prototype.$xw = {}
for (let fn in xwutlis) {
  Vue.prototype.$xw[fn] = xwutlis[fn]
}
const app = new Vue({
  ...App
})
app.$mount()
