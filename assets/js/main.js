/* main.js — comportamento do site. Sem dependências. Cada bloco está explicado. */
(function () {
  'use strict';
  var ITP = window.ITP || {};                       // definido no <head> de cada página (ver build.js → head())

  /* 1. MENU MÓVEL --------------------------------------------------- */
  var tg = document.getElementById('menuToggle'), nav = document.getElementById('navlinks');
  if (tg && nav) tg.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    tg.setAttribute('aria-expanded', String(open));
    tg.textContent = open ? '×' : '☰';
  });

  /* 2. COOKIES + GOOGLE ANALYTICS + ADSENSE --------------------------
     O GA4 e o AdSense só são carregados depois de o visitante aceitar
     (ITP.consent = true em site.config.js). A escolha fica em localStorage. */
  var KEY = 'itp_consent', loaded = false;
  function store(v) { try { if (v) localStorage.setItem(KEY, v); else return localStorage.getItem(KEY); } catch (e) {} return null; }
  function loadScript(src, attrs) {
    var s = document.createElement('script'); s.async = true; s.src = src;
    for (var k in (attrs || {})) s.setAttribute(k, attrs[k]);
    document.head.appendChild(s); return s;
  }
  function loadTracking() {
    if (loaded) return; loaded = true;
    if (ITP.ga && ITP.ga.indexOf('XXXX') < 0) {     // Google Analytics 4
      loadScript('https://www.googletagmanager.com/gtag/js?id=' + ITP.ga);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      gtag('js', new Date()); gtag('config', ITP.ga);
    }
    if (ITP.ads && document.querySelector('.adsbygoogle')) {   // AdSense (só em páginas com anúncios)
      loadScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ITP.ads, { crossorigin: 'anonymous' });
      document.querySelectorAll('.adsbygoogle').forEach(function () { (window.adsbygoogle = window.adsbygoogle || []).push({}); });
    }
  }
  function track(name, params) { if (window.gtag) gtag('event', name, params || {}); }
  var banner = document.getElementById('cookie');
  if (!ITP.consent) loadTracking();                  // sem banner: carrega logo
  else if (store() === 'yes') loadTracking();
  else if (!store() && banner) banner.hidden = false;
  if (banner) banner.addEventListener('click', function (e) {
    var b = e.target.closest('[data-consent]'); if (!b) return;
    store(b.dataset.consent); banner.hidden = true; if (b.dataset.consent === 'yes') loadTracking();
  });

  /* 3. EVENTOS DE CONVERSÃO (aparecem no GA4) ------------------------ */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a'); if (!a) return;
    if (/wa\.me/.test(a.href)) track('whatsapp_click', { link_url: a.href, page: location.pathname });
    if (a.dataset.ev) track(a.dataset.ev, { label: a.dataset.label || '', page: location.pathname });
  });

  /* 4. FORMULÁRIOS → WHATSAPP -----------------------------------------
     Qualquer <form data-wa-form> monta uma mensagem com os campos
     (usa o texto do <label>) e abre o WhatsApp da iTpraTi. */
  document.querySelectorAll('form[data-wa-form]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var lines = ['Olá iTpraTi! Quero pedir contacto.'];
      f.querySelectorAll('[name]').forEach(function (el) {
        if (el.type === 'checkbox' || !el.value.trim()) return;
        var lb = f.querySelector('label[for="' + el.id + '"]');
        lines.push((lb ? lb.textContent.trim() : el.name) + ': ' + el.value.trim());
      });
      lines.push('Origem: ' + location.pathname);
      var msg = f.querySelector('.form-message');
      if (msg) msg.textContent = 'A abrir o WhatsApp para confirmar e enviar o seu pedido…';
      track('form_submit', { form: f.id, page: location.pathname });
      window.open('https://wa.me/' + f.dataset.wa + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    });
  });

  /* 5. FILTRO DE CATEGORIAS NO BLOG ---------------------------------- */
  var chips = document.querySelectorAll('.chip');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (x) { x.classList.toggle('active', x === c); });
      document.querySelectorAll('.post-card').forEach(function (p) {
        p.hidden = c.dataset.cat !== 'all' && p.dataset.cat !== c.dataset.cat;
      });
    });
  });
})();
