// Analytics for in-page interactions, through what the page already loads:
// the GTM dataLayer (GTM-WT4MWLTH, in index.html) and the Meta pixel that
// lib/tracking.ts sets up. Nothing new is installed, and both calls are
// guarded so a blocked tag manager or pixel can never break a click.
export function trackReviewsClick(location: string) {
  try {
    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: "reviews_link_click", reviews_link_location: location });
  } catch { /* tag manager blocked */ }
  try {
    const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
    if (typeof fbq === "function") fbq("trackCustom", "ReviewsLinkClick", { location });
  } catch { /* pixel blocked */ }
}
