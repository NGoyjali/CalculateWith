<script setup lang="ts">
import { ref } from 'vue';

const isMenuOpen = ref(false);
const emit = defineEmits(['toggle-menu']);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  emit('toggle-menu', isMenuOpen.value);
};

const closeMenu = () => {
  isMenuOpen.value = false;
  emit('toggle-menu', false);
};
</script>

<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="logo" @click="closeMenu">EngSoft</router-link>
      
      <button class="menu-toggle" @click="toggleMenu" :class="{ 'active': isMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div class="nav-links" :class="{ 'open': isMenuOpen }">
        <router-link to="/paper" class="nav-item" @click="closeMenu">Kağız</router-link>
        <router-link to="/polymer" class="nav-item" @click="closeMenu">Polimer</router-link>
        <router-link to="/paper-history" class="nav-item" @click="closeMenu">Kağız Cədvəli</router-link>
        <router-link to="/polymer-history" class="nav-item" @click="closeMenu">Polimer Cədvəli</router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: rgba(10, 11, 15, 0.7);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  /* Premium dumanlı kölgə və xəfif parıltı əlavə edildi */
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.6),
    0 0 15px rgba(165, 180, 252, 0.05);
}

.nav-container {
  width: 100%; /* Səhifəni tam doldurması üçün */
  padding: 1rem 2.5rem; /* Kənarlardan çox sıxışmaması üçün kiçik boşluq */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
  filter: drop-shadow(0 0 8px rgba(165, 180, 252, 0.3));
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-item {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-item:hover, .router-link-active {
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.menu-toggle span {
  display: block;
  width: 25px;
  height: 2px;
  background-color: #fff;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 1rem 1rem; /* Mobildə kənar boşluqları azaltdıq */
  }

  .logo {
    font-size: 1.3rem; /* Mobildə loqonu daha yığcam etdik */
  }

  .menu-toggle {
    display: flex;
  }

  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(9, 10, 15, 0.98); /* Daha qatı fon */
    backdrop-filter: blur(20px);
    flex-direction: column;
    padding: 2.5rem 1.5rem;
    gap: 1.5rem;
    text-align: center;
    box-shadow: 0 15px 30px rgba(0,0,0,0.8);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-20px);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .nav-item {
    font-size: 1.4rem; /* Mobildə menu elementlərini daha oxunaqlı etdik */
    padding: 1rem;
    width: 100%;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.03);
  }

  .nav-links.open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .menu-toggle.active span:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }

  .menu-toggle.active span:nth-child(2) {
    opacity: 0;
  }

  .menu-toggle.active span:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }
}
</style>
