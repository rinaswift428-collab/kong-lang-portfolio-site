(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = [...document.querySelectorAll('.reveal')];
  if (reduceMotion) {
    items.forEach((item) => { item.style.transitionDelay = '0ms'; });
    return;
  }
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--style-stagger-ms');
  if (!raw.trim()) return;
  const step = Math.max(0, Math.min(160, Number.parseInt(raw, 10) || 0));
  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 5, 4) * step}ms`;
  });
})();
