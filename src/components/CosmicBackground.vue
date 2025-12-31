<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const canvasRef = ref<HTMLCanvasElement | null>(null);

interface Star {
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  twinklePhase: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  range: number;
}

const stars: Star[] = [];
const STAR_COUNT = 125; // 150-dən 125-ə endirildi (1/6 azaltıldı)
const CONNECTION_DISTANCE = 200; // Məsafə artırıldı (150-dən 200-ə)

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const initStars = () => {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      stars.push({
        x: x,
        y: y,
        baseX: x,
        baseY: y,
        size: Math.random() * 3 + 1, // Ölçü böyüdüldü (0.5-2.5-dən 1-4-ə)
        twinkleSpeed: 0.01 + Math.random() * 0.02, // Bir az daha yavaş parıltı
        twinklePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        range: 50 + Math.random() * 100
      });
    }
  };

  let animationFrame: number;
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Ulduzları yenilə və çək
    stars.forEach(star => {
      star.twinklePhase += star.twinkleSpeed;
      const opacity = (Math.sin(star.twinklePhase) + 1) / 2; // 0-1 arası
      
      // Hərəkət
      star.x += star.vx;
      star.y += star.vy;
      
      // Sərhədlərdən qayıtma və ya yenidən yaranma
      if (star.x < 0) star.x = canvas.width;
      if (star.x > canvas.width) star.x = 0;
      if (star.y < 0) star.y = canvas.height;
      if (star.y > canvas.height) star.y = 0;

      // Parıltı effekti
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * (0.8 + opacity * 0.4), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + opacity * 0.7})`;
      ctx.shadowBlur = opacity * 10;
      ctx.shadowColor = 'white';
      ctx.fill();
    });

    // Toqquşma (collision) tespiti ve həlli
    for (let i = 0; i < stars.length; i++) {
      const s1 = stars[i];
      if (!s1) continue;
      
      for (let j = i + 1; j < stars.length; j++) {
        const s2 = stars[j];
        if (!s2) continue;
        
        const dx = s2.x - s1.x;
        const dy = s2.y - s1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = s1.size + s2.size;

        if (distance < minDistance) {
          // Toqquşma baş verdi - sürətlərin dəyişdirilməsi (bounce effect)
          const angle = Math.atan2(dy, dx);
          const sin = Math.sin(angle);
          const cos = Math.cos(angle);

          // Mövqeləri bir-birindən ayır (yapışmamaq üçün)
          const overlap = minDistance - distance;
          const separationX = (overlap / 2) * cos;
          const separationY = (overlap / 2) * sin;
          
          s1.x -= separationX;
          s1.y -= separationY;
          s2.x += separationX;
          s2.y += separationY;

          // Sürətləri əks istiqamətə çevir
          const vx1 = s1.vx * cos + s1.vy * sin;
          const vy1 = s1.vy * cos - s1.vx * sin;
          const vx2 = s2.vx * cos + s2.vy * sin;
          const vy2 = s2.vy * cos - s2.vx * sin;

          s1.vx = vx2 * cos - vy1 * sin;
          s1.vy = vy1 * cos + vx2 * sin;
          s2.vx = vx1 * cos - vy2 * sin;
          s2.vy = vy2 * cos + vx1 * sin;
        }
      }
    }

    // Ulduz topaları (constellations)
    ctx.shadowBlur = 0;
    for (let i = 0; i < stars.length; i++) {
      const s1 = stars[i];
      if (!s1) continue;
      const opacity1 = (Math.sin(s1.twinklePhase) + 1) / 2;
      
      if (opacity1 > 0.6) {
        for (let j = i + 1; j < stars.length; j++) {
          const s2 = stars[j];
          if (!s2) continue;
          const opacity2 = (Math.sin(s2.twinklePhase) + 1) / 2;
          
          if (opacity2 > 0.6) {
            const dx = s1.x - s2.x;
            const dy = s1.y - s2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < CONNECTION_DISTANCE * CONNECTION_DISTANCE) {
              const dist = Math.sqrt(distSq);
              const lineOpacity = (1 - dist / CONNECTION_DISTANCE) * (opacity1 + opacity2 - 1.2) * 1.5;
              if (lineOpacity > 0) {
                ctx.beginPath();
                ctx.moveTo(s1.x, s1.y);
                ctx.lineTo(s2.x, s2.y);
                ctx.strokeStyle = `rgba(165, 180, 252, ${lineOpacity * 0.6})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
              }
            }
          }
        }
      }
    }

    animationFrame = requestAnimationFrame(animate);
  };

  window.addEventListener('resize', resize);
  resize();
  initStars();
  animate();

  onUnmounted(() => {
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(animationFrame);
  });
});
</script>

<template>
  <div class="cosmic-container">
    <div class="cosmic-bg"></div>
    <canvas ref="canvasRef"></canvas>
    <div v-for="n in 5" :key="'lss'+n" class="shooting-star" :style="{
      top: Math.random() * 50 + '%',
      left: Math.random() * 100 + '%',
      animationDelay: Math.random() * 20 + 's',
      animationDuration: (Math.random() * 4 + 3) + 's'
    }"></div>
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

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.shooting-star {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #ffffff;
  border-radius: 50%;
  opacity: 0;
  z-index: -1;
  animation: shoot 10s infinite;
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
</style>
