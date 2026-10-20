(() => {
  if (performance.getEntriesByType('navigation')[0]?.type !== 'reload') return;

  // Run before the document is laid out: a reload always starts at the hero,
  // rather than restoring a previous scroll offset or the last section hash.
  history.scrollRestoration = 'manual';
  history.replaceState(history.state, '', location.pathname + location.search);
  const showHero = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  showHero();
  window.addEventListener('pageshow', () => {
    showHero();
    requestAnimationFrame(showHero);
  }, { once: true });
})();
