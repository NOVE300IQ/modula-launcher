<template>
  <div v-if="total > 0" class="performance-monitor non-moveable flex items-center gap-2 px-2 py-1 rounded-md hover:bg-[rgba(255,255,255,0.05)] transition-all cursor-default">
    <div class="monitor-label text-[10px] font-bold opacity-60 uppercase tracking-tighter pt-1">RAM</div>
    <div class="flex flex-col h-full justify-center">
      <div class="text-[11px] font-mono leading-none">
        {{ usedGB }} / {{ totalGB }} <span class="opacity-50">GB</span>
      </div>
      <div class="w-full bg-[rgba(255,255,255,0.1)] h-[2px] mt-1 rounded-full overflow-hidden">
        <div 
          class="h-full bg-primary transition-all duration-1000" 
          :style="{ width: `${percentage}%`, backgroundColor: percentage > 80 ? '#ef4444' : '#c4b5fd' }"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useService } from '@/composables/service'
import { BaseServiceKey } from '@xmcl/runtime-api'

const { getMemoryStatus } = useService(BaseServiceKey)
const total = ref(0)
const free = ref(0)

const totalGB = computed(() => (total.value / (1024 * 1024 * 1024)).toFixed(1))
const usedGB = computed(() => ((total.value - free.value) / (1024 * 1024 * 1024)).toFixed(1))
const percentage = computed(() => total.value > 0 ? ((total.value - free.value) / total.value) * 100 : 0)

const update = async () => {
  try {
    const status = await getMemoryStatus()
    total.value = status.total
    free.value = status.free
  } catch (e) {
    // Ignore errors
  }
}

let timer: any = null

onMounted(() => {
  update()
  timer = setInterval(update, 5000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.performance-monitor {
  height: 28px;
  user-select: none;
}
.bg-primary {
  background-color: var(--color-primary);
}
</style>
