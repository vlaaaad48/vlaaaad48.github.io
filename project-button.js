(() => {
  document.querySelectorAll('.circle-link, .contact-action').forEach(button => {
  const fill = button.querySelector('.project-button-fill');
  if (!fill) return;
  const paintedBackground = button.classList.contains('contact-action');
  const target = paintedBackground ? button : fill;
  const frame = offset => paintedBackground
    ? { backgroundPosition: `50% ${50 - offset * 2}%` }
    : { transform: `translateY(${offset}%)` };
  function setPosition(offset) {
    if (paintedBackground) button.style.backgroundPosition = frame(offset).backgroundPosition;
    else fill.style.transform = frame(offset).transform;
  }
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let animation;
  let active = false;

  function enter() {
    if (active) return;
    active = true;
    animation?.cancel();
    button.classList.add('is-active');
    if (reducedMotion.matches) {
      setPosition(0);
      button.classList.add('is-filled');
    } else {
      const entry = target.animate([frame(76), frame(0)], { duration: 600, easing: 'cubic-bezier(.645,.045,.355,1)', fill: 'forwards' });
      animation = entry;
      entry.finished.then(() => {
        if (active && animation === entry) button.classList.add('is-filled');
      }).catch(() => {});
    }
  }

  function leave() {
    if (!active || button.matches(':focus-visible')) return;
    active = false;
    const currentFrame = paintedBackground
      ? { backgroundPosition: getComputedStyle(button).backgroundPosition }
      : { transform: getComputedStyle(fill).transform };
    animation?.cancel();
    button.classList.remove('is-active', 'is-filled');
    if (reducedMotion.matches) setPosition(76);
    else {
      const exit = target.animate([currentFrame, frame(-76)], { duration: 600, easing: 'cubic-bezier(.645,.045,.355,1)', fill: 'forwards' });
      animation = exit;
      exit.finished.then(() => {
        if (animation === exit && !active) {
          exit.cancel();
          setPosition(76);
        }
      }).catch(() => {});
    }
  }

  button.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'touch') enter();
  });
  button.addEventListener('pointerleave', leave);
  button.addEventListener('focus', enter);
  button.addEventListener('blur', () => {
    if (!button.matches(':hover')) leave();
  });
  reducedMotion.addEventListener('change', () => {
    animation?.cancel();
    button.classList.toggle('is-filled', active);
    setPosition(active ? 0 : 76);
  });
  });
})();
