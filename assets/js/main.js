/* =====================================================================
   LE FACE — interações do site
   ---------------------------------------------------------------------
   Carregado no fim do <body> do index.html. Sem bibliotecas externas.
     01. Título do hero dividido por letra
     02. Início das animações (após carregar as fontes)
     03. Ticker do título (Odontologia / Psicologia)
     04. Loops infinitos (faixa, depoimentos, galeria)
     05. Revelação no scroll + contadores
     06. Revelação de palavras (seção Sobre)
     07. Navegação: link ativo e botão do WhatsApp
     08. Menu
     09. Dúvidas (FAQ)
     10. Explore: sorriso & mente  →  textos editáveis em EXP_DATA
     11. Cursor da galeria
     12. Chips do hero (parallax)
     13. Ano do rodapé
   ===================================================================== */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- título dividido por letra ---------- */
  $$('[data-split]').forEach(el => {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          if (!n.textContent.trim()) { n.textContent = n.textContent ? ' ' : ''; return; }
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(' '); return; }
            const w = document.createElement('span'); w.className = 'word';
            [...part].forEach(c => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c; s.style.setProperty('--i', i++); w.append(s); });
            frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('media-pill')) walk(n);
      });
    };
    const clone = el.cloneNode(true); clone.querySelectorAll('.media-pill').forEach(m => m.remove());
    walk(el);
    el.setAttribute('aria-label', clone.textContent.replace(/\s+/g, ' ').trim());
  });

  /* ---------- start ---------- */
  const start = () => document.body.classList.add('loaded');
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
  setTimeout(start, 900); // garantia: inicia mesmo se as fontes demorarem

  /* ---------- ticker no título ---------- */
  const items = $$('#ticker .t-item');
  let ti = 0;
  if (items.length && !reduce) setInterval(() => {
    const cur = items[ti]; ti = (ti + 1) % items.length; const nxt = items[ti];
    cur.classList.remove('on'); cur.classList.add('out');
    nxt.classList.remove('out'); nxt.classList.add('on');
    setTimeout(() => { cur.style.transition = 'none'; cur.classList.remove('out'); cur.offsetHeight; cur.style.transition = ''; }, 750);
  }, 2200);

  /* ---------- duplicar trilhas para loops infinitos ---------- */
  // as cópias são só visuais: ficam ocultas para leitores de tela
  const dup = el => {
    if (!el) return;
    [...el.children].forEach(c => { const k = c.cloneNode(true); k.setAttribute('aria-hidden', 'true'); el.append(k); });
  };
  dup($('#marquee'));
  dup($('#testiRow'));
  $$('.g-track').forEach(dup);
  // imagens duplicadas: re-aplica fallback (onerror inline já é copiado)

  /* ---------- revelação no scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); if (e.target.dataset.count !== undefined) countUp(e.target); } });
  }, { threshold: .15, rootMargin: '0px 0px -40px 0px' });
  $$('[data-reveal], .step-arrow').forEach(el => io.observe(el));

  /* ---------- contadores ---------- */
  const countUp = el => {
    const end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), dur = 1600, t0 = performance.now();
    const fmt = v => v.toFixed(dec).replace('.', ',');
    if (reduce) { el.textContent = fmt(end); return; }
    const tick = t => { const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4); el.textContent = fmt(end * e); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  $$('[data-count]').forEach(el => io.observe(el));

  /* ---------- revelação de palavras no scroll (0.2 → 1) ---------- */
  const rw = $('#revealWords');
  let words = [];
  if (rw) {
    rw.innerHTML = rw.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
    words = $$('.w', rw);
  }
  /* ---------- nav: link ativo ---------- */
  const links = $$('.nav-links a');
  const secs = links.map(a => $(a.getAttribute('href')));
  const fab = $('#fab');

  const onScroll = () => {
    const vh = innerHeight;
    if (rw && !reduce) {
      const r = rw.getBoundingClientRect();
      const p = Math.min(Math.max((vh * .85 - r.top) / (r.height + vh * .3), 0), 1);
      const n = words.length;
      words.forEach((w, i) => { w.style.opacity = .2 + .8 * Math.min(Math.max(p * n * 1.15 - i, 0), 1); });
    }
    let active = -1;
    secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < vh * .45) active = i; });
    links.forEach((a, i) => a.classList.toggle('is-active', i === active && secs[i].getBoundingClientRect().bottom > vh * .3));
    fab.classList.toggle('show', scrollY > vh * .7);
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- menu ---------- */
  const nav = $('#nav'), mb = $('#menuBtn');
  const setMenu = open => { nav.classList.toggle('menu-open', open); mb.setAttribute('aria-expanded', open); mb.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); };
  mb.addEventListener('click', e => { e.stopPropagation(); setMenu(!nav.classList.contains('menu-open')); });
  $$('#menuPanel a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', e => { if (!e.target.closest('#menuPanel')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- FAQ ---------- */
  $$('.faq-q').forEach(q => q.addEventListener('click', () => {
    const item = q.parentElement, open = !item.classList.contains('open');
    $$('.faq-item.open').forEach(o => { o.classList.remove('open'); $('.faq-q', o).setAttribute('aria-expanded', 'false'); });
    if (open) { item.classList.add('open'); q.setAttribute('aria-expanded', 'true'); }
  }));

  /* ---------- EXPLORE: sorriso & mente ----------
     ✏️ CONTEÚDO: edite os textos abaixo. Cada tema tem 5 cards de importância
     (ícone Phosphor, título, texto e dica prática) e 5 afirmações de mito ou verdade
     (resposta: 'mito' ou 'verdade'). O quiz usa as mesmas afirmações. */
  const EXP_DATA = {
    sorriso: {
      nome: 'Sorriso', sub: 'Cuidado com os dentes', artigo: 'o sorriso', icon: 'ph-tooth', chip: '#ffe1d6',
      importancia: [
        { icon: 'ph-shield-check', titulo: 'Prevenção de cáries e gengivite',
          texto: 'A placa bacteriana que se acumula nos dentes é a principal causa de cáries e de inflamação na gengiva. Escovação e fio dental diários são a melhor defesa.',
          dica: 'Escove pelo menos 2 vezes ao dia, por 2 minutos, com creme dental com flúor. Passe fio dental uma vez por dia, de preferência antes de dormir.' },
        { icon: 'ph-heartbeat', titulo: 'Saúde do coração',
          texto: 'Estudos associam a periodontite (inflamação crônica da gengiva) a um maior risco de doenças cardiovasculares. Cuidar da gengiva também é cuidar do corpo.',
          dica: 'Gengiva que sangra ao escovar não é normal: é sinal de gengivite. Tratada cedo, ela é reversível. Vale agendar uma avaliação.' },
        { icon: 'ph-fork-knife', titulo: 'Digestão e alimentação',
          texto: 'A digestão começa na boca: a mastigação tritura os alimentos e a saliva inicia sua quebra. Dentes doloridos ou ausentes atrapalham o que você come.',
          dica: 'Dor ao mastigar ou sensibilidade ao frio e ao doce merecem atenção. Quanto antes avaliadas, mais simples costumam ser as soluções.' },
        { icon: 'ph-smiley', titulo: 'Autoestima e confiança',
          texto: 'Um sorriso saudável muda a forma como você fala, sorri em fotos e se relaciona. Sentir-se bem com a própria boca faz diferença no dia a dia.',
          dica: 'Estética vem depois da saúde: primeiro cuidamos de cáries e gengiva. Depois, se você quiser, clareamento, lentes ou alinhadores.' },
        { icon: 'ph-wind', titulo: 'Hálito e bem-estar',
          texto: 'Na maioria dos casos, o mau hálito começa na própria boca, principalmente pela saburra (camada esbranquiçada) na língua e por problemas na gengiva.',
          dica: 'Inclua a limpeza da língua na rotina, de trás para a frente, e beba água ao longo do dia: boca seca favorece o mau hálito.' }
      ],
      mitos: [
        { frase: 'Escovar com mais força deixa os dentes mais limpos.', resposta: 'mito',
          explicacao: 'Força demais desgasta o esmalte e machuca a gengiva, podendo causar retração e sensibilidade. O ideal é escova de cerdas macias e movimentos suaves.' },
        { frase: 'Sangrar um pouco ao escovar os dentes é normal.', resposta: 'mito',
          explicacao: 'Gengiva saudável não sangra. O sangramento costuma indicar gengivite, que é reversível com boa higiene e acompanhamento profissional.' },
        { frase: 'Dentes de leite precisam de tanto cuidado quanto os permanentes.', resposta: 'verdade',
          explicacao: 'Eles ajudam a criança a mastigar e a falar e guardam espaço para os permanentes. Cárie no dente de leite dói e pode prejudicar o dente que vem depois.' },
        { frase: 'O flúor do creme dental ajuda a prevenir cáries.', resposta: 'verdade',
          explicacao: 'O flúor fortalece o esmalte e ajuda a reverter cáries bem no início. Para crianças, a quantidade importa: um grão de arroz até os 3 anos e uma ervilha depois disso.' },
        { frase: 'Quem está grávida não pode ir ao dentista.', resposta: 'mito',
          explicacao: 'O pré-natal odontológico é recomendado. Consultas, limpezas e muitos tratamentos são seguros na gestação, e cuidar da gengiva nesse período é ainda mais importante.' }
      ]
    },
    mente: {
      nome: 'Mente', sub: 'Saúde mental e emocional', artigo: 'a mente', icon: 'ph-brain', chip: '#e7e0ff',
      importancia: [
        { icon: 'ph-waves', titulo: 'Regulação das emoções',
          texto: 'Reconhecer e nomear o que sentimos ajuda a atravessar ansiedade, raiva e tristeza sem ser dominado por elas, em qualquer idade.',
          dica: 'Experimente dar nome ao que sente (“estou ansioso”, “estou frustrado”). Nomear a emoção ajuda a diminuir sua intensidade e a escolher o próximo passo.' },
        { icon: 'ph-moon-stars', titulo: 'Sono de qualidade',
          texto: 'Sono e saúde mental andam juntos: dormir mal aumenta a irritabilidade e a ansiedade, e a ansiedade, por sua vez, atrapalha o sono.',
          dica: 'Mantenha horários regulares e deixe as telas de lado cerca de 1 hora antes de dormir. Para crianças, uma rotina previsível (banho, história, luz baixa) ajuda muito.' },
        { icon: 'ph-users-three', titulo: 'Relacionamentos',
          texto: 'Cuidar da mente melhora a forma como nos comunicamos, colocamos limites e resolvemos conflitos: em casa, na escola e no trabalho.',
          dica: 'Reserve alguns minutos por dia de atenção exclusiva, sem celular, para quem você ama. Para as crianças, esse tempo fortalece o vínculo e a segurança.' },
        { icon: 'ph-target', titulo: 'Desempenho e foco',
          texto: 'Estresse e ansiedade constantes prejudicam atenção, memória e aprendizagem. Uma mente cuidada aprende melhor e rende mais na escola e no trabalho.',
          dica: 'Trabalhe em blocos de foco com pausas curtas entre eles. Levantar e se movimentar por alguns minutos ajuda a recuperar a atenção.' },
        { icon: 'ph-person-simple-run', titulo: 'Saúde física',
          texto: 'Corpo e mente estão conectados: o estresse crônico pode afetar sono, imunidade e pressão arterial, e até a boca, no hábito de apertar ou ranger os dentes.',
          dica: 'Movimente-se de um jeito que você goste: a atividade física regular é uma das ferramentas mais eficazes para reduzir sintomas de ansiedade e depressão.' }
      ],
      mitos: [
        { frase: 'Psicólogo é só para quem tem um problema grave.', resposta: 'mito',
          explicacao: 'A terapia ajuda em fases difíceis, decisões, luto, relacionamentos e autoconhecimento. Buscar ajuda cedo também é uma forma de prevenção.' },
        { frase: 'Crianças também podem ter ansiedade.', resposta: 'verdade',
          explicacao: 'A ansiedade está entre as questões de saúde mental mais comuns na infância. Dores de barriga frequentes, medos intensos e dificuldade para dormir podem ser sinais.' },
        { frase: 'Falar sobre sentimentos com as crianças pode deixá-las mais frágeis.', resposta: 'mito',
          explicacao: 'Nomear e acolher emoções ajuda a criança a entender o que sente e a desenvolver formas mais saudáveis de lidar com elas. Isso fortalece, não fragiliza.' },
        { frase: 'Dormir mal pode piorar a ansiedade.', resposta: 'verdade',
          explicacao: 'A falta de sono deixa o cérebro mais reativo ao estresse e intensifica sintomas de ansiedade. Cuidar do sono é parte do cuidado com a saúde mental.' },
        { frase: 'Terapia online pode funcionar tão bem quanto a presencial.', resposta: 'verdade',
          explicacao: 'Para muitas demandas, como ansiedade e depressão, estudos mostram resultados semelhantes aos do atendimento presencial. O que mais pesa é o vínculo com o profissional.' }
      ]
    }
  };

  const exp = $('#exp');
  if (exp) {
    const TOTAL = 10; // 5 cards de importância + 5 de mito ou verdade, por tema
    const CHIPS = ['#ffe1d6', '#e7e0ff', '#fff1c7', '#dcf3d6', '#d9ecff'];
    const TABS = [
      { id: 'imp', label: 'Importância', short: 'Importância', icon: 'ph-sparkle' },
      { id: 'mv', label: 'Mito ou Verdade', short: 'Mito/Verdade', icon: 'ph-cards' },
      { id: 'quiz', label: 'Quiz rápido', short: 'Quiz', icon: 'ph-question' }
    ];
    const ARROW = '<span class="ico"><i class="ph ph-arrow-up-right"></i><i class="ph ph-arrow-up-right"></i></span>';
    const ARROW_R = '<span class="ico"><i class="ph ph-arrow-right"></i><i class="ph ph-arrow-right"></i></span>';
    const label = a => a === 'mito' ? 'Mito' : 'Verdade';
    const pad = n => String(n).padStart(2, '0');
    const smooth = reduce ? 'auto' : 'smooth';
    const stage = $('.exp-stage', exp), items = $$('.exp-item', exp), host = $('.exp-panels', exp);
    const panels = {}, state = {};

    const impCard = (c, i) => `
      <button type="button" class="imp-card card exp-in" aria-expanded="false" data-k="imp-${i}" style="--i:${i}; --chip:${CHIPS[i % CHIPS.length]}">
        <span class="imp-top"><span class="imp-ico"><i class="ph ${c.icon}"></i><i class="ph-fill ph-check-circle imp-check" aria-hidden="true"></i></span><span class="plus" aria-hidden="true"></span></span>
        <span class="title">${c.titulo}</span>
        <span class="body">${c.texto}</span>
        <span class="imp-more" aria-hidden="true"><span><span class="imp-tip"><i class="ph ph-lightbulb"></i><span><b>Dica prática</b>${c.dica}</span></span></span></span>
      </button>`;

    const mvCard = (m, i) => `
      <button type="button" class="mv-card exp-in" aria-pressed="false" data-k="mv-${i}" style="--i:${i}">
        <span class="mv-inner">
          <span class="mv-face mv-front card">
            <span class="mv-q"><b aria-hidden="true">?</b><span class="meta">Mito ou verdade · ${pad(i + 1)}</span></span>
            <span class="title">${m.frase}</span>
            <span class="meta mv-hint"><i class="ph ph-hand-tap"></i>Toque para revelar</span>
          </span>
          <span class="mv-face mv-back card is-${m.resposta}" aria-hidden="true">
            <span class="mv-badge"><i class="ph-fill ${m.resposta === 'mito' ? 'ph-x-circle' : 'ph-check-circle'}"></i>${label(m.resposta)}</span>
            <span class="body">${m.explicacao}</span>
            <span class="meta mv-hint"><i class="ph ph-arrow-counter-clockwise"></i>Toque para voltar</span>
          </span>
        </span>
      </button>`;

    const buildPanel = (key, d) => {
      const p = document.createElement('div');
      p.className = 'exp-panel glass';
      p.id = `exp-${key}`;
      p.hidden = true;
      p.setAttribute('role', 'region');
      p.setAttribute('aria-label', `${d.nome}: explorar`);
      p.style.setProperty('--chip', d.chip);
      p.innerHTML = `
        <div class="exp-head">
          <button type="button" class="btn btn-secondary btn-sm exp-back"><i class="ph ph-arrow-left"></i>Voltar</button>
          <div class="exp-theme"><span class="exp-theme-ico"><i class="ph ${d.icon}"></i></span><div><h3 class="h3">${d.nome}</h3><p class="meta">${d.sub}</p></div></div>
          <div class="exp-progress">
            <div class="exp-progress-txt meta"><span><b class="exp-count">0</b> de ${TOTAL} cards explorados</span><span class="exp-pct">0%</span></div>
            <div class="exp-bar" role="progressbar" aria-label="Cards explorados sobre ${d.artigo}" aria-valuemin="0" aria-valuemax="${TOTAL}" aria-valuenow="0"><i></i></div>
          </div>
        </div>
        <div class="exp-complete card">
          <span class="c-ico"><i class="ph ph-confetti"></i></span>
          <p class="body"><b>Tema completo!</b> Você explorou todos os cards sobre ${d.artigo}. Que tal transformar isso em cuidado de verdade?</p>
          <a href="#contato" class="btn btn-primary btn-sm">Agendar avaliação ${ARROW}</a>
        </div>
        <div class="exp-tabs-wrap">
          <div class="exp-tabs" role="tablist" aria-label="Conteúdo sobre ${d.artigo}">
            <span class="exp-tab-ind" aria-hidden="true"></span>
            ${TABS.map((t, i) => `<button type="button" class="exp-tab" role="tab" id="exp-${key}-t-${t.id}" aria-controls="exp-${key}-p-${t.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><i class="ph ${t.icon}"></i><span class="t-full">${t.label}</span><span class="t-short" aria-hidden="true">${t.short}</span></button>`).join('')}
          </div>
        </div>
        <div class="exp-views">
          <div class="exp-pane" role="tabpanel" id="exp-${key}-p-imp" aria-labelledby="exp-${key}-t-imp">
            <div class="imp-grid">${d.importancia.map(impCard).join('')}</div>
          </div>
          <div class="exp-pane" role="tabpanel" id="exp-${key}-p-mv" aria-labelledby="exp-${key}-t-mv" hidden>
            <p class="meta mv-intro"><span><i class="ph ph-hand-tap"></i> Toque nos cards para descobrir a resposta.</span><button type="button" class="link exp-goquiz">Prefere testar antes? Faça o quiz →</button></p>
            <div class="mv-grid">${d.mitos.map(mvCard).join('')}</div>
          </div>
          <div class="exp-pane" role="tabpanel" id="exp-${key}-p-quiz" aria-labelledby="exp-${key}-t-quiz" hidden>
            <div class="quiz card exp-in">
              <div class="quiz-play">
                <div class="quiz-top">
                  <span class="meta">Pergunta <b class="quiz-n">1</b> de ${d.mitos.length}</span>
                  <span class="pill quiz-score"><i class="ph-fill ph-star"></i><span><b class="quiz-pts">0</b> <span class="quiz-pl">acertos</span></span></span>
                </div>
                <div class="quiz-dots" aria-hidden="true">${d.mitos.map(() => '<i></i>').join('')}</div>
                <p class="h3 quiz-q"></p>
                <div class="quiz-opts">
                  <button type="button" class="btn btn-secondary quiz-opt" data-a="mito"><i class="ph ph-x-circle"></i>Mito</button>
                  <button type="button" class="btn btn-secondary quiz-opt" data-a="verdade"><i class="ph ph-check-circle"></i>Verdade</button>
                </div>
                <div class="quiz-fb" aria-live="polite"><div><div class="quiz-fb-in">
                  <p class="title quiz-res"></p>
                  <p class="body quiz-exp"></p>
                  <button type="button" class="btn btn-primary quiz-next"><span class="quiz-next-txt">Próxima pergunta</span>${ARROW_R}</button>
                </div></div></div>
              </div>
              <div class="quiz-end" hidden>
                <div class="eyebrow"><em>Resultado!</em></div>
                <span class="numeral"><span class="quiz-final">0</span><sup>/${d.mitos.length}</sup></span>
                <p class="title quiz-msg"></p>
                <div class="quiz-end-btns">
                  <button type="button" class="btn btn-secondary quiz-again"><i class="ph ph-arrow-counter-clockwise"></i>Jogar de novo</button>
                  <a href="#contato" class="btn btn-primary">Agendar avaliação ${ARROW}</a>
                </div>
              </div>
            </div>
          </div>
        </div>`;
      return p;
    };

    /* indicador preto das abas */
    const moveInd = (p, instant) => {
      const ind = $('.exp-tab-ind', p), t = $('.exp-tab[aria-selected="true"]', p);
      if (!ind || !t || !t.offsetWidth) return;
      if (instant) ind.style.transition = 'none';
      ind.style.width = t.offsetWidth + 'px';
      ind.style.transform = `translateX(${t.offsetLeft}px)`;
      if (instant) { ind.offsetWidth; ind.style.transition = ''; }
    };

    /* troca de aba com altura animada */
    const selectTab = (p, idx, focus) => {
      const tabs = $$('.exp-tab', p), panes = $$('.exp-pane', p), views = $('.exp-views', p);
      const cur = panes.findIndex(x => !x.hidden);
      tabs.forEach((t, i) => { t.setAttribute('aria-selected', i === idx); t.tabIndex = i === idx ? 0 : -1; });
      moveInd(p);
      if (focus) tabs[idx].focus({ preventScroll: true });
      if (cur === idx) return;
      const h0 = views.offsetHeight;
      panes[cur].hidden = true;
      panes[idx].hidden = false;
      panes[idx].classList.remove('is-entering'); panes[idx].offsetWidth; panes[idx].classList.add('is-entering');
      const h1 = views.offsetHeight;
      if (!reduce && h0 !== h1) {
        views.style.overflow = 'hidden';
        const a = views.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' });
        a.onfinish = a.oncancel = () => { views.style.overflow = ''; };
      }
      if (idx === 2 && !state[p.dataset.key].quiz) quizStart(p.dataset.key);
    };

    /* confete com as cores do site */
    const confetti = src => {
      if (reduce) return;
      const r = src && src.getBoundingClientRect();
      const x = r && r.bottom > 0 && r.top < innerHeight ? r.left + r.width / 2 : innerWidth / 2;
      const y = r && r.bottom > 0 && r.top < innerHeight ? r.top + Math.min(r.height / 2, 120) : innerHeight * .4;
      const layer = document.createElement('div');
      layer.className = 'exp-confetti';
      layer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(layer);
      const colors = ['#ff3700', '#0cb300', '#000', '#ffe1d6', '#e7e0ff', '#fff1c7', '#dcf3d6', '#d9ecff', '#ffdbe8'];
      for (let i = 0; i < 120; i++) {
        const c = document.createElement('i'), s = 6 + Math.random() * 8;
        c.style.cssText = `left:${x}px; top:${y}px; width:${s}px; height:${Math.random() < .5 ? s : s * .45}px; background:${colors[i % colors.length]}; border-radius:${Math.random() < .35 ? '50%' : '2px'}`;
        layer.appendChild(c);
        const ang = (-160 + Math.random() * 140) * Math.PI / 180, v = 220 + Math.random() * 420;
        const dx = Math.cos(ang) * v, dy = Math.sin(ang) * v, rot = (Math.random() - .5) * 1080;
        c.animate([
          { transform: 'translate(-50%,-50%) translate(0,0) rotate(0deg)', opacity: 1, easing: 'cubic-bezier(.2,.8,.4,1)' },
          { transform: `translate(-50%,-50%) translate(${dx}px,${dy}px) rotate(${rot / 2}deg)`, opacity: 1, offset: .4, easing: 'cubic-bezier(.5,0,.9,.6)' },
          { transform: `translate(-50%,-50%) translate(${dx * 1.35}px,${dy + 560}px) rotate(${rot}deg)`, opacity: 0 }
        ], { duration: 1800 + Math.random() * 1000, fill: 'forwards' });
      }
      setTimeout(() => layer.remove(), 3200);
    };

    let toastEl, toastT;
    const toast = key => {
      const d = EXP_DATA[key];
      if (!toastEl) {
        toastEl = document.createElement('div');
        toastEl.className = 'exp-toast pill';
        toastEl.setAttribute('role', 'status');
        document.body.appendChild(toastEl);
        toastEl.addEventListener('click', e => { if (e.target.closest('.exp-toast-x')) toastEl.classList.remove('show'); });
      }
      toastEl.innerHTML = `<span class="c-ico"><i class="ph ph-confetti"></i></span><span><b>Tema completo!</b> Você explorou tudo sobre ${d.artigo}.</span><button type="button" class="exp-toast-x" aria-label="Fechar aviso"><i class="ph ph-x"></i></button>`;
      requestAnimationFrame(() => toastEl.classList.add('show'));
      clearTimeout(toastT);
      toastT = setTimeout(() => toastEl.classList.remove('show'), 6500);
    };

    /* progresso: "3 de 10" */
    const markSeen = (key, k, src) => {
      const s = state[key];
      if (s.seen.has(k)) return;
      s.seen.add(k);
      const p = panels[key], n = s.seen.size, bar = $('.exp-bar', p);
      $('.exp-count', p).textContent = n;
      $('.exp-pct', p).textContent = Math.round(n / TOTAL * 100) + '%';
      $('i', bar).style.width = n / TOTAL * 100 + '%';
      bar.setAttribute('aria-valuenow', n);
      bar.classList.remove('bump'); bar.offsetWidth; bar.classList.add('bump');
      if (n === TOTAL && !s.done) {
        s.done = true;
        setTimeout(() => {
          p.classList.add('is-done');
          items.find(it => it.dataset.theme === key).classList.add('is-done');
          confetti(src);
          toast(key);
        }, reduce ? 0 : 450);
      }
    };

    /* quiz */
    const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const quizStart = key => {
      const p = panels[key], d = EXP_DATA[key];
      state[key].quiz = { order: shuffle(d.mitos.map((_, i) => i)), idx: 0, pts: 0, done: false };
      $('.quiz-play', p).hidden = false;
      $('.quiz-end', p).hidden = true;
      $('.quiz-pts', p).textContent = 0;
      $('.quiz-pl', p).textContent = 'acertos';
      $$('.quiz-dots i', p).forEach(dt => dt.className = '');
      quizShow(key);
    };
    const quizShow = key => {
      const p = panels[key], q = state[key].quiz, m = EXP_DATA[key].mitos[q.order[q.idx]];
      q.done = false;
      $('.quiz-n', p).textContent = q.idx + 1;
      const qq = $('.quiz-q', p);
      qq.innerHTML = `<span><em>“</em>${m.frase}<em>”</em></span>`;
      qq.classList.remove('swap'); qq.offsetWidth; qq.classList.add('swap');
      $$('.quiz-opt', p).forEach(o => { o.disabled = false; o.classList.remove('right', 'wrong', 'fade'); });
      $('.quiz-fb', p).classList.remove('show');
      $$('.quiz-dots i', p).forEach((dt, i) => dt.classList.toggle('now', i === q.idx));
    };
    const quizAnswer = (key, btn) => {
      const p = panels[key], q = state[key].quiz;
      if (!q || q.done) return;
      q.done = true;
      const m = EXP_DATA[key].mitos[q.order[q.idx]], ok = btn.dataset.a === m.resposta;
      if (ok) {
        q.pts++;
        const sc = $('.quiz-score', p);
        $('.quiz-pts', p).textContent = q.pts;
        $('.quiz-pl', p).textContent = q.pts === 1 ? 'acerto' : 'acertos';
        sc.classList.remove('pop'); sc.offsetWidth; sc.classList.add('pop');
      }
      $$('.quiz-opt', p).forEach(o => {
        o.disabled = true;
        if (o.dataset.a === m.resposta) o.classList.add('right');
        else if (o === btn) o.classList.add('wrong');
        else o.classList.add('fade');
      });
      const dot = $$('.quiz-dots i', p)[q.idx];
      dot.classList.remove('now'); dot.classList.add(ok ? 'ok' : 'no');
      const res = $('.quiz-res', p);
      res.className = 'title quiz-res ' + (ok ? 'ok' : 'no');
      res.innerHTML = ok
        ? `<i class="ph-fill ph-check-circle"></i>Acertou! É ${label(m.resposta).toLowerCase()}.`
        : `<i class="ph-fill ph-x-circle"></i>Quase! A resposta certa é ${label(m.resposta).toLowerCase()}.`;
      $('.quiz-exp', p).textContent = m.explicacao;
      $('.quiz-next-txt', p).textContent = q.idx === q.order.length - 1 ? 'Ver resultado' : 'Próxima pergunta';
      $('.quiz-fb', p).classList.add('show');
      setTimeout(() => $('.quiz-next', p).focus({ preventScroll: true }), 300);
    };
    const quizNext = key => {
      const p = panels[key], q = state[key].quiz, n = q.order.length;
      q.idx++;
      if (q.idx < n) { quizShow(key); $('.quiz-opt', p).focus({ preventScroll: true }); return; }
      $('.quiz-play', p).hidden = true;
      const end = $('.quiz-end', p);
      end.hidden = false;
      end.classList.remove('is-entering'); end.offsetWidth; end.classList.add('is-entering');
      $('.quiz-final', p).textContent = q.pts;
      $('.quiz-msg', p).textContent = q.pts === n ? 'Gabaritou! Você está craque no assunto.'
        : q.pts >= n - 2 ? 'Muito bem! Você já sabe bastante e agora sabe ainda mais.'
        : 'Valeu por testar! Agora você conhece as respostas certas.';
      if (q.pts === n) confetti($('.quiz-final', p));
      $('.quiz-again', p).focus({ preventScroll: true });
    };

    /* escolher um tema / voltar */
    const isMobile = () => matchMedia('(max-width:809.98px)').matches;
    const choose = key => {
      const prev = exp.dataset.on, p = panels[key];
      if (prev === key) { p.scrollIntoView({ behavior: smooth, block: 'start' }); return; }
      exp.dataset.on = key;
      exp.classList.add('has-choice');
      items.forEach(it => {
        const on = it.dataset.theme === key;
        it.classList.toggle('is-on', on);
        it.classList.toggle('is-dim', !on);
        it.setAttribute('aria-expanded', on);
        $('.exp-go-txt', it).textContent = on ? 'Explorando' : 'Trocar';
        $('.exp-tip-txt', it).textContent = 'Clique para trocar';
      });
      Object.entries(panels).forEach(([k, o]) => { if (k !== key) { o.hidden = true; o.classList.remove('is-in', 'is-out'); } });
      p.hidden = false;
      p.classList.remove('is-in', 'is-out'); p.offsetWidth; p.classList.add('is-in');
      moveInd(p, true);
      setTimeout(() => {
        const target = isMobile() ? p : stage;
        scrollTo({ top: target.getBoundingClientRect().top + scrollY - (isMobile() ? 90 : 110), behavior: smooth });
      }, isMobile() && !reduce ? 650 : 60);
    };
    const back = () => {
      const key = exp.dataset.on;
      if (!key) return;
      const p = panels[key], it = items.find(x => x.dataset.theme === key);
      p.classList.remove('is-in'); p.classList.add('is-out');
      setTimeout(() => { if (exp.dataset.on !== key) { p.hidden = true; p.classList.remove('is-out'); } }, reduce ? 0 : 340);
      delete exp.dataset.on;
      exp.classList.remove('has-choice');
      items.forEach(x => {
        x.classList.remove('is-on', 'is-dim');
        x.setAttribute('aria-expanded', 'false');
        $('.exp-go-txt', x).textContent = 'Explorar';
        $('.exp-tip-txt', x).textContent = 'Clique para explorar';
      });
      scrollTo({ top: $('#explore').getBoundingClientRect().top + scrollY - 20, behavior: smooth });
      it.focus({ preventScroll: true });
    };

    /* monta os painéis e liga os eventos */
    Object.entries(EXP_DATA).forEach(([key, d]) => {
      state[key] = { seen: new Set(), done: false, quiz: null };
      const p = buildPanel(key, d);
      p.dataset.key = key;
      panels[key] = p;
      host.appendChild(p);
      const tabs = $$('.exp-tab', p);
      p.addEventListener('click', e => {
        const t = e.target;
        const imp = t.closest('.imp-card');
        if (imp) {
          const open = imp.getAttribute('aria-expanded') !== 'true';
          imp.setAttribute('aria-expanded', open);
          $('.imp-more', imp).setAttribute('aria-hidden', !open);
          if (open) { imp.classList.add('seen'); markSeen(key, imp.dataset.k, imp); }
          return;
        }
        const mv = t.closest('.mv-card');
        if (mv) {
          const f = !mv.classList.contains('flipped');
          mv.classList.toggle('flipped', f);
          mv.setAttribute('aria-pressed', f);
          $('.mv-front', mv).setAttribute('aria-hidden', f);
          $('.mv-back', mv).setAttribute('aria-hidden', !f);
          if (f) markSeen(key, mv.dataset.k, mv);
          return;
        }
        const tab = t.closest('.exp-tab');
        if (tab) { selectTab(p, tabs.indexOf(tab)); return; }
        if (t.closest('.exp-back')) { back(); return; }
        if (t.closest('.exp-goquiz')) { selectTab(p, 2, true); return; }
        const opt = t.closest('.quiz-opt');
        if (opt) { quizAnswer(key, opt); return; }
        if (t.closest('.quiz-next')) { quizNext(key); return; }
        if (t.closest('.quiz-again')) { quizStart(key); $('.quiz-opt', p).focus({ preventScroll: true }); }
      });
      /* teclado nas abas: setas, Home e End */
      $('.exp-tabs', p).addEventListener('keydown', e => {
        const i = tabs.indexOf(document.activeElement);
        if (i < 0) return;
        const n = { ArrowRight: (i + 1) % tabs.length, ArrowLeft: (i - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1 }[e.key];
        if (n === undefined) return;
        e.preventDefault();
        selectTab(p, n, true);
      });
    });
    items.forEach(it => it.addEventListener('click', () => choose(it.dataset.theme)));
    exp.addEventListener('keydown', e => { if (e.key === 'Escape' && exp.dataset.on) back(); });
    addEventListener('resize', () => { if (exp.dataset.on) moveInd(panels[exp.dataset.on], true); });
  }

  /* ---------- cursor da galeria ---------- */
  const gal = $('#gallery'), badge = $('#cursorBadge');
  if (gal && matchMedia('(hover:hover)').matches) {
    gal.addEventListener('mousemove', e => { badge.style.left = e.clientX + 'px'; badge.style.top = e.clientY + 'px'; badge.classList.add('show'); });
    gal.addEventListener('mouseleave', () => badge.classList.remove('show'));
  }

  /* ---------- chips do hero: parallax com o mouse ---------- */
  const chips = $$('.float-chip');
  if (chips.length && !reduce && matchMedia('(hover:hover)').matches) {
    addEventListener('mousemove', e => {
      if (scrollY > innerHeight) return;
      const x = (e.clientX / innerWidth - .5), y = (e.clientY / innerHeight - .5);
      chips.forEach((c, i) => { const k = (i % 2 ? -1 : 1) * (14 + i * 6); c.style.translate = `${x * k}px ${y * k}px`; });
    });
  }

  /* ---------- ano ---------- */
  $('#year').textContent = new Date().getFullYear();
})();
