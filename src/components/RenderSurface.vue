<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import { Engine } from '../prism'

const Canvas = ref<HTMLCanvasElement | null>(null)
const engine = ref<Engine | null>(null)

onMounted(async () => {
  if (!Canvas.value) {
    throw new Error('Canvas element not found')
  }

  try {
    engine.value = new Engine(Canvas.value)
  } catch (error) {
    console.error('Failed to initialize WebGPU engine:', error)
    // You might want to show an error message to the user here
  }
})

// Cleanup on component unmount
onUnmounted(() => {
  // Add any necessary cleanup for the engine
  engine.value = null
})
</script>

<template>
  <div class="render-surface">
    <canvas ref="Canvas" class="w-full bg-gray-900" />
    <!-- Optional error message display -->
    <div v-if="!engine" class="error-message">
      WebGPU may not be supported in your browser
    </div>
  </div>
</template>

<style scoped>
.render-surface {
  position: relative;
}

.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ff5555;
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  border-radius: 0.5rem;
}
</style>
