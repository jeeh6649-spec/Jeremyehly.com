(function () {
  'use strict';

  var reveal = document.getElementById('notFoundReveal');
  if (!reveal) { return; }

  var x = 50;
  var y = 50;
  var frameRequested = false;

  function render() {
    reveal.style.setProperty('--not-found-x', x + '%');
    reveal.style.setProperty('--not-found-y', y + '%');
    frameRequested = false;
  }

  function queueRender() {
    if (!frameRequested) {
      frameRequested = true;
      window.requestAnimationFrame(render);
    }
  }

  function moveTo(clientX, clientY) {
    var rect = reveal.getBoundingClientRect();
    x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    queueRender();
  }

  function show() {
    reveal.classList.add('is-revealing');
  }

  function hide() {
    reveal.classList.remove('is-revealing');
  }

  reveal.addEventListener('pointerenter', function (event) {
    moveTo(event.clientX, event.clientY);
    show();
  });

  reveal.addEventListener('pointermove', function (event) {
    moveTo(event.clientX, event.clientY);
    show();
  });

  reveal.addEventListener('pointerdown', function (event) {
    moveTo(event.clientX, event.clientY);
    show();
  });

  reveal.addEventListener('pointerleave', function () {
    if (!reveal.matches(':focus-visible')) { hide(); }
  });

  reveal.addEventListener('focus', function () {
    show();
    render();
  });

  reveal.addEventListener('blur', hide);

  reveal.addEventListener('keydown', function (event) {
    var step = event.shiftKey ? 10 : 4;
    var handled = true;

    if (event.key === 'ArrowLeft') { x = Math.max(0, x - step); }
    else if (event.key === 'ArrowRight') { x = Math.min(100, x + step); }
    else if (event.key === 'ArrowUp') { y = Math.max(0, y - step); }
    else if (event.key === 'ArrowDown') { y = Math.min(100, y + step); }
    else if (event.key === 'Enter' || event.key === ' ') {
      reveal.classList.toggle('is-revealing');
    } else {
      handled = false;
    }

    if (handled) {
      event.preventDefault();
      queueRender();
    }
  });
})();
