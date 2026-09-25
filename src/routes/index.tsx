import { useEffect, useRef, useState } from "react";

import { initVideos } from "@/lib/videos";
import { initOfferScroll } from "@/lib/scroll";
import { initStickyBar } from "@/lib/sticky";
import { applyOffers } from "@/lib/offers";
import { initTracking } from "@/lib/tracking";
import { HF_OFFERS, PROTOCOL_CHECKOUT_HREF } from "@/lib/offer-urls";

import imgFbReview from "@/assets/img/fb-review.jpg";
import imgHeroBottle from "@/assets/img/hero-bottle.png";
import imgIngredientsBottle from "@/assets/img/ingredients-bottle.png";
import imgJjLifestyle from "@/assets/img/jj-lifestyle.jpg";
import imgJjSmithLogo from "@/assets/img/jj-smith-logo.png";
import imgMoneyBackBadge from "@/assets/img/money-back-badge.png";
import imgOffer1Bottle from "@/assets/img/offer-1-bottle.png";
import imgOffer2Bottles from "@/assets/img/offer-2-bottles.png";
import imgOfferStarterGuide from "@/assets/img/offer-starter-guide.png";
import imgPartnersDroz from "@/assets/img/partners/droz.png";
import imgPartnersEssence from "@/assets/img/partners/essence.png";
import imgPartnersFox from "@/assets/img/partners/fox.png";
import imgPartnersNbc from "@/assets/img/partners/nbc.png";
import imgPartnersNytimes from "@/assets/img/partners/nytimes.png";
import imgPartnersSteveharvey from "@/assets/img/partners/steveharvey.png";
import imgPartnersTheview from "@/assets/img/partners/theview.png";
import imgPartnersWomansworld from "@/assets/img/partners/womansworld.png";
import imgSelfie1 from "@/assets/img/selfie-1.jpg";
import imgSelfie10 from "@/assets/img/selfie-10.jpg";
import imgSelfie11 from "@/assets/img/selfie-11.jpg";
import imgSelfie12 from "@/assets/img/selfie-12.jpg";
import imgSelfie2 from "@/assets/img/selfie-2.jpg";
import imgSelfie3 from "@/assets/img/selfie-3.jpg";
import imgSelfie4 from "@/assets/img/selfie-4.jpg";
import imgSelfie5 from "@/assets/img/selfie-5.jpg";
import imgSelfie6 from "@/assets/img/selfie-6.jpg";
import imgSelfie7 from "@/assets/img/selfie-7.jpg";
import imgSelfie8 from "@/assets/img/selfie-8.jpg";
import imgSelfie9 from "@/assets/img/selfie-9.jpg";
import imgVideoV1 from "@/assets/img/video/v1.jpg";
import imgVideoV2 from "@/assets/img/video/v2.jpg";
import imgVideoV3 from "@/assets/img/video/v3.jpg";
import imgVideoV4 from "@/assets/img/video/v4.jpg";
import imgVideoV5 from "@/assets/img/video/v5.jpg";
import imgVideoV6 from "@/assets/img/video/v6.jpg";
import imgVideoV7 from "@/assets/img/video/v7.jpg";
import imgVideoV8 from "@/assets/img/video/v8.jpg";
import imgVideoV9 from "@/assets/img/video/v9.jpg";
import imgWomanProblem from "@/assets/img/woman-problem.png";
import imgWomanSteps from "@/assets/img/woman-steps.jpg";

// StrictMode runs effects twice in development. The scripts below bind
// document-level listeners, so a second pass would animate the offer scroll
// twice and double up the video handlers. The tracking script already guards
// itself with window.__hfTracking; this does the same for the rest.
let wired = false;

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
      <style>{CSS}</style>

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
          <img src={imgJjSmithLogo} alt="JJ Smith" className="logo" />
          <a className="masthead-cta" href="#offer">Get Hormone Focus</a>
        </div>
      </header>

      {/* ===== 1. ABOVE THE FOLD ===== */}
      {/* proof bar first, then dream outcome, then the no-more line, then CTA */}
      <section className="band hero" id="hero">
        <div className="hero-top">
        <div className="wrap hero-grid">

          <div className="stack hero-copy">
            <div className="badge">
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
              <b>4.9</b>
              <span className="badge-t">from 172 verified reviews</span>
            </div>

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
        <img className="hero-shot" src={imgHeroBottle} width="683" height="800" alt="Hormone Focus, held in the hand" />
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
                <img src={imgPartnersNytimes} alt="" loading="lazy" />
                <img src={imgPartnersDroz} alt="" loading="lazy" />
                <img src={imgPartnersTheview} alt="" loading="lazy" />
                <img src={imgPartnersSteveharvey} alt="" loading="lazy" />
                <img src={imgPartnersNbc} alt="" loading="lazy" />
                <img src={imgPartnersFox} alt="" loading="lazy" />
                <img src={imgPartnersEssence} alt="" loading="lazy" />
                <img src={imgPartnersWomansworld} alt="" loading="lazy" />
                <img src={imgPartnersNytimes} alt="" loading="lazy" />
                <img src={imgPartnersDroz} alt="" loading="lazy" />
                <img src={imgPartnersTheview} alt="" loading="lazy" />
                <img src={imgPartnersSteveharvey} alt="" loading="lazy" />
                <img src={imgPartnersNbc} alt="" loading="lazy" />
                <img src={imgPartnersFox} alt="" loading="lazy" />
                <img src={imgPartnersEssence} alt="" loading="lazy" />
                <img src={imgPartnersWomansworld} alt="" loading="lazy" />
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
            <div className="rating">
              <span className="stars">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#E8B84B"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#E8B84B"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#E8B84B"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#E8B84B"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#E8B84B"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
              </span>
              <b>4.9</b>
              <span className="small">from 172 verified reviews</span>
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
                <p className="body" style={{ color: "var(--ink)" }}>&ldquo;My hot flashes are gone, my period is balance now. If you are experiencing menopause or PCOS then Hormone Focus is for you.&rdquo;</p>
                <div className="rev-by"><img className="rev-av" src={imgSelfie1} alt="" loading="lazy" width="300" height="468" /><span className="micro">verified buyer &nbsp;&middot;&nbsp; Jun 2025</span></div>
              </div>
              <div className="card card-soft">
                <p className="body" style={{ color: "var(--ink)" }}>&ldquo;I feel normal again! I write this a bit teary eyed. The last few years have been tough... the first night I was able to sleep.&rdquo;</p>
                <div className="rev-by"><img className="rev-av" src={imgSelfie2} alt="" loading="lazy" width="300" height="468" /><span className="micro">verified buyer &nbsp;&middot;&nbsp; Jul 2025</span></div>
              </div>
              <div className="card card-soft">
                <p className="body" style={{ color: "var(--ink)" }}>&ldquo;By Day 6 or 7, my hot flashes and night sweats were gone! And bye bye bloated stomach! This is the only thing that has worked for me.&rdquo;</p>
                <div className="rev-by"><img className="rev-av" src={imgSelfie3} alt="" loading="lazy" width="300" height="468" /><span className="micro">verified buyer &nbsp;&middot;&nbsp; Apr 2024</span></div>
              </div>
              <div className="card card-soft">
                <p className="body" style={{ color: "var(--ink)" }}>&ldquo;I&rsquo;m in my mid-40s and these peri-menopausal symptoms are just about gone! Sleep is better, moods better; the scale is moving again, and that makes me so happy!&rdquo;</p>
                <div className="rev-by"><img className="rev-av" src={imgSelfie4} alt="" loading="lazy" width="300" height="468" /><span className="micro">verified buyer &nbsp;&middot;&nbsp; Apr 2024</span></div>
              </div>
            </div>
            <figure className="fb-shot fb-desk">
              <img src={imgFbReview} width="900" height="649" loading="lazy" alt="Facebook comment from Martinez Sullivan: this is a game changer, I have literally shed some inches and lbs, not to mention the hot flashes are gone when I take it" />
            </figure>
          </div>

          {/* What people are saying, straight from JJ's product page */}
          <div className="vids">
            <button className="vids-nav vids-prev" type="button" aria-label="Previous videos"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button>
            <div className="vids-track">
              <div className="vid" data-vimeo="948965910" data-h="92f77779fc">
                <img src={imgVideoV1} alt="" loading="lazy" />
                <button className="vid-play" type="button" aria-label="Play video testimonial 1"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.53.85l10.6-6.8a1 1 0 0 0 0-1.7L9.53 4.35A1 1 0 0 0 8 5.2z" /></svg></button>
              </div>
              <div className="vid" data-vimeo="948966113" data-h="f3208c6af4">
                <img src={imgVideoV2} alt="" loading="lazy" />
                <button className="vid-play" type="button" aria-label="Play video testimonial 2"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.53.85l10.6-6.8a1 1 0 0 0 0-1.7L9.53 4.35A1 1 0 0 0 8 5.2z" /></svg></button>
              </div>
              <div className="vid" data-vimeo="948966175" data-h="1b5b185021">
                <img src={imgVideoV3} alt="" loading="lazy" />
                <button className="vid-play" type="button" aria-label="Play video testimonial 3"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.53.85l10.6-6.8a1 1 0 0 0 0-1.7L9.53 4.35A1 1 0 0 0 8 5.2z" /></svg></button>
              </div>
              <div className="vid" data-vimeo="948966221" data-h="e9d03a3138">
                <img src={imgVideoV4} alt="" loading="lazy" />
                <button className="vid-play" type="button" aria-label="Play video testimonial 4"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.53.85l10.6-6.8a1 1 0 0 0 0-1.7L9.53 4.35A1 1 0 0 0 8 5.2z" /></svg></button>
              </div>
              <div className="vid" data-vimeo="948966260" data-h="24b0393551">
                <img src={imgVideoV5} alt="" loading="lazy" />
                <button className="vid-play" type="button" aria-label="Play video testimonial 5"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.53.85l10.6-6.8a1 1 0 0 0 0-1.7L9.53 4.35A1 1 0 0 0 8 5.2z" /></svg></button>
              </div>
              <div className="vid" data-vimeo="948966331" data-h="f36ce92619">
                <img src={imgVideoV6} alt="" loading="lazy" />
                <button className="vid-play" type="button" aria-label="Play video testimonial 6"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.53.85l10.6-6.8a1 1 0 0 0 0-1.7L9.53 4.35A1 1 0 0 0 8 5.2z" /></svg></button>
              </div>
              <div className="vid" data-vimeo="948966385" data-h="62d3de5dd3">
                <img src={imgVideoV7} alt="" loading="lazy" />
                <button className="vid-play" type="button" aria-label="Play video testimonial 7"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.53.85l10.6-6.8a1 1 0 0 0 0-1.7L9.53 4.35A1 1 0 0 0 8 5.2z" /></svg></button>
              </div>
              <div className="vid" data-vimeo="948966430" data-h="c476465217">
                <img src={imgVideoV8} alt="" loading="lazy" />
                <button className="vid-play" type="button" aria-label="Play video testimonial 8"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.53.85l10.6-6.8a1 1 0 0 0 0-1.7L9.53 4.35A1 1 0 0 0 8 5.2z" /></svg></button>
              </div>
              <div className="vid" data-vimeo="948966468" data-h="7bcd8e816d">
                <img src={imgVideoV9} alt="" loading="lazy" />
                <button className="vid-play" type="button" aria-label="Play video testimonial 9"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.53.85l10.6-6.8a1 1 0 0 0 0-1.7L9.53 4.35A1 1 0 0 0 8 5.2z" /></svg></button>
              </div>
            </div>
            <button className="vids-nav vids-next" type="button" aria-label="More videos"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
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
              <img className="ing-bottle" src={imgIngredientsBottle} width="480" height="786" alt="Hormone Focus" />
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
            <div className="rating" style={{ justifyContent: "center" }}>
              <span className="stars">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="#F3CE73"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="#F3CE73"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="#F3CE73"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="#F3CE73"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="#F3CE73"><path d="M12 2l3 6.6 7 .8-5.2 4.9 1.4 7L12 17.8 5.8 21.3l1.4-7L2 9.4l7-.8z" /></svg>
              </span>
              <b style={{ color: "#FFFFFF" }}>4.9</b>
              <span className="micro">from 172 verified reviews</span>
            </div>
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
            <h2 className="h2" style={{ color: "var(--ink)" }}>Feel like yourself again for just <span style={{ color: "var(--purple)" }}>$1.25 a day</span>.</h2>
            <p className="body" style={{ maxWidth: "42ch" }}>Less than a coffee. Two capsules a day.</p>
          </div>

          <div className="offers offers-pair">

            {/* CARD 1 - THE PROTOCOL. First in the DOM so it leads on a phone;
                CSS order puts it on the right on desktop. */}
            <div className="offer-col col-protocol">
              <div className="offer offer-best offer-lead">
                <div className="offer-badge">BESTSELLER</div>
                <div className="offer-head">
                  <div className="offer-shots">
                    <img src={imgOffer2Bottles} alt="Hormone Focus, two bottles" />
                    <img className="shot-guide" src={imgOfferStarterGuide} alt="Hormone Focus starter guide" />
                  </div>
                  <div className="offer-main">
                    {/* PLACEHOLDER NAME - JJ is still finalising this. Swap the
                        string below once the real protocol name is signed off. */}
                    <div className="offer-name">60-Day Protocol</div>
                    <div className="offer-supply">2 bottles</div>
                    <div className="offer-price">
                      <span className="strike offer-was">$99.98</span>
                      <span className="offer-now">$74.99</span>
                    </div>
                    <div className="offer-day">$1.25 a day</div>
                    <div className="ship"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: "0" }}><rect x="2" y="7" width="14" height="10" rx="2" /><path d="M16 10h3l3 3v4h-6z" /><circle cx="6.5" cy="19" r="1.8" /><circle cx="18" cy="19" r="1.8" /></svg> FREE SHIPPING</div>
                  </div>
                </div>

                <div className="offer-fill"></div>

                <div className="offer-bonus">
                  <img src={imgOfferStarterGuide} alt="" />
                  <span><b>Bonus:</b> Hormone Focus starter guide</span>
                </div>

                {/* Desktop only (display:none on a phone). The one-bottle card
                    is the taller of the two now, and all of the protocol card's
                    slack was piling up in one gap above the bonus box. A second
                    spacer below it splits that in two, and the head stays at the
                    top so both cards' titles still land on the same line. */}
                <div className="offer-fill offer-fill-bottom"></div>

                {/* data-offer makes this a store link like the other CTAs, so
                    tracking.ts decorates it with the visitor's campaign and
                    fires BridgeCTAClick on it. See the PRICE MISMATCH note in
                    lib/offer-urls.ts: the store is still $79.99 pending a
                    reprice to $74.99. */}
                <a className="btn btn-primary btn-full" data-offer="bundle" href={PROTOCOL_CHECKOUT_HREF}>
                  Start the 60-day protocol
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
                  <div className="offer-shots"><img src={imgOffer1Bottle} alt="Hormone Focus, one bottle" /></div>
                  <div className="offer-main">
                    <div className="offer-name">30-Day Supply</div>
                    <div className="offer-supply">1 bottle</div>
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
            <p className="body">We encourage everyone to try our products for 2 months and we have a 60-day happiness guarantee (refund policy).</p>
            <p className="body" style={{ fontWeight: "600", color: "#FFFFFF" }}>If you are not satisfied with our products, we offer a money-back guarantee for up to two bottles within 60 days of your purchase for those in the US. At this time, all international orders are final.</p>
            <hr className="rule" />
            <p className="micro">To initiate a return, you must contact support@jjsmithonline.com within 60 days to notify them of your refund request. Once the product is received, the refund will be issued for the amount you paid for the product to the form of payment used for the purchase. Note that shipping is non-refundable and refunds do not include the cost of shipping. Refunds will be issued by us in our sole discretion.</p>
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

      {/* ===== FOOTNOTES ===== */}
      <footer className="footnotes" style={{ background: "#E7DCF3", paddingTop: "clamp(26px, 3.4vw, 40px)" }}>
        <div className="wrap stack-s" style={{ gap: "10px" }}>
          <p className="micro" style={{ maxWidth: "92ch" }}>General education about a life stage, not medical advice. See your doctor if symptoms are new, severe or worrying.</p>
          <p className="micro" style={{ maxWidth: "92ch" }}>These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure or prevent any disease. Ingredient descriptions as published at JJSmithOnline.com.</p>
          <p className="micro" style={{ maxWidth: "92ch" }}>Reviews, photos and videos from verified buyers on JJSmithOnline.com, and a comment from Facebook. Individual results vary and are not guaranteed.</p>
          <p className="micro">Copyright &copy;2026 By JJ Smith. All Rights Reserved &nbsp;&middot;&nbsp; www.JJSmithOnline.com &nbsp;&middot;&nbsp; @JJSmithOnline.com</p>
        </div>
      </footer>

      <div className="stickybar" id="hf-sticky" aria-hidden="true">
        <div className="wrap">
          <p className="sb-copy">From <b>$1.33 a day</b><span className="sb-more"><br />60-day money-back guarantee</span></p>
          <a className="btn btn-primary" href="#offer">Get Hormone Focus <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13" /><path d="M12 5l7 7-7 7" /></svg></a>
        </div>
      </div>
    </>
  );
}

const CSS = `
/* ===========================================================================
   Hormone Focus - bridge landing page

   One responsive layout. It used to be two fixed-width artboards, mobile and
   desktop, carrying the same copy twice; headlines built out of flex rows
   broke as soon as they wrapped. Everything below is one document with a
   fluid type scale, so a headline is a headline at every width.
   =========================================================================== */

:root {
  color-scheme: light;

  --ink:        #241F2E;
  --ink-soft:   #4C4658;
  --muted:      #6E687C;

  --teal:       #276F6C;
  --teal-ink:   #DCEDEC;
  --teal-line:  #4A8B88;
  --teal-soft:  #E6F2F1;
  --teal-edge:  #BFDEDC;

  --purple:     #6B3FA0;
  --purple-mid: #8A66C4;
  --lilac:      #A386D2;

  --hair:       #E3D6F3;
  --lav:        #F1E9FA;
  --lav-2:      #EFE6F8;
  --lav-3:      #EDE3F7;
  --page:       #F6F1FB;
  --white:      #FFFFFF;
  --gold:       #E8B84B;

  --grad:       linear-gradient(90deg, #6B3FA0 0%, #8A66C4 100%);
  --shadow:     0 26px 60px -38px rgba(36, 31, 46, .55);
  --shadow-sm:  0 12px 30px -20px rgba(36, 31, 46, .45);

  /* fluid type scale - one size definition, every viewport */
  --h1:     clamp(38px, 7.6vw, 70px);
  --h2:     clamp(28px, 4.6vw, 44px);
  --h3:     clamp(19px, 1.9vw, 22px);
  --lead:   clamp(18px, 2.2vw, 24px);
  --body:   clamp(16px, 1.7vw, 18.5px);
  --small:  clamp(14px, 1.4vw, 15px);
  --micro:  clamp(12.5px, 1.2vw, 13.5px);
  --eyebrow: clamp(11.5px, 1.1vw, 12.5px);
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }

body {
  margin: 0;
  background: var(--page);
  color: var(--ink);
  font-family: Poppins, "Segoe UI", system-ui, sans-serif;
  font-size: var(--body);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a { color: var(--teal); text-decoration: none; }
p { margin: 0; }
/* height:auto is what makes the width/height attributes a hint rather than a
   command - without it any image whose CSS leaves height unset renders at the
   attribute's pixel height and stretches. Every rule below that sets a real
   height is more specific and still wins. */
img { max-width: 100%; height: auto; display: block; }

/* ---- layout ------------------------------------------------------------ */

.wrap { width: min(1160px, 100% - clamp(32px, 6vw, 112px)); margin-inline: auto; }

.band { padding: clamp(54px, 7.4vw, 96px) 0; }
.band-white { background: var(--white); }
.band-lav   { background: var(--page); }
.band-lav2  { background: var(--lav-2); }
.band-teal  { background: var(--teal); color: var(--white); }

.stack   { display: flex; flex-direction: column; gap: clamp(22px, 3vw, 34px); }
.stack-s { display: flex; flex-direction: column; gap: clamp(14px, 1.8vw, 20px); }

/* ---- type -------------------------------------------------------------- */

.eyebrow {
  font-size: var(--eyebrow); font-weight: 700; letter-spacing: .2em;
  text-transform: uppercase; color: var(--purple-mid); margin: 0;
}
.band-teal .eyebrow { color: #C9AEEA; }

.h1, .h2 { margin: 0; font-weight: 800; letter-spacing: -.02em; text-wrap: balance; }
.h1 { font-size: var(--h1); line-height: 1.06; color: var(--ink); }
.h2 { font-size: var(--h2); line-height: 1.16; color: var(--teal); }
.band-teal .h2 { color: var(--white); }

/* The script accent is an inline run, not a flex sibling. It keeps its
   baseline, it never splits mid-phrase, and the line wraps like text. */
.h1 em, .h2 em {
  font-family: 'Kaushan Script', 'Brush Script MT', cursive;
  font-style: normal; font-weight: 400;
  font-size: 1.22em; line-height: 1;
  color: var(--lilac); white-space: nowrap;
  letter-spacing: 0;
  /* Kaushan overhangs to the right; without this the next word touches it */
  margin-right: .12em;
}
.band-teal .h2 em { color: #C9AEEA; }
/* a long headline would leave one word stranded ahead of the script run */
@media (max-width: 760px) { .h2-split em { display: block; margin-top: 2px; } }

.lead { font-size: var(--lead); line-height: 1.45; font-weight: 700; color: var(--purple-mid); margin: 0; }
.body { font-size: var(--body); line-height: 1.65; color: var(--ink-soft); margin: 0; }
.small { font-size: var(--small); line-height: 1.6; color: var(--muted); margin: 0; }
.micro { font-size: var(--micro); line-height: 1.55; color: var(--muted); margin: 0; }
.band-teal .body { color: var(--teal-ink); }
.band-teal .micro { color: #B7DAD8; }

.script { font-family: 'Kaushan Script', 'Brush Script MT', cursive; color: var(--lilac); }

/* ---- cards ------------------------------------------------------------- */

.card {
  background: var(--white); border: 1px solid var(--hair);
  border-radius: clamp(18px, 2vw, 24px); padding: clamp(20px, 2.4vw, 28px);
}
.card-title { font-size: var(--h3); line-height: 1.3; font-weight: 700; color: var(--teal); margin: 0; }

.grid { display: grid; gap: clamp(14px, 1.7vw, 20px); }
.grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
@media (max-width: 860px) { .grid-3 { grid-template-columns: 1fr; } }
@media (max-width: 720px) { .grid-2 { grid-template-columns: 1fr; } }
.with-photo .grid-2 { grid-template-columns: 1fr; }
@media (min-width: 1100px) { .with-photo .grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 560px) { .grid-6 { grid-template-columns: repeat(3, minmax(0, 1fr)); } }

/* ---- buttons ----------------------------------------------------------- */

.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  font-family: inherit; font-weight: 800; font-size: clamp(16.5px, 1.8vw, 19px);
  line-height: 1.15; border: 0; border-radius: 16px; text-align: center;
  padding: 19px clamp(32px, 4.2vw, 54px); min-height: 64px; cursor: pointer;
  transition: transform .16s ease, box-shadow .16s ease, filter .16s ease;
}
.btn:hover { transform: translateY(-2px); filter: brightness(1.05); }
.btn-primary { background: var(--grad); color: var(--white); box-shadow: 0 20px 40px -18px rgba(107, 63, 160, .65); }
.btn-light   { background: var(--white); color: var(--teal); box-shadow: 0 18px 36px -20px rgba(0, 0, 0, .45); }
.btn-ghost   {
  /* Flanked by two filled buttons, anything hollow reads as disabled - so this
     one is filled too, just a flatter purple. The bestseller keeps its lead
     through the badge, the border and the gradient, not through being the
     only solid button. */
  background: var(--purple-mid); color: var(--white);
  box-shadow: 0 14px 30px -16px rgba(138, 102, 196, .75);
}
.btn-ghost:hover { background: var(--purple); }
.btn-teal    { background: var(--teal); color: var(--white); box-shadow: 0 18px 36px -20px rgba(39, 111, 108, .7); }
.btn-full    { width: 100%; padding-inline: 18px; }
/* on a narrow column a short button reads as an afterthought - fill it */
@media (max-width: 700px) { .band .btn { width: 100%; padding-inline: 18px; } }

/* ---- small parts ------------------------------------------------------- */

.stars { display: inline-flex; gap: 2px; }
.rating { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.rating b { font-size: clamp(16px, 1.7vw, 18px); font-weight: 800; }

.avatars { display: inline-flex; }
.avatars img {
  width: clamp(36px, 4vw, 42px); height: clamp(36px, 4vw, 42px);
  border-radius: 999px; object-fit: cover; border: 2px solid var(--white);
  margin-left: -11px; box-shadow: var(--shadow-sm);
}
.avatars img:first-child { margin-left: 0; }

.pill {
  display: inline-block; background: var(--lav); color: var(--purple-mid);
  font-size: var(--micro); font-weight: 700; border-radius: 999px; padding: 4px 11px;
}
.tick { flex: 0 0 auto; }

.rule { height: 1px; background: var(--hair); border: 0; margin: 0; }
.band-teal .rule { background: var(--teal-line); }

/* ---- header ------------------------------------------------------------ */

/* announcement bar + header, matching the coaching landing page */
.announce { background: linear-gradient(90deg, #5B2A80 0%, #7E36A6 48%, #C0468C 100%); color: #FFFFFF; }
.announce-in {
  display: flex; align-items: center; justify-content: center; gap: 9px; flex-wrap: wrap;
  padding: 7px 18px; font-size: 11.5px; font-weight: 800; letter-spacing: .06em;
  text-transform: uppercase; text-align: center;
}
.announce-star { color: #F6C9E4; }

.masthead { background: var(--white); border-bottom: 1px solid var(--hair); }
.masthead-in { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 0; }
.logo { height: 26px; width: auto; }
.masthead-cta {
  display: inline-flex; align-items: center; background: var(--grad); color: #FFFFFF;
  font-family: inherit; font-weight: 800; font-size: 14px; border: 0; border-radius: 12px;
  padding: 11px 20px; box-shadow: 0 10px 22px -10px rgba(91, 42, 128, .5);
  transition: transform .15s ease, filter .15s ease;
}
.masthead-cta:hover { transform: translateY(-1px); filter: brightness(1.05); }
/* below this the sticky bar carries the CTA, so the header just holds the logo */
@media (max-width: 560px) { .masthead-cta { display: none; } .masthead-in { justify-content: center; } }

/* ---- hero -------------------------------------------------------------- */

/* Plain greedy wrapping. balance evened every line out and pretty stranded
   "again," on a line of its own; normal lets line one fill with
   "Finally feel like yourself" and the rest follow. */
/* Plain greedy wrapping - balance evened the lines out and pretty stranded a
   word on its own. The groups keep each sentence together so the breaks land
   where the copy reads, and they release below 560px so nothing can overflow. */
.hero .h1 { font-size: clamp(28px, 3.5vw, 42px); line-height: 1.2; letter-spacing: -.015em; text-wrap: wrap; }
.hero .h1 .grp { white-space: nowrap; }
/* the opening line carries the purple; the symptom lines stay ink. The script
   word keeps the lighter lilac so it still lifts off the line. */
.hl { color: var(--purple); }
@media (max-width: 560px) { .hero .h1 .grp { white-space: normal; } }
/* a marker sweep under the promise, as on the coaching page's sub-headline */
.mk {
  background: linear-gradient(180deg, transparent 58%, #DCC8F4 58%);
  color: var(--purple); padding: 0 .06em; border-radius: 2px;
  font-weight: 700;
  /* a marked phrase is one idea - never split it across a line break, which
     was leaving "better" stranded at the end of line one */
  white-space: nowrap;
}
.hero-sub { font-size: clamp(16.5px, 1.75vw, 19.5px); font-weight: 500; color: var(--ink-soft);
            line-height: 1.55; max-width: 690px; }
/* the review count is the one thing the badge can afford to drop on a phone */
@media (max-width: 720px) { .badge .badge-t { display: none; } }

.hero { background: linear-gradient(180deg, var(--page) 0%, var(--lav-2) 100%);
         padding-top: clamp(26px, 3.6vw, 84px); padding-bottom: 0; }
.hero .stack { gap: clamp(16px, 2.2vw, 32px); }
.hero .lead { line-height: 1.32; }
.hero-grid {
  display: grid; grid-template-columns: minmax(0, 1fr) clamp(240px, 24vw, 340px);
  gap: clamp(28px, 4vw, 56px); align-items: start;
}
@media (max-width: 940px) { .hero-grid { grid-template-columns: 1fr; } }

.why-grid {
  display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 460px);
  gap: clamp(28px, 4vw, 56px); align-items: center;
}
@media (max-width: 940px) { .why-grid { grid-template-columns: 1fr; } }

/* The shot is a cut-out whose arm runs off the bottom-right of its own frame,
   so it has to sit flush with both edges or the arm reads as severed. It is
   taken out of the grid and pinned to the bottom-right of .hero-top, which
   spans the full viewport width - the grid's wrap could never reach the edge.
   The hero's bottom padding moves onto .hero-top so bottom:0 lands exactly on
   the photo strip. */
.hero-top {
  position: relative;
  padding-bottom: clamp(28px, 3.6vw, 78px);
}
.hero-shot {
  position: absolute; bottom: 0; pointer-events: none;
  /* This shot has clear space on its right, so it no longer needs to bleed off
     the screen - only its bottom edge is a cut. Aligning it to the content's
     right edge instead brings it in beside the headline where it belongs. */
  --gutter: max(calc(clamp(32px, 6vw, 112px) / 2), calc((100% - 1160px) / 2));
  right: max(0px, calc(var(--gutter) - 120px));
  height: min(100%, 34vw);
  width: auto;
}

.hero-quote { border-width: 1.5px; box-shadow: var(--shadow-sm); }
.hero-quote p { font-size: clamp(15.5px, 1.7vw, 17px); line-height: 1.5; font-weight: 500; color: var(--ink); }

/* On a phone the product render gives way to the customer photos, which do
   the hero image's job. One flex column reorders the pieces around it - the
   grid becomes display:contents so its two columns join that same flow. */
@media (max-width: 940px) {
  .hero { display: flex; flex-direction: column; padding-bottom: 0; }
  .hero-top, .hero-grid { display: contents; }
  .hero-copy  { order: 1; }
  .photos     { order: 2; }
  .hero-aside { order: 3; }
  .press      { order: 4; }

  .hero-copy, .hero-aside { width: min(1160px, 100% - clamp(32px, 6vw, 112px)); margin-inline: auto; }
  .hero-shot { display: none; }

  .hero-aside { margin-top: clamp(16px, 2.6vw, 24px); }
  .press { margin-top: clamp(22px, 3.4vw, 32px); padding-top: clamp(28px, 6vw, 40px); border-top: 1px solid var(--hair); }
}

/* ---- hero call to action ------------------------------------------------
   The guarantee line sat 20px under the button and flush against the photo
   strip's white edge. Pull it up to the button, and push the strip away. */
/* On a phone the two sweeps crowd each other, so the capsule line drops its
   highlight and the promise takes the whole sentence instead. Nesting the
   existing mark inside keeps the sweep unbroken across the space. */
@media (max-width: 720px) {
  .mk-caps { background: none; color: inherit; font-weight: inherit; padding: 0; white-space: normal; }
  .mk-b {
    background: linear-gradient(180deg, transparent 58%, #DCC8F4 58%);
    color: var(--purple); padding: 0 .06em; border-radius: 2px; font-weight: 700;
  }
  .mk-b .mk { background: none; padding: 0; }
}

.hero-cta {
  display: flex; flex-direction: column; gap: 10px;
  /* fit-content makes the column exactly as wide as the button, so stretching
     the guarantee line centres it under the button rather than in the grid */
  width: fit-content; align-items: stretch;
}
.hero-cta .micro { text-align: center; }
.hero-cta .btn { padding-inline: clamp(38px, 5.4vw, 78px); }
.hero-cta .micro { font-weight: 600; }

@media (max-width: 940px) {
  /* stacked, the button fills the column - so centre the line under it, and
     cap the width so it does not become a banner on a tablet */
  .hero-cta { align-items: center; width: auto; }
  .hero-cta .btn { width: 100%; max-width: 560px; }
  .hero-cta .micro { text-align: center; }
  .hero-grid { margin-bottom: 0; }
}

/* ---- symptom / step / faq lists ---------------------------------------- */

.ticklist { display: flex; flex-direction: column; gap: clamp(10px, 1.3vw, 14px); }
.ticklist > div { display: flex; gap: 13px; align-items: center; }
.ticklist span { font-size: var(--body); line-height: 1.45; color: var(--ink-soft); }
.sym {
  flex: 0 0 auto; width: 40px; height: 40px; border-radius: 13px;
  background: var(--white); border: 1px solid var(--hair); color: var(--purple);
  display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm);
}

.step { display: flex; gap: 16px; align-items: flex-start; }
.step-n {
  flex: 0 0 auto; width: 42px; height: 42px; border-radius: 999px; background: var(--lav-2);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 800; color: var(--purple-mid);
}

.trustrow { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(10px, 1.4vw, 16px); }
.trustrow > div {
  background: var(--white); border: 1px solid var(--hair); border-radius: 16px;
  padding: clamp(14px, 1.8vw, 20px) 10px; display: flex; flex-direction: column;
  gap: 9px; align-items: center; text-align: center;
  font-size: var(--micro); font-weight: 600; color: var(--ink-soft);
}

/* ---- ingredients ------------------------------------------------------- */

.ing { display: flex; flex-direction: column; gap: 4px; padding: clamp(14px, 1.7vw, 18px) 0; border-top: 1px solid var(--lav-2); }
.ing-h { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.ing-h b { font-size: var(--h3); font-weight: 700; color: var(--teal); }

/* no white card here - the bottle is white and was sitting on white. The panel
   reads straight off the band, and each ingredient gets a tile showing where
   it actually comes from: cruciferous veg, citrus, black pepper. */
.ing-ico {
  display: inline-flex; align-items: center; justify-content: center;
  width: clamp(44px, 3.8vw, 54px); height: clamp(44px, 3.8vw, 54px);
  border-radius: 14px; background: var(--white); border: 1px solid var(--hair);
  color: var(--teal); box-shadow: var(--shadow-sm); margin-bottom: 10px;
}
.ing-ico svg { width: 66%; height: 66%; }
.ing-panel .eyebrow { display: block; }

/* ---- the three ingredients, mapped around the bottle -------------------- */
.ing-panel { overflow: hidden; }
.ing-map {
  display: grid; align-items: center;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  grid-template-areas: "a bottle b" ". c .";
  column-gap: clamp(8px, 1.8vw, 30px);
  row-gap: clamp(6px, 1vw, 14px);
  margin: clamp(16px, 2.2vw, 28px) 0 clamp(18px, 2.4vw, 30px);
}
.ing-a { grid-area: a; }
.ing-b { grid-area: b; }
.ing-c { grid-area: c; }
/* sized by height, not column width - the shot is tall, and letting the
   column drive it made it tower over the labels */
.ing-bottle { grid-area: bottle; height: clamp(230px, 27vw, 340px); width: auto; justify-self: center; }

.ing-node { display: flex; align-items: center; gap: clamp(4px, .8vw, 14px); color: var(--teal); }
.ing-a { flex-direction: row; }
.ing-b { flex-direction: row-reverse; }
.ing-c { flex-direction: column-reverse; }

.ing-card { min-width: 0; }
.ing-a .ing-card { text-align: right; }
.ing-b .ing-card { text-align: left; }
.ing-c .ing-card { text-align: center; max-width: 42ch; }
.ing-h { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
.ing-a .ing-h { justify-content: flex-end; }
.ing-c .ing-h { justify-content: center; }
.ing-card .small { margin-top: 3px; }

.ing-arrow { flex: 0 0 auto; width: clamp(48px, 5.6vw, 76px); height: auto; }
.ing-b .ing-arrow { transform: scaleX(-1); }
.ing-arrow-up { width: clamp(30px, 3vw, 42px); }

.ing-foot { border-top: 1px solid var(--lav-2); padding-top: 16px; }

/* Stacked, the radial cannot hold - the bottle goes on top and the three read
   as a column beneath it, each still pointing back up at the product. */
@media (max-width: 820px) {
  .ing-map {
    grid-template-columns: 1fr;
    grid-template-areas: "bottle" "a" "b" "c";
    justify-items: center;
    row-gap: clamp(10px, 2.4vw, 18px);
  }
  /* height:auto or the desktop height rule still applies and squashes it */
  .ing-bottle { width: clamp(150px, 42vw, 215px); height: auto; }
  .ing-node {
    flex-direction: row-reverse; width: 100%; gap: 12px; align-items: flex-start;
    background: var(--lav); border-radius: 15px; padding: 14px 16px;
  }
  .ing-a .ing-card, .ing-b .ing-card, .ing-c .ing-card { text-align: left; max-width: none; flex: 1; }
  .ing-a .ing-h, .ing-c .ing-h { justify-content: flex-start; }
  /* all three point the same way - up and back toward the bottle above */
  .ing-arrow { width: 38px; height: 38px; margin-top: 2px; transform: rotate(-52deg); }
  /* the card is the same lavender as the pill, so the pill needs to lift off it */
  .ing-node .pill { background: var(--white); }
  .ing-b .ing-arrow { transform: rotate(-52deg); }
  .ing-arrow-up { transform: scaleX(-1); }
}

/* ---- sign-off ---------------------------------------------------------- */

.signoff {
  background: var(--lav-3); border-radius: clamp(22px, 2.6vw, 30px); overflow: hidden;
  display: grid; grid-template-columns: clamp(260px, 32vw, 380px) minmax(0, 1fr); align-items: center;
}
.signoff img { width: 100%; height: 100%; object-fit: cover; }
@media (max-width: 800px) { .signoff { grid-template-columns: 1fr; } .signoff img { height: auto; } }

/* ---- offer section ----------------------------------------------------- */

.offers { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(16px, 1.8vw, 22px); align-items: stretch; }
@media (max-width: 900px) { .offers { grid-template-columns: 1fr; max-width: 460px; margin-inline: auto; } }

.offer-col { display: flex; flex-direction: column; }
.offer {
  flex: 1; position: relative; background: var(--white); border: 1.5px solid var(--hair);
  border-radius: 22px; padding: clamp(24px, 2.6vw, 30px) clamp(20px, 2.2vw, 24px);
  display: flex; flex-direction: column; align-items: center; text-align: center;
  transition: box-shadow .18s ease;
}
.offer:hover { box-shadow: var(--shadow); }
.offer-best { background: linear-gradient(165deg, #FFFFFF 0%, #F7ECFB 100%); border: 2px solid var(--purple); padding-top: clamp(30px, 3vw, 36px); }
.offer-sub  { border-color: var(--teal-edge); }

.offer-badge {
  position: absolute; top: -15px; left: 50%; transform: translateX(-50%);
  background: var(--grad); color: var(--white); font-size: clamp(11px, 1.1vw, 12px);
  font-weight: 800; letter-spacing: .1em; padding: 9px 20px; border-radius: 999px;
  white-space: nowrap; box-shadow: 0 10px 22px -10px rgba(107, 63, 160, .6);
}

.offer-head { display: flex; flex-direction: column; align-items: center; width: 100%; }
.offer-main { display: flex; flex-direction: column; align-items: center; width: 100%; }
.offer-shots { display: flex; align-items: flex-end; justify-content: center; gap: 10px; height: clamp(132px, 13vw, 156px); margin-bottom: 16px; }
.offer-shots img { height: 100%; width: auto; filter: drop-shadow(0 14px 16px rgba(36, 31, 46, .2)); }
.offer-shots .shot-guide { height: 72%; }

.offer-kicker { font-size: clamp(11px, 1.1vw, 12px); font-weight: 800; letter-spacing: .16em; color: var(--purple-mid); }
.offer-sub .offer-kicker { color: var(--teal); }
.offer-supply { font-size: clamp(15.5px, 1.6vw, 17px); font-weight: 600; color: var(--muted); margin-top: 6px; }
.offer-price { display: flex; align-items: baseline; justify-content: center; gap: 12px; flex-wrap: wrap; margin-top: 14px; }
.offer-now { font-size: clamp(42px, 4.6vw, 54px); line-height: 1; font-weight: 800; letter-spacing: -.03em; color: var(--purple); }
.offer-sub .offer-now { color: var(--teal); }
.offer-was { font-size: clamp(21px, 2.2vw, 24px); font-weight: 700; color: var(--muted); }
.offer-day { font-size: clamp(14px, 1.5vw, 15.5px); font-weight: 800; color: var(--purple); margin-top: 9px; }
.offer-sub .offer-day { color: var(--teal); }
.offer-terms { font-size: var(--micro); font-weight: 600; color: var(--muted); margin-top: 5px; }
.offer-fill { flex: 1; min-height: 18px; }

.offer-bonus {
  width: 100%; display: flex; align-items: center; justify-content: center; gap: 9px;
  padding: 8px 12px; border: 1.5px dashed var(--lilac); background: #F7F1FD;
  border-radius: 13px; margin-bottom: 14px;
}
.offer-bonus img { height: 34px; width: auto; filter: drop-shadow(0 4px 6px rgba(36, 31, 46, .22)); }
.offer-bonus span { font-size: clamp(12px, 1.2vw, 13px); font-weight: 700; color: var(--ink); line-height: 1.3; text-align: left; }
.offer-bonus b { color: var(--purple); font-weight: 800; }

.offer-guarantee { display: flex; align-items: center; justify-content: center; gap: 7px; margin-top: 13px; }
.offer-guarantee span { font-size: var(--micro); font-weight: 700; color: var(--teal); white-space: nowrap; }

.or { display: flex; align-items: center; gap: 14px; margin: 4px 2px; }
.or::before, .or::after { content: ""; flex: 1; height: 1px; background: var(--hair); }
.or span { font-size: 11.5px; font-weight: 800; letter-spacing: .18em; color: var(--purple-mid); }
@media (min-width: 901px) { .or { display: none; } }

/* Stacked on a phone, three tall cards meant the second and third fell well
   below the fold - so the shot moves beside the copy and each card halves. */
@media (max-width: 900px) {
  .offers { gap: 12px; }
  .offer { padding: 18px 16px; border-radius: 18px; }
  .offer-best { padding-top: 26px; }
  .offer-head { flex-direction: row; align-items: center; gap: 20px; }
  .offer-main { align-items: flex-start; text-align: left; flex: 1; min-width: 0; width: auto; }
  .offer-shots { height: 104px; margin-bottom: 0; flex: 0 0 auto; gap: 6px; padding-left: 2px; }
  .offer-shots .shot-guide { height: 64%; }
  .offer-supply { margin-top: 2px; font-size: 15px; }
  .offer-price { justify-content: flex-start; margin-top: 6px; gap: 9px; }
  .offer-now { font-size: 38px; }
  .offer-was { font-size: 19px; }
  .offer-day { margin-top: 5px; font-size: 14px; }
  .offer-terms { margin-top: 2px; }
  .ship { margin-top: 8px; padding: 6px 12px; }
  .offer-fill { display: none; }
  .offer > .btn { margin-top: 14px; }
  .offer-bonus { margin-top: 14px; margin-bottom: 0; padding: 7px 10px; }
  .offer-bonus img { height: 30px; }
  /* the desktop spacer sits between them in the markup, so match both */
  .offer-bonus + .btn,
  .offer-bonus + .offer-fill + .btn { margin-top: 10px; }
  .offer-guarantee { margin-top: 9px; }
  .or { margin: 2px; }
}

/* the diagonal "was" strike, as on JJ's coaching page */
.strike { position: relative; display: inline-block; }
.strike::after {
  content: ""; position: absolute; left: -6%; right: -6%; top: 50%; height: 2px;
  background: #E23B3B; border-radius: 3px; transform: translateY(-50%) rotate(-11deg);
}

/* ---- tinted card, for cards that sit on a white band ------------------- */
.card-soft { background: var(--lav); border-color: transparent; }

/* ---- hero trust badge -------------------------------------------------- */
.badge {
  display: inline-flex; align-items: center; gap: 10px; flex-wrap: wrap;
  background: var(--white); border: 1px solid var(--hair); border-radius: 999px;
  padding: 7px 16px 7px 8px; box-shadow: var(--shadow-sm); align-self: flex-start;
}
.badge .avatars img { width: 30px; height: 30px; }
.badge b { font-size: clamp(14px, 1.5vw, 15.5px); font-weight: 800; }
.badge .badge-t { font-size: var(--micro); font-weight: 600; color: var(--muted); }

/* ---- press logos ------------------------------------------------------- */
.press { padding: 0 0 clamp(18px, 2.2vw, 26px); background: var(--white); border-bottom: 1px solid var(--hair); }
.marquee {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
}
.marquee-track { display: flex; align-items: center; gap: 50px; width: max-content; animation: hf-scroll 40s linear infinite; }
.marquee-track img { height: 64px; width: auto; object-fit: contain; opacity: 1; filter: none; }
@media (max-width: 760px) {
  .marquee-track { gap: 42px; }
  .marquee-track img { height: 66px; }
}
@keyframes hf-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .marquee-track { animation: none; } }

/* ---- customer photo slider, under the logos --------------------------- */
.photos {
  /* padding, not margin - a margin here would show the hero gradient as a
     stripe between the logos and the photos, splitting one white band in two */
  background: var(--white); border-top: 1px solid var(--hair);
  padding: clamp(18px, 2.4vw, 38px) 0 clamp(14px, 1.6vw, 22px);
}
/* the fade masks the strip, not the band - a mask on .photos would eat its
   own background and break the white band it shares with the logos */
.photos-view {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent);
}
.photos-track {
  display: flex; gap: 16px; width: max-content;
  animation: hf-scroll 60s linear infinite; animation-direction: reverse;
}
.photos:hover .photos-track { animation-play-state: paused; }
.photos-track img {
  flex: 0 0 auto; width: 158px; height: 188px; object-fit: cover; object-position: top;
  border-radius: 18px; box-shadow: var(--shadow-sm);
}
/* On a phone this strip stands in for the hero image, so it runs much larger
   and sits on the hero's own background rather than in the white press band. */
@media (max-width: 940px) {
  .photos { background: transparent; border-top: 0; padding: clamp(26px, 4.6vw, 36px) 0 0; }
  .photos-track { gap: 12px; animation-duration: 70s; }
  .photos-track img { width: clamp(200px, 58vw, 280px); height: clamp(260px, 76vw, 360px); border-radius: 20px; }
}

@media (prefers-reduced-motion: reduce) { .photos-track { animation: none; } }

/* ---- a portrait beside a section's content ---------------------------- */
.with-photo { display: grid; grid-template-columns: minmax(0, 1fr) clamp(260px, 30vw, 360px); gap: clamp(26px, 4vw, 56px); align-items: center; }
.with-photo.is-left { grid-template-columns: clamp(260px, 30vw, 360px) minmax(0, 1fr); }
.with-photo img {
  width: 100%; border-radius: clamp(18px, 2vw, 24px);
  /* the cut-outs are flattened onto white, so fade the crop into the band */
  -webkit-mask-image: linear-gradient(180deg, #000 80%, transparent 100%);
          mask-image: linear-gradient(180deg, #000 80%, transparent 100%);
}
.with-photo.is-left img { align-self: center; }
/* a transparent PNG that carries its own disc - no crop to soften, no corners */
.with-photo img.disc { border-radius: 0; -webkit-mask-image: none; mask-image: none; }
@media (max-width: 860px) {
  .with-photo, .with-photo.is-left { grid-template-columns: 1fr; }
  .with-photo img { max-width: 320px; margin-inline: auto; }
}

/* ---- free shipping, called out rather than buried in a terms line ------ */
.ship {
  display: inline-flex; align-items: center; gap: 7px; margin-top: 11px;
  background: var(--teal-soft); color: var(--teal); border-radius: 999px;
  padding: 7px 14px; font-size: clamp(11.5px, 1.15vw, 12.5px);
  font-weight: 800; letter-spacing: .09em; white-space: nowrap;
}

/* the written reviews and the screenshot side by side - the screenshot is the
   one piece of proof nobody can have written for us */
.proof-split { display: grid; grid-template-columns: minmax(0, 1fr) clamp(320px, 33vw, 450px); gap: clamp(14px, 1.8vw, 22px); align-items: start; }
@media (max-width: 940px) {
  .proof-split { grid-template-columns: 1fr; }
  .fb-desk { display: none; }   /* on a phone it lives in the hero instead */
}

/* a real Facebook comment, shown as the screenshot it is */
.fb-shot { margin: 0; background: var(--white); border: 1px solid var(--hair);
           border-radius: 16px; overflow: hidden; box-shadow: var(--shadow-sm); }
.fb-shot img { width: 100%; height: auto; display: block; }


/* ---- review attribution ------------------------------------------------ */
.rev-by { display: flex; align-items: center; gap: 10px; margin-top: 14px; }
.rev-av {
  flex: 0 0 auto; width: 40px; height: 40px; border-radius: 999px;
  object-fit: cover; object-position: 50% 20%; border: 2px solid var(--white);
  box-shadow: var(--shadow-sm);
}

/* ---- mid-page call to action ------------------------------------------- */
.cta-row { display: flex; justify-content: center; }

/* ---- video testimonials -------------------------------------------------
   Nine Vimeo clips. Each starts as a poster and only swaps in the player on
   click, so the page does not pull nine embeds it may never need. */
.vids { position: relative; }
.vids-track {
  display: flex; gap: clamp(10px, 1.3vw, 16px); overflow-x: auto;
  scroll-snap-type: x mandatory; scroll-behavior: smooth;
  scrollbar-width: none; padding: 2px 2px 6px;
}
.vids-track::-webkit-scrollbar { display: none; }
.vid {
  position: relative; flex: 0 0 auto; width: clamp(178px, 21vw, 232px);
  aspect-ratio: 9 / 16; border-radius: 18px; overflow: hidden;
  scroll-snap-align: start; background: var(--ink); cursor: pointer;
  box-shadow: var(--shadow-sm); border: 0; padding: 0;
}
.vid img { width: 100%; height: 100%; object-fit: cover; }
.vid iframe { width: 100%; height: 100%; border: 0; display: block; }
.vid-play {
  position: absolute; inset: 0; margin: auto; width: 56px; height: 56px;
  border: 0; padding: 0; cursor: pointer;
  border-radius: 999px; background: rgba(255, 255, 255, .94); color: var(--purple);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 10px 22px -10px rgba(0, 0, 0, .6); transition: transform .16s ease;
}
.vid:hover .vid-play { transform: scale(1.09); }
.vid-close {
  position: absolute; top: 8px; right: 8px; z-index: 2;
  width: 30px; height: 30px; border: 0; border-radius: 999px; cursor: pointer;
  background: rgba(36, 31, 46, .62); color: #FFFFFF;
  display: flex; align-items: center; justify-content: center;
}
.vid-close:hover { background: rgba(36, 31, 46, .85); }
.vids-nav {
  position: absolute; top: 50%; transform: translateY(-50%); z-index: 3;
  width: 48px; height: 48px; border-radius: 999px; border: 1px solid var(--hair);
  background: rgba(255, 255, 255, .97); color: var(--purple); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 10px 26px -10px rgba(36, 31, 46, .55);
  transition: transform .15s ease, background .15s ease;
}
.vids-nav:hover { background: var(--white); transform: translateY(-50%) scale(1.07); }
.vids-nav:active { transform: translateY(-50%) scale(.96); }
.vids-prev { left: clamp(-22px, -1.5vw, -10px); }
.vids-next { right: clamp(-22px, -1.5vw, -10px); }
@media (max-width: 900px) {
  /* no gutter to sit in on a phone, so they ride the edge of the strip */
  .vids-nav { width: 40px; height: 40px; }
  .vids-prev { left: 2px; }
  .vids-next { right: 2px; }
}

/* ---- guarantee ---------------------------------------------------------- */
.guarantee { display: grid; grid-template-columns: clamp(150px, 17vw, 210px) minmax(0, 1fr); gap: clamp(24px, 3.4vw, 48px); align-items: center; }
.guarantee img { width: 100%; filter: drop-shadow(0 18px 26px rgba(0, 0, 0, .3)); }
@media (max-width: 720px) {
  .guarantee { grid-template-columns: 1fr; justify-items: center; text-align: center; }
  .guarantee img { max-width: 168px; }
}

/* ---- FAQ accordion, after the one on JJ's coaching page ---------------- */
.faqlist { max-width: 760px; margin: clamp(26px, 3vw, 38px) auto 0; text-align: left; }
.faq {
  background: var(--white); border: 1px solid var(--hair); border-radius: 16px;
  box-shadow: var(--shadow-sm); margin-bottom: 13px; overflow: hidden;
}
.faq summary {
  list-style: none; cursor: pointer; display: flex; align-items: center;
  justify-content: space-between; gap: 16px; padding: clamp(17px, 1.9vw, 21px) clamp(18px, 2vw, 24px);
  font-size: clamp(16px, 1.7vw, 18px); font-weight: 700; color: var(--ink); line-height: 1.35;
}
.faq summary:hover { background: var(--lav); }
.faq summary::-webkit-details-marker { display: none; }
.faq-mark { position: relative; width: 18px; height: 18px; flex: 0 0 auto; }
.faq-mark::before, .faq-mark::after { content: ""; position: absolute; background: var(--purple); border-radius: 2px; }
.faq-mark::before { left: 0; top: 8px; width: 18px; height: 2.4px; }
.faq-mark::after { left: 8px; top: 0; width: 2.4px; height: 18px; transition: opacity .18s ease; }
.faq[open] .faq-mark::after { opacity: 0; }
.faq-a { padding: 0 clamp(18px, 2vw, 24px) clamp(18px, 2vw, 22px); display: flex; flex-direction: column; gap: 11px; }
.faq-a .small { font-size: clamp(15px, 1.55vw, 16.5px); line-height: 1.65; color: var(--ink-soft); }
.faq-a b { color: var(--teal); }

/* the hero quote repeats a review shown in full further down - on a wide
   screen the column is busy enough without it */
@media (min-width: 941px) { .hero-quote { display: none; } }

/* ---- sticky buy bar ---------------------------------------------------- */
.stickybar {
  position: fixed; inset-inline: 0; bottom: 0; z-index: 40;
  background: rgba(255, 255, 255, .96); backdrop-filter: blur(10px);
  border-top: 1px solid var(--hair); box-shadow: 0 -10px 30px -14px rgba(36, 31, 46, .3);
  padding: 12px 0 calc(12px + env(safe-area-inset-bottom, 0px));
  transform: translateY(110%); transition: transform .25s ease, opacity .25s ease;
  opacity: 0; pointer-events: none;
}
.stickybar.is-on { transform: translateY(0); opacity: 1; pointer-events: auto; }
.stickybar .wrap { display: flex; align-items: center; justify-content: space-between; gap: 14px; }
.stickybar .sb-copy { font-size: var(--micro); font-weight: 700; color: var(--ink); line-height: 1.35; }
.stickybar .sb-copy b { color: var(--purple); font-weight: 800; }
.stickybar .btn { min-height: 50px; padding: 13px 22px; font-size: clamp(14.5px, 1.5vw, 16px); border-radius: 13px; white-space: nowrap; }
.stickybar .sb-copy { white-space: nowrap; }
@media (max-width: 700px) { .stickybar .sb-more { display: none; } }
@media (prefers-reduced-motion: reduce) { .stickybar { transition: none; } }

/* keep the bar off the last line of the footnotes */
.footnotes { padding-bottom: calc(clamp(26px, 3.4vw, 40px) + 82px); }

/* ---- focus ------------------------------------------------------------- */
a:focus-visible, .btn:focus-visible { outline: 3px solid var(--purple-mid); outline-offset: 3px; border-radius: 14px; }

/* an offer whose destination is not configured yet */
.hf-pending { opacity: .45; pointer-events: none; }

/* ---- offer section, two-card layout ------------------------------------ */
/* Everything above still applies: this only adds the parts the pair needs.
   Base rules first, media queries last, so the phone layout keeps winning. */

.offers-pair {
  /* the protocol takes the wider column - roughly 45/55 */
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.18fr);
  gap: clamp(18px, 2.2vw, 30px);
  /* width:100% matters - the auto inline margins that centre the pair also
     cancel the stretch it would otherwise get from .stack, which left the
     grid shrink-to-fit and the cards narrower than the max-width implies. */
  width: 100%; max-width: 1020px; margin-inline: auto; align-items: stretch;
}

/* the lead card: same bestseller treatment, turned up. Wider column, heavier
   border, bigger price. Same height as its neighbour, so the weight comes from
   the border, the tint and the badge rather than from size. */
.offer-lead { border-width: 2.5px; box-shadow: 0 30px 64px -42px rgba(107, 63, 160, .65); }
.offer-lead .offer-now { font-size: clamp(46px, 5.4vw, 62px); }
/* Same 1px lilac edge at every width: the mobile block used to set this on
   its own, and the two had drifted apart on desktop. */
.offer-quiet { background: var(--white); border-width: 1px; border-color: var(--lilac); box-shadow: none; }

/* Both cards lead with the same pair: one bold title, one muted subtitle.
   The eyebrow kickers are gone, so the title is the first thing under the
   shot and carries no top margin. */
.offer-name {
  font-size: clamp(19px, 2.1vw, 23px); font-weight: 800; color: var(--ink);
  line-height: 1.2; letter-spacing: -.02em; margin-top: 0; text-wrap: balance;
}
.offer-quiet .offer-supply,
.offer-lead .offer-supply { font-size: clamp(14px, 1.45vw, 15.5px); margin-top: 5px; }

/* ---- the one-bottle card's two selectable rows ------------------------- */

.opts { width: 100%; display: grid; gap: 10px; text-align: left; }

.opt {
  position: relative; width: 100%; cursor: pointer;
  background: var(--white); border: 1.5px solid var(--hair); border-radius: 15px;
  padding: 13px 15px; min-height: 44px;
  transition: border-color .16s ease, background .16s ease, box-shadow .16s ease;
}
.opt:hover { border-color: var(--lilac); }
.opt-on {
  border-width: 2px; border-color: var(--purple); background: var(--lav);
  padding: 12.5px 14.5px;   /* hold the box steady as the border thickens */
  box-shadow: var(--shadow-sm);
}
.opt:focus-visible { outline: 3px solid var(--purple-mid); outline-offset: 2px; }

.opt-top { display: flex; align-items: center; gap: 10px; }

.opt-dot {
  flex: 0 0 auto; width: 21px; height: 21px; border-radius: 50%;
  border: 2px solid #C9BBDF; background: var(--white); position: relative;
  transition: border-color .16s ease;
}
.opt-on .opt-dot { border-color: var(--purple); }
.opt-on .opt-dot::after { content: ""; position: absolute; inset: 3.5px; border-radius: 50%; background: var(--purple); }

.opt-name { flex: 1; min-width: 0; }
.opt-title {
  display: flex; align-items: center; flex-wrap: wrap; gap: 7px;
  font-size: clamp(15px, 1.3vw, 17px); font-weight: 800; color: var(--ink);
  line-height: 1.2; letter-spacing: -.015em;
}
.opt-cadence { font-size: clamp(13px, 1.1vw, 14.5px); font-weight: 600; color: var(--muted); margin-top: 3px; }

.opt-pill {
  display: inline-flex; align-items: center; border: 1.5px solid var(--lilac);
  color: var(--purple); border-radius: 999px; padding: 2px 6px;
  font-size: 9.5px; font-weight: 800; letter-spacing: .05em; white-space: nowrap;
}

.opt-cost { flex: 0 0 auto; text-align: right; }
/* Stacked, not side by side. At 28px the live price plus a struck one would
   take the width the 17px label needs to keep "20% OFF" on its line. */
.opt-figures { display: flex; flex-direction: column; align-items: flex-end; gap: 1px; white-space: nowrap; }
.opt-price { font-size: clamp(22px, 2.3vw, 28px); font-weight: 800; letter-spacing: -.025em; color: var(--purple); }
.opt-was { font-size: clamp(13.5px, 1.25vw, 15px); font-weight: 700; color: var(--muted); }
.opt-per { font-size: clamp(13px, 1.1vw, 14.5px); font-weight: 700; color: var(--muted); margin-top: 3px; }

/* Always on, selected or not, so the subscription's terms are readable
   without committing to it first. Teal survives here and only here: the
   shipping pill is the same component the protocol card uses. */
.opt-extra {
  display: flex; align-items: center; flex-wrap: wrap; gap: 7px 10px;
  margin-top: 11px; padding-top: 11px; border-top: 1.5px solid var(--hair);
}
.opt-extra .ship { margin-top: 0; }
.opt-note { font-size: clamp(13px, 1.1vw, 14.5px); font-weight: 600; color: var(--muted); }

/* the button sits under the rows, and carries the selected price */
.offer-quiet .opts + .btn { margin-top: 14px; }

/* One trust row for the pair. Both claims get the same weight, so neither
   reads as a footnote; purple throughout, since teal is now reserved for the
   shipping pills. */
.trust {
  display: flex; flex-wrap: wrap; justify-content: center;
  align-items: center; gap: 12px clamp(28px, 4.5vw, 64px);
  margin-top: clamp(20px, 2.2vw, 28px);
}
.trust-item {
  display: inline-flex; align-items: center; gap: 9px;
  font-size: clamp(15px, 1.55vw, 16.5px); font-weight: 700; color: var(--ink);
  line-height: 1.25;
}
.trust-item svg { flex: 0 0 auto; color: var(--purple); }

@media (min-width: 901px) {
  /* One bottle reads first, the protocol closes. The DOM keeps the protocol
     first so a phone still meets it first; only the desktop row is swapped. */
  .col-bottle   { order: 1; }
  .col-protocol { order: 2; }

  /* Same top padding on both, even though only the lead card needs the room
     for its badge: it lines the two shots up, and with them the two titles. */
  .offer-lead, .offer-quiet { padding-top: clamp(34px, 3.2vw, 40px); }

  /* Equal-height cards. Both heads sit at the top so the two titles land on
     the same line and the cards can be read across; the slack in the shorter
     one falls into .offer-fill below the head, which keeps both buttons on
     the same line too. */
  /* Tightened from ~20px: the larger option text has to come from somewhere,
     and this gap is the slack in the card rather than the section. */
  .offer-quiet .offer-head { padding-bottom: 12px; }
  .offer-quiet .offer-fill { min-height: 0; }
  .offer-fill-bottom { min-height: 0; }
  /* the bonus box brings its own 14px, so the spacer starts from zero */
  .offer-lead .offer-bonus { margin-bottom: 0; }
}

/* Small laptops: the pair is still side by side but each card is narrow, and
   the subscribe row's title, pill and two prices stop fitting on one line.
   Trim the row rather than let the pill drop under the heading. */
@media (min-width: 901px) and (max-width: 1010px) {
  .opt { padding: 12px 11px; }
  .opt-on { padding: 11.5px 10.5px; }
  .opt-top { gap: 9px; }
  .opt-pill { font-size: 9px; padding: 2px 5px; letter-spacing: .03em; }
}

/* the last stretch before the cards stack, where the columns are narrowest */
@media (min-width: 901px) and (max-width: 959px) {
  .offer { padding-inline: 16px; }
}

@media (max-width: 900px) {
  .offers-pair { grid-template-columns: 1fr; max-width: 460px; gap: 12px; }
  .offer-name { font-size: 16px; margin-top: 5px; }

  /* The lead card carries a name and a longer supply line, so its text column
     needs more room than the shared phone layout gives: shrink the shot and
     tighten the gutter, and the price sits on one line again. */
  .offer-lead .offer-head { gap: 14px; }
  .offer-lead .offer-shots { height: 84px; }
  .offer-lead .offer-supply { font-size: 14px; }
  .offer-lead .offer-price { gap: 8px; }
  .offer-lead .offer-now { font-size: 36px; }
  .offer-lead .offer-was { font-size: 17px; }

  /* ---- one-bottle card, phone only -------------------------------------
     Desktop is deliberately untouched by everything in this block. The card
     mirrors the protocol card here: same 1px light-purple edge, same header
     geometry, same type scale. It stays the quieter of the two through the
     thinner border and the absence of a badge, tint and shadow. */
  /* Equal image columns and an equal gap on both cards, so the two titles
     start at the same x when the cards are stacked. */
  .offer-lead .offer-head,
  .offer-quiet .offer-head { gap: 14px; }
  .offer-lead .offer-shots,
  .offer-quiet .offer-shots { flex: 0 0 112px; width: 112px; justify-content: center; padding-left: 0; }
  /* the lone bottle is a narrow silhouette, so it needs more height than the
     protocol's three objects to read at the same size */
  .offer-quiet .offer-shots { height: 104px; }
  .offer-quiet .offer-head { margin-bottom: 14px; }
  .offer-quiet .offer-supply { margin-top: 4px; }
  .opt { padding: 13px 10px; }
  .opt-on { padding: 12.5px 9.5px; }
  .opt-dot { width: 20px; height: 20px; }
  .opt-top { gap: 10px; }

  /* Type scale matched to the protocol card rather than shrunk to fit. */
  .opt-title { font-size: 17px; }
  .opt-cadence { font-size: 15px; margin-top: 2px; }
  .opt-price { font-size: 22px; }
  .opt-was { font-size: 15px; }
  .opt-per { font-size: 15px; }
  .opt-pill { font-size: 9.5px; padding: 2px 6px; letter-spacing: .05em; }

  /* At 17px the label fills the row on its own, so the badge takes the next
     line instead of squeezing the label onto two. */
  .opt-label { flex: 0 0 100%; }

  /* Benefits line up with the label text, not the radio, and the rule above
     them starts there too. */
  .opt-extra { margin-left: 30px; margin-top: 10px; padding-top: 10px; gap: 6px 8px; }
  /* Pill and note share one line here. At the protocol card's pill size the
     pair needs 313px and the indented row only has 268, so the pill is
     compacted for this nested context; it keeps the same shape and teal. */
  .opt-extra .ship { font-size: 10px; padding: 4px 9px; letter-spacing: .04em; gap: 5px; }
  .opt-extra .ship svg { width: 12px; height: 12px; }
  .opt-note { font-size: 11.5px; }
}
`;
