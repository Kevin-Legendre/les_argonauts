import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

const app = createApp(App)
axios.defaults.baseURL = (process.env.VUE_APP_API || '') + '/'

app.config.globalProperties.$api = axios

app.use(router).mount('#app')
