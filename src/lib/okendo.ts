// Okendo reviews, read through the PUBLIC Storefront REST API.
//
// NO SECRET IS USED OR NEEDED. The subscriber id below is the public store
// identifier Okendo puts in its own widget embed code, and the endpoint is
// unauthenticated and CORS-open (access-control-allow-origin: *). The private
// Merchant API key is NOT used here and must never reach the browser.
const STORE_ID = "602b956e-b79b-45f9-8fa5-325dae21d2e9";
const PRODUCT_ID = "shopify-7171961258095"; // Hormone Focus, from Okendo's embed
const API = "https://api.okendo.io/v1";

// The API is limited: no summary endpoint, and no sort or filter parameters.
// Only `limit` and the `nextUrl` cursor do anything, and reviews always come
// back newest first. So the average, the count and the star histogram have to
// be computed here, which means reading every review once. At limit=100 that
// is two requests and about 25 KB gzipped, and it only runs when the visitor
// scrolls near the section.
const PAGE_SIZE = 100;
const MAX_PAGES = 12; // a backstop, not an expected limit

export type OkendoMedia = { url?: string; thumbnailUrl?: string; caption?: string };

export type OkendoReview = {
  reviewId: string;
  rating: number;
  title?: string;
  body?: string;
  dateCreated: string;
  reviewer?: { displayName?: string; isVerified?: boolean };
  media?: OkendoMedia[];
};

export type ReviewsData = {
  reviews: OkendoReview[];
  total: number;
  average: number;
  histogram: Record<number, number>;
};

export function summarise(reviews: OkendoReview[]): ReviewsData {
  const histogram: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  for (const r of reviews) {
    const n = Math.round(r.rating);
    if (n >= 1 && n <= 5) histogram[n] += 1;
    sum += r.rating;
  }
  return {
    reviews,
    total: reviews.length,
    average: reviews.length ? sum / reviews.length : 0,
    histogram,
  };
}

export async function fetchReviews(signal?: AbortSignal): Promise<ReviewsData> {
  let url: string | null =
    `${API}/stores/${STORE_ID}/products/${PRODUCT_ID}/reviews?limit=${PAGE_SIZE}`;
  const all: OkendoReview[] = [];

  for (let page = 0; url && page < MAX_PAGES; page += 1) {
    const res: Response = await fetch(url, { signal, headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Okendo responded ${res.status}`);
    const json: { reviews?: OkendoReview[]; nextUrl?: string } = await res.json();
    const batch = json.reviews ?? [];
    all.push(...batch);
    // nextUrl is returned as a path, not an absolute URL
    url = batch.length && json.nextUrl ? `${API}${json.nextUrl}` : null;
  }

  return summarise(all);
}

// ---------------------------------------------------------------------------
// One fetch, shared. The rating badges above the fold and the reviews section
// near the bottom both want the same numbers, and there is no cheap count
// endpoint to ask for them separately, so whoever asks first starts the
// request and everyone else waits on the same promise.
let inflight: Promise<ReviewsData> | null = null;

export function getReviews(): Promise<ReviewsData> {
  if (!inflight) {
    inflight = fetchReviews().catch((err) => {
      inflight = null; // let a later caller retry
      throw err;
    });
  }
  return inflight;
}

// Shown until the live numbers arrive, and if Okendo is unreachable. These are
// the real figures as of 2026-09-28, so the badges are accurate on arrival and
// simply stay accurate as reviews come in. Update only if they drift far.
export const FALLBACK_RATING = { average: 4.9, total: 171 };
