<template>
  <div class="about-page">
    <h1>About CalculateWith</h1>
    <div class="glass-card">
      <p>This is a premium Vue 3 template designed for scalability and performance.</p>
      <ul class="features">
        <li>✨ TypeScript for type safety</li>
        <li>🚀 Vite for lightning fast development</li>
        <li>🎨 Modern CSS with Glassmorphism</li>
        <li>🏗️ Professional Folder Structure</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  padding: 4rem 2rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #2d3748;
}

.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 3rem;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
}

.features {
  list-style: none;
  padding: 0;
  margin-top: 2rem;
  text-align: left;
  display: inline-block;
}

.features li {
  margin: 1rem 0;
  font-size: 1.1rem;
  color: #4a5568;
}
@media (max-width: 768px) {
  .about-page {
    padding: 2rem 1rem;
  }

  h1 {
    font-size: 1.8rem;
  }

  .glass-card {
    padding: 1.5rem;
  }

  .features li {
    font-size: 1rem;
  }
}
</style>
