// @ts-nocheck -- deliberately not typechecked.
// This is the static page's script, carried over unchanged. Typing it would
// mean editing it, and the one thing this conversion must not do is change
// how tracking, attribution or the offer links behave.
// Ported verbatim from the static page - same behaviour, same guards.
export function initVideos() {
/* Video testimonials.

   Each card is a poster until it is clicked, then the Vimeo player replaces
   it - nine embeds would otherwise load for a visitor who watches none.
   Opening one closes any other, so two clips can never talk over each other,
   and closing puts the poster back so the card can be replayed. */
(function () {
  var track = document.querySelector('.vids-track');
  if (!track) { return; }

  var cards = Array.prototype.slice.call(track.querySelectorAll('.vid'));

  function close(card) {
    if (!card.dataset.open) { return; }
    delete card.dataset.open;
    card.innerHTML = card.dataset.poster;
  }

  function open(card) {
    cards.forEach(function (other) { if (other !== card) { close(other); } });
    if (card.dataset.open) { return; }
    card.dataset.open = '1';
    var f = document.createElement('iframe');
    f.src = 'https://player.vimeo.com/video/' + card.dataset.vimeo + '?h=' + card.dataset.h +
            '&autoplay=1&playsinline=1&title=0&byline=0&portrait=0&dnt=1';
    f.allow = 'autoplay; fullscreen; picture-in-picture';
    f.setAttribute('allowfullscreen', '');
    f.setAttribute('title', 'Hormone Focus customer testimonial');
    card.innerHTML = '';
    card.appendChild(f);

    var shut = document.createElement('button');
    shut.type = 'button';
    shut.className = 'vid-close';
    shut.setAttribute('aria-label', 'Close video');
    shut.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    shut.addEventListener('click', function (e) { e.stopPropagation(); close(card); });
    card.appendChild(shut);
  }

  cards.forEach(function (card) {
    card.dataset.poster = card.innerHTML;
    card.addEventListener('click', function (e) {
      if (e.target.closest('.vid-close')) { return; }
      if (!card.dataset.open) { open(card); }
    });
  });

  function step(dir) {
    var card = cards[0];
    var by = card ? card.getBoundingClientRect().width + 14 : 220;
    track.scrollBy({ left: dir * by * 2, behavior: 'smooth' });
  }
  var prev = document.querySelector('.vids-prev'), next = document.querySelector('.vids-next');
  if (prev) { prev.addEventListener('click', function () { step(-1); }); }
  if (next) { next.addEventListener('click', function () { step(1); }); }
})();
}
