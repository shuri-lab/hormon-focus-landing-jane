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

// The 60-Day Protocol card's destination: the two-bottle bundle,
// variant 54330638663791 ("Hormone Focus Bundle - 2 Bottles").
//
// PENDING A SHOPIFY PRICE CHANGE. The card and the section headline advertise
// $74.99 ($1.25 a day, "Save $24.99"). As of 2026-09-25 that variant is still
// listed at $79.99, so the cart charges $5 more than the page says. This is
// known and accepted: the store is being repriced to $74.99.
//
// Until it is, expect $79.99 in the cart when testing. Do not deploy the page
// to real traffic before the store price matches.
//
// When you reprice: editing the EXISTING variant's price needs no code change,
// because the id below does not change. Only if a NEW variant or product is
// created does this URL need updating.
export const PROTOCOL_CHECKOUT_HREF = HF_OFFERS.bundle;
