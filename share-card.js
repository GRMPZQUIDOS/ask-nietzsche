/* Carte de partage locale. Module préparé ; pas encore raccordé aux pages. */
(() => {
  'use strict';
  const labels = {
    fr: ['Partager un extrait', 'Votre question', 'Réponse générée par IA', 'Créer l’image', 'Télécharger', 'Fermer'],
    en: ['Share an excerpt', 'Your question', 'AI-generated answer', 'Create image', 'Download', 'Close'],
    de: ['Auszug teilen', 'Ihre Frage', 'KI-generierte Antwort', 'Bild erstellen', 'Herunterladen', 'Schließen'],
    es: ['Compartir un fragmento', 'Tu pregunta', 'Respuesta generada por IA', 'Crear imagen', 'Descargar', 'Cerrar'],
    zh: ['分享片段', '你的问题', 'AI生成的回答', '生成图片', '下载', '关闭'],
    ja: ['抜粋を共有', 'あなたの質問', 'AIが生成した回答', '画像を作成', 'ダウンロード', '閉じる']
  };
  const make = (tag, text) => { const el = document.createElement(tag); if (text) el.textContent = text; return el; };
  function wrap(ctx, text, width) {
    const lines = [];
    for (const paragraph of text.split('\n')) {
      let line = '';
      // Segmentation par graphèmes pour ne pas casser emoji ou caractères composés.
      const chars = typeof Intl.Segmenter === 'function'
        ? Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(paragraph), x => x.segment)
        : Array.from(paragraph);
      for (const char of chars) {
        if (line && ctx.measureText(line + char).width > width) { lines.push(line.trimEnd()); line = ''; }
        line += char;
      }
      lines.push(line);
    }
    return lines;
  }
  function open() {
    if (document.getElementById('nietzsche-share-dialog')) return;
    const lang = (document.documentElement.lang || 'en').split('-')[0];
    const t = labels[lang] || labels.en;
    const messages = Array.from(document.querySelectorAll('#chat-messages .msg'));
    const answer = messages.findLastIndex(el => el.classList.contains('msg-assistant'));
    const question = messages.slice(0, answer).findLast(el => el.classList.contains('msg-user'));
    if (answer < 0 || !question) return;
    const dialog = make('dialog'); dialog.id = 'nietzsche-share-dialog';
    Object.assign(dialog.style, { width: 'min(92vw,640px)', maxHeight: '90vh', padding: '24px', overflow: 'auto', borderRadius: '12px' });
    dialog.append(make('h2', t[0]));
    const q = make('textarea'), a = make('textarea');
    q.value = question.querySelector('.msg-bubble')?.textContent || '';
    a.value = messages[answer].querySelector('.msg-bubble')?.textContent || '';
    q.maxLength = 350; a.maxLength = 1000;
    q.value = q.value.slice(0, 350); a.value = a.value.slice(0, 1000);
    for (const [field, label] of [[q, t[1]], [a, t[2]]]) {
      const wrapper = make('label', label); field.rows = field === q ? 3 : 8;
      Object.assign(field.style, { display: 'block', width: '100%', margin: '8px 0 16px', font: 'inherit' });
      wrapper.append(field); dialog.append(wrapper);
    }
    const generate = make('button', t[3]), download = make('a', t[4]), close = make('button', t[5]);
    const preview = make('img'); preview.alt = t[0]; preview.style.width = '100%';
    download.hidden = true; download.download = 'ask-nietzsche.png';
    let objectURL;
    function invalidate() {
      if (objectURL) URL.revokeObjectURL(objectURL);
      objectURL = undefined; download.hidden = true; download.removeAttribute('href'); preview.removeAttribute('src');
    }
    q.oninput = a.oninput = invalidate;
    generate.onclick = async () => {
      invalidate(); generate.disabled = true;
      try {
        const canvas = make('canvas'); canvas.width = 1080;
        const ctx = canvas.getContext('2d'); ctx.font = '32px system-ui, sans-serif';
        const qLines = wrap(ctx, q.value, 936), aLines = wrap(ctx, a.value, 936);
        canvas.height = 390 + (qLines.length + aLines.length) * 46;
        ctx.fillStyle = '#f3eedf'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#252722'; ctx.font = 'bold 48px system-ui, sans-serif'; ctx.fillText('Ask Nietzsche', 72, 90);
        let y = 150;
        for (const [heading, lines] of [[t[1], qLines], [t[2], aLines]]) {
          ctx.font = 'bold 26px system-ui, sans-serif'; ctx.fillText(heading, 72, y); y += 46;
          ctx.font = '32px system-ui, sans-serif';
          for (const line of lines) { ctx.fillText(line, 72, y); y += 46; }
          y += 30;
        }
        ctx.font = '28px system-ui, sans-serif'; ctx.fillText('asknietzsche.com', 72, canvas.height - 56);
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        if (!blob || !dialog.isConnected) return;
        objectURL = URL.createObjectURL(blob); preview.src = objectURL; download.href = objectURL; download.hidden = false;
      } finally { generate.disabled = false; }
    };
    close.onclick = () => dialog.close();
    dialog.onclose = () => { invalidate(); dialog.remove(); };
    dialog.append(generate, document.createTextNode(' '), download, document.createTextNode(' '), close, preview);
    document.body.append(dialog); dialog.showModal();
  }
  window.NietzscheShareCard = Object.freeze({ open });
})();
