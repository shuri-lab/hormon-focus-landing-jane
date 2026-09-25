// @ts-nocheck -- deliberately not typechecked.
// This is the static page's script, carried over unchanged. Typing it would
// mean editing it, and the one thing this conversion must not do is change
// how tracking, attribution or the offer links behave.
// Ported verbatim from the static page - same behaviour, same guards.
export function initOfferScroll() {
/* Scrolling to the offer section.

   A plain #offer jump was landing short: everything between the top of the
   page and the offer section is lazy-loaded, so images were still arriving
   mid-jump, growing the page under the scroll and leaving the reader a
   section or two above the target. Images now carry width/height so the space
   is reserved up front, and this animation re-reads the target every frame and
   then holds it for a moment, so anything still settling cannot drag the
   landing spot off. It bails out the instant the reader scrolls themselves. */
(function () {
  var target = function () { return document.getElementById('offer'); };

  // CSS sets scroll-behavior:smooth, which also applies to scrollTo(). Left
  // alone, every frame of the animation below would start its own smooth
  // scroll and fight the easing - the page crawls and stops short. Each step
  // has to be explicitly instant; the easing is ours to do.
  function jump(y) {
    try { window.scrollTo({ top: y, left: 0, behavior: 'instant' }); }
    catch (e) { window.scrollTo(0, y); }
  }

  function topOf(el) {
    var style = window.getComputedStyle(el);
    var margin = parseFloat(style.scrollMarginTop) || 0;
    return Math.max(0, el.getBoundingClientRect().top + window.scrollY - margin);
  }

  function maxScroll() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function goTo(el) {
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var raf = window.requestAnimationFrame;
    if (reduced || typeof raf !== 'function') {
      // no animation available (or not wanted): land it, then re-land it once
      // the stragglers have settled
      jump(Math.min(topOf(el), maxScroll()));
      var tries = 0;
      var fix = setInterval(function () {
        jump(Math.min(topOf(el), maxScroll()));
        if (++tries > 8) { clearInterval(fix); }
      }, 90);
      return;
    }

    var cancelled = false;
    var events = ['wheel', 'touchmove', 'keydown'];
    function cleanup() { events.forEach(function (e) { window.removeEventListener(e, cancel); }); }
    function cancel() { cancelled = true; cleanup(); }
    events.forEach(function (e) { window.addEventListener(e, cancel, { passive: true }); });

    var startY = window.scrollY;
    var t0 = Date.now();
    var DURATION = 550;

    function ease(t) { return 1 - Math.pow(1 - t, 3); }

    function frame() {
      if (cancelled) { return; }
      var t = Math.min(1, (Date.now() - t0) / DURATION);
      var dest = Math.min(topOf(el), maxScroll());
      jump(Math.round(startY + (dest - startY) * ease(t)));
      if (t < 1) { requestAnimationFrame(frame); return; }
      // hold the target while any straggling image finishes loading
      var settle0 = Date.now();
      (function hold() {
        if (cancelled) { return; }
        jump(Math.round(Math.min(topOf(el), maxScroll())));
        if (Date.now() - settle0 < 700) { requestAnimationFrame(hold); } else { cleanup(); }
      })();
    }
    requestAnimationFrame(frame);
  }

  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href="#offer"]') : null;
    if (!a) { return; }
    var el = target();
    if (!el) { return; }
    e.preventDefault();
    if (window.history && history.pushState) { history.pushState(null, '', '#offer'); }
    goTo(el);
  });

  // a visitor arriving on /#offer gets the same treatment
  if (location.hash === '#offer') {
    window.addEventListener('load', function () { var el = target(); if (el) { goTo(el); } });
  }
})();
}
