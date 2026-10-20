(() => {
  const shortWords = /(?<![\p{L}\p{N}_])((?:в|во|на|с|со|к|ко|о|об|обо|у|от|ото|до|из|из-за|из-под|за|по|под|над|без|для|при|про|перед|через|между|после|около|возле|ради|и|а|но|да|не|ни|бы|же|ли))[ \t]+(?=\S|$)/giu;
  function polish(text) {
    return text
      .replace(shortWords, '$1\u00a0')
      .replace(/(?<=\S)[ \t]+([—–])[ \t]+(?=\S)/gu, ' $1\u00a0')
      .replace(/([—–])[ \t]+(?=\S)/gu, '$1\u00a0')
      .replace(/&[ \t]+(?=\S)/gu, '&\u00a0')
      .replace(/(?<=\p{L})-(?=\p{L})/gu, '\u2011')
      .replace(/(\d)[ \t]+(?=(?:мес\.|лет|года|год|сотрудник|участник|пункт|модул|материал|позици|подразделени))/giu, '$1\u00a0');
  }
  window.applyTypography = (root = document.body) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.parentElement?.closest('script,style,pre,code,textarea,svg')
          ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) walker.currentNode.textContent = polish(walker.currentNode.textContent);
  };
})();
