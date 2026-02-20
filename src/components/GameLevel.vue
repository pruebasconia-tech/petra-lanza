<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

interface Props {
  currentLevel: number
  audioData: { bass: number; mid: number; treble: number; overall: number }
}

interface GameOrb {
  id: number
  position: [number, number, number]
  collected: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'game-event', event: { type: string }): void
}>()

const orbs = ref<GameOrb[]>([])

function generateOrbsForLevel(level: number): GameOrb[] {
  const orbCount = 5 + level * 2
  const newOrbs: GameOrb[] = []
  
  for (let i = 0; i < orbCount; i++) {
    const angle = (i / orbCount) * Math.PI * 2 + level
    const radius = 20 + level * 5 + Math.random() * 10
    const height = 10 + Math.random() * 20
    
    newOrbs.push({
      id: i,
      position: [
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      ],
      collected: false
    })
  }
  
  return newOrbs
}

function collectOrb(orbId: number) {
  const orb = orbs.value.find(o => o.id === orbId)
  if (orb && !orb.collected) {
    orb.collected = true
    emit('game-event', { type: 'score' })
    
    if (orbs.value.every(o => o.collected)) {
      emit('game-event', { type: 'level-complete' })
    }
  }
}

watch(() => props.currentLevel, () => {
  orbs.value = generateOrbsForLevel(props.currentLevel)
  emit('game-event', { type: 'level-start' })
}, { immediate: true })

onMounted(() => {
  orbs.value = generateOrbsForLevel(props.currentLevel)
})
</script>

<template>
  <TresGroup>
    <TresGroup v-for="orb in orbs" :key="orb.id" :position="orb.position" v-show="!orb.collected">
      <TresMesh @click="collectOrb(orb.id)">
        <TresSphereGeometry :args="[1.5 + audioData.bass * 0.5, 16, 16]" />
        <TresMeshStandardMaterial 
          color="#ffd700"
          :emissive="0xffd700"
          :emissive-intensity="1 + audioData.overall * 2"
          :metalness="0.9"
          :roughness="0.1"
        />
      </TresMesh>
      
      <TresMesh :scale="[2, 2, 2]">
        <TresSphereGeometry :args="[1.5, 8, 8]" />
        <TresMeshBasicMaterial 
          color="#ffd700"
          :transparent="true"
          :opacity="0.2"
        />
      </TresMesh>

      <TresPointLight 
        :color="0xffd700" 
        :intensity="3 + audioData.bass * 3" 
        :distance="20"
      />
    </TresGroup>

    <TresGroup v-if="orbs.length > 0 && orbs.every(o => o.collected)">
      <TresMesh :position="[0, 20, 0]">
        <TresTorusGeometry :args="[15, 0.5, 8, 32]" />
        <TresMeshStandardMaterial 
          color="#00ff88"
          :emissive="0x00ff88"
          :emissive-intensity="1"
        />
      </TresMesh>
    </TresGroup>
  </TresGroup>
</template>
