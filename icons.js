(() => {
  const directions = { '↓': 0, '↑': 180, '→': -90, '←': 90, '↗': -135, '↘': -45, '↙': 45, '↖': 135, '↺': 90 };
  function arrow(angle = 0, extraClass = '') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', `arrow-icon ${extraClass}`.trim());
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const path = document.createElementNS(svg.namespaceURI, 'path');
    path.setAttribute('d', 'M12 4v16m-6-6 6 6 6-6');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '1.8');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    if (angle) path.setAttribute('transform', `rotate(${angle} 12 12)`);
    svg.append(path);
    return svg;
  }
  window.replaceArrowIcons = (root = document.body) => {
    root.querySelectorAll('svg.projects-arrow:not(.arrow-icon),svg.role-arrow:not(.arrow-icon)').forEach(svg => {
      svg.replaceWith(arrow(svg.classList.contains('role-arrow') ? -45 : 0, svg.getAttribute('class')));
    });
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return !node.parentElement?.closest('script,style,pre,code,textarea,svg') && /[↓↑→←↗↘↙↖↺]/u.test(node.textContent)
          ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/([↓↑→←↗↘↙↖↺])/u).forEach(part => {
        fragment.append(part in directions ? arrow(directions[part]) : document.createTextNode(part));
      });
      node.replaceWith(fragment);
    });
  };
})();
