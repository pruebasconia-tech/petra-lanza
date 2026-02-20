<script setup lang="ts">
interface Props {
  currentLevel: number
}

interface VideoItem {
  id: number
  title: string
  youtubeId: string
  description: string
  position: [number, number, number]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'level-change', level: number): void
}>()

const videos: VideoItem[] = [
  { id: 0, title: 'Bodies that dance alone', youtubeId: 'wxqxBP96E80', description: 'Screen Dance AI', position: [-30, 15, -20] },
  { id: 1, title: 'Vectofascismo', youtubeId: 'gN4r5myaQks', description: 'Performance collage', position: [25, 12, -25] },
  { id: 2, title: 'Hack the latent space', youtubeId: 'swN_C3Pj4Qw', description: 'AI dreams', position: [-20, 18, 30] },
  { id: 3, title: 'Melancolía de un no especie', youtubeId: 'nByyAdR-A1I', description: 'Computer vision', position: [35, 20, 20] },
  { id: 4, title: 'About the Other Us', youtubeId: '1018089056', description: 'Cyborg dance', position: [0, 25, -35] },
]

function onLevelChange(level: number) {
  emit('level-change', level)
}
</script>

<template>
  <TresGroup>
    <TresGroup
      v-for="video in videos"
      :key="video.id"
      :position="video.position"
    >
      <TresMesh :scale="[12, 7, 1]" @click="onLevelChange(video.id)">
        <TresPlaneGeometry :args="[1, 1]" />
        <TresMeshStandardMaterial
          :color="currentLevel === video.id ? '#00ff88' : '#1a1a2a'"
          :emissive="currentLevel === video.id ? 0x00ff88 : 0x0a0a1a"
          :emissive-intensity="currentLevel === video.id ? 0.5 : 0.2"
          :transparent="true"
          :opacity="0.9"
        />
      </TresMesh>
      
      <TresPointLight
        :position="[0, 5, 0]"
        :color="currentLevel === video.id ? 0x00ff88 : 0x4a90d9"
        :intensity="currentLevel === video.id ? 2 : 0.5"
        :distance="25"
      />
    </TresGroup>
  </TresGroup>
</template>
