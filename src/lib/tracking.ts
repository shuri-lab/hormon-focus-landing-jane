// @ts-nocheck -- deliberately not typechecked.
// This is the static page's script, carried over unchanged. Typing it would
// mean editing it, and the one thing this conversion must not do is change
// how tracking, attribution or the offer links behave.
// Ported verbatim from the static page - attribution capture, link
// decoration and the Meta pixel, including the host-pixel guard.
export function initTracking() {
(function () {
  if (window.__hfTracking) { return; }
  window.__hfTracking = true;

  var DATASET_ID = '1614860232058835';   // CONFIRM with Todd which dataset his reports read
  var STORE      = 'shop.jjsmithonline.com';
  var KEY        = 'hf_attr';
  var PASS       = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
                    'fbclid', 'gclid',
                    // kept from the original block; harmless, and still useful
                    'utm_id', 'ttclid', 's'];

  // ---- 1a. capture, once, and keep it for the whole session ------------
  // The first valid value of the session wins. Nothing later overwrites it -
  // not a reload, not the #offer hash, not any in-page interaction - so the
  // campaign that actually brought the reader here is the one that reaches
  // Shopify.
  //
  // Nothing is inferred. A bare fbclid used to be turned into
  // utm_source=facebook / utm_medium=paid_social here; that invented
  // attribution the visitor never carried, and paid_social is not in the
  // Hormone Focus vocabulary. The click ID is forwarded on its own instead.
  function stored() {
    try { return JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
  }

  function attribution() {
    var have = stored();
    var q = new URLSearchParams(location.search);
    var added = false;
    PASS.forEach(function (k) {
      var v = q.get(k);
      if (v && !have[k]) { have[k] = v; added = true; }
    });
    if (added) { try { sessionStorage.setItem(KEY, JSON.stringify(have)); } catch (e) {} }
    return have;
  }

  var ATTR = attribution();

  // ---- 1b. forward it onto every link that goes to the store -----------
  function storeLinks() {
    return Array.prototype.filter.call(document.querySelectorAll('a[href]'), function (a) {
      try { return new URL(a.href, location.href).hostname.indexOf(STORE) !== -1; }
      catch (e) { return false; }
    });
  }

  // ---- 1b. forward it onto every link that goes to the store -----------
  // URL/searchParams does the joining and the encoding, so a destination that
  // already has a query string gets & and never a second ?.
  function decorate() {
    var keys = Object.keys(ATTR);
    if (!keys.length) { return; }          // no attribution: append nothing
    storeLinks().forEach(function (a) {
      var u;
      try { u = new URL(a.href, location.href); } catch (e) { return; }
      keys.forEach(function (k) { if (ATTR[k]) { u.searchParams.set(k, ATTR[k]); } });
      a.href = u.toString();
    });
  }

  decorate();
  // and again at click time, in case anything rewrote the href in between
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (a) { decorate(); }
  }, true);

  // ---- 2. Meta pixel ---------------------------------------------------
  // On the Shopify store the Meta pixel is ALREADY on the page. Installing a
  // second copy would double every PageView, so only load and init our own
  // when nothing else has. Either way the events below still fire, once.
  var HOST_PIXEL = (typeof window.fbq === 'function') ||
                   !!document.querySelector('script[src*="connect.facebook.net"]');

  if (!HOST_PIXEL) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  }

  try {
    if (!HOST_PIXEL) {
      fbq('init', DATASET_ID);
      fbq('track', 'PageView');
    }
    fbq('track', 'ViewContent', {
      content_name: 'Hormone Focus bridge page',
      content_ids: ['hormone-focus'],
      content_type: 'product'
    });
    storeLinks().forEach(function (a) {
      a.addEventListener('click', function () {
        try { fbq('trackCustom', 'BridgeCTAClick', { campaign: ATTR.utm_campaign || '(none)' }); } catch (e) {}
      });
    });
  } catch (e) {}
})();
}
