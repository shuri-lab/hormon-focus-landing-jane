// The Shopify destinations, in one place.
//
// No UTMs are written here: the visitor's own campaign is the source of truth
// and lib/tracking.ts forwards it onto every link that points at the store,
// both on load and again at click time. Which offer was chosen is not an
// attribution question - Shopify already records the variant on the order.
//
// Both the rendered cards (routes/index.tsx) and applyOffers() read this, so a
// URL changed here changes everywhere.
export const HF_OFFERS: Record<string, string> = {
  // Offer 1 - one bottle, 30-day supply, $49.99 one-time, shipping extra
  single:   'https://shop.jjsmithonline.com/cart/41200079175791:1?storefront=true',

  // Offer 2 - two bottles, 60-day supply, $79.99 one-time, free shipping.
  // NOTE: still the $79.99 variant. The redesigned protocol card prices at
  // $74.99, which has no variant yet - see TODO_PROTOCOL_CHECKOUT below.
  bundle:   'https://shop.jjsmithonline.com/cart/54330638663791:1?storefront=true',

  // Offer 3 - the subscription, one bottle a month, $39.99, free shipping.
  // Variant 54355951845487 on selling plan 5529010287.
  protocol: 'https://shop.jjsmithonline.com/cart/add?id=54355951845487&quantity=1&selling_plan=5529010287',
};

// The kit's destination: variant 54330638663791, "Hormone Focus 60-Day Kit".
//
// The store now lists it at $74.99, matching the card and the section headline
// (checked against shop.jjsmithonline.com/products.json on 2026-09-28). The
// earlier $79.99 mismatch is resolved.
//
// routes/index.tsx adds the discount code to this before rendering it, and
// lib/tracking.ts adds the visitor's campaign on top.
export const PROTOCOL_CHECKOUT_HREF = HF_OFFERS.bundle;
