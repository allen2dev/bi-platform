import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@bi-platform/core'

export type ThemeMode = 'light' | 'dark'

export const useAppStore = defineStore('app', () => {
  const user = ref<User | null>({ id: 'u1', name: '演示用户' })
  const theme = ref<ThemeMode>('dark')
  const locale = ref('zh-CN')

  function switchTheme(t: ThemeMode) {
    theme.value = t
  }

  function logout() {
    user.value = null
  }

  return { user, theme, locale, switchTheme, logout }
})
