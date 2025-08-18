// src/utils/reveal.ts
type Cleanup = () => void;

function makeObserver() {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      }
    },
    {
      threshold: 0,                  // ver elemento apenas aparece
      root: null,
      rootMargin: "0px 0px -10% 0px" // pequeño margen inferior
    }
  );
  return io;
}

function scanAndObserve(io: IntersectionObserver) {
  const nodes = document.querySelectorAll<HTMLElement>(".reveal-base:not(.is-visible)");
  nodes.forEach((el) => io.observe(el));
}

export function initReveal(): Cleanup {
  if (typeof window === "undefined" || typeof document === "undefined") return () => {};

  // Si el usuario prefiere reducir movimiento: todo visible
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    document.querySelectorAll<HTMLElement>(".reveal-base").forEach((n) => n.classList.add("is-visible"));
    return () => {};
  }

  // Marca body para fallback CSS si quieres (opcional)
  document.documentElement.classList.add("js-enabled");

  // 1) Crea un único observer
  let io = makeObserver();
  const observeAll = () => scanAndObserve(io);

  // 2) Escanea cuando:
  // - DOM listo
  // - window load
  // - siguiente frame tras el primer render
  // - tras pequeñas demoras (reintentos por StrictMode/doble render)
  const raf1 = requestAnimationFrame(observeAll);
  const t1 = setTimeout(observeAll, 60);
  const t2 = setTimeout(observeAll, 180);

  // 3) Re-scan cuando hay mutaciones (nuevos nodos montados)
  const mo = new MutationObserver((mutations) => {
    let added = false;
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) { added = true; break; }
    }
    if (added) observeAll();
  });
  mo.observe(document.body, { childList: true, subtree: true });

  // 4) También en DOMContentLoaded / load (por si init corrió muy temprano)
  const onReady = () => observeAll();
  const onLoad = () => observeAll();
  document.addEventListener("DOMContentLoaded", onReady);
  window.addEventListener("load", onLoad);

  // Cleanup
  return () => {
    cancelAnimationFrame(raf1);
    clearTimeout(t1);
    clearTimeout(t2);
    document.removeEventListener("DOMContentLoaded", onReady);
    window.removeEventListener("load", onLoad);
    mo.disconnect();
    io.disconnect();
  };
}
