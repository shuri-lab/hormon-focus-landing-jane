// @ts-nocheck -- deliberately not typechecked.
// This is the static page's script, carried over unchanged. Typing it would
// mean editing it, and the one thing this conversion must not do is change
// how tracking, attribution or the offer links behave.
// Ported verbatim from the static page - same behaviour, same guards.
export function initStickyBar() {
(function () {
  var bar = document.getElementById('hf-sticky');
  if (!bar) { return; }

  var hero  = document.getElementById('hero');
  var offer = document.getElementById('offer');
  var shown = null;

  function onScreen(el, bottomBias) {
    if (!el) { return false; }
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return r.bottom > 0 && r.top < vh * bottomBias;
  }

  function update() {
    // Show only where the page has no call to action of its own in view.
    var show = !onScreen(hero, 1) && !onScreen(offer, 0.85);
    if (show === shown) { return; }
    shown = show;
    bar.classList.toggle('is-on', show);
    bar.setAttribute('aria-hidden', show ? 'false' : 'true');
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
}
