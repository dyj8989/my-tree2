import Vue from 'vue'
import App from './App.vue'
import MyTree from './components/MyTree.vue'

Vue.config.productionTip = false

Vue.component(MyTree.name, MyTree)
new Vue({
  render: h => h(App)
}).$mount('#app')
