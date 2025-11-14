<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
      <h2 class="text-2xl font-semibold mb-6 text-gray-700 text-center">Registro de equipos</h2>

      <form @submit.prevent="registerDevice" class="space-y-4">
        <!-- CPU Name -->
        <div class="tag">
          <label class="block text-gray-600 mb-1">Nombre de CPU</label>
          <input
            v-model="device.cpu_name"
            type="text"
            placeholder="e.g., Intel i7"
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <!-- RAM Storage -->
        <div class="tag">
          <label class="block text-gray-600 mb-1">Memoria RAM (GB)</label>
          <input
            v-model="device.ram_storage"
            type="text"
            placeholder="e.g., 16 GB"
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <!-- IP Address -->
        <div>
          <label class="block text-gray-600 mb-1">Dirección IP</label>
          <input
            v-model="device.ip_address"
            type="text"
            placeholder="e.g., 192.168.1.100"
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <!-- Storage -->
        <div>
          <label class="block text-gray-600 mb-1">Almacenamiento (GB)</label>
          <input
            v-model="device.storage"
            type="text"
            placeholder="e.g., 512"
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <!-- Select from list -->
        <div>
          <label class="block text-gray-600 mb-1">Usuario</label>
          <select
            v-model="device.user_id"
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>Selecciona el usuario</option>
            <option v-for="(item, index) in users" :key="index" :value="item.id">
              {{ item.fullname }}
            </option>
          </select>
        </div>

        <!-- Submit button -->
        <div class="pt-4">
          <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 transition"
          >
            Register Device
          </button>
        </div>
      </form>
    </div>
  </div>

  <div class="p-6 bg-gray-50 min-h-screen">
    <h2 class="text-2xl font-semibold text-gray-700 mb-4 text-center">Registered Devices</h2>

    <div class="overflow-x-auto border rounded-2xl shadow bg-white">
      <table class="min-w-full text-sm text-left text-gray-600">
        <thead class="bg-gray-100 text-gray-700 sticky top-0">
          <tr>
            <th class="py-3 px-4">#</th>
            <th class="py-3 px-4">Nombre CPU</th>
            <th class="py-3 px-4">Memoria RAM</th>
            <th class="py-3 px-4">Dirección IP</th>
            <th class="py-3 px-4">Almacenamiento</th>
            <th class="py-3 px-4">Usuario</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(device, index) in pagedDevices"
            :key="index"
            class="hover:bg-gray-50 transition"
          >
            <td class="py-2 px-4 border-t">{{ startIndex + index + 1 }}</td>
            <td class="py-2 px-4 border-t">{{ device.cpu_name }}</td>
            <td class="py-2 px-4 border-t">{{ device.ram_storage }}</td>
            <td class="py-2 px-4 border-t">{{ device.ip_address }}</td>
            <td class="py-2 px-4 border-t">{{ device.storage }}</td>
            <td class="py-2 px-4 border-t">{{ device.user_id }}</td>
          </tr>

          <!-- Show message if no devices -->
          <tr v-if="pagedDevices.length === 0">
            <td colspan="6" class="text-center py-6 text-gray-400">No devices found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination controls -->
    <div class="flex justify-between items-center mt-4">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        Prev
      </button>

      <p class="text-gray-600">Page {{ currentPage }} of {{ totalPages }}</p>

      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// form data
const device = ref({
  user_id: '',
  cpu_name: '',
  ram_storage: '',
  ip_address: '',
  storage: '',
})

const users = ref([])

// list for select element
const deviceTypes = ['Desktop', 'Laptop', 'Server', 'Router', 'Switch', 'Firewall']

// submit handler
async function registerDevice() {
  const payload = device.value

  const res = await fetch('http://127.0.0.1:8000/save-device', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  console.log(data)

  if (data) {
    device.value = {
      user_id: '',
      cpu_name: '',
      ram_storage: '',
      ip_address: '',
      storage: '',
    }
  }
}

// Example list of devices
const devices = ref([])

// Pagination settings
const currentPage = ref(1)
const rowsPerPage = 10

const totalPages = computed(() => Math.ceil(devices.value.length / rowsPerPage))

const startIndex = computed(() => (currentPage.value - 1) * rowsPerPage)
const endIndex = computed(() => startIndex.value + rowsPerPage)

const pagedDevices = computed(() => devices.value.slice(startIndex.value, endIndex.value))

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

onMounted(async () => {
  const res = await fetch('http://127.0.0.1:8000/get-users', {
    method: 'GET',
  })
  const data = await res.json()
  users.value = data

  const res_devices = await fetch('http://127.0.0.1:8000/get-devices', {
    method: 'GET',
  })
  const data_devices = await res_devices.json()
  devices.value = data_devices.map((item) => {
    let user = data.find((i) => item.user_id === i.id)
    console.log(user.fullname)
    return {
      user_id: user.fullname,
      cpu_name: item.cpu_name,
      ram_storage: item.ram_storage,
      ip_address: item.ip_address,
      storage: item.storage,
    }
  })
})
</script>

<style scoped></style>
