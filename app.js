// === CONFIG ===
// Nomor WA (format internasional tanpa '+')
const WA_PHONE = '6282118102921';

// Default warna jika model tidak mendefinisikan sendiri
const WARNA_LIST_DEFAULT = ['Biru', 'Merah', 'Hitam', 'Putih', 'Orange', 'Abu', 'Lime'];
const WARNA_KEY = { Biru:'blue', Merah:'red', Hitam:'black', Putih:'white', Orange:'orange' };

/* ===========================
   MODEL PER PRODUK (bebas beda warna)
   - colors: daftar warna tersedia
   - images: mapping warna -> file gambar (opsional)
   - img   : gambar default
   =========================== */
const MODELS = [
  {
    slug: 'brio', nama: 'New Brio', startFrom: 'Rp 184.000.000', tag: 'city', img: 'assets/brio.png',
    colors: ['Hitam','Orange','Putih','Lime','Abu','Merah'],
    images: { Merah:'assets/brio-red.png', Orange:'assets/brio-orange.png', Hitam:'assets/brio-black.png', Putih:'assets/brio-white.png', Lime:'assets/brio-lime.png', Abu:'assets/brio-gray.png' }
  },
  {
    slug: 'wrv', nama: 'All New WR-V', startFrom: 'Rp 286.900.000', tag: 'suv', img: 'assets/wrv.png',
    colors: ['Hitam','Putih','Merah','Abu'],
    images: { Hitam:'assets/wrv-black.png', Putih:'assets/wrv-white.png', Merah:'assets/wrv-red.png', Abu:'assets/wrv-gray.png' }
  },
  {
    slug: 'brv', nama: 'All New BR-V', startFrom: 'Rp 311.900.000', tag: 'suv', img: 'assets/brv.png',
    colors: ['Hitam','Putih','Abu','Sand'],
    images: { Hitam:'assets/brv-black.png', Putih:'assets/brv-white.png', Abu:'assets/brv-gray.png', Sand:'assets/brv-sand.png' }
  },
  {
    slug: 'cityhb', nama: 'City Hatchback', startFrom: 'Rp 384.600.000', tag: 'city', img: 'assets/city-hb.png',
    colors: ['Hitam','Putih','Merah','Orange','Abu','Lime'],
    images: { Merah:'assets/city-hb-red.png', Putih:'assets/city-hb-white.png', Hitam:'assets/city-hb-black.png', Orange:'assets/city-hb-orange.png', Abu:'assets/city-hb-gray.png', Lime:'assets/city-hb-lime.png' }
  },
  {
    slug: 'hrv', nama: 'All New HR-V', startFrom: 'Rp 401.500.000', tag: 'suv', img: 'assets/hrv.png',
    colors: ['Hitam','Putih','Merah','Abu','Sand'],
    images: { Hitam:'assets/hrv-black.png', Putih:'assets/hrv-white.png', Merah:'assets/hrv-red.png', Abu:'assets/hrv-gray.png', Sand:'assets/hrv-sand.png' }
  },
  {
    slug: 'crv', nama: 'New CR-V', startFrom: 'Rp 759.600.000', tag: 'suv', img: 'assets/crv.png',
    colors: ['Hitam','Putih','Biru','Abu','Merah'],
    images: { Hitam:'assets/crv-black.png', Putih:'assets/crv-white.png', Biru:'assets/crv-blue.png', Abu:'assets/crv-gray.png', Merah:'assets/crv-red.png' }
  },
  {
    slug: 'civic', nama: 'All New Civic', startFrom: 'Rp 699.000.000', tag: 'city', img: 'assets/civic.png',
    colors: ['Hitam','Merah','Putih','Biru'],
    images: { Merah:'assets/civic-red.png', Hitam:'assets/civic-black.png', Putih:'assets/civic-white.png', Biru:'assets/civic-blue.png' }
  },
  {
    slug: 'civicr', nama: 'All New Civic Type R', startFrom: 'Rp 1.446.000.000', tag: 'city', img: 'assets/civic-r.png',
    colors: ['Hitam','Putih','Merah','Biru','Abu'],
    images: { Merah:'assets/civic-r-red.png', Hitam:'assets/civic-r-black.png', Putih:'assets/civic-r-white.png', Biru:'assets/civic-r-blue.png', Abu:'assets/civic-r-gray.png' }
  },
  {
    slug: 'accord', nama: 'All New Accord', startFrom: 'Rp 970.900.000', tag: 'city', img: 'assets/accord.png',
    colors: ['Hitam','Putih','Merah'],
    images: { Merah:'assets/accord-red.png', Hitam:'assets/accord-black.png', Putih:'assets/accord-white.png' }
  }
];

// === HELPERS ===
const $  = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];
const toWaUrl = (phone, text) => `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
const getModelBySlug = (slug) => MODELS.find(m => m.slug === slug);
const getModelByName = (name) => MODELS.find(m => m.nama === name);

function warnaList(m){ return m?.colors?.length ? m.colors : WARNA_LIST_DEFAULT; }
function urlGambarWarna(m, warna){
  if (m.images?.[warna]) return m.images[warna];
  const key = WARNA_KEY[warna] || 'black';
  return `assets/${m.slug}-${key}.png`;
}

// === NAV & MENU ===
$('#openMenu')?.addEventListener('click', ()=> $('#mobileMenu').classList.toggle('hidden'));

// === RENDER CARDS ===
const cards = $('#cards');

function createCard(m){
  const el = document.createElement('article');
  el.className = 'group overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-colors reveal';
  el.dataset.tag = m.tag;
  el.setAttribute('data-reveal','slide-up');

  const colors = warnaList(m);

  el.innerHTML = `
    <div class="aspect-[16/10] bg-black/30 grid place-items-center overflow-hidden card-tilt">
      <img src="${m.img}" alt="${m.nama}" class="h-full w-full object-cover opacity-90 group-hover:scale-[1.03] transition-transform duration-300" />
      <div class="placeholder" hidden><div class="p-8 text-center text-white/70">${m.nama}</div></div>
    </div>
    <div class="p-5">
      <div class="text-sm text-white/60 uppercase tracking-widest">${m.tag}</div>
      <h3 class="mt-1 text-xl font-bold">${m.nama}</h3>
      <div class="mt-1 text-white/70">Start from <span class="font-semibold">${m.startFrom}</span></div>
      <div class="mt-4 flex gap-2">
        <a href="#" data-wa="${m.slug}" class="btn btn--wa">Tanya Promo</a>
        <a href="#simulasi" data-simulasikan="${m.slug}" class="btn btn--ghost2">Simulasi</a>
      </div>
      <div class="color-swatches" role="group" aria-label="Pilih warna">
        ${colors.map(w=>`
          <button type="button" class="swatch" data-color="${w}" aria-pressed="false" title="${w}"></button>
        `).join('')}
        <span class="selected-color" data-label>Pilih warna</span>
      </div>
    </div>
  `;

  // logika warna per card
  const imgEl = el.querySelector('img');
  let aktif = null; // ❗ default: belum memilih warna

  function setWarna(w){
    aktif = w;
    const tryUrl = urlGambarWarna(m, w);
    const fallback = m.img;
    imgEl.onerror = () => { imgEl.onerror = null; imgEl.src = fallback; };
    imgEl.src = tryUrl;

    el.querySelector('[data-label]').textContent = w;
    el.querySelectorAll('.swatch').forEach(s=>{
      const on = s.dataset.color === w;
      s.classList.toggle('is-active', on);
      s.setAttribute('aria-pressed', on?'true':'false');
    });
  }

  el.querySelectorAll('.swatch').forEach(btn=>{
    btn.addEventListener('click', ()=> setWarna(btn.dataset.color));
  });

  Object.defineProperty(el, 'warnaAktif', { get: ()=> aktif });
  return el;
}

// Render
MODELS.forEach(m => cards.appendChild(createCard(m)));

// === FILTER ===
$$('.filter-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const f = btn.dataset.filter;
    $$('#cards article').forEach(c => c.classList.toggle('hidden', f !== 'all' && c.dataset.tag !== f));
    $$('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// === FORM SIMULASI (model & warna dinamis) ===
const modelSelect = document.querySelector('select[name="model"]');
const warnaSelect = document.querySelector('select[name="warna"]');

// isi opsi model
MODELS.forEach(m => {
  const opt = document.createElement('option');
  opt.value = m.nama; opt.textContent = m.nama;
  modelSelect.appendChild(opt);
});

function updateWarnaOptions(modelName, preselect){
  const m = getModelByName(modelName);
  const list = warnaList(m);
  // placeholder default, biar tidak auto pilih warna pertama
  warnaSelect.innerHTML = [
    '<option value="" disabled selected>Pilih warna</option>',
    ...list.map(w=>`<option value="${w}">${w}</option>`)
  ].join('');
  if (preselect && list.includes(preselect)) {
    warnaSelect.value = preselect;
  }
}
updateWarnaOptions(modelSelect.value || MODELS[0]?.nama);

modelSelect.addEventListener('change', e => updateWarnaOptions(e.target.value));

// === CTA WA global ===
const waBase = 'Halo, saya ingin tanya promo & simulasi kredit Honda.';
['cta-wa-top','cta-wa-top-m','cta-wa-hero','cta-wa-bottom'].forEach(id=>{
  const el = document.getElementById(id);
  el && el.setAttribute('href', toWaUrl(WA_PHONE, waBase));
});

// === Delegasi klik kartu ===
cards.addEventListener('click', (e)=>{
  // Tanya Promo
  const a = e.target.closest('a[data-wa]');
  if (a){
    e.preventDefault();
    const slug = a.getAttribute('data-wa');
    const m = getModelBySlug(slug);
    const card = a.closest('article');
    const warna = card?.warnaAktif || null; // bisa null jika belum pilih
    const text = [
      `Halo, saya tertarik ${m?.nama || 'Honda'}.`,
      'Minta info harga, diskon, dan simulasi kreditnya.',
      warna ? `Preferensi warna: ${warna}.` : null
    ].filter(Boolean).join(' ');
    window.open(toWaUrl(WA_PHONE, text), '_blank');
    return;
  }

  // Simulasi: prefill model & warna; biarkan kosong jika belum pilih
  const b = e.target.closest('a[data-simulasikan]');
  if (b){
    const slug = b.getAttribute('data-simulasikan');
    const m = getModelBySlug(slug);
    const card = b.closest('article');
    const warna = card?.warnaAktif || '';
    const form = document.getElementById('simForm');
    if (form && m){
      modelSelect.value = m.nama;
      updateWarnaOptions(m.nama, warna || undefined);
    }
  }
});

// === FORM => WA (sertakan warna bila dipilih) ===
$('#simForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const data = Object.fromEntries(fd.entries());
  const text = [
    'Halo, saya ingin simulasi kredit.',
    `Nama: ${data.nama}`,
    `WA: ${data.telp}`,
    data.alamat ? `Alamat: ${data.alamat}` : null,
    data.model ? `Model: ${data.model}` : null,
    data.tipe ? `Tipe: ${data.tipe}` : null,
    data.transmisi ? `Transmisi: ${data.transmisi}` : null,
    data.warna ? `Warna: ${data.warna}` : null, // hanya ikut jika user memilih
    data.tenor ? `Tenor: ${data.tenor}` : null,
    data.permintaan ? `Permintaan: ${data.permintaan}` : null,
  ].filter(Boolean).join('\n');
  window.open(toWaUrl(WA_PHONE, text), '_blank');
});

// === REVEAL ON SCROLL ===
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if (entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
  });
},{ threshold:.12 });
$$('.reveal').forEach(el=> io.observe(el));

// === PARALLAX BLOBS ===
function parallax(){
  const y = window.scrollY || 0;
  const r = $('.fx-blob--red'); const b = $('.fx-blob--blue');
  if (r) r.style.transform = `translateY(${y * -0.06}px)`;
  if (b) b.style.transform = `translateY(${y * 0.04}px)`;
}
window.addEventListener('scroll', parallax, { passive:true });
parallax();

// === TILT EFFECT ===
function addTilt(el){
  const rect = () => el.getBoundingClientRect();
  el.addEventListener('mouseenter', ()=> el.style.transition = 'transform .2s ease');
  el.addEventListener('mousemove', (e)=>{
    const r = rect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    const dx = (e.clientX - cx)/r.width, dy = (e.clientY - cy)/r.height;
    el.style.transform = `perspective(900px) rotateX(${(-dy*6).toFixed(2)}deg) rotateY(${(dx*8).toFixed(2)}deg) scale(1.01)`;
  });
  el.addEventListener('mouseleave', ()=>{
    el.style.transition = 'transform .35s ease'; el.style.transform = 'none';
  });
}
$$('.card-tilt').forEach(addTilt);

// === SMALL UX ===
document.getElementById('year').textContent = new Date().getFullYear();
