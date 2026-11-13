(() => {
  'use strict';

  const lang = (document.documentElement.lang || 'en').toLowerCase().slice(0, 2);
  const developerMode = new URLSearchParams(window.location.search).get('mode') === 'developer';
  const COPY = {
    fr: { version:'V2.1', landingTitle:'Bienvenue, je suis Paul', landingText:'Merci de l’intérêt que vous portez à la pensée de Nietzsche. Je m’appelle Paul et j’organise les nombreuses demandes qui lui parviennent, afin qu’il puisse examiner chaque question et y répondre le mieux possible. Formulez une question qui vous importe et qui mérite d’être approfondie, ou joignez un texte, un écrit ou un livre que vous souhaitez lui soumettre. Votre document peut être examiné dès maintenant. Si votre proposition a besoin d’être précisée, je vous dirai comment la reprendre; vous pourrez revenir quand vous le souhaitez.', input:'Votre question approfondie ou votre texte / livre…', analyze:'Paul examine votre proposition…', error:'La chaîne V2.1 n’a pas pu aboutir', meanings:'Lignes de sens', pattern:'Pattern choisi', reason:'Pourquoi ce pattern', answer:'Réponse de Nietzsche', reception:'Accueil de Paul', comment:'Commenter cette étape', send:'Publier le commentaire', name:'Nom (facultatif)', placeholder:'Votre commentaire…', public:'Ce commentaire sera public. Ne partagez pas de contenu privé.', consent:'Je confirme la publication publique de mon commentaire.', comments:'Commentaires de la communauté', loading:'Chargement…', empty:'Aucun commentaire pour le moment.', saved:'Commentaire publié.', failed:'Le commentaire n’a pas pu être publié.', analysis:'Analyser les commentaires par IA', close:'Je vous remercie de votre visite. Il me faut maintenant m’arrêter : une terrible migraine me prend toute la tête.', closed:'Session terminée : Nietzsche ne peut plus recevoir de relance.', noPattern:'Pattern de la banque', gast:'Paul' },
    en: { version:'V2.1', landingTitle:'Welcome, I’m Paul', landingText:'Thank you for your interest in Nietzsche’s thought. My name is Paul, and I organize the many requests he receives so he can consider each question and answer as well as possible. Ask a question that matters to you and deserves deeper thought, or attach a text, essay, or book for him to examine. Your document can be reviewed right away. If your proposal needs more work, I’ll explain how to develop it; you can return whenever you wish.', input:'Your thoughtful question or text / book…', analyze:'Paul is considering your proposal…', error:'The V2.1 workflow could not complete', meanings:'Lines of meaning', pattern:'Selected pattern', reason:'Why this pattern', answer:'Nietzsche’s reply', reception:'Paul welcomes you', comment:'Comment on this step', send:'Publish comment', name:'Name (optional)', placeholder:'Your comment…', public:'This comment will be public. Do not share private material.', consent:'I agree to publish this comment publicly.', comments:'Community comments', loading:'Loading…', empty:'No comments yet.', saved:'Comment published.', failed:'The comment could not be published.', analysis:'Analyze community comments with AI', close:'Thank you for your visit. I must stop now: a terrible migraine is taking hold of my whole head.', closed:'Session ended: Nietzsche cannot receive a follow-up.', noPattern:'Pattern from the bank', gast:'Paul' },
    de: { version:'V2.1', landingTitle:'Willkommen, ich bin Paul', landingText:'Vielen Dank für Ihr Interesse an Nietzsches Denken. Mein Name ist Paul. Ich ordne die vielen Anfragen, die ihn erreichen, damit er jede Frage prüfen und so gut wie möglich beantworten kann. Stellen Sie eine Frage, die Ihnen wichtig ist und vertieft werden sollte, oder fügen Sie einen Text, Aufsatz oder ein Buch zur Prüfung bei. Ihr Dokument kann sofort bearbeitet werden. Wenn Ihr Vorschlag noch ausgearbeitet werden muss, erkläre ich Ihnen, wie Sie ihn weiterentwickeln können; Sie können jederzeit zurückkommen.', input:'Ihre vertiefte Frage oder Text / Buch…', analyze:'Paul prüft Ihren Vorschlag…', error:'Der V2.1-Ablauf konnte nicht abgeschlossen werden', meanings:'Sinnlinien', pattern:'Ausgewähltes Muster', reason:'Warum dieses Muster', answer:'Nietzsches Antwort', reception:'Paul empfängt Sie', comment:'Diesen Schritt kommentieren', send:'Kommentar veröffentlichen', name:'Name (optional)', placeholder:'Dein Kommentar…', public:'Dieser Kommentar wird öffentlich sein. Teile keine privaten Inhalte.', consent:'Ich stimme der öffentlichen Veröffentlichung dieses Kommentars zu.', comments:'Kommentare der Gemeinschaft', loading:'Wird geladen…', empty:'Noch keine Kommentare.', saved:'Kommentar veröffentlicht.', failed:'Der Kommentar konnte nicht veröffentlicht werden.', analysis:'Gemeinschaftskommentare mit KI analysieren', close:'Danke für Ihren Besuch. Ich muss jetzt aufhören: Eine schreckliche Migräne erfasst meinen ganzen Kopf.', closed:'Gespräch beendet: Nietzsche kann keine Rückfrage mehr erhalten.', noPattern:'Muster aus der Bank', gast:'Paul' },
    es: { version:'V2.1', landingTitle:'Bienvenido, soy Paul', landingText:'Gracias por tu interés en el pensamiento de Nietzsche. Me llamo Paul y organizo las numerosas solicitudes que recibe para que pueda examinar cada pregunta y responder lo mejor posible. Formula una pregunta que te importe y merezca profundizarse, o adjunta un texto, ensayo o libro para que lo examine. Tu documento puede revisarse ahora mismo. Si tu propuesta necesita desarrollarse, te explicaré cómo retomarla; puedes volver cuando quieras.', input:'Tu pregunta profunda o texto / libro…', analyze:'Paul está examinando tu propuesta…', error:'No se pudo completar el flujo V2.1', meanings:'Líneas de sentido', pattern:'Patrón elegido', reason:'Por qué este patrón', answer:'Respuesta de Nietzsche', reception:'Paul te recibe', comment:'Comentar esta etapa', send:'Publicar comentario', name:'Nombre (opcional)', placeholder:'Tu comentario…', public:'Este comentario será público. No compartas contenido privado.', consent:'Acepto que este comentario se publique públicamente.', comments:'Comentarios de la comunidad', loading:'Cargando…', empty:'Aún no hay comentarios.', saved:'Comentario publicado.', failed:'No se pudo publicar el comentario.', analysis:'Analizar comentarios de la comunidad con IA', close:'Gracias por tu visita. Debo detenerme ahora: una terrible migraña me toma toda la cabeza.', closed:'Sesión terminada: Nietzsche no puede recibir más preguntas.', noPattern:'Patrón de la biblioteca', gast:'Paul' },
    ja: { version:'V2.1', landingTitle:'ようこそ、私はポールです', landingText:'ニーチェの思想に関心を寄せてくださり、ありがとうございます。私はポールです。彼に届く多くの依頼を整理し、一つ一つの問いを検討して最善の答えを返せるよう手助けしています。深く考える価値のある問いをお寄せいただくか、検討してほしい文章や本を添付してください。文書はすぐに確認できます。提案をさらに練る必要があれば、その進め方をお伝えします。いつでもお戻りください。', input:'深めたい質問、または文章・本…', analyze:'ポールが提案を検討しています…', error:'V2.1の処理を完了できませんでした', meanings:'意味の線', pattern:'選ばれたパターン', reason:'このパターンを選んだ理由', answer:'ニーチェの返答', reception:'ポールの受付', comment:'この段階にコメント', send:'コメントを公開', name:'名前（任意）', placeholder:'コメント…', public:'このコメントは公開されます。私的な内容は書かないでください。', consent:'このコメントを公開することに同意します。', comments:'コミュニティのコメント', loading:'読み込み中…', empty:'まだコメントはありません。', saved:'コメントを公開しました。', failed:'コメントを公開できませんでした。', analysis:'コミュニティのコメントをAIで分析', close:'お越しいただき感謝します。もう終わりにしなければなりません。ひどい頭痛が頭全体を襲っています。', closed:'セッション終了：ニーチェはこれ以上の質問を受け付けません。', noPattern:'パターン・バンク', gast:'ポール' },
    zh: { version:'V2.1', landingTitle:'欢迎，我是保罗', landingText:'感谢你对尼采思想的关注。我叫保罗，负责整理他收到的大量请求，让他能够认真审视每个问题并尽可能作出最好的回答。请提出一个对你重要、值得深入思考的问题，或附上希望交给他审阅的文章、文字或书籍。你的文档可以立即开始审阅。如果你的提议还需要进一步发展，我会告诉你如何继续；你随时可以回来。', input:'值得深入的问题，或文章 / 书籍…', analyze:'保罗正在审视你的提议…', error:'V2.1处理流程未能完成', meanings:'意义线索', pattern:'选定的模式', reason:'选择此模式的原因', answer:'尼采的回答', reception:'保罗接待你', comment:'评论此步骤', send:'发布评论', name:'姓名（可选）', placeholder:'你的评论…', public:'此评论将公开。请勿分享私人内容。', consent:'我同意公开发布此评论。', comments:'社区评论', loading:'正在加载…', empty:'暂时还没有评论。', saved:'评论已发布。', failed:'无法发布评论。', analysis:'用AI分析社区评论', close:'感谢你的来访。我现在必须停下：一场可怕的偏头痛正攫住我的整个头部。', closed:'会话结束：尼采不会再接受追问。', noPattern:'模式库中的模式', gast:'保罗' }
  };
  const t = COPY[lang] || COPY.en;
  const ACTION_COPY = {
    fr:{pdf:'PDF',copy:'Copier',copied:'Réponse copiée.',comment:'Commenter',explain:'Raisonnement',title:'Parcours de pensée',close:'Fermer',intro:'Ce parcours résume les étapes documentées, la mécanique sélectionnée et les passages cités pour construire cette réponse. Il ne prétend pas révéler un raisonnement intérieur privé.',accepted:'Question retenue par Nietzsche',meaning:'Désossage · lignes de sens',pattern:'Bibliothèque de patterns',why:'Raison du choix',rag:'RAG · recherche dans les textes',ragCited:'Passages du corpus retrouvés et cités',ragNone:'Aucun passage pertinent n’a été retrouvé pour cette réponse.',ragNotCited:'Des passages ont été retrouvés, mais aucun n’a été cité dans la réponse.',ragUnavailable:'Aucun résultat RAG n’est disponible pour cette réponse.',coverage:'Corpus sélectionné : 5 180 passages issus de 15 œuvres ou éditions, en français, allemand et anglais. Il ne couvre pas l’intégralité de l’œuvre de Nietzsche. La recherche plein texte peut aussi manquer des passages pertinents.',draft:'Réponse de Nietzsche',draftText:'La réponse ci-dessous résulte de la mécanique retenue et des sources citées.',noData:'Le détail de cette étape n’a pas été conservé pour cette réponse.',popup:'La fenêtre d’impression a été bloquée par le navigateur.',githubTitle:'Retour sur Ask Nietzsche',githubBody:'Mon commentaire sur Ask Nietzsche :\n\n[Écrivez votre commentaire ici]\n\nCe retour sera public sur GitHub. Ne partagez aucune information privée.'},
    en:{pdf:'PDF',copy:'Copy',copied:'Reply copied.',comment:'Comment',explain:'Algorithm explanation',title:'How this reply was assembled',close:'Close',intro:'This view shows the system’s stages and inputs; it does not claim to reveal hidden internal reasoning.',accepted:'Question selected by Nietzsche',meaning:'Meaning lines',pattern:'Pattern library',why:'Selection reason',rag:'RAG · search in the writings',ragCited:'Corpus passages found and cited',ragNone:'No relevant passage was found for this reply.',ragNotCited:'Passages were retrieved, but none were cited in the reply.',ragUnavailable:'No RAG result is available for this reply.',coverage:'Selected corpus: 5,180 passages from 15 selected work or edition records, in French, German, and English. It does not cover Nietzsche’s complete works. Full-text search can also miss relevant passages.',draft:'Drafting',draftText:'The selected pattern guides the response structure; retrieved RAG passages can provide textual references.',noData:'Details for this stage were not retained for this reply.',popup:'The print window was blocked by your browser.',githubTitle:'Feedback on Ask Nietzsche',githubBody:'My comment on Ask Nietzsche:\n\n[Write your comment here]\n\nThis feedback will be public on GitHub. Do not share private information.'},
    de:{pdf:'PDF',copy:'Kopieren',copied:'Antwort kopiert.',comment:'Kommentieren',explain:'Erklärung des Algorithmus',title:'Wie diese Antwort entstanden ist',close:'Schließen',intro:'Diese Ansicht zeigt die Schritte und verwendeten Elemente; sie gibt keine verborgenen inneren Gedankengänge wieder.',accepted:'Frage von Nietzsche ausgewählt',meaning:'Sinnlinien',pattern:'Musterbibliothek',why:'Grund der Auswahl',rag:'RAG · Suche in den Schriften',ragCited:'Gefundene und zitierte Korpusstellen',ragNone:'Für diese Antwort wurde keine relevante Passage gefunden.',ragNotCited:'Passagen wurden gefunden, aber in der Antwort nicht zitiert.',ragUnavailable:'Für diese Antwort liegt kein RAG-Ergebnis vor.',coverage:'Ausgewähltes Korpus: 5.180 Passagen aus 15 ausgewählten Werk- oder Editionsdatensätzen auf Französisch, Deutsch und Englisch. Es umfasst nicht Nietzsches Gesamtwerk. Die Volltextsuche kann relevante Stellen übersehen.',draft:'Ausarbeitung',draftText:'Das gewählte Muster leitet den Aufbau; gefundene RAG-Passagen können Textbelege liefern.',noData:'Die Details dieses Schritts wurden für diese Antwort nicht gespeichert.',popup:'Das Druckfenster wurde vom Browser blockiert.',githubTitle:'Feedback zu Ask Nietzsche',githubBody:'Mein Kommentar zu Ask Nietzsche:\n\n[Kommentar hier schreiben]\n\nDieses Feedback wird öffentlich auf GitHub veröffentlicht. Teilen Sie keine privaten Informationen.'},
    es:{pdf:'PDF',copy:'Copiar',copied:'Respuesta copiada.',comment:'Comentar',explain:'Explicación del algoritmo',title:'Cómo se elaboró esta respuesta',close:'Cerrar',intro:'Esta vista muestra las etapas y los elementos utilizados; no pretende revelar razonamientos internos ocultos.',accepted:'Pregunta seleccionada por Nietzsche',meaning:'Líneas de sentido',pattern:'Biblioteca de patrones',why:'Motivo de la selección',rag:'RAG · búsqueda en los escritos',ragCited:'Pasajes del corpus encontrados y citados',ragNone:'No se encontró ningún pasaje pertinente para esta respuesta.',ragNotCited:'Se encontraron pasajes, pero no se citaron en la respuesta.',ragUnavailable:'No hay resultados RAG disponibles para esta respuesta.',coverage:'Corpus seleccionado: 5.180 pasajes de 15 registros de obras o ediciones, en francés, alemán e inglés. No abarca la obra completa de Nietzsche. La búsqueda de texto completo también puede pasar por alto pasajes pertinentes.',draft:'Redacción',draftText:'El patrón elegido guía la estructura; los pasajes RAG recuperados pueden aportar referencias textuales.',noData:'No se conservaron los detalles de esta etapa para esta respuesta.',popup:'El navegador bloqueó la ventana de impresión.',githubTitle:'Comentario sobre Ask Nietzsche',githubBody:'Mi comentario sobre Ask Nietzsche:\n\n[Escriba aquí su comentario]\n\nEste comentario será público en GitHub. No comparta información privada.'},
    ja:{pdf:'PDF',copy:'コピー',copied:'回答をコピーしました。',comment:'コメント',explain:'アルゴリズムの説明',title:'この回答が作られた過程',close:'閉じる',intro:'ここでは処理段階と使用した情報を示します。隠れた内部思考を明かすものではありません。',accepted:'ニーチェが質問を選定',meaning:'意味の整理',pattern:'パターン・ライブラリ',why:'選択理由',rag:'RAG · 著作の検索',ragCited:'検索され、回答で引用された文章',ragNone:'この回答に関連する文章は見つかりませんでした。',ragNotCited:'文章は見つかりましたが、回答では引用されませんでした。',ragUnavailable:'この回答のRAG検索結果はありません。',coverage:'選択されたコーパス：フランス語・ドイツ語・英語の15件の著作／版データからなる5,180件の文章です。ニーチェの全著作を網羅していません。全文検索では関連箇所を見落とすこともあります。',draft:'回答の作成',draftText:'選ばれたパターンが回答の構成を導き、RAGで見つかった文章が参照情報になります。',noData:'この回答ではこの段階の詳細は保存されていません。',popup:'印刷ウィンドウがブラウザーにブロックされました。',githubTitle:'Ask Nietzscheへのコメント',githubBody:'Ask Nietzscheへのコメント：\n\n[ここにコメントを入力]\n\nこのコメントはGitHubで公開されます。個人情報を書かないでください。'},
    zh:{pdf:'PDF',copy:'复制',copied:'已复制回答。',comment:'评论',explain:'算法说明',title:'这条回答是如何生成的',close:'关闭',intro:'此处展示处理步骤和使用的信息，不代表披露隐藏的内部思维过程。',accepted:'尼采选中了这个问题',meaning:'意义线索',pattern:'模式库',why:'选择原因',rag:'RAG · 检索尼采著作',ragCited:'检索到并在回答中引用的语料段落',ragNone:'未找到与此回答相关的段落。',ragNotCited:'检索到段落，但回答没有引用。',ragUnavailable:'此回答没有可用的RAG结果。',coverage:'选定语料：法语、德语和英语的15条作品或版本记录，共5,180段。它并未涵盖尼采的全部作品。全文检索也可能漏掉相关段落。',draft:'撰写回答',draftText:'所选模式引导回答结构；RAG检索到的段落可提供文本依据。',noData:'此回答未保存这一步的详细信息。',popup:'浏览器阻止了打印窗口。',githubTitle:'对 Ask Nietzsche 的反馈',githubBody:'我对 Ask Nietzsche 的评论：\n\n[在此输入评论]\n\n此反馈将在 GitHub 上公开。请勿分享私人信息。'}
  };
  const a = ACTION_COPY[lang] || ACTION_COPY.en;
  const ragFlow = ({fr:'La recherche part de votre question; les passages retrouvés rejoignent la rédaction finale.',en:'The search starts from your question; retrieved passages join the final drafting stage.',de:'Die Suche beginnt mit Ihrer Frage; gefundene Stellen fließen erst in die endgültige Ausarbeitung ein.',es:'La búsqueda parte de su pregunta; los pasajes encontrados se incorporan a la redacción final.',ja:'検索はご質問から始まり、見つかった文章は最終的な回答の作成段階で使われます。',zh:'检索从您的问题开始；找到的段落只在最终撰写阶段加入。'})[lang] || 'The search starts from your question; retrieved passages join the final drafting stage.';
  const copyFailure = ({fr:'La copie a échoué.',en:'Copy failed.',de:'Kopieren fehlgeschlagen.',es:'No se pudo copiar.',ja:'コピーできませんでした。',zh:'复制失败。'})[lang] || 'Copy failed.';
  const releaseLabel = ({fr:'V2.1 · novembre 2026',en:'V2.1 · November 2026',de:'V2.1 · November 2026',es:'V2.1 · noviembre de 2026',ja:'V2.1 · 2026年11月',zh:'V2.1 · 2026年11月'})[lang] || 'V2.1 · November 2026';
  const PAUL_CLOSING = {
    fr: 'Je dois mettre un terme à cette séance : Nietzsche ne peut plus recevoir de relance. Une terrible migraine lui prend toute la tête. Je vous remercie de votre compréhension.',
    en: 'I must bring this session to an end: Nietzsche can no longer receive follow-up questions. A terrible migraine is taking hold of his whole head. Thank you for understanding.',
    de: 'Ich muss dieses Gespräch beenden: Nietzsche kann keine weiteren Fragen mehr entgegennehmen. Eine schreckliche Migräne erfasst seinen ganzen Kopf. Ich danke Ihnen für Ihr Verständnis.',
    es: 'Debo poner fin a esta sesión: Nietzsche ya no puede recibir más preguntas. Una migraña terrible le toma toda la cabeza. Gracias por su comprensión.',
    ja: 'このセッションはここで終えなければなりません。ニーチェはこれ以上の問いを受けることができません。ひどい偏頭痛が頭全体を襲っています。ご理解に感謝します。',
    zh: '我必须结束这次会面：尼采无法再接受追问。一场可怕的偏头痛正攫住他的整个头部。感谢您的理解。'
  };
  t.close = PAUL_CLOSING[lang] || PAUL_CLOSING.en;
  const ONBOARDING = {
    fr: {
      landingTitle:'', landingText:'', openingInput:'Que souhaitez-vous lui dire ?', greeting:'Bonjour, quels sont les types de questions que je peux poser à Nietzsche ?', sendAction:'Envoyer',
      input:'Formulez votre question et/ou joignez un texte ou un livre…', openingAttachment:'J’ai joint un document pour Nietzsche.',
      attachmentQuestion:'Veuillez examiner le document joint.', next:'Next', paul:'Paul Rée', acceptedNotice:'Je transmets à Monsieur Nietzsche.',
      welcomeParts:[
        'Merci de votre intérêt pour la pensée de Nietzsche. Mon nom complet est Paul Ludwig Carl Heinrich Rée; Nietzsche me connaissait sous le nom de Paul Rée.',
        'Nietzsche reçoit beaucoup de demandes. Je les organise afin qu’il puisse examiner chaque question et y répondre le mieux possible.',
        'Que souhaitez-vous lui dire? Écrivez ce que vous voulez pour commencer. Ensuite, vous pouvez formuler une question qui mérite d’être approfondie, ou joindre un texte, un écrit ou un livre. Votre document peut être examiné dès maintenant. Si votre proposition demande encore du travail, je vous aiderai à la préciser; vous pourrez revenir quand vous le souhaiterez.'
      ]
    },
    en: {
      landingTitle:'', landingText:'', openingInput:'What would you like to say to Nietzsche?', greeting:'Hello, what kinds of questions can I ask Nietzsche?', sendAction:'Send',
      input:'Ask your question and/or attach a text or book…', openingAttachment:'I have attached a document for Nietzsche.',
      attachmentQuestion:'Please examine the attached document.', next:'Next', paul:'Paul Rée', acceptedNotice:'I am passing this on to Herr Nietzsche.',
      welcomeParts:[
        'Thank you for your interest in Nietzsche’s thought. My full name is Paul Ludwig Carl Heinrich Rée; Nietzsche knew me as Paul Rée.',
        'Nietzsche receives many requests. I organize them so he can consider each question and answer as well as possible.',
        'What would you like to say to Nietzsche? You may begin with a few words. Then you may ask a question that matters to you and deserves deeper thought, or attach a text, essay, or book for him to examine. Your document can be reviewed right away. If your proposal needs more work, I will explain how to develop it; you may return whenever you wish.'
      ]
    },
    de: {
      landingTitle:'', landingText:'', openingInput:'Was möchten Sie Nietzsche sagen?', greeting:'Guten Tag, welche Arten von Fragen kann ich Nietzsche stellen?', sendAction:'Senden',
      input:'Formulieren Sie Ihre Frage und/oder fügen Sie einen Text oder ein Buch bei…', openingAttachment:'Ich habe ein Dokument für Nietzsche angehängt.',
      attachmentQuestion:'Bitte prüfen Sie das angehängte Dokument.', next:'Next', paul:'Paul Rée', acceptedNotice:'Ich gebe es an Herrn Nietzsche weiter.',
      welcomeParts:[
        'Danke für Ihr Interesse an Nietzsches Denken. Mein vollständiger Name ist Paul Ludwig Carl Heinrich Rée; Nietzsche kannte mich als Paul Rée.',
        'Nietzsche erhält viele Anfragen. Ich ordne sie, damit er jede Frage prüfen und so gut wie möglich beantworten kann.',
        'Was möchten Sie Nietzsche sagen? Schreiben Sie zunächst einfach, was Ihnen in den Sinn kommt. Danach können Sie eine Frage stellen, die vertieftes Nachdenken verdient, oder einen Text, Aufsatz oder ein Buch zur Prüfung anhängen. Ihr Dokument kann sofort geprüft werden. Wenn Ihr Vorschlag noch ausgearbeitet werden muss, erkläre ich Ihnen, wie; Sie können jederzeit zurückkommen.'
      ]
    },
    es: {
      landingTitle:'', landingText:'', openingInput:'¿Qué desea decirle a Nietzsche?', greeting:'Hola, ¿qué tipo de preguntas puedo hacerle a Nietzsche?', sendAction:'Enviar',
      input:'Formule su pregunta y/o adjunte un texto o un libro…', openingAttachment:'He adjuntado un documento para Nietzsche.',
      attachmentQuestion:'Por favor, examine el documento adjunto.', next:'Next', paul:'Paul Rée', acceptedNotice:'Se lo paso al señor Nietzsche.',
      welcomeParts:[
        'Gracias por su interés en el pensamiento de Nietzsche. Mi nombre completo es Paul Ludwig Carl Heinrich Rée; Nietzsche me conocía como Paul Rée.',
        'Nietzsche recibe muchas solicitudes. Las organizo para que pueda examinar cada pregunta y responder lo mejor posible.',
        '¿Qué desea decirle a Nietzsche? Escriba lo que desee para empezar. Después puede formular una pregunta que merezca profundizarse o adjuntar un texto, ensayo o libro para que lo examine. Su documento puede revisarse de inmediato. Si su propuesta necesita más trabajo, le explicaré cómo desarrollarla; puede volver cuando quiera.'
      ]
    },
    ja: {
      landingTitle:'', landingText:'', openingInput:'ニーチェに何を伝えたいですか？', greeting:'こんにちは。ニーチェにはどのような質問をできますか？', sendAction:'送信',
      input:'ご質問を入力するか、文章・本を添付してください…', openingAttachment:'ニーチェに読んでもらう文書を添付しました。',
      attachmentQuestion:'添付した文書をお読みください。', next:'Next', paul:'Paul Rée', acceptedNotice:'ニーチェ先生にお渡しします。',
      welcomeParts:[
        'ニーチェの思想に関心をお寄せくださり、ありがとうございます。私の正式な名前は Paul Ludwig Carl Heinrich Rée です。ニーチェは私を Paul Rée と呼んでいました。',
        'ニーチェには多くの依頼が届きます。彼が一つ一つの問いを検討し、できるだけよい答えを返せるよう、私が整理しています。',
        'ニーチェに何をお伝えになりたいですか？まずは思いつくままにお書きください。そのあと、深く考える価値のある問いを立てるか、読んでほしい文章や本を添付していただけます。文書はすぐに検討できます。提案をさらに練る必要があれば、その方法をお伝えします。いつでもお戻りください。'
      ]
    },
    zh: {
      landingTitle:'', landingText:'', openingInput:'您想对尼采说什么？', greeting:'你好，我可以向尼采提出哪些类型的问题？', sendAction:'发送',
      input:'请提出您的问题，也可以附上文章或书籍…', openingAttachment:'我已附上一份想请尼采阅读的文件。',
      attachmentQuestion:'请阅读并审视这份附件。', next:'Next', paul:'Paul Rée', acceptedNotice:'我这就转交给尼采先生。',
      welcomeParts:[
        '感谢您对尼采思想的关注。我的全名是 Paul Ludwig Carl Heinrich Rée；尼采称我为 Paul Rée。',
        '尼采收到许多请求。我负责整理这些请求，让他能够认真审视每个问题并尽可能作出最好的回答。',
        '您想对尼采说什么？请先把想到的内容写下来。之后，您可以提出一个值得深入思考的问题，或附上文章、短文或书籍供他审阅。文件可以立即开始审阅。如果您的提议还需要进一步发展，我会告诉您如何继续；您随时可以回来。'
      ]
    }
  };
  Object.assign(t, ONBOARDING[lang] || ONBOARDING.en);
  const pageLimitNotice = {
    fr:'Nous avons fixé une limite de 300 pages par document, pour ne pas faire exploser le cerveau de Nietzsche.',
    en:'We have set a limit of 300 pages per document so Nietzsche’s brain does not explode.',
    de:'Wir haben eine Grenze von 300 Seiten pro Dokument festgelegt, damit Nietzsches Gehirn nicht explodiert.',
    es:'Hemos fijado un límite de 300 páginas por documento para que no le explote el cerebro a Nietzsche.',
    ja:'ニーチェの頭がパンクしないよう、文書の上限を300ページに決めました。',
    zh:'我们规定每份文件最多 300 页，以免把尼采的脑子撑爆。'
  }[lang] || 'We have set a limit of 300 pages per document so Nietzsche’s brain does not explode.';
  t.landingText += ' ' + pageLimitNotice;
  if (Array.isArray(t.welcomeParts) && t.welcomeParts[2]) t.welcomeParts[2] += ' ' + pageLimitNotice;
  t.version = 'V2.0';
  t.error = ({fr:'Paul ne peut pas poursuivre le dialogue.',en:'Paul could not continue the conversation.',de:'Paul konnte den Dialog nicht fortsetzen.',es:'Paul no pudo continuar el diálogo.',ja:'ポールは会話を続けられませんでした。',zh:'保罗无法继续对话。'})[lang] || 'Paul could not continue the conversation.';
  let sessionClosed = false;
  let welcomeComplete = false;
  // Visiteur qui revient : Paul ne refait pas son accueil en trois bulles,
  // il reconnaît la personne (par son prénom si elle est connectée).
  const WELCOMED_KEY = 'ask_nietzsche_welcomed';
  const RETURNING = {
    fr:{named:'Bonjour {name}, je suis heureux de vous revoir. Que souhaitez-vous soumettre à Nietzsche aujourd’hui ? Une question qui mérite d’être approfondie, ou un texte, un écrit, un livre.', anon:'Bonjour, je suis heureux de vous revoir. Que souhaitez-vous soumettre à Nietzsche aujourd’hui ? Une question qui mérite d’être approfondie, ou un texte, un écrit, un livre.'},
    en:{named:'Hello {name}, I’m glad to see you again. What would you like to submit to Nietzsche today? A question that deserves deeper thought, or a text, an essay, a book.', anon:'Hello, I’m glad to see you again. What would you like to submit to Nietzsche today? A question that deserves deeper thought, or a text, an essay, a book.'},
    de:{named:'Guten Tag {name}, ich freue mich, Sie wiederzusehen. Was möchten Sie Nietzsche heute vorlegen? Eine Frage, die es verdient, vertieft zu werden, oder einen Text, eine Schrift, ein Buch.', anon:'Guten Tag, ich freue mich, Sie wiederzusehen. Was möchten Sie Nietzsche heute vorlegen? Eine Frage, die es verdient, vertieft zu werden, oder einen Text, eine Schrift, ein Buch.'},
    es:{named:'Hola, {name}, me alegra volver a verle. ¿Qué desea presentar hoy a Nietzsche? Una pregunta que merezca profundizarse, o un texto, un escrito, un libro.', anon:'Hola, me alegra volver a verle. ¿Qué desea presentar hoy a Nietzsche? Una pregunta que merezca profundizarse, o un texto, un escrito, un libro.'},
    ja:{named:'{name}さん、こんにちは。またお会いできてうれしいです。今日はニーチェに何をお見せになりますか？ じっくり考える価値のある問い、あるいは文章、論考、本をどうぞ。', anon:'こんにちは。またお会いできてうれしいです。今日はニーチェに何をお見せになりますか？ じっくり考える価値のある問い、あるいは文章、論考、本をどうぞ。'},
    zh:{named:'{name}，您好，很高兴再次见到您。今天您想向尼采提交什么？一个值得深入思考的问题，或者一篇文章、一部作品、一本书。', anon:'您好，很高兴再次见到您。今天您想向尼采提交什么？一个值得深入思考的问题，或者一篇文章、一部作品、一本书。'}
  };
  function markWelcomed() { try { localStorage.setItem(WELCOMED_KEY, '1'); } catch (_) {} }
  function hasBeenWelcomed() { try { return localStorage.getItem(WELCOMED_KEY) === '1'; } catch (_) { return false; } }
  function readStoredUser() { try { return JSON.parse(localStorage.getItem('ask_nietzsche_user') || 'null'); } catch (_) { return null; } }
  function firstNameOf(user) {
    if (!user || user.guest) return '';
    const first = String(user.name || '').trim().split(/\s+/)[0] || '';
    // Nom dérivé d'une adresse e-mail (ex. « jean.dupont ») : pas de prénom fiable.
    if (!first || /[@._\d]/.test(first) || first.length > 40) return '';
    return first;
  }
  async function waitForUser(maxMs) {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
      if (document.readyState === 'complete' && readStoredUser()) return readStoredUser();
      await new Promise(r => setTimeout(r, 150));
    }
    return readStoredUser();
  }
  async function presentReturningWelcome() {
    const user = await waitForUser(3000);
    if (welcomeComplete) return;
    const copy = RETURNING[lang] || RETURNING.en;
    const name = firstNameOf(user);
    const text = name ? copy.named.replace('{name}', name) : copy.anon;
    welcomeComplete = true;
    document.querySelector('.layout')?.classList.add('has-messages');
    const message = appendMessage('paul', esc(text));
    message.dataset.speaker = 'paul';
    const label = message.querySelector('.msg-label');
    if (label) label.textContent = t.paul;
    setComposerVisible(true);
    const input = document.getElementById('user-input');
    const send = document.getElementById('send-btn');
    if (input) { input.placeholder = t.input; input.readOnly = false; input.value = ''; input.style.height = 'auto'; input.focus(); }
    document.querySelectorAll('.nz-upload-button,.nz-upload-remove,#nz-file-picker').forEach(el => { el.disabled = false; });
    if (send) send.disabled = false;
  }

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function setComposerVisible(visible) {
    const composer = document.querySelector('.input-area');
    if (composer) {
      composer.hidden = !visible;
      composer.style.display = visible ? '' : 'none';
    }
  }
  function addStyles() {
    if (document.getElementById('v21-style')) return;
    const style = document.createElement('style'); style.id = 'v21-style';
    style.textContent = `
      .v21-version{display:block;margin:-.42rem 0 .55rem;color:var(--text-muted);font:400 .62rem/1.2 'DM Sans',sans-serif;letter-spacing:.14em;text-transform:uppercase;opacity:.74}
      .v21-workflow{margin:0 0 1.2rem;padding:.85rem 1rem;border:1px solid var(--border);border-radius:10px;background:color-mix(in srgb,var(--surface,#fff) 88%,transparent);font:400 .84rem/1.55 'DM Sans',sans-serif;color:var(--text-secondary)}
      .v21-workflow h3{margin:0 0 .4rem;font:500 .72rem/1.3 'DM Sans',sans-serif;letter-spacing:.09em;text-transform:uppercase;color:var(--text-muted)}
      .v21-workflow p{margin:.3rem 0}.v21-workflow ol{margin:.3rem 0;padding-left:1.25rem}.v21-workflow .v21-pattern{font-weight:500;color:var(--text-primary)}
      .v21-community{margin-top:.65rem;padding-top:.5rem;border-top:1px solid var(--border)}
      .v21-comment-toggle,.v21-analysis-button{border:0;background:transparent;color:var(--accent);font:400 .74rem 'DM Sans',sans-serif;cursor:pointer;padding:.25rem 0;text-decoration:underline;text-underline-offset:2px}
      .v21-comment-form{display:grid;gap:.45rem;margin:.45rem 0}.v21-comment-form input,.v21-comment-form textarea,.v21-admin-token{width:100%;box-sizing:border-box;border:1px solid var(--border);border-radius:6px;padding:.48rem .55rem;background:var(--bg,#fff);color:var(--text-primary);font:400 .8rem 'DM Sans',sans-serif}.v21-comment-form textarea{min-height:4.2rem;resize:vertical}
      .v21-public-note{font-size:.7rem;color:var(--text-muted)}.v21-consent{display:flex;align-items:flex-start;gap:.4rem;font-size:.72rem;color:var(--text-muted)}.v21-consent input{width:auto;margin-top:.18rem}
      .v21-submit-comment{justify-self:start;border:1px solid var(--border);border-radius:6px;padding:.42rem .7rem;background:transparent;color:var(--text-primary);font:400 .76rem 'DM Sans',sans-serif;cursor:pointer}.v21-submit-comment:disabled{opacity:.45;cursor:wait}
      .v21-comments{margin:.35rem 0}.v21-comment{padding:.4rem 0;border-top:1px solid var(--border);font-size:.76rem}.v21-comment-name{font-weight:500}.v21-comment-date{margin-left:.4rem;color:var(--text-muted);font-size:.68rem}.v21-comment-status{font-size:.72rem;color:var(--text-muted)}
      .v21-close{margin-top:.75rem;padding-top:.65rem;border-top:1px solid var(--border);font-style:italic;color:var(--text-muted)}
      .v21-closed-note{padding:.4rem 0;color:var(--text-muted);font-size:.76rem}.v21-admin-box{margin-top:.5rem}.v21-admin-summary{white-space:pre-wrap;margin-top:.5rem;padding:.65rem;border:1px solid var(--border);border-radius:6px;font-size:.78rem}
      .v21-next-button{display:block;margin:.8rem 0 0 auto;padding:.28rem .7rem;border:1px solid var(--border);border-radius:6px;background:transparent;color:var(--text-secondary);font:400 .72rem 'DM Sans',sans-serif;cursor:pointer}.v21-next-button:hover{border-color:var(--accent);color:var(--accent)}
      .v21-actions{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:1rem;padding-top:.75rem;border-top:1px solid var(--border)}
      .v21-action{display:inline-flex;align-items:center;gap:.35rem;padding:.4rem .55rem;border:1px solid var(--border);border-radius:7px;background:transparent;color:var(--text-secondary);font:400 .73rem 'DM Sans',sans-serif;text-decoration:none;cursor:pointer}
      .v21-action:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-light)}.v21-action svg{width:15px;height:15px;flex:0 0 15px}.v21-action-status{align-self:center;font-size:.7rem;color:var(--text-muted)}
      .v21-explainer-backdrop{position:fixed;inset:0;margin:auto;padding:0;border:0;background:transparent;max-width:calc(100vw - 2rem);max-height:calc(100vh - 2rem)}
      .v21-explainer-backdrop::backdrop{background:rgba(24,22,20,.55)}
      .v21-explainer{width:min(760px,100%);max-height:min(88vh,900px);overflow:auto;background:var(--bg,#faf9f6);color:var(--text-primary);border:1px solid var(--border);border-radius:16px;box-shadow:0 24px 70px rgba(0,0,0,.24);padding:clamp(1rem,3vw,2rem)}
      .v21-explainer-head{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;border-bottom:1px solid var(--border);padding-bottom:.8rem;margin-bottom:.8rem}
      .v21-explainer-kicker{font-size:.65rem;letter-spacing:.14em;text-transform:uppercase;color:#742c32}.v21-explainer h2{font:500 1.55rem/1.25 'DM Serif Display',Georgia,serif;margin:.3rem 0}.v21-explainer-intro{font-size:.8rem;color:var(--text-muted);margin:.3rem 0 1rem;max-width:65ch}
      .v21-explainer-close{border:1px solid var(--border);border-radius:50%;width:2rem;height:2rem;background:transparent;color:var(--text-primary);cursor:pointer;font-size:1.1rem;line-height:1}
      .v21-trace-step{display:grid;grid-template-columns:2rem 1fr;gap:.7rem;padding:.85rem 0;border-top:1px solid var(--border)}.v21-trace-num{position:relative;width:1.65rem;height:1.65rem;border-radius:50%;display:grid;place-items:center;background:var(--accent-light);color:#742c32;font-size:.72rem;font-weight:600}.v21-trace-step:not(:last-of-type) .v21-trace-num::after{content:'↓';position:absolute;top:1.4rem;left:.48rem;color:#9a8d7c;font-size:.9rem}
      .v21-trace-step h3{font:500 .83rem/1.4 'DM Sans',sans-serif;margin:.1rem 0 .3rem}.v21-trace-step p,.v21-trace-step li{font:300 .8rem/1.55 'DM Sans',sans-serif;color:var(--text-secondary);margin:.15rem 0}.v21-trace-step ul,.v21-trace-step ol{padding-left:1.1rem;margin:.35rem 0}.v21-trace-note{margin:.6rem 0;padding:.7rem .8rem;border-left:3px solid #742c32;background:var(--surface,#fff);font-size:.74rem;line-height:1.55;color:var(--text-muted)}
      .v21-explainer.v21-fr-prototype{width:min(1100px,calc(100vw - 2rem));max-height:90vh;padding:clamp(1rem,3vw,2rem);background:#f5f3ec;color:#1b2524;font:400 15px/1.55 Georgia,'Times New Roman',serif}
      .v21-fr-prototype .v21-explainer-head{border-color:#dcded4}.v21-fr-prototype .v21-explainer-kicker{color:#526c56}
      .v21-fr-prototype .v21-explainer h2{font:500 clamp(1.5rem,3vw,2rem)/1.2 Georgia,'Times New Roman',serif;color:#1b2524}
      .v21-fr-prototype .v21-explainer-intro{font:400 1rem/1.5 Georgia,'Times New Roman',serif;color:#42504a;max-width:65ch}
      .v21-fr-grid{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(280px,.7fr);gap:18px;align-items:start}
      .v21-fr-card{background:#fffefa;border:1px solid #dcded4;border-radius:15px;box-shadow:0 14px 40px #243a3010;padding:20px}
      .v21-fr-card h3{margin:0 0 6px;font:500 1.2rem/1.35 Georgia,'Times New Roman',serif;color:#1b2524}
      .v21-fr-small{font:400 .76rem/1.5 'DM Sans',sans-serif;color:#65716c}
      .v21-fr-path-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
      .v21-fr-show-answer{border:0;border-radius:8px;background:#344a39;color:#fff;padding:10px 12px;cursor:pointer;font:600 .74rem 'DM Sans',sans-serif}
      .v21-fr-show-answer:hover{background:#26392b}
      .v21-fr-steps{display:grid;gap:9px;margin:18px 0}
      .v21-fr-step{position:relative;display:grid;grid-template-columns:34px 1fr auto;align-items:center;gap:11px;width:100%;padding:12px;border:1px solid #dcded4;border-radius:12px;background:#fff;text-align:left;color:#1b2524;cursor:pointer}
      .v21-fr-step:not(:last-child)::after{content:'↓';position:absolute;left:22px;bottom:-18px;z-index:2;color:#c69b48;font:17px system-ui,sans-serif}
      .v21-fr-step:hover,.v21-fr-step[aria-pressed="true"]{border-color:#526c56;background:#f2f5ec;box-shadow:0 0 0 2px #526c5612}
      .v21-fr-num{width:32px;height:32px;display:grid;place-items:center;border-radius:50%;background:#e7eadf;color:#344a39;font:700 .76rem 'DM Sans',sans-serif}
      .v21-fr-step[aria-pressed="true"] .v21-fr-num{background:#526c56;color:#fff}
      .v21-fr-step strong{display:block;font:600 .9rem/1.35 'DM Sans',sans-serif}.v21-fr-step small{display:block;margin-top:2px;font:400 .7rem/1.4 'DM Sans',sans-serif;color:#65716c}
      .v21-fr-detail{min-height:120px;border-left:3px solid #c69b48;border-radius:0 11px 11px 0;background:#fbf8ef;padding:14px 16px}
      .v21-fr-detail-title{margin:0 0 7px!important;font:500 1.12rem/1.3 Georgia,'Times New Roman',serif!important}
      .v21-fr-detail p,.v21-fr-detail li{margin:.25rem 0;color:#42504a;font:400 .8rem/1.55 'DM Sans',sans-serif}
      .v21-fr-detail ul,.v21-fr-detail ol{margin:.35rem 0;padding-left:1.2rem}
      .v21-fr-detail a,.v21-fr-source a{color:#344a39;text-underline-offset:3px}
      .v21-fr-question{margin-top:17px;padding-top:15px;border-top:1px solid #dcded4}
      .v21-fr-question blockquote{margin:7px 0 0;font:400 1rem/1.5 Georgia,'Times New Roman',serif;overflow-wrap:anywhere}
      .v21-fr-aside{display:grid;gap:15px}.v21-fr-source{padding:12px 0;border-top:1px solid #dcded4}
      .v21-fr-source:first-of-type{border-top:0;padding-top:4px}.v21-fr-source strong{display:block;font:600 .86rem/1.4 'DM Sans',sans-serif}
      .v21-fr-source p{margin:3px 0 7px;font:400 .7rem/1.4 'DM Sans',sans-serif;color:#65716c}
      .v21-fr-links{display:flex;gap:10px;flex-wrap:wrap;font:500 .72rem/1.5 'DM Sans',sans-serif}
      .v21-fr-empty{padding:11px;border:1px dashed #c8cbbf;border-radius:9px;color:#65716c;font:400 .76rem/1.5 'DM Sans',sans-serif}
      .v21-fr-note{margin:13px 0 0;padding:11px 12px;border-top:1px solid #dcded4;color:#65716c;font:400 .68rem/1.5 'DM Sans',sans-serif}
      .v21-fr-answer{margin-top:18px;padding:22px;background:#fffefa;border:1px solid #dcded4;border-radius:15px;box-shadow:0 14px 40px #243a3010}
      .v21-fr-answer[hidden]{display:none}.v21-fr-answer h3{font:500 1.45rem/1.25 Georgia,'Times New Roman',serif;margin:0 0 12px}
      .v21-fr-answer-body{font:400 1rem/1.7 Georgia,'Times New Roman',serif;color:#1b2524}.v21-fr-answer-body p{margin:.7rem 0}
      .v21-fr-answer-body a{color:#344a39}
      @media(max-width:760px){.v21-explainer.v21-fr-prototype{width:calc(100vw - 1rem);max-height:94vh}.v21-fr-grid{grid-template-columns:1fr}.v21-fr-card,.v21-fr-answer{padding:15px}.v21-fr-path-head{flex-direction:column}.v21-fr-show-answer{align-self:flex-start}}
      .empty-state .empty-icon{display:block;max-width:min(100%,620px);max-height:52vh;object-fit:contain;margin:0 auto}
      .prompt-guidance{color:#742c32!important}
    `;
    document.head.appendChild(style);
  }
  function addVersionLabel() {
    const brand = document.querySelector('.brand');
    if (brand && !document.querySelector('.v21-version')) {
      const label = document.createElement('small'); label.className = 'v21-version'; label.textContent = t.version;
      brand.insertAdjacentElement('afterend', label);
    }
    const title = document.querySelector('.empty-state h2');
    const intro = document.querySelector('.empty-state p:not(.prompt-guidance):not(.beta-notice)');
    const input = document.getElementById('user-input');
    if (title) { title.textContent = t.landingTitle; title.hidden = true; }
    if (intro) { intro.textContent = t.landingText; intro.hidden = true; }
    if (input) {
      input.placeholder = t.openingInput;
      input.value = t.greeting;
      input.readOnly = true;
      requestAnimationFrame(() => {
        if (typeof autoResize === 'function') autoResize(input);
        else { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 90) + 'px'; }
      });
    }
    const sendButton = document.getElementById('send-btn');
    if (sendButton) { sendButton.title = t.sendAction; sendButton.setAttribute('aria-label', t.sendAction); }
    document.querySelectorAll('.nz-upload-button,.nz-upload-remove,#nz-file-picker').forEach(el => { el.disabled = true; });
    const hint = document.querySelector('.input-hint');
    if (hint) hint.hidden = true;
    const suggestions = document.getElementById('suggestions-container');
    if (suggestions) suggestions.hidden = true;
  }
  function systemForWhitelist() {
    try { if (typeof activePrompt !== 'undefined' && typeof activePrompt === 'string') return activePrompt; } catch (_) {}
    try { if (typeof SYSTEM_PROMPT !== 'undefined' && typeof SYSTEM_PROMPT === 'string') return SYSTEM_PROMPT; } catch (_) {}
    return '';
  }
  function stagePanel(stage, title, html, subject) {
    return `<section class="v21-workflow" data-v21-stage="${esc(stage)}"><h3>${esc(title)}</h3>${html}<div class="v21-community"><button type="button" class="v21-comment-toggle">${esc(t.comment)}</button><div class="v21-comments" aria-live="polite">${esc(t.loading)}</div><form class="v21-comment-form" hidden><input name="author" maxlength="60" placeholder="${esc(t.name)}"><textarea name="body" maxlength="2000" minlength="2" required placeholder="${esc(t.placeholder)}"></textarea><div class="v21-public-note">${esc(t.public)}</div><label class="v21-consent"><input type="checkbox" name="public" required><span>${esc(t.consent)}</span></label><button type="submit" class="v21-submit-comment">${esc(t.send)}</button><div class="v21-comment-status" role="status"></div></form></div></section>`;
  }
  function renderWorkflow(data, responseText) {
    const w = data.workflow || {};
    let stages = '';
    if (w.decision === 'develop') {
      stages += stagePanel('reception', t.reception, `<p>${esc(w.reception || responseText)}</p>`, '');
    } else {
      const lines = (w.meaning_lines || []).map(line => `<li>${esc(line)}</li>`).join('');
      stages += stagePanel('meaning', t.meanings, `<ol>${lines}</ol>`, '');
      const p = w.selected_pattern || {};
      stages += stagePanel('pattern', t.pattern, `<p class="v21-pattern">${esc(p.name || t.noPattern)}${p.id ? ` (${esc(p.id)})` : ''}</p><p>${esc(p.source || '')}</p><p><strong>${esc(t.reason)} :</strong> ${esc(p.reason || '')}</p>`, '');
    }
    const wrap = document.createElement('div');
    wrap.innerHTML = stages;
    wrap.querySelectorAll('[data-v21-stage]').forEach(section => wireCommentStage(section));
    const answer = stagePanel('response', t.answer, `<div>${formatText(responseText)}</div>`, '');
    const answerWrap = document.createElement('div'); answerWrap.innerHTML = answer;
    answerWrap.querySelectorAll('[data-v21-stage]').forEach(section => wireCommentStage(section));
    const fragment = document.createElement('div');
    fragment.append(...Array.from(wrap.children), ...Array.from(answerWrap.children));
    return fragment;
  }
  function traceStep(parent, number, title, text, listValues = []) {
    const row = document.createElement('section'); row.className = 'v21-trace-step';
    const badge = document.createElement('span'); badge.className = 'v21-trace-num'; badge.textContent = String(number);
    const content = document.createElement('div');
    const heading = document.createElement('h3'); heading.textContent = title; content.appendChild(heading);
    if (text) { const p = document.createElement('p'); p.textContent = text; content.appendChild(p); }
    if (listValues.length) {
      const list = document.createElement('ul');
      listValues.forEach(value => { const li = document.createElement('li'); li.textContent = value; list.appendChild(li); });
      content.appendChild(list);
    }
    row.append(badge, content); parent.appendChild(row);
  }
  function trustedNietzscheSourceUrl(raw) {
    try {
      const url = new URL(raw, window.location.href);
      if (!/(^|\.)nietzschesource\.org$/i.test(url.hostname)) return '';
      const fragment = url.hash.replace(/^#/, '');
      if (!/^eKGWB\/[A-Za-z0-9_-]+$/.test(fragment)) return '';
      return 'https://www.nietzschesource.org/#' + fragment;
    } catch (_) { return ''; }
  }
  function trustedBookUrl(raw) {
    try {
      const url = new URL(raw, window.location.href);
      if (url.hostname !== 'www.gutenberg.org' || !/^\/ebooks\/\d+\/?$/.test(url.pathname)) return '';
      return 'https://www.gutenberg.org' + url.pathname;
    } catch (_) { return ''; }
  }
  function addExternalLink(container, label, href) {
    if (!href) return;
    const link = document.createElement('a');
    link.href = href; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = label;
    container.appendChild(link);
  }
  function openFrenchReasoningExplanation(data, trigger, question, responseText) {
    document.querySelector('.v21-explainer-backdrop')?.remove();
    const w = data.workflow || {};
    const selected = w.selected_pattern || data.applied_pattern || {};
    const patterns = Array.isArray(w.selected_patterns) ? w.selected_patterns : (selected.id || selected.name ? [selected] : []);
    const meanings = Array.isArray(w.meaning_lines) ? w.meaning_lines.filter(value => typeof value === 'string' && value.trim()) : [];
    const rag = data.rag || {};
    const sources = Array.isArray(rag.sources) ? rag.sources : [];
    const overlay = document.createElement('dialog'); overlay.className = 'v21-explainer-backdrop';
    overlay.setAttribute('aria-labelledby','v21-explainer-title');
    const panel = document.createElement('section'); panel.className = 'v21-explainer v21-fr-prototype';
    panel.setAttribute('role','dialog'); panel.setAttribute('aria-modal','true'); panel.setAttribute('aria-labelledby','v21-explainer-title');
    const header = document.createElement('div'); header.className = 'v21-explainer-head';
    const titles = document.createElement('div');
    const kicker = document.createElement('div'); kicker.className = 'v21-explainer-kicker'; kicker.textContent = 'ASK NIETZSCHE · V2.1 · Raisonnement';
    const title = document.createElement('h2'); title.id = 'v21-explainer-title'; title.textContent = 'Parcours de pensée';
    titles.append(kicker, title);
    const close = document.createElement('button'); close.type = 'button'; close.className = 'v21-explainer-close'; close.setAttribute('aria-label', a.close); close.textContent = '×';
    header.append(titles, close); panel.appendChild(header);
    const intro = document.createElement('p'); intro.className = 'v21-explainer-intro';
    intro.textContent = 'Plusieurs étapes et sources peuvent contribuer à une même réponse. Sélectionnez une étape pour voir ce qui a été retenu, puis ouvrez les références.';
    panel.appendChild(intro);

    const grid = document.createElement('div'); grid.className = 'v21-fr-grid';
    const path = document.createElement('section'); path.className = 'v21-fr-card';
    const pathHead = document.createElement('div'); pathHead.className = 'v21-fr-path-head';
    const pathTitles = document.createElement('div');
    const pathTitle = document.createElement('h3'); pathTitle.textContent = 'Parcours de pensée';
    const pathHint = document.createElement('div'); pathHint.className = 'v21-fr-small'; pathHint.textContent = 'Cliquez sur une étape pour examiner sa contribution.';
    pathTitles.append(pathTitle, pathHint);
    const answerButton = document.createElement('button'); answerButton.type = 'button'; answerButton.className = 'v21-fr-show-answer'; answerButton.textContent = 'Afficher la réponse de Nietzsche';
    pathHead.append(pathTitles, answerButton); path.appendChild(pathHead);

    const stepRows = [
      {title:'Lire le texte reçu',subtitle:'Question ou document soumis'},
      {title:'Dégager les lignes de sens',subtitle:'Éléments retenus pour l’analyse'},
      {title:'Sélectionner une mécanique',subtitle:'Pattern validé retenu pour la réponse'},
      {title:'Relier les passages cités',subtitle:'Références mobilisées dans le texte'}
    ];
    const stepList = document.createElement('div'); stepList.className = 'v21-fr-steps'; stepList.setAttribute('role','group'); stepList.setAttribute('aria-label','Étapes du parcours');
    const detailBox = document.createElement('div'); detailBox.className = 'v21-fr-detail'; detailBox.setAttribute('aria-live','polite');
    function showStep(index) {
      stepList.querySelectorAll('.v21-fr-step').forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
      const heading = document.createElement('h3'); heading.className = 'v21-fr-detail-title'; heading.textContent = stepRows[index].title;
      detailBox.replaceChildren(heading);
      if (index === 0) {
        const p = document.createElement('p'); p.textContent = question || a.noData; detailBox.appendChild(p);
      } else if (index === 1) {
        if (!meanings.length) { const p = document.createElement('p'); p.textContent = a.noData; detailBox.appendChild(p); }
        else { const list = document.createElement('ol'); meanings.forEach(value => { const li = document.createElement('li'); li.textContent = value; list.appendChild(li); }); detailBox.appendChild(list); }
      } else if (index === 2) {
        if (!patterns.length) { const p = document.createElement('p'); p.textContent = a.noData; detailBox.appendChild(p); }
        patterns.forEach(pattern => {
          const p = document.createElement('p');
          p.textContent = [pattern.name || pattern.id, pattern.id ? '(' + pattern.id + ')' : '', pattern.source, pattern.reason ? a.why + ' : ' + pattern.reason : ''].filter(Boolean).join(' · ');
          detailBox.appendChild(p);
        });
      } else if (index === 3) {
        if (!sources.length) {
          const p = document.createElement('p'); p.textContent = rag.status === 'none_found' ? a.ragNone : a.ragNotCited; detailBox.appendChild(p);
        }
        sources.forEach(source => {
          const p = document.createElement('p'); p.textContent = [source.work, source.ref || source.label, source.lang].filter(Boolean).join(' · ');
          const link = document.createElement('a');
          link.href = trustedNietzscheSourceUrl(source.ns_url) || trustedBookUrl(source.source_url) || 'https://www.nietzschesource.org/';
          link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Ouvrir la référence ↗';
          detailBox.append(p, link);
        });
      }
    }
    stepRows.forEach((item, index) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'v21-fr-step'; button.setAttribute('aria-pressed', 'false');
      const number = document.createElement('span'); number.className = 'v21-fr-num'; number.textContent = String(index + 1).padStart(2, '0');
      const text = document.createElement('span'); const strong = document.createElement('strong'); strong.textContent = item.title;
      const small = document.createElement('small'); small.textContent = item.subtitle; text.append(strong, small);
      const arrow = document.createElement('span'); arrow.setAttribute('aria-hidden','true'); arrow.textContent = '↘';
      button.append(number, text, arrow); button.addEventListener('click', () => showStep(index)); stepList.appendChild(button);
    });
    path.append(stepList, detailBox);
    const questionCard = document.createElement('div'); questionCard.className = 'v21-fr-question';
    const questionLabel = document.createElement('div'); questionLabel.className = 'v21-fr-small'; questionLabel.textContent = 'Point de départ dans le texte';
    const quote = document.createElement('blockquote'); quote.textContent = question || a.noData;
    questionCard.append(questionLabel, quote); path.appendChild(questionCard);

    const aside = document.createElement('aside'); aside.className = 'v21-fr-aside';
    const books = document.createElement('section'); books.className = 'v21-fr-card';
    const booksTitle = document.createElement('h3'); booksTitle.textContent = 'Livres et passages';
    const booksIntro = document.createElement('p'); booksIntro.className = 'v21-fr-small'; booksIntro.textContent = 'Ouvrez le passage ou consultez la page de l’édition complète.';
    books.append(booksTitle, booksIntro);
    if (!sources.length) {
      const empty = document.createElement('div'); empty.className = 'v21-fr-empty'; empty.textContent = rag.status === 'none_found' ? a.ragNone : a.ragNotCited; books.appendChild(empty);
    }
    sources.forEach(source => {
      const row = document.createElement('div'); row.className = 'v21-fr-source';
      const work = document.createElement('strong'); work.textContent = source.work || source.ref || source.label || 'Texte de Nietzsche';
      const meta = document.createElement('p'); meta.textContent = [source.ref || source.label, source.lang, source.translator ? 'trad. ' + source.translator : ''].filter(Boolean).join(' · ');
      const links = document.createElement('div'); links.className = 'v21-fr-links';
      addExternalLink(links, 'Passage source ↗', trustedNietzscheSourceUrl(source.ns_url));
      addExternalLink(links, 'Livre / édition ↗', trustedBookUrl(source.source_url));
      if (!links.childElementCount) addExternalLink(links, 'Bibliothèque Nietzsche Source ↗', 'https://www.nietzschesource.org/');
      row.append(work, meta, links); books.appendChild(row);
    });
    const note = document.createElement('p'); note.className = 'v21-fr-note'; note.textContent = 'Les sources affichées sont celles que le système a citées dans cette réponse. Le lien du livre ouvre l’édition complète disponible.';
    books.appendChild(note); aside.appendChild(books);
    const limits = document.createElement('section'); limits.className = 'v21-fr-card';
    const limitsTitle = document.createElement('h3'); limitsTitle.textContent = 'À propos du parcours';
    const limitsText = document.createElement('p'); limitsText.className = 'v21-fr-small'; limitsText.textContent = 'Cette vue résume les étapes documentées et les éléments transmis à la rédaction. Elle ne prétend pas révéler un raisonnement intérieur privé ni restituer littéralement la pensée du Nietzsche historique.';
    limits.append(limitsTitle, limitsText); aside.appendChild(limits);
    grid.append(path, aside); panel.appendChild(grid);

    const answer = document.createElement('section'); answer.className = 'v21-fr-answer'; answer.hidden = true;
    const answerTitle = document.createElement('h3'); answerTitle.textContent = 'Réponse de Nietzsche';
    const answerBody = document.createElement('div'); answerBody.className = 'v21-fr-answer-body'; answerBody.innerHTML = formatText(responseText || '');
    answer.append(answerTitle, answerBody); panel.appendChild(answer);
    answerButton.addEventListener('click', () => {
      answer.hidden = !answer.hidden;
      answerButton.textContent = answer.hidden ? 'Afficher la réponse de Nietzsche' : 'Masquer la réponse de Nietzsche';
      if (!answer.hidden) answer.scrollIntoView({behavior:'smooth', block:'start'});
    });
    showStep(0);

    const dismiss = () => { overlay.remove(); document.removeEventListener('keydown', onKey); trigger?.focus(); };
    close.addEventListener('click', dismiss);
    overlay.addEventListener('click', event => { if (event.target === overlay) dismiss(); });
    const onKey = event => { if (event.key === 'Escape') dismiss(); };
    document.addEventListener('keydown', onKey);
    overlay.appendChild(panel); document.body.appendChild(overlay); overlay.showModal(); close.focus();
  }
  function openAlgorithmExplanation(data, trigger, question = '', responseText = '') {
    if (lang === 'fr') return openFrenchReasoningExplanation(data, trigger, question, responseText);
    document.querySelector('.v21-explainer-backdrop')?.remove();
    const w = data.workflow || {};
    const selected = w.selected_pattern || data.applied_pattern || {};
    const overlay = document.createElement('dialog'); overlay.className = 'v21-explainer-backdrop';
    overlay.setAttribute('aria-labelledby','v21-explainer-title');
    const panel = document.createElement('section'); panel.className = 'v21-explainer'; panel.setAttribute('role','dialog'); panel.setAttribute('aria-modal','true'); panel.setAttribute('aria-labelledby','v21-explainer-title');
    const header = document.createElement('div'); header.className = 'v21-explainer-head';
    const titles = document.createElement('div');
    const kicker = document.createElement('div'); kicker.className = 'v21-explainer-kicker'; kicker.textContent = `ASK NIETZSCHE · ${releaseLabel} · ${a.explain}`;
    const title = document.createElement('h2'); title.id = 'v21-explainer-title'; title.textContent = a.title;
    titles.append(kicker, title);
    const close = document.createElement('button'); close.type = 'button'; close.className = 'v21-explainer-close'; close.setAttribute('aria-label', a.close); close.textContent = '×';
    header.append(titles, close); panel.appendChild(header);
    const intro = document.createElement('p'); intro.className = 'v21-explainer-intro'; intro.textContent = a.intro; panel.appendChild(intro);
    const diagram = document.createElement('img');
    diagram.src = '/Cerveau_Nietzsche/Conception/Ask-Nietzsche-V21-flow.svg';
    diagram.alt = a.title;
    diagram.style.cssText = 'display:block;width:100%;height:auto;margin:0 auto 20px';
    panel.appendChild(diagram);

    const acceptedText = w.acceptance || ONBOARDING[lang]?.acceptedNotice || a.accepted;
    traceStep(panel, 1, a.accepted, acceptedText);
    const meanings = Array.isArray(w.meaning_lines) ? w.meaning_lines.filter(v => typeof v === 'string') : [];
    traceStep(panel, 2, a.meaning, meanings.length ? '' : a.noData, meanings);

    const bankCount = Number.isFinite(Number(w.pattern_bank_size)) && w.pattern_bank_size !== null && w.pattern_bank_size !== undefined ? Number(w.pattern_bank_size) : null;
    const patternText = selected.name || selected.id
      ? `${selected.name || selected.id}${selected.id ? ` (${selected.id})` : ''}${selected.source ? ` · ${selected.source}` : ''}`
      : a.noData;
    traceStep(panel, 3, bankCount === null ? a.pattern : `${a.pattern} · ${bankCount}`, patternText);
    if (selected.reason || w.selected_pattern?.reason) {
      const reason = document.createElement('p'); reason.textContent = `${a.why}: ${selected.reason || w.selected_pattern.reason}`;
      panel.lastElementChild?.lastElementChild?.appendChild(reason);
    }

    const rag = data.rag || {};
    let ragText = a.ragUnavailable;
    if (rag.status === 'cited') ragText = a.ragCited;
    else if (rag.status === 'none_found') ragText = a.ragNone;
    else if (rag.status === 'not_cited') ragText = a.ragNotCited;
    else if (rag.status === 'skipped') ragText = a.ragUnavailable;
    const sources = Array.isArray(rag.sources) ? rag.sources : [];
    const refs = sources.map(source => source.ref || source.label || source.work).filter(Boolean);
    traceStep(panel, 4, a.rag, `${ragFlow} ${ragText}`, refs);
    const coverage = document.createElement('p'); coverage.className = 'v21-trace-note'; coverage.textContent = a.coverage; panel.appendChild(coverage);
    traceStep(panel, 5, a.draft, a.draftText);

    const dismiss = () => { overlay.remove(); document.removeEventListener('keydown', onKey); trigger?.focus(); };
    close.addEventListener('click', dismiss);
    overlay.addEventListener('click', event => { if (event.target === overlay) dismiss(); });
    const onKey = event => { if (event.key === 'Escape') dismiss(); };
    document.addEventListener('keydown', onKey);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    overlay.showModal();
    close.focus();
  }
  function actionIcon(kind) {
    const paths = {
      pdf:'<path d="M6 2.8h8l4 4V21H6z"/><path d="M14 2.8v4h4M8.5 14h7M8.5 17h7"/>',
      copy:'<rect x="8" y="7" width="11" height="14" rx="1.5"/><path d="M16 7V4.5A1.5 1.5 0 0 0 14.5 3h-10A1.5 1.5 0 0 0 3 4.5v13A1.5 1.5 0 0 0 4.5 19H8"/>',
      comment:'<path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5 8 8 0 0 1-3.2-.7L4 20l1.4-4.5a7.4 7.4 0 0 1-.4-4A7.5 7.5 0 1 1 20 11.5Z"/>',
      algorithm:'<path d="m10 3-.7 2.5-2 .9L5 5.3 3 8.7l2 1.7v2.3l-2 1.7 2 3.4 2.3-1 2 .9.7 2.5h4l.7-2.5 2-.9 2.3 1 2-3.4-2-1.7v-2.3l2-1.7-2-3.4-2.3 1.1-2-.9L14 3z"/><circle cx="12" cy="11.6" r="3"/>'
    };
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[kind]}</svg>`;
  }
  function appendResponseActions(message, question, responseText, data) {
    const bubble = message.querySelector('.msg-bubble'); if (!bubble) return;
    const bar = document.createElement('div'); bar.className = 'v21-actions'; bar.setAttribute('aria-label', a.explain);
    const status = document.createElement('span'); status.className = 'v21-action-status'; status.setAttribute('role','status');
    const button = (kind, label, handler) => {
      const node = document.createElement('button'); node.type = 'button'; node.className = 'v21-action'; node.innerHTML = `${actionIcon(kind)}<span>${esc(label)}</span>`;
      node.addEventListener('click', () => handler(node)); bar.appendChild(node); return node;
    };
    button('pdf', a.pdf, node => {
      const printWindow = window.open('', '_blank', 'width=820,height=900');
      if (!printWindow) { status.textContent = a.popup; return; }
      const doc = printWindow.document;
      doc.open(); doc.write('<!doctype html><html><head><meta charset="utf-8"><title>Ask Nietzsche</title><style>body{max-width:760px;margin:48px auto;padding:0 28px;color:#25241f;font:16px/1.75 Georgia,serif}h1{font:600 22px Arial,sans-serif}h2{font:500 16px Arial,sans-serif;color:#813c41;margin-top:34px}.reply{white-space:pre-wrap}.foot{margin-top:40px;color:#777;font:12px Arial,sans-serif}@media print{body{margin:18mm auto}}</style></head><body><h1>Ask Nietzsche</h1><h2>Question</h2><p id="q"></p><h2>Nietzsche</h2><p id="r" class="reply"></p><p class="foot">Ask Nietzsche · V2.1</p></body></html>'); doc.close();
      doc.getElementById('q').textContent = question; doc.getElementById('r').innerHTML = formatText(responseText);
      printWindow.focus(); setTimeout(() => printWindow.print(), 250); node.blur();
    });
    button('copy', a.copy, async node => {
      try {
        if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(responseText);
        else { const field = document.createElement('textarea'); field.value = responseText; document.body.appendChild(field); field.select(); const ok = document.execCommand('copy'); field.remove(); if (!ok) throw new Error('copy failed'); }
        status.textContent = a.copied;
      } catch (_) { status.textContent = copyFailure; }
      node.blur();
    });
    const feedback = document.createElement('a'); feedback.className = 'v21-action'; feedback.href = `https://github.com/GRMPZQUIDOS/ask-nietzsche/issues/new?${new URLSearchParams({title:a.githubTitle,body:a.githubBody})}`; feedback.target = '_blank'; feedback.rel = 'noopener noreferrer'; feedback.innerHTML = `${actionIcon('comment')}<span>${esc(a.comment)}</span>`; bar.appendChild(feedback);
  const algorithmLabel = {fr:'Raisonnement', en:'Algorithm', de:'Algorithmus', es:'Algoritmo', ja:'アルゴリズム', zh:'算法'};
    const inspector = button('algorithm', algorithmLabel[lang] || algorithmLabel.en, node => openAlgorithmExplanation(data, node, question, responseText));
    inspector.dataset.algorithmInspector = '';
    inspector.addEventListener('ask-algorithm', event => openAlgorithmExplanation(data, event.detail, question, responseText));
    bar.appendChild(status); bubble.appendChild(bar);
  }
  function formatText(text) {
    return esc(text).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
  }
  async function loadComments(stage, container) {
    try {
      const response = await fetch(`/api/community-comments.php?stage=${encodeURIComponent(stage)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unavailable');
      if (!data.comments || !data.comments.length) { container.textContent = t.empty; return; }
      container.replaceChildren(...data.comments.map(comment => {
        const item = document.createElement('div'); item.className = 'v21-comment';
        const name = document.createElement('span'); name.className = 'v21-comment-name'; name.textContent = comment.author || 'Anonyme';
        const date = document.createElement('span'); date.className = 'v21-comment-date'; date.textContent = new Date(comment.created_at).toLocaleDateString();
        const body = document.createElement('div'); body.textContent = comment.body || '';
        item.append(name, date, body); return item;
      }));
    } catch (_) { container.textContent = ''; }
  }
  function wireCommentStage(section) {
    const stage = section.dataset.v21Stage;
    const list = section.querySelector('.v21-comments');
    const form = section.querySelector('.v21-comment-form');
    const toggle = section.querySelector('.v21-comment-toggle');
    const status = section.querySelector('.v21-comment-status');
    loadComments(stage, list);
    toggle.addEventListener('click', () => { form.hidden = !form.hidden; });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const submit = form.querySelector('.v21-submit-comment');
      const body = form.elements.body.value.trim();
      if (!form.elements.public.checked || body.length < 2) return;
      submit.disabled = true; status.textContent = t.loading;
      try {
        const response = await fetch('/api/community-comments.php', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({stage, author:form.elements.author.value.trim(), body, public:true}) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || t.failed);
        form.reset(); status.textContent = t.saved; await loadComments(stage, list);
      } catch (error) { status.textContent = error.message || t.failed; }
      finally { submit.disabled = false; }
    });
  }
  function addAnalysisControl() {
    if (!developerMode || document.querySelector('.v21-analysis-control')) return;
    const footer = document.querySelector('footer'); if (!footer) return;
    const box = document.createElement('div'); box.className = 'v21-analysis-control';
    const button = document.createElement('button'); button.type = 'button'; button.className = 'v21-analysis-button'; button.textContent = t.analysis;
    const result = document.createElement('div'); result.className = 'v21-admin-box';
    button.addEventListener('click', async () => {
      button.disabled = true; result.textContent = t.loading;
      try {
        const response = await fetch('/api/community-analysis.php', {method:'POST', headers:{'Content-Type':'application/json'}, body:'{}'});
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || t.failed);
        result.textContent = data.summary ? `${data.summary}${data.cached ? '\n\nSynthèse en cache.' : ''}` : '';
      } catch (error) { result.textContent = error.message || t.failed; }
      finally { button.disabled = false; }
    });
    box.append(button, result); footer.appendChild(box);
  }
  function closeSession() {
    sessionClosed = true;
    const chat = document.getElementById('chat-messages');
    if (chat) chat.dataset.sessionClosed = 'true';
    const input = document.getElementById('user-input'); const send = document.getElementById('send-btn');
    if (input) { input.disabled = true; input.value = ''; input.placeholder = t.closed; }
    if (send) send.disabled = true;
    document.querySelectorAll('.nz-upload-button,.nz-upload-remove,#nz-file-picker').forEach(el => { el.disabled = true; });
    if (developerMode) {
      const area = document.getElementById('chat-messages');
      if (area) { const note = document.createElement('div'); note.className = 'v21-closed-note'; note.textContent = t.closed; area.appendChild(note); }
    }
  }
  async function presentWelcomePart(index) {
    if (index >= t.welcomeParts.length) return true;
    try {
      await window.AskNietzscheAuth.persistMessage('paul', t.welcomeParts[index]);
    } catch (error) {
      setComposerVisible(true);
      const input = document.getElementById('user-input'); const send = document.getElementById('send-btn');
      if (input) { input.disabled = true; input.placeholder = t.error; }
      if (send) send.disabled = true;
      const area = document.getElementById('chat-messages');
      if (area) appendMessage('nietzsche', `<em>${esc(t.error)}</em>`);
      return false;
    }
    const message = appendMessage('nietzsche', esc(t.welcomeParts[index]));
    message.dataset.speaker = 'paul';
    const label = message.querySelector('.msg-label');
    if (label) label.textContent = t.paul;
    const bubble = message.querySelector('.msg-bubble');
    if (index < t.welcomeParts.length - 1) {
      const next = document.createElement('button');
      next.type = 'button'; next.className = 'v21-next-button'; next.textContent = t.next;
      next.addEventListener('click', async () => {
        next.disabled = true;
        const saved = await presentWelcomePart(index + 1);
        if (!saved) { next.disabled = false; next.textContent = t.error; }
        else next.remove();
      });
      bubble.appendChild(next);
      return true;
    }
    welcomeComplete = true;
    markWelcomed();
    setComposerVisible(true);
    const input = document.getElementById('user-input');
    const send = document.getElementById('send-btn');
    if (input) { input.placeholder = t.input; input.readOnly = false; input.value = ''; input.style.height = 'auto'; input.focus(); }
    document.querySelectorAll('.nz-upload-button,.nz-upload-remove,#nz-file-picker').forEach(el => { el.disabled = false; });
    if (send) send.disabled = false;
    return true;
  }
  async function logOpeningTurn(message) {
    try { if (typeof turnCount !== 'undefined') turnCount++; } catch (_) {}
    if (typeof logToDb !== 'function') throw new Error('Conversation storage unavailable');
    if (typeof sessionStarted !== 'undefined' && !sessionStarted) { await logToDb('start_session'); sessionStarted = true; }
    await logToDb('log_message', {role:'user', content:message, turn:turnCount || 1});
  }
  async function sendV21() {
    if (sessionClosed) return;
    const input = document.getElementById('user-input'); const btn = document.getElementById('send-btn');
    const typed = input && input.value.trim();
    const hasAttachment = Boolean(document.querySelector('#nz-file-picker')?.files?.length);
    if (!typed && !hasAttachment) return;
    if (!welcomeComplete) {
      const opening = t.greeting;
      setComposerVisible(false);
      input.value = ''; input.style.height = 'auto'; btn.disabled = true;
      appendMessage('user', esc(opening));
      try {
        await logOpeningTurn(opening);
        const saved = await presentWelcomePart(0);
        if (!saved) return;
      } catch (_) {
        setComposerVisible(true);
        appendMessage('nietzsche', `<em>${esc(t.error)}</em>`);
        if (input) { input.disabled = true; input.placeholder = t.error; }
        if (btn) btn.disabled = true;
        return;
      }
      if (btn) btn.disabled = false;
      return;
    }
    const question = typed || t.attachmentQuestion;
    input.value = ''; input.style.height = 'auto'; btn.disabled = true;
    appendMessage('user', esc(question));
    conversationHistory.push({role:'user', content:question});
    try { if (typeof turnCount !== 'undefined') turnCount++; } catch (_) {}
    try {
      if (typeof logToDb === 'function') {
        if (typeof sessionStarted !== 'undefined' && !sessionStarted) { sessionStarted = true; await logToDb('start_session'); }
        await logToDb('log_message', {role:'user', content:question, turn:turnCount || 1});
      }
    } catch (_) {}
    showThinking();
    try {
      const body = {system:systemForWhitelist(), messages:conversationHistory, workflow_v2_1:true};
      const response = await fetch('/api/chat.php', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `${t.error} (HTTP ${response.status})`);
      const responseText = data.content && data.content[0] && data.content[0].text;
      if (!responseText) throw new Error(t.error);
      hideThinking();
      const isReady = data.workflow && data.workflow.decision === 'ready';
      const finalText = responseText;
      const firstResponseMessage = isReady
        ? appendMessage('paul', esc(data.workflow.acceptance || ONBOARDING[lang]?.acceptedNotice || 'I am passing this on to Herr Nietzsche.'), false)
        : null;
      const message = appendMessage('nietzsche', '', false);
      const bubbleNode = message.querySelector('.msg-bubble');
      if (developerMode) {
        bubbleNode.append(renderWorkflow(data, responseText));
        if (data.rag && typeof renderSources === 'function') renderSources(bubbleNode, data.rag);
      } else {
        bubbleNode.innerHTML = formatText(responseText);
      }
      const last = message.querySelector('.msg-label');
      if (last && !isReady) { last.textContent = t.paul; message.dataset.speaker = 'paul'; }
      if (isReady) {
        appendResponseActions(message, question, finalText, data);
        const paulMessage = appendMessage('nietzsche', '', false);
        paulMessage.dataset.speaker = 'paul';
        const paulLabel = paulMessage.querySelector('.msg-label');
        if (paulLabel) paulLabel.textContent = ONBOARDING[lang]?.paul || 'Paul Rée';
        const paulBubble = paulMessage.querySelector('.msg-bubble');
        const close = document.createElement('p'); close.className = 'v21-close'; close.textContent = t.close;
        paulBubble.appendChild(close);
        closeSession();
      }
      conversationHistory.push({role:'assistant', content:finalText});
      // The authenticated chat endpoint stores the assistant turn and its distinct
      // Paul messages atomically. Do not append a second, misattributed client copy.
      requestAnimationFrame(() => (firstResponseMessage || message).scrollIntoView({behavior:'smooth', block:'start'}));
    } catch (error) {
      hideThinking();
      appendMessage('nietzsche', `<em>${esc(error.message || t.error)}</em>`);
      btn.disabled = false; input.focus(); return;
    }
    if (!sessionClosed) { btn.disabled = false; input.focus(); }
  }

  try {
    const identityCheck = window.checkReturningUser;
    window.checkReturningUser = async () => {
      if (typeof identityCheck === 'function') await identityCheck();
      try { isReturningUser = false; } catch (_) {}
      return false;
    };
    window.generateSuggestions = async () => [];
    window.renderSuggestions = () => {};
  } catch (_) {}
  addStyles(); addVersionLabel(); addAnalysisControl();
  if (hasBeenWelcomed()) presentReturningWelcome();
  window.sendQuestion = sendV21;
})();
