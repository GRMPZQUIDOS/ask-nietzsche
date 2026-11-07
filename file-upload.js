(() => {
  const strings = {
    fr: { add: 'Joindre un fichier', remove: 'Retirer', busy: 'Fichier sélectionné', ready: ' · transmis à Anthropic avec chaque question jusqu’à son retrait ; le site n’en conserve pas de copie.', unsupported: 'Format non pris en charge. Formats admis : PDF, TXT, MD, DOCX, JPG, PNG.', tooLarge: 'Le fichier doit faire 8 Mo maximum.', failed: 'Le fichier n’a pas pu être joint.', limited: 'Limite temporaire d’envoi atteinte.', pattern: 'Ossature appliquée' },
    en: { add: 'Attach a file', remove: 'Remove', busy: 'Selected file', ready: ' · sent to Anthropic with each question until removed; the site keeps no copy.', unsupported: 'Unsupported format. Accepted: PDF, TXT, MD, DOCX, JPG, PNG.', tooLarge: 'The file must be 8 MB or smaller.', failed: 'The file could not be attached.', limited: 'Temporary upload limit reached.', pattern: 'Structure applied' },
    de: { add: 'Datei anhängen', remove: 'Entfernen', busy: 'Datei ausgewählt', ready: ' · wird bis zum Entfernen mit jeder Frage an Anthropic gesendet; die Website speichert keine Kopie.', unsupported: 'Nicht unterstütztes Format. Erlaubt: PDF, TXT, MD, DOCX, JPG, PNG.', tooLarge: 'Die Datei darf höchstens 8 MB groß sein.', failed: 'Die Datei konnte nicht angehängt werden.', limited: 'Vorübergehendes Upload-Limit erreicht.', pattern: 'Angewandte Struktur' },
    es: { add: 'Adjuntar archivo', remove: 'Quitar', busy: 'Archivo seleccionado', ready: ' · se envía a Anthropic con cada pregunta hasta quitarlo; el sitio no guarda copias.', unsupported: 'Formato no admitido. Se aceptan: PDF, TXT, MD, DOCX, JPG, PNG.', tooLarge: 'El archivo debe pesar 8 MB como máximo.', failed: 'No se pudo adjuntar el archivo.', limited: 'Se alcanzó el límite temporal de carga.', pattern: 'Estructura aplicada' },
    zh: { add: '附加文件', remove: '移除', busy: '已选择文件', ready: ' · 移除前会随每个问题发送给 Anthropic；网站不保留副本。', unsupported: '不支持此格式。支持：PDF、TXT、MD、DOCX、JPG、PNG。', tooLarge: '文件不能超过 8 MB。', failed: '无法附加此文件。', limited: '已达到临时上传限制。', pattern: '已应用结构' },
    ja: { add: 'ファイルを添付', remove: '削除', busy: 'ファイルを選択しました', ready: ' · 削除するまで各質問と一緒にAnthropicへ送信されます。サイトにはコピーを保存しません。', unsupported: '未対応の形式です。PDF、TXT、MD、DOCX、JPG、PNGに対応しています。', tooLarge: 'ファイルは8 MB以下にしてください。', failed: 'ファイルを添付できませんでした。', limited: '一時アップロードの上限に達しました。', pattern: '適用した構成' }
  };
  const lang = (document.documentElement.lang || location.pathname.match(/index\.([a-z]{2})\.html/)?.[1] || 'en').toLowerCase().slice(0, 2);
  const t = strings[lang] || strings.en;
  let attachmentFile = null;
  let statusElement = null;
  let patternStatusElement = null;
  const nativeFetch = window.fetch.bind(window);

  // Attach the selected file only to the actual visitor chat turn, not to the
  // page's separate prompt-generation requests.
  window.fetch = (input, init = {}) => {
    const url = typeof input === 'string' ? input : input && input.url;
    let includedAttachment = false;
    let isChatTurn = false;
    if (url && new URL(url, location.href).pathname.endsWith('/api/chat.php') && typeof init.body === 'string') {
      try {
        const payload = JSON.parse(init.body);
        const lastMessage = payload.messages && payload.messages[payload.messages.length - 1];
        const visibleMessages = document.querySelectorAll('.msg-user .msg-bubble');
        const visibleQuestion = visibleMessages.length ? visibleMessages[visibleMessages.length - 1].textContent.trim() : '';
        if (lastMessage && lastMessage.role === 'user' && typeof lastMessage.content === 'string'
            && lastMessage.content.trim() === visibleQuestion) {
          isChatTurn = true;
          if (attachmentFile) {
            const form = new FormData();
            form.set('payload', JSON.stringify(payload));
            form.set('attachment', attachmentFile, attachmentFile.name);
            const headers = new Headers(init.headers || {});
            headers.delete('Content-Type');
            init = { ...init, headers, body: form };
            includedAttachment = true;
          }
        }
      } catch (_) {}
    }
    return nativeFetch(input, init).then(async response => {
      if (isChatTurn && response.ok && patternStatusElement) {
        try {
          const data = await response.clone().json();
          if (data.applied_pattern) {
            patternStatusElement.textContent = `${t.pattern}: ${data.applied_pattern.name} (${data.applied_pattern.id})`;
          }
        } catch (_) {}
      }
      if (includedAttachment && !response.ok && statusElement) {
        let message = t.failed;
        try {
          const data = await response.clone().json();
          if (data.error === 'Unsupported file type') message = t.unsupported;
          else if (data.error === 'File too large') message = t.tooLarge;
          else if (data.error === 'Attachment rate limit reached' || data.error === 'Too many requests') message = t.limited;
        } catch (_) {}
        statusElement.textContent = message;
        statusElement.dataset.state = 'error';
      }
      return response;
    });
  };

  function initialize() {
    const area = document.querySelector('.input-area');
    const hint = area && area.querySelector('.input-hint');
    if (!area || !hint || document.getElementById('nz-file-picker')) return;

    const style = document.createElement('style');
    style.textContent = `
      .nz-upload-row{display:flex;align-items:center;gap:.65rem;flex-wrap:wrap;margin:.45rem 0 0;font:inherit}
      .nz-upload-button,.nz-upload-remove{border:1px solid var(--border);border-radius:7px;background:transparent;color:var(--text-muted);padding:.35rem .6rem;cursor:pointer;font:inherit;font-size:.76rem}
      .nz-upload-button:hover,.nz-upload-remove:hover{border-color:var(--accent);color:var(--accent)}
      .nz-upload-button:disabled{opacity:.55;cursor:wait}
      .nz-upload-types{font-size:.74rem;color:var(--text-muted)}
      .nz-upload-status{font-size:.74rem;color:var(--text-muted);overflow-wrap:anywhere}
      .nz-upload-status[data-state="error"]{color:#b83228}
    `;
    document.head.appendChild(style);

    const row = document.createElement('div');
    row.className = 'nz-upload-row';
    const picker = document.createElement('input');
    picker.type = 'file';
    picker.id = 'nz-file-picker';
    picker.accept = '.pdf,.txt,.md,.docx,.jpg,.jpeg,.png,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png';
    picker.hidden = true;
    const add = document.createElement('button');
    add.type = 'button'; add.className = 'nz-upload-button'; add.textContent = '＋ ' + t.add;
    const types = document.createElement('span');
    types.className = 'nz-upload-types'; types.textContent = '.pdf, .txt, .md, .docx, .jpg, .jpeg, .png';
    const status = document.createElement('span');
    status.className = 'nz-upload-status'; status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
    statusElement = status;
    const patternStatus = document.createElement('span');
    patternStatus.className = 'nz-upload-status';
    patternStatus.setAttribute('role', 'status');
    patternStatusElement = patternStatus;
    row.append(picker, add, types, status, patternStatus);
    area.insertBefore(row, hint);

    let remove = null;
    function clearView() {
      status.textContent = '';
      status.removeAttribute('data-state');
      if (remove) { remove.remove(); remove = null; }
    }
    function showRemove() {
      if (remove) return;
      remove = document.createElement('button');
      remove.type = 'button'; remove.className = 'nz-upload-remove'; remove.textContent = t.remove;
      remove.addEventListener('click', () => {
        attachmentFile = null;
        picker.value = '';
        clearView();
      });
      row.appendChild(remove);
    }

    add.addEventListener('click', () => picker.click());
    picker.addEventListener('change', () => {
      const file = picker.files && picker.files[0];
      if (!file) return;
      clearView();
      if (file.size > 8 * 1024 * 1024) {
        attachmentFile = null; picker.value = '';
        status.textContent = t.tooLarge; status.dataset.state = 'error'; return;
      }
      const accepted = /\.(pdf|txt|md|docx|jpe?g|png)$/i.test(file.name);
      if (!accepted) {
        attachmentFile = null; picker.value = '';
        status.textContent = t.unsupported; status.dataset.state = 'error'; return;
      }
      attachmentFile = file;
      status.textContent = `${t.busy}: ${file.name}${t.ready}`;
      showRemove();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
