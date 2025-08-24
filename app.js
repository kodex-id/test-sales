// === CONFIG ===
// Nomor WA (format internasional tanpa '+', contoh: 6281234567890)
const WA_PHONE = '6282118102921';

// Warna yang ditawarkan
const WARNA_LIST = ['Biru', 'Merah', 'Hitam', 'Putih'];
const WARNA_KEY  = { Biru:'blue', Merah:'red', Hitam:'black', Putih:'white' };

// Daftar model (slug harus unik)
const MODELS = [
  { slug: 'brio',   nama: 'New Brio',              startFrom: 'Rp 184.000.000',    tag: 'city', img: 'assets/brio.png' },
  { slug: 'wrv',    nama: 'All New WR-V',          startFrom: 'Rp 286.900.000',    tag: 'suv',  img: 'assets/wrv.png' },
  { slug: 'brv',    nama: 'All New BR-V',          startFrom: 'Rp 311.900.000',    tag: 'suv',  img: 'assets/brv.png' },
  { slug: 'cityhb', nama: 'City Hatchback',        startFrom: 'Rp 339.400.000',    tag: 'city', img: 'assets/city-hb.png' },
  { slug: 'hrv',    nama: 'All New HR-V',          startFrom: 'Rp 405.100.000',    tag: 'suv',  img: 'assets/hrv.png' },
  { slug: 'crv',    nama: 'New CR-V',              startFrom: 'Rp 759.600.000',    tag: 'suv',  img: 'assets/crv.png' },
  { slug: 'civic',  nama: 'All New Civic',         startFrom: 'Rp 626.400.000',    tag: 'city', img: 'assets/civic.png' },
  { slug: 'civicr', nama: 'All New Civic Type R',  startFrom: 'Rp 1.446.000.000',  tag: 'city', img: 'assets/civic-r.png' },
  { slug: 'accord', nama: 'All New Accord',        startFrom: 'Rp 970.900.000',    tag: 'city', img: 'assets/accord.png' },
];

// === HELPERS ===
const $  = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];
const toWaUrl = (phone, text) => `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;

// === NAV & MENU ===
$('#openMenu')?.addEventListener('click', ()=> $('#mobileMenu').classList.toggle('hidden'));

// === RENDER CARDS ===
const cards = $('#cards');

function createCard(m) {
  const el = document.createElement('article');
  el.className = 'group overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-colors reveal';
  el.dataset.tag = m.tag;
  el.setAttribute('data-reveal','slide-up');

  el.innerHTML = `
    <div class="aspect-[16/10] bg-black/30 grid place-items-center overflow-hidden card-tilt">
      <img src="${m.img}" alt="${m.nama}" class="h-full w-full object-cover opacity-90 group-hover:scale-[1.03] transition-transform duration-300" />
      <div class="placeholder" hidden>
        <div class="p-8 text-center text-white/70">${m.nama}</div>
      </div>
    </div>
    <div class="p-5">
      <div class="text-sm text-white/60 uppercase tracking-widest">${m.tag}</div>
      <h3 class="mt-1 text-xl font-bold">${m.nama}</h3>
      <div class="mt-1 text-white/70">Start from <span class="font-semibold">${m.startFrom}</span></div>
      <div class="mt-4 flex gap-2">
        <a href="#" data-wa="${m.slug}" class="btn btn--wa">Tanya Promo</a>
        <a href="#simulasi" data-simulasikan="${m.slug}" class="btn btn--ghost">Simulasi</a>
      </div>
      <!-- VARIASI WARNA -->
      <div class="color-swatches" role="group" aria-label="Pilih warna">
        ${WARNA_LIST.map((w,i)=>`
          <button type="button" class="swatch ${i===0?'is-active':''}" data-color="${w}" aria-pressed="${i===0?'true':'false'}" title="${w}"></button>
        `).join('')}
        <span class="selected-color" data-label>${WARNA_LIST[0]}</span>
      </div>
    </div>
  `;

  // --- logika warna per card ---
  const imgEl = el.querySelector('img');
  let aktif = WARNA_LIST[0];

  function gantiGambarWarna(w) {
    aktif = w;
    const key = WARNA_KEY[w] || 'black';
    const fallback = m.img;
    const coba = `assets/${m.slug}-${key}.png`;
    imgEl.onerror = () => { imgEl.onerror = null; imgEl.src = fallback; };
    imgEl.src = coba;

    el.querySelector('[data-label]').textContent = w;
    el.querySelectorAll('.swatch').forEach(s=>{
      const act = s.dataset.color === w;
      s.classList.toggle('is-active', act);
      s.setAttribute('aria-pressed', act ? 'true':'false');
    });
  }

  el.querySelectorAll('.swatch').forEach(btn=>{
    btn.addEventListener('click', ()=> gantiGambarWarna(btn.dataset.color));
  });

  // expose warna aktif untuk dibaca handler luar
  Object.defineProperty(el, 'warnaAktif', { get: ()=> aktif });

  return el;
}

// paint
MODELS.forEach(m => cards.appendChild(createCard(m)));

// === FILTER ===
$$('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    $$('#cards article').forEach(c => c.classList.toggle('hidden', f !== 'all' && c.dataset.tag !== f));
    $$('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// === FILL MODEL SELECT ===
const modelSelect = document.querySelector('select[name="model"]');
MODELS.forEach(m => {
  const opt = document.createElement('option');
  opt.value = m.nama; opt.textContent = m.nama; modelSelect.appendChild(opt);
});

// === CTA WHATSAPP (global) ===
const waBase = 'Halo, saya ingin tanya promo & simulasi kredit Honda.';
const setWaHref = (el, msg = waBase) => el?.setAttribute('href', toWaUrl(WA_PHONE, msg));
['cta-wa-top','cta-wa-top-m','cta-wa-hero','cta-wa-bottom'].forEach(id => setWaHref(document.getElementById(id)));

// === Card-specific actions ===
cards.addEventListener('click', (e) => {
  // Tanya Promo (kirim warna)
  const a = e.target.closest('a[data-wa]');
  if (a) {
    e.preventDefault();
    const slug = a.getAttribute('data-wa');
    const m = MODELS.find(x => x.slug === slug);
    const card = a.closest('article');
    const warna = card?.warnaAktif || null;
    const text = [
      `Halo, saya tertarik ${m?.nama || 'Honda'}.`,
      'Minta info harga, diskon, dan simulasi kreditnya.',
      warna ? `Preferensi warna: ${warna}.` : null
    ].filter(Boolean).join(' ');
    window.open(toWaUrl(WA_PHONE, text), '_blank');
    return;
  }

  // Simulasi (prefill model & warna)
  const b = e.target.closest('a[data-simulasikan]');
  if (b) {
    const slug = b.getAttribute('data-simulasikan');
    const m = MODELS.find(x => x.slug === slug);
    const card = b.closest('article');
    const warna = card?.warnaAktif || '';
    const form = document.getElementById('simForm');
    if (form) {
      const selectModel = form.querySelector('select[name="model"]');
      const selectWarna = form.querySelector('select[name="warna"]');
      if (selectModel && m) selectModel.value = m.nama;
      if (selectWarna && warna) selectWarna.value = warna;
    }
  }
});

// === FORM => WHATSAPP (tambahkan "Warna") ===
$('#simForm')?.addEventListener('submit', (e) => {
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
    data.warna ? `Warna: ${data.warna}` : null,   // <— tambahan
    data.tenor ? `Tenor: ${data.tenor}` : null,
    data.permintaan ? `Permintaan: ${data.permintaan}` : null,
  ].filter(Boolean).join('\n');
  window.open(toWaUrl(WA_PHONE, text), '_blank');
});

// === REVEAL ON SCROLL ===
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
},{ threshold:.12 });
$$('.reveal').forEach(el=> io.observe(el));

// === PARALLAX BLOBS ===
function parallax() {
  const y = window.scrollY || 0;
  const r = $('.fx-blob--red');
  const b = $('.fx-blob--blue');
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
    const cx = r.left + r.width/2;
    const cy = r.top + r.height/2;
    const dx = (e.clientX - cx)/r.width;
    const dy = (e.clientY - cy)/r.height;
    el.style.transform = `perspective(900px) rotateX(${(-dy*6).toFixed(2)}deg) rotateY(${(dx*8).toFixed(2)}deg) scale(1.01)`;
  });
  el.addEventListener('mouseleave', ()=>{
    el.style.transition = 'transform .35s ease';
    el.style.transform = 'none';
  });
}
$$('.card-tilt').forEach(addTilt);

// === SMALL UX ===
document.getElementById('year').textContent = new Date().getFullYear();
