<script setup lang="ts">
interface Props {
  audioData: { bass: number; mid: number; treble: number; overall: number }
  currentLevel: number
}

const props = defineProps<Props>()

const buildingPositions = [
  { x: -80, z: -60, height: 45, width: 14, depth: 14 },
  { x: -60, z: -80, height: 60, width: 16, depth: 16 },
  { x: -40, z: -50, height: 35, width: 12, depth: 12 },
  { x: -20, z: -70, height: 50, width: 15, depth: 15 },
  { x: 0, z: -90, height: 70, width: 20, depth: 20 },
  { x: 20, z: -60, height: 40, width: 14, depth: 14 },
  { x: 40, z: -80, height: 55, width: 16, depth: 16 },
  { x: 60, z: -50, height: 45, width: 14, depth: 14 },
  { x: 80, z: -70, height: 65, width: 18, depth: 18 },
  { x: -70, z: 30, height: 38, width: 12, depth: 12 },
  { x: -50, z: 50, height: 52, width: 15, depth: 15 },
  { x: -30, z: 20, height: 42, width: 13, depth: 13 },
  { x: -10, z: 60, height: 58, width: 16, depth: 16 },
  { x: 10, z: 40, height: 48, width: 14, depth: 14 },
  { x: 30, z: 70, height: 36, width: 11, depth: 11 },
  { x: 50, z: 35, height: 62, width: 17, depth: 17 },
  { x: 70, z: 55, height: 44, width: 13, depth: 13 },
]
</script>

<template>
  <TresGroup>
    <TresMesh :position="[0, -0.5, 0]" :rotation="[-Math.PI / 2, 0, 0]">
      <TresPlaneGeometry :args="[600, 600, 100, 100]" />
      <TresMeshStandardMaterial 
        color="#0a0a20" 
        :metalness="0.9" 
        :roughness="0.2"
      />
    </TresMesh>

    <TresMesh
      v-for="(pos, index) in buildingPositions" 
      :key="index"
      :position="[pos.x, pos.height / 2, pos.z]"
    >
      <TresBoxGeometry :args="[pos.width, pos.height, pos.depth]" />
      <TresMeshStandardMaterial 
        color="#151525"
        :metalness="0.95"
        :roughness="0.15"
        :emissive="0x002244"
        :emissive-intensity="0.4 + audioData.bass * 0.5"
      />
    </TresMesh>

    <TresGroup :position="[0, 0, -40]">
      <TresMesh :position="[0, 12.5, 0]">
        <TresBoxGeometry :args="[35, 25, 22]" />
        <TresMeshStandardMaterial 
          color="#252540" 
          :metalness="0.8" 
          :roughness="0.2"
          :emissive="0x1a1a3a"
          :emissive-intensity="0.3"
        />
      </TresMesh>
      
      <TresMesh :position="[0, 26, 0]">
        <TresSphereGeometry :args="[10, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]" />
        <TresMeshStandardMaterial 
          color="#3d3d5c" 
          :metalness="0.9" 
          :roughness="0.1"
          :emissive="0x2a2a4a"
          :emissive-intensity="0.4"
        />
      </TresMesh>

      <TresMesh 
        v-for="i in 6" 
        :key="'col-' + i"
        :position="[-12 + (i - 1) * 4.8, 10, 12]"
      >
        <TresCylinderGeometry :args="[0.6, 0.6, 20, 12]" />
        <TresMeshStandardMaterial 
          color="#4a4a6a" 
          :metalness="0.7" 
          :roughness="0.3"
        />
      </TresMesh>

      <TresMesh :position="[0, 8, 11]" :rotation="[Math.PI / 2, 0, 0]">
        <TresTorusGeometry :args="[4, 0.4, 12, 32]" />
        <TresMeshStandardMaterial 
          color="#ff8844"
          :emissive="0xff6b35"
          :emissive-intensity="1 + audioData.overall * 2"
          :metalness="0.95"
          :roughness="0.05"
        />
      </TresMesh>

      <TresMesh :position="[0, 32, 0]">
        <TresSphereGeometry :args="[3, 16, 16]" />
        <TresMeshStandardMaterial 
          color="#ffffff"
          :emissive="0xffffff"
          :emissive-intensity="2 + audioData.bass * 3"
        />
      </TresMesh>

      <TresPointLight :position="[0, 8, 11]" :color="0xff6b35" :intensity="5" :distance="30" />
      <TresPointLight :position="[0, 32, 0]" :color="0xffffff" :intensity="3" :distance="40" />
    </TresGroup>

    <TresGroup :position="[0, 0, 0]">
      <TresLine
        v-for="i in 31"
        :key="'gridx-' + i"
        :points="[[-300 + i * 20, 0.1, -300], [-300 + i * 20, 0.1, 300]]"
      >
        <TresLineBasicMaterial 
          :color="0x00ff88" 
          :transparent="true" 
          :opacity="0.12 + audioData.overall * 0.1" 
        />
      </TresLine>
      <TresLine
        v-for="i in 31"
        :key="'gridz-' + i"
        :points="[[-300, 0.1, -300 + i * 20], [300, 0.1, -300 + i * 20]]"
      >
        <TresLineBasicMaterial 
          :color="0x00ff88" 
          :transparent="true" 
          :opacity="0.12 + audioData.overall * 0.1" 
        />
      </TresLine>
    </TresGroup>
  </TresGroup>
</template>
