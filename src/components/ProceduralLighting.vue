<script setup lang="ts">
interface Props {
  audioData: { bass: number; mid: number; treble: number; overall: number }
  gameState?: { score: number; isPlaying: boolean; timeRemaining: number; levelComplete: boolean }
}

const props = defineProps<Props>()

const spotPositions: [number, number, number][] = [
  [40, 80, 40],
  [-40, 80, 40],
  [40, 80, -40],
  [-40, 80, -40],
  [0, 100, 0],
  [60, 60, 0],
  [-60, 60, 0],
  [0, 60, 60],
  [0, 60, -60],
]

const pointPositions: [number, number, number][] = [
  [20, 8, 20],
  [-20, 8, 20],
  [20, 8, -20],
  [-20, 8, -20],
  [0, 10, 25],
  [0, 10, -25],
  [30, 5, 0],
  [-30, 5, 0],
  [0, 15, 0],
]

const colors = [0x00ff88, 0xff6b35, 0x4a90d9, 0xff00ff, 0x00ffff, 0xffd700, 0xff0066, 0x66ff00, 0xff6600]
</script>

<template>
  <TresGroup>
    <TresAmbientLight :intensity="0.5" color="#1a1a3a" />
    
    <TresDirectionalLight :position="[50, 100, 50]" :intensity="1" color="#6688cc" />
    <TresDirectionalLight :position="[-50, 80, -50]" :intensity="0.5" color="#cc6688" />
    <TresDirectionalLight :position="[0, 120, 0]" :intensity="0.8" color="#ffffff" />
    
    <TresSpotLight
      v-for="(pos, index) in spotPositions"
      :key="'spot-' + index"
      :position="pos"
      :color="colors[index % colors.length]"
      :intensity="4 + audioData.overall * 6"
      :angle="Math.PI / 3"
      :penumbra="0.3"
      :distance="180"
      :decay="1"
    />
    
    <TresPointLight
      v-for="(pos, index) in pointPositions"
      :key="'point-' + index"
      :position="pos"
      :color="colors[index % colors.length]"
      :intensity="3 + audioData.bass * 5"
      :distance="60"
      :decay="1.5"
    />

    <TresPointLight
      :position="[0, 35, 0]"
      :color="0x00ff88"
      :intensity="8 + audioData.overall * 15"
      :distance="100"
    />
  </TresGroup>
</template>
