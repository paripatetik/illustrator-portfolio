export const HOME_SCROLL_Y_KEY = "home:return-scroll-y";
export const HOME_SCROLL_PENDING_KEY = "home:return-scroll-pending";

export function saveHomeScrollPosition() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(HOME_SCROLL_Y_KEY, String(window.scrollY));
  } catch {
    // Ignore storage failures (private mode / quota / blocked storage).
  }
}

export function markHomeScrollRestorePending() {
  if (typeof window === "undefined") return;
  try {
    const rawY = window.sessionStorage.getItem(HOME_SCROLL_Y_KEY);
    if (rawY === null) return;
    window.sessionStorage.setItem(HOME_SCROLL_PENDING_KEY, "1");
  } catch {
    // Ignore storage failures.
  }
}

export function consumePendingHomeScrollRestore() {
  if (typeof window === "undefined") return false;

  try {
    const pending = window.sessionStorage.getItem(HOME_SCROLL_PENDING_KEY);
    const rawY = window.sessionStorage.getItem(HOME_SCROLL_Y_KEY);

    if (pending !== "1" || rawY === null) return false;

    window.sessionStorage.removeItem(HOME_SCROLL_PENDING_KEY);
    window.sessionStorage.removeItem(HOME_SCROLL_Y_KEY);

    const targetY = Number.parseFloat(rawY);
    if (!Number.isFinite(targetY) || targetY < 0) return false;

    const applyScroll = () => {
      window.scrollTo({ top: targetY, left: 0, behavior: "auto" });
    };

    // Apply multiple times to win against hydration/layout shifts.
    applyScroll();
    requestAnimationFrame(() => {
      applyScroll();
      requestAnimationFrame(applyScroll);
    });
    setTimeout(applyScroll, 0);

    return true;
  } catch {
    return false;
  }
}
