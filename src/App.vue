<script setup lang="ts">
import { ref } from 'vue';
import Navbar from './components/Navbar.vue';
import CosmicBackground from './components/CosmicBackground.vue';

const isMobileMenuOpen = ref(false);
</script>

<template>
  <div class="app-container">
    <CosmicBackground />
    <Navbar @toggle-menu="isMobileMenuOpen = $event" />
    <main class="main-content" :class="{ 'menu-open': isMobileMenuOpen }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer class="footer">
      <p>&copy; 2024 CalculateWith. Bütün hüquqlar qorunur.</p>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap');

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
  background-color: #090a0f;
}

body {
  min-height: 100vh;
  color-scheme: dark;
  color: rgba(255, 255, 255, 0.9);
}

.app-container {
  position: relative;
  z-index: 1; /* Məzmunu ulduzların önünə çıxarır */
}

#app {
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.main-content {
  min-height: calc(100vh - 120px);
  transition: transform 0.3s ease;
  padding-top: 0;
  margin-top: 0;
}

.main-content.menu-open {
  transform: translateY(200px);
}

.footer {
  text-align: center;
  padding: 2rem;
  color: #4a5568;
  font-size: 0.9rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

@media (max-width: 768px) {
  .main-content {
    padding-top: 0;
  }
}
</style>
