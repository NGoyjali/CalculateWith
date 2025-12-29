<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

interface SavedPaperEntry {
  id: number;
  date: string;
  en: number | null;
  uzunluq: number | null;
  qramaj: number | null;
  say: number | null;
  alis: number | null;
  satis: number | null;
  singleWeight: string;
  totalKilo: string;
  totalCost: string;
  profit: string;
  customerName: string;
  customerPhone: string;
}

const savedEntries = ref<SavedPaperEntry[]>([]);

onMounted(() => {
  const history = localStorage.getItem('paper_history');
  if (history) {
    savedEntries.value = JSON.parse(history);
  }
});

const deleteEntry = (id: number) => {
  savedEntries.value = savedEntries.value.filter(entry => entry.id !== id);
  localStorage.setItem('paper_history', JSON.stringify(savedEntries.value));
};

const totalKiloSum = computed(() => {
  return savedEntries.value.reduce((acc, entry) => acc + parseFloat(entry.totalKilo || '0'), 0);
});

const totalCostSum = computed(() => {
  return savedEntries.value.reduce((acc, entry) => acc + parseFloat(entry.totalCost || '0'), 0);
});

const totalProfitSum = computed(() => {
  return savedEntries.value.reduce((acc, entry) => acc + parseFloat(entry.profit || '0'), 0);
});
</script>

<template>
  <div class="page">
    <header class="hero">
      <h1 class="glow-text">Kağız Cədvəli</h1>
    </header>

    <div class="content">
      <div class="history-section" v-if="savedEntries.length > 0">
        <div class="table-container">
          <table class="history-table">
            <thead>
              <tr>
                <th>Tarix</th>
                <th>Müştəri / Nömrə</th>
                <th>Ölçü (sm)</th>
                <th>Qalınlıq / Say</th>
                <th>Tək / Toplam Çəki</th>
                <th>Maliyyət / Mənfəət</th>
                <th>Sil</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="entry in savedEntries" :key="entry.id">
                <td class="date-cell">{{ entry.date }}</td>
                <td class="customer-cell">
                  <div class="name">{{ entry.customerName || 'Adsız' }}</div>
                  <div class="phone">{{ entry.customerPhone || '---' }}</div>
                </td>
                <td>{{ entry.en }}x{{ entry.uzunluq }}</td>
                <td>
                  <div>{{ entry.qramaj }} qr/m²</div>
                  <div style="font-size: 0.8rem; color: #94a3b8;">{{ entry.say }} ədəd</div>
                </td>
                <td>
                  <div class="total-cell">{{ entry.totalKilo }} kq</div>
                  <div style="font-size: 0.8rem; color: #94a3b8;">{{ entry.singleWeight }} q (tək)</div>
                </td>
                <td>
                  <div class="total-cell">{{ entry.totalCost }} ₼</div>
                  <div :class="{ 'positive': parseFloat(entry.profit) > 0, 'negative': parseFloat(entry.profit) < 0 }" style="font-size: 0.8rem;">
                    {{ entry.profit }} ₼ (mənfəət)
                  </div>
                </td>
                <td>
                  <button class="delete-btn" @click="deleteEntry(entry.id)" title="Sil">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot class="table-footer">
              <tr>
                <td colspan="4" class="footer-label">TOPLAM</td>
                <td class="footer-value">{{ totalKiloSum.toFixed(2) }} kq</td>
                <td class="footer-value">
                  <div>{{ totalCostSum.toFixed(2) }} ₼</div>
                  <div :class="{ 'positive': totalProfitSum > 0, 'negative': totalProfitSum < 0 }" style="font-size: 0.8rem;">
                    {{ totalProfitSum.toFixed(2) }} ₼ (mənfəət)
                  </div>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div class="empty-state" v-else>
        <p>Hələ ki, heç bir məlumat yadda saxlanılmayıb.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 0 2rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

.hero {
  text-align: center;
  margin-bottom: 2rem;
  padding-top: 1rem;
}

.glow-text {
  margin-top: 0;
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 0 10px rgba(118, 75, 162, 0.3));
}

.history-section {
  padding-bottom: 4rem;
}

.table-container {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow-x: auto;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  color: #cbd5e1;
  text-align: left;
  min-width: 800px;
}

.history-table th {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.2rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #a5b4fc;
}

.history-table td {
  padding: 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  font-size: 1rem;
}

.date-cell { font-size: 0.8rem; color: #94a3b8; }

.customer-cell .name { color: white; font-weight: 600; font-size: 0.95rem; }
.customer-cell .phone { color: #64748b; font-size: 0.8rem; margin-top: 0.2rem; }

.total-cell { font-weight: 700; color: white; }

.positive { color: #38ef7d; font-weight: 600; }
.negative { color: #ef4444; font-weight: 600; }

.delete-btn {
  background: rgba(239, 68, 68, 0.1); border: none; color: #ef4444;
  padding: 0.5rem; border-radius: 8px; cursor: pointer; transition: all 0.2s ease;
  display: flex; align-items: center; justify-content: center;
}
.delete-btn:hover { background: #ef4444; color: white; transform: scale(1.1); }

.table-footer {
  background: rgba(255, 255, 255, 0.05);
  border-top: 2px solid rgba(165, 180, 252, 0.2);
}

.footer-label {
  text-align: right;
  font-weight: 800;
  letter-spacing: 2px;
  color: #a5b4fc;
  padding-right: 2rem !important;
}

.footer-value {
  font-weight: 800;
  color: white;
  font-size: 1.1rem !important;
}

.empty-state {
  text-align: center; color: #94a3b8; padding: 4rem;
  background: rgba(255, 255, 255, 0.02); border-radius: 20px; border: 1px dashed rgba(255, 255, 255, 0.1);
}

@media (max-width: 640px) {
  .page { padding: 0.5rem 1rem; }
  .glow-text { font-size: 2rem; }
  .history-table th, .history-table td { padding: 0.8rem; font-size: 0.85rem; }
}
</style>
