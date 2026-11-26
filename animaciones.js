/* ==========================================================
   animaciones.js  -  Portafolio de Milagro
   Solo agrega movimiento. No cambia tu contenido ni tu diseño.
   Para quitarlo: borra la línea <script> en index.html.
   ========================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- 1. Pantalla de inicio: el nombre aparece letra por letra ---------- */
  if (!document.getElementById('intro')) {
    var d = document.createElement('div');
    d.id = 'intro';
    d.innerHTML = '<div id="introName">Milagro</div><div class="intro-line"></div>';
    document.body.insertBefore(d, document.body.firstChild);
  }
  var nm = document.getElementById('introName');
  if (nm) {
    var nombre = nm.textContent.trim();
    nm.setAttribute('aria-label', nombre);
    nm.textContent = '';
    nombre.split('').forEach(function (ch, i) {
      var s = document.createElement('span');
      s.textContent = ch;
      s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--i', i);
      nm.appendChild(s);
    });
  }
  var intro = document.getElementById('intro');
  if (intro) setTimeout(function () { intro.remove(); }, 4200);

  /* ---------- 2. Barra de progreso al hacer scroll ---------- */
  var bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.appendChild(bar);
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Títulos: la luz neón pasa letra por letra ---------- */
  var ioTitulos = hasIO ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { e.target.classList.toggle('on', e.isIntersecting); });
  }, { threshold: 0.2 }) : null;

  document.querySelectorAll('.section-headding h2').forEach(function (h) {
    var texto = h.textContent.trim();
    h.setAttribute('aria-label', texto);
    h.textContent = '';
    var n = 0;
    var palabras = texto.split(/\s+/);
    palabras.forEach(function (palabra, w) {
      var ws = document.createElement('span');
      ws.className = 'nl-word';
      ws.setAttribute('aria-hidden', 'true');
      palabra.split('').forEach(function (ch) {
        var s = document.createElement('span');
        s.className = 'nl';
        s.textContent = ch;
        s.style.setProperty('--i', n++);
        ws.appendChild(s);
      });
      h.appendChild(ws);
      if (w < palabras.length - 1) { h.appendChild(document.createTextNode(' ')); n++; }
    });
    h.classList.add('nl-title');
    if (ioTitulos) ioTitulos.observe(h); else h.classList.add('on');
  });

  /* ---------- 4. Aparecer al hacer scroll (con escalonado) ---------- */
  var grupos = [
    ['.about-img', 'rv-l'],
    ['.about-content', 'rv-r'],
    ['.contact-info', 'rv-l'],
    ['.contact-from', 'rv-r'],
    ['.info-box-1', ''],
    ['.portfolio-item', ''],
    ['.blog-item', ''],
    ['.cv-box', ''],
    ['.cv-video', ''],
    ['.resume-box', ''],
    ['.gallery', '']
  ];
  var conteo = new Map();
  var items = [];
  grupos.forEach(function (g) {
    document.querySelectorAll(g[0]).forEach(function (el) {
      var fila = el.closest('.row, .gallery') || el.parentNode;
      var n = conteo.get(fila) || 0;
      conteo.set(fila, n + 1);
      el.classList.add('rv');
      if (g[1]) el.classList.add(g[1]);
      el.style.setProperty('--d', (n * 0.12) + 's');
      items.push(el);
    });
  });
  if (hasIO) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('rv-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('rv-in'); });
  }

  /* ---------- Galería: carrusel automático ---------- */
  if (window.jQuery && jQuery.fn.owlCarousel) {
    jQuery('.gallery').addClass('owl-carousel').owlCarousel({
      loop: false, rewind: true, margin: 14, autoplay: true, autoplayTimeout: 3200,
      autoplayHoverPause: true, smartSpeed: 900, dots: true, nav: false,
      responsive: { 0: { items: 1 }, 576: { items: 2 }, 992: { items: 3 } }
    });
  }

  /* ---------- Carruseles genéricos (Work: Hydronexis, About: foto) ---------- */
  function hacerSlider(img, srcs, cls) {
    if (!img) return;
    var clase0 = img.className, ok = [], p = srcs.length;
    var exts = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG'];
    srcs.forEach(function (base) {
      base = base.replace(/\.jpg$/, '');
      var i = 0;
      (function probar() {
        if (i >= exts.length) { fin(); return; }
        var t = new Image();
        t.onload = function () { ok.push(base + exts[i]); fin(); };
        t.onerror = function () { i++; probar(); };
        t.src = base + exts[i];
      })();
    });
    function fin() {
      if (--p > 0 || !ok.length) return;
      ok.sort();
      var c = document.createElement('div');
      c.className = 'sl ' + cls;
      img.parentNode.insertBefore(c, img);
      c.appendChild(img);
      img.classList.add('on');
      ok.forEach(function (s) {
        var im = document.createElement('img');
        im.src = s; im.alt = img.alt; im.className = clase0;
        c.appendChild(im);
      });
      var fotos = c.querySelectorAll('img');
      var dots = document.createElement('div');
      dots.className = 'film-dots';
      fotos.forEach(function () { dots.appendChild(document.createElement('i')); });
      c.appendChild(dots);
      var pts = dots.querySelectorAll('i'), n = 0;
      function ver(k) {
        fotos.forEach(function (f, x) { f.classList.toggle('on', x === k); });
        pts.forEach(function (q, x) { q.classList.toggle('on', x === k); });
      }
      ver(0);
      setInterval(function () { n = (n + 1) % fotos.length; ver(n); }, 3800);
    }
  }
  hacerSlider(document.querySelector('.blog-item .thumbanil img.hydro'),
    ['assets/img/hydronexis2.jpg', 'assets/img/hydronexis3.jpg'], 'sl-work');
  hacerSlider(document.querySelector('.blog-item .thumbanil img[src*="tutoring"]'),
    ['assets/img/tutoring2.jpg', 'assets/img/tutoring3.jpg'], 'sl-work');
  hacerSlider(document.querySelector('.about-img img'),
    ['assets/img/milagro-about2.jpg', 'assets/img/milagro-about3.jpg'], 'sl-flow');

  /* ---------- Hobbies: carrusel de Period Films (hobby-films, 2 y 3) ---------- */
  var film = document.querySelector('#hobbies img[src*="hobby-films"]');
  if (film) {
    var extras = ['assets/img/hobby-films2.jpg', 'assets/img/hobby-films3.jpg'];
    var cargadas = [], pendientes = extras.length;
    extras.forEach(function (src) {
      var t = new Image();
      t.onload = function () { cargadas.push(src); fin(); };
      t.onerror = function () { fin(); };
      t.src = src;
    });
    function fin() {
      if (--pendientes > 0 || !cargadas.length) return;
      cargadas.sort();
      var cont = document.createElement('div');
      cont.className = 'film-slider';
      film.parentNode.insertBefore(cont, film);
      film.classList.add('on');
      cont.appendChild(film);
      cargadas.forEach(function (src) {
        var im = document.createElement('img');
        im.className = 'card-photo';
        im.src = src; im.alt = 'Period films';
        cont.appendChild(im);
      });
      var fotos = cont.querySelectorAll('img');
      var dots = document.createElement('div');
      dots.className = 'film-dots';
      fotos.forEach(function () { dots.appendChild(document.createElement('i')); });
      cont.appendChild(dots);
      var pts = dots.querySelectorAll('i'), n = 0;
      function ver(k) {
        fotos.forEach(function (f, x) { f.classList.toggle('on', x === k); });
        pts.forEach(function (p, x) { p.classList.toggle('on', x === k); });
      }
      ver(0);
      setInterval(function () { n = (n + 1) % fotos.length; ver(n); }, 3500);
    }
  }

  /* ---------- Hobbies: ecualizador que sube y baja debajo de la playlist ---------- */
  var iconoMusica = document.querySelector('#hobbies .fa-music');
  if (iconoMusica) {
    var caja = iconoMusica.closest('.info-box-1-inner');
    var medio = caja && caja.querySelector('.card-photo');
    if (medio) {
      var eq = document.createElement('div');
      eq.className = 'eq';
      eq.setAttribute('aria-hidden', 'true');
      for (var k = 0; k < 28; k++) {
        var b = document.createElement('i');
        b.style.setProperty('--i', k);
        b.style.setProperty('--r', k % 5);
        eq.appendChild(b);
      }
      medio.insertAdjacentElement('afterend', eq);
    }
  }

  /* ---------- 5. Home: partículas de luz flotando ---------- */
  var hero = document.querySelector('.hero-section2');
  if (hero && !reduce) {
    var wrap = document.createElement('div');
    wrap.className = 'hero-particles';
    for (var i = 0; i < 26; i++) {
      var p = document.createElement('i');
      var size = 4 + Math.random() * 10;
      p.style.cssText =
        'left:' + (Math.random() * 100) + '%;' +
        'width:' + size + 'px;height:' + size + 'px;' +
        'animation-duration:' + (7 + Math.random() * 9) + 's;' +
        'animation-delay:' + (Math.random() * -12) + 's;' +
        '--x:' + (Math.random() * 120 - 60) + 'px;';
      wrap.appendChild(p);
    }
    hero.insertBefore(wrap, hero.firstChild);
  }

  /* ---------- 6. Tarjetas que se inclinan con el mouse ---------- */
  if (canHover && !reduce) {
    document.querySelectorAll('.info-box-1, .blog-item').forEach(function (c) {
      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        c.style.setProperty('--ry', (x * 8) + 'deg');
        c.style.setProperty('--rx', (-y * 8) + 'deg');
      });
      c.addEventListener('mouseleave', function () {
        c.style.setProperty('--rx', '0deg');
        c.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------- 7. Luz azul que sigue al mouse ---------- */
  if (canHover && !reduce) {
    var glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    var tx = 0, ty = 0, x = 0, y = 0;
    window.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      glow.style.opacity = 1;
    });
    (function loop() {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      glow.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- 8. Contact: frase que se escribe sola ---------- */
  var cab = document.querySelector('#contact .contact-from');
  if (cab) {
    var frase = document.createElement('p');
    frase.id = 'frase';
    cab.appendChild(frase);
    // Cambia estas frases por las que quieras:
    var frases = [
      "Let's build something amazing together.",
      "Open to learning, growing and collaborating.",
      "Say hello. I'd love to hear from you."
    ];
    if (reduce) {
      frase.textContent = frases[0];
    } else {
      var f = 0, c = 0, borrando = false;
      (function escribir() {
        var actual = frases[f];
        c += borrando ? -1 : 1;
        frase.textContent = actual.slice(0, c);
        var espera = borrando ? 35 : 75;
        if (!borrando && c === actual.length) { borrando = true; espera = 1800; }
        else if (borrando && c === 0) { borrando = false; f = (f + 1) % frases.length; espera = 400; }
        setTimeout(escribir, espera);
      })();
    }
  }
})();
