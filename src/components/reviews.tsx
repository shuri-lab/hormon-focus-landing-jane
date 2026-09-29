import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getReviews, type OkendoReview, type ReviewsData } from "@/lib/okendo";
import okendoLogo from "@/assets/img/okendo-logo.webp";

type Phase = "idle" | "loading" | "ready" | "failed";
type SortKey = "recent" | "highest" | "lowest" | "photos";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "recent", label: "Most recent" },
  { key: "highest", label: "Highest rated" },
  { key: "lowest", label: "Lowest rated" },
];

const PAGE = 6;

const hasPhotos = (r: OkendoReview) => !!(r.media && r.media.length);

function Stars({ rating, size = 15 }: { rating: number; size?: number }) {
  return (
    <span className="rv-stars" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"
             className={n <= Math.round(rating) ? "rv-star on" : "rv-star"}>
          <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.4l6.5-.9z" />
        </svg>
      ))}
    </span>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function ReviewCard({ review, onPhoto }: { review: OkendoReview; onPhoto: (m: string) => void }) {
  const [open, setOpen] = useState(false);
  const [clamped, setClamped] = useState(false);
  const bodyRef = useRef<HTMLParagraphElement | null>(null);

  // Only offer "Read more" when the text is actually cut off, which depends on
  // the rendered width, so it is measured rather than guessed from length.
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const measure = () => setClamped(el.scrollHeight > el.clientHeight + 2);
    measure();
    if (typeof ResizeObserver !== "function") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [review.body]);

  const name = review.reviewer?.displayName?.trim() || "Verified customer";
  const initial = (name.match(/[A-Za-z]/)?.[0] || "?").toUpperCase();

  return (
    <article className="rv-card">
      <div className="rv-top">
        <Stars rating={review.rating} />
        <span className="rv-date">{formatDate(review.dateCreated)}</span>
      </div>
      {review.title ? <h3 className="rv-title">{review.title}</h3> : null}
      {review.body ? (
        <p ref={bodyRef} className={"rv-body" + (open ? " is-open" : "")}>{review.body}</p>
      ) : null}
      {review.body && (clamped || open) ? (
        <button type="button" className="rv-more" onClick={() => setOpen((v) => !v)}>
          {open ? "Read less" : "Read more"}
        </button>
      ) : null}
      {hasPhotos(review) ? (
        <div className="rv-photos">
          {review.media!.map((m, i) => {
            const thumb = m.thumbnailUrl || m.url;
            const full = m.url || m.thumbnailUrl;
            if (!thumb || !full) return null;
            return (
              <button key={i} type="button" className="rv-photo" onClick={() => onPhoto(full)}
                      aria-label={m.caption || "Open customer photo"}>
                {/* one dead URL should cost one thumbnail, not the whole row */}
                <img src={thumb} alt={m.caption || ""} loading="lazy"
                     onError={(e) => { (e.currentTarget.closest(".rv-photo") as HTMLElement | null)?.remove(); }} />
              </button>
            );
          })}
        </div>
      ) : null}
      <div className="rv-who">
        <span className="rv-initial" aria-hidden="true">{initial}</span>
        <span className="rv-name">{name}</span>
        {/* only where Okendo marks the reviewer verified; never inferred */}
        {review.reviewer?.isVerified ? (
          <span className="rv-verified">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
            Verified buyer
          </span>
        ) : null}
      </div>
    </article>
  );
}

export default function Reviews() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [data, setData] = useState<ReviewsData | null>(null);
  const [sort, setSort] = useState<SortKey>("recent");
  const [shown, setShown] = useState(PAGE);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const started = useRef(false);

  const load = useCallback(() => {
    if (started.current) return;
    started.current = true;
    setPhase("loading");
    getReviews()
      .then((d) => {
        if (!d.total) throw new Error("Okendo returned no reviews");
        setData(d);
        setPhase("ready");
      })
      .catch((err) => {
        // Nothing is shown to the visitor; the section just does not appear.
        console.warn("[Hormone Focus] Okendo reviews unavailable:", err);
        setPhase("failed");
      });
  }, []);

  // Fetch only when the visitor gets near the section.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (typeof IntersectionObserver !== "function") { load(); return; }
    const io = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) { io.disconnect(); load(); } },
      { rootMargin: "500px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [load]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const anyPhotos = useMemo(() => !!data?.reviews.some(hasPhotos), [data]);

  const sorted = useMemo(() => {
    if (!data) return [];
    const list = data.reviews.slice();
    if (sort === "highest") list.sort((a, b) => b.rating - a.rating || +new Date(b.dateCreated) - +new Date(a.dateCreated));
    else if (sort === "lowest") list.sort((a, b) => a.rating - b.rating || +new Date(b.dateCreated) - +new Date(a.dateCreated));
    else if (sort === "photos") return list.filter(hasPhotos);
    return list;
  }, [data, sort]);

  if (phase === "failed") return null;

  const options = anyPhotos ? [...SORTS, { key: "photos" as SortKey, label: "With photos" }] : SORTS;
  const visible = sorted.slice(0, shown);
  const busy = phase === "idle" || phase === "loading";

  return (
    <section className="band band-white" ref={sectionRef} id="reviews">
      <div className="wrap stack">
        <div className="stack-s" style={{ alignItems: "center", textAlign: "center" }}>
          <p className="eyebrow">Customer reviews</p>
          <h2 className="h2">What women are saying</h2>
        </div>

        {busy ? (
          <div className="rv-grid" aria-hidden="true">
            {Array.from({ length: PAGE }).map((_, i) => (
              <div className="rv-card rv-skel" key={i}>
                <span className="sk sk-row" /><span className="sk sk-title" />
                <span className="sk sk-line" /><span className="sk sk-line" /><span className="sk sk-line short" />
                <span className="sk sk-who" />
              </div>
            ))}
          </div>
        ) : null}

        {phase === "ready" && data ? (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: "Hormone Focus",
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: data.average.toFixed(1),
                  reviewCount: data.total,
                  bestRating: 5,
                  worstRating: 1,
                },
              }) }}
            />

            <div className="rv-summary">
              <div className="rv-score">
                <div className="rv-avg">{data.average.toFixed(1)}</div>
                <Stars rating={data.average} size={20} />
                <p className="rv-count">Based on {data.total} reviews</p>
              </div>
              <div className="rv-bars">
                {[5, 4, 3, 2, 1].map((star) => {
                  const n = data.histogram[star] || 0;
                  const pct = data.total ? (n / data.total) * 100 : 0;
                  return (
                    <div className="rv-bar" key={star}>
                      <span className="rv-bar-l">{star} star</span>
                      <span className="rv-track"><span className="rv-fill" style={{ width: `${pct}%` }} /></span>
                      <span className="rv-bar-n">{n}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Provenance for the numbers above: who collected and checked
                them. Not a per-review purchase claim, which is what the
                "Verified buyer" badge on individual cards is for. */}
            <p className="rv-seal">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
              <span className="rv-seal-t">Reviews collected and verified by</span>
              <img src={okendoLogo} width="315" height="68" alt="Okendo" loading="lazy" decoding="async" />
            </p>

            <div className="rv-controls">
              <label className="rv-sort">
                <span>Sort by</span>
                <select value={sort} onChange={(e) => { setSort(e.target.value as SortKey); setShown(PAGE); }}>
                  {options.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
                </select>
              </label>
              <span className="rv-showing">Showing {Math.min(shown, sorted.length)} of {sorted.length}</span>
            </div>

            <div className="rv-grid">
              {visible.map((r) => <ReviewCard key={r.reviewId} review={r} onPhoto={setLightbox} />)}
            </div>

            {shown < sorted.length ? (
              <div style={{ textAlign: "center" }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShown((n) => n + PAGE)}>
                  Show more reviews
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      {lightbox ? (
        <div className="rv-lightbox" role="dialog" aria-modal="true" aria-label="Customer photo"
             onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" />
          <button type="button" className="rv-close" aria-label="Close photo">&times;</button>
        </div>
      ) : null}
    </section>
  );
}
