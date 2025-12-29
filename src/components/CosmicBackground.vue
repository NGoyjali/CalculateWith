<script setup lang="ts">
const getRandomStarStyle = () => {
  const size = Math.random() * 3 + 1 + 'px'; // Biraz daha böyük
  const duration = Math.random() * 20 + 10 + 's';
  const delay = Math.random() * -20 + 's';
  
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    width: size,
    height: size,
    '--move-duration': duration,
    '--move-delay': delay,
    '--twinkle-duration': (Math.random() * 2 + 1) + 's',
    '--dest-x': (Math.random() * 300 - 150) + 'px',
    '--dest-y': (Math.random() * 300 - 150) + 'px'
  };
};

const getRandomShootingStarStyle = () => {
  return {
    top: Math.random() * 50 + '%',
    left: Math.random() * 100 + '%',
    animationDelay: Math.random() * 20 + 's',
    animationDuration: (Math.random() * 4 + 3) + 's' // Sürət yarıya endirildi (əvvəl 2+1.5 idi)
  };
};
</script>

<template>
  <div class="cosmic-container">
    <div class="cosmic-bg"></div>
    <div v-for="n in 250" :key="'ls'+n" class="star" :style="getRandomStarStyle()"></div>
    <div v-for="n in 10" :key="'lss'+n" class="shooting-star" :style="getRandomShootingStarStyle()"></div>
  </div>
</template>

<style scoped>
.cosmic-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.cosmic-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, #1b2735 0%, #090a0f 100%);
  z-index: -2;
}

.star {
  position: absolute;
  background-color: #ffffff;
  border-radius: 50%;
  opacity: 1;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  z-index: -1;
  animation: 
    twinkle var(--twinkle-duration) infinite ease-in-out,
    move-star var(--move-duration) infinite linear;
  animation-delay: var(--move-delay);
}

.shooting-star {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #ffffff;
  border-radius: 50%;
  opacity: 0;
  z-index: -1;
  animation: shoot 10s infinite; /* Döngü müddəti 6s-dan 10s-a qaldırıldı */
}

.shooting-star::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 180px;
  height: 2px;
  background: linear-gradient(to left, rgba(255, 255, 255, 0.8), transparent);
}

@keyframes shoot {
  0% { transform: translate(0, 0) rotate(-45deg); opacity: 0; }
  5% { opacity: 1; }
  20% { transform: translate(-800px, 800px) rotate(-45deg); opacity: 0; }
  100% { transform: translate(-800px, 800px) rotate(-45deg); opacity: 0; }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.4); }
}

@keyframes move-star {
  from { transform: translate(0, 0); }
  to { transform: translate(var(--dest-x), var(--dest-y)); }
}
</style>
