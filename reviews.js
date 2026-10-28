/* =========================================================
   Customer reviews — each card has a blue ES | EN toggle.
   `orig` = the language the review was written in.
   Sample site: reviewer and driver names have been removed.
   ========================================================= */
const REVIEWS = [
  {
    orig: 'en',
    en: 'Our driver is the best! He has taken me to and from the SJD airport several times and it has been such a huge help. He is reliable, always on time and very responsive which is comforting especially right before the airport! Highly recommend this service!',
    es: '¡Nuestro conductor es el mejor! Me ha llevado y recogido en el aeropuerto de SJD varias veces y ha sido de gran ayuda. Es confiable, siempre puntual y responde muy rápido, lo cual da mucha tranquilidad, ¡especialmente justo antes de ir al aeropuerto! ¡Recomiendo ampliamente este servicio!'
  },
  {
    orig: 'en',
    en: 'We had a great trip to the airport. Fair pricing, excellent communication. It was an enjoyable drive with a driver who is safe, punctual and just a friendly and happy person. Don’t hesitate to reach out if you are in Los Cabos. Also an extra bonus is the car was not heavily scented 🙏.',
    es: 'Tuvimos un excelente viaje al aeropuerto. Precios justos, excelente comunicación. Fue un trayecto muy agradable con un conductor que maneja con seguridad, es puntual y es una persona amable y alegre. No duden en contactarlos si están en Los Cabos. Además, un punto extra: el auto no tenía un aroma fuerte 🙏.'
  },
  {
    orig: 'en',
    en: 'Very dependable driver with good prices. I felt safe driving with him. I have used the service several times, and it makes getting to and from the airport easy, with no worries!',
    es: 'Un conductor muy confiable y con buenos precios. Me sentí segura viajando con él. He usado el servicio varias veces, ¡y hace que ir y volver del aeropuerto sea fácil y sin preocupaciones!'
  },
  {
    orig: 'es',
    en: 'The service I received was safe and reliable. The driver was very attentive and drove carefully. I highly recommend it.',
    es: 'El servicio que recibí fue seguro y confiable. El conductor fue muy atento y manejó con precaución. Lo recomiendo ampliamente.'
  },
  {
    orig: 'es',
    en: 'I used this service around Cabo and to the airport. I found the driver to be very friendly and he communicated well about his status. I plan on using it again on my next visit.',
    es: 'Utilicé este servicio en Cabo y para ir al aeropuerto. El conductor me pareció muy amable y me mantuvo bien informado. Pienso volver a usar el servicio en mi próxima visita.'
  },
  {
    orig: 'es',
    en: 'Everything was excellent, punctual, good conversation and super safe, car in excellent condition.',
    es: 'Todo excelente, puntual, buena plática y súper seguro, el auto en excelentes condiciones.'
  },
  {
    orig: 'en',
    en: 'Good service. Professional. Good communication. Would highly recommend.',
    es: 'Buen servicio. Profesional. Buena comunicación. Lo recomiendo ampliamente.'
  },
  {
    orig: 'es',
    en: 'Excellent service, the driver was very friendly.',
    es: 'Excelente servicio, el conductor fue muy amable.'
  },
  {
    orig: 'es',
    en: 'Excellent service!',
    es: '¡Excelente servicio!'
  },
  {
    orig: 'es',
    en: 'Excellent',
    es: 'Excelente'
  }
];

const REVIEW_UI = {
  es: { guest: 'Cliente', source: 'Reseña de Google', stars: '5 de 5 estrellas', translated: { en: 'Traducido del inglés', es: 'Traducido del español' }, more: 'Ver más reseñas', less: 'Ver menos reseñas' },
  en: { guest: 'Guest', source: 'Google review', stars: '5 out of 5 stars', translated: { en: 'Translated from English', es: 'Translated from Spanish' }, more: 'See more reviews', less: 'Show fewer reviews' }
};
const REVIEWS_VISIBLE = 6;

(() => {
  const grid = document.getElementById('reviews-grid');
  const moreBtn = document.getElementById('reviews-more');
  if (!grid) return;
  let expanded = false;


  function setCardLang(card, lang) {
    const r = REVIEWS[card.dataset.index];
    const ui = REVIEW_UI[I18N.lang];
    card.querySelector('.review-text').textContent = r[lang];
    card.querySelector('.review-text').lang = lang;
    const note = card.querySelector('.review-note');
    note.textContent = lang === r.orig ? '' : ui.translated[r.orig];
    card.querySelectorAll('.review-toggle button').forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.rlang === lang));
    });
  }

  function render() {
    const ui = REVIEW_UI[I18N.lang];
    grid.innerHTML = REVIEWS.map((r, i) => `
      <article class="review${i >= REVIEWS_VISIBLE && !expanded ? ' is-hidden' : ''}" data-index="${i}">
        <div class="review-toggle" role="group" aria-label="Idioma de la reseña / Review language">
          <button type="button" data-rlang="es">ES</button>
          <button type="button" data-rlang="en">EN</button>
        </div>
        <span class="review-mark" aria-hidden="true">“</span>
        <p class="review-text"></p>
        <p class="review-note"></p>
        <div class="review-stars" role="img" aria-label="${ui.stars}">${'<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>'.repeat(5)}</div>
        <div class="review-author">
          <span class="review-avatar" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c1-3.6 3.8-5.4 7-5.4s6 1.8 7 5.4"/></svg></span>
          <span><strong>${ui.guest}</strong><small>${ui.source}</small></span>
        </div>
      </article>`).join('');

    grid.querySelectorAll('.review').forEach(card => {
      setCardLang(card, I18N.lang);
      card.querySelectorAll('.review-toggle button').forEach(b => {
        b.addEventListener('click', () => setCardLang(card, b.dataset.rlang));
      });
    });
    moreBtn.textContent = expanded ? ui.less : ui.more;
    moreBtn.hidden = REVIEWS.length <= REVIEWS_VISIBLE;
  }

  moreBtn.addEventListener('click', () => {
    expanded = !expanded;
    render();
    if (!expanded) document.getElementById('resenas').scrollIntoView();
  });

  render();
  document.addEventListener('langchange', render);
})();
