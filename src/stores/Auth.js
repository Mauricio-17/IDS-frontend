import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  function setUser(item) {
    user.value = item
    const payload = item ? JSON.stringify(item) : null
    localStorage.setItem('user', payload)
  }

  const isLoggedIn = computed(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    return user.username ? user.username : null
  })

  return { setUser, isLoggedIn, user }
})
