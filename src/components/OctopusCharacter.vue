<script setup lang="ts">
interface Props {
  audioData: { bass: number; mid: number; treble: number; overall: number }
}

const props = defineProps<Props>()
</script>

<template>
  <TresGroup :position="[0, 12, 0]">
    <TresMesh :position="[0, 0, 0]">
      <TresSphereGeometry :args="[4, 32, 32]" />
      <TresMeshStandardMaterial 
        color="#1a1a3a" 
        :metalness="0.6" 
        :roughness="0.4"
        :emissive="0x0a1a2a"
        :emissive-intensity="0.5 + audioData.bass * 0.5"
      />
    </TresMesh>
    
    <TresMesh :position="[0, 3.5, 0]">
      <TresSphereGeometry :args="[3, 32, 32]" />
      <TresMeshStandardMaterial 
        color="#1a1a3a" 
        :metalness="0.6" 
        :roughness="0.4"
        :emissive="0x0a1a2a"
        :emissive-intensity="0.4"
      />
    </TresMesh>

    <TresGroup :position="[-1.5, 4.5, 2]">
      <TresMesh>
        <TresSphereGeometry :args="[0.8, 16, 16]" />
        <TresMeshStandardMaterial color="#ffffff" />
      </TresMesh>
      <TresMesh :position="[0, 0, 0.4]">
        <TresSphereGeometry :args="[0.45, 16, 16]" />
        <TresMeshStandardMaterial color="#000000" :metalness="0.9" />
      </TresMesh>
      <TresMesh :position="[0, 0, 0.35]">
        <TresSphereGeometry :args="[0.5, 16, 16]" />
        <TresMeshStandardMaterial 
          color="#00ff88" 
          :emissive="0x00ff88" 
          :emissive-intensity="1 + audioData.overall"
        />
      </TresMesh>
      <TresMesh :position="[0.2, 0.25, 0.55]">
        <TresSphereGeometry :args="[0.12, 8, 8]" />
        <TresMeshBasicMaterial color="#ffffff" />
      </TresMesh>
    </TresGroup>

    <TresGroup :position="[1.5, 4.5, 2]">
      <TresMesh>
        <TresSphereGeometry :args="[0.8, 16, 16]" />
        <TresMeshStandardMaterial color="#ffffff" />
      </TresMesh>
      <TresMesh :position="[0, 0, 0.4]">
        <TresSphereGeometry :args="[0.45, 16, 16]" />
        <TresMeshStandardMaterial color="#000000" :metalness="0.9" />
      </TresMesh>
      <TresMesh :position="[0, 0, 0.35]">
        <TresSphereGeometry :args="[0.5, 16, 16]" />
        <TresMeshStandardMaterial 
          color="#00ff88" 
          :emissive="0x00ff88" 
          :emissive-intensity="1 + audioData.overall"
        />
      </TresMesh>
      <TresMesh :position="[0.2, 0.25, 0.55]">
        <TresSphereGeometry :args="[0.12, 8, 8]" />
        <TresMeshBasicMaterial color="#ffffff" />
      </TresMesh>
    </TresGroup>

    <TresMesh
      v-for="i in 8"
      :key="'tentacle-' + i"
      :position="[Math.cos((i / 8) * Math.PI * 2) * 2.5, -1, Math.sin((i / 8) * Math.PI * 2) * 2.5]"
      :rotation="[0.3, 0, (i / 8) * Math.PI * 2]"
    >
      <TresCylinderGeometry :args="[0.4 - i * 0.02, 0.15, 10, 12]" />
      <TresMeshStandardMaterial 
        color="#1a1a3a" 
        :metalness="0.5"
        :roughness="0.5"
        :emissive="0x00ff88"
        :emissive-intensity="0.2 + audioData.overall * 0.5 + audioData.bass * 0.3"
      />
    </TresMesh>

    <TresMesh :position="[0, -2, 0]" :rotation="[Math.PI / 2, 0, 0]">
      <TresTorusGeometry :args="[3.5, 0.15, 8, 32]" />
      <TresMeshStandardMaterial 
        color="#00ff88"
        :emissive="0x00ff88"
        :emissive-intensity="0.8 + audioData.overall"
      />
    </TresMesh>

    <TresPointLight 
      :position="[0, 0, 0]" 
      :color="0x00ff88" 
      :intensity="4 + audioData.bass * 6" 
      :distance="25"
    />
    <TresPointLight 
      :position="[0, -3, 0]" 
      :color="0xff6b35" 
      :intensity="2 + audioData.treble * 4" 
      :distance="20"
    />
  </TresGroup>
</template>
