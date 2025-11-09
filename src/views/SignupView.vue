<template>
  <main class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <form
      @submit.prevent="onSubmit"
      class="w-full max-w-md bg-white rounded-2xl shadow-md p-6 space-y-6"
      novalidate
    >
      <h1 class="text-2xl font-semibold text-gray-800 text-center">User Registration</h1>

      <!-- Full Name -->
      <div>
        <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          id="fullName"
          v-model.trim="fullName"
          required
          autocomplete="name"
          placeholder="John Doe"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <p v-if="showErrors && !fullName" class="mt-1 text-xs text-red-600">
          Full name is required.
        </p>
      </div>

      <!-- Area -->
      <div>
        <label for="area" class="block text-sm font-medium text-gray-700 mb-1">Area</label>
        <input
          id="area"
          v-model.trim="area"
          required
          placeholder="Network Security / IT Department"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <p v-if="showErrors && !area" class="mt-1 text-xs text-red-600">Area is required.</p>
      </div>

      <!-- Username -->
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input
          id="username"
          v-model.trim="username"
          required
          autocomplete="username"
          placeholder="johndoe"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
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
          >
            {{ showPassword ? 'Hide' : 'Show' }}
          </button>
        </div>

        <input
          id="password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          required
          autocomplete="new-password"
          placeholder="••••••••"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <p v-if="showErrors && !password" class="mt-1 text-xs text-red-600">
          Password is required.
        </p>
      </div>

      <!-- Submit Button -->
      <div>
        <button
          type="submit"
          :disabled="!canSubmit"
          class="w-full inline-flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-full shadow-sm transition"
        >
          Submit
        </button>
      </div>
    </form>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

const fullName = ref('')
const area = ref('')
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const showErrors = ref(false)

const canSubmit = computed(
  () =>
    fullName.value.trim() !== '' &&
    area.value.trim() !== '' &&
    username.value.trim() !== '' &&
    password.value.trim() !== '',
)

function togglePassword() {
  showPassword.value = !showPassword.value
}

function onSubmit() {
  showErrors.value = true
  if (!canSubmit.value) return

  console.log('📝 Form submitted:', {
    fullName: fullName.value,
    area: area.value,
    username: username.value,
    password: '••••••••', // never log raw passwords in production
  })

  // Optionally clear the form
  fullName.value = ''
  area.value = ''
  username.value = ''
  password.value = ''
  showErrors.value = false
}
</script>

<style>
/* Minimal fallback if Tailwind isn't available */
body {
  font-family:
    Inter,
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    Helvetica,
    Arial,
    sans-serif;
  background-color: #f9fafb;
}

form {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}
</style>
