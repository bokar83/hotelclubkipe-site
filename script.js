/* =====================================================
   HOTEL CLUB DE KIPE v4
   FR fires immediately. Geo async. Safe DOM only.
   ===================================================== */
'use strict';

var T = {
  fr:{
    nav_about:'A propos',nav_rooms:'Chambres',nav_svc:'Services',nav_gallery:'Galerie',nav_book:'Reserver',
    hero_since:'Depuis 2019',hero_loc:'Conakry, Guinee',
    hw1:'Hotel',hw2:'Club',hw3:'de Kipe',
    hero_sub:'Votre refuge prive au coeur de Kipe',
    hero_explore:'Decouvrir',hero_book:'Reserver',scroll_lbl:'Defiler',
    about_ey:'Notre histoire',about_h2:'Un havre de paix, discret et chaleureux',
    about_p1:"Niche dans le quartier residentiel de Kipe, un refuge pour ceux qui recherchent l'intimite, le confort et la discretion.",
    about_p2:"Nos 13 chambres sur trois niveaux combinent l'hospitalite guineenne avec des equipements modernes: climatisation, Wi-Fi, restaurant, piscine, bar.",
    st_rooms:'Chambres',st_floors:'Niveaux',st_since:'Depuis',
    about_pull:"Une maison, pas un hotel. Treize chambres ouvertes depuis 2019 sur les jardins de Kipe.",
    about_attr:"Hotel Club de Kipe, Conakry",
    spot_h2a:'Notre chambre',spot_h2b:'signature',
    rooms_ey:'Nos hebergements',rooms_h2:'Choisissez votre chambre',
    rooms_note:'Climatisation - Wi-Fi gratuit - Salle de bain privee',
    b_std:'Standard',b_mini:'Mini Suite',b_suite:'Suite',
    r_std:'Chambre Standard',r_mini:'Mini Suite',r_suite:'Suite',
    f_ac:'Climatisation',f_wifi:'Wi-Fi',f_bath:'Bain prive',f_tv:'Television',f_sitting:'Coin salon',f_desk:'Bureau',
    cur:'FG',pn:'/ nuit',btn_bk:'Reserver',
    sf_ey:"L art du detail",sf_h2:'Un confort pense dans les moindres details',
    sf_p:"Chaque chambre est equipee d une salle de bain privee, d une climatisation silencieuse et d une literie soignee.",
    sf_cta:'Voir les chambres',
    svc_ey:'Ce que nous offrons',svc_h2:'Nos services',
    svc_pool:'Piscine',svc_pool_d:'Detente dans un cadre verdoyant et prive.',
    svc_resto:'Restaurant',svc_resto_d:'Cuisine guineenne et internationale.',
    svc_bar:'Bar',svc_bar_d:'Cocktails et boissons fraiches en soiree.',
    svc_wifi:'Wi-Fi Gratuit',svc_wifi_d:'Connexion haut debit partout.',
    svc_park:'Parking Prive',svc_park_d:'Securise et gratuit pour tous.',
    svc_priv:'Discretion totale',svc_priv_d:'Un cadre prive, loin du tumulte.',
    gal_ey:'Nos espaces',gal_h2:'Galerie',gal_more:'Voir les 21 photos',gal_less:'Reduire',
    rev_ey:'Avis clients',
    r1:'Un endroit magnifique. Tres propre, calme, personnel accueillant. La piscine est parfaite. Je reviendrai.',
    r1a:'Mamadou D.',r1l:'Conakry, Guinee',
    r2:'Sejour parfait pour un voyage affaires. Chambre confortable, Wi-Fi fiable, restaurant excellent.',
    r2a:'Ibrahim K.',r2l:'Dakar, Senegal',
    r3:'La meilleure adresse a Kipe. Discretion totale, espace prive. Le bar en soiree est une vraie surprise.',
    r3a:'Fatoumata B.',r3l:'Conakry, Guinee',
    pq:'Intimite - Confort - Discretion - Kipe - Conakry',
    map_ey:'Nous trouver',map_h2:'Ou nous sommes',
    mi_addr:'Adresse',mi_tel:'Telephone',mi_hrs:'Horaires',mi_hrs_v:'Reception 24h/24',
    map_open:'Ouvrir dans Google Maps',
    bk_ey:'Reserver',bk_h2:'Planifiez votre sejour',
    bk_desc:'Remplissez le formulaire ou ecrivez sur WhatsApp. Reponse sous 24 heures.',
    wa_cta:'Reserver via WhatsApp',
    fl_name:'Nom complet',fl_phone:'Telephone / WhatsApp',fl_ci:'Arrivee',fl_co:'Depart',
    fl_room:'Chambre',fl_ph:'Choisir',
    o_std1:'Standard 1er etage - 600 000 FG',o_std2:'Standard 2e/3e etage - 800 000 FG',
    o_mini:'Mini Suite - 1 000 000 FG',o_suite:'Suite - 1 200 000 FG',
    fl_notes:'Message (optionnel)',fl_sub:'Envoyer la demande',fl_note:'Confirmation sous 24 heures.',
    ft_tag:'Votre refuge elegant a Conakry.',ft_maps:'Voir sur Google Maps',statement:"Un refuge discret pour ceux qui savent.",
    ft_rights:'Tous droits reserves.'
  },
  en:{
    nav_about:'About',nav_rooms:'Rooms',nav_svc:'Services',nav_gallery:'Gallery',nav_book:'Book Now',
    hero_since:'Est. 2019',hero_loc:'Conakry, Guinea',
    hw1:'Hotel',hw2:'Club',hw3:'de Kipe',
    hero_sub:'Your private retreat in the heart of Kipe',
    hero_explore:'Discover',hero_book:'Book a Room',scroll_lbl:'Scroll',
    about_ey:'Our story',about_h2:'A peaceful haven, private and warm',
    about_p1:'Nestled in the quiet neighbourhood of Kipe in Conakry, a retreat for those who seek intimacy, comfort, and discretion.',
    about_p2:'Our 13 rooms across three floors blend Guinean hospitality with modern amenities: air conditioning, Wi-Fi, restaurant, pool, bar.',
    st_rooms:'Rooms',st_floors:'Floors',st_since:'Est.',
    about_pull:"A home, not a hotel. Thirteen rooms open since 2019 among the gardens of Kipe.",
    about_attr:"Hotel Club de Kipe, Conakry",
    spot_h2a:'Our signature',spot_h2b:'suite',
    rooms_ey:'Our accommodations',rooms_h2:'Choose your room',
    rooms_note:'Air conditioning - Free Wi-Fi - Private bathroom',
    b_std:'Standard',b_mini:'Mini Suite',b_suite:'Suite',
    r_std:'Standard Room',r_mini:'Mini Suite',r_suite:'Suite',
    f_ac:'Air conditioning',f_wifi:'Wi-Fi',f_bath:'Private bathroom',f_tv:'Television',f_sitting:'Sitting area',f_desk:'Work desk',
    cur:'GNF',pn:'/ night',btn_bk:'Book',
    sf_ey:'The art of detail',sf_h2:'Comfort crafted down to the finest details',
    sf_p:'Every room features a private tiled bathroom, silent air conditioning, and carefully chosen bedding.',
    sf_cta:'View rooms',
    svc_ey:'What we offer',svc_h2:'Our services',
    svc_pool:'Swimming Pool',svc_pool_d:'Relax by the water in a lush, private setting.',
    svc_resto:'Restaurant',svc_resto_d:'Authentic Guinean and international cuisine.',
    svc_bar:'Bar',svc_bar_d:'Cocktails and fresh drinks in the evening.',
    svc_wifi:'Free Wi-Fi',svc_wifi_d:'High-speed connection throughout.',
    svc_park:'Private Parking',svc_park_d:'Secure, free parking for all guests.',
    svc_priv:'Total discretion',svc_priv_d:'A private setting, far from the city noise.',
    gal_ey:'Our spaces',gal_h2:'Gallery',gal_more:'View all 21 photos',gal_less:'Collapse',
    rev_ey:'Guest reviews',
    r1:'A magnificent place. Very clean, calm, wonderfully welcoming. The pool is perfect. I will return.',
    r1a:'Mamadou D.',r1l:'Conakry, Guinea',
    r2:'Perfect stay for a business trip. Comfortable room, reliable Wi-Fi, excellent restaurant.',
    r2a:'Ibrahim K.',r2l:'Dakar, Senegal',
    r3:'The best address in Kipe. Total discretion, private space. The bar in the evening is a real surprise.',
    r3a:'Fatoumata B.',r3l:'Conakry, Guinea',
    pq:'Intimacy - Comfort - Discretion - Kipe - Conakry',
    map_ey:'Find us',map_h2:'Where we are',
    mi_addr:'Address',mi_tel:'Phone',mi_hrs:'Hours',mi_hrs_v:'Reception 24/7',
    map_open:'Open in Google Maps',
    bk_ey:'Book',bk_h2:'Plan your stay',
    bk_desc:'Fill in the form or message us on WhatsApp. We respond within 24 hours.',
    wa_cta:'Book via WhatsApp',
    fl_name:'Full name',fl_phone:'Phone / WhatsApp',fl_ci:'Check-in',fl_co:'Check-out',
    fl_room:'Room type',fl_ph:'Select',
    o_std1:'Standard 1st floor - 600 000 GNF',o_std2:'Standard 2nd/3rd floor - 800 000 GNF',
    o_mini:'Mini Suite - 1 000 000 GNF',o_suite:'Suite - 1 200 000 GNF',
    fl_notes:'Message (optional)',fl_sub:'Send request',fl_note:'Confirmation within 24 hours.',
    ft_tag:'Your elegant retreat in Conakry.',ft_maps:'View on Google Maps',statement:"A private retreat for those who know.",
    ft_rights:'All rights reserved.'
  }
};

var lang = 'fr';

function applyLang(l) {
  lang = l;
  document.documentElement.lang = l;
  var t = T[l];
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var k = el.dataset.i18n;
    if (t[k] !== undefined) el.textContent = t[k];
  });
  document.querySelectorAll('[data-i18n-word]').forEach(function(el) {
    var k = el.dataset.i18nWord;
    if (t[k] !== undefined) el.textContent = t[k];
  });
  var fr = document.getElementById('fr-btn');
  var en = document.getElementById('en-btn');
  if (fr) { fr.classList.toggle('active', l === 'fr'); fr.setAttribute('aria-pressed', String(l === 'fr')); }
  if (en) { en.classList.toggle('active', l === 'en'); en.setAttribute('aria-pressed', String(l === 'en')); }
}

document.addEventListener('DOMContentLoaded', function() { applyLang('fr'); });

function detectLangAsync() {
  var frCodes = ['GN','FR','BE','CH','CI','SN','ML','CM','GW','CD','CG','TG','BJ','BF','NE','GA','DJ','MG','MA','TN','RW'];
  fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3500) })
    .then(function(r) { return r.json(); })
    .then(function(d) { if (!frCodes.includes(d.country)) applyLang('en'); })
    .catch(function() { if (!navigator.language || !navigator.language.startsWith('fr')) applyLang('en'); });
}

function initCursor() {
  if (!window.matchMedia('(pointer:fine)').matches) return;
  var dot = document.getElementById('cursor');
  var ring = document.getElementById('cursor-ring');
  if (!dot) return;
  var mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', function(e) { mx=e.clientX; my=e.clientY; });
  (function tick(){
    rx+=(mx-rx)*.12; ry+=(my-ry)*.12;
    dot.style.left=mx+'px'; dot.style.top=my+'px';
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(tick);
  })();
  document.querySelectorAll('a,button,.magnetic').forEach(function(el) {
    var isLink = el.tagName === 'A' || el.tagName === 'BUTTON';
    el.addEventListener('mouseenter', function() { document.body.classList.add(isLink ? 'c-link' : 'c-hover'); });
    el.addEventListener('mouseleave', function() { document.body.classList.remove('c-hover','c-link'); });
  });
}

function initMagnetic() {
  if (typeof gsap === 'undefined') return;
  document.querySelectorAll('.magnetic').forEach(function(btn) {
    btn.addEventListener('mousemove', function(e) {
      var r = btn.getBoundingClientRect();
      gsap.to(btn, { x:(e.clientX-(r.left+r.width/2))*.3, y:(e.clientY-(r.top+r.height/2))*.3, duration:.5, ease:'power2.out' });
    });
    btn.addEventListener('mouseleave', function() { gsap.to(btn, { x:0, y:0, duration:.7, ease:'power2.out' }); });
  });
}

function initHero() {
  var navEl = document.getElementById('nav');
  var tag   = document.querySelector('.hero-eyebrow');
  var words = document.querySelectorAll('.hero-h1 .word');
  var sub   = document.querySelector('.hero-sub');
  var ctas  = document.querySelector('.hero-ctas');
  var scrollCue = document.querySelector('.hero-scroll-cue');

  if (navEl) navEl.classList.add('on-hero');
  window.addEventListener('scroll', function() {
    var past = window.scrollY > window.innerHeight * 0.6;
    if (navEl) navEl.classList.toggle('on-hero', !past);
  }, { passive:true });

  if (typeof gsap === 'undefined') {
    [tag,sub,ctas,scrollCue].forEach(function(el) { if(el) { el.style.opacity='1'; } });
    words.forEach(function(w) { w.style.transform='none'; });
    return;
  }

  var tl = gsap.timeline({ delay:0.15 });
  tl.to(tag,  { opacity:1, duration:.6, ease:'power2.out' }, 0)
    .to(words, { y:'0%', stagger:.12, duration:.9, ease:'power3.out' }, 0.2)
    .to(sub,   { opacity:1, duration:.6, ease:'power2.out' }, 0.8)
    .to(ctas,  { opacity:1, duration:.5, ease:'power2.out' }, 1.0)
    .to(scrollCue, { opacity:1, duration:.5 }, 1.3);

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('#hero-img', {
      yPercent:18, ease:'none',
      scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:1.4 }
    });
  }
}

function initReveal() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      obs.unobserve(entry.target);
    });
  }, { threshold:0.1 });

  document.querySelectorAll('.si,.sw').forEach(function(el) {
    if (!el.style.getPropertyValue('--d')) {
      var sibs = Array.from(el.parentElement.querySelectorAll('.si,.sw'));
      var idx = sibs.indexOf(el);
      el.style.setProperty('--d', (idx * 0.07) + 's');
    }
    obs.observe(el);
  });
}

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.parallax-img').forEach(function(img) {
    var trigger = img.closest('section') || img.closest('[class]') || img;
    gsap.fromTo(img, { yPercent:-8 }, {
      yPercent:8, ease:'none',
      scrollTrigger:{ trigger:trigger, start:'top bottom', end:'bottom top', scrub:1.2 }
    });
  });
}

function initNav() {
  var nav   = document.getElementById('nav');
  var burg  = document.getElementById('burger');
  var draw  = document.getElementById('drawer');
  var scrim = document.getElementById('drawer-scrim');
  if (!nav || !burg || !draw) return;

  window.addEventListener('scroll', function() { nav.classList.toggle('scrolled', window.scrollY > 50); }, { passive:true });

  function openDrawer() { draw.classList.add('open'); if(scrim) scrim.classList.add('open'); burg.classList.add('open'); burg.setAttribute('aria-expanded','true'); draw.setAttribute('aria-hidden','false'); }
  function closeDrawer() { draw.classList.remove('open'); if(scrim) scrim.classList.remove('open'); burg.classList.remove('open'); burg.setAttribute('aria-expanded','false'); draw.setAttribute('aria-hidden','true'); }

  burg.addEventListener('click', function() { draw.classList.contains('open') ? closeDrawer() : openDrawer(); });
  if (scrim) scrim.addEventListener('click', closeDrawer);
  draw.querySelectorAll('a').forEach(function(a) { a.addEventListener('click', closeDrawer); });

  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 74, behavior:'smooth' });
    });
  });
}

function initGallery() {
  var showBtn = document.getElementById('show-all');
  var hideBtn = document.getElementById('hide-all');
  var full    = document.getElementById('gal-full');
  if (!showBtn || !full) return;
  showBtn.addEventListener('click', function() {
    full.removeAttribute('hidden');
    var moreRow = showBtn.closest('.gal-more-row');
    if (moreRow) moreRow.style.display = 'none';
    full.scrollIntoView({ behavior:'smooth', block:'start' });
  });
  if (hideBtn) {
    hideBtn.addEventListener('click', function() {
      full.setAttribute('hidden', '');
      var moreRow = showBtn.closest('.gal-more-row');
      if (moreRow) moreRow.style.display = '';
      var galSec = document.getElementById('gallery');
      if (galSec) galSec.scrollIntoView({ behavior:'smooth', block:'start' });
    });
  }
}

var PHOTOS = Array.from({length:21}, function(_, i) {
  return 'Photos du Hotel et Club/HCKroom_' + (i < 9 ? '0' : '') + (i+1) + '.jpg';
});
var lbIdx = 0;

function openLb(idx) {
  var lb  = document.getElementById('lb');
  var lbI = document.getElementById('lb-img');
  var lbCt= document.getElementById('lb-ct');
  if (!lb) return;
  lbIdx = idx;
  lbI.src = PHOTOS[lbIdx];
  lbI.alt = 'Hotel Club de Kipe - Photo ' + (lbIdx+1);
  lbCt.textContent = (lbIdx+1) + ' / ' + PHOTOS.length;
  lb.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  var xBtn = document.getElementById('lb-x');
  if (xBtn) xBtn.focus();
}

function initLightbox() {
  var lb  = document.getElementById('lb');
  var lbI = document.getElementById('lb-img');
  var lbCt= document.getElementById('lb-ct');
  if (!lb) return;

  function closeLb() { lb.setAttribute('hidden',''); document.body.style.overflow=''; }
  function go(d) {
    lbIdx = (lbIdx + d + PHOTOS.length) % PHOTOS.length;
    lbI.src = PHOTOS[lbIdx];
    lbI.alt = 'Hotel Club de Kipe - Photo ' + (lbIdx+1);
    lbCt.textContent = (lbIdx+1) + ' / ' + PHOTOS.length;
  }

  var xBtn = document.getElementById('lb-x');
  var prev = document.getElementById('lb-prev');
  var next = document.getElementById('lb-next');
  if (xBtn) xBtn.addEventListener('click', closeLb);
  if (prev) prev.addEventListener('click', function() { go(-1); });
  if (next) next.addEventListener('click', function() { go(1); });
  lb.addEventListener('click', function(e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function(e) {
    if (lb.hasAttribute('hidden')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  });
}

function initReviews() {
  var qs   = document.querySelectorAll('.rev');
  var dots = document.querySelectorAll('.rd');
  var cur  = 0;
  var timer;
  function go(i) {
    qs[cur].classList.remove('active'); dots[cur].classList.remove('active');
    cur = i;
    qs[cur].classList.add('active'); dots[cur].classList.add('active');
  }
  dots.forEach(function(d, i) {
    d.addEventListener('click', function() {
      go(i);
      clearInterval(timer);
      timer = setInterval(function() { go((cur+1) % qs.length); }, 5500);
    });
  });
  timer = setInterval(function() { go((cur+1) % qs.length); }, 5500);
}

function initBooking() {
  var form = document.getElementById('bk-form');
  var ci   = document.getElementById('fci');
  var co   = document.getElementById('fco');
  if (!form || !ci || !co) return;

  var today = new Date().toISOString().split('T')[0];
  ci.min = co.min = today;

  ci.addEventListener('change', function() {
    co.min = ci.value;
    if (co.value && co.value <= ci.value) {
      var d = new Date(ci.value);
      d.setDate(d.getDate() + 1);
      co.value = d.toISOString().split('T')[0];
    }
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var name  = document.getElementById('fn').value.trim();
    var phone = document.getElementById('fp').value.trim();
    var sel   = document.getElementById('fr-sel');
    var room  = (sel && sel.options[sel.selectedIndex]) ? sel.options[sel.selectedIndex].text : '';
    var msg;
    if (lang === 'fr') {
      msg = 'Bonjour, je souhaite reserver.\n\nNom: ' + name + '\nTel: ' + phone + '\nChambre: ' + room + '\nArrivee: ' + ci.value + '\nDepart: ' + co.value;
    } else {
      msg = 'Hello, I want to book a room.\n\nName: ' + name + '\nPhone: ' + phone + '\nRoom: ' + room + '\nCheck-in: ' + ci.value + '\nCheck-out: ' + co.value;
    }
    window.open('https://wa.me/224669000999?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });

  var waBtn = document.getElementById('wa-btn');
  if (waBtn) {
    waBtn.addEventListener('click', function(e) {
      e.preventDefault();
      var msg = (lang === 'fr') ? 'Bonjour, je souhaite reserver a Hotel Club de Kipe.' : 'Hello, I would like to book at Hotel Club de Kipe.';
      window.open('https://wa.me/224669000999?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var frBtn = document.getElementById('fr-btn');
  var enBtn = document.getElementById('en-btn');
  if (frBtn) frBtn.addEventListener('click', function() { applyLang('fr'); });
  if (enBtn) enBtn.addEventListener('click', function() { applyLang('en'); });

  initCursor();
  initNav();
  initHero();
  initReveal();
  initGallery();
  initLightbox();
  initReviews();
  initBooking();
  detectLangAsync();

  if (typeof gsap !== 'undefined') {
    initMagnetic();
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      initParallax();
    }
  } else {
    window.addEventListener('load', function() {
      if (typeof gsap !== 'undefined') initMagnetic();
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        initParallax();
      }
    });
  }
});


/* === Parallax scroll ================================== */
(function(){
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var imgs = document.querySelectorAll('.room-row-img img, .svc-split-img img, .about-img');
  if (!imgs.length) return;

  function tick(){
    var wh = window.innerHeight;
    [].forEach.call(imgs, function(img){
      var wrap = img.parentElement;
      var rect = wrap.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > wh + 100) return;
      var mid = (rect.top + rect.height / 2) / wh;   // ~0.5 when centred
      var shift = (mid - 0.5) * 50;                   // ±25px range
      img.style.transform = 'translateY(' + shift.toFixed(1) + 'px)';
    });
  }

  var rafId = null;
  window.addEventListener('scroll', function(){
    if (!rafId) rafId = requestAnimationFrame(function(){ tick(); rafId = null; });
  }, {passive:true});

  tick();
})();
