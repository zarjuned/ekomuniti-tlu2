import { createI18n } from 'vue-i18n'
import bm from './bm.json'
import en from './en.json'

const i18n = createI18n({
  legacy: false,
  locale: import.meta.env.VITE_DEFAULT_LOCALE || 'bm',
  fallbackLocale: 'bm',
  messages: { bm, en }
})

export default i18n
