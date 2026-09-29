import "@/styles.css";
import { useEffect, useRef, useState } from "react";

import { initVideos } from "@/lib/videos";
import { initOfferScroll } from "@/lib/scroll";
import { initStickyBar } from "@/lib/sticky";
import { applyOffers } from "@/lib/offers";
import { initTracking } from "@/lib/tracking";
import { HF_OFFERS, PROTOCOL_CHECKOUT_HREF } from "@/lib/offer-urls";
import { lazy, Suspense } from "react";
const Reviews = lazy(() => import("@/components/reviews"));
import { useReviewStats } from "@/lib/use-review-stats";
import { trackReviewsClick } from "@/lib/track";
import okendoLogo from "@/assets/img/okendo-logo.webp";

import imgFbReview from "@/assets/img/fb-review.webp";
import imgHeroBottle from "@/assets/img/hero-bottle.webp";
import imgIngredientsBottle from "@/assets/img/ingredients-bottle.webp";
import imgJjLifestyle from "@/assets/img/jj-lifestyle.webp";
import imgJjSmithLogo from "@/assets/img/jj-smith-logo.webp";
import imgMoneyBackBadge from "@/assets/img/money-back-badge.webp";
import imgOffer1Bottle from "@/assets/img/hf-1-bottle-product-image.webp";
import imgKit512 from "@/assets/img/hf-protocol-image-512w.webp";
import imgKit768 from "@/assets/img/hf-protocol-image-768w.webp";
import imgKit1024 from "@/assets/img/hf-protocol-image-1024w.webp";
import imgPartnersDroz from "@/assets/img/partners/droz.webp";
import imgPartnersEssence from "@/assets/img/partners/essence.webp";
import imgPartnersFox from "@/assets/img/partners/fox.webp";
import imgPartnersNbc from "@/assets/img/partners/nbc.webp";
import imgPartnersNytimes from "@/assets/img/partners/nytimes.webp";
import imgPartnersSteveharvey from "@/assets/img/partners/steveharvey.webp";
import imgPartnersTheview from "@/assets/img/partners/theview.webp";
import imgPartnersWomansworld from "@/assets/img/partners/womansworld.webp";
import imgSelfie1 from "@/assets/img/selfie-1.webp";
import imgSelfie10 from "@/assets/img/selfie-10.webp";
import imgSelfie11 from "@/assets/img/selfie-11.webp";
import imgSelfie12 from "@/assets/img/selfie-12.webp";
import imgSelfie2 from "@/assets/img/selfie-2.webp";
import imgSelfie3 from "@/assets/img/selfie-3.webp";
import imgSelfie4 from "@/assets/img/selfie-4.webp";
import imgSelfie5 from "@/assets/img/selfie-5.webp";
import imgSelfie6 from "@/assets/img/selfie-6.webp";
import imgSelfie7 from "@/assets/img/selfie-7.webp";
import imgSelfie8 from "@/assets/img/selfie-8.webp";
import imgSelfie9 from "@/assets/img/selfie-9.webp";
import imgVideoV1 from "@/assets/img/video/v1.webp";
import imgVideoV2 from "@/assets/img/video/v2.webp";
import imgVideoV3 from "@/assets/img/video/v3.webp";
import imgVideoV4 from "@/assets/img/video/v4.webp";
import imgVideoV5 from "@/assets/img/video/v5.webp";
import imgVideoV6 from "@/assets/img/video/v6.webp";
import imgVideoV7 from "@/assets/img/video/v7.webp";
import imgVideoV8 from "@/assets/img/video/v8.webp";
import imgVideoV9 from "@/assets/img/video/v9.webp";
import imgWomanProblem from "@/assets/img/woman-problem.webp";
import imgWomanSteps from "@/assets/img/woman-steps.webp";

// StrictMode runs effects twice in development. The scripts below bind
// document-level listeners, so a second pass would animate the offer scroll
// twice and double up the video handlers. The tracking script already guards
// itself with window.__hfTracking; this does the same for the rest.
let wired = false;

// Everything about the protocol offer that anyone is likely to want to change.
// The card renders from this and nothing else, so names, values and the CTA can
// be edited here without touching markup.
//
// Stack values are set by the team. Only the $99.98 is derived from an actual
// price (2 x $49.99); the rest are assigned values for the bonuses. A struck
// "total value" is a reference-price claim, so keep a note of what each one is
// based on in case it is ever questioned.
//
// TODO_BUNDLE_IMAGE - `image` is the single swap point for the new bundle shot.
const PROTOCOL: {
  planName: string;
  planSubtitle: string;
  ctaLabel: string;
  discountCode: string;
  image: string;
  price: string;
  perDay: string;
  stack: { label: string; value?: number; included?: boolean; note?: string }[];
} = {
  planName: "The 60-Day Feel Like YOU Again Kit",
  planSubtitle: "Better Sleep. Less Stubborn Belly. More Energy. More YOU.",
  ctaLabel: "Get the 60-Day Kit",
  // Auto-applied at checkout on this offer only. Change it here.
  discountCode: "HF60FREESHIP",
  image: imgKit1024,
  price: "$74.99",
  perDay: "$1.25 a day",
  stack: [
    { label: "2 Bottles of Hormone Focus", value: 99.99 },
    { label: "The 60-Day Hormone Fix eBook", value: 49 },
    { label: "Hormone Healthy Recipes eBook", value: 29 },
    { label: "Daily Symptom Tracker", value: 19 },
  ],
};

// Priced rows only; "Included" carries no number and is skipped.
const STACK_TOTAL = PROTOCOL.stack.reduce((n, i) => n + (i.value ?? 0), 0);

// The protocol cart link with the discount applied. Built through URL rather
// than concatenated: the base already carries ?storefront=true, so this joins
// with & and replaces rather than repeats if the code is ever changed or set
// twice. lib/tracking.ts then layers the visitor's campaign on top the same way.
const PROTOCOL_HREF = (() => {
  const u = new URL(PROTOCOL_CHECKOUT_HREF);
  u.searchParams.set("discount", PROTOCOL.discountCode);
  return u.toString();
})();

// $99.98 keeps its cents, a round $40 does not.
const money = (n: number) =>
  "$" + (Number.isInteger(n) ? String(n) : n.toFixed(2));


// Provenance, not a purchase claim: this says who collected and vetted the
// reviews, which is true of all 171. The per-review "Verified buyer" badge in
// the reviews section is the one that speaks to individual purchases.
function OkendoTag() {
  return (
    <span className="ok-tag">
      <span className="ok-tag-t">Verified by</span>
      <img src={okendoLogo} width="315" height="68" alt="Okendo" loading="lazy" decoding="async" />
    </span>
  );
}

// The clickable half of every rating mention, shared so the three can never
// disagree. Long form on desktop, short on a phone, both on the same live
// Okendo figures as the reviews section. The arrow is the one from the CTA
// buttons, so the affordance reads the same everywhere.
function RatingCount({ total }: { total: number }) {
  return (
    <>
      <span className="rl-dot" aria-hidden="true">&middot;</span>
      {/* Not "verified reviews": Okendo marks 37 of the 171 as verified
          buyers, so the whole count cannot carry that claim. The per-review
          badge in the reviews section still marks the ones that are. */}
      <span className="rl-read">Read {total} reviews</span>
      <svg className="rl-arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h13" /><path d="M12 5l7 7-7 7" />
      </svg>
    </>
  );
}

// The one-bottle card's two options, and everything that changes with them:
// the copy, the figures, the button, and which Shopify destination it points
// at. Order is the DOM order, the tab order and the arrow-key order, so this
// is the single place that decides which option comes first.
const PLANS = [
  {
    id: "once",
    offer: "single",
    title: "One-time purchase",
    cadence: "Delivered once",
    price: "$49.99",
    was: null,
    per: "$1.67 a day",
    pill: null,
    benefits: false,
    cta: "Get 1 bottle",
  },
  {
    id: "sub",
    offer: "protocol",
    title: "Subscribe & save",
    cadence: "Delivered every 30 days",
    price: "$39.99",
    was: "$49.99",
    // deliberately no per-day figure on the subscription
    per: null,
    pill: "20% OFF",
    // shown whether or not the option is selected, so the two cards read the
    // same at a glance
    benefits: true,
    cta: "Subscribe & save",
  },
] as const;

type PlanId = (typeof PLANS)[number]["id"];

export default function HormoneFocusLanding() {
  // Live rating and review count from Okendo, shown in the three badges below.
  const rating = useReviewStats();
  const [plan, setPlan] = useState<PlanId>("once");
  const optRefs = useRef<Array<HTMLDivElement | null>>([]);

  const active = PLANS.find((p) => p.id === plan)!;

  // Which Shopify destination the one-bottle button currently points at. Read
  // straight from the shared table so the rendered href and applyOffers() can
  // never disagree; tracking.ts adds the visitor's UTMs on top, at click time.
  const activeOffer = { key: active.offer, url: HF_OFFERS[active.offer] };

  // Radiogroup keyboard contract: arrows move AND select, wrapping at the ends.
  // Enter and Space are handled on the rows themselves - they are divs, not
  // buttons, because the selected row expands to hold a list and a list is not
  // valid content inside a button.
  const onOptKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const back = e.key === "ArrowLeft" || e.key === "ArrowUp";
    const fwd = e.key === "ArrowRight" || e.key === "ArrowDown";
    if (!back && !fwd) return;
    e.preventDefault();
    const i = PLANS.findIndex((x) => x.id === plan);
    const next = (i + (fwd ? 1 : -1) + PLANS.length) % PLANS.length;
    setPlan(PLANS[next].id);
    optRefs.current[next]?.focus();
  };

  useEffect(() => {
    if (wired) return;
    wired = true;
    // Same order the static page ran them in. applyOffers must come before
    // initTracking: attribution decorates every link pointing at the store, so
    // the hrefs have to exist by the time it runs.
    initVideos();
    initOfferScroll();
    initStickyBar();
    applyOffers();
    initTracking();
  }, []);

  return (
    <>

      {/* ===== ANNOUNCEMENT ===== */}
      <div className="announce">
        <div className="wrap announce-in">
          <span className="announce-star" aria-hidden="true">&#10022;</span>
          <span>60-day money-back guarantee</span>
        </div>
      </div>

      {/* ===== MASTHEAD ===== */}
      <header className="masthead">
        <div className="wrap masthead-in">
          <img src={imgJjSmithLogo} alt="JJ Smith" className="logo" width="132" height="25" />
          <a className="masthead-cta" href="#offer">Get Hormone Focus</a>
        </div>
      </header>

      {/* ===== 1. ABOVE THE FOLD ===== */}
      {/* proof bar first, then dream outcome, then the no-more line, then CTA */}
      <section className="band hero" id="hero">
        <div className="hero-top">
        <div className="wrap hero-grid">

          <div className="stack hero-copy">
            <a className="badge rating-link" href="#reviews" aria-label="Read all customer reviews"
               onClick={() => trackReviewsClick("hero")}>
              <span className="avatars">
                <img src={imgSelfie3} alt="" loading="lazy" width="300" height="468" />
                <img src={imgSelfie5} alt="" loading="lazy" width="300" height="468" />
                <img src={imgSelfie2} alt="" loading="lazy" width="300" height="468" />
                <img src={imgSelfie1} alt="" loading="lazy" width="300" height="468" />
              </span>
              <span className="stars">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#E8B84B"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#E8B84B"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#E8B84B"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#E8B84B"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#E8B84B"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
              </span>
              <b>{rating.average.toFixed(1)}</b>
              <RatingCount total={rating.total} />
            </a>

            <div className="stack-s">
              <h1 className="h1"><span className="grp"><span className="hl">Feel Like</span> <em>Yourself</em> <span className="hl">Again.</span></span> <span className="grp">Fewer Hot Flashes.</span> <span className="grp">Better Sleep.</span> <span className="grp">Less Stubborn Belly.</span></h1>
              <p className="lead hero-sub">Three natural ingredients to balance your hormones. <mark className="mk mk-caps">Two capsules a day.</mark> <span className="mk-b">Feel the difference <mark className="mk">in just 30 days.</mark></span></p>
            </div>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#offer">
                Get Hormone Focus
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13" /><path d="M12 5l7 7-7 7" /></svg>
              </a>
              <p className="micro">60-day money-back guarantee</p>
            </div>

          </div>

          <div className="stack-s hero-aside">
            <figure className="hero-quote fb-shot">
              <img src={imgFbReview} width="900" height="649" loading="lazy" alt="Facebook comment from Martinez Sullivan: this is a game changer, I have literally shed some inches and lbs, not to mention the hot flashes are gone when I take it" />
            </figure>
          </div>

        </div>
        <img className="hero-shot" src={imgHeroBottle} width="683" height="800" alt="Hormone Focus, held in the hand" fetchPriority="high" decoding="async" />
        </div>

        {/* press logos and customer photos ride inside the hero: on a phone
             they reorder around the copy, which needs one flex container */}
        <div className="photos">
          <div className="photos-view">
          <div className="photos-track">
                <img src={imgSelfie1} alt="A Hormone Focus customer" loading="lazy" width="300" height="468" />
                <img src={imgSelfie2} alt="A Hormone Focus customer" loading="lazy" width="300" height="468" />
                <img src={imgSelfie3} alt="A Hormone Focus customer" loading="lazy" width="300" height="468" />
                <img src={imgSelfie4} alt="A Hormone Focus customer" loading="lazy" width="300" height="468" />
                <img src={imgSelfie5} alt="A Hormone Focus customer" loading="lazy" width="300" height="468" />
                <img src={imgSelfie6} alt="A Hormone Focus customer" loading="lazy" width="300" height="468" />
                <img src={imgSelfie7} alt="A Hormone Focus customer" loading="lazy" width="350" height="546" />
                <img src={imgSelfie8} alt="A Hormone Focus customer" loading="lazy" width="350" height="546" />
                <img src={imgSelfie9} alt="A Hormone Focus customer" loading="lazy" width="350" height="546" />
                <img src={imgSelfie10} alt="A Hormone Focus customer" loading="lazy" width="350" height="546" />
                <img src={imgSelfie11} alt="A Hormone Focus customer" loading="lazy" width="350" height="546" />
                <img src={imgSelfie12} alt="A Hormone Focus customer" loading="lazy" width="350" height="546" />
                <img src={imgSelfie1} alt="A Hormone Focus customer" loading="lazy" width="300" height="468" />
                <img src={imgSelfie2} alt="A Hormone Focus customer" loading="lazy" width="300" height="468" />
                <img src={imgSelfie3} alt="A Hormone Focus customer" loading="lazy" width="300" height="468" />
                <img src={imgSelfie4} alt="A Hormone Focus customer" loading="lazy" width="300" height="468" />
                <img src={imgSelfie5} alt="A Hormone Focus customer" loading="lazy" width="300" height="468" />
                <img src={imgSelfie6} alt="A Hormone Focus customer" loading="lazy" width="300" height="468" />
                <img src={imgSelfie7} alt="A Hormone Focus customer" loading="lazy" width="350" height="546" />
                <img src={imgSelfie8} alt="A Hormone Focus customer" loading="lazy" width="350" height="546" />
                <img src={imgSelfie9} alt="A Hormone Focus customer" loading="lazy" width="350" height="546" />
                <img src={imgSelfie10} alt="A Hormone Focus customer" loading="lazy" width="350" height="546" />
                <img src={imgSelfie11} alt="A Hormone Focus customer" loading="lazy" width="350" height="546" />
                <img src={imgSelfie12} alt="A Hormone Focus customer" loading="lazy" width="350" height="546" />
          </div>
          </div>
        </div>

        <div className="press">
          <div className="marquee">
          <div className="marquee-track">
                <img src={imgPartnersNytimes} alt="" loading="lazy" width="206" height="70" />
                <img src={imgPartnersDroz} alt="" loading="lazy" width="62" height="70" />
                <img src={imgPartnersTheview} alt="" loading="lazy" width="86" height="70" />
                <img src={imgPartnersSteveharvey} alt="" loading="lazy" width="103" height="70" />
                <img src={imgPartnersNbc} alt="" loading="lazy" width="48" height="70" />
                <img src={imgPartnersFox} alt="" loading="lazy" width="66" height="70" />
                <img src={imgPartnersEssence} alt="" loading="lazy" width="113" height="70" />
                <img src={imgPartnersWomansworld} alt="" loading="lazy" width="77" height="70" />
                <img src={imgPartnersNytimes} alt="" loading="lazy" width="206" height="70" />
                <img src={imgPartnersDroz} alt="" loading="lazy" width="62" height="70" />
                <img src={imgPartnersTheview} alt="" loading="lazy" width="86" height="70" />
                <img src={imgPartnersSteveharvey} alt="" loading="lazy" width="103" height="70" />
                <img src={imgPartnersNbc} alt="" loading="lazy" width="48" height="70" />
                <img src={imgPartnersFox} alt="" loading="lazy" width="66" height="70" />
                <img src={imgPartnersEssence} alt="" loading="lazy" width="113" height="70" />
                <img src={imgPartnersWomansworld} alt="" loading="lazy" width="77" height="70" />
          </div>
        </div>
        </div>
      </section>

      {/* ===== 2. PAIN POINT - problem, agitate, solution ===== */}
      <section className="band band-white">
        <div className="wrap stack">
          <div className="with-photo">
            <div className="stack">
              <div className="stack-s">
                <p className="eyebrow">The problem</p>
                <h2 className="h2">DOES THIS SOUND <em>like you?</em></h2>
              </div>

              <div className="grid grid-2">
            <div className="card card-soft stack-s">
              <p className="eyebrow" style={{ letterSpacing: ".14em" }}>PMS symptoms?</p>
              <div className="ticklist">
                <div><span className="sym"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3.4S5.6 9.9 5.6 14.1a6.4 6.4 0 0 0 12.8 0C18.4 9.9 12 3.4 12 3.4z" /><path d="M9.2 14.4a2.9 2.9 0 0 0 2.9 2.9" /></svg></span><span>Bloating &amp; water retention</span></div>
                <div><span className="sym"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.8 13.4c1.4-4.2 2.9-4.2 4.3 0s2.9 4.2 4.3 0 2.9-4.2 4.3 0 2.9 4.2 4.3 0" /><path d="M4 19.2h16" /></svg></span><span>Mood swings &amp; irritability</span></div>
                <div><span className="sym"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="13.4" r="3.7" /><path d="M12 6.1V3.4M17.3 8.1l1.9-1.9M6.7 8.1 4.8 6.2M19.3 13.4H22M2 13.4h2.7" /></svg></span><span>Breast tenderness &amp; cramps</span></div>
                <div><span className="sym"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.6" /><circle cx="9.2" cy="10" r="1.05" fill="currentColor" stroke="none" /><circle cx="14.7" cy="9.3" r="1.05" fill="currentColor" stroke="none" /><circle cx="13.1" cy="14.9" r="1.05" fill="currentColor" stroke="none" /></svg></span><span>Breakouts &amp; acne</span></div>
              </div>
            </div>
            <div className="card card-soft stack-s">
              <p className="eyebrow" style={{ letterSpacing: ".14em" }}>Perimenopause symptoms?</p>
              <div className="ticklist">
                <div><span className="sym"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3.4" y="5.2" width="17.2" height="15.2" rx="2.6" /><path d="M8 3.2v4M16 3.2v4M3.4 10.2h17.2" /><circle cx="12" cy="15.3" r="1.7" fill="currentColor" stroke="none" /></svg></span><span>Irregular cycles &amp; heavier flow</span></div>
                <div><span className="sym"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.5 17a8.5 8.5 0 1 0-17 0" /><path d="M12 17l4.8-5" /><circle cx="12" cy="17" r="1.35" fill="currentColor" stroke="none" /><path d="M3.5 17h17" /></svg></span><span>Belly fat that will not budge</span></div>
                <div><span className="sym"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.2 14.7A8.5 8.5 0 0 1 9.3 3.8a8.6 8.6 0 1 0 10.9 10.9z" /></svg></span><span>Poor sleep &amp; low energy</span></div>
                <div><span className="sym"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7.1 16.2h9.6a3.95 3.95 0 0 0 .5-7.87A6 6 0 0 0 5.9 7.3 3.9 3.9 0 0 0 7.1 16.2z" /><path d="M4.6 19.6h8.2M15.6 19.6h3.8" /></svg></span><span>Mood changes, brain fog</span></div>
              </div>
            </div>
            </div>
            </div>
            <img className="disc" src={imgWomanProblem} alt="A Hormone Focus customer holding the bottle" loading="lazy" width="666" height="772" />
          </div>
        </div>
      </section>

      {/* ===== THE WHY ===== */}
      <section className="band band-lav2">
        <div className="wrap why-grid">
          <div className="stack-s">
            <p className="eyebrow">Why it is all at once</p>
            <h2 className="h2">THESE ARE NOT DIFFERENT PROBLEMS. THEY ARE <em>one</em></h2>
            <p className="lead" style={{ color: "var(--ink)", fontSize: "var(--lead)" }}>This is not something going wrong. It is a stage.</p>
          </div>

          <div className="card stack-s" style={{ borderRadius: "26px" }}>
            <svg width="100%" viewBox="0 0 378 190" fill="none" style={{ display: "block" }}>
              <line x1="129" y1="14" x2="129" y2="150" stroke="#E3D6F3" strokeWidth="1.5" strokeDasharray="4 5" />
              <line x1="248" y1="14" x2="248" y2="150" stroke="#E3D6F3" strokeWidth="1.5" strokeDasharray="4 5" />
              <path d="M10,95 C20,78 30,78 40,95 C50,112 60,112 70,95 C80,80 90,80 100,95 C110,110 120,110 129,97 C140,86 152,86 163,100 C174,114 186,112 197,102 C208,94 220,95 231,106 C238,114 244,112 248,110 L262,114 L278,117 L294,119 L312,121 L334,123 L368,125" stroke="#5FA6A2" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10,75 C20,50 30,50 40,75 C50,100 60,100 70,75 C80,50 90,50 100,75 C110,100 120,100 129,75 C140,42 152,42 163,78 C174,110 186,108 197,72 C208,38 220,40 231,80 C238,102 244,96 248,84 L256,45 L264,92 L272,38 L282,100 L290,52 L300,105 L310,30 L322,88 L332,60 L344,102 L356,48 L368,80" stroke="#A386D2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <text x="69" y="170" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="15" fontWeight="800" fill="#276F6C">20s</text>
              <text x="188" y="170" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="15" fontWeight="800" fill="#276F6C">30s</text>
              <text x="308" y="170" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="15" fontWeight="800" fill="#276F6C">40s</text>
              <text x="69" y="186" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="11" fill="#6B6579">a rhythm</text>
              <text x="188" y="186" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="11" fill="#6B6579">tipping</text>
              <text x="308" y="186" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="11" fill="#6B6579">unpredictable</text>
            </svg>
            <div style={{ display: "flex", gap: "22px", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}><span style={{ width: "20px", height: "3px", borderRadius: "2px", background: "#A386D2" }}></span><span style={{ fontSize: "var(--small)", fontWeight: "600", color: "#4A3A63" }}>Estrogen</span></span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}><span style={{ width: "20px", height: "3px", borderRadius: "2px", background: "#5FA6A2" }}></span><span style={{ fontSize: "var(--small)", fontWeight: "600", color: "#3F6B69" }}>Progesterone</span></span>
              <span className="micro" style={{ marginLeft: "auto" }}>Illustrative only.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CLEARING ===== */}
      <section className="band band-teal">
        <div className="wrap grid grid-2" style={{ alignItems: "center", gap: "clamp(24px, 4vw, 52px)" }}>
          <h2 className="h2">AND YOUR BODY HAS TO CLEAR THE EXTRA ESTROGEN</h2>
          <div className="stack-s">
            <p className="body">"If your body can't clear out the extra estrogen, it builds up and makes symptoms like bloating, cramps, mood swings, and fatigue worse."</p>
            <hr className="rule" />
            <p className="body" style={{ fontWeight: "600", color: "#FFFFFF" }}>Which is why the bottle has three ingredients, not just DIM.</p>
          </div>
        </div>
      </section>

      {/* ===== 3. SOCIAL PROOF ===== */}
      <section className="band band-white">
        <div className="wrap stack">
          <div className="stack-s">
            <h2 className="h2 h2-split">JOIN THE WOMEN WHO STOPPED FIGHTING IT <em>one symptom at a time</em></h2>
            <div className="rating-row">
            <a className="rating rating-link" href="#reviews" aria-label="Read all customer reviews"
               onClick={() => trackReviewsClick("social_proof")}>
              <span className="stars">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#E8B84B"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#E8B84B"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#E8B84B"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#E8B84B"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#E8B84B"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
              </span>
              <b>{rating.average.toFixed(1)}</b>
              <RatingCount total={rating.total} />
            </a>
            <OkendoTag />
            </div>
          </div>

          <div className="grid grid-6" style={{ gap: "clamp(8px, 1.2vw, 14px)" }}>
            <img src={imgSelfie1} alt="Customer with Hormone Focus" style={{ width: "100%", borderRadius: "14px" }} loading="lazy" width="300" height="468" />
            <img src={imgSelfie2} alt="Customer with Hormone Focus" style={{ width: "100%", borderRadius: "14px" }} loading="lazy" width="300" height="468" />
            <img src={imgSelfie3} alt="Customer with Hormone Focus" style={{ width: "100%", borderRadius: "14px" }} loading="lazy" width="300" height="468" />
            <img src={imgSelfie4} alt="Customer with Hormone Focus" style={{ width: "100%", borderRadius: "14px" }} loading="lazy" width="300" height="468" />
            <img src={imgSelfie5} alt="Customer with Hormone Focus" style={{ width: "100%", borderRadius: "14px" }} loading="lazy" width="300" height="468" />
            <img src={imgSelfie6} alt="Customer with Hormone Focus" style={{ width: "100%", borderRadius: "14px" }} loading="lazy" width="300" height="468" />
          </div>

          <div className="proof-split">
            <div className="grid grid-2 reviews">
              <div className="card card-soft">
                <p className="body" style={{ color: "var(--ink)" }}>&ldquo;It&rsquo;s so AMAZING has given me my life back!&rdquo;</p>
                <div className="rev-by">
                  <img className="rev-av" src={imgSelfie1} alt="" loading="lazy" width="300" height="468" />
                  <span className="rev-who"><span className="rev-name">Anita F.</span><span className="rev-vb"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>Verified buyer</span></span>
                </div>
              </div>
              <div className="card card-soft">
                <p className="body" style={{ color: "var(--ink)" }}>&ldquo;I started taking Hormone Focus and all I can say is I had immediate relief in many areas. My hot flashes started to fade; I could sleep through the night and my brain fog is slowly recovering. I have all 3 in the plan and I&rsquo;m so thankful for this product! I&rsquo;m starting to feel like myself again. Thanks JJ!!!!!!&rdquo;</p>
                <div className="rev-by">
                  <img className="rev-av" src={imgSelfie2} alt="" loading="lazy" width="300" height="468" />
                  <span className="rev-who"><span className="rev-name">Katina S.</span><span className="rev-vb"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>Verified buyer</span></span>
                </div>
              </div>
              <div className="card card-soft">
                <p className="body" style={{ color: "var(--ink)" }}>&ldquo;I have been using the Hormone Focus bundle for almost 2 months. The best way to describe how I feel, I believe only women who are going through it will understand, I feel normal again! I write this a bit teary eyed. The last few years have been tough. My menopause symptoms included anxiety. I felt like fear had me in a choke hold. After I received the bundle, I kid you not, the first night I was able to sleep and wake up the next morning feeling rested. My hot flashes and night sweats became less. My mood has improved and the anxious thoughts and feeling gone. This has been a game changer for my relationship with my husband as well.&rdquo;</p>
                <div className="rev-by">
                  <img className="rev-av" src={imgSelfie3} alt="" loading="lazy" width="300" height="468" />
                  <span className="rev-who"><span className="rev-name">Adrienne</span><span className="rev-vb"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>Verified buyer</span></span>
                </div>
              </div>
              <div className="card card-soft">
                <p className="body" style={{ color: "var(--ink)" }}>&ldquo;This has made a tremendous change in my perimenopause symptoms... I sleep better, no night sweat, mood is great and less flashes! Fast results.&rdquo;</p>
                <div className="rev-by">
                  <img className="rev-av" src={imgSelfie4} alt="" loading="lazy" width="300" height="468" />
                  <span className="rev-who"><span className="rev-name">Roslind</span><span className="rev-vb"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>Verified buyer</span></span>
                </div>
              </div>
            </div>
            <figure className="fb-shot fb-proof">
              <img src={imgFbReview} width="900" height="649" loading="lazy" alt="Facebook comment from Martinez Sullivan: this is a game changer, I have literally shed some inches and lbs, not to mention the hot flashes are gone when I take it" />
            </figure>
          </div>

          {/* Straight into the full set of reviews, before the videos */}
          <a className="proof-cta" href="#reviews" onClick={() => trackReviewsClick("social_proof_cta")}>
            <span className="proof-cta-l">Read more real customer stories and testimonials</span>
            <span className="proof-cta-s">
              <span className="stars">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#E8B84B" aria-hidden="true"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#E8B84B" aria-hidden="true"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#E8B84B" aria-hidden="true"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#E8B84B" aria-hidden="true"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#E8B84B" aria-hidden="true"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
              </span>
              {rating.average.toFixed(1)} from {rating.total} reviews
            </span>
            <OkendoTag />
            <svg className="proof-cta-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h13" /><path d="M12 5l7 7-7 7" /></svg>
          </a>

          {/* What people are saying, straight from JJ's product page */}
          <div className="vids">
            <div className="vids-track">
              <div className="vid" data-vimeo="948965910" data-h="92f77779fc">
                <img src={imgVideoV1} alt="" loading="lazy" width="520" height="924" />
                <button className="vid-play" type="button" aria-label="Play video testimonial 1"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.53.85l10.6-6.8a1 1 0 0 0 0-1.7L9.53 4.35A1 1 0 0 0 8 5.2z" /></svg></button>
              </div>
              <div className="vid" data-vimeo="948966113" data-h="f3208c6af4">
                <img src={imgVideoV2} alt="" loading="lazy" width="520" height="924" />
                <button className="vid-play" type="button" aria-label="Play video testimonial 2"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.53.85l10.6-6.8a1 1 0 0 0 0-1.7L9.53 4.35A1 1 0 0 0 8 5.2z" /></svg></button>
              </div>
              <div className="vid" data-vimeo="948966175" data-h="1b5b185021">
                <img src={imgVideoV3} alt="" loading="lazy" width="520" height="924" />
                <button className="vid-play" type="button" aria-label="Play video testimonial 3"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.53.85l10.6-6.8a1 1 0 0 0 0-1.7L9.53 4.35A1 1 0 0 0 8 5.2z" /></svg></button>
              </div>
              <div className="vid" data-vimeo="948966221" data-h="e9d03a3138">
                <img src={imgVideoV4} alt="" loading="lazy" width="520" height="924" />
                <button className="vid-play" type="button" aria-label="Play video testimonial 4"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.53.85l10.6-6.8a1 1 0 0 0 0-1.7L9.53 4.35A1 1 0 0 0 8 5.2z" /></svg></button>
              </div>
              <div className="vid" data-vimeo="948966260" data-h="24b0393551">
                <img src={imgVideoV5} alt="" loading="lazy" width="520" height="924" />
                <button className="vid-play" type="button" aria-label="Play video testimonial 5"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.53.85l10.6-6.8a1 1 0 0 0 0-1.7L9.53 4.35A1 1 0 0 0 8 5.2z" /></svg></button>
              </div>
              <div className="vid" data-vimeo="948966331" data-h="f36ce92619">
                <img src={imgVideoV6} alt="" loading="lazy" width="520" height="924" />
                <button className="vid-play" type="button" aria-label="Play video testimonial 6"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.53.85l10.6-6.8a1 1 0 0 0 0-1.7L9.53 4.35A1 1 0 0 0 8 5.2z" /></svg></button>
              </div>
              <div className="vid" data-vimeo="948966385" data-h="62d3de5dd3">
                <img src={imgVideoV7} alt="" loading="lazy" width="520" height="924" />
                <button className="vid-play" type="button" aria-label="Play video testimonial 7"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.53.85l10.6-6.8a1 1 0 0 0 0-1.7L9.53 4.35A1 1 0 0 0 8 5.2z" /></svg></button>
              </div>
              <div className="vid" data-vimeo="948966430" data-h="c476465217">
                <img src={imgVideoV8} alt="" loading="lazy" width="520" height="924" />
                <button className="vid-play" type="button" aria-label="Play video testimonial 8"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.53.85l10.6-6.8a1 1 0 0 0 0-1.7L9.53 4.35A1 1 0 0 0 8 5.2z" /></svg></button>
              </div>
              <div className="vid" data-vimeo="948966468" data-h="7bcd8e816d">
                <img src={imgVideoV9} alt="" loading="lazy" width="520" height="924" />
                <button className="vid-play" type="button" aria-label="Play video testimonial 9"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.53.85l10.6-6.8a1 1 0 0 0 0-1.7L9.53 4.35A1 1 0 0 0 8 5.2z" /></svg></button>
              </div>
            </div>
          </div>

          <p className="micro">Reviews, photos and videos from verified buyers on JJSmithOnline.com, and a comment from Facebook. Individual results vary.</p>

          <div className="cta-row"><a className="btn btn-primary" href="#offer">Get Hormone Focus <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13" /><path d="M12 5l7 7-7 7" /></svg></a></div>
        </div>
      </section>

      {/* ===== 4. VALUE PROPS ===== */}
      <section className="band band-lav">
        <div className="wrap stack">
          <div className="stack-s">
            <p className="eyebrow">The answer</p>
            <h2 className="h2">WHAT YOU ARE ACTUALLY <em>buying</em></h2>
          </div>

          <div className="grid grid-3">
            <div className="card stack-s" style={{ gap: "8px" }}>
              <h3 className="card-title">Every milligram printed</h3>
              <p className="small">Three ingredients, every milligram on the label and on this page. Nothing hidden in a blend.</p>
            </div>
            <div className="card stack-s" style={{ gap: "8px" }}>
              <h3 className="card-title">Two capsules with a meal</h3>
              <p className="small">That is the whole protocol. Nothing to weigh, nothing to log, nothing to explain.</p>
            </div>
            <div className="card stack-s" style={{ gap: "8px" }}>
              <h3 className="card-title">Sixty days to change your mind</h3>
              <p className="small">The guarantee outlasts the bottle, on up to two bottles.</p>
            </div>
          </div>

          <div className="ing-panel">
            <p className="eyebrow" style={{ letterSpacing: ".16em" }}>The three ingredients</p>

            <div className="ing-map">
            <div className="ing-node ing-a">
              <div className="ing-card">
                <span className="ing-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="8.8" cy="8.4" r="3.1" /><circle cx="15.2" cy="8.4" r="3.1" /><circle cx="12" cy="5.9" r="3" /><path d="M10.1 11.4 11 20h2l.9-8.6" /></svg></span>
                <div className="ing-h"><b>DIM</b><span className="pill">200mg</span></div>
                <p className="small">Helps the body convert estrogen into the beneficial metabolites.</p>
              </div>
              <svg className="ing-arrow" viewBox="0 0 72 40" fill="none" aria-hidden="true"><path d="M4 30 C 22 31, 40 26, 58 14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /><path d="M58 14 l -6.2 10.3 M58 14 l -11.9 1.9" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></svg>
            </div>
              <img className="ing-bottle" src={imgIngredientsBottle} width="480" height="786" loading="lazy" decoding="async" alt="Hormone Focus" />
            <div className="ing-node ing-b">
              <div className="ing-card">
                <span className="ing-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.4" /><path d="M12 3.6v16.8M3.6 12h16.8M6.1 6.1l11.8 11.8M17.9 6.1 6.1 17.9" /></svg></span>
                <div className="ing-h"><b>Calcium D-Glucarate</b><span className="pill">500mg</span></div>
                <p className="small">Supports the body&rsquo;s natural elimination, so it is not reabsorbed.</p>
              </div>
              <svg className="ing-arrow" viewBox="0 0 72 40" fill="none" aria-hidden="true"><path d="M4 30 C 22 31, 40 26, 58 14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /><path d="M58 14 l -6.2 10.3 M58 14 l -11.9 1.9" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></svg>
            </div>
            <div className="ing-node ing-c">
              <div className="ing-card">
                <span className="ing-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="8.9" cy="14.6" r="3.5" /><circle cx="15.7" cy="15.8" r="2.7" /><circle cx="13.1" cy="8.9" r="3" /></svg></span>
                <div className="ing-h"><b>BioPerine</b><span className="pill">2.5mg</span></div>
                <p className="small">Helps you absorb both.</p>
              </div>
              <svg className="ing-arrow ing-arrow-up" viewBox="0 0 44 62" fill="none" aria-hidden="true"><path d="M30 58 C 30 42, 22 28, 20 10" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /><path d="M20 10 l -5 11 M20 10 l 6 10.4" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></svg>
            </div>
            </div>

            <p className="small ing-foot">No proprietary blend. What is on this page is what is in the bottle.</p>
          </div>
        </div>
      </section>

      {/* ===== 5. HOW IT WORKS ===== */}
      <section className="band band-white">
        <div className="wrap stack">
          <h2 className="h2">IT FITS THE LIFE YOU ALREADY HAVE <em>in three</em></h2>

          <div className="with-photo is-left">
            <img src={imgWomanSteps} alt="A Hormone Focus customer holding the bottle" loading="lazy" width="455" height="620" />
            <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="card card-soft step">
              <span className="step-n">1</span>
              <span className="stack-s" style={{ gap: "5px" }}>
                <span style={{ fontSize: "var(--h3)", fontWeight: "700", color: "var(--ink)" }}>Take two with breakfast</span>
                <span className="small">With a meal and water. It lives beside the kettle, not in your calendar.</span>
              </span>
            </div>
            <div className="card card-soft step">
              <span className="step-n">2</span>
              <span className="stack-s" style={{ gap: "5px" }}>
                <span style={{ fontSize: "var(--h3)", fontWeight: "700", color: "var(--ink)" }}>Change nothing else</span>
                <span className="small">Same food, same routine, same Tuesday. Nothing here asks you to rebuild your week first.</span>
              </span>
            </div>
            <div className="card card-soft step">
              <span className="step-n">3</span>
              <span className="stack-s" style={{ gap: "5px" }}>
                <span style={{ fontSize: "var(--h3)", fontWeight: "700", color: "var(--ink)" }}>Finish the bottle</span>
                <span className="small">Thirty days of capsules with sixty days of guarantee behind them. There is nothing to lose by finding out.</span>
              </span>
            </div>
            </div>
          </div>

          <div className="cta-row"><a className="btn btn-primary" href="#offer">Get Hormone Focus <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13" /><path d="M12 5l7 7-7 7" /></svg></a></div>
        </div>
      </section>

      {/* ===== 6. FAQ + FUD ===== */}
      <section className="band band-lav">
        <div className="wrap stack">
          <h2 className="h2">STILL <em>wondering?</em></h2>

          <div className="grid grid-2">
            <div className="card stack-s" style={{ gap: "8px" }}>
              <h3 style={{ fontSize: "var(--h3)", fontWeight: "700", color: "var(--ink)", margin: "0" }}>How long before I know if it suits me?</h3>
              <p className="small">One bottle is thirty days. The guarantee runs sixty, so you have a full month past the last capsule to decide.</p>
            </div>
            <div className="card stack-s" style={{ gap: "8px" }}>
              <h3 style={{ fontSize: "var(--h3)", fontWeight: "700", color: "var(--ink)", margin: "0" }}>Who should not take it?</h3>
              <p className="small">Anybody with a history of heart disease or stroke, breast or uterine cancer, liver disease, or blood clots. Talk to your doctor first, and doubly so if you are pregnant, nursing or on medication.</p>
            </div>
            <div className="card stack-s" style={{ gap: "8px" }}>
              <h3 style={{ fontSize: "var(--h3)", fontWeight: "700", color: "var(--ink)", margin: "0" }}>Is there a proprietary blend?</h3>
              <p className="small">No. Three ingredients, every milligram printed. What is on this page is what is in the bottle.</p>
            </div>
            <div className="card stack-s" style={{ gap: "8px" }}>
              <h3 style={{ fontSize: "var(--h3)", fontWeight: "700", color: "var(--ink)", margin: "0" }}>What if it is not for me?</h3>
              <p className="small">The 60-day happiness guarantee refunds up to two bottles, after you have actually tried it. A subscription cancels any time.</p>
            </div>
          </div>


          <div className="trustrow">
            <div>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#276F6C" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
              60-day guarantee
            </div>
            <div>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#276F6C" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="14" height="10" rx="2" /><path d="M16 10h3l3 3v4h-6z" /><circle cx="6.5" cy="19" r="1.8" /><circle cx="18" cy="19" r="1.8" /></svg>
              In stock, ships today
            </div>
            <div>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#276F6C" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12a8 8 0 018-8 8 8 0 017 4" /><path d="M20 4v5h-5" /><path d="M20 12a8 8 0 01-8 8 8 8 0 01-7-4" /><path d="M4 20v-5h5" /></svg>
              Cancel any time
            </div>
          </div>
        </div>
      </section>

      {/* ===== 7. CLOSER ===== */}
      <section className="band band-teal">
        <div className="wrap grid grid-2" style={{ alignItems: "center", gap: "clamp(28px, 4vw, 56px)" }}>
          <div className="stack-s">
            <h2 className="h2">EVERY REASON TO START TODAY. <em>None to wait.</em></h2>
            <p className="body">Three ingredients, every milligram printed. Two capsules with a meal. Sixty days of guarantee on up to two bottles, so the risk sits with us, not with you.</p>
          </div>
          <div className="stack-s" style={{ alignItems: "center", textAlign: "center" }}>
            <a className="rating rating-link rating-on-teal" href="#reviews" style={{ justifyContent: "center" }}
               aria-label="Read all customer reviews" onClick={() => trackReviewsClick("closer")}>
              <span className="stars">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="#F3CE73"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="#F3CE73"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="#F3CE73"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="#F3CE73"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="#F3CE73"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
              </span>
              <b style={{ color: "#FFFFFF" }}>{rating.average.toFixed(1)}</b>
              <RatingCount total={rating.total} />
            </a>
            <a className="btn btn-light" href="#offer" style={{ borderRadius: "999px" }}>
              Get Hormone Focus
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13" /><path d="M12 5l7 7-7 7" /></svg>
            </a>
            <p className="micro">60-day guarantee &nbsp;&middot;&nbsp; In stock, ships today &nbsp;&middot;&nbsp; Cancel any time</p>
          </div>
        </div>
      </section>

      {/* ===== 8. OFFER - three ways to buy ===== */}
      {/* Shopify destinations are NOT written here. One config: HF_OFFERS, at the foot of the page. */}
      <section className="band band-lav2" id="offer" style={{ scrollMarginTop: "16px" }}>
        <div className="wrap stack">

          <div className="stack-s" style={{ alignItems: "center", textAlign: "center" }}>
            <p className="eyebrow">Get started</p>
            <h2 className="h2" style={{ color: "var(--ink)" }}>Feel like you again for just <span style={{ color: "var(--purple)" }}>$1.25 a day</span>.</h2>
            <p className="body" style={{ maxWidth: "42ch" }}>Less than a coffee. Two capsules a day.</p>
          </div>

          <div className="offers offers-pair">

            {/* CARD 1 - THE PROTOCOL. First in the DOM so it leads on a phone;
                CSS order puts it on the right on desktop. */}
            <div className="offer-col col-protocol">
              <div className="offer offer-best offer-lead">
                <div className="offer-badge">BESTSELLER</div>
                {/* The banner carries the title and subtitle as artwork, so the
                    visible ones are gone. planName/planSubtitle still drive the
                    alt text and an sr-only heading, which is what screen readers
                    and crawlers read. */}
                <h3 className="sr-only">{PROTOCOL.planName}. {PROTOCOL.planSubtitle}</h3>
                <picture className="kit-shot">
                  <source
                    type="image/webp"
                    srcSet={`${imgKit512} 512w, ${imgKit768} 768w, ${imgKit1024} 1024w`}
                    sizes="(max-width: 900px) calc(100vw - 80px), 700px"
                  />
                  <img
                    src={PROTOCOL.image}
                    width="1024"
                    height="768"
                    loading="lazy"
                    decoding="async"
                    alt={`${PROTOCOL.planName}: 2 bottles of Hormone Focus, The 60-Day Hormone Fix eBook, Hormone Healthy Recipes eBook and Daily Symptom Tracker`}
                  />
                </picture>

                <div className="vs">
                  <ul className="vs-list">
                    {PROTOCOL.stack.map((item) => (
                      <li key={item.label}>
                        <span className="vs-name">
                          <span className="vs-tick" aria-hidden="true">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                          </span>
                          <span className="vs-text">
                            {item.label}
                            {item.note ? <span className="vs-note">{item.note}</span> : null}
                          </span>
                        </span>
                        {item.included ? (
                          <span className="vs-incl">Included</span>
                        ) : (
                          <span className="vs-val"><span className="strike">{money(item.value!)}</span></span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Total and price share one band instead of stacking two full
                    rows, and free shipping rides along as the pill it already
                    is elsewhere on the page rather than as a list row. */}
                <div className="vs-deal">
                  <div className="vs-deal-col">
                    <span className="vs-deal-l">Total value</span>
                    <span className="vs-deal-was strike">{money(STACK_TOTAL)}</span>
                    <span className="ship"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: "0" }}><rect x="2" y="7" width="14" height="10" rx="2" /><path d="M16 10h3l3 3v4h-6z" /><circle cx="6.5" cy="19" r="1.8" /><circle cx="18" cy="19" r="1.8" /></svg> FREE SHIPPING</span>
                  </div>
                  <div className="vs-deal-col vs-deal-now">
                    <span className="vs-deal-l">Today</span>
                    <span className="offer-now">{PROTOCOL.price}</span>
                    <span className="offer-day">{PROTOCOL.perDay}</span>
                  </div>
                </div>

                {/* Desktop only (display:none on a phone). Splits whatever slack
                    the card has above and below, instead of one large gap. */}
                <div className="offer-fill offer-fill-bottom"></div>

                {/* No data-offer here on purpose: applyOffers() rewrites those
                    hrefs from the plain HF_OFFERS table, which would drop the
                    discount. tracking.ts keys off the hostname, not data-offer,
                    so campaign decoration and BridgeCTAClick still apply. */}
                <a className="btn btn-primary btn-full" href={PROTOCOL_HREF}>
                  {PROTOCOL.ctaLabel}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13" /><path d="M12 5l7 7-7 7" /></svg>
                </a>
              </div>
            </div>

            <div className="or"><span>OR</span></div>

            {/* CARD 2 - ONE BOTTLE. Quieter, and the only card that carries a
                choice. CSS order puts it on the left on desktop. */}
            <div className="offer-col col-bottle">
              <div className="offer offer-quiet">

                <div className="offer-head">
                  <div className="offer-shots"><img src={imgOffer1Bottle} width="800" height="800" loading="lazy" decoding="async" alt="Hormone Focus, one bottle" /></div>
                  <div className="offer-main">
                    <div className="offer-name">30-Day Supply</div>
                    <div className="offer-supply">One bottle of Hormone Focus. 60 capsules, two a day.</div>
                  </div>
                </div>

                <div className="offer-fill"></div>

                <div className="opts" role="radiogroup" aria-label="How to buy one bottle" onKeyDown={onOptKeyDown}>
                  {PLANS.map((p, i) => {
                    const on = plan === p.id;
                    return (
                      <div
                        key={p.id}
                        role="radio"
                        aria-checked={on}
                        tabIndex={on ? 0 : -1}
                        ref={(el) => { optRefs.current[i] = el; }}
                        className={"opt" + (on ? " opt-on" : "") + (p.id === "sub" ? " opt-sub" : "")}
                        onClick={() => setPlan(p.id)}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.key === "Enter") { e.preventDefault(); setPlan(p.id); }
                        }}
                      >
                        <div className="opt-top">
                          <span className="opt-dot" aria-hidden="true"></span>
                          <div className="opt-name">
                            <div className="opt-title">
                              <span className="opt-label">{p.title}</span>
                              {p.pill ? <span className="opt-pill">{p.pill}</span> : null}
                            </div>
                            <div className="opt-cadence">{p.cadence}</div>
                          </div>
                          <div className="opt-cost">
                            <div className="opt-figures">
                              <span className="opt-price">{p.price}</span>
                              {p.was ? <span className="strike opt-was">{p.was}</span> : null}
                            </div>
                            {p.per ? <div className="opt-per">{p.per}</div> : null}
                          </div>
                        </div>
                        {p.benefits ? (
                          <div className="opt-extra">
                            <span className="ship"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: "0" }}><rect x="2" y="7" width="14" height="10" rx="2" /><path d="M16 10h3l3 3v4h-6z" /><circle cx="6.5" cy="19" r="1.8" /><circle cx="18" cy="19" r="1.8" /></svg> FREE SHIPPING</span>
                            <span className="opt-note">Pause or cancel anytime</span>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                {/* Desktop only. With the protocol card now carrying a value
                    stack this card has a lot of slack, and a single spacer above
                    the options left one void in the middle. A second one below
                    them spreads it: image, options and button each get air. */}
                <div className="offer-fill offer-fill-bottom"></div>

                {/* One anchor, not two: React keeps the same DOM node across the
                    selection, so the click listeners tracking.ts attached at load
                    (Meta BridgeCTAClick, and the re-decorate that re-applies the
                    visitor's UTMs) survive switching option. */}
                <a
                  className={"btn btn-full btn-ghost" + (activeOffer.url ? "" : " hf-pending")}
                  data-offer={activeOffer.key}
                  href={activeOffer.url || undefined}
                  aria-disabled={activeOffer.url ? undefined : true}
                >
                  {active.cta}&nbsp;&middot;&nbsp;{active.price}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13" /><path d="M12 5l7 7-7 7" /></svg>
                </a>
                <p className="micro" data-offer-note="protocol" style={{ display: HF_OFFERS.protocol ? "none" : "block", marginTop: "10px" }}>Subscription checkout opens shortly. The one-time options are ready now.</p>
              </div>
            </div>

          </div>

          {/* One trust row for the pair: the guarantee and the stock promise
              carry the same weight instead of one being a heading and the
              other a grey footnote. */}
          <div className="trust">
            <span className="trust-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
              60-day money-back guarantee
            </span>
            <span className="trust-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="7" width="14" height="10" rx="2" /><path d="M16 10h3l3 3v4h-6z" /><circle cx="6.5" cy="19" r="1.8" /><circle cx="18" cy="19" r="1.8" /></svg>
              In stock, ships today
            </span>
          </div>
        </div>
      </section>

      {/* ===== GUARANTEE ===== */}
      <section className="band band-teal">
        <div className="wrap guarantee">
          <img src={imgMoneyBackBadge} alt="60-day money-back guarantee" loading="lazy" width="411" height="410" />
          <div className="stack-s">
            <p className="eyebrow">Our promise</p>
            <h2 className="h2">60-DAY HAPPINESS <em>guarantee</em></h2>
            <p className="body">Try it for 60 days. If you&rsquo;re not satisfied, you get your money back.</p>
            <a className="btn gt-cta" href="#offer">
              Start today, risk-free
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h13" /><path d="M12 5l7 7-7 7" /></svg>
            </a>
            <p className="gt-fine">US orders only &nbsp;&middot;&nbsp; Covers up to two bottles &nbsp;&middot;&nbsp; Shipping not refunded</p>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="band band-lav">
        <div className="wrap" style={{ textAlign: "center" }}>
          <p className="eyebrow">Questions women ask</p>
          <h2 className="h2" style={{ marginTop: "12px" }}>FREQUENTLY ASKED <em>questions</em></h2>
          <div className="faqlist">
          <details className="faq">
            <summary>What are the benefits of Hormone Focus?<span className="faq-mark" aria-hidden="true"></span></summary>
            <div className="faq-a">
              <p className="small">Hormone Focus provides relief for PMS and Perimenopause symptoms and is specifically formulated to support healthy hormone levels, promote weight loss by addressing hormonal imbalances, aid in menstrual cycle regulation.</p>
              <p className="small"><b>For PMS:</b> PMS happens when your hormones are out of balance &mdash; usually too much estrogen compared to progesterone. If your body can&rsquo;t clear out the extra estrogen, it builds up and makes symptoms like bloating, cramps, mood swings, and fatigue worse.</p>
              <p className="small"><b>For Perimenopause:</b> During perimenopause, estrogen starts to swing up and down unpredictably. Too much estrogen compared to progesterone leads to problems like belly fat, poor sleep, hot flashes, and brain fog. Hormone Focus helps rebalance estrogen so these symptoms ease up.</p>
            </div>
          </details>
          <details className="faq">
            <summary>Does Hormone Focus replace the other Focus supplements (Liver Focus, Blood Sugar Focus and Tummy Focus)?<span className="faq-mark" aria-hidden="true"></span></summary>
            <div className="faq-a">
              <p className="small">No, it doesn&rsquo;t replace any of our other Focus supplements. Hormone Focus relieves symptoms of hormonal imbalance such as weight gain, night sweats, hot flashes and cramps. While Hormone Focus works to balance hormone levels, it does not replace other FOCUS supplements that support weight loss and a healthy lifestyle. Tummy Focus is for digestive cleansing for reduced belly fat and bloating while Liver Focus is a liver cleanse that accelerates fat burning in the body. If you want to reduce sugar cravings and prevent your body from storing belly fat, take Blood Sugar Focus with meals.</p>
            </div>
          </details>
          <details className="faq">
            <summary>How should you take Hormone Focus?<span className="faq-mark" aria-hidden="true"></span></summary>
            <div className="faq-a">
              <p className="small">For optimal results, take 2 capsules with a meal and a glass of water or as directed by a healthcare professional. Some women who have trouble sleeping related to estrogen dominance, perimenopause or menopause find that taking Hormone Focus at night helps them stay asleep longer. It&rsquo;s important to consult with a healthcare professional when making dosage adjustments.</p>
            </div>
          </details>
          <details className="faq">
            <summary>How long should you take Hormone Focus?<span className="faq-mark" aria-hidden="true"></span></summary>
            <div className="faq-a">
              <p className="small">Hormone Focus is not a stimulant and does not lead to dependency. Therefore, it is safe to take until you achieve your desired results. The duration of use may vary based on individual needs and goals.</p>
            </div>
          </details>
          <details className="faq">
            <summary>How quickly does Hormone Focus work?<span className="faq-mark" aria-hidden="true"></span></summary>
            <div className="faq-a">
              <p className="small">The speed of Hormone Focus&rsquo;s effectiveness can vary based on your current hormonal balance and overall health. Generally, it will take 30 days of consistent use to begin experiencing a reduction of symptoms; long-term use will help you achieve the benefits of hormonal balance.</p>
            </div>
          </details>
          <details className="faq">
            <summary>What are the ingredients in Hormone Focus?<span className="faq-mark" aria-hidden="true"></span></summary>
            <div className="faq-a">
              <p className="small">Unlike other brands which offer DIM only or Calcium D-Glucarate only, we combine both DIM and Calcium D-Glucarate, in a compact 2-capsule serving.</p>
              <p className="small"><b>DIM</b>, or Diindolylmethane, helps to balance estrogen levels and promote healthier metabolism of fat and aiding muscle development.</p>
              <p className="small"><b>Calcium D-Glucarate</b> helps to optimize hormone levels and help the detoxification process. Calcium D-Glucarate has been shown to prevent the body from reabsorbing and recycling hormones and harmful environmental toxins.</p>
              <p className="small"><b>BioPerine&reg;</b> improves the absorption and bioavailability of the nutrients in Hormone Focus. BioPerine is a natural ingredient that can help improve nutrient and supplement absorption.</p>
            </div>
          </details>
          </div>
        </div>
      </section>

      {/* ===== REVIEWS (live, from Okendo) ===== */}
      <Suspense fallback={null}><Reviews /></Suspense>

      {/* ===== SIGN-OFF ===== */}
      <section className="band band-white">
        <div className="wrap">
          <div className="signoff">
            <img src={imgJjLifestyle} alt="JJ Smith" loading="lazy" width="889" height="1264" />
            <div className="stack-s" style={{ padding: "clamp(26px, 3.6vw, 48px)" }}>
              <p className="lead" style={{ color: "var(--ink)", fontWeight: "600" }}>Your hormones deserve a little love, and so do you.</p>
              <div>
                <p className="small" style={{ color: "#4A3A63" }}>To feeling like yourself again,</p>
                <p className="script" style={{ fontSize: "clamp(30px, 3.4vw, 38px)", lineHeight: "1.2", color: "var(--purple-mid)" }}>JJ Smith</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SITE FOOTER ===== */}
      {/* id is what the sticky bar watches: it stands down once this is in view */}
      <footer className="sitefoot" id="hf-footer">
        <div className="wrap">
          <p className="sf-fda">*The statements made on this website have not been evaluated by the FDA (U.S. Food and Drug Administration). The products sold on this website are not intended to diagnose, treat, cure or prevent any disease. The information provided by this website or this company is not a substitute for face-to-face consultation with your physician and should not be construed as individual medical advice. If you have any concerns, please consult your doctor or healthcare professional at all times.</p>
          <p className="sf-fine">Reviews and photos are from verified buyers on JJSmithOnline.com, plus one comment from Facebook. Individual results vary.</p>
          <p className="sf-fine">To request a refund, email <a href="mailto:support@jjsmithonline.com">support@jjsmithonline.com</a> within 60 days of purchase.</p>

          <div className="sf-main">
            <div className="sf-co">
              <a className="sf-logo" href="https://www.jjsmithonline.com" target="_blank" rel="noopener noreferrer">
                <img src={imgJjSmithLogo} width="132" height="25" alt="JJ Smith" loading="lazy" decoding="async" />
              </a>
              <p className="sf-addr">
                &copy; JJ Smith. All Rights Reserved.<br />
                Adiva Publishing<br />
                12138 Central Ave Suite 391, Mitchville, MD 20721<br />
                <a href="tel:+12025585543">(202) 558-5543</a>
              </p>
            </div>

            <div className="sf-right">
              <ul className="sf-social">
                <li><a href="https://www.facebook.com/RealTalkJJ/" target="_blank" rel="noopener noreferrer" aria-label="JJ Smith on Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </a></li>
                <li><a href="https://twitter.com/JJSmithOnline" target="_blank" rel="noopener noreferrer" aria-label="JJ Smith on X, formerly Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 3h3.6l4.7 6.3L17.8 3H21l-7 8.1L21.4 21h-3.6l-5-6.7L6.7 21H3.4l7.3-8.4z" /></svg>
                </a></li>
                <li><a href="https://www.instagram.com/jjsmithonline/" target="_blank" rel="noopener noreferrer" aria-label="JJ Smith on Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg>
                </a></li>
              </ul>
              <ul className="sf-links">
                <li><a href="https://www.jjsmithonline.com/contact-us/" target="_blank" rel="noopener noreferrer">Contact Us</a></li>
                <li><a href="https://www.jjsmithonline.com/terms-conditions/" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</a></li>
                <li><a href="https://www.jjsmithonline.com/privacy-policy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
                <li><a href="https://www.jjsmithonline.com/terms-conditions/#r-policy" target="_blank" rel="noopener noreferrer">Refund Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <div className="stickybar" id="hf-sticky" aria-hidden="true">
        <div className="wrap">
          <p className="sb-copy">From <b>$1.25 a day</b><span className="sb-more"><br />60-day money-back guarantee</span></p>
          <a className="btn btn-primary" href="#offer">Get Hormone Focus <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13" /><path d="M12 5l7 7-7 7" /></svg></a>
        </div>
      </div>
    </>
  );
}
