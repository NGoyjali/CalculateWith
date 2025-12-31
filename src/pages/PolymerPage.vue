<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

const alisKiloQiymet = ref<number | null>(null);
const satisQiymeti = ref<number | null>(null);
const satisKilo = ref<number | null>(null);
const adetAgirligi = ref<number | null>(null);
const adet = ref<number | null>(null);
const isKiloFocused = ref(false);
const hideBuyingPrice = ref(false);

interface SavedEntry {
  id: number;
  date: string;
  alis: number | null;
  satis: number | null;
  miqdar: number | null;
  totalSale: number;
  profit: string;
  customerName: string;
  customerPhone: string;
}

const savedEntries = ref<SavedEntry[]>([]);
const showModal = ref(false);
const customerName = ref('');
const customerPhone = ref('');

// Məlumatları bərpa etmək
onMounted(() => {
  const savedAlis = localStorage.getItem('polymer_alis_kilo_qiymet');
  const savedSatisQiymet = localStorage.getItem('polymer_satis_qiymeti');
  const savedSatisKilo = localStorage.getItem('polymer_satis_kilo');
  const savedAdetAgirligi = localStorage.getItem('polymer_adet_agirligi');
  const savedAdet = localStorage.getItem('polymer_adet');
  const savedHide = localStorage.getItem('polymer_hide_buying_price');
  const history = localStorage.getItem('polymer_history');

  if (savedAlis) alisKiloQiymet.value = parseFloat(savedAlis);
  if (savedSatisQiymet) satisQiymeti.value = parseFloat(savedSatisQiymet);
  if (savedSatisKilo) satisKilo.value = parseFloat(savedSatisKilo);
  if (savedAdetAgirligi) adetAgirligi.value = parseFloat(savedAdetAgirligi);
  if (savedAdet) adet.value = parseFloat(savedAdet);
  if (savedHide) hideBuyingPrice.value = savedHide === 'true';
  if (history) savedEntries.value = JSON.parse(history);
});

// Məlumatları yaddaşa yazmaq (Müvəqqəti daxiletmələr)
watch([alisKiloQiymet, satisQiymeti, satisKilo, adetAgirligi, adet, hideBuyingPrice], () => {
  if (alisKiloQiymet.value !== null) localStorage.setItem('polymer_alis_kilo_qiymet', alisKiloQiymet.value.toString());
  if (satisQiymeti.value !== null) localStorage.setItem('polymer_satis_qiymeti', satisQiymeti.value.toString());
  if (satisKilo.value !== null) localStorage.setItem('polymer_satis_kilo', satisKilo.value.toString());
  if (adetAgirligi.value !== null) localStorage.setItem('polymer_adet_agirligi', adetAgirligi.value.toString());
  if (adet.value !== null) localStorage.setItem('polymer_adet', adet.value.toString());
  localStorage.setItem('polymer_hide_buying_price', hideBuyingPrice.value.toString());
});

// 1. Satış kq və ya Ədəd çəkisi dəyişdikdə -> Ədəd hesablanır
watch([satisKilo, adetAgirligi], ([newKilo, newGram], [oldKilo, oldGram]) => {
  // Yalnız satisKilo və ya adetAgirligi əllə dəyişdirildikdə Ədədi yenilə
  if (newKilo !== oldKilo || newGram !== oldGram) {
    if (newKilo && newGram && newGram > 0) {
      const calculatedAdet = Math.round((newKilo * 1000) / newGram);
      if (adet.value !== calculatedAdet) {
        adet.value = calculatedAdet;
      }
    } else if (!newGram || newGram === 0) {
      adet.value = null;
    }
  }
});

// 2. Ədəd dəyişdikdə -> Satış kq hesablanır (Əgər Satış kq fokusda deyilsə)
watch(adet, (newAdet, oldAdet) => {
  if (!isKiloFocused.value && newAdet !== oldAdet && newAdet && adetAgirligi.value) {
    const calculatedKilo = (newAdet * adetAgirligi.value) / 1000;
    if (Math.abs((satisKilo.value || 0) - calculatedKilo) > 0.0001) {
      satisKilo.value = calculatedKilo;
    }
  }
});


const effectiveKilo = computed(() => {
  return satisKilo.value || 0;
});

const totalBuy = computed(() => {
  if (alisKiloQiymet.value === null || effectiveKilo.value === 0) return 0;
  return alisKiloQiymet.value * effectiveKilo.value;
});

const totalSale = computed(() => {
  if (satisQiymeti.value === null || effectiveKilo.value === 0) return 0;
  return satisQiymeti.value * effectiveKilo.value;
});

const profit = computed(() => {
  const diff = (totalSale.value || 0) - (totalBuy.value || 0);
  return diff.toFixed(2);
});

const saveToHistory = () => {
  if (totalSale.value === 0) return;
  showModal.value = true;
};

const confirmSave = () => {
  const newEntry: SavedEntry = {
    id: Date.now(),
    date: new Date().toLocaleString('az-AZ', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
    alis: alisKiloQiymet.value, // Həmişə yadda saxla, gizli olsa belə
    satis: satisQiymeti.value,
    miqdar: effectiveKilo.value,
    totalSale: totalSale.value,
    profit: profit.value.toString(),
    customerName: customerName.value,
    customerPhone: customerPhone.value
  };

  savedEntries.value.unshift(newEntry);
  localStorage.setItem('polymer_history', JSON.stringify(savedEntries.value));
  
  // Reset and close
  showModal.value = false;
  customerName.value = '';
  customerPhone.value = '';
};
</script>

<template>
  <div class="page">
    <header class="hero">
      <h1 class="glow-text">Polimer Hesabla</h1>
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
          <div class="input-group" v-if="!hideBuyingPrice">
            <label>Alış kilo qiyməti (₼)</label>
            <input 
              type="number" 
              v-model="alisKiloQiymet" 
              placeholder="Məsələn: 2.50"
              step="0.01"
            >
          </div>

          <div class="input-group">
            <label>Satış kilo qiyməti (₼)</label>
            <input 
              type="number" 
              v-model="satisQiymeti" 
              placeholder="Məsələn: 3.20"
              step="0.01"
            >
          </div>

          <div class="input-group">
            <label>Satış (kq)</label>
            <input 
              type="number" 
              v-model="satisKilo" 
              placeholder="Məsələn: 100"
              step="0.001"
              @focus="isKiloFocused = true"
              @blur="isKiloFocused = false"
            >
          </div>

          <div class="input-group">
            <label>Ədəd çəkisi (qr)</label>
            <input 
              type="number" 
              v-model="adetAgirligi" 
              placeholder="Məsələn: 25"
            >
          </div>

          <div class="input-group">
            <label>Ədəd</label>
            <input 
              type="number" 
              v-model="adet" 
              placeholder="Məsələn: 1000"
            >
          </div>
        </div>

        <div class="result-box">
          <div class="result-row">
            <span class="result-label">Ümumi Satış</span>
            <div class="result-value">{{ (totalSale || 0).toFixed(2) }} ₼</div>
          </div>
          
          <div class="result-row profit-row" v-if="!hideBuyingPrice">
            <span class="result-label small">Xalis Mənfəət</span>
            <div class="result-value small" :class="{ 'negative': parseFloat(profit) < 0 }">
              {{ profit || '0.00' }} ₼
            </div>
          </div>

          <button class="save-btn" @click="saveToHistory">
            <span class="btn-text">Yaddaşa Ver</span>
            <div class="btn-glow"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Müştəri Məlumatları Modalı -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
        <div class="modal-content glass-card">
          <h3 class="modal-title">Müştəri Məlumatları</h3>
          
          <div class="modal-form">
            <div class="input-group">
              <label>Müştəri Adı</label>
              <input 
                type="text" 
                v-model="customerName" 
                placeholder="Ad daxil edin"
              >
            </div>
            
            <div class="input-group">
              <label>Nömrəsi</label>
              <input 
                type="text" 
                v-model="customerPhone" 
                placeholder="Məsələn: 050 000 00 00"
              >
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
/* Layout & Basics */
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
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 0 10px rgba(56, 239, 125, 0.3));
}

/* Card & Form */
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
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
  border-color: #38ef7d;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 20px rgba(56, 239, 125, 0.2);
}

/* Results Section */
.result-box {
  margin-top: 4rem;
  text-align: center;
  padding: 2.5rem;
  background: linear-gradient(135deg, rgba(17, 153, 142, 0.1), rgba(56, 239, 125, 0.1));
  border-radius: 24px;
  border: 1px solid rgba(56, 239, 125, 0.2);
  animation: slideUp 0.5s ease-out;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.result-row {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profit-row {
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.result-label {
  display: block;
  color: #38ef7d;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.result-label.small {
  font-size: 0.75rem;
  color: #94a3b8;
}

.result-value {
  font-size: 3.5rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 0 20px rgba(56, 239, 125, 0.4);
}

.result-value.small {
  font-size: 2rem;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}

.result-value.negative {
  color: #ef4444;
  text-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
}

.save-btn {
  margin-top: 1rem;
  position: relative;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}

.save-btn:hover {
  background: rgba(56, 239, 125, 0.2);
  border-color: #38ef7d;
  transform: translateY(-2px);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1.5rem;
}

.modal-content {
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
  border: 1px solid rgba(56, 239, 125, 0.2);
}

.modal-title {
  color: #38ef7d;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 700;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.modal-actions button {
  flex: 1;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.confirm-btn {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  border: none;
  color: white;
  box-shadow: 0 4px 15px rgba(56, 239, 125, 0.3);
}

.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(56, 239, 125, 0.5);
}

/* Animations */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-content {
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 640px) {
  .page { 
    padding: 0.5rem 1rem; 
  }
  
  .glow-text {
    font-size: 2rem;
  }

  .glass-card { 
    padding: 1.5rem 1rem; 
    border-radius: 20px;
  }

  .segmented-control {
    width: 100%;
  }

  .result-value { 
    font-size: 2.2rem; 
  }

  .result-value.small {
    font-size: 1.6rem;
  }
}
</style>
