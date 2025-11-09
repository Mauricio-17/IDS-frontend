<template>
  <!--
  <main>
    <TheWelcome />
  </main>
  -->
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <!-- 🌐 Navigation Bar -->
    <nav class="bg-indigo-600 text-white shadow-lg">
      <div class="container mx-auto flex justify-between items-center p-4">
        <h1 class="text-xl font-semibold">Network Flow Monitor</h1>
        <ul class="flex space-x-6">
          <li><a href="#" class="hover:text-gray-200">Dashboard</a></li>
          <li><a href="#" class="hover:text-gray-200">Logs</a></li>
          <li><a href="#" class="hover:text-gray-200">Alerts</a></li>
          <li><a href="#" class="hover:text-gray-200">Settings</a></li>
        </ul>
      </div>
    </nav>

    <!-- 📊 Data Table Section -->
    <main class="container mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg relative">
      <!-- 🔘 Action Button -->
      <div class="flex justify-between mb-8">
        <h2 class="inline text-2xl font-bold mb-4 text-indigo-700">Recent Flow Records</h2>

        <button
          @click="refrechRecords"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow-md transition"
        >
          Actualizar
        </button>
      </div>

      <!-- 🔝 Horizontal scroll on top -->
      <div
        ref="scrollContainer"
        class="overflow-x-auto border-t border-l border-r border-gray-300 rounded-t-lg"
      >
        <div class="h-4"></div>
      </div>

      <!-- 📋 Scrollable Table -->
      <div
        ref="tableWrapper"
        class="overflow-x-auto border border-gray-300 rounded-b-lg mt-8"
        @scroll="syncScroll"
      >
        <table class="min-w-max w-full text-sm text-left border-collapse relative">
          <thead class="bg-indigo-100">
            <tr>
              <th
                v-for="(col, index) in columns"
                :key="index"
                class="py-2 px-4 text-left border-b border-gray-300 whitespace-nowrap bg-indigo-100"
                :class="{
                  'sticky left-0 z-10 bg-indigo-200': index === 0,
                  'sticky right-0 z-10 bg-indigo-200': index === columns.length - 1,
                }"
              >
                {{ col }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in pagedData"
              :key="index"
              class="hover:bg-gray-50 transition-colors"
            >
              <td
                class="py-2 px-4 border-b border-gray-200 whitespace-nowrap sticky left-0 bg-white z-10"
              >
                {{ formatTimestamp(row.timestamp) }}
              </td>
              <td class="py-2 px-4 border-b border-gray-200 whitespace-nowrap">
                {{ row['Flow id'] }}
              </td>
              <td class="py-2 px-4 border-b border-gray-200 whitespace-nowrap">
                {{ row['src ip'] }}
              </td>
              <td class="py-2 px-4 border-b border-gray-200 whitespace-nowrap">
                {{ row['dst ip'] }}
              </td>
              <td class="py-2 px-4 border-b border-gray-200 whitespace-nowrap">
                {{ row['Src Port'] }}
              </td>
              <td class="py-2 px-4 border-b border-gray-200 whitespace-nowrap">
                {{ row['Dst Port'] }}
              </td>
              <td class="py-2 px-4 border-b border-gray-200 whitespace-nowrap">
                {{ row['Protocol'] }}
              </td>
              <td class="py-2 px-4 border-b border-gray-200 whitespace-nowrap">
                {{ row['Flow Duration'] }}
              </td>
              <td class="py-2 px-4 border-b border-gray-200 whitespace-nowrap">
                {{ row['Total Length of Fwd Packet'] }}
              </td>
              <td class="py-2 px-4 border-b border-gray-200 whitespace-nowrap">
                {{ row['Total Length of Bwd Packet'] }}
              </td>
              <td
                class="py-2 px-4 border-b border-gray-200 font-semibold whitespace-nowrap sticky right-0 bg-white z-10"
                :class="{
                  'text-green-600': row.Label === 'BENIGN',
                  'text-red-600': row.Label !== 'BENIGN',
                }"
              >
                {{ category[row.Label] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 📄 Pagination Controls -->
      <div class="flex justify-between items-center mt-4">
        <span class="text-sm text-gray-600">
          Showing {{ startIndex + 1 }}–{{ Math.min(endIndex, flows.length) }} of
          {{ flows.length }} records
        </span>

        <div class="flex items-center space-x-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 border rounded disabled:opacity-40 bg-indigo-50 hover:bg-indigo-100"
          >
            Prev
          </button>
          <span class="text-sm text-gray-700">Page {{ currentPage }} / {{ totalPages }}</span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border rounded disabled:opacity-40 bg-indigo-50 hover:bg-indigo-100"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
//import fetch from 'unfetch'

const getHeaders = () => {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
}

// Pagination state
const currentPage = ref(1)
const pageSize = 10
const totalPages = computed(() => Math.ceil(flows.value.length / pageSize))

const startIndex = computed(() => (currentPage.value - 1) * pageSize)
const endIndex = computed(() => startIndex.value + pageSize)

const pagedData = computed(() => flows.value.slice(startIndex.value, endIndex.value))

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

// Define table headers
const columns = [
  'Timestamp',
  'Flow ID',
  'IP orígen',
  'IP destino',
  'Puerto orígen',
  'Puerto destino',
  'Protocolo de red',
  'Duración de conexión',
  'Bytes de envío',
  'Bytes de recibo',
  'Categoría',
]
const category = {
  BENIGN: 'BENIGNO',
  'Botnet - Attempted': 'Ataque zombie',
  DDoS: 'Denegación de servicios',
  Portscan: 'Escaneo de puertos',
  'Web attack': 'Ataque WEB',
}

// Mock data (IDS-style)
const flows = ref([])
// Helper function to format timestamps
function formatTimestamp(ts) {
  const date = new Date(ts)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}:${s}`
}

// Scroll sync logic
const tableWrapper = ref(null)
const scrollContainer = ref(null)

function syncScroll() {
  scrollContainer.value.scrollLeft = tableWrapper.value.scrollLeft
}

const refrechRecords = async () => {
  const res = await fetch('http://127.0.0.1:8000/logs', {
    method: 'GET',
  })
  const data = await res.json()
  console.log(data)
  flows.value = data
}

onMounted(() => {
  scrollContainer.value.onscroll = () => {
    tableWrapper.value.scrollLeft = scrollContainer.value.scrollLeft
  }

  refrechRecords()
})
</script>
