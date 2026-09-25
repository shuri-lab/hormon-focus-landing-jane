// @ts-nocheck -- deliberately not typechecked.
// This is the static page's script, carried over unchanged. Typing it would
// mean editing it, and the one thing this conversion must not do is change
// how tracking, attribution or the offer links behave.
// Ported verbatim from the static page. Runs BEFORE tracking, as it did
// there: attribution decorates store links, so the hrefs must exist first.
export function applyOffers() {
(function () {
  var HF_OFFERS = {

    // Destinations only. No UTMs are written here: the visitor's own campaign
    // is the source of truth and the attribution block below forwards it. Which
    // offer was chosen is not an attribution question - Shopify already records
    // the variant on the order.
    //
    // Offer 1 - one bottle, 30-day supply, $49.99 one-time, shipping extra
    single:   'https://shop.jjsmithonline.com/cart/41200079175791:1?storefront=true',

    // Offer 2 - two bottles, 60-day supply, $79.99 one-time, free shipping
    bundle:   'https://shop.jjsmithonline.com/cart/54330638663791:1?storefront=true',

    // Offer 3 - the protocol, one bottle a month, $39.99, free shipping.
    // Variant 54355951845487 on selling plan 5529010287.
    protocol: 'https://shop.jjsmithonline.com/cart/add?id=54355951845487&quantity=1&selling_plan=5529010287'
  };

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
