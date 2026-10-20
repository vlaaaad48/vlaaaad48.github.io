(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  // Fonts and measured reveal lines can move a destination after native anchor
  // navigation. Re-align only while the visitor still intends to view that anchor.
  let anchorIntent = location.hash;
  let clickedAnchor = false;
  let alignmentFrame;
  const cancelAlignment = () => { anchorIntent = ''; cancelAnimationFrame(alignmentFrame); };
  window.addEventListener('wheel', cancelAlignment, { passive: true });
  window.addEventListener('touchstart', cancelAlignment, { passive: true });
  window.addEventListener('keydown', event => {
    if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key)) cancelAlignment();
  });
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    anchorIntent = link.getAttribute('href');
    clickedAnchor = true;
  });
  function alignAnchorAfterLayout() {
    cancelAnimationFrame(alignmentFrame);
    alignmentFrame = requestAnimationFrame(() => {
      alignmentFrame = requestAnimationFrame(() => {
        if (!anchorIntent || anchorIntent !== location.hash) return;
        let target;
        try { target = document.getElementById(decodeURIComponent(anchorIntent.slice(1))); } catch { return; }
        if (target && Math.abs(target.getBoundingClientRect().top) > 1) {
          target.scrollIntoView({ block: 'start', behavior: clickedAnchor && !reducedMotion.matches ? 'smooth' : 'instant' });
        }
      });
    });
  }
  window.addEventListener('load', alignAnchorAfterLayout);
  const heroButton = document.querySelector('.hero .circle-link');
  if (heroButton) {
    const updateHeroButton = () => {
      const hidden = window.scrollY > 0;
      heroButton.classList.toggle('is-scroll-hidden', hidden);
      heroButton.inert = hidden;
      if (hidden) heroButton.setAttribute('aria-hidden', 'true');
      else heroButton.removeAttribute('aria-hidden');
    };
    window.addEventListener('scroll', updateHeroButton, { passive: true });
    window.addEventListener('pageshow', updateHeroButton);
    updateHeroButton();
  }

  const targets = [...document.querySelectorAll('#impact h2, #impact .intro-copy p')];
  const originals = new Map(targets.map(element => [element, element.innerHTML]));
  let observer;
  let resizeTimer;
  let previousWidth = 0;

  // Measure actual wrapped lines, so Cyrillic text reveals correctly at every width.
  function splitLines(element) {
    element.innerHTML = originals.get(element);
    const fragment = document.createDocumentFragment();
    function tokenize(node, emphasis = false) {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/([ \t\r\n]+)/).filter(Boolean).forEach(token => {
          if (/^[ \t\r\n]+$/.test(token)) fragment.append(document.createTextNode(token));
          else {
            const word = document.createElement('span');
            word.className = 'reveal-word';
            if (emphasis) {
              const em = document.createElement('em');
              em.textContent = token;
              word.append(em);
            } else word.textContent = token;
            fragment.append(word);
          }
        });
      } else if (node.nodeName === 'BR') fragment.append(document.createElement('br'));
      else [...node.childNodes].forEach(child => tokenize(child, emphasis || node.nodeName === 'EM'));
    }
    [...element.childNodes].forEach(node => tokenize(node));
    element.replaceChildren(fragment);
    const groups = [];
    let previousTop = -Infinity;
    element.querySelectorAll('.reveal-word').forEach(word => {
      const top = word.getBoundingClientRect().top;
      if (Math.abs(top - previousTop) > 2) groups.push([]);
      groups.at(-1).push(word);
      previousTop = top;
    });
    const lines = document.createDocumentFragment();
    groups.forEach((words, index) => {
      const mask = document.createElement('span');
      mask.className = 'reveal-line-mask';
      const inner = document.createElement('span');
      inner.className = 'reveal-line-inner';
      inner.style.setProperty('--line-delay', `${index * 90}ms`);
      words.forEach((word, wordIndex) => {
        if (wordIndex) inner.append(document.createTextNode(' '));
        inner.append(word);
      });
      mask.append(inner);
      if (index) lines.append(document.createTextNode(' '));
      lines.append(mask);
    });
    element.replaceChildren(lines);
    element.classList.add('line-reveal');
  }

  function prepareReveals() {
    observer?.disconnect();
    const width = document.querySelector('#impact').clientWidth;
    previousWidth = width;
    if (reducedMotion.matches) {
      targets.forEach(element => {
        element.innerHTML = originals.get(element);
        element.classList.remove('line-reveal', 'is-revealed');
      });
      alignAnchorAfterLayout();
      return;
    }
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-revealed');
        else if (entry.boundingClientRect.top >= innerHeight) entry.target.classList.remove('is-revealed');
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
    targets.forEach(element => {
      const alreadyVisible = element.getBoundingClientRect().bottom < 0;
      element.classList.remove('line-reveal', 'is-revealed');
      splitLines(element);
      if (alreadyVisible) element.classList.add('is-revealed');
      observer.observe(element);
    });
    alignAnchorAfterLayout();
  }
  document.fonts.ready.then(prepareReveals);
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (document.querySelector('#impact').clientWidth !== previousWidth) prepareReveals();
    }, 180);
  });
  reducedMotion.addEventListener('change', () => {
    prepareReveals();
  });
})();
