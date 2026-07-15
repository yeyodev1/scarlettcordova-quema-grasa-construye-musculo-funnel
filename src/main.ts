import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/styles/global.scss'
import { trackMetaPageView } from '@/services/metaTracking'

const app = createApp(App)

app.use(createPinia())
app.use(router)

router.afterEach(() => trackMetaPageView())

app.mount('#app')
