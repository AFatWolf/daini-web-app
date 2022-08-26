import { useI18n } from 'vue-i18n'

export const useLang = () => {
  const { t, messages } = useI18n()

  return {
    t,
    messages,
  }
}
