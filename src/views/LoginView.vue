<template>
  <main class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <form
      @submit.prevent="onSubmit"
      class="w-full max-w-md bg-white rounded-2xl shadow-md p-6 space-y-6"
      aria-labelledby="login-heading"
      novalidate
    >
      <h1 id="login-heading" class="text-2xl font-semibold text-gray-800 text-center">Sign in</h1>

      <!-- Username -->
      <div class="mt-5">
        <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input
          id="username"
          v-model.trim="username"
          :disabled="loading"
          autofocus
          required
          autocomplete="username"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="your.username"
        />
        <p v-if="showErrors && !username" class="mt-1 text-xs text-red-600">
          Username is required.
        </p>
      </div>

      <!-- Password -->
      <div>
        <div class="flex items-center justify-between">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1"
            >Password</label
          >
          <button
            type="button"
            @click="togglePassword"
            class="text-xs text-indigo-600 hover:underline focus:outline-none"
            :aria-pressed="showPassword.toString()"
          >
            {{ showPassword ? 'Hide' : 'Show' }}
          </button>
        </div>

        <input
          id="password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          :disabled="loading"
          required
          autocomplete="current-password"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="••••••••"
        />
        <p v-if="showErrors && !password" class="mt-1 text-xs text-red-600">
          Password is required.
        </p>
      </div>

      <!-- Extras -->
      <div class="flex items-center justify-between text-sm">
        <label class="inline-flex items-center gap-2">
          <input
            type="checkbox"
            v-model="remember"
            :disabled="loading"
            class="h-4 w-4 rounded border-gray-300"
          />
          <span class="text-gray-600">Remember me</span>
        </label>
        <a href="#" class="text-indigo-600 hover:underline">Forgot?</a>
      </div>

      <!-- Submit -->
      <div>
        <button
          type="submit"
          :disabled="!canSubmit || loading"
          class="w-full inline-flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-full shadow-sm transition"
        >
          <svg
            v-if="!loading"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11.5V10h2.5a.5.5 0 010 1H11v2.5a.5.5 0 01-1 0V11H7.5a.5.5 0 010-1H10V6.5a.5.5 0 011 0z"
              clip-rule="evenodd"
            />
          </svg>

          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="animate-spin h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>

          <span>{{ loading ? 'Signing in…' : 'Sign in' }}</span>
        </button>
      </div>

      <!-- Optional small helper -->
      <p class="text-center text-xs text-gray-400 mt-2">
        Minimal login — credentials are handled client-side in this example.
      </p>
      <span>
        <RouterLink to="/signup">Registrar</RouterLink>
      </span>
    </form>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const showErrors = ref(false)

const canSubmit = computed(() => username.value.trim() !== '' && password.value !== '')

function togglePassword() {
  showPassword.value = !showPassword.value
}

async function onSubmit() {
  showErrors.value = true
  if (!canSubmit.value) return

  loading.value = true

  const payload = {
    username: username.value,
    password: password.value,
  }
  // Simulate authentication delay (replace with real auth)
  try {
    // Here you would call your API. Example:
    // await api.login({ username: username.value, password: password.value })

    const res = await fetch('http://127.0.0.1:8000/sign-in', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    const data = await res.json()

    if (data) {
      router.push('/')
    }

    console.log('Attempting login with', {
      username: username.value,
      password: '••••••',
      remember: remember.value,
    })
    // Emit an event for parent components (if used inside parent)
    // Note: $emit is not available in script setup without defineEmits
    const emit = defineEmits(['login'])
    emit('login', { username: username.value, password: password.value, remember: remember.value })

    // small artificial delay to show spinner
    await new Promise((res) => setTimeout(res, 700))
    console.log('✅ Login successful (demo).')
  } catch (err) {
    console.error('Login failed', err)
  } finally {
    loading.value = false
  }
}
</script>

<style>
/* Minimal fallback styles if Tailwind isn't used */
:root {
  --bg: #f9fafb;
  --card: #ffffff;
  --accent: #4f46e5;
  --muted: #6b7280;
}

body {
  background: var(--bg);
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial;
}

/* keep the card visually minimal when Tailwind isn't present */
form[novalidate] {
  background: var(--card);
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(16, 24, 40, 0.06);
  padding: 24px;
  width: 100%;
  max-width: 420px;
}
input[type='text'],
input[type='password'],
input[type='email'] {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e6e7eb;
  outline: none;
}
button {
  cursor: pointer;
}
</style>
