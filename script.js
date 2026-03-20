/* =============================================
   INVITACIÓN XV AÑOS — VALENTINA
   script.js — Vanilla JS completo
   ============================================= */

'use strict';

/* =============================================
   ✏️ CONFIGURACIÓN EDITABLE
   ============================================= */
const CONFIG = {
  // ✏️ Fecha y hora del evento (YYYY, MM-1, DD, HH, MM, SS)
  eventDate: new Date(2025, 6, 19, 20, 30, 0),

  // ✏️ URL del webhook de n8n para el RSVP
  webhookURL: 'https://TU_URL_DE_WEBHOOK_DE_N8N_AQUÍ',

  // ✏️ URL de un archivo de audio MP3 para la música de fondo
  // Podés usar cualquier URL pública, ej: desde tu hosting
  audioURL: 'https://www.bensound.com/bensound-music/bensound-romantik.mp3',

  // ✏️ Preguntas de trivia — editar a gusto
  triviaQuestions: [
    {
      question: '¿Cuál es la comida favorita de Valentina?',
      options: ['Sushi', 'Pizza', 'Pasta', 'Hamburguesa'],
      correct: 1, // índice (0-based)
      explanation: '¡La pizza siempre gana! 🍕'
    },
    {
      question: '¿Cuál es el color favorito de Valentina?',
      options: ['Azul marino', 'Rosa', 'Verde esmeralda', 'Negro'],
      correct: 1,
      explanation: 'El rosa es su favorito desde pequeña 💗'
    },
    {
      question: '¿Qué le gusta hacer en su tiempo libre?',
      options: ['Leer', 'Bailar', 'Pintar', 'Cocinar'],
      correct: 1,
      explanation: '¡Le encanta bailar! 💃'
    },
    {
      question: '¿Cuál es su película favorita?',
      options: ['El Rey León', 'Titanic', 'Clueless', 'La Sirenita'],
      correct: 2,
      explanation: 'As if! Clueless es su favorita 🎬'
    },
    {
      question: '¿Qué artista escucha siempre?',
      options: ['Taylor Swift', 'Bad Bunny', 'Bizarrap', 'Dua Lipa'],
      correct: 0,
      explanation: 'Es swiftie de corazón 🩵'
    }
  ]
};

/* =============================================
   SCROLL REVEAL — Intersection Observer
   ============================================= */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stagger children si los tiene
          const children = entry.target.querySelectorAll('.stagger-child');
          children.forEach((child, i) => {
            child.style.transitionDelay = `${i * 80}ms`;
            child.classList.add('visible');
          });
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

/* =============================================
   COUNTDOWN REGRESIVO
   ============================================= */
function initCountdown() {
  const daysEl   = document.getElementById('cd-days');
  const hoursEl  = document.getElementById('cd-hours');
  const minsEl   = document.getElementById('cd-mins');
  const secsEl   = document.getElementById('cd-secs');

  if (!daysEl) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateNum(el, newVal) {
    if (el.textContent !== newVal) {
      el.classList.remove('flip');
      void el.offsetWidth; // reflow
      el.classList.add('flip');
      el.textContent = newVal;
    }
  }

  function tick() {
    const now  = new Date();
    const diff = CONFIG.eventDate - now;

    if (diff <= 0) {
      daysEl.textContent = hoursEl.textContent = minsEl.textContent = secsEl.textContent = '00';
      // Mostrar mensaje festivo
      const section = document.getElementById('countdown');
      if (section) {
        const msg = section.querySelector('.countdown-grid');
        if (msg) {
          msg.insertAdjacentHTML('afterend', '<p style="text-align:center;font-family:var(--font-display);font-size:22px;color:var(--color-rose-dark);margin-top:24px">¡Hoy es el gran día! 🎉</p>');
        }
      }
      return;
    }

    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs  = Math.floor((diff % (1000 * 60)) / 1000);

    updateNum(daysEl,  pad(days));
    updateNum(hoursEl, pad(hours));
    updateNum(minsEl,  pad(mins));
    updateNum(secsEl,  pad(secs));

    setTimeout(tick, 1000);
  }

  tick();
}

/* =============================================
   AUDIO PLAYER
   ============================================= */
function initAudio() {
  const btn      = document.getElementById('audio-btn');
  const icon     = document.getElementById('audio-icon');
  const player   = document.getElementById('audio-player');
  if (!btn) return;

  const audio = new Audio(CONFIG.audioURL);
  audio.loop  = true;
  audio.volume = 0.5;

  let playing = false;

  player.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      icon.className = 'fas fa-play';
      playing = false;
    } else {
      audio.play().catch(() => {});
      icon.className = 'fas fa-pause';
      playing = true;
    }
  });
}

/* =============================================
   MODAL DE REGALO
   ============================================= */
function initGiftModal() {
  const modal     = document.getElementById('gift-modal');
  const openBtn   = document.getElementById('gift-btn');
  const closeBtn  = document.getElementById('modal-close');
  const closeBtnB = document.getElementById('modal-close-btn');
  const overlay   = document.getElementById('modal-overlay');
  if (!modal) return;

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  closeBtnB?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

/* =============================================
   COPIAR AL PORTAPAPELES
   ============================================= */
function copyText(elementId) {
  const el  = document.getElementById(elementId);
  const btn = el?.nextElementSibling;
  if (!el) return;

  navigator.clipboard.writeText(el.textContent.trim()).then(() => {
    if (btn) {
      btn.classList.add('copied');
      btn.innerHTML = '<i class="fas fa-check"></i>';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = '<i class="fas fa-copy"></i>';
      }, 2000);
    }
  }).catch(() => {
    // Fallback
    const range = document.createRange();
    range.selectNode(el);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
  });
}

// Exponer globalmente
window.copyText = copyText;

/* =============================================
   GALERÍA — SWIPER
   ============================================= */
function initGallery() {
  if (typeof Swiper === 'undefined') return;

  new Swiper('.gallery-swiper', {
    slidesPerView: 1.3,
    centeredSlides: true,
    spaceBetween: 16,
    loop: true,
    grabCursor: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      520: { slidesPerView: 2.2 },
      768: { slidesPerView: 2.8 },
    },
  });
}

/* =============================================
   TRIVIA
   ============================================= */
function initTrivia() {
  const container  = document.getElementById('trivia-container');
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
  let current = 0;
  let score   = 0;

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

  function handleAnswer(selectedIdx, clickedBtn) {
    const q = questions[current];
    const allBtns = optionsEl.querySelectorAll('.trivia-option');

    allBtns.forEach((b) => (b.disabled = true));

    if (selectedIdx === q.correct) {
      clickedBtn.classList.add('correct');
      feedbackEl.textContent = '✓ ¡Correcto! ' + q.explanation;
      feedbackEl.style.color = '#2e7d32';
      score++;
    } else {
      clickedBtn.classList.add('incorrect');
      allBtns[q.correct].classList.add('reveal-correct');
      feedbackEl.textContent = '✗ ' + q.explanation;
      feedbackEl.style.color = '#c62828';
    }

    setTimeout(() => {
      current++;
      if (current < questions.length) {
        showQuestion(current);
      } else {
        showResult();
      }
    }, 1800);
  }

  function showResult() {
    cardEl.style.display   = 'none';
    resultEl.style.display = 'block';

    const pct = Math.round((score / questions.length) * 100);
    let emoji = pct >= 80 ? '🏆' : pct >= 50 ? '💗' : '🌸';
    let msg = '';

    if (pct === 100) {
      msg = `${emoji} ¡Perfecto! ${score}/${questions.length}. ¡Sos mi mejor amig@ y me conocés de memoria!`;
    } else if (pct >= 60) {
      msg = `${emoji} ¡Muy bien! ${score}/${questions.length}. Definitivamente me conocés bastante bien.`;
    } else {
      msg = `${emoji} ${score}/${questions.length}. Hay que pasar más tiempo juntos para conocernos mejor 🥰`;
    }
    scoreText.textContent = msg;
  }

  restartBtn?.addEventListener('click', () => {
    current = 0; score = 0;
    cardEl.style.display   = 'block';
    resultEl.style.display = 'none';
    showQuestion(0);
  });

  showQuestion(0);
}

/* =============================================
   PLAYLIST
   ============================================= */
function initPlaylist() {
  const form       = document.getElementById('playlist-form');
  const container  = document.getElementById('playlist-suggestions');
  const songInput  = document.getElementById('song-name');
  const artistInput = document.getElementById('artist-name');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const song   = songInput.value.trim();
    const artist = artistInput.value.trim();
    if (!song || !artist) return;

    const item = document.createElement('div');
    item.className = 'playlist-item';
    item.innerHTML = `
      <div class="playlist-item-icon"><i class="fas fa-music"></i></div>
      <div class="playlist-item-text">
        <strong>${escapeHtml(song)}</strong>
        <span>${escapeHtml(artist)}</span>
      </div>
    `;
    container.prepend(item);

    songInput.value   = '';
    artistInput.value = '';
    songInput.focus();
  });
}

/* =============================================
   RSVP FORM
   ============================================= */
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

  // Toggle Sí / No
  yesBtn?.addEventListener('click', () => {
    yesBtn.classList.add('active');
    noBtn.classList.remove('active');
    attendingEl.value = 'si';
    extraEl.style.display = 'block';
  });

  noBtn?.addEventListener('click', () => {
    noBtn.classList.add('active');
    yesBtn.classList.remove('active');
    attendingEl.value = 'no';
    extraEl.style.display = 'none';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name      = document.getElementById('rsvp-name').value.trim();
    const attending = attendingEl.value;
    const guests    = document.getElementById('rsvp-guests').value;
    const food      = document.getElementById('rsvp-food').value;
    const message   = document.getElementById('rsvp-message').value.trim();

    if (!name) return;

    // Loading state
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;

    const payload = {
      nombre: name,
      asistencia: attending,
      cantidad_personas: attending === 'si' ? parseInt(guests) : 0,
      preferencia_alimenticia: attending === 'si' ? food : 'N/A',
      mensaje: message,
      timestamp: new Date().toISOString(),
      evento: 'XV Años Valentina'
    };

    try {
      // ✏️ Si el webhook no está configurado, simula éxito
      if (CONFIG.webhookURL.includes('TU_URL')) {
        await new Promise((res) => setTimeout(res, 1200)); // Simula delay
      } else {
        await fetch(CONFIG.webhookURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      // Mostrar éxito
      form.style.display = 'none';
      successEl.style.display = 'block';

      if (attending === 'si') {
        successMsg.textContent = `¡Genial, ${name}! 🎉 Estamos tan felices de que vengas. ¡Te esperamos con los brazos abiertos el 19 de julio!`;
      } else {
        successMsg.textContent = `Gracias por avisarnos, ${name}. Te vamos a extrañar mucho. ¡Esperamos verte pronto!`;
      }

      // Scroll suave al éxito
      successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (err) {
      console.error('Error al enviar RSVP:', err);
      submitBtn.classList.remove('btn-loading');
      submitBtn.disabled = false;
      alert('Hubo un problema al enviar. Por favor intentá de nuevo.');
    }
  });
}

/* =============================================
   PARTÍCULAS FLOTANTES (Canvas)
   ============================================= */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Partículas: puntos dorados y rosas
  const particles = Array.from({ length: 28 }, () => ({
    x:  Math.random() * window.innerWidth,
    y:  Math.random() * window.innerHeight,
    r:  Math.random() * 2 + 1,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.2 - 0.15,
    alpha: Math.random() * 0.5 + 0.1,
    color: Math.random() > 0.5 ? '201,169,154' : '201,169,110',
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      if (p.x < -10) { p.x = canvas.width + 10; }
      if (p.x > canvas.width + 10) { p.x = -10; }
    });
    requestAnimationFrame(draw);
  }

  draw();
}

/* =============================================
   SMOOTH SCROLL PARA NAVEGACIÓN
   ============================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* =============================================
   UTILIDADES
   ============================================= */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* =============================================
   INIT — Esperar DOM listo
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initScrollReveal();
  initCountdown();
  initAudio();
  initGiftModal();
  initGallery();
  initTrivia();
  initPlaylist();
  initRSVP();
  initSmoothScroll();
});
