'use strict';

/* ═══════════════════════════════════════════
   ✏️ CONFIGURACIÓN EDITABLE
   ═══════════════════════════════════════════ */
const CONFIG = {
  // ✏️ Fecha y hora del evento (año, mes-1, día, hora, minuto)
  eventDate: new Date(2025, 6, 19, 20, 30, 0),

  // ✏️ URL del webhook de n8n para el RSVP
  webhookURL: 'https://TU_URL_DE_WEBHOOK_DE_N8N_AQUÍ',

  // ✏️ URL pública de un archivo MP3 para música de fondo
  audioURL: 'https://www.bensound.com/bensound-music/bensound-romantik.mp3',

  // ✏️ Preguntas de trivia sobre Valentina
  triviaQuestions: [
    { question: '¿Cuál es la comida favorita de Valentina?', options: ['Sushi','Pizza','Pasta','Hamburguesa'], correct: 1, explanation: '¡La pizza siempre gana! 🍕' },
    { question: '¿Cuál es su color favorito?', options: ['Azul marino','Rosa','Verde esmeralda','Negro'], correct: 1, explanation: 'El rosa es su favorito desde pequeña 💗' },
    { question: '¿Qué le gusta hacer en su tiempo libre?', options: ['Leer','Bailar','Pintar','Cocinar'], correct: 1, explanation: '¡Le encanta bailar! 💃' },
    { question: '¿Cuál es su película favorita?', options: ['El Rey León','Titanic','Clueless','La Sirenita'], correct: 2, explanation: 'As if! Clueless es su favorita 🎬' },
    { question: '¿Qué artista escucha siempre?', options: ['Taylor Swift','Bad Bunny','Bizarrap','Dua Lipa'], correct: 0, explanation: 'Es swiftie de corazón 🩵' }
  ],

  // Mensajes pre-cargados en el libro de firmas (se pueden borrar)
  sampleMessages: [
    { name: 'Mamá', relation: 'familiar', message: 'Mi amor, verte crecer ha sido el regalo más grande de mi vida. Hoy festejamos a la persona más especial del mundo. ¡Te amo infinito! 💗', time: 'Hace un momento' },
    { name: 'Papá', relation: 'familiar', message: 'Hija, cada día sos más increíble. Que esta noche sea el comienzo de todos tus sueños cumplidos. ¡Siempre voy a estar acá para vos! 👑', time: 'Hace un momento' }
  ]
};

/* ═══════════════════════════════════════════
   1. INTRO — CORTINA QUE SE ABRE
   ═══════════════════════════════════════════ */
function initIntro() {
  const screen  = document.getElementById('intro-screen');
  const btn     = document.getElementById('intro-btn');
  const main    = document.getElementById('main-content');
  if (!screen || !btn) return;

  // Iniciar pétalos en el canvas del intro
  initPetalsIntro();

  btn.addEventListener('click', openCurtain);

  // También abrir al hacer tap en cualquier parte del intro (UX móvil)
  screen.addEventListener('click', (e) => {
    if (e.target !== btn && !btn.contains(e.target)) openCurtain();
  });

  function openCurtain() {
    if (screen.classList.contains('opening')) return;
    screen.classList.add('opening');

    // Mostrar contenido mientras la cortina se abre
    setTimeout(() => {
      main.style.display = 'block';
      requestAnimationFrame(() => main.classList.add('visible'));
    }, 400);

    // Ocultar el intro después de la animación
    setTimeout(() => {
      screen.classList.add('done');
      // Inicializar todo el contenido después de mostrar
      initAll();
    }, 1200);
  }
}

/* ═══════════════════════════════════════════
   2. PÉTALOS EN CANVAS DEL INTRO
   ═══════════════════════════════════════════ */
function initPetalsIntro() {
  const canvas = document.getElementById('petals-intro');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Pétalos dorados y rosa para el intro oscuro
  const petals = Array.from({ length: 35 }, () => createPetal(true));

  function createPetal(random = false) {
    return {
      x:     Math.random() * (canvas.width || window.innerWidth),
      y:     random ? Math.random() * (canvas.height || window.innerHeight) : -20,
      size:  Math.random() * 7 + 3,
      speedY: Math.random() * 1.2 + 0.4,
      speedX: (Math.random() - 0.5) * 0.6,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      opacity: Math.random() * 0.6 + 0.2,
      color:  Math.random() > 0.5 ? '#c9a96e' : '#c9a99a',
      shape:  Math.random() > 0.5 ? 'petal' : 'circle',
    };
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    if (p.shape === 'petal') {
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  let animId;
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach((p) => {
      drawPetal(p);
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;
      if (p.y > canvas.height + 20) {
        Object.assign(p, createPetal(false));
      }
    });
    animId = requestAnimationFrame(loop);
  }
  loop();

  // Guardar referencia para cancelar si es necesario
  window._introAnimId = animId;
}

/* ═══════════════════════════════════════════
   3. PÉTALOS FLOTANTES EN EL CONTENIDO PRINCIPAL
   ═══════════════════════════════════════════ */
function initPetalsMain() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Mezcla de pétalos de diferentes colores y formas
  const petals = Array.from({ length: 30 }, () => createPetal());

  function createPetal() {
    const colors = ['#c9a99a', '#c9a96e', '#e8cfc8', '#e8d5b0', '#d4b8b0'];
    return {
      x:        Math.random() * window.innerWidth,
      y:        Math.random() * window.innerHeight,
      size:     Math.random() * 8 + 4,
      speedY:   Math.random() * 0.8 + 0.2,
      speedX:   Math.sin(Math.random() * Math.PI * 2) * 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.025,
      opacity:  Math.random() * 0.45 + 0.1,
      color:    colors[Math.floor(Math.random() * colors.length)],
      wobble:   Math.random() * Math.PI * 2,
      wobbleSpd: Math.random() * 0.02 + 0.01,
    };
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    // Forma de pétalo suave
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * 0.5, -p.size * 0.5, p.size * 0.5, p.size * 0.5, 0, p.size);
    ctx.bezierCurveTo(-p.size * 0.5, p.size * 0.5, -p.size * 0.5, -p.size * 0.5, 0, -p.size);
    ctx.fill();
    ctx.restore();
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach((p) => {
      drawPetal(p);
      p.wobble += p.wobbleSpd;
      p.x += Math.sin(p.wobble) * 0.5 + p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;
      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
        p.opacity = Math.random() * 0.45 + 0.1;
      }
    });
    requestAnimationFrame(loop);
  }
  loop();
}

/* ═══════════════════════════════════════════
   4. SCROLL REVEAL — Intersection Observer
   ═══════════════════════════════════════════ */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

/* ═══════════════════════════════════════════
   5. COUNTDOWN
   ═══════════════════════════════════════════ */
function initCountdown() {
  const daysEl  = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl  = document.getElementById('cd-mins');
  const secsEl  = document.getElementById('cd-secs');
  if (!daysEl) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateNum(el, val) {
    if (el.textContent !== val) {
      el.classList.remove('flip');
      void el.offsetWidth;
      el.classList.add('flip');
      el.textContent = val;
    }
  }

  function tick() {
    const diff = CONFIG.eventDate - new Date();
    if (diff <= 0) {
      [daysEl, hoursEl, minsEl, secsEl].forEach(el => el.textContent = '00');
      return;
    }
    updateNum(daysEl,  pad(Math.floor(diff / 86400000)));
    updateNum(hoursEl, pad(Math.floor((diff % 86400000) / 3600000)));
    updateNum(minsEl,  pad(Math.floor((diff % 3600000) / 60000)));
    updateNum(secsEl,  pad(Math.floor((diff % 60000) / 1000)));
    setTimeout(tick, 1000);
  }
  tick();
}

/* ═══════════════════════════════════════════
   6. AUDIO PLAYER
   ═══════════════════════════════════════════ */
function initAudio() {
  const btn    = document.getElementById('audio-btn');
  const icon   = document.getElementById('audio-icon');
  const player = document.getElementById('audio-player');
  if (!btn) return;

  const audio  = new Audio(CONFIG.audioURL);
  audio.loop   = true;
  audio.volume = 0.45;
  let playing  = false;

  player.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      icon.className = 'fas fa-play';
    } else {
      audio.play().catch(() => {});
      icon.className = 'fas fa-pause';
    }
    playing = !playing;
  });
}

/* ═══════════════════════════════════════════
   7. MAPA INTERACTIVO — NUEVO
   ═══════════════════════════════════════════ */
function initMap() {
  const tabs    = document.querySelectorAll('.map-tab');
  const frames  = document.querySelectorAll('.map-frame');
  const openBtn = document.getElementById('map-open-btn');
  if (!tabs.length) return;

  // ✏️ EDITAR: Links para cada lugar en el botón "Abrir en Google Maps"
  const mapLinks = {
    fiesta:  'https://maps.google.com/?q=Av.+del+Libertador+5678+Buenos+Aires',
    iglesia: 'https://maps.google.com/?q=Av.+Santa+Fe+1234+Buenos+Aires',
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.map;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      frames.forEach(f => f.classList.remove('active'));
      const targetFrame = document.getElementById(`map-${target}`);
      if (targetFrame) targetFrame.classList.add('active');

      if (openBtn && mapLinks[target]) {
        openBtn.href = mapLinks[target];
      }
    });
  });
}

/* ═══════════════════════════════════════════
   8. MODAL DE REGALO
   ═══════════════════════════════════════════ */
function initGiftModal() {
  const modal    = document.getElementById('gift-modal');
  const openBtn  = document.getElementById('gift-btn');
  const closeBtn = document.getElementById('modal-close');
  const closeBtnB = document.getElementById('modal-close-btn');
  const overlay  = document.getElementById('modal-overlay');
  if (!modal) return;

  const open  = () => { modal.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { modal.classList.remove('open'); document.body.style.overflow = ''; };

  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  closeBtnB?.addEventListener('click', close);
  overlay?.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* ═══════════════════════════════════════════
   COPIAR AL PORTAPAPELES
   ═══════════════════════════════════════════ */
function copyText(elementId) {
  const el  = document.getElementById(elementId);
  const btn = el?.nextElementSibling;
  if (!el) return;
  navigator.clipboard.writeText(el.textContent.trim()).then(() => {
    if (btn) {
      btn.classList.add('copied');
      btn.innerHTML = '<i class="fas fa-check"></i>';
      setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = '<i class="fas fa-copy"></i>'; }, 2000);
    }
  }).catch(() => {
    const r = document.createRange();
    r.selectNode(el);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(r);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
  });
}
window.copyText = copyText;

/* ═══════════════════════════════════════════
   9. GALERÍA SWIPER
   ═══════════════════════════════════════════ */
function initGallery() {
  if (typeof Swiper === 'undefined') return;
  new Swiper('.gallery-swiper', {
    slidesPerView: 1.3, centeredSlides: true, spaceBetween: 16,
    loop: true, grabCursor: true,
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: { 520: { slidesPerView: 2.2 }, 768: { slidesPerView: 2.8 } },
  });
}

/* ═══════════════════════════════════════════
   10. TRIVIA
   ═══════════════════════════════════════════ */
function initTrivia() {
  const questionEl = document.getElementById('trivia-question');
  const optionsEl  = document.getElementById('trivia-options');
  const feedbackEl = document.getElementById('trivia-feedback');
  const currentEl  = document.getElementById('trivia-current');
  const totalEl    = document.getElementById('trivia-total');
  const resultEl   = document.getElementById('trivia-result');
  const scoreText  = document.getElementById('trivia-score-text');
  const restartBtn = document.getElementById('trivia-restart');
  const cardEl     = document.getElementById('trivia-question-card');
  if (!questionEl) return;

  const questions = CONFIG.triviaQuestions;
  let current = 0, score = 0;
  totalEl.textContent = questions.length;

  function showQuestion(idx) {
    const q = questions[idx];
    currentEl.textContent = idx + 1;
    questionEl.textContent = q.question;
    feedbackEl.textContent = '';
    optionsEl.innerHTML = '';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'trivia-option';
      btn.textContent = opt;
      btn.addEventListener('click', () => handleAnswer(i, btn));
      optionsEl.appendChild(btn);
    });
  }

  function handleAnswer(idx, clicked) {
    const q = questions[current];
    optionsEl.querySelectorAll('.trivia-option').forEach(b => b.disabled = true);
    if (idx === q.correct) {
      clicked.classList.add('correct');
      feedbackEl.textContent = '✓ ¡Correcto! ' + q.explanation;
      feedbackEl.style.color = '#2e7d32';
      score++;
    } else {
      clicked.classList.add('incorrect');
      optionsEl.querySelectorAll('.trivia-option')[q.correct].classList.add('reveal-correct');
      feedbackEl.textContent = '✗ ' + q.explanation;
      feedbackEl.style.color = '#c62828';
    }
    setTimeout(() => {
      current++;
      if (current < questions.length) showQuestion(current);
      else showResult();
    }, 1800);
  }

  function showResult() {
    cardEl.style.display = 'none';
    resultEl.style.display = 'block';
    const pct = Math.round((score / questions.length) * 100);
    const emoji = pct >= 80 ? '🏆' : pct >= 50 ? '💗' : '🌸';
    if (pct === 100) scoreText.textContent = `${emoji} ¡Perfecto! ${score}/${questions.length}. ¡Me conocés de memoria!`;
    else if (pct >= 60) scoreText.textContent = `${emoji} ¡Muy bien! ${score}/${questions.length}. Nos conocemos bastante bien.`;
    else scoreText.textContent = `${emoji} ${score}/${questions.length}. Hay que pasar más tiempo juntos 🥰`;
  }

  restartBtn?.addEventListener('click', () => {
    current = 0; score = 0;
    cardEl.style.display = 'block';
    resultEl.style.display = 'none';
    showQuestion(0);
  });

  showQuestion(0);
}

/* ═══════════════════════════════════════════
   11. PLAYLIST
   ═══════════════════════════════════════════ */
function initPlaylist() {
  const form        = document.getElementById('playlist-form');
  const container   = document.getElementById('playlist-suggestions');
  const songInput   = document.getElementById('song-name');
  const artistInput = document.getElementById('artist-name');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const song   = songInput.value.trim();
    const artist = artistInput.value.trim();
    if (!song || !artist) return;
    const item = document.createElement('div');
    item.className = 'playlist-item';
    item.innerHTML = `<div class="playlist-item-icon"><i class="fas fa-music"></i></div>
      <div class="playlist-item-text"><strong>${escapeHtml(song)}</strong><span>${escapeHtml(artist)}</span></div>`;
    container.prepend(item);
    songInput.value = '';
    artistInput.value = '';
    songInput.focus();
  });
}

/* ═══════════════════════════════════════════
   12. LIBRO DE FIRMAS DIGITAL — NUEVO
   ═══════════════════════════════════════════ */
function initGuestbook() {
  const form      = document.getElementById('guestbook-form');
  const wall      = document.getElementById('guestbook-wall');
  const nameInput = document.getElementById('gb-name');
  const msgInput  = document.getElementById('gb-message');
  const relSelect = document.getElementById('gb-relation');
  const counter   = document.getElementById('gb-counter');
  const submitBtn = document.getElementById('gb-submit');
  if (!form || !wall) return;

  // Contador de caracteres
  msgInput?.addEventListener('input', () => {
    const len = msgInput.value.length;
    counter.textContent = len;
    counter.style.color = len > 250 ? '#d9807a' : '';
  });

  // Selector de emojis — insertar en el textarea
  document.querySelectorAll('.emoji-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const emoji = btn.dataset.emoji;
      const start = msgInput.selectionStart;
      const end   = msgInput.selectionEnd;
      const val   = msgInput.value;
      msgInput.value = val.slice(0, start) + emoji + val.slice(end);
      msgInput.selectionStart = msgInput.selectionEnd = start + emoji.length;
      msgInput.focus();
      counter.textContent = msgInput.value.length;
    });
  });

  // Cargar mensajes de ejemplo
  CONFIG.sampleMessages.forEach(m => renderCard(m, false));

  // Mostrar placeholder si no hay mensajes
  updateEmptyState();

  // Envío del formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name     = nameInput.value.trim();
    const message  = msgInput.value.trim();
    const relation = relSelect.value;
    if (!name || !message) return;

    // Animación del botón
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;

    setTimeout(() => {
      renderCard({ name, relation, message, time: 'Ahora mismo' }, true);
      form.reset();
      counter.textContent = '0';
      submitBtn.innerHTML = '<i class="fas fa-feather"></i> Firmar el libro';
      submitBtn.disabled = false;
      updateEmptyState();
      // Scroll suave al primer card
      wall.firstElementChild?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 600);
  });

  function renderCard(data, prepend = true) {
    // Quitar placeholder si existe
    const placeholder = wall.querySelector('.gb-empty');
    if (placeholder) placeholder.remove();

    const initial = data.name.charAt(0).toUpperCase();
    const card = document.createElement('div');
    card.className = 'gb-card';
    card.innerHTML = `
      <div class="gb-card-header">
        <div class="gb-avatar">${initial}</div>
        <div class="gb-meta">
          <span class="gb-name">${escapeHtml(data.name)}</span>
          <span class="gb-relation">${escapeHtml(data.relation)}</span>
        </div>
        <span class="gb-time">${data.time}</span>
      </div>
      <p class="gb-message">${escapeHtml(data.message)}</p>
    `;
    if (prepend) wall.prepend(card);
    else wall.appendChild(card);
  }

  function updateEmptyState() {
    if (wall.children.length === 0) {
      wall.innerHTML = `<div class="gb-empty"><i class="fas fa-feather"></i>¡Sé el primero en firmar el libro de Valentina!</div>`;
    }
  }
}

/* ═══════════════════════════════════════════
   13. RSVP
   ═══════════════════════════════════════════ */
function initRSVP() {
  const form       = document.getElementById('rsvp-form');
  const yesBtn     = document.getElementById('rsvp-yes');
  const noBtn      = document.getElementById('rsvp-no');
  const attendingEl = document.getElementById('rsvp-attending');
  const extraEl    = document.getElementById('rsvp-extra');
  const successEl  = document.getElementById('rsvp-success');
  const successMsg = document.getElementById('rsvp-success-msg');
  const submitBtn  = document.getElementById('rsvp-submit');
  if (!form) return;

  yesBtn?.addEventListener('click', () => {
    yesBtn.classList.add('active'); noBtn.classList.remove('active');
    attendingEl.value = 'si'; extraEl.style.display = 'block';
  });
  noBtn?.addEventListener('click', () => {
    noBtn.classList.add('active'); yesBtn.classList.remove('active');
    attendingEl.value = 'no'; extraEl.style.display = 'none';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name      = document.getElementById('rsvp-name').value.trim();
    const attending = attendingEl.value;
    const guests    = document.getElementById('rsvp-guests').value;
    const food      = document.getElementById('rsvp-food').value;
    const message   = document.getElementById('rsvp-message').value.trim();
    if (!name) return;

    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;

    const payload = {
      nombre: name, asistencia: attending,
      cantidad_personas: attending === 'si' ? parseInt(guests) : 0,
      preferencia_alimenticia: attending === 'si' ? food : 'N/A',
      mensaje: message, timestamp: new Date().toISOString(),
      evento: 'XV Años Valentina'
    };

    try {
      if (!CONFIG.webhookURL.includes('TU_URL')) {
        await fetch(CONFIG.webhookURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await new Promise(res => setTimeout(res, 1000));
      }
      form.style.display = 'none';
      successEl.style.display = 'block';
      successMsg.textContent = attending === 'si'
        ? `¡Genial, ${name}! 🎉 Estamos felices de que vengas. ¡Te esperamos el 19 de julio!`
        : `Gracias por avisarnos, ${name}. Te vamos a extrañar mucho. ¡Pronto nos vemos!`;
      successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch {
      submitBtn.classList.remove('btn-loading');
      submitBtn.disabled = false;
      alert('Hubo un problema al enviar. Por favor intentá de nuevo.');
    }
  });
}

/* ═══════════════════════════════════════════
   14. SMOOTH SCROLL
   ═══════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

/* ═══════════════════════════════════════════
   UTILIDADES
   ═══════════════════════════════════════════ */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ═══════════════════════════════════════════
   INIT GENERAL (se llama después de abrir la cortina)
   ═══════════════════════════════════════════ */
function initAll() {
  initPetalsMain();
  initScrollReveal();
  initCountdown();
  initAudio();
  initMap();
  initGiftModal();
  initGallery();
  initTrivia();
  initPlaylist();
  initGuestbook();
  initRSVP();
  initSmoothScroll();
}

/* ═══════════════════════════════════════════
   ARRANQUE
   ═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Solo iniciar la intro al cargar; lo demás arranca cuando se abre la cortina
  initIntro();
});
