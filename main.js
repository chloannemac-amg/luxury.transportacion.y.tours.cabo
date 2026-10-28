/* =========================================================
   Marea (sample site) — page behavior
   ========================================================= */
// Sample site: no business number. wa.me without a number lets the visitor pick a chat.
const WHATSAPP_DIGITS = '';

/* Photo slots: if the file in data-photo exists, show it; otherwise keep the placeholder */
document.querySelectorAll('.photo[data-photo]').forEach(slot => {
  const img = new Image();
  img.onload = () => {
    slot.style.setProperty('--img', `url("${slot.dataset.photo}")`);
    slot.classList.add('loaded');
  };
  img.src = slot.dataset.photo;
});

/* Header: solid on scroll, mobile menu */
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const menuBtn = document.querySelector('.menu-btn');
menuBtn.addEventListener('click', () => {
  const open = header.classList.toggle('nav-open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.main-nav a').forEach(a => a.addEventListener('click', () => {
  header.classList.remove('nav-open');
  menuBtn.setAttribute('aria-expanded', 'false');
}));

/* Reveal on scroll */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* Straight dashed lines: a little navy SUV drives along them
   on hover (desktop), on click/tap, and when the line scrolls into view */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover)').matches;

function drive(line) {
  if (reduceMotion || line.classList.contains('driving')) return;
  // Distance from the car's start to just past the right edge of the page
  const car = line.querySelector('.car');
  const run = window.innerWidth - car.getBoundingClientRect().left + 10;
  const speed = line.closest('.steps') ? 300 : 420; // px per second
  line.style.setProperty('--run', `${run}px`);
  line.style.setProperty('--dur', `${Math.max(run / speed, 1.2).toFixed(2)}s`);
  line.classList.add('driving');
  line.querySelector('.car').addEventListener('animationend', () => line.classList.remove('driving'), { once: true });
}

const lineObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) drive(e.target); });
}, { rootMargin: '0px 0px -30% 0px', threshold: 1 });

// Eyebrow text is rewritten on language change, so the dash is (re)added each time
function addDashLines() {
  document.querySelectorAll('.eyebrow').forEach(eb => {
    if (eb.querySelector('.dash-line')) return;
    eb.insertAdjacentHTML('afterbegin', '<span class="dash-line" aria-hidden="true"><span class="car"></span></span>');
  });
  document.querySelectorAll('.dash-line').forEach(l => lineObserver.observe(l));
}
addDashLines();
document.addEventListener('langchange', addDashLines);

document.addEventListener('click', e => {
  const line = e.target.closest('.dash-line');
  if (line) drive(line);
});
if (canHover) {
  document.addEventListener('mouseover', e => {
    const line = e.target.closest('.dash-line');
    if (line) drive(line);
  });
}

/* Buttons with data-service pre-select the service in the quote form */
const serviceSelect = document.getElementById('f-service');
document.querySelectorAll('[data-service]').forEach(btn => {
  btn.addEventListener('click', () => { serviceSelect.value = btn.dataset.service; });
});

/* Tour cards also write the tour name into the Details box */
const notesField = document.getElementById('f-notes');
document.querySelectorAll('[data-tour]').forEach(btn => {
  btn.addEventListener('click', () => {
    const title = document.querySelector(`[data-i18n="${btn.dataset.tour}"]`).textContent.trim();
    notesField.value = `Tour: ${title}`;
  });
});

/* Plain WhatsApp links get a friendly pre-filled greeting in the current language */
function updateWaLinks() {
  const text = encodeURIComponent(WA_TEXT[I18N.lang].quick);
  document.querySelectorAll('.js-wa').forEach(a => {
    a.href = `https://wa.me/${WHATSAPP_DIGITS}?text=${text}`;
  });
}
updateWaLinks();
document.addEventListener('langchange', updateWaLinks);

/* Quote form → opens WhatsApp with the request filled in */
document.getElementById('quote-form').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target.elements;
  const t = WA_TEXT[I18N.lang];
  const name = f.namedItem("name").value.trim();
  if (!name) { f.namedItem("name").focus(); return; }

  const lines = [t.hello, ''];
  const add = (label, val) => { if (val && String(val).trim()) lines.push(`${label}: ${String(val).trim()}`); };
  add(t.name, name);
  add(t.service, serviceSelect.options[serviceSelect.selectedIndex].text);
  add(t.date, f.date.value);
  add(t.pax, f.pax.value);
  add(t.from, f.from.value);
  add(t.to, f.to.value);
  add(t.notes, f.notes.value);

  window.open(`https://wa.me/${WHATSAPP_DIGITS}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
});

/* Footer year */
document.getElementById('year').textContent = new Date().getFullYear();
