<!--
<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>


<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  
</template>
-->

<template>
  <div class="container">
    <!-- 🌐 Navigation Bar -->
    <nav class="block bg-indigo-600 text-white shadow-lg">
      <div class="container mx-auto flex justify-between items-center p-4">
        <h1 class="text-xl font-semibold">Network Flow Monitor</h1>

        <ul class="flex space-x-6">
          <li class="bg-sky-200 rounded" v-if="isLoggedIn">
            <a href="#" class="hover:text-gray-200 text-l" @click="gotoDevices"> Equipos </a>
          </li>
          <li class="bg-sky-200 rounded" v-if="isLoggedIn">
            <a href="#" class="hover:text-gray-200 text-l" @click="gotoHome"> Monitoreo </a>
          </li>
          <li class="bg-sky-200 rounded" v-if="isLoggedIn">
            <a href="#" class="hover:text-gray-200 text-l" @click="signout"> Cerrar sesión </a>
          </li>
        </ul>
      </div>
    </nav>
    <RouterView />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/Auth'

const router = useRouter()
const authStore = useAuthStore()

const isLoggedIn = computed(() => {
  return authStore.isLoggedIn
})

const signout = () => {
  authStore.setUser(null)
  router.push('/login')
}

const gotoDevices = () => {
  router.push('/devices')
}

const gotoHome = () => {
  router.push('/')
}

onMounted(() => {})
</script>

<!--
<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
-->

<style scoped>
/* Optional: smooth font & layout tweaks */
body {
  font-family: 'Inter', sans-serif;
}

li {
  margin: 5px;
}
</style>
