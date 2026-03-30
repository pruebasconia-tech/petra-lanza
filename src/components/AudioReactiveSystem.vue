<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

interface Props {
  enabled: boolean
  /**
   * When true, keep emitting smooth demo data even if the microphone
   * isn't enabled so the experience never feels static.
   */
  allowDemo?: boolean
}

interface AudioData {
  bass: number
  mid: number
  treble: number
  overall: number
}

const props = withDefaults(defineProps<Props>(), {
  allowDemo: true
})
const emit = defineEmits<{
  (e: 'audio-data', data: AudioData): void
}>()

const audioContext = ref<AudioContext | null>(null)
const analyser = ref<AnalyserNode | null>(null)
const isInitialized = ref(false)
const animationId = ref<number | null>(null)
const usingDemo = ref(false)
const smoothState = ref<AudioData>({ bass: 0, mid: 0, treble: 0, overall: 0 })

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max)

async function initAudio(shouldRequestMic = true) {
  if (isInitialized.value && (!shouldRequestMic || !usingDemo.value)) return
  
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!audioContext.value) {
      audioContext.value = new AudioCtx()
    }

    if (!analyser.value) {
      analyser.value = audioContext.value.createAnalyser()
    }

    if (audioContext.value.state === 'suspended') {
      await audioContext.value.resume()
    }

    analyser.value.fftSize = 256
    analyser.value.smoothingTimeConstant = 0.8
    analyser.value.minDecibels = -90
    analyser.value.maxDecibels = -10
    
    if (shouldRequestMic) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const source = audioContext.value.createMediaStreamSource(stream)
        source.connect(analyser.value)
        usingDemo.value = false
      } catch {
        usingDemo.value = true
        console.log('Using demo mode')
      }
    } else {
      usingDemo.value = true
    }
    
    isInitialized.value = true
    analyzeAudio()
  } catch (error) {
    console.error('Error initializing audio:', error)
  }
}

function analyzeAudio() {
  if (!analyser.value) return
  
  let bass = 0
  let mid = 0
  let treble = 0
  let overall = 0

  if (usingDemo.value) {
    const t = performance.now() * 0.002
    bass = (Math.sin(t) + 1) / 2
    mid = (Math.sin(t * 0.8 + 1) + 1) / 2
    treble = (Math.sin(t * 1.2 + 2) + 1) / 2
    overall = (bass + mid + treble) / 3
  } else {
    const bufferLength = analyser.value.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyser.value.getByteFrequencyData(dataArray)
    
    const bassEnd = Math.max(1, Math.floor(bufferLength * 0.1))
    const midEnd = Math.max(bassEnd + 1, Math.floor(bufferLength * 0.5))
    
    let bassSum = 0, midSum = 0, trebleSum = 0
    
    for (let i = 0; i < bassEnd; i++) bassSum += dataArray[i] || 0
    for (let i = bassEnd; i < midEnd; i++) midSum += dataArray[i] || 0
    for (let i = midEnd; i < bufferLength; i++) trebleSum += dataArray[i] || 0
    
    bass = bassSum / (bassEnd * 255) || 0
    mid = midSum / ((midEnd - bassEnd) * 255) || 0
    treble = trebleSum / ((bufferLength - midEnd) * 255) || 0
    overall = (bass + mid + treble) / 3
  }

  const normalized = {
    bass: clamp(Math.pow(bass, 0.8)),
    mid: clamp(Math.pow(mid, 0.8)),
    treble: clamp(Math.pow(treble, 0.8)),
    overall: clamp(Math.pow(overall, 0.8))
  }

  smoothState.value = {
    bass: smoothState.value.bass * 0.8 + normalized.bass * 0.2,
    mid: smoothState.value.mid * 0.8 + normalized.mid * 0.2,
    treble: smoothState.value.treble * 0.8 + normalized.treble * 0.2,
    overall: smoothState.value.overall * 0.8 + normalized.overall * 0.2
  }
  
  emit('audio-data', smoothState.value)
  
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
  usingDemo.value = false
  smoothState.value = { bass: 0, mid: 0, treble: 0, overall: 0 }
}

watch(
  () => props.enabled || props.allowDemo,
  (shouldRun) => {
    if (shouldRun) {
      initAudio(props.enabled)
    } else {
      stopAudio()
      emit('audio-data', { bass: 0, mid: 0, treble: 0, overall: 0 })
    }
  },
  { immediate: true }
)

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
