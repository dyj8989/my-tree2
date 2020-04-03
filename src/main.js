import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import MyTree from './components/MyTree.vue'
import NewTree from './components/NewTree.vue'

Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.component(MyTree.name, MyTree)
Vue.component(NewTree.name, NewTree)
new Vue({
  render: h => h(App)
}).$mount('#app')
