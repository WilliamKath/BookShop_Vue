import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'

import qs from 'qs'

import cookie from './util/cookie'
Vue.prototype.cookie = cookie;

import imgTool from './util/imgTool.js'
Vue.prototype.imgTool = imgTool;

Vue.config.productionTip = false

// 导入axios
import axios from 'axios'
// 挂载axios
Vue.prototype.$http = axios
// 设置访问根路径
axios.defaults.baseURL = "http://localhost:9000"

Vue.prototype.$imgBaseUrl = 'http://localhost:9000/image/'


//导入JwChat
import JwChat from 'jwchat';

/* 在 0.2.041 之前的版本需要引入 css */
// import 'jwchat/lib/JwChat.css';
Vue.use(JwChat)






new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
