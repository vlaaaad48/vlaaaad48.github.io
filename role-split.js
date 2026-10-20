(() => {
  const text = document.querySelector('.hero-statement p');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!text || reducedMotion.matches || !Element.prototype.animate) return;
  async function reveal() {
    await document.fonts.ready;
    if (reducedMotion.matches) return;
    const source = document.createElement('span');
    source.className = 'role-source';
    source.append(...text.childNodes);
    const visual = document.createElement('span');
    visual.className = 'role-visual';
    visual.setAttribute('aria-hidden', 'true');
    text.replaceChildren(source, visual);
    text.classList.add('role-split');
    const letters = [];
    const walker = document.createTreeWalker(source, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      for (let index = 0; index < node.length; index++) {
        if (/\s/.test(node.textContent[index])) continue;
        const glyph = document.createElement('span');
        glyph.className = 'role-char';
        glyph.textContent = node.textContent[index];
        visual.append(glyph);
        letters.push({ node, index, glyph });
      }
    }
    function layout() {
      const box = source.getBoundingClientRect();
      const range = document.createRange();
      let firstTop;
      for (const { node, index, glyph } of letters) {
        range.setStart(node, index);
        range.setEnd(node, index + 1);
        const rect = range.getBoundingClientRect();
        firstTop ??= rect.top;
        glyph.style.left = `${rect.left - box.left}px`;
        glyph.style.top = `${rect.top - firstTop}px`;
        glyph.style.width = `${rect.width}px`;
      }
    }
    // Keep a full shaped text run in the layout. Animated glyphs never
    // participate in spacing, so kerning and line widths remain constant.
    layout();
    text.dataset.roleAnimation = 'playing';
    const animations = letters.map(({ glyph }, index) => glyph.animate([
      { opacity: 0, transform: 'translate3d(0,40px,0)' },
      { opacity: 1, transform: 'translate3d(0,0,0)' }
    ], { duration: 1250, delay: index * 50,
      easing: 'cubic-bezier(.165,.84,.44,1)', fill: 'both' }));
    let finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      animations.forEach(animation => animation.cancel());
      text.dataset.roleAnimation = 'complete';
      reducedMotion.removeEventListener('change', onMotionChange);
    }
    function onMotionChange() { if (reducedMotion.matches) finish(); }
    reducedMotion.addEventListener('change', onMotionChange);
    new ResizeObserver(layout).observe(source);
    Promise.all(animations.map(animation => animation.finished)).then(finish).catch(finish);
  }
  reveal();
})();
