<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

const en = ref<number | null>(null);
const uzunluq = ref<number | null>(null);
const qramaj = ref<number | null>(null); // Bu artıq hesabatdakı "Kalınlık (g/m²)"-dir
const say = ref<number | null>(null);
const alisQiymeti = ref<number | null>(null);
const satisQiymeti = ref<number | null>(null);
const hideBuyingPrice = ref(false); // Yeni: Alış qiymətini gizlətmək üçün
const showModal = ref(false);
const customerName = ref('');
const customerPhone = ref('');

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
  const sEn = localStorage.getItem('paper_en');
  const sUzun = localStorage.getItem('paper_uzunluq');
  const sQram = localStorage.getItem('paper_qramaj');
  const sSay = localStorage.getItem('paper_say');
  const sAlis = localStorage.getItem('paper_alis_qiymeti');
  const sSatis = localStorage.getItem('paper_satis_qiymeti');
  const sHide = localStorage.getItem('paper_hide_buying_price'); // Yeni
  const history = localStorage.getItem('paper_history');

  if (sEn) en.value = parseFloat(sEn);
  if (sUzun) uzunluq.value = parseFloat(sUzun);
  if (sQram) qramaj.value = parseFloat(sQram);
  if (sSay) say.value = parseFloat(sSay);
  if (sAlis) alisQiymeti.value = parseFloat(sAlis);
  if (sSatis) satisQiymeti.value = parseFloat(sSatis);
  if (sHide) hideBuyingPrice.value = sHide === 'true'; // Yeni
  if (history) savedEntries.value = JSON.parse(history);
});

watch([en, uzunluq, qramaj, say, alisQiymeti, satisQiymeti, hideBuyingPrice], () => {
  if (en.value !== null) localStorage.setItem('paper_en', en.value.toString());
  if (uzunluq.value !== null) localStorage.setItem('paper_uzunluq', uzunluq.value.toString());
  if (qramaj.value !== null) localStorage.setItem('paper_qramaj', qramaj.value.toString());
  if (say.value !== null) localStorage.setItem('paper_say', say.value.toString());
  if (alisQiymeti.value !== null) localStorage.setItem('paper_alis_qiymeti', alisQiymeti.value.toString());
  if (satisQiymeti.value !== null) localStorage.setItem('paper_satis_qiymeti', satisQiymeti.value.toString());
  localStorage.setItem('paper_hide_buying_price', hideBuyingPrice.value.toString()); // Yeni
});

// 1. Alan = (En × Uzunluk) / 10,000
const area = computed(() => {
  if (!en.value || !uzunluq.value) return 0;
  return (en.value * uzunluq.value) / 10000;
});

// 2. Tek yaprak ağırlığı = Alan × Kalınlık (g/m²)
const singleSheetWeight = computed(() => {
  if (!area.value || !qramaj.value) return 0;
  return area.value * qramaj.value;
});

// 3. Toplam ağırlık (kg) = (Tek yaprak ağırlığı × Adet) / 1000
const totalKilo = computed(() => {
  if (!singleSheetWeight.value || !say.value) return 0;
  return (singleSheetWeight.value * say.value) / 1000;
});

// 4. Maliyet = Toplam ağırlık × Kilo alış fiyatı
const totalCost = computed(() => {
  if (!totalKilo.value || !alisQiymeti.value) return 0;
  return totalKilo.value * alisQiymeti.value;
});

// 5. Menfaat (kâr) = Toplam ağırlık × (Kilo satış fiyatı – Kilo alış fiyatı)
const profit = computed(() => {
  if (!totalKilo.value || !satisQiymeti.value || !alisQiymeti.value) return 0;
  return totalKilo.value * (satisQiymeti.value - alisQiymeti.value);
});

const saveToHistory = () => {
  if (totalKilo.value === 0) return;
  showModal.value = true;
};

const confirmSave = () => {
  const newEntry: SavedPaperEntry = {
    id: Date.now(),
    date: new Date().toLocaleString('az-AZ', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
    en: en.value,
    uzunluq: uzunluq.value,
    qramaj: qramaj.value,
    say: say.value,
    alis: alisQiymeti.value,
    satis: satisQiymeti.value,
    singleWeight: singleSheetWeight.value.toFixed(2),
    totalKilo: totalKilo.value.toFixed(2),
    totalCost: totalCost.value.toFixed(2),
    profit: profit.value.toFixed(2),
    customerName: customerName.value,
    customerPhone: customerPhone.value
  };

  savedEntries.value.unshift(newEntry);
  localStorage.setItem('paper_history', JSON.stringify(savedEntries.value));
  
  showModal.value = false;
  customerName.value = '';
  customerPhone.value = '';
};
</script>

<template>
  <div class="page">
    <header class="hero">
      <h1 class="glow-text">Kağız Hesabla</h1>
    </header>

    <div class="content">
      <div class="glass-card">
        <div class="form-header">
          <div class="toggle-group">
            <div class="segmented-control">
              <button 
                type="button"
                class="segment-btn" 
                :class="{ active: !hideBuyingPrice }"
                @click="hideBuyingPrice = false"
                title="Göstər"
              >
                Bəli
              </button>
              <button 
                type="button"
                class="segment-btn" 
                :class="{ active: hideBuyingPrice }"
                @click="hideBuyingPrice = true"
                title="Gizlə"
              >
                Xeyr
              </button>
              <div class="selection-slider" :class="{ 'slide-right': hideBuyingPrice }"></div>
            </div>
          </div>
        </div>

        <div class="input-grid">
          <div class="input-group">
            <label>En (sm)</label>
            <input type="number" v-model="en" placeholder="En daxil edin">
          </div>
          <div class="input-group">
            <label>Uzunluq (sm)</label>
            <input type="number" v-model="uzunluq" placeholder="Uzunluq daxil edin">
          </div>
          <div class="input-group">
            <label>Qalınlıq (qr/m²)</label>
            <input type="number" v-model="qramaj" placeholder="Məsələn: 80">
          </div>
          <div class="input-group">
            <label>Adət (Say)</label>
            <input type="number" v-model="say" placeholder="Say daxil edin">
          </div>
          <div class="input-group" v-if="!hideBuyingPrice">
            <label>Kilo Alış Qiyməti (₼)</label>
            <input type="number" v-model="alisQiymeti" placeholder="Alış qiyməti" step="0.01">
          </div>
          <div class="input-group">
            <label>Kilo Satış Qiyməti (₼)</label>
            <input type="number" v-model="satisQiymeti" placeholder="Satış qiyməti" step="0.01">
          </div>
        </div>

        <div class="result-box" v-if="totalKilo > 0">
          <div class="result-grid">
            <div class="result-item">
              <span class="result-label">Tək yarpaq qramı</span>
              <div class="result-value secondary">{{ singleSheetWeight.toFixed(2) }} q</div>
            </div>
            <div class="result-item">
              <span class="result-label">Toplam çəki (kq)</span>
              <div class="result-value">{{ totalKilo.toFixed(2) }} kq</div>
            </div>
            <div class="result-item" v-if="!hideBuyingPrice">
              <span class="result-label">Toplam maliyyət</span>
              <div class="result-value secondary">{{ totalCost.toFixed(2) }} ₼</div>
            </div>
            <div class="result-item" v-if="!hideBuyingPrice">
              <span class="result-label">Toplam mənfəət</span>
              <div class="result-value highlight" :class="{ 'negative': profit < 0 }">{{ profit.toFixed(2) }} ₼</div>
            </div>
          </div>

          <button class="save-btn" @click="saveToHistory">
            <span class="btn-text">Yaddaşa Ver</span>
            <div class="btn-glow"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
        <div class="modal-content glass-card">
          <h3 class="modal-title">Müştəri Məlumatları</h3>
          <div class="modal-form">
            <div class="input-group">
              <label>Müştəri Adı</label>
              <input type="text" v-model="customerName" placeholder="Ad daxil edin">
            </div>
            <div class="input-group">
              <label>Nömrəsi</label>
              <input type="text" v-model="customerPhone" placeholder="050 000 00 00">
            </div>
            <div class="modal-actions">
              <button class="cancel-btn" @click="showModal = false">Ləğv et</button>
              <button class="confirm-btn" @click="confirmSave">Yadda saxla</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
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
  margin-bottom: 0.5rem;
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

.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3rem;
  border-radius: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.form-header {
  margin-bottom: 3rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.toggle-group {
  display: flex;
  align-items: center;
  gap: 2rem;
  justify-content: center;
}

.segmented-control {
  position: relative;
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  padding: 4px;
  width: 200px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.segment-btn {
  flex: 1;
  border: none;
  background: none;
  color: #94a3b8;
  padding: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease;
}

.segment-btn.active {
  color: white;
}

.selection-slider {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
  background: linear-gradient(135deg, #22c55e 0%, #166534 100%);
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
}

.selection-slider.slide-right {
  transform: translateX(100%);
  background: linear-gradient(135deg, #ef4444 0%, #991b1b 100%);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
}

.input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.input-group label {
  color: #94a3b8;
  font-size: 0.9rem;
  padding-left: 0.5rem;
}

input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.2rem 1.5rem;
  color: white;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.2);
}

.result-box {
  margin-top: 4rem;
  text-align: center;
  padding: 2.5rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: 24px;
  border: 1px solid rgba(118, 75, 162, 0.2);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem;
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-label {
  display: block;
  color: #a5b4fc;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
}

.result-value {
  font-size: 2.5rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 0 20px rgba(165, 180, 252, 0.4);
}

.result-value.secondary {
  font-size: 1.8rem;
  color: #cbd5e1;
  text-shadow: none;
}

.result-value.highlight {
  color: #38ef7d;
  text-shadow: 0 0 15px rgba(56, 239, 125, 0.4);
}

.result-value.negative {
  color: #ef4444;
  text-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
}

.save-btn {
  margin-top: 1rem;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: #667eea;
  transform: translateY(-2px);
}

/* Modal */
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  z-index: 2000; padding: 1.5rem;
}

.modal-content { width: 100%; max-width: 450px; padding: 2.5rem; border: 1px solid rgba(102, 126, 234, 0.2); }
.modal-title { color: #a5b4fc; font-size: 1.5rem; margin-bottom: 2rem; text-align: center; font-weight: 700; }
.modal-form { display: flex; flex-direction: column; gap: 1.5rem; }
.modal-actions { display: flex; gap: 1rem; margin-top: 1rem; }
.modal-actions button { flex: 1; padding: 1rem; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
.cancel-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; }
.confirm-btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; color: white; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .modal-content { transform: scale(0.9); }

@media (max-width: 640px) {
  .page { padding: 0.5rem 1rem; }
  .glow-text { font-size: 2rem; }
  .glass-card { padding: 1.5rem 1rem; border-radius: 20px; }
  .result-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .result-value { font-size: 2.2rem; }
  .result-value.secondary { font-size: 1.5rem; }
}
</style>
