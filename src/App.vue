<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import MexicoCityEnvironment from './components/MexicoCityEnvironment.vue'
import OctopusCharacter from './components/OctopusCharacter.vue'
import AudioReactiveSystem from './components/AudioReactiveSystem.vue'
import VideoGallery from './components/VideoGallery.vue'
import ProceduralLighting from './components/ProceduralLighting.vue'
import GameLevel from './components/GameLevel.vue'

const isLoading = ref(true)
const audioEnabled = ref(false)
const currentLevel = ref(0)
const audioData = ref({ bass: 0, mid: 0, treble: 0, overall: 0 })
const gameState = ref({
  score: 0,
  isPlaying: false,
  timeRemaining: 30,
  levelComplete: false
})

const gl = {
  clearColor: '#000008',
  alpha: false,
  antialias: true,
  powerPreference: 'high-performance' as WebGLPowerPreference
}

function onLevelChange(level: number) {
  currentLevel.value = level
  gameState.value.timeRemaining = 30
  gameState.value.levelComplete = false
}

function onAudioData(data: { bass: number; mid: number; treble: number; overall: number }) {
  audioData.value = data
}

function onGameEvent(event: { type: string }) {
  if (event.type === 'score') {
    gameState.value.score += 100
  } else if (event.type === 'level-complete') {
    gameState.value.levelComplete = true
    gameState.value.isPlaying = false
  }
}

function toggleAudio() {
  audioEnabled.value = !audioEnabled.value
}

function startGame() {
  gameState.value.isPlaying = true
  gameState.value.score = 0
  gameState.value.timeRemaining = 60
  currentLevel.value = 0
}

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
})
</script>

<template>
  <div class="app-container">
    <div v-if="isLoading" class="loader">
      <div class="loader-content">
        <h1>PETRA</h1>
        <h2>LANZA</h2>
        <div class="loader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <TresCanvas v-bind="gl" :window-size="true">
      <TresPerspectiveCamera :position="[0, 20, 60]" :fov="60" :near="0.1" :far="2000" />
      
      <OrbitControls 
        :enable-damping="true" 
        :damping-factor="0.05" 
        :min-distance="10" 
        :max-distance="150"
      />

      <ProceduralLighting :audio-data="audioData" :game-state="gameState" />
      <MexicoCityEnvironment :audio-data="audioData" :current-level="currentLevel" />
      <OctopusCharacter :audio-data="audioData" />
      <VideoGallery :current-level="currentLevel" @level-change="onLevelChange" />
      <GameLevel 
        :current-level="currentLevel" 
        :audio-data="audioData"
        @game-event="onGameEvent"
      />
    </TresCanvas>

    <AudioReactiveSystem :enabled="audioEnabled" @audio-data="onAudioData" />

    <div class="ui-overlay">
      <div class="top-bar">
        <div class="logo">
          <h1>PETRA</h1>
          <span>LANZA</span>
        </div>
        <div class="game-info" v-if="gameState.isPlaying">
          <div class="score">⭐ {{ gameState.score }}</div>
          <div class="timer">⏱ {{ gameState.timeRemaining }}s</div>
          <div class="level-indicator">NIVEL {{ currentLevel + 1 }}</div>
        </div>
      </div>

      <div class="instructions" v-if="!gameState.isPlaying && !isLoading">
        <div class="instruction-box">
          <h3>🎮 CÓMO JUGAR</h3>
          <p>• Navega con mouse/drag</p>
          <p>• Zoom con scroll</p>
          <p>• ¡Toca los orbes dorados!</p>
          <p>• Completa cada nivel</p>
          <p>• Sube de nivel automáticamente</p>
        </div>
        <button class="start-btn" @click="startGame">
          🚀 INICIAR JUEGO
        </button>
      </div>

      <div class="level-complete" v-if="gameState.levelComplete">
        <h2>✨ NIVEL COMPLETO ✨</h2>
        <p>Puntuación: {{ gameState.score }}</p>
        <button @click="startGame">🔄 REINICIAR</button>
      </div>

      <div class="controls-bottom">
        <button @click="toggleAudio" :class="{ active: audioEnabled }">
          {{ audioEnabled ? '🔊 Audio' : '🔇 Audio' }}
        </button>
        
        <div class="level-buttons">
          <button 
            v-for="i in 5" 
            :key="i"
            :class="{ active: currentLevel === i - 1 }"
            @click="onLevelChange(i - 1)"
          >
            {{ i }}
          </button>
        </div>
      </div>

      <div class="audio-visualizer">
        <div class="bar" :style="{ height: `${audioData.bass * 100}%` }"></div>
        <div class="bar" :style="{ height: `${audioData.mid * 100}%` }"></div>
        <div class="bar" :style="{ height: `${audioData.treble * 100}%` }"></div>
        <div class="bar" :style="{ height: `${audioData.overall * 100}%` }"></div>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;900&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000008;
}

.app-container {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, #0a0a1a 0%, #000 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loader-content {
  text-align: center;
}

.loader-content h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 6rem;
  font-weight: 900;
  letter-spacing: 1rem;
  color: #fff;
  text-shadow: 
    0 0 20px rgba(0, 255, 136, 0.8),
    0 0 40px rgba(0, 255, 136, 0.6),
    0 0 60px rgba(0, 255, 136, 0.4);
  animation: pulse-glow 2s infinite ease-in-out;
}

.loader-content h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 10px;
}

@keyframes pulse-glow {
  0%, 100% { text-shadow: 0 0 20px rgba(0, 255, 136, 0.8), 0 0 40px rgba(0, 255, 136, 0.6); }
  50% { text-shadow: 0 0 40px rgba(0, 255, 136, 1), 0 0 80px rgba(0, 255, 136, 0.8), 0 0 120px rgba(0, 255, 136, 0.6); }
}

.loader-dots {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 60px;
}

.loader-dots span {
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #00ff88, #00ffcc);
  border-radius: 50%;
  animation: dot-glow 2s infinite ease-in-out;
}

.loader-dots span:nth-child(2) { animation-delay: 0.3s; }
.loader-dots span:nth-child(3) { animation-delay: 0.6s; }

@keyframes dot-glow {
  0%, 100% { opacity: 0.3; transform: scale(1); box-shadow: 0 0 10px rgba(0, 255, 136, 0.3); }
  50% { opacity: 1; transform: scale(1.5); box-shadow: 0 0 30px rgba(0, 255, 136, 0.8); }
}

.ui-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
  z-index: 100;
}

.ui-overlay > * {
  pointer-events: auto;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.logo h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 0 20px rgba(0, 255, 136, 0.8);
  letter-spacing: 0.3rem;
}

.logo span {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 1rem;
  margin-left: 0.5rem;
}

.game-info {
  display: flex;
  gap: 20px;
  background: rgba(0, 0, 0, 0.6);
  padding: 15px 25px;
  border-radius: 50px;
  border: 1px solid rgba(0, 255, 136, 0.3);
  backdrop-filter: blur(10px);
}

.score, .timer, .level-indicator {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.2rem;
  color: #fff;
}

.score { color: #ffd700; }
.timer { color: #00ff88; }
.level-indicator { color: #ff6b35; font-weight: 700; }

.instructions {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.instruction-box {
  background: rgba(0, 0, 0, 0.8);
  padding: 30px 50px;
  border-radius: 20px;
  border: 1px solid rgba(0, 255, 136, 0.3);
  backdrop-filter: blur(20px);
  margin-bottom: 30px;
}

.instruction-box h3 {
  font-family: 'Space Grotesk', sans-serif;
  color: #00ff88;
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.instruction-box p {
  font-family: 'Space Grotesk', sans-serif;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin: 10px 0;
}

.start-btn {
  background: linear-gradient(135deg, #00ff88, #00cc6a);
  border: none;
  color: #000;
  padding: 20px 60px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  border-radius: 50px;
  transition: all 0.3s ease;
  box-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
}

.start-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 50px rgba(0, 255, 136, 0.8);
}

.level-complete {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: rgba(0, 0, 0, 0.9);
  padding: 50px 80px;
  border-radius: 30px;
  border: 2px solid #ffd700;
}

.level-complete h2 {
  font-family: 'Space Grotesk', sans-serif;
  color: #ffd700;
  font-size: 2.5rem;
  margin-bottom: 20px;
  animation: celebrate-glow 1s infinite;
}

@keyframes celebrate-glow {
  0%, 100% { text-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
  50% { text-shadow: 0 0 40px rgba(255, 215, 0, 1), 0 0 60px rgba(255, 215, 0, 0.6); }
}

.level-complete p {
  font-family: 'Space Grotesk', sans-serif;
  color: #fff;
  font-size: 1.5rem;
  margin-bottom: 30px;
}

.level-complete button {
  background: linear-gradient(135deg, #ff6b35, #ff4500);
  border: none;
  color: #fff;
  padding: 15px 40px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 30px;
}

.controls-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.controls-bottom button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 12px 24px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border-radius: 8px;
}

.controls-bottom button:hover, 
.controls-bottom button.active {
  background: rgba(0, 255, 136, 0.2);
  border-color: rgba(0, 255, 136, 0.6);
}

.level-buttons {
  display: flex;
  gap: 8px;
}

.level-buttons button {
  width: 45px;
  height: 45px;
  padding: 0;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 50%;
}

.level-buttons button.active {
  background: linear-gradient(135deg, #00ff88, #00cc6a);
  color: #000;
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.6);
}

.audio-visualizer {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 6px;
  align-items: flex-end;
  height: 80px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 15px;
  border: 1px solid rgba(0, 255, 136, 0.2);
}

.audio-visualizer .bar {
  width: 25px;
  background: linear-gradient(to top, #00ff88, #00ffcc, #ffd700);
  transition: height 0.05s ease;
  border-radius: 4px;
  min-height: 5px;
}
</style>
