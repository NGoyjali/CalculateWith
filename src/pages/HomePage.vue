<template>
  <div class="home-page">
    <header class="hero">
      <div class="cosmic-content">
        <h2 class="glow-text">EngSoft</h2>
        <p>Gələcəyin hesablamaları üçün modern həllər</p>
        <div class="cta-buttons">
          <button @click="router.push('/paper')" class="cta-btn paper">
            <span>Kağız</span>
            <div class="btn-glow"></div>
          </button>
          <button @click="router.push('/polymer')" class="cta-btn polymer">
            <span>Polimer</span>
            <div class="btn-glow"></div>
          </button>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<style scoped>
.home-page {
  position: relative;
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 2rem;
  overflow: hidden;
  color: white;
}

.hero {
  z-index: 10;
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 40px;
  max-width: 1000px; /* Genişlik 600px-dən 1000px-ə qaldırıldı */
  width: 95%; /* 90%-dən 95%-ə qaldırıldı */
  /* Daha dərin kölgə əlavə edildi */
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.8),
    0 0 40px rgba(165, 180, 252, 0.1);
}

.glow-text {
  font-size: 4rem;
  font-weight: 800;
  background: linear-gradient(to right, #fff, #a5b4fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 10px rgba(165, 180, 252, 0.3));
}

.hero p {
  font-size: 1.2rem;
  color: #94a3b8;
  margin-bottom: 3rem;
}

.cta-buttons {
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.cta-btn {
  position: relative;
  padding: 1.2rem 3rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cta-btn span {
  position: relative;
  z-index: 2;
}

.btn-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 140%;
  height: 140%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%);
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.5s ease;
  z-index: 1;
}

.cta-btn:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 30px -10px rgba(99, 102, 241, 0.5);
}

.cta-btn:hover .btn-glow {
  transform: translate(-50%, -50%) scale(1);
}

.cta-btn.paper:hover {
  background: rgba(99, 102, 241, 0.1);
}

.cta-btn.polymer:hover {
  background: rgba(16, 185, 129, 0.1);
}

@media (max-width: 640px) {
  .glow-text {
    font-size: 2.5rem;
  }
  .cta-buttons {
    flex-direction: column;
    gap: 1rem;
  }
  .hero {
    padding: 3rem 1.5rem;
  }
}
</style>
