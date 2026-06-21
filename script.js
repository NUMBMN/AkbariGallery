/* ============================================================
   CONFIG — ویرایش تنظیمات سایت از همین بخش
   ============================================================ */
const CONFIG = {
  name: "MOBINN",
  tagline: "درود، 🍇 انگور هستم خوشوقتم😭😂",

  typedWords: ["اذیت کننده خالص", "دهنتو اسفالت میکنم", "خلاق ترین توسعه دهندم", "خواهیم دید چه خواهد شد"],

  // لیست تصاویر گالری — اسم فایل‌هایی که داخل assets/images گذاشتی رو اینجا اضافه کن
  galleryImages: [
    "akbari-1.jpg",
    "akbari-2.png",
    "akbari-3.jpg",
    "akbari-4.jpg",
    "akbari-5.png",
    // فایل‌های بیشتر را داخل assets/images بگذار و اسمشان را اینجا اضافه کن
  ],

  // پس‌زمینه: "image" یا "video"
  backgroundType: "image",
  backgroundImage: "assets/background.jpg",
  backgroundVideo: "assets/background.mp4",

  loadingLogo: "MOBINN",
  loadingText: "یه کوشولو صبر کن الان بود میشه😍😂😂",

  primaryColor: "#00f0ff", // رنگ اصلی سایت (نئون)
};

/* ============================================================
   SMALL HELPER — هر بخش جدا اجرا می‌شه تا اگه یه بخش خطا داد
   بقیه‌ی بخش‌ها (مثل دکمه تم) از کار نیفتن
   ============================================================ */
function safeRun(label, fn){
  try { fn(); } catch (err) { console.error(`[${label}] error:`, err); }
}

/* ============================================================
   APPLY CONFIG TO DOM
   ============================================================ */
safeRun('apply-config', () => {
  document.documentElement.style.setProperty('--accent', CONFIG.primaryColor);
  document.getElementById('profile-name').textContent = CONFIG.name;
  document.getElementById('profile-tagline').textContent = CONFIG.tagline;
  document.getElementById('loading-logo').textContent = CONFIG.loadingLogo;
  document.getElementById('loading-text').textContent = CONFIG.loadingText;
  document.getElementById('footer-year').textContent = new Date().getFullYear();
});

/* ============================================================
   THEME TOGGLE (dark / light) — این بخش زود اجرا می‌شه و
   مستقل از بقیه‌ی بخش‌هاست تا همیشه کار کنه
   ============================================================ */
safeRun('theme-toggle', () => {
  const btn = document.getElementById('theme-toggle');
  const icon = btn.querySelector('i');

  function applyTheme(theme){
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      document.documentElement.removeAttribute('data-theme');
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  }

  const saved = localStorage.getItem('site_theme');
  applyTheme(saved === 'light' ? 'light' : 'dark');

  btn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('site_theme', next);
  });
});

/* ============================================================
   SCROLL TO TOP
   ============================================================ */
safeRun('scroll-top', () => {
  const scrollTopBtn = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  });
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});

/* ============================================================
   MUSIC PLAYER — پخش خودکار + جلوه نئونی بنفش دور صفحه
   ============================================================ */
safeRun('music-player', () => {
  const audio = document.getElementById('bg-audio');
  const toggleBtn = document.getElementById('music-toggle');
  const icon = document.getElementById('music-icon');
  const stateText = document.getElementById('music-state-text');
  const widget = document.querySelector('.music-widget');
  const volume = document.getElementById('volume-slider');
  const glowFrame = document.getElementById('music-glow-frame');

  audio.volume = volume.value / 100;

  function setPlayingUI(isPlaying){
    if (isPlaying) {
      icon.classList.remove('fa-play'); icon.classList.add('fa-pause');
      stateText.textContent = 'در حال پخش';
      widget.classList.add('playing');
      if (glowFrame) glowFrame.classList.add('active');
    } else {
      icon.classList.remove('fa-pause'); icon.classList.add('fa-play');
      stateText.textContent = 'متوقف';
      widget.classList.remove('playing');
      if (glowFrame) glowFrame.classList.remove('active');
    }
  }

  function tryPlay(){
    return audio.play().then(() => { setPlayingUI(true); return true; })
      .catch(() => { setPlayingUI(false); return false; });
  }

  // تلاش برای پخش خودکار به محض اینکه سایت بالا اومد (بعد از صفحه‌ی لودینگ)
  function attemptAutoplay(){
    tryPlay().then((started) => {
      if (!started) {
        // اگه مرورگر پخش خودکار رو بلاک کرد، با اولین لمس/کلیک/اسکرول کاربر شروع می‌شه
        const resumeOnGesture = () => {
          tryPlay();
          ['click', 'touchstart', 'keydown', 'scroll'].forEach(ev =>
            document.removeEventListener(ev, resumeOnGesture));
        };
        ['click', 'touchstart', 'keydown', 'scroll'].forEach(ev =>
          document.addEventListener(ev, resumeOnGesture, { once: true, passive: true }));
      }
    });
  }
  document.addEventListener('site:ready', attemptAutoplay, { once: true });

  toggleBtn.addEventListener('click', () => {
    if (audio.paused) {
      tryPlay().then(started => {
        if (!started) stateText.textContent = 'فایل music.mp3 یافت نشد';
      });
    } else {
      audio.pause();
      setPlayingUI(false);
    }
  });

  volume.addEventListener('input', () => { audio.volume = volume.value / 100; });

  /* ---- جلوه‌ی نئونی بنفش که شدتش با صدای آهنگ هماهنگ می‌شه ---- */
  safeRun('music-glow-reactive', () => {
    if (!glowFrame) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    let ctx, analyser, dataArray, ready = false;

    function setupAnalyser(){
      if (ready) return;
      ready = true;
      ctx = new AudioCtx();
      const source = ctx.createMediaElementSource(audio);
      analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      tick();
    }

    function tick(){
      requestAnimationFrame(tick);
      if (!analyser || audio.paused) return;
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      const intensity = Math.min(1, avg / 110);
      glowFrame.style.setProperty('--glow-intensity', intensity.toFixed(2));
    }

    audio.addEventListener('play', () => {
      if (ctx && ctx.state === 'suspended') ctx.resume();
      setupAnalyser();
    });
  });
});

/* ============================================================
   LOADING SCREEN
   ============================================================ */
safeRun('loading-screen', () => {
  const fill = document.getElementById('loading-bar-fill');
  const percentEl = document.getElementById('loading-percent');
  const screen = document.getElementById('loading-screen');
  let p = 0;
  document.body.style.overflow = 'hidden';
  const timer = setInterval(() => {
    p += Math.random() * 18;
    if (p >= 100) {
      p = 100;
      clearInterval(timer);
      setTimeout(() => {
        screen.classList.add('hidden');
        document.body.style.overflow = 'auto';
        document.querySelectorAll('.reveal').forEach((el, i) => {
          if (el.getBoundingClientRect().top < window.innerHeight) {
            setTimeout(() => el.classList.add('visible'), i * 80);
          }
        });
        document.dispatchEvent(new CustomEvent('site:ready'));
      }, 350);
    }
    fill.style.width = p + '%';
    percentEl.textContent = Math.floor(p) + '%';
  }, 180);
});

/* ============================================================
   BACKGROUND (image / video)
   ============================================================ */
safeRun('background', () => {
  const img = document.getElementById('bg-image');
  const vid = document.getElementById('bg-video');

  if (CONFIG.backgroundType === 'video') {
    const source = document.createElement('source');
    source.src = CONFIG.backgroundVideo;
    source.type = 'video/mp4';
    vid.appendChild(source);
    vid.addEventListener('loadeddata', () => vid.classList.add('active'));
  } else {
    img.src = CONFIG.backgroundImage;
    img.addEventListener('load', () => img.classList.add('active'));
    img.addEventListener('error', () => { img.classList.remove('active'); });
  }
});

/* ============================================================
   PARTICLES BACKGROUND
   ============================================================ */
safeRun('particles', () => {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, particlesArr = [];
  const COLORS = ['#00f0ff', '#a64dff', '#ff2e9a'];

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function Particle(){
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.r = Math.random() * 1.8 + 0.6;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha = Math.random() * 0.5 + 0.2;
  }

  const COUNT = Math.min(90, Math.floor((w * h) / 18000));
  for (let i = 0; i < COUNT; i++) particlesArr.push(new Particle());

  function tick(){
    ctx.clearRect(0, 0, w, h);
    particlesArr.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }
  tick();
});

/* ============================================================
   TYPED TEXT EFFECT
   ============================================================ */
safeRun('typed-text', () => {
  const el = document.getElementById('typed-text');
  const words = CONFIG.typedWords;
  let wi = 0, ci = 0, deleting = false;

  function step(){
    const word = words[wi];
    if (!deleting) {
      ci++;
      el.textContent = word.slice(0, ci);
      if (ci === word.length) { deleting = true; setTimeout(step, 1400); return; }
    } else {
      ci--;
      el.textContent = word.slice(0, ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(step, deleting ? 45 : 90);
  }
  step();
});

/* ============================================================
   LIVE CLOCK & DATE
   ============================================================ */
safeRun('clock', () => {
  const clockEl = document.getElementById('live-clock');
  const dateEl = document.getElementById('live-date');
  function update(){
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('fa-IR');
    dateEl.textContent = now.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  update();
  setInterval(update, 1000);
});

/* ============================================================
   VISIT COUNTER (local, no backend needed)
   ============================================================ */
safeRun('visit-counter', () => {
  const el = document.getElementById('visit-count');
  let count = parseInt(localStorage.getItem('site_visit_count') || '0', 10);
  count += 1;
  localStorage.setItem('site_visit_count', count);
  el.textContent = count.toLocaleString('fa-IR');
});

/* ============================================================
   GALLERY (auto-build from CONFIG.galleryImages)
   ساده — بدون افکت هاور و بدون بزرگ‌نمایی، فقط نمایش با انیمیشن محو شدن
   ============================================================ */
safeRun('gallery', () => {
  const grid = document.getElementById('gallery-grid');
  const emptyMsg = document.getElementById('gallery-empty');

  if (!CONFIG.galleryImages.length) {
    emptyMsg.hidden = false;
    return;
  }

  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('shown');
        galleryObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  CONFIG.galleryImages.forEach((file, idx) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = `assets/images/${file}`;
    img.alt = `تصویر ${idx + 1}`;
    img.loading = 'lazy';
    img.onerror = () => { item.remove(); };

    item.appendChild(img);
    grid.appendChild(item);
    galleryObserver.observe(item);
  });
});

/* ============================================================
   SCROLL REVEAL ANIMATIONS
   ============================================================ */
safeRun('scroll-reveal', () => {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});
