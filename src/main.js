import { createApp, h, resolveComponent } from 'vue'
import App from './App.vue'

import i18nPlugin from './plugins/i18n'

const i18nStrings = {
  greetings: {
    // hi: 'Hallo!'
    hi: '你好!'
  }
}

const app = createApp(App)

app.use(i18nPlugin, i18nStrings)

app.mount('#app')


