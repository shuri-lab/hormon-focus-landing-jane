# Hormone Focus &mdash; bridge landing page

One page, one responsive layout. It used to be two fixed-width artboards, mobile
and desktop, carrying the same copy twice &mdash; headlines built out of flex rows
broke as soon as they wrapped. It is now a single document with a fluid type
scale and alternating colour bands, so a headline is a headline at every width.

```
index.html    the page
img/          21 images. 12 customer selfies and JJ's portrait from the live
              product page; three background-removed product shots for the
              offer cards; two customer cut-outs flattened onto white; the
              60-day money-back badge
img/partners/ 8 press logos for the marquee, from JJ's coaching page
img/video/    9 poster frames for the Vimeo testimonials
```

Everything under `img/` other than the bottle renders comes from
`jjsmithonline.com/supplements/hormonal-imbalance/`. The twelve selfies are
`hormonal-imbalance-selfies-image-v1` to `v12`; the two portraits are the
`Hormone-Focus-For-the-Women` and `Why-Settle` shots with their green disc
removed. Product and portrait cut-outs were made with macOS Vision foreground
segmentation, then flattened onto white and saved as JPEG where they sit on a
white band &mdash; a transparent PNG of the same shot was five times the weight.

Three things on the page are driven by script rather than markup: the offer
CTAs' hrefs (see below), the sticky buy bar, and the attribution block. The
sticky bar is a plain scroll handler &mdash; it shows only where neither the hero
nor the offer section is on screen, so it never doubles up with a CTA already
in view.

The customer-photo strip and the press logos live **inside** the hero section,
not after it. That is deliberate: on a phone the product render is hidden and
the photo strip runs at full size in its place, directly under the CTA, then
the chips, the quote, and only then the logos. Reordering those five pieces
needs them in one flex container, so `.hero-grid` becomes `display: contents`
below 940px and its two columns join the hero's own flex flow. The photo strip sits above the logos so it is the one that breaks the fold
&mdash; checked at 1440&times;900 and 1280&times;720.

Review cards carry a circular crop of the verified-buyer selfies already shown
above them, one per review.

> **Open:** the pairing is arbitrary. Lisa gets `selfie-1`, Angela S. gets
> `selfie-2`, Arlie L. gets `selfie-3`, because nothing in the source says which
> photo belongs to which reviewer. Confirm the real pairings, or use photos that
> are not tied to a name.

No build step and no dependencies. Two Google fonts load from a CDN &mdash; subset
or self-host them before this carries real traffic.

## Where this has to end up

**`shop.jjsmithonline.com`, as a Shopify page template.** Not because it is
convenient, but because everything below depends on it:

- The domain is already verified in Business Manager
- The Meta pixel is already installed and firing there, with CAPI alongside it
- The click through to the product page stays on the same domain, so no
  cross-domain hop and no lost click ID

Hosting it anywhere else means a new domain to verify, a cross-domain hop, and
Meta treating the destination as unknown.

## The offer section

Everything above the fold now scrolls rather than sells. Both page CTAs
(&ldquo;Start today&rdquo;, hero and closer) point at the offer section at the
foot of the page. The purchase happens there, when the reader picks one of three
options.

The section id is **`offer`**, and both CTAs are plain `href="#offer"` links, so
the scroll works with no JavaScript; `html { scroll-behavior: smooth }` makes it
smooth, and reduced-motion turns it off. `#offer` is also the anchor to use in
ads.

### Where the cart URLs live

One object, `HF_OFFERS`, in the **offer config** block immediately above the
tracking block. Nothing else on the page hardcodes a shop URL; both layouts
read their hrefs from it through `data-offer`.

| Offer | Key | Destination |
|---|---|---|
| One bottle, $49.99 one-time, shipping extra | `single` | `/cart/41200079175791:1?storefront=true` |
| Two bottles, $84.99 one-time, free shipping | `bundle` | `/cart/54330638663791:1?storefront=true` |
| The protocol, $39.99 a month, free shipping | `protocol` | `/cart/add?id=54355951845487&selling_plan=5529010287` |

Per-day figures on the cards ($1.67, $1.42, $1.33) are price divided by days of
supply, the same basis for all three, with a bottle counted as the 30 days the
page states.

The subscription's interval was an open question while the plan did not exist.
It is settled: selling plan `5529010287` reports itself as **"Deliver every
month"** at **$39.99** per delivery, so *one bottle a month* and *$1.33 a day*
are both right.

> **Worth knowing:** the subscription link uses `/cart/add`, which **appends**
> to the cart, while the two one-time links use the `/cart/<variant>:<qty>`
> permalink form, which **replaces** it. Verified against the live store: add
> one bottle, then the subscription, and the cart holds both ($89.98); click
> subscribe twice and it holds two subscriptions ($129.97). If a shopper should
> only ever leave with the offer they last clicked, swap `protocol` for
> `https://shop.jjsmithonline.com/cart/54355951845487:1?selling_plan=5529010287`
> &mdash; same product, same plan, replace semantics. Left as supplied because
> letting someone buy a bottle *and* a subscription may well be intended.

All three are live. The pending-state machinery stays in place: leave any of
these blank and that card renders with its button disabled and a short note in
its place, so a broken link can never quietly become a dead button.

The config block runs before the tracking block on purpose: attribution
decorates every link pointing at the store, so the hrefs have to exist by the
time it runs. Verified in a browser &mdash; land with `?utm_source=&hellip;&fbclid=&hellip;`
and both live cart links carry the parameters through.

## What came from the product page

Three blocks are lifted from `jjsmithonline.com/supplements/hormonal-imbalance/`
rather than written here, so they stay in JJ's own words:

- **The FAQ section** &mdash; six of the seven official Q&amp;As, verbatim, in their
  own section after the guarantee. The seventh (the refund policy) became the
  guarantee section instead, so the same answer is not told twice. The
  supplement-facts table was left off; the three-ingredient panel already
  carries the same milligrams. *Still wondering?* keeps its own four short
  cards higher up the page and is untouched.
- **The guarantee section** &mdash; the refund FAQ, verbatim, with the
  `Money-Back-Badge` seal.
- **Nine video testimonials** from *What People Are Saying About Hormone
  Focus*. They are unlisted Vimeo clips, so each card is a poster frame and the
  player is only injected on click &mdash; the page never pulls nine embeds it may
  not need. Poster frames were pulled from each clip's player config; Vimeo's
  oEmbed endpoint 404s on these because they are unlisted. Opening one closes
  any other, so two clips cannot talk over each other, and the close button
  puts the poster back so a card can be replayed.

Adding video meant the attribution line under the reviews had to change from
"Reviews and photos" to "Reviews, photos and videos", in both the section and
the footnotes. That is the only wording on the page that is not either JJ's or
the original bridge copy.

## Analytics

Two tags in the `<head>`, each installed once:

| Tag | ID | Notes |
|---|---|---|
| Google Tag Manager | `GTM-WT4MWLTH` | plus the `<noscript>` iframe straight after `<body>` |
| Microsoft Clarity | `ylyq7ufwhu` | direct install, not via GTM |

**GA4 is not hardcoded.** Measurement ID `G-FJC85W3ZLE` belongs in a GA4
Configuration tag inside the GTM container; putting a `gtag()` snippet on the
page as well would double every hit. Same warning for Clarity: it is installed
directly here, so do not also add a Clarity tag to the container.

The page had no analytics before this &mdash; `git log -S` finds `googletagmanager`,
`gtag(`, `clarity.ms` and `dataLayer` in none of the twenty commits that precede
it. Nothing was lost in an earlier push; this is a first install.

## Tracking

One block at the foot of `index.html`, in two halves. Behaviour below is
verified in a browser, not inferred from reading the code.

### Half one: attribution

Pure JS, no network call. It does three things.

**Capture.** Reads `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`,
`utm_term`, `utm_id`, `fbclid`, `gclid`, `ttclid` and `s` off the incoming URL.
Anything else is ignored.

**Persist.** Writes them to `sessionStorage`, so a reader who scrolls, reloads,
or comes back in the same tab still carries the campaign through. Verified: land
with parameters, reload the bare URL, the product link is still decorated.

**Infer a source when the click ID arrives alone.** A paid click frequently
lands with `fbclid` and no UTMs at all. Rather than record that order as direct
traffic, the block fills in the source from the click ID:

| Click ID present | `utm_source` | `utm_medium` |
|---|---|---|
| `fbclid` | `facebook` | `paid_social` |
| `gclid` | `google` | `cpc` |
| `ttclid` | `tiktok` | `paid_social` |

Explicit UTMs always win; the inference only fills gaps.

**Forward.** Every link pointing at `shop.jjsmithonline.com` is topped up with
the captured parameters, on load and again at click time &mdash; **gaps only**. The
three offer links carry fixed UTMs of their own and those survive the click; a
captured value is written only where the link has none.

| On the link already | Filled from the incoming URL |
|---|---|
| `utm_source=bridge` | `utm_term` (ad set) |
| `utm_medium=landing` | `utm_id` (ad id) |
| `utm_campaign=hf-60day` | `fbclid`, `gclid`, `ttclid`, `s` |
| `utm_content=1bottle` / `2bottle` / `sub` | |

> **Consequence, worth understanding before reading any report:** every order
> from this page now arrives in Shopify as `bridge / landing / hf-60day`,
> whichever ad paid for the click. Campaign-level reconciliation on the Shopify
> side is gone; ad-level detail survives only through `utm_id` and `utm_term`,
> so build reports on those, not on `utm_campaign`. To go back to the incoming
> campaign winning, drop the `if (!u.searchParams.get(k))` guard in
> `decorate()`.

```
https://shop.jjsmithonline.com/products/hormonal-imbalance
  ?utm_source=facebook&utm_medium=paid_social&utm_campaign=Sales_ATC
  &utm_content=BT01_REPEAT_V02&utm_id=120246433106950037&fbclid=IwAR...
```

**This is the half that produces a defensible cost per purchase.** It puts the
campaign on the Shopify order, and it does not depend on Meta at all.

### Half two: Meta pixel

`PageView`, `ViewContent` (with `content_ids`), and a `BridgeCTAClick` custom
event carrying the campaign name. `DATASET_ID` is a named constant at the top.

**It does not install a second pixel.** On the Shopify store the Meta pixel is
already present store-wide. A second copy would double every `PageView`,
inflating Landing Page Views and quietly corrupting frequency and cost per LPV.
The block checks for a host pixel (`window.fbq`, or a `connect.facebook.net`
script tag) and only loads its own when none is found. `ViewContent` and
`BridgeCTAClick` fire once either way.

So: drop this page onto the store as-is. Do not add the pixel, and do not
remove the block to avoid a clash &mdash; it handles the clash itself.

> **Open:** `DATASET_ID` is `1614860232058835`. Todd's reports may read a
> different dataset. Confirm before this goes live.

Whichever pixel is used has to be on JJ's store as well as on this page. The
Purchase event only exists on the store, so a pixel that lives only here goes
blind at the moment that matters.

## Installing it on the store

1. Shopify admin &rarr; **Online Store &rarr; Pages &rarr; Add page**, or a page
   template if the theme prefers one
2. Paste `index.html`'s body. Keep the `<style>` block and the tracking block at
   the foot &mdash; both are self-contained
3. Upload `img/` to Shopify **Files** and repoint the `src` paths, or serve them
   from the theme's asset folder
4. Set the ad's destination to the new page URL, and set the URL parameters
   (below) at ad level
5. **Verify Purchase before pointing spend at it** &mdash; see the last section

## The UTM convention

Set this once per ad, in Ads Manager under **Ad level &rarr; Tracking &rarr; URL
parameters**. Meta substitutes the dynamic values at click time, so it is
written once and never maintained.

```
utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_term={{adset.name}}&utm_content={{ad.name}}&utm_id={{ad.id}}
```

| Parameter | Value | Reads as |
|---|---|---|
| `utm_source` | `facebook` | fixed |
| `utm_medium` | `paid_social` | fixed |
| `utm_campaign` | `{{campaign.name}}` | which campaign |
| `utm_term` | `{{adset.name}}` | which ad set |
| `utm_content` | `{{ad.name}}` | **which creative** &mdash; the one that matters |
| `utm_id` | `{{ad.id}}` | the stable join key back to Ads Manager |

`utm_content` is the one to get right. Creative names are how spend gets
attributed to a specific ad, and `{{ad.id}}` is what survives a rename.

## Verify before trusting any of it

**Unverified:** whether Meta passes query parameters through on the outbound
click under this domain's core setup restrictions. Everything above assumes they
survive. If they do not, the pixel half still works and the attribution half
records nothing.

The test costs one click:

1. Set the URL parameters on one live ad, as above
2. Click your own ad from a phone
3. Look at the address bar when the page loads

If the UTMs are on the URL, the scheme works. If they are stripped, say so
before anyone builds a report on it.

### Purchase is the one to check first

Purchase does not fire from this page and never will. It fires at Shopify
checkout, from the Shopify&ndash;Meta integration that already exists. What this
page does is keep the chain unbroken: same domain as checkout, so the `_fbc`
cookie carries, and the UTMs ride through to the order.

**The chain works, but it has been exercised exactly once.** As of 2026-09-04
the account has **one** attributed purchase: $56.74, 0.35 ROAS, $162.75 cost
per purchase. So `Purchase` does fire and does attribute &mdash; earlier notes in
this repo saying otherwise were written against a superseded read.

What that single order does **not** give you is a CAC. One order is a sample of
one. The real gate is Shopify reconciliation: matching orders back to campaigns
using the UTMs this page forwards. Until that is run, no cost-per-purchase
figure from this funnel should be quoted to anyone.

Then confirm the rest in the browser console on the landing page:

```js
sessionStorage.getItem('hf_attr')                       // what was captured
document.querySelector('a[href*="shop."]').href         // what gets forwarded
```

## Restriction

The domain is under Meta's **core setup** restrictions, the health-and-wellness
regime. That strips custom parameters and URL content after the domain. It does
**not** block optimising for Purchase &mdash; that is the tier below (standard event
restrictions), which this domain is not on.

Custom parameters being stripped is precisely why the forwarding half exists:
Meta cannot segment by URL, so reconciliation happens on the Shopify side.

## Claims

Benefit wording is taken from JJ's live product page, hedges included, because
her wording is what her asterisk and DSHEA footnote already stand behind. Do not
state a benefit more strongly than her own page states it. Footnotes at the
bottom of the page carry the FDA disclaimer and the results-vary line; they stay.
