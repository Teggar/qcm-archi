(function () {
  "use strict";

  // ---------- Utilitaires ----------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const nf = (n, d = 2) => Number(n).toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });
  const eur = (n) => nf(n, 2) + " €";
  const num = (v) => { const x = parseFloat(String(v).replace(",", ".")); return isFinite(x) ? x : 0; };
  const store = {
    get(k, d) { try { const v = localStorage.getItem("prepa_" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("prepa_" + k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
  };
  const h = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content; };

  QUESTIONS.forEach((q, i) => { q.id = i; });
  const LETTERS = ["A", "B", "C", "D", "E"];

  // ---------- Thème & navigation ----------
  const root = document.documentElement;
  const savedTheme = store.get("theme", null);
  if (savedTheme) root.setAttribute("data-theme", savedTheme);
  $("#themeBtn").addEventListener("click", () => {
    const dark = root.getAttribute("data-theme") ? root.getAttribute("data-theme") === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    const next = dark ? "light" : "dark";
    root.setAttribute("data-theme", next); store.set("theme", next);
  });
  const sidebar = $("#sidebar"), overlay = $("#overlay");
  const closeNav = () => { sidebar.classList.remove("open"); overlay.classList.remove("show"); };
  $("#menuBtn").addEventListener("click", () => { sidebar.classList.add("open"); overlay.classList.add("show"); });
  overlay.addEventListener("click", closeNav);

  const app = $("#app");
  const routes = { accueil: renderHome, vocabulaire: renderVocab, qcm: renderQcm, cas: renderCas, environnement: renderEnv, entretien: renderEntretien };

  function router() {
    const parts = location.hash.replace(/^#\/?/, "").split("/");
    const page = routes[parts[0]] ? parts[0] : "accueil";
    $$(".sidebar a[data-page]").forEach((a) => a.classList.toggle("active", a.dataset.page === page));
    document.removeEventListener("keydown", quizKeys);
    app.innerHTML = "";
    routes[page](app, parts[1]);
    closeNav();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", router);

  // =====================================================================
  // ACCUEIL
  // =====================================================================
  function renderHome(el) {
    const hist = store.get("history", []);
    const errors = store.get("errors", []);
    const known = store.get("known", []);
    const best = hist.length ? Math.max(...hist.map((x) => Math.round((x.score / x.n) * 100))) : null;
    const last = hist.slice(-5).reverse();

    el.append(h(`
      <h1>Préparer l'entretien d'Expert Sinistre</h1>
      <p class="lead">Révisez le vocabulaire du bâtiment et de l'assurance, entraînez-vous aux QCM, travaillez des cas chiffrés et maîtrisez la réglementation environnementale avant votre entretien chez Saretec.</p>

      <div class="grid grid-4" style="margin:22px 0">
        <div class="card stat"><div class="num">${QUESTIONS.length}</div><div class="lbl">questions de QCM</div></div>
        <div class="card stat"><div class="num">${VOCAB.length}</div><div class="lbl">termes de vocabulaire</div></div>
        <div class="card stat"><div class="num">${CAS.length}</div><div class="lbl">mises en situation</div></div>
        <div class="card stat"><div class="num">${best === null ? "—" : best + " %"}</div><div class="lbl">meilleur score (${hist.length} test${hist.length > 1 ? "s" : ""})</div></div>
      </div>

      <div class="grid grid-3">
        <a class="card card-link" href="#/vocabulaire"><h3>Vocabulaire</h3><p class="muted small">Glossaire filtrable et flashcards : construction, assurance, sinistre, environnement. ${known.length} terme(s) maîtrisé(s).</p></a>
        <a class="card card-link" href="#/qcm"><h3>QCM</h3><p class="muted small">Tests de 20 questions tirées au hasard, correction immédiate ou à la fin. ${errors.length} question(s) à revoir.</p></a>
        <a class="card card-link" href="#/cas"><h3>Mises en situation</h3><p class="muted small">Cas réels (DDE, sécheresse, DO, incendie, tempête…) avec métré, chiffrage et calculateurs.</p></a>
        <a class="card card-link" href="#/environnement"><h3>Environnement</h3><p class="muted small">RE2020, DPE, décret tertiaire, déchets, BEGES et expertise durable.</p></a>
        <a class="card card-link" href="#/entretien"><h3>Entretien</h3><p class="muted small">Processus de recrutement, questions fréquentes et pistes de réponse, trame de rapport.</p></a>
      </div>

      <h2>Plan de révision conseillé (7 jours)</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Jour</th><th>Objectif</th></tr></thead>
        <tbody>
          <tr><td>J-7</td><td>Vocabulaire construction (flashcards) + QCM « Construction & technique »</td></tr>
          <tr><td>J-6</td><td>Garanties construction (GPA, biennale, décennale, DO) + cas « Carrelage » et « DO terrasse »</td></tr>
          <tr><td>J-5</td><td>Assurance : vétusté, franchise, règles proportionnelles + cas « Sous-assurance » et « Incendie »</td></tr>
          <tr><td>J-4</td><td>Conventions (IRSI, CRAC) + cas « Dégât des eaux » ; refaire le métré sans regarder</td></tr>
          <tr><td>J-3</td><td>Environnement (RE2020, DPE, déchets) + QCM dédié</td></tr>
          <tr><td>J-2</td><td>Page Entretien : pitch, questions, exemples STAR ; cas « Assuré mécontent » à voix haute</td></tr>
          <tr><td>J-1</td><td>2 tests complets de 20 questions en mode « correction à la fin » + « Revoir mes erreurs »</td></tr>
        </tbody>
      </table></div>

      <h2>Derniers résultats</h2>
      ${last.length ? `<div class="table-wrap"><table><thead><tr><th>Date</th><th>Mode</th><th class="num">Score</th></tr></thead><tbody>
        ${last.map((x) => `<tr><td>${new Date(x.date).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}</td><td>${x.mode === "imm" ? "Correction immédiate" : "Correction à la fin"}</td><td class="num">${x.score}/${x.n} (${Math.round((x.score / x.n) * 100)} %)</td></tr>`).join("")}
      </tbody></table></div>` : `<p class="muted">Aucun test pour l'instant. <a href="#/qcm">Lancer un premier QCM</a>.</p>`}
      <p class="small muted" style="margin-top:20px">Les contenus sont des aides à la révision : vérifiez les points sensibles (seuils, dates, conventions) dans les textes en vigueur. Votre progression est enregistrée dans ce navigateur.</p>
    `));
  }

  // =====================================================================
  // VOCABULAIRE
  // =====================================================================
  const vocabState = { cat: "all", q: "", mode: "liste", deck: [], idx: 0, flipped: false, unknownOnly: false };

  function renderVocab(el) {
    el.append(h(`
      <h1>Vocabulaire</h1>
      <p class="lead">Les termes à maîtriser pour échanger avec un assuré, une entreprise ou un assureur.</p>
      <div class="tabs" role="tablist">
        <button class="tab" data-mode="liste">Glossaire</button>
        <button class="tab" data-mode="flash">Flashcards</button>
      </div>
      <div class="chips" id="vcats"></div>
      <div id="vbody"></div>
    `));
    const cats = [["all", "Tous"], ...Object.entries(VOCAB_CATS)];
    const chips = $("#vcats", el);
    cats.forEach(([k, label]) => {
      const n = k === "all" ? VOCAB.length : VOCAB.filter((v) => v.c === k).length;
      const b = document.createElement("button");
      b.className = "chip"; b.textContent = `${label} (${n})`; b.dataset.cat = k;
      b.onclick = () => { vocabState.cat = k; vocabState.deck = []; draw(); };
      chips.append(b);
    });
    $$(".tab", el).forEach((t) => t.onclick = () => { vocabState.mode = t.dataset.mode; vocabState.deck = []; draw(); });

    function filtered() {
      const q = vocabState.q.toLowerCase();
      return VOCAB.filter((v) => (vocabState.cat === "all" || v.c === vocabState.cat) &&
        (!q || v.t.toLowerCase().includes(q) || v.d.toLowerCase().includes(q)));
    }

    function draw() {
      $$(".chip", chips).forEach((c) => c.classList.toggle("on", c.dataset.cat === vocabState.cat));
      $$(".tab", el).forEach((t) => t.classList.toggle("on", t.dataset.mode === vocabState.mode));
      const body = $("#vbody", el);
      body.innerHTML = "";
      if (vocabState.mode === "liste") drawList(body); else drawFlash(body);
    }

    function drawList(body) {
      body.append(h(`<input type="search" id="vsearch" placeholder="Rechercher un terme ou une définition…" value="${esc(vocabState.q)}" style="margin-bottom:16px"><div class="vocab-grid" id="vgrid"></div>`));
      const fill = () => {
        const list = filtered().slice().sort((a, b) => a.t.localeCompare(b.t, "fr"));
        $("#vgrid", body).innerHTML = list.length ? list.map((v) => `
          <div class="card term"><h4>${esc(v.t)} <span class="tag">${esc(VOCAB_CATS[v.c].split(" ")[0])}</span></h4><p>${esc(v.d)}</p></div>`).join("")
          : `<p class="muted">Aucun résultat.</p>`;
      };
      const input = $("#vsearch", body);
      input.oninput = () => { vocabState.q = input.value; fill(); };
      fill();
    }

    function drawFlash(body) {
      const known = new Set(store.get("known", []));
      if (!vocabState.deck.length) {
        let pool = VOCAB.filter((v) => vocabState.cat === "all" || v.c === vocabState.cat);
        if (vocabState.unknownOnly) pool = pool.filter((v) => !known.has(v.t));
        vocabState.deck = shuffle(pool); vocabState.idx = 0; vocabState.flipped = false;
      }
      const deck = vocabState.deck;
      const total = VOCAB.filter((v) => vocabState.cat === "all" || v.c === vocabState.cat);
      const knownCount = total.filter((v) => known.has(v.t)).length;
      if (!deck.length || vocabState.idx >= deck.length) {
        body.append(h(`<div class="flash-wrap"><div class="card" style="text-align:center">
          <h3>${deck.length ? "Paquet terminé" : "Aucune carte à réviser"}</h3>
          <p class="muted">${knownCount} / ${total.length} termes marqués comme acquis dans cette catégorie.</p>
          <div class="row" style="justify-content:center">
            <button class="btn primary" id="restart">Recommencer</button>
            <button class="btn" id="resetKnown">Réinitialiser les termes acquis</button>
          </div></div></div>`));
        $("#restart", body).onclick = () => { vocabState.deck = []; draw(); };
        $("#resetKnown", body).onclick = () => { store.set("known", [...known].filter((t) => !total.some((v) => v.t === t))); vocabState.deck = []; draw(); };
        return;
      }
      const card = deck[vocabState.idx];
      body.append(h(`<div class="flash-wrap">
        <div class="row small muted" style="margin-bottom:8px">
          <span>Carte ${vocabState.idx + 1} / ${deck.length}</span><span class="spacer"></span>
          <label class="check"><input type="checkbox" id="unk" ${vocabState.unknownOnly ? "checked" : ""}> Seulement les termes non acquis</label>
        </div>
        <div class="progress" style="margin-bottom:14px"><span style="width:${(vocabState.idx / deck.length) * 100}%"></span></div>
        <div class="card flash" id="fcard" tabindex="0" role="button" aria-label="Retourner la carte">
          ${vocabState.flipped
            ? `<div><div class="tag" style="margin-bottom:10px">${esc(card.t)}</div><div class="fd">${esc(card.d)}</div></div>`
            : `<div><div class="ft">${esc(card.t)}</div><p class="muted small" style="margin-top:12px">Cliquez (ou Espace) pour voir la définition</p></div>`}
        </div>
        <div class="row" style="justify-content:center;margin-top:14px">
          <button class="btn" id="again">À revoir</button>
          <button class="btn primary" id="gotit">Je savais ✓</button>
        </div>
        <p class="small muted" style="text-align:center;margin-top:10px">${knownCount} / ${total.length} termes acquis</p>
      </div>`));
      const flip = () => { vocabState.flipped = !vocabState.flipped; draw(); };
      $("#fcard", body).onclick = flip;
      $("#fcard", body).onkeydown = (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); } };
      $("#unk", body).onchange = (e) => { vocabState.unknownOnly = e.target.checked; vocabState.deck = []; draw(); };
      $("#gotit", body).onclick = () => { known.add(card.t); store.set("known", [...known]); vocabState.idx++; vocabState.flipped = false; draw(); };
      $("#again", body).onclick = () => { known.delete(card.t); store.set("known", [...known]); deck.push(card); vocabState.idx++; vocabState.flipped = false; draw(); };
      $("#fcard", body).focus();
    }
    draw();
  }

  // =====================================================================
  // QCM
  // =====================================================================
  let quiz = null;
  let qcmPreset = null;
  const qcmCfg = store.get("qcmCfg", { n: 20, mode: "imm", cats: Object.keys(QCM_CATS), onlyErrors: false });

  function renderQcm(el, sub) {
    el.append(h(`
      <h1>QCM</h1>
      <div class="tabs">
        <a class="tab ${sub !== "banque" ? "on" : ""}" href="#/qcm">Passer un test</a>
        <a class="tab ${sub === "banque" ? "on" : ""}" href="#/qcm/banque">Banque de questions (${QUESTIONS.length})</a>
      </div>
      <div id="qbody"></div>`));
    $$(".tab", el).forEach((a) => a.style.textDecoration = "none");
    const body = $("#qbody", el);
    if (sub === "banque") return drawBank(body);
    if (qcmPreset) { qcmCfg.cats = qcmPreset; qcmPreset = null; quiz = null; }
    if (quiz && !quiz.done) return drawQuiz(body);
    if (quiz && quiz.done) return drawResults(body);
    drawConfig(body);
  }

  function drawConfig(body) {
    const errors = store.get("errors", []);
    body.innerHTML = "";
    body.append(h(`
      <div class="card">
        <h3>Paramètres du test</h3>
        <p class="muted small">Les questions et l'ordre des réponses sont tirés au hasard à chaque test.</p>
        <div class="grid grid-2" style="margin-top:12px">
          <div>
            <b class="small">Nombre de questions</b>
            <div class="chips" id="cfgN">${[10, 20, 30, 50].map((n) => `<button class="chip" data-n="${n}">${n}</button>`).join("")}</div>
            <b class="small">Correction</b>
            <div class="chips" id="cfgMode">
              <button class="chip" data-m="imm">Immédiate (réponse après chaque question)</button>
              <button class="chip" data-m="fin">À la fin (conditions d'examen)</button>
            </div>
            <label class="check small"><input type="checkbox" id="cfgErr" ${qcmCfg.onlyErrors ? "checked" : ""}> Uniquement mes erreurs passées (${errors.length})</label>
          </div>
          <div>
            <b class="small">Thèmes</b>
            <div id="cfgCats" style="margin-top:8px">
              ${Object.entries(QCM_CATS).map(([k, l]) => `<label class="check" style="margin:6px 0"><input type="checkbox" value="${k}" ${qcmCfg.cats.includes(k) ? "checked" : ""}> ${l} <span class="muted small">(${QUESTIONS.filter((q) => q.c === k).length})</span></label>`).join("")}
            </div>
            <div class="row small" style="margin-top:6px"><button class="btn sm ghost" id="allCats">Tout cocher</button><button class="btn sm ghost" id="noCats">Tout décocher</button></div>
          </div>
        </div>
        <div class="row" style="margin-top:16px">
          <button class="btn primary" id="go">Commencer le test</button>
          <span class="muted small" id="poolInfo"></span>
        </div>
      </div>`));
    const syncChips = () => {
      $$("#cfgN .chip", body).forEach((c) => c.classList.toggle("on", +c.dataset.n === qcmCfg.n));
      $$("#cfgMode .chip", body).forEach((c) => c.classList.toggle("on", c.dataset.m === qcmCfg.mode));
      const pool = poolFor(qcmCfg);
      $("#poolInfo", body).textContent = `${pool.length} question(s) disponibles avec ces filtres.`;
      $("#go", body).disabled = !pool.length;
    };
    $$("#cfgN .chip", body).forEach((c) => c.onclick = () => { qcmCfg.n = +c.dataset.n; syncChips(); });
    $$("#cfgMode .chip", body).forEach((c) => c.onclick = () => { qcmCfg.mode = c.dataset.m; syncChips(); });
    const readCats = () => { qcmCfg.cats = $$("#cfgCats input:checked", body).map((i) => i.value); syncChips(); };
    $$("#cfgCats input", body).forEach((i) => i.onchange = readCats);
    $("#allCats", body).onclick = () => { $$("#cfgCats input", body).forEach((i) => i.checked = true); readCats(); };
    $("#noCats", body).onclick = () => { $$("#cfgCats input", body).forEach((i) => i.checked = false); readCats(); };
    $("#cfgErr", body).onchange = (e) => { qcmCfg.onlyErrors = e.target.checked; syncChips(); };
    $("#go", body).onclick = () => {
      store.set("qcmCfg", qcmCfg);
      const pool = shuffle(poolFor(qcmCfg)).slice(0, qcmCfg.n);
      quiz = {
        mode: qcmCfg.mode, idx: 0, done: false, start: Date.now(),
        items: pool.map((q) => ({ q, opts: shuffle(q.r.map((t, i) => ({ t, ok: i === 0 }))), sel: null, revealed: false }))
      };
      drawQuiz(body);
    };
    syncChips();
  }

  function poolFor(cfg) {
    let pool = QUESTIONS.filter((q) => cfg.cats.includes(q.c));
    if (cfg.onlyErrors) { const err = new Set(store.get("errors", [])); pool = pool.filter((q) => err.has(q.id)); }
    return pool;
  }

  let quizBody = null;
  function quizKeys(e) {
    if (!quiz || quiz.done || !quizBody || /input|textarea|select/i.test(e.target.tagName)) return;
    const it = quiz.items[quiz.idx];
    const k = e.key.toUpperCase();
    const li = LETTERS.indexOf(k) >= 0 ? LETTERS.indexOf(k) : ("1234".indexOf(k));
    if (li >= 0 && li < it.opts.length) { choose(li); e.preventDefault(); }
    else if (e.key === "Enter" || e.key === "ArrowRight") { const n = $("#next", quizBody); if (n && !n.disabled) { n.click(); e.preventDefault(); } }
    else if (e.key === "ArrowLeft") { const p = $("#prev", quizBody); if (p && !p.disabled) p.click(); }
  }

  function choose(i) {
    const it = quiz.items[quiz.idx];
    if (quiz.mode === "imm") { if (it.revealed) return; it.sel = i; it.revealed = true; }
    else it.sel = i;
    drawQuiz(quizBody);
  }

  function drawQuiz(body) {
    quizBody = body;
    document.removeEventListener("keydown", quizKeys);
    document.addEventListener("keydown", quizKeys);
    const it = quiz.items[quiz.idx];
    const n = quiz.items.length;
    const imm = quiz.mode === "imm";
    const answered = quiz.items.filter((x) => x.sel !== null).length;
    const showCorr = imm && it.revealed;
    const isLast = quiz.idx === n - 1;
    body.innerHTML = "";
    body.append(h(`
      <div class="card">
        <div class="qcm-head">
          <span class="tag">${esc(QCM_CATS[it.q.c])}</span>
          <span class="muted small">Question ${quiz.idx + 1} / ${n} · ${imm ? "correction immédiate" : `${answered} répondue(s)`}</span>
        </div>
        <div class="progress"><span style="width:${((quiz.idx + (showCorr ? 1 : 0)) / n) * 100}%"></span></div>
        <div class="question">${esc(it.q.q)}</div>
        <div class="choices">
          ${it.opts.map((o, i) => {
            let cls = "";
            if (showCorr) { if (o.ok) cls = "ok"; else if (it.sel === i) cls = "ko"; }
            else if (it.sel === i) cls = "sel";
            return `<button class="choice ${cls}" data-i="${i}" ${showCorr ? "disabled" : ""}><span class="letter">${LETTERS[i]}</span><span>${esc(o.t)}</span></button>`;
          }).join("")}
        </div>
        ${showCorr ? `<div class="callout ${it.sel !== null && it.opts[it.sel].ok ? "ok" : "warn"} explain">
            <b>${it.sel === null ? "Réponse affichée" : it.opts[it.sel].ok ? "Bonne réponse !" : "Mauvaise réponse."}</b>
            ${it.sel === null || !it.opts[it.sel].ok ? `<br>La bonne réponse : <b>${esc(it.opts.find((o) => o.ok).t)}</b>` : ""}
            <div style="margin-top:6px">${esc(it.q.e)}</div></div>` : ""}
        <div class="row" style="margin-top:18px">
          ${imm ? "" : `<button class="btn" id="prev" ${quiz.idx === 0 ? "disabled" : ""}>← Précédente</button>`}
          ${imm && !it.revealed ? `<button class="btn" id="reveal">Voir la réponse</button>` : ""}
          <span class="spacer"></span>
          <button class="btn ghost sm" id="quit">Abandonner</button>
          ${imm
            ? `<button class="btn primary" id="next" ${it.revealed ? "" : "disabled"}>${isLast ? "Voir les résultats" : "Suivante →"}</button>`
            : (isLast ? `<button class="btn primary" id="finish">Terminer le test</button>` : `<button class="btn primary" id="next">Suivante →</button>`)}
        </div>
        ${imm ? "" : `<div class="palette">${quiz.items.map((x, i) => `<button data-j="${i}" class="${x.sel !== null ? "answered" : ""} ${i === quiz.idx ? "current" : ""}">${i + 1}</button>`).join("")}</div>
          ${!isLast ? `<div class="row" style="margin-top:12px"><span class="spacer"></span><button class="btn sm" id="finish">Terminer maintenant</button></div>` : ""}`}
        <p class="small muted" style="margin-top:12px">Raccourcis : A/B/C/D ou 1-4 pour répondre, Entrée pour continuer.</p>
      </div>`));
    $$(".choice", body).forEach((b) => b.onclick = () => choose(+b.dataset.i));
    const go = (d) => { quiz.idx += d; drawQuiz(body); window.scrollTo(0, 0); };
    const next = $("#next", body);
    if (next) next.onclick = () => (isLast ? finishQuiz(body) : go(1));
    const prev = $("#prev", body); if (prev) prev.onclick = () => go(-1);
    const reveal = $("#reveal", body); if (reveal) reveal.onclick = () => { it.revealed = true; drawQuiz(body); };
    $$(".palette button", body).forEach((b) => b.onclick = () => { quiz.idx = +b.dataset.j; drawQuiz(body); });
    const fin = $("#finish", body);
    if (fin) fin.onclick = () => {
      const left = quiz.items.filter((x) => x.sel === null).length;
      if (left && !confirm(`${left} question(s) sans réponse. Terminer quand même ?`)) return;
      finishQuiz(body);
    };
    $("#quit", body).onclick = () => { if (confirm("Abandonner ce test ? Il ne sera pas enregistré.")) { quiz = null; drawConfig(body); } };
  }

  function finishQuiz(body) {
    quiz.done = true;
    quiz.end = Date.now();
    const score = quiz.items.filter((x) => x.sel !== null && x.opts[x.sel].ok).length;
    quiz.score = score;
    const hist = store.get("history", []);
    hist.push({ date: Date.now(), n: quiz.items.length, score, mode: quiz.mode });
    store.set("history", hist.slice(-50));
    const err = new Set(store.get("errors", []));
    quiz.items.forEach((x) => { if (x.sel !== null && x.opts[x.sel].ok) err.delete(x.q.id); else err.add(x.q.id); });
    store.set("errors", [...err]);
    document.removeEventListener("keydown", quizKeys);
    drawResults(body);
  }

  function drawResults(body) {
    const n = quiz.items.length, s = quiz.score, pct = Math.round((s / n) * 100);
    const secs = Math.round((quiz.end - quiz.start) / 1000);
    const byCat = {};
    quiz.items.forEach((x) => {
      const c = byCat[x.q.c] || (byCat[x.q.c] = { ok: 0, n: 0 });
      c.n++; if (x.sel !== null && x.opts[x.sel].ok) c.ok++;
    });
    const verdict = pct >= 80 ? "Excellent, vous êtes prêt sur ces thèmes." : pct >= 60 ? "Bon niveau, consolidez les points faibles." : "À retravailler : relisez les explications ci-dessous puis refaites un test.";
    let onlyBad = false;
    body.innerHTML = "";
    body.append(h(`
      <div class="card">
        <div class="row" style="align-items:flex-end;gap:24px">
          <div><div class="score-big">${s}/${n}</div><div class="muted">${pct} % · ${Math.floor(secs / 60)} min ${secs % 60} s</div></div>
          <div style="flex:1;min-width:220px"><b>${verdict}</b>
            <div style="margin-top:10px">${Object.entries(byCat).map(([c, v]) => `
              <div class="bar-row"><span class="small">${esc(QCM_CATS[c])}</span><div class="progress"><span style="width:${(v.ok / v.n) * 100}%"></span></div><span class="small num">${v.ok}/${v.n}</span></div>`).join("")}
            </div>
          </div>
        </div>
        <div class="row" style="margin-top:16px">
          <button class="btn primary" id="again">Nouveau test</button>
          <label class="check small"><input type="checkbox" id="onlyBad"> Afficher uniquement mes erreurs</label>
        </div>
      </div>
      <h2>Correction détaillée</h2>
      <div id="review"></div>`));
    const drawReview = () => {
      $("#review", body).innerHTML = quiz.items.map((x, i) => {
        const good = x.sel !== null && x.opts[x.sel].ok;
        if (onlyBad && good) return "";
        const right = x.opts.find((o) => o.ok).t;
        return `<div class="card review-item ${good ? "good" : "bad"}">
          <div class="row small muted"><span>Q${i + 1}</span><span class="tag">${esc(QCM_CATS[x.q.c])}</span></div>
          <div style="font-weight:600;margin:6px 0">${esc(x.q.q)}</div>
          <div class="ans">Votre réponse : ${x.sel === null ? `<span class="ko-txt">aucune</span>` : `<span class="${good ? "ok-txt" : "ko-txt"}">${esc(x.opts[x.sel].t)}</span>`}</div>
          ${good ? "" : `<div class="ans">Bonne réponse : <span class="ok-txt">${esc(right)}</span></div>`}
          <div class="small muted" style="margin-top:6px">${esc(x.q.e)}</div>
        </div>`;
      }).join("") || `<p class="muted">Aucune erreur, bravo !</p>`;
    };
    $("#onlyBad", body).onchange = (e) => { onlyBad = e.target.checked; drawReview(); };
    $("#again", body).onclick = () => { quiz = null; drawConfig(body); window.scrollTo(0, 0); };
    drawReview();
  }

  function drawBank(body) {
    let cat = "all", q = "", showAll = false;
    body.append(h(`
      <p class="muted">Parcourez toutes les questions et affichez les réponses à la demande.</p>
      <div class="chips" id="bcats"></div>
      <div class="row" style="margin-bottom:14px">
        <input type="search" id="bsearch" placeholder="Rechercher…" style="flex:1;min-width:200px">
        <button class="btn" id="toggleAll">Afficher toutes les réponses</button>
      </div>
      <div id="blist"></div>`));
    const chips = $("#bcats", body);
    [["all", "Tous"], ...Object.entries(QCM_CATS)].forEach(([k, l]) => {
      const b = document.createElement("button"); b.className = "chip"; b.dataset.cat = k;
      b.textContent = `${l} (${k === "all" ? QUESTIONS.length : QUESTIONS.filter((x) => x.c === k).length})`;
      b.onclick = () => { cat = k; fill(); }; chips.append(b);
    });
    function fill() {
      $$(".chip", chips).forEach((c) => c.classList.toggle("on", c.dataset.cat === cat));
      const ql = q.toLowerCase();
      const list = QUESTIONS.filter((x) => (cat === "all" || x.c === cat) && (!ql || (x.q + " " + x.r.join(" ")).toLowerCase().includes(ql)));
      $("#blist", body).innerHTML = list.map((x) => `
        <details ${showAll ? "open" : ""}>
          <summary>${esc(x.q)}</summary>
          <div>
            <ul>${x.r.map((r, i) => `<li class="${i === 0 ? "ok-txt" : ""}">${i === 0 ? "✓ " : ""}${esc(r)}</li>`).join("")}</ul>
            <div class="small muted">${esc(x.e)}</div>
          </div>
        </details>`).join("") || `<p class="muted">Aucune question.</p>`;
    }
    $("#bsearch", body).oninput = (e) => { q = e.target.value; fill(); };
    $("#toggleAll", body).onclick = (e) => { showAll = !showAll; e.target.textContent = showAll ? "Masquer toutes les réponses" : "Afficher toutes les réponses"; fill(); };
    fill();
  }

  // =====================================================================
  // MISES EN SITUATION
  // =====================================================================
  function renderCas(el, sub) {
    if (sub && sub !== "outils") {
      const c = CAS.find((x) => x.id === sub);
      if (c) return drawCase(el, c);
    }
    el.append(h(`
      <h1>Mises en situation</h1>
      <p class="lead">Des cas proches du terrain : qualifiez le sinistre, identifiez la garantie, réalisez le métré et le chiffrage. Essayez de répondre avant d'afficher la correction.</p>
      <div class="tabs">
        <a class="tab ${sub !== "outils" ? "on" : ""}" href="#/cas" style="text-decoration:none">Cas pratiques</a>
        <a class="tab ${sub === "outils" ? "on" : ""}" href="#/cas/outils" style="text-decoration:none">Outils de chiffrage</a>
      </div>
      <div id="cbody"></div>`));
    const body = $("#cbody", el);
    if (sub === "outils") return drawTools(body);
    body.append(h(`<div class="grid grid-2">${CAS.map((c) => `
      <a class="card card-link" href="#/cas/${c.id}">
        <div class="row" style="margin-bottom:6px"><span class="tag">${esc(c.tag)}</span><span class="tag accent">${esc(c.niveau)}</span>${c.chiffrage ? `<span class="tag">Chiffrage</span>` : ""}</div>
        <h3>${esc(c.titre)}</h3>
        <p class="muted small" style="margin:0">${esc(c.resume)}</p>
      </a>`).join("")}</div>`));
  }

  function drawCase(el, c) {
    el.append(h(`
      <a href="#/cas" class="small">← Toutes les mises en situation</a>
      <h1 style="margin-top:10px">${esc(c.titre)}</h1>
      <div class="row" style="margin-bottom:14px"><span class="tag">${esc(c.tag)}</span><span class="tag accent">${esc(c.niveau)}</span></div>
      <div class="card"><h3>Contexte</h3>${c.contexte}
        <h3>Données</h3><ul>${c.donnees.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
      </div>
      <h2>Questions</h2>
      <div class="row" style="margin-bottom:8px"><span class="spacer"></span><button class="btn sm" id="showAllSol">Afficher toutes les corrections</button></div>
      <div id="steps"></div>
      <div id="chiffrage"></div>
      <h2>À retenir</h2>
      <div class="callout ok"><ul style="margin:0">${c.retenir.map((r) => `<li>${esc(r)}</li>`).join("")}</ul></div>
    `));
    const steps = $("#steps", el);
    c.etapes.forEach((s, i) => {
      const key = `note_${c.id}_${i}`;
      const node = h(`<div class="card step">
        <div class="step-q">${i + 1}. ${esc(s.q)}</div>
        <textarea placeholder="Votre réponse (enregistrée automatiquement dans ce navigateur)…" style="margin-top:10px">${esc(store.get(key, ""))}</textarea>
        <div class="row" style="margin-top:8px"><button class="btn sm sol-btn">Voir la correction</button></div>
        <div class="solution callout hidden">${s.r}</div>
      </div>`);
      steps.append(node);
      const card = steps.lastElementChild;
      $("textarea", card).oninput = (e) => store.set(key, e.target.value);
      $(".sol-btn", card).onclick = (e) => {
        const sol = $(".solution", card); sol.classList.toggle("hidden");
        e.target.textContent = sol.classList.contains("hidden") ? "Voir la correction" : "Masquer la correction";
      };
    });
    $("#showAllSol", el).onclick = () => { $$(".solution", steps).forEach((s) => s.classList.remove("hidden")); $$(".sol-btn", steps).forEach((b) => b.textContent = "Masquer la correction"); };
    if (c.chiffrage) drawChiffrage($("#chiffrage", el), c);
  }

  function drawChiffrage(box, c) {
    const ch = c.chiffrage;
    const lignes = ch.lignes.map((l) => ({ ...l }));
    box.append(h(`
      <h2>Chiffrage</h2>
      <div class="card">
        <p>Établissez votre propre estimation (métré × prix unitaires), puis comparez avec la proposition de correction. <span class="muted small">Les prix sont des ordres de grandeur HT indicatifs : vous pouvez modifier quantités et prix unitaires.</span></p>
        <div class="row">
          <label class="field" style="max-width:240px">Votre estimation (total HT, €)<input type="number" id="myEst" min="0" step="10"></label>
          <button class="btn primary" id="showCh" style="align-self:flex-end">Afficher le chiffrage corrigé</button>
        </div>
        <div id="cmp" class="small" style="margin-top:8px"></div>
      </div>
      <div id="chTable" class="hidden" style="margin-top:14px"></div>`));
    const tbl = $("#chTable", box);
    function compute() {
      let ht = 0, vet = 0;
      lignes.forEach((l) => { l.tot = l.q * l.pu; ht += l.tot; vet += l.tot * (1 + ch.tva / 100) * (l.v / 100); });
      const tva = ht * ch.tva / 100, ttc = ht + tva;
      let indem = Math.max(0, ttc - vet - ch.franchise);
      const avantCoef = indem;
      if (ch.coef) indem = indem * ch.coef.value;
      return { ht, tva, ttc, vet, indem, avantCoef };
    }
    function draw() {
      const r = compute();
      tbl.innerHTML = `
        <div class="table-wrap"><table>
          <thead><tr><th>Désignation</th><th>U</th><th class="num">Qté</th><th class="num">PU HT</th><th class="num">Total HT</th><th class="num">Vétusté</th></tr></thead>
          <tbody>${lignes.map((l, i) => `<tr>
            <td>${esc(l.d)}<div class="calc-line">Métré : ${esc(l.calc)}</div></td>
            <td>${esc(l.u)}</td>
            <td class="num"><input class="pu" data-i="${i}" data-k="q" type="number" step="0.1" value="${l.q}"></td>
            <td class="num"><input class="pu" data-i="${i}" data-k="pu" type="number" step="0.5" value="${l.pu}"></td>
            <td class="num">${eur(l.tot)}</td>
            <td class="num">${l.v ? l.v + " %" : "—"}</td></tr>`).join("")}
          </tbody>
          <tfoot>
            <tr><td colspan="4">Total HT</td><td class="num">${eur(r.ht)}</td><td></td></tr>
            <tr><td colspan="4">TVA ${ch.tva} %</td><td class="num">${eur(r.tva)}</td><td></td></tr>
            <tr><td colspan="4">Total TTC (valeur à neuf)</td><td class="num">${eur(r.ttc)}</td><td></td></tr>
            <tr><td colspan="4">Vétusté déduite (sur TTC)</td><td class="num">− ${eur(r.vet)}</td><td></td></tr>
            <tr><td colspan="4">Franchise</td><td class="num">− ${eur(ch.franchise)}</td><td></td></tr>
            ${ch.coef ? `<tr><td colspan="4">Sous-total</td><td class="num">${eur(r.avantCoef)}</td><td></td></tr>
            <tr><td colspan="4">${esc(ch.coef.label)} × ${nf(ch.coef.value, 4)}</td><td class="num">− ${eur(r.avantCoef - r.indem)}</td><td></td></tr>` : ""}
            <tr class="total"><td colspan="4">Indemnité immédiate</td><td class="num">${eur(r.indem)}</td><td></td></tr>
          </tfoot>
        </table></div>
        <p class="small muted" style="margin-top:8px">${esc(ch.note)}${r.vet > 0 ? " La vétusté peut être partiellement récupérable sur factures selon le contrat (indemnité différée)." : ""}</p>`;
      $$("input.pu", tbl).forEach((inp) => inp.onchange = () => { lignes[+inp.dataset.i][inp.dataset.k] = num(inp.value); draw(); compare(); });
    }
    function compare() {
      const mine = num($("#myEst", box).value);
      if (!mine || tbl.classList.contains("hidden")) { $("#cmp", box).innerHTML = ""; return; }
      const ref = compute().ht, ecart = ((mine - ref) / ref) * 100;
      const ok = Math.abs(ecart) <= 15;
      $("#cmp", box).innerHTML = `Votre estimation : <b>${eur(mine)}</b> · Correction : <b>${eur(ref)}</b> · Écart : <b class="${ok ? "ok-txt" : "ko-txt"}">${ecart > 0 ? "+" : ""}${nf(ecart, 1)} %</b> ${ok ? "— dans la fourchette, bravo." : "— vérifiez vos quantités et vos postes oubliés."}`;
    }
    $("#showCh", box).onclick = (e) => { tbl.classList.toggle("hidden"); e.target.textContent = tbl.classList.contains("hidden") ? "Afficher le chiffrage corrigé" : "Masquer le chiffrage"; compare(); };
    $("#myEst", box).oninput = compare;
    draw();
  }

  // ---------- Calculateurs ----------
  const CALCS = [
    { id: "piece", titre: "Métré d'une pièce", desc: "Surfaces de murs, plafond, sol, plinthes et quantité de peinture.",
      f: [["L", "Longueur (m)", 4], ["l", "Largeur (m)", 3], ["h", "Hauteur (m)", 2.5], ["op", "Surface des ouvertures (m²)", 3.39], ["pt", "Largeur cumulée des portes (m)", 0.9], ["co", "Couches de peinture", 2], ["re", "Rendement peinture (m²/L)", 10], ["ch", "Chutes revêtement sol (%)", 10]],
      run: (v) => { const sol = v.L * v.l, per = 2 * (v.L + v.l), mb = per * v.h, mn = Math.max(0, mb - v.op);
        return [["Surface au sol / plafond", nf(sol) + " m²"], ["Périmètre", nf(per) + " ml"], ["Murs bruts", nf(mb) + " m²"], ["Murs nets (ouvertures déduites)", nf(mn) + " m²"],
          ["Plinthes", nf(Math.max(0, per - v.pt)) + " ml"], ["Peinture murs + plafond", nf(v.re ? (mn + sol) * v.co / v.re : 0, 1) + " L"], ["Revêtement de sol à commander", nf(sol * (1 + v.ch / 100)) + " m²"]]; } },
    { id: "vetuste", titre: "Vétusté et indemnité", desc: "Vétusté linéaire plafonnée, franchise, vétusté récupérable.",
      f: [["van", "Valeur à neuf TTC (€)", 4000], ["age", "Âge du bien (ans)", 6], ["dv", "Durée de vie retenue (ans)", 10], ["pl", "Plafond de vétusté (%)", 75], ["fr", "Franchise (€)", 150], ["rec", "Vétusté récupérable max. (% de la VàN)", 25]],
      run: (v) => { const taux = Math.min(v.dv ? v.age / v.dv * 100 : 0, v.pl), vet = v.van * taux / 100, imm = Math.max(0, v.van - vet - v.fr), dif = Math.min(vet, v.van * v.rec / 100);
        return [["Taux de vétusté appliqué", nf(taux, 1) + " %"], ["Montant de vétusté", eur(vet)], ["Indemnité immédiate (valeur d'usage − franchise)", eur(imm)], ["Indemnité différée (sur factures)", eur(dif)], ["Total maximum", eur(imm + dif)]]; } },
    { id: "rp", titre: "Règles proportionnelles", desc: "Sous-assurance (capitaux, L121-5) et déclaration inexacte (prime, L113-9).",
      f: [["dom", "Dommage (€)", 80000], ["cap", "Capital assuré (€)", 450000], ["val", "Valeur réelle (€)", 600000], ["pp", "Prime payée (€)", 480], ["pd", "Prime due (€)", 620], ["fr", "Franchise (€)", 1000]],
      run: (v) => { const rc = v.val ? Math.min(1, v.cap / v.val) : 1, rpm = v.pd ? Math.min(1, v.pp / v.pd) : 1;
        return [["Rapport capitaux", nf(rc * 100, 1) + " %"], ["Indemnité règle de capitaux − franchise", eur(Math.max(0, v.dom * rc - v.fr))], ["Rapport primes", nf(rpm * 100, 1) + " %"], ["Indemnité règle de prime − franchise", eur(Math.max(0, v.dom * rpm - v.fr))]]; } },
    { id: "toit", titre: "Couverture", desc: "Surface en rampant et nombre de tuiles / faîtières.",
      f: [["s", "Surface au sol couverte (m²)", 40], ["p", "Pente (degrés)", 35], ["pc", "Part à refaire (%)", 60], ["t", "Tuiles au m²", 13], ["ca", "Casse (%)", 5], ["fa", "Longueur de faîtage (ml)", 10], ["fu", "Faîtières par ml", 3]],
      run: (v) => { const ramp = v.s / Math.cos(v.p * Math.PI / 180), z = ramp * v.pc / 100;
        return [["Surface en rampant", nf(ramp) + " m²"], ["Surface à refaire", nf(z) + " m²"], ["Tuiles à commander", Math.ceil(z * v.t * (1 + v.ca / 100)) + " U"], ["Faîtières", Math.ceil(v.fa * v.fu) + " U"], ["Pente en %", nf(Math.tan(v.p * Math.PI / 180) * 100, 0) + " %"]]; } },
    { id: "beton", titre: "Béton (dalle / semelle)", desc: "Volume, ciment et sacs.",
      f: [["L", "Longueur (m)", 5], ["l", "Largeur (m)", 4], ["e", "Épaisseur (cm)", 12], ["d", "Dosage ciment (kg/m³)", 350], ["sac", "Poids d'un sac (kg)", 35]],
      run: (v) => { const vol = v.L * v.l * v.e / 100, kg = vol * v.d;
        return [["Volume", nf(vol, 3) + " m³"], ["Ciment", nf(kg, 0) + " kg"], ["Sacs de ciment", (v.sac ? Math.ceil(kg / v.sac) : 0) + " U"]]; } },
    { id: "macon", titre: "Maçonnerie / plaques de plâtre", desc: "Blocs béton et plaques BA13 pour une paroi.",
      f: [["L", "Longueur de paroi (m)", 6], ["h", "Hauteur (m)", 2.5], ["op", "Ouvertures (m²)", 1.9], ["bm", "Blocs par m²", 10], ["fa", "Faces en plaques de plâtre", 2], ["pm", "Surface d'une plaque (m²)", 3], ["ch", "Chutes (%)", 10]],
      run: (v) => { const s = Math.max(0, v.L * v.h - v.op);
        return [["Surface nette", nf(s) + " m²"], ["Blocs (+5 %)", Math.ceil(s * v.bm * 1.05) + " U"], ["Plaques de plâtre", (v.pm ? Math.ceil(s * v.fa * (1 + v.ch / 100) / v.pm) : 0) + " U"]]; } },
    { id: "tva", titre: "HT / TTC", desc: "Rappel : 20 % (neuf < 2 ans), 10 % (logement > 2 ans), 5,5 % (rénovation énergétique).",
      f: [["ht", "Montant HT (€)", 5000], ["t", "Taux de TVA (%)", 10], ["ttc", "Ou montant TTC à convertir (€)", 6000]],
      run: (v) => [["TTC depuis le HT", eur(v.ht * (1 + v.t / 100))], ["TVA", eur(v.ht * v.t / 100)], ["HT depuis le TTC", eur(v.ttc / (1 + v.t / 100))]] }
  ];

  function drawTools(body) {
    body.append(h(`<p class="muted">Des calculateurs pour vérifier vos métrés pendant les révisions. Entraînez-vous d'abord à la main : en entretien, on attend un raisonnement clair.</p><div class="grid grid-2" id="calcs"></div>`));
    const wrap = $("#calcs", body);
    CALCS.forEach((c) => {
      wrap.append(h(`<div class="card" id="calc-${c.id}">
        <h3>${esc(c.titre)}</h3><p class="small muted">${esc(c.desc)}</p>
        <div class="calc-grid">${c.f.map(([k, l, d]) => `<label class="field">${esc(l)}<input type="number" step="any" data-k="${k}" value="${d}"></label>`).join("")}</div>
        <div class="result-box"></div>
      </div>`));
      const card = $("#calc-" + c.id, wrap);
      const update = () => {
        const v = {}; $$("input", card).forEach((i) => v[i.dataset.k] = num(i.value));
        $(".result-box", card).innerHTML = c.run(v).map(([l, r]) => `<div><span>${esc(l)}</span><b>${esc(r)}</b></div>`).join("");
      };
      $$("input", card).forEach((i) => i.oninput = update);
      update();
    });
  }

  // =====================================================================
  // ENVIRONNEMENT
  // =====================================================================
  function renderEnv(el) {
    el.append(h(`
      <h1>Réglementation environnementale</h1>
      <p class="lead">Empreinte carbone, performance énergétique, déchets : les notions que l'on attend d'un expert construction aujourd'hui, et leur lien avec le règlement des sinistres.</p>
      <div class="chips" id="envToc">${ENV_SECTIONS.map((s) => `<button class="chip" data-id="${s.id}">${esc(s.titre)}</button>`).join("")}</div>
      ${ENV_SECTIONS.map((s) => `<section id="env-${s.id}" style="scroll-margin-top:70px"><h2>${esc(s.titre)}</h2>${s.html}</section>`).join("")}
      <div class="card" style="margin-top:28px">
        <h3>Testez-vous</h3>
        <p class="muted small">${QUESTIONS.filter((q) => q.c === "environnement").length} questions dédiées dans la banque de QCM.</p>
        <button class="btn primary" id="envQuiz">Lancer un QCM Environnement</button>
      </div>`));
    $$("#envToc .chip", el).forEach((b) => b.onclick = () => $("#env-" + b.dataset.id).scrollIntoView({ behavior: "smooth" }));
    $("#envQuiz", el).onclick = () => { qcmPreset = ["environnement"]; qcmCfg.onlyErrors = false; location.hash = "#/qcm"; };
  }

  // =====================================================================
  // ENTRETIEN
  // =====================================================================
  function renderEntretien(el) {
    const E = ENTRETIEN;
    const done = new Set(store.get("checklist", []));
    const qcats = [...new Set(E.questions.map((q) => q.cat))];
    el.append(h(`
      <h1>Préparer l'entretien</h1>
      <p class="lead">Ce que vous risquez de rencontrer, et comment y répondre avec méthode.</p>
      <div class="callout warn small">Le déroulé ci-dessous correspond au <b>processus typique</b> des cabinets d'expertise ; les étapes exactes chez Saretec peuvent varier selon l'agence et le poste. N'hésitez pas à demander au recruteur le déroulé et la nature des tests (QCM, cas pratique) dès le premier échange.</div>

      <h2>Processus de recrutement</h2>
      <div class="grid">${E.process.map((p, i) => `<div class="card" style="display:flex;gap:14px"><div class="brand-mark" style="flex:none">${i + 1}</div><div><b>${esc(p.t)}</b><p class="small muted" style="margin:4px 0 0">${esc(p.d)}</p></div></div>`).join("")}</div>

      <h2>Questions fréquentes</h2>
      <div class="chips" id="eqcats"><button class="chip on" data-c="all">Toutes</button>${qcats.map((c) => `<button class="chip" data-c="${esc(c)}">${esc(c)}</button>`).join("")}</div>
      <div id="eqlist"></div>

      <h2>Méthode STAR pour vos exemples</h2>
      <div class="grid grid-4">${E.star.map(([t, d]) => `<div class="card"><b>${esc(t)}</b><p class="small muted" style="margin:4px 0 0">${esc(d)}</p></div>`).join("")}</div>
      <p class="small muted" style="margin-top:8px">Préparez 3 exemples : un problème technique résolu, une situation relationnelle tendue, une période de forte charge.</p>

      <h2>Trame d'un rapport d'expertise</h2>
      <p class="muted small">Utile si l'on vous demande un exercice écrit (compte rendu de visite, rapport simplifié).</p>
      <div class="table-wrap"><table><tbody>${E.rapport.map(([t, d]) => `<tr><th style="width:220px">${esc(t)}</th><td>${esc(d)}</td></tr>`).join("")}</tbody></table></div>

      <h2>Questions à poser au recruteur</h2>
      <ul>${E.aPoser.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>

      <h2>Checklist de la veille</h2>
      <div class="card" id="check">${E.checklist.map((c, i) => `<label class="check" style="margin:8px 0"><input type="checkbox" data-i="${i}" ${done.has(i) ? "checked" : ""}> ${esc(c)}</label>`).join("")}</div>
    `));
    let cur = "all";
    const fill = () => {
      $$("#eqcats .chip", el).forEach((c) => c.classList.toggle("on", c.dataset.c === cur));
      $("#eqlist", el).innerHTML = E.questions.filter((q) => cur === "all" || q.cat === cur).map((q) => `
        <details><summary>${esc(q.q)} <span class="tag" style="margin-left:6px">${esc(q.cat)}</span></summary><div>${esc(q.a)}</div></details>`).join("");
    };
    $$("#eqcats .chip", el).forEach((c) => c.onclick = () => { cur = c.dataset.c; fill(); });
    $$("#check input", el).forEach((i) => i.onchange = () => { i.checked ? done.add(+i.dataset.i) : done.delete(+i.dataset.i); store.set("checklist", [...done]); });
    fill();
  }

  router();
})();
