// @ts-nocheck -- deliberately not typechecked.
// This is the static page's script, carried over unchanged. Typing it would
// mean editing it, and the one thing this conversion must not do is change
// how tracking, attribution or the offer links behave.
// Ported verbatim from the static page. Runs BEFORE tracking, as it did
// there: attribution decorates store links, so the hrefs must exist first.
//
// The one edit since the port: the URL table moved to lib/offer-urls.ts so the
// React cards render the same hrefs this sets. Behaviour is unchanged.
import { HF_OFFERS } from './offer-urls';

export function applyOffers() {
(function () {

  var each = function (sel, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), fn);
  };

  each('a[data-offer]', function (a) {
    var url = HF_OFFERS[a.getAttribute('data-offer')];
    if (url) { a.href = url; return; }
    // No destination yet: keep the card, retire the button.
    a.classList.add('hf-pending');
    a.setAttribute('aria-disabled', 'true');
    a.removeAttribute('href');
  });

  each('[data-offer-note]', function (n) {
    if (!HF_OFFERS[n.getAttribute('data-offer-note')]) { n.style.display = 'block'; }
  });

  if (!HF_OFFERS.protocol && window.console && console.warn) {
    console.warn('[Hormone Focus] HF_OFFERS.protocol is empty - the $39.99 subscription CTA is disabled until a cart URL is set.');
  }
})();
}
