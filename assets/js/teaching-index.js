/* ==========================================================================
   Teaching index page only: progression-bar filter + Student Voices slider.
   Loaded in addition to site.js, which handles the Read More toggle shared
   with every other page.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ===== progression bar doubles as the level filter ===== */
  var segs = document.querySelectorAll('#progRow .prog-seg');
  var cards = document.querySelectorAll('#courseGrid .course-card');
  var countEl = document.getElementById('filterCount');

  if (segs.length && cards.length && countEl) {
    var total = cards.length;
    var labels = {
      all: 'all ' + total + ' courses',
      foundation: 'Foundation',
      advanced: 'Advanced / Options',
      capstone: 'Capstone / Thesis',
      seminar: 'Seminar / Special Topics'
    };

    function applyFilter(filter) {
      var shown = 0;
      cards.forEach(function (card) {
        var show = filter === 'all' || card.getAttribute('data-level') === filter;
        card.hidden = !show;
        if (show) shown++;
      });
      segs.forEach(function (s) { s.classList.toggle('active', s.getAttribute('data-level') === filter); });
      countEl.textContent = filter === 'all'
        ? 'Showing all ' + total + ' courses'
        : 'Showing ' + shown + ' of ' + total + ' courses' + (shown ? ' | ' + labels[filter] : ' | ' + labels[filter] + ', none built yet');
    }

    segs.forEach(function (seg) {
      seg.addEventListener('click', function () { applyFilter(seg.getAttribute('data-level')); });
    });
  }

  /* ===== Student Voices slider, rotates real course-evaluation and press quotes, most recent first ===== */
  var quotes = [
    {
      text: '"Jeremy enabled my individual curiosities and consistently pushed me to the next steps and to find new use cases."',
      attr: 'Generative Design with AI <span class="pipe">|</span> Spring 2026 course evaluation'
    },
    {
      text: '"He provides great feedback, and helpful comments that would help us move forward with our projects. Very responsive and supportive."',
      attr: 'Iceland Slow Sauna Competition <span class="pipe">|</span> Spring 2026 course evaluation'
    },
    {
      text: '"Jeremy has such a unique perspective on the design world, especially using technology in design. He pushed us to adapt to the growing changes in the field of design and gave feedback that challenges traditional ways of thinking."',
      attr: 'Urban Rewilding Studio <span class="pipe">|</span> Fall 2025 course evaluation'
    },
    {
      text: '"Jeremy inspires the exploration of creativity with all students and drives the excellence of an immersive designing experience."',
      attr: 'Luminaire Studio <span class="pipe">|</span> Fall 2024 course evaluation'
    },
    {
      text: '"I liked how we always got feedback and you always provided us with ways to make our projects better."',
      attr: 'Studio I | Environmental Product Design <span class="pipe">|</span> Spring 2023 course evaluation'
    },
    {
      text: '"The enthusiasm, the gratitude and the sense of comfort were palpable."',
      attr: 'Denver Botanic Gardens client <span class="pipe">|</span> Modern in Denver, Winter 2018'
    }
  ];
  var quoteText = document.getElementById('quoteText');
  var quoteAttr = document.getElementById('quoteAttr');
  var dots = document.querySelectorAll('#quoteDots .quote-dot');

  if (quoteText && quoteAttr && dots.length) {
    var qIndex = 0;
    var qTimer;

    function showQuote(i) {
      qIndex = i;
      quoteText.classList.add('quote-fade');
      quoteAttr.classList.add('quote-fade');
      setTimeout(function () {
        quoteText.textContent = quotes[i].text;
        quoteAttr.innerHTML = quotes[i].attr;
        quoteText.classList.remove('quote-fade');
        quoteAttr.classList.remove('quote-fade');
      }, 500);
      dots.forEach(function (d) { d.classList.toggle('active', Number(d.getAttribute('data-index')) === i); });
    }

    function startAutoplay() {
      clearInterval(qTimer);
      qTimer = setInterval(function () { showQuote((qIndex + 1) % quotes.length); }, 6500);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showQuote(Number(dot.getAttribute('data-index')));
        startAutoplay();
      });
    });

    startAutoplay();
  }

});
