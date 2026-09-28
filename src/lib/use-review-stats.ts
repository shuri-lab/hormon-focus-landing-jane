import { useEffect, useState } from "react";
import { FALLBACK_RATING, getReviews } from "./okendo";

export type ReviewStats = { average: number; total: number; live: boolean };

/**
 * The live average and review count for the rating badges.
 *
 * Starts from the last known figures so the badges are correct on first paint,
 * then swaps in the live numbers. The request is deferred to an idle callback:
 * it is 2 requests and about 25 KB gzipped, which should never compete with
 * the hero. If Okendo is unreachable the badges keep the fallback and nothing
 * visibly fails.
 */
export function useReviewStats(): ReviewStats {
  const [stats, setStats] = useState<ReviewStats>({ ...FALLBACK_RATING, live: false });

  useEffect(() => {
    let cancelled = false;
    const start = () => {
      getReviews()
        .then((d) => {
          if (!cancelled && d.total) setStats({ average: d.average, total: d.total, live: true });
        })
        .catch((err) => console.warn("[Hormone Focus] review count unavailable:", err));
    };

    const ric = (window as unknown as {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    }).requestIdleCallback;

    if (typeof ric === "function") {
      const id = ric(start, { timeout: 3000 });
      return () => { cancelled = true; (window as unknown as { cancelIdleCallback?: (n: number) => void }).cancelIdleCallback?.(id); };
    }
    const t = window.setTimeout(start, 1200);
    return () => { cancelled = true; window.clearTimeout(t); };
  }, []);

  return stats;
}
