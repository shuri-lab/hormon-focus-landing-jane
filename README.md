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

A single block at the foot of `index.html`, in two halves.

**Parameter forwarding.** Pure JS, no network call. Reads `utm_source`,
`utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `utm_id`, `fbclid`,
`gclid`, `ttclid` and `s` off the incoming URL and appends them to every link
pointing at `shop.jjsmithonline.com`. Unrecognised parameters are dropped.

This is the half that matters. It is what lets the Shopify order record which
campaign produced it, and it does not depend on Meta at all.

**Meta pixel.** `PageView`, `ViewContent`, and a `BridgeCTAClick` custom event
on the CTA. `DATASET_ID` is a named constant at the top of the block.

> **Open:** `DATASET_ID` is set to `1614860232058835`. Todd's reports may read a
> different dataset. Confirm before this goes live.

Whichever pixel is used has to be on JJ's store as well as on this page &mdash; the
Purchase event only exists on the store, so a pixel that lives only here goes
blind at the moment that matters.

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
