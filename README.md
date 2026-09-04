# Hormone Focus &mdash; bridge landing page

One page, responsive. The desktop layout renders at 1100px and above, the mobile
layout below it (centred, so it reads fine on a tablet). Both are the same copy; they are separate layouts rather than
one reflowing grid because they were drawn as separate artboards.

```
index.html    the page
img/          9 images, all lifted from JJ's live product page
```

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

**Forward.** Every link pointing at `shop.jjsmithonline.com` is rewritten with
the captured parameters, on load and again at click time.

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
3. Upload `img/` to Shopify **Files** and repoint the nine `src` paths, or serve
   them from the theme's asset folder
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
