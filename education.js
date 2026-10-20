(() => {
  const button = document.querySelector('#education-toggle');
  const extra = [...document.querySelectorAll('#education-list > article')].slice(4);
  if (!button || !extra.length) return;
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    extra.forEach(article => { article.hidden = !expanded; });
    button.setAttribute('aria-expanded', String(expanded));
    button.textContent = expanded ? 'Свернуть' : 'Посмотреть всё';
  });
})();
