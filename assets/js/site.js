/* ==========================================================================
   Jeremy Ehly | Site behaviors
   Every function below checks for its own elements before wiring anything,
   so this one file is safe to include on every page regardless of which
   components that page actually uses.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ===== Lead Statement Read More toggle ===== */
  var readBtn = document.getElementById('readMoreBtn');
  var readMore = document.getElementById('introMore');
  if (readBtn && readMore) {
    readBtn.addEventListener('click', function () {
      var isExpanded = readMore.classList.toggle('expanded');
      readBtn.classList.toggle('expanded', isExpanded);
      readBtn.innerHTML = isExpanded
        ? 'Read Less <span class="arrow">&darr;</span>'
        : 'Read More <span class="arrow">&darr;</span>';
    });
  }

  /* ===== lightbox, full-scale click-through with prev/next ===== */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var zoomLens = document.getElementById('zoomLens');

  var currentFrames = [];
  var currentIndex = 0;

  function showCurrent() {
    var frame = currentFrames[currentIndex];
    var img = frame.querySelector('img');
    var capEl = frame.parentElement.querySelector('.scroll-cap');
    lightboxImg.src = frame.getAttribute('href');
    lightboxImg.alt = img ? img.getAttribute('alt') : '';
    lightboxCaption.textContent = capEl ? capEl.textContent : (img ? img.getAttribute('alt') : '');
    var multi = currentFrames.length > 1;
    lightboxPrev.style.visibility = multi ? 'visible' : 'hidden';
    lightboxNext.style.visibility = multi ? 'visible' : 'hidden';
  }
  function openLightboxAt(frames, idx) {
    currentFrames = frames;
    currentIndex = idx;
    showCurrent();
    lightbox.classList.add('active');
    if (zoomLens) { zoomLens.style.display = 'none'; }
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
    lightboxImg.src = '';
  }
  function showNext() {
    if (currentFrames.length < 2) { return; }
    currentIndex = (currentIndex + 1) % currentFrames.length;
    showCurrent();
  }
  function showPrev() {
    if (currentFrames.length < 2) { return; }
    currentIndex = (currentIndex - 1 + currentFrames.length) % currentFrames.length;
    showCurrent();
  }

  if (lightbox && lightboxImg && lightboxClose && lightboxPrev && lightboxNext && lightboxCaption) {
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNext);
    lightboxPrev.addEventListener('click', showPrev);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) { closeLightbox(); }
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) { return; }
      if (e.key === 'Escape') { closeLightbox(); }
      if (e.key === 'ArrowRight') { showNext(); }
      if (e.key === 'ArrowLeft') { showPrev(); }
    });
  }

  /* ===== cursor-tracking zoom lens, positioned fixed so it is never clipped ===== */
  var zoomFactor = 2.2;
  var activeZoomFrame = null;

  function moveZoomLens(e, frame) {
    var rect = frame.getBoundingClientRect();
    var xPct = (e.clientX - rect.left) / rect.width;
    var yPct = (e.clientY - rect.top) / rect.height;
    var lensW = zoomLens.offsetWidth;
    var lensH = zoomLens.offsetHeight;
    var left = Math.max(8, Math.min(e.clientX - lensW / 2, window.innerWidth - lensW - 8));
    var top = Math.max(8, Math.min(e.clientY - lensH / 2, window.innerHeight - lensH - 8));
    zoomLens.style.left = left + 'px';
    zoomLens.style.top = top + 'px';
    zoomLens.style.backgroundSize = (rect.width * zoomFactor) + 'px ' + (rect.height * zoomFactor) + 'px';
    var bgX = -(xPct * rect.width * zoomFactor - lensW / 2);
    var bgY = -(yPct * rect.height * zoomFactor - lensH / 2);
    zoomLens.style.backgroundPosition = bgX + 'px ' + bgY + 'px';
  }

  /* ===== wire up each gallery, scoped so lightbox prev/next stays within one project ===== */
  document.querySelectorAll('.scroll-gallery').forEach(function (gallery) {
    var frames = Array.prototype.slice.call(gallery.querySelectorAll('.scroll-frame')).filter(function (f) {
      return f.querySelector('img');
    });
    frames.forEach(function (frame, idx) {
      if (zoomLens && !frame.classList.contains('portfolio-tile')) {
        frame.addEventListener('mouseenter', function () {
          activeZoomFrame = frame;
          zoomLens.style.backgroundImage = 'url(' + frame.getAttribute('href') + ')';
          zoomLens.style.display = 'block';
        });
        frame.addEventListener('mousemove', function (e) {
          if (activeZoomFrame === frame) { moveZoomLens(e, frame); }
        });
        frame.addEventListener('mouseleave', function () {
          activeZoomFrame = null;
          zoomLens.style.display = 'none';
        });
      }
      if (lightbox) {
        frame.addEventListener('click', function (e) {
          e.preventDefault();
          openLightboxAt(frames, idx);
        });
      }
    });
  });

  /* ===== "View Full Presentation Boards" links jump straight to a project's board panel ===== */
  document.querySelectorAll('.board-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var gallery = document.getElementById(link.getAttribute('data-board-target'));
      if (!gallery) { return; }
      var frames = Array.prototype.slice.call(gallery.querySelectorAll('.scroll-frame')).filter(function (f) {
        return f.querySelector('img');
      });
      var boardIdx = frames.findIndex(function (f) { return f.getAttribute('data-board') === 'true'; });
      openLightboxAt(frames, boardIdx > -1 ? boardIdx : 0);
      gallery.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  /* ===== hero slideshow, auto-rotates through each project's strongest image ===== */
  (function () {
    var heroSlides = document.querySelectorAll('.hero-slide');
    var heroDots = document.querySelectorAll('.hero-dot');
    if (!heroSlides.length) { return; }
    var heroIndex = 0;
    var heroTimer;

    function showHero(i) {
      heroSlides.forEach(function (s, idx) { s.classList.toggle('active', idx === i); });
      heroDots.forEach(function (d, idx) { d.classList.toggle('active', idx === i); });
      heroIndex = i;
    }
    function startHeroAutoplay() {
      clearInterval(heroTimer);
      heroTimer = setInterval(function () { showHero((heroIndex + 1) % heroSlides.length); }, 5000);
    }
    heroDots.forEach(function (dot) {
      dot.addEventListener('click', function (e) {
        e.preventDefault();
        showHero(parseInt(dot.getAttribute('data-slide'), 10));
        startHeroAutoplay();
      });
    });
    startHeroAutoplay();
  })();

  /* ===== quote slider, cycles through a course's evaluation quotes ===== */
  document.querySelectorAll('.quote-dots').forEach(function (dots) {
    var block = dots.closest('.quote-block');
    var dataEl = block ? block.querySelector('.quote-data') : null;
    if (!dataEl) { return; }
    var quotes;
    try { quotes = JSON.parse(dataEl.textContent); } catch (e) { return; }
    if (!quotes || quotes.length < 2) { return; }

    var textEl = block.querySelector('.quote-slide-text');
    var attrEl = block.querySelector('.quote-slide-attr');
    var buttons = Array.prototype.slice.call(dots.querySelectorAll('.quote-dot'));
    var current = 0;
    var timer;

    function show(i) {
      textEl.classList.add('quote-fade');
      attrEl.classList.add('quote-fade');
      window.setTimeout(function () {
        textEl.textContent = '“' + quotes[i].text + '”';
        attrEl.textContent = quotes[i].attr;
        textEl.classList.remove('quote-fade');
        attrEl.classList.remove('quote-fade');
      }, 260);
      buttons.forEach(function (b, idx) { b.classList.toggle('active', idx === i); });
      current = i;
    }
    function startAutoplay() {
      clearInterval(timer);
      timer = setInterval(function () { show((current + 1) % quotes.length); }, 8000);
    }
    buttons.forEach(function (b, idx) {
      b.addEventListener('click', function () {
        if (idx === current) { return; }
        show(idx);
        startAutoplay();
      });
    });
    startAutoplay();
  });

  /* ===== homepage hero name, shrinks and fades into the header logo on scroll ===== */
  (function () {
    var heroName = document.querySelector('.home-hero-name');
    var headerLogo = document.querySelector('header .logo');
    if (!heroName || !headerLogo) { return; }
    var body = document.body;
    var DISTANCE = 260;
    var ticking = false;
    function update() {
      var progress = Math.min(Math.max(window.scrollY / DISTANCE, 0), 1);
      heroName.style.transform = 'scale(' + (1 - progress * 0.88) + ') translateY(' + (-progress * 10) + 'px)';
      heroName.style.opacity = String(Math.max(0, 1 - progress * 1.15));
      headerLogo.style.opacity = String(progress);
      body.classList.toggle('scrolled-past-hero', progress > 0.6);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  })();

});
