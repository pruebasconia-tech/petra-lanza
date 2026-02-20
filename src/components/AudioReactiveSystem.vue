<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

interface Props {
  enabled: boolean
}

interface AudioData {
  bass: number
  mid: number
  treble: number
  overall: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'audio-data', data: AudioData): void
}>()

const audioContext = ref<AudioContext | null>(null)
const analyser = ref<AnalyserNode | null>(null)
const isInitialized = ref(false)
const animationId = ref<number | null>(null)

async function initAudio() {
  if (isInitialized.value) return
  
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    audioContext.value = new AudioCtx()
    analyser.value = audioContext.value.createAnalyser()
    analyser.value.fftSize = 256
    analyser.value.smoothingTimeConstant = 0.8
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const source = audioContext.value.createMediaStreamSource(stream)
      source.connect(analyser.value)
    } catch {
      console.log('Using demo mode')
    }
    
    isInitialized.value = true
    analyzeAudio()
  } catch (error) {
    console.error('Error initializing audio:', error)
  }
}

function analyzeAudio() {
  if (!analyser.value) return
  
  const bufferLength = analyser.value.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  analyser.value.getByteFrequencyData(dataArray)
  
  const bassEnd = Math.floor(bufferLength * 0.1)
  const midEnd = Math.floor(bufferLength * 0.5)
  
  let bassSum = 0, midSum = 0, trebleSum = 0
  
  for (let i = 0; i < bassEnd; i++) bassSum += dataArray[i] || 0
  for (let i = bassEnd; i < midEnd; i++) midSum += dataArray[i] || 0
  for (let i = midEnd; i < bufferLength; i++) trebleSum += dataArray[i] || 0
  
  const bass = bassSum / (bassEnd * 255) || 0
  const mid = midSum / ((midEnd - bassEnd) * 255) || 0
  const treble = trebleSum / ((bufferLength - midEnd) * 255) || 0
  const overall = (bass + mid + treble) / 3
  
  emit('audio-data', {
    bass: Math.pow(bass, 0.8),
    mid: Math.pow(mid, 0.8),
    treble: Math.pow(treble, 0.8),
    overall: Math.pow(overall, 0.8)
  })
  
  animationId.value = requestAnimationFrame(analyzeAudio)
}

function stopAudio() {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
    animationId.value = null
  }
  
  if (audioContext.value) {
    audioContext.value.close()
    audioContext.value = null
  }
  
  isInitialized.value = false
}

watch(() => props.enabled, (newValue) => {
  if (newValue) {
    initAudio()
  } else {
    stopAudio()
    emit('audio-data', { bass: 0, mid: 0, treble: 0, overall: 0 })
  }
})

onUnmounted(() => {
  stopAudio()
})
</script>

<template>
  <div class="audio-system" :class="{ active: enabled }"></div>
</template>

<style scoped>
.audio-system { display: none; }
.audio-system.active { display: block; }
</style>
