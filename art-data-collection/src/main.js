import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import "mand-mobile/components/_style/global.styl";
import "normalize.css";
import httpRequest from './util/httpRequest'
import VueCookie from 'vue-cookies'

Vue.config.productionTip = false
Vue.prototype.$http = httpRequest
Vue.use(VueCookie)

// import VConsole from 'vconsole'
//
// if (process.env.NODE_ENV === 'production') {
//   new VConsole()
// }
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
