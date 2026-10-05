(function () {
  "use strict";

  // =====================================================================
  // UTILITAIRES
  // =====================================================================
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const nf = (n, d = 2) => Number(n).toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });
  const eur = (n) => nf(n, 2) + " €";
  const num = (v) => { const x = parseFloat(String(v).replace(",", ".")); return isFinite(x) ? x : 0; };
  const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’`]/g, "'");
  const store = {
    get(k, d) { try { const v = localStorage.getItem("prepa_" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("prepa_" + k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
  };
  const h = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content; };
  const hash = (s) => { let x = 5381; for (let i = 0; i < s.length; i++) x = ((x << 5) + x + s.charCodeAt(i)) | 0; return "q" + (x >>> 0).toString(36); };
  const fmtTime = (s) => `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")} s`;
  const LETTERS = ["A", "B", "C", "D", "E"];

  // =====================================================================
  // DONNÉES
  // =====================================================================
  const NOTION = {};
  NOTIONS.forEach((n) => { NOTION[n.id] = n; });
  const QBY = {};
  QUESTIONS.forEach((q) => {
    q.id = hash(q.q);
    if (!NOTION[q.n]) console.warn("Notion inconnue :", q.n, q.q);
    q.d = NOTION[q.n] ? NOTION[q.n].d : "sinistre";
    QBY[q.id] = q;
  });
  const qOfNotion = (nid) => QUESTIONS.filter((q) => q.n === nid);
  // Module Saretec / RH séparé : il ne se mélange pas aux tests techniques
  const TECH = QUESTIONS.filter((q) => q.d !== "saretec");
  const TECH_NOTIONS = NOTIONS.filter((n) => n.d !== "saretec");
  const TECH_DOMS = Object.keys(DOMAINES).filter((d) => d !== "saretec");
  const LV = { 1: "Niv. 1 · fondamental", 2: "Niv. 2 · test", 3: "Niv. 3 · piège", 4: "Niv. 4 · situation" };
  const PRIO = { 1: "Fort rendement", 2: "Important", 3: "Secondaire" };

  // =====================================================================
  // PROFIL DE CONNAISSANCES + RÉPÉTITION ESPACÉE
  // =====================================================================
  const CONF = [
    { k: "sure", l: "Je savais", key: "1" },
    { k: "hesit", l: "J'hésitais", key: "2" },
    { k: "elim", l: "Par élimination", key: "3" },
    { k: "hasard", l: "Au hasard", key: "4" }
  ];
  const ST = {
    acquis: { l: "Acquis", c: "st-acq" },
    encours: { l: "En cours", c: "st-enc" },
    fragile: { l: "Fragile", c: "st-fra" },
    nonacquis: { l: "Non acquis", c: "st-non" },
    nonevalue: { l: "Non évalué", c: "st-nev" }
  };
  const ST_ORDER = ["acquis", "encours", "fragile", "nonacquis", "nonevalue"];
  const SRS_INT = [0, 10 * 60e3, 60 * 60e3, 5 * 3600e3, 24 * 3600e3, 3 * 24 * 3600e3];
  const VAL = { sure: 1, hesit: 0.6, elim: 0.3, hasard: 0.1 };

  const P = {
    att: store.get("att", {}),
    srs: store.get("srs", {}),
    save() { store.set("att", this.att); store.set("srs", this.srs); },
    record(q, ok, conf, chosen) {
      const list = this.att[q.id] || (this.att[q.id] = []);
      list.push({ ok, c: conf, ts: Date.now(), ch: ok ? undefined : chosen });
      if (list.length > 8) list.splice(0, list.length - 8);
      const s = this.srs[q.id] || { box: 0 };
      if (ok && conf === "sure") s.box = Math.min(s.box + 1, 5);
      else if (ok && conf === "hesit") s.box = Math.max(1, s.box);
      else if (ok) s.box = 1;
      else s.box = 0;
      s.due = Date.now() + SRS_INT[s.box];
      this.srs[q.id] = s;
    },
    value(a) { return a.ok ? (VAL[a.c] ?? 0.6) : 0; },
    notionAttempts(nid) {
      const out = [];
      qOfNotion(nid).forEach((q) => (this.att[q.id] || []).forEach((a) => out.push({ ...a, q })));
      return out.sort((a, b) => b.ts - a.ts);
    },
    notionStat(nid) {
      const all = this.notionAttempts(nid);
      if (!all.length) return { status: "nonevalue", avg: 0, n: 0 };
      const last = all.slice(0, 5);
      const avg = last.reduce((s, a) => s + this.value(a), 0) / last.length;
      let status;
      if (avg >= 0.85 && last.length >= 2 && last[0].ok && last[0].c === "sure") status = "acquis";
      else if (avg >= 0.6) status = "encours";
      else if (avg >= 0.25) status = "fragile";
      else status = "nonacquis";
      return { status, avg, n: all.length };
    },
    wrongCount(qid) { return (this.att[qid] || []).filter((a) => !a.ok).length; },
    seen(qid) { return !!(this.att[qid] && this.att[qid].length); },
    due(qid) { const s = this.srs[qid]; return s && s.due <= Date.now(); },
    reset() { this.att = {}; this.srs = {}; this.save(); store.set("sessions", []); }
  };
  const badge = (status) => `<span class="badge ${ST[status].c}">${ST[status].l}</span>`;

  // =====================================================================
  // THÈME & NAVIGATION
  // =====================================================================
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
  const routes = {
    accueil: renderHome, express: renderExpress, qcm: renderQcm, session: renderSession, fiches: renderFiches,
    cas: renderCas, environnement: renderEnv, vocabulaire: renderVocab, entretien: renderEntretien, saretec: renderSaretec
  };
  let timerInt = null;
  function router() {
    const parts = location.hash.replace(/^#\/?/, "").split("/");
    const page = routes[parts[0]] ? parts[0] : "accueil";
    const navPage = page === "session" ? "qcm" : page;
    $$(".sidebar a[data-page]").forEach((a) => a.classList.toggle("active", a.dataset.page === navPage));
    document.removeEventListener("keydown", sessKeys);
    clearInterval(timerInt);
    app.innerHTML = "";
    routes[page](app, parts[1], parts[2]);
    closeNav();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", router);
  const go = (hashStr) => { if (location.hash === hashStr) router(); else location.hash = hashStr; };

  // =====================================================================
  // RENDU D'UNE FICHE
  // =====================================================================
  const schemaCache = {};
  const schema = (key) => (key && SCHEMAS[key]) ? (schemaCache[key] || (schemaCache[key] = SCHEMAS[key]())) : "";
  function murBox(items) {
    return items && items.length ? `<div class="mur"><div class="mur-t">À ÉCRIRE SUR LE MUR</div>${items.map((m) => `<div class="mur-i">${esc(m)}</div>`).join("")}</div>` : "";
  }
  function ficheHTML(n, opt = {}) {
    const f = n.f, st = P.notionStat(n.id).status;
    return `<div class="fiche">
      <div class="fiche-h"><h3>${esc(n.t)}</h3><div class="row">${badge(st)}<span class="tag">${esc(DOMAINES[n.d])}</span>${n.p === 1 ? `<span class="tag accent">${PRIO[1]}</span>` : n.p === 3 ? `<span class="tag muted-tag">${PRIO[3]}</span>` : ""}</div></div>
      <div class="fiche-grid">
        <div><b>Définition</b><p>${esc(f.def)}</p></div>
        <div><b>Rôle</b><p>${esc(f.role)}</p></div>
        <div><b>Localisation</b><p>${esc(f.loc)}</p></div>
        <div class="warn-cell"><b>⚠ Confusion fréquente</b><p>${esc(f.conf)}</p></div>
        <div class="sin-cell"><b>Exemple sinistre</b><p>${esc(f.sin)}</p></div>
      </div>
      ${murBox(f.mur)}
      <div class="levels">
        ${f.rouge && f.rouge.length ? `<div class="lvl lvl-r"><b>🟥 À apprendre par cœur</b><ul>${f.rouge.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>` : ""}
        ${f.jaune && f.jaune.length ? `<div class="lvl lvl-y"><b>🟨 À comprendre</b><ul>${f.jaune.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>` : ""}
        ${f.vert && f.vert.length ? `<div class="lvl lvl-g"><b>🟩 À savoir reconnaître / appliquer</b><ul>${f.vert.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>` : ""}
      </div>
      ${f.svg ? (opt.compact ? `<details class="sch-d"><summary>Voir le schéma</summary><div>${schema(f.svg)}</div></details>` : schema(f.svg)) : ""}
    </div>`;
  }

  // =====================================================================
  // SÉLECTION DES QUESTIONS
  // =====================================================================
  function pickMaxPerNotion(list, n, maxPer) {
    const out = [], cnt = {};
    for (const q of list) { if (out.length >= n) break; cnt[q.n] = cnt[q.n] || 0; if (cnt[q.n] >= maxPer) continue; cnt[q.n]++; out.push(q); }
    if (out.length < n) for (const q of list) { if (out.length >= n) break; if (!out.includes(q)) out.push(q); }
    return out;
  }
  function adaptivePick(n, pool = TECH) {
    const statusOf = {};
    NOTIONS.forEach((x) => { statusOf[x.id] = P.notionStat(x.id).status; });
    const W = { nonacquis: 60, fragile: 50, encours: 30, nonevalue: 25, acquis: 0 };
    const scored = pool.filter((q) => !(statusOf[q.n] === "acquis" && q.lv === 1)).map((q) => {
      let s = W[statusOf[q.n]] + (NOTION[q.n] ? (NOTION[q.n].p === 1 ? 20 : NOTION[q.n].p === 2 ? 10 : 0) : 0);
      if (P.seen(q.id) && P.due(q.id)) s += 100;
      if (!P.seen(q.id)) s += 15;
      const last = (P.att[q.id] || []).slice(-1)[0];
      if (last && !last.ok) s += 30;
      if (last && last.ok && last.c === "sure" && !P.due(q.id)) s -= 60;
      return { q, s: s + Math.random() * 15 };
    }).sort((a, b) => b.s - a.s).map((x) => x.q);
    return pickMaxPerNotion(scored, n, 3);
  }
  const EXAM_W = { compo: 8, toiture: 9, humid: 9, struct: 4, sinistre: 9, chiffrage: 8, platre: 5, isol: 5, renov: 4, menuis: 4, fluides: 5, assur: 7, carbone: 4, regl: 4 };
  function examPick(total) {
    const sumW = Object.values(EXAM_W).reduce((a, b) => a + b, 0);
    const out = [];
    Object.entries(EXAM_W).forEach(([d, w]) => {
      const pool = shuffle(TECH.filter((q) => q.d === d)).sort((a, b) => (a.lv === 1) - (b.lv === 1));
      const quota = Math.round((w / sumW) * total);
      out.push(...pickMaxPerNotion(shuffle(pool.slice(0, Math.max(quota * 2, quota))), quota, 2));
    });
    const rest = shuffle(TECH.filter((q) => !out.includes(q)));
    while (out.length < total && rest.length) out.push(rest.pop());
    return shuffle(out.slice(0, total));
  }
  function positionPick() {
    const out = [];
    TECH_DOMS.forEach((d) => {
      const pool = shuffle(TECH.filter((q) => q.d === d));
      const pref = pool.filter((q) => q.lv === 2).concat(pool.filter((q) => q.lv === 3), pool.filter((q) => q.lv !== 2 && q.lv !== 3));
      out.push(...pickMaxPerNotion(pref, 2, 1));
    });
    return shuffle(out);
  }
  function expressPick(n) {
    const weak = TECH_NOTIONS.filter((x) => x.p <= 2 && ["nonacquis", "fragile", "nonevalue"].includes(P.notionStat(x.id).status));
    const ids = new Set(weak.map((x) => x.id));
    const pool = TECH.filter((q) => ids.has(q.n) && q.lv >= 2);
    return adaptivePick(n, pool.length >= n ? pool : TECH.filter((q) => NOTION[q.n].p === 1));
  }
  function errorsPick(n) {
    const list = TECH.filter((q) => { const a = P.att[q.id]; return a && a.length && (!a[a.length - 1].ok || ["elim", "hasard"].includes(a[a.length - 1].c)); });
    return shuffle(list).sort((a, b) => P.wrongCount(b.id) - P.wrongCount(a.id)).slice(0, n);
  }
  const dueList = () => TECH.filter((q) => P.seen(q.id) && P.due(q.id));

  // =====================================================================
  // SESSIONS DE QUESTIONS
  // =====================================================================
  let sess = null;
  function startSession(o) {
    if (!o.questions.length) { alert("Aucune question disponible avec ces critères."); return; }
    sess = {
      type: o.type, title: o.title, mode: o.mode || "imm", adaptive: !!o.adaptive, limit: o.limit || 0,
      items: o.questions.map(mkItem), idx: 0, start: Date.now(), done: false, view: "q", remediated: new Set(), sessErr: {}
    };
    go("#/session");
  }
  function mkItem(q, extra) { return { q, opts: shuffle(q.r.map((t, i) => ({ t, ok: i === 0 }))), sel: null, conf: null, revealed: false, ...(extra || {}) }; }
  const isOk = (it) => it.sel !== null && it.opts[it.sel].ok;
  const ansCat = (it) => (it.sel === null ? "nsp" : !it.opts[it.sel].ok ? "faux" : it.conf || "sure");
  const CAT_L = { sure: "Bonne réponse — je savais", hesit: "Bonne réponse — hésitation", elim: "Bonne réponse PAR ÉLIMINATION", hasard: "Bonne réponse AU HASARD", faux: "Erreur", nsp: "Sans réponse" };

  let sessBody = null;
  function sessKeys(e) {
    if (!sess || sess.done || sess.view !== "q" || /input|textarea|select/i.test(e.target.tagName)) return;
    const it = sess.items[sess.idx];
    const k = e.key.toUpperCase();
    const li = LETTERS.indexOf(k);
    if (li >= 0 && li < it.opts.length && !(sess.mode === "imm" && it.revealed)) { it.sel = li; if (sess.mode !== "imm") it.conf = null; drawQ(); e.preventDefault(); return; }
    const ci = CONF.findIndex((c) => c.key === e.key);
    if (ci >= 0 && it.sel !== null && !(sess.mode === "imm" && it.revealed)) { validate(CONF[ci].k); e.preventDefault(); return; }
    if (e.key === "Enter") { const n = $("#next", sessBody); if (n && !n.disabled) { n.click(); e.preventDefault(); } }
  }

  function renderSession(el) {
    sessBody = el;
    if (!sess) {
      el.append(h(`<h1>Aucune session en cours</h1><p><a href="#/qcm">Choisir un entraînement</a></p>`));
      return;
    }
    if (sess.done) return drawResults();
    if (sess.view === "fiche") return drawInterstitial();
    drawQ();
  }

  function timerHTML() {
    const el = Math.round((Date.now() - sess.start) / 1000);
    if (sess.limit) { const left = Math.max(0, sess.limit - el); return `<span class="timer ${left < 300 ? "low" : ""}">⏱ ${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}</span>`; }
    return `<span class="timer">⏱ ${Math.floor(el / 60)}:${String(el % 60).padStart(2, "0")}</span>`;
  }
  function startTimer() {
    clearInterval(timerInt);
    timerInt = setInterval(() => {
      if (!sess || sess.done) return clearInterval(timerInt);
      const t = $("#timer", sessBody); if (t) t.innerHTML = timerHTML();
      if (sess.limit && (Date.now() - sess.start) / 1000 >= sess.limit) { clearInterval(timerInt); alert("Temps écoulé : le test est terminé."); finishSession(); }
    }, 1000);
  }

  function drawQ() {
    const el = sessBody;
    document.removeEventListener("keydown", sessKeys);
    document.addEventListener("keydown", sessKeys);
    const it = sess.items[sess.idx], n = sess.items.length, imm = sess.mode === "imm";
    const showCorr = imm && it.revealed, isLast = sess.idx === n - 1;
    const answered = sess.items.filter((x) => x.sel !== null && x.conf).length;
    const nt = NOTION[it.q.n];
    el.innerHTML = "";
    el.append(h(`
      <div class="sess-head">
        <div><b>${esc(sess.title)}</b><div class="small muted">Question ${sess.idx + 1} / ${n}${imm ? "" : ` · ${answered} répondue(s)`}</div></div>
        <span class="spacer"></span><span id="timer">${timerHTML()}</span>
      </div>
      <div class="progress"><span style="width:${((sess.idx + (showCorr ? 1 : 0)) / n) * 100}%"></span></div>
      <div class="card" style="margin-top:12px">
        <div class="row small"><span class="tag">${esc(DOMAINES[it.q.d])}</span><span class="tag lv lv${it.q.lv}">${LV[it.q.lv]}</span>${it.remed ? `<span class="tag accent">Question ciblée</span>` : ""}</div>
        <div class="question">${esc(it.q.q)}</div>
        <div class="choices">${it.opts.map((o, i) => {
          let cls = "";
          if (showCorr) { if (o.ok) cls = "ok"; else if (it.sel === i) cls = "ko"; } else if (it.sel === i) cls = "sel";
          return `<button class="choice ${cls}" data-i="${i}" ${showCorr ? "disabled" : ""}><span class="letter">${LETTERS[i]}</span><span>${esc(o.t)}</span></button>`;
        }).join("")}</div>
        ${!showCorr ? `<div class="confbar ${it.sel === null ? "dim" : ""}">
            <div class="small muted">${it.sel === null ? "Choisissez une réponse, puis indiquez honnêtement comment vous l'avez trouvée :" : "Comment avez-vous trouvé cette réponse ? (valide la réponse)"}</div>
            <div class="conf-btns">${CONF.map((c) => `<button class="btn conf ${it.conf === c.k ? "on" : ""}" data-c="${c.k}" ${it.sel === null ? "disabled" : ""}><span class="kbd">${c.key}</span>${c.l}</button>`).join("")}</div>
          </div>` : ""}
        ${showCorr ? corrHTML(it) : ""}
        <div class="row" style="margin-top:16px">
          ${imm ? (!it.revealed ? `<button class="btn ghost" id="nsp">Je ne sais pas → voir la réponse</button>` : "") : `<button class="btn" id="prev" ${sess.idx === 0 ? "disabled" : ""}>← Préc.</button>`}
          <span class="spacer"></span>
          <button class="btn ghost sm" id="quit">Arrêter</button>
          ${imm ? `<button class="btn primary" id="next" ${it.revealed ? "" : "disabled"}>${isLast ? "Voir le bilan" : "Suivante →"}</button>`
                : (isLast ? `<button class="btn primary" id="finish">Terminer</button>` : `<button class="btn primary" id="next">Suivante →</button>`)}
        </div>
        ${imm ? "" : `<div class="palette">${sess.items.map((x, i) => `<button data-j="${i}" class="${x.sel !== null && x.conf ? "answered" : ""} ${i === sess.idx ? "current" : ""}">${i + 1}</button>`).join("")}</div>
          ${!isLast ? `<div class="row" style="margin-top:10px"><span class="spacer"></span><button class="btn sm" id="finish">Terminer maintenant</button></div>` : ""}`}
        <p class="small muted kb-hint">Clavier : A-D pour répondre · 1-4 pour la certitude · Entrée pour continuer</p>
      </div>
      ${showCorr && nt ? `<details class="card fiche-inline"><summary>📄 Mini-fiche « ${esc(nt.t)} »</summary>${ficheHTML(nt, { compact: true })}</details>` : ""}
    `));
    $$(".choice", el).forEach((b) => b.onclick = () => { it.sel = +b.dataset.i; if (!imm) it.conf = null; drawQ(); });
    $$(".conf", el).forEach((b) => b.onclick = () => validate(b.dataset.c));
    const nx = $("#next", el); if (nx) nx.onclick = () => (imm ? afterImm() : move(1));
    const pv = $("#prev", el); if (pv) pv.onclick = () => move(-1);
    const nsp = $("#nsp", el); if (nsp) nsp.onclick = () => { it.sel = null; it.conf = "nsp"; it.revealed = true; P.record(it.q, false, "nsp", null); P.save(); noteErr(it); drawQ(); };
    $$(".palette button", el).forEach((b) => b.onclick = () => { sess.idx = +b.dataset.j; drawQ(); });
    $$("#finish", el).forEach((b) => b.onclick = () => {
      const left = sess.items.filter((x) => x.sel === null || !x.conf).length;
      if (left && !confirm(`${left} question(s) sans réponse validée. Terminer quand même ?`)) return;
      finishSession();
    });
    $("#quit", el).onclick = () => {
      if (!confirm(imm ? "Arrêter la session ? Les réponses déjà validées restent enregistrées dans votre profil." : "Arrêter cet examen ? Il ne sera pas enregistré.")) return;
      if (imm && sess.items.some((x) => x.revealed)) { sess.items = sess.items.filter((x) => x.revealed); finishSession(); } else { sess = null; go("#/qcm"); }
    };
    startTimer();
  }
  function move(d) { sess.idx = Math.max(0, Math.min(sess.items.length - 1, sess.idx + d)); drawQ(); window.scrollTo(0, 0); }
  function noteErr(it) { if (ansCat(it) !== "sure" && ansCat(it) !== "hesit") sess.sessErr[it.q.n] = (sess.sessErr[it.q.n] || 0) + 1; }
  function validate(conf) {
    const it = sess.items[sess.idx];
    if (it.sel === null) return;
    it.conf = conf;
    if (sess.mode === "imm") {
      it.revealed = true;
      P.record(it.q, isOk(it), conf, it.opts[it.sel].t); P.save();
      noteErr(it);
      drawQ();
    } else if (sess.idx < sess.items.length - 1) move(1); else drawQ();
  }
  function corrHTML(it) {
    const c = ansCat(it), right = it.opts.find((o) => o.ok).t;
    const cls = c === "sure" || c === "hesit" ? "ok" : c === "elim" || c === "hasard" ? "warn" : "ko";
    const msg = c === "elim" || c === "hasard" ? `<b>${CAT_L[c]}</b> — la notion est comptée comme <b>fragile</b>, pas comme acquise.` : `<b>${CAT_L[c]}</b>`;
    return `<div class="callout ${cls} explain">${msg}${c === "faux" || c === "nsp" ? `<br>Bonne réponse : <b>${esc(right)}</b>` : ""}<div style="margin-top:6px">${esc(it.q.e)}</div></div>`;
  }
  function afterImm() {
    const it = sess.items[sess.idx];
    if (sess.adaptive && !it.remed && (sess.sessErr[it.q.n] || 0) >= 2 && !sess.remediated.has(it.q.n)) {
      sess.remediated.add(it.q.n);
      sess.view = "fiche"; sess.ficheNotion = it.q.n;
      return drawInterstitial();
    }
    if (sess.idx === sess.items.length - 1) return finishSession();
    move(1);
  }
  function drawInterstitial() {
    const el = sessBody, n = NOTION[sess.ficheNotion];
    el.innerHTML = "";
    el.append(h(`
      <div class="callout warn"><b>Révision ciblée.</b> Vous avez eu plusieurs réponses fausses ou incertaines sur « ${esc(n.t)} ». Lisez cette mini-fiche (1-2 min), puis faites 3 questions ciblées avant de reprendre.</div>
      <div class="card">${ficheHTML(n)}</div>
      <div class="row" style="margin-top:14px"><button class="btn primary" id="remed">3 questions ciblées →</button><button class="btn ghost" id="skip">Reprendre sans les questions</button></div>`));
    $("#remed", el).onclick = () => {
      const inSess = new Set(sess.items.map((x) => x.q.id));
      let pool = shuffle(qOfNotion(n.id).filter((q) => !inSess.has(q.id)));
      if (pool.length < 3) pool = pool.concat(shuffle(qOfNotion(n.id).filter((q) => inSess.has(q.id) && q.id !== sess.items[sess.idx].q.id)));
      const add = pool.slice(0, 3).map((q) => mkItem(q, { remed: true }));
      sess.items.splice(sess.idx + 1, 0, ...add);
      sess.view = "q";
      if (add.length) move(1); else afterImm();
    };
    $("#skip", el).onclick = () => { sess.view = "q"; if (sess.idx === sess.items.length - 1) finishSession(); else move(1); };
    window.scrollTo(0, 0);
  }

  function finishSession() {
    clearInterval(timerInt);
    sess.done = true; sess.end = Date.now();
    if (sess.mode !== "imm") {
      sess.items.forEach((it) => {
        const ok = isOk(it);
        P.record(it.q, ok, it.sel === null ? "nsp" : it.conf || "sure", it.sel === null ? null : it.opts[it.sel].t);
      });
      P.save();
    }
    const score = sess.items.filter((x) => isOk(x) && (x.conf === "sure" || x.conf === "hesit")).length;
    const raw = sess.items.filter(isOk).length;
    sess.score = raw; sess.solid = score;
    const hist = store.get("sessions", []);
    hist.push({ date: Date.now(), type: sess.type, title: sess.title, n: sess.items.length, score: raw, solid: score, secs: Math.round((sess.end - sess.start) / 1000) });
    store.set("sessions", hist.slice(-60));
    document.removeEventListener("keydown", sessKeys);
    if (location.hash !== "#/session") go("#/session"); else drawResults();
  }

  function drawResults() {
    const el = sessBody, items = sess.items, n = items.length;
    const secs = Math.round((sess.end - sess.start) / 1000);
    const pct = Math.round((sess.score / n) * 100), solidPct = Math.round((sess.solid / n) * 100);
    const cats = { sure: 0, hesit: 0, elim: 0, hasard: 0, faux: 0, nsp: 0 };
    items.forEach((it) => cats[ansCat(it)]++);
    const byDom = {};
    items.forEach((it) => { const d = byDom[it.q.d] || (byDom[it.q.d] = { ok: 0, n: 0 }); d.n++; if (isOk(it)) d.ok++; });
    const errC = items.filter((it) => !isOk(it) && it.q.t === "c").length, errR = items.filter((it) => !isOk(it) && it.q.t === "r").length;
    const notionsIn = [...new Set(items.map((it) => it.q.n))];
    const stat = {}; notionsIn.forEach((id) => { stat[id] = P.notionStat(id).status; });
    const acq = notionsIn.filter((id) => stat[id] === "acquis");
    const lac = notionsIn.filter((id) => stat[id] === "nonacquis");
    const fra = notionsIn.filter((id) => stat[id] === "fragile" || stat[id] === "encours");
    const conf = items.filter((it) => it.sel !== null && !it.opts[it.sel].ok);
    const prioList = notionsIn.filter((id) => ["nonacquis", "fragile"].includes(stat[id])).sort((a, b) => NOTION[a].p - NOTION[b].p);
    const ignore = notionsIn.filter((id) => NOTION[id].p === 3 && stat[id] !== "acquis").concat(acq);
    // 10 notions à réviser
    const sc = {};
    items.forEach((it) => { const c = ansCat(it); const w = c === "faux" || c === "nsp" ? 1 : c === "elim" || c === "hasard" ? 0.6 : c === "hesit" ? 0.2 : 0; if (w) sc[it.q.n] = (sc[it.q.n] || 0) + w * (NOTION[it.q.n].p === 1 ? 1.5 : NOTION[it.q.n].p === 2 ? 1.2 : 0.7); });
    const top10 = Object.entries(sc).sort((a, b) => b[1] - a[1]).slice(0, 10).map((x) => x[0]);
    const nLink = (id) => `<a href="#/fiches/${id}">${esc(NOTION[id].t)}</a> ${badge(stat[id] || P.notionStat(id).status)}`;
    const verdict = solidPct >= 80 ? "Très bon niveau sur ces thèmes." : solidPct >= 60 ? "Niveau correct : consolidez les notions fragiles." : "À retravailler : commencez par les notions prioritaires ci-dessous.";
    el.innerHTML = "";
    el.append(h(`
      <h1>Bilan — ${esc(sess.title)}</h1>
      <div class="card">
        <div class="row" style="gap:28px;align-items:flex-end">
          <div><div class="score-big">${sess.score}/${n}</div><div class="muted small">${pct} % brut · ${fmtTime(secs)}</div></div>
          <div><div class="score-mid">${solidPct} %</div><div class="muted small">réponses réellement sues<br>(sans élimination ni hasard)</div></div>
          <div style="flex:1;min-width:240px"><b>${verdict}</b>
            <div class="stack" style="margin-top:10px">${["sure", "hesit", "elim", "hasard", "faux", "nsp"].map((k) => cats[k] ? `<span class="seg seg-${k}" style="flex:${cats[k]}" title="${CAT_L[k]} : ${cats[k]}"></span>` : "").join("")}</div>
            <div class="legend-inline small">${["sure", "hesit", "elim", "hasard", "faux", "nsp"].map((k) => cats[k] ? `<span><i class="dot seg-${k}"></i>${CAT_L[k]} : ${cats[k]}</span>` : "").join("")}</div>
          </div>
        </div>
      </div>
      ${n >= 20 ? `<div class="grid grid-2" style="margin-top:14px">
        <div class="card"><h3>Score par domaine</h3>${Object.entries(byDom).sort((a, b) => a[1].ok / a[1].n - b[1].ok / b[1].n).map(([d, v]) => `<div class="bar-row"><span class="small">${esc(DOMAINES[d])}</span><div class="progress"><span style="width:${(v.ok / v.n) * 100}%"></span></div><span class="small num">${v.ok}/${v.n}</span></div>`).join("")}</div>
        <div class="card"><h3>Type d'erreurs</h3>
          <div class="bar-row"><span class="small">Erreurs de connaissance</span><div class="progress"><span style="width:${n ? (errC / n) * 100 * 3 : 0}%;background:var(--ko)"></span></div><span class="small num">${errC}</span></div>
          <div class="bar-row"><span class="small">Erreurs de raisonnement</span><div class="progress"><span style="width:${n ? (errR / n) * 100 * 3 : 0}%;background:var(--accent)"></span></div><span class="small num">${errR}</span></div>
          <p class="small muted">Connaissance → apprendre (fiches, 🟥). Raisonnement → refaire des mises en situation, appliquer « Faits → hypothèses → vérification → conclusion ».</p></div>
      </div>` : ""}
      ${sess.type === "exam" || n >= 40 ? `<div class="card top10"><h3>📌 LES 10 NOTIONS À RÉVISER AVANT L'EXAMEN</h3>${top10.length ? `<ol>${top10.map((id) => `<li>${nLink(id)} <button class="btn sm" data-n3="${id}">3 questions</button></li>`).join("")}</ol>` : `<p>Aucune erreur significative : refaites un examen blanc plus tard.</p>`}</div>` : ""}
      <div class="grid grid-2" style="margin-top:14px">
        <div class="card"><h3>1. Connaissances acquises</h3>${acq.length ? `<ul>${acq.map((id) => `<li>${nLink(id)}</li>`).join("")}</ul>` : `<p class="muted small">Aucune notion encore classée « acquis » (il faut au moins 2 bonnes réponses sûres).</p>`}</div>
        <div class="card"><h3>2. Lacunes</h3>${lac.length ? `<ul>${lac.map((id) => `<li>${nLink(id)}</li>`).join("")}</ul>` : `<p class="muted small">Pas de lacune franche sur cette session.</p>`}
          ${fra.length ? `<p class="small" style="margin-top:8px"><b>Fragiles / en cours :</b> ${fra.map((id) => `<a href="#/fiches/${id}">${esc(NOTION[id].t)}</a>`).join(" · ")}</p>` : ""}</div>
        <div class="card"><h3>3. Mes confusions</h3>${conf.length ? `<ul class="conf-list">${conf.slice(0, 10).map((it) => `<li><b>${esc(NOTION[it.q.n].t)}</b> : vous avez choisi « ${esc(it.opts[it.sel].t)} » au lieu de « ${esc(it.opts.find((o) => o.ok).t)} »</li>`).join("")}</ul>` : `<p class="muted small">Aucune confusion relevée.</p>`}</div>
        <div class="card"><h3>4. À revoir en priorité</h3>${prioList.length ? `<ol>${prioList.slice(0, 8).map((id) => `<li>${nLink(id)} <button class="btn sm" data-n3="${id}">3 questions</button></li>`).join("")}</ol>` : `<p class="muted small">Rien d'urgent sur cette session.</p>`}</div>
        <div class="card"><h3>5. Peut être ignoré pour l'instant</h3>${ignore.length ? `<ul>${[...new Set(ignore)].map((id) => `<li>${esc(NOTION[id].t)} <span class="muted small">— ${stat[id] === "acquis" ? "déjà acquis" : "secondaire"}</span></li>`).join("")}</ul>` : `<p class="muted small">—</p>`}</div>
      </div>
      <div class="row" style="margin:16px 0"><button class="btn primary" id="again">Nouvelle session</button><a class="btn" href="#/accueil">Tableau de bord</a><label class="check small"><input type="checkbox" id="onlyBad"> Correction : seulement erreurs et réponses incertaines</label></div>
      <h2>Correction détaillée</h2><div id="review"></div>`));
    let onlyBad = false;
    const drawReview = () => {
      $("#review", el).innerHTML = items.map((it, i) => {
        const c = ansCat(it), good = c === "sure" || c === "hesit";
        if (onlyBad && good) return "";
        return `<div class="card review-item ${good ? "good" : c === "elim" || c === "hasard" ? "mid" : "bad"}">
          <div class="row small muted"><span>Q${i + 1}</span><span class="tag">${esc(DOMAINES[it.q.d])}</span><span class="tag lv lv${it.q.lv}">${LV[it.q.lv]}</span><span>${CAT_L[c]}</span><span class="small">· ${it.q.t === "r" ? "raisonnement" : "connaissance"}</span></div>
          <div style="font-weight:600;margin:6px 0">${esc(it.q.q)}</div>
          ${it.sel !== null ? `<div class="ans">Votre réponse : <span class="${isOk(it) ? "ok-txt" : "ko-txt"}">${esc(it.opts[it.sel].t)}</span></div>` : ""}
          ${!isOk(it) ? `<div class="ans">Bonne réponse : <span class="ok-txt">${esc(it.opts.find((o) => o.ok).t)}</span></div>` : ""}
          <div class="small muted" style="margin-top:6px">${esc(it.q.e)} — <a href="#/fiches/${it.q.n}">fiche</a></div></div>`;
      }).join("") || `<p class="muted">Rien à afficher.</p>`;
    };
    $("#onlyBad", el).onchange = (e) => { onlyBad = e.target.checked; drawReview(); };
    $("#again", el).onclick = () => { sess = null; go("#/qcm"); };
    $$("[data-n3]", el).forEach((b) => b.onclick = () => notionQuiz(b.dataset.n3));
    drawReview();
  }
  function notionQuiz(id, n = 3) {
    const pool = adaptivePick(n, qOfNotion(id));
    startSession({ type: "notion", title: `Questions ciblées — ${NOTION[id].t}`, questions: pool, mode: "imm" });
  }

  // =====================================================================
  // TABLEAU DE BORD
  // =====================================================================
  function stackBar(counts, total) {
    return `<div class="stack">${ST_ORDER.map((k) => counts[k] ? `<span class="seg ${ST[k].c}" style="flex:${counts[k]}" title="${ST[k].l} : ${counts[k]}"></span>` : "").join("")}</div>`;
  }
  function renderHome(el) {
    const stats = {}; NOTIONS.forEach((n) => { stats[n.id] = P.notionStat(n.id).status; });
    const counts = {}; ST_ORDER.forEach((k) => { counts[k] = 0; }); TECH_NOTIONS.forEach((n) => counts[stats[n.id]]++);
    const total = TECH_NOTIONS.length;
    const pctAcq = Math.round(((counts.acquis + counts.encours * 0.5) / total) * 100);
    const due = dueList().length;
    const recur = TECH.filter((q) => P.wrongCount(q.id) >= 2);
    const answered = TECH.filter((q) => P.seen(q.id)).length;
    const hist = store.get("sessions", []).slice(-5).reverse();
    const fragileN = TECH_NOTIONS.filter((n) => ["fragile", "nonacquis"].includes(stats[n.id])).sort((a, b) => a.p - b.p);
    const murs = shuffle(TECH_NOTIONS.filter((n) => n.p === 1 && n.f.mur).flatMap((n) => n.f.mur)).slice(0, 6);
    el.append(h(`
      <h1>Préparation Télé-Expert / Expert sinistre bâtiment</h1>
      <p class="lead">Test ~80 questions → entretien manager → entretien RH. Objectif : maximiser ce qui est testé, en une journée.</p>
      <div class="grid grid-4" style="margin:18px 0">
        <div class="card stat"><div class="num">${pctAcq} %</div><div class="lbl">progression globale</div></div>
        <div class="card stat"><div class="num">${counts.acquis}</div><div class="lbl">notions maîtrisées / ${total}</div></div>
        <div class="card stat"><div class="num" style="color:var(--warn)">${counts.fragile}</div><div class="lbl">notions fragiles</div></div>
        <div class="card stat"><div class="num">${due + fragileN.length}</div><div class="lbl">à revoir aujourd'hui</div></div>
      </div>
      <div class="card">
        <div class="row"><b>Profil de connaissances (${total} notions)</b><span class="spacer"></span><span class="small muted">${answered} questions déjà travaillées / ${TECH.length}</span></div>
        ${stackBar(counts, total)}
        <div class="legend-inline small">${ST_ORDER.map((k) => `<span><i class="dot ${ST[k].c}"></i>${ST[k].l} : ${counts[k]}</span>`).join("")}</div>
      </div>

      <h2>Que faire maintenant ?</h2>
      <div class="grid grid-3">
        ${answered < 20 ? `<button class="card action-card hl" data-act="position"><h3>① Test de positionnement</h3><p class="small muted">28 questions, 2 par domaine, ~15 min. Indispensable pour cibler la suite.</p></button>` : ""}
        <button class="card action-card ${answered >= 20 ? "hl" : ""}" data-act="adaptive"><h3>Révision intelligente</h3><p class="small muted">20 questions choisies selon vos lacunes, avec mini-fiches automatiques.</p></button>
        <button class="card action-card" data-act="due"><h3>À revoir aujourd'hui (${due})</h3><p class="small muted">Questions dont la répétition espacée est arrivée à échéance.</p></button>
        <button class="card action-card" data-act="errors"><h3>Erreurs récurrentes (${recur.length})</h3><p class="small muted">Questions ratées ou réussies par élimination / au hasard.</p></button>
        <a class="card action-card card-link" href="#/qcm"><h3>Examen blanc 80 questions</h3><p class="small muted">Conditions d'examen, chronomètre, 10 notions à réviser.</p></a>
        <a class="card action-card card-link urgent" href="#/express"><h3>⚡ Dernières 2 heures</h3><p class="small muted">La veille / le matin : uniquement l'essentiel et vos lacunes.</p></a>
      </div>

      ${saretecDash()}

      <h2>Progression par domaine (test technique)</h2>
      <div class="card dom-list">${TECH_DOMS.map((d) => [d, DOMAINES[d]]).map(([d, l]) => {
        const ns = NOTIONS.filter((n) => n.d === d); const c = {}; ST_ORDER.forEach((k) => { c[k] = 0; }); ns.forEach((n) => c[stats[n.id]]++);
        return `<a class="dom-row" href="#/fiches/d/${d}"><span class="small">${esc(l)}</span>${stackBar(c, ns.length)}<span class="small num muted">${c.acquis}/${ns.length}</span></a>`;
      }).join("")}</div>

      <div class="grid grid-2" style="margin-top:14px">
        <div class="card"><h3>Fragile / non acquis</h3>${fragileN.length ? `<ul>${fragileN.slice(0, 8).map((n) => `<li><a href="#/fiches/${n.id}">${esc(n.t)}</a> ${badge(stats[n.id])}</li>`).join("")}</ul>` : `<p class="muted small">Rien pour l'instant — faites le test de positionnement.</p>`}</div>
        <div class="card"><h3>Erreurs récurrentes</h3>${recur.length ? `<ul class="small">${recur.slice(0, 6).map((q) => `<li>${esc(q.q)} <span class="muted">(${P.wrongCount(q.id)}×)</span></li>`).join("")}</ul>` : `<p class="muted small">Aucune question ratée deux fois.</p>`}</div>
      </div>

      <h2>À écrire sur le mur</h2>
      <div class="mur-grid">${murs.map((m) => `<div class="mur-card">${esc(m)}</div>`).join("")}</div>
      <p class="small"><a href="#/fiches/mur">Voir tous les « À écrire sur le mur »</a></p>

      <h2>Plan pour la journée</h2>
      <div class="timeline">
        ${[["30 min", "Test de positionnement (28 q)", "Repère vos domaines faibles"],
          ["2 h", "Révision intelligente ×4 (20 q)", "Lisez chaque mini-fiche proposée ; priorité toiture, humidité, plaques, chiffrage"],
          ["45 min", "Fiches & schémas", "Coupes : toiture, mur, menuiserie, symptômes d'humidité, rénovation avant/après"],
          ["1 h", "Mises en situation (4 à 6 cas)", "Rédigez votre réponse AVANT de voir l'analyse"],
          ["1 h 15", "Examen blanc 80 questions", "Conditions réelles, sans pause"],
          ["45 min", "Les 10 notions à réviser + erreurs récurrentes", "Fiches ciblées + 3 questions par notion"],
          ["Veille / matin", "⚡ Dernières 2 heures", "Aucune nouvelle notion secondaire"]].map(([t, a, b]) => `<div class="tl"><span class="tl-t">${t}</span><div><b>${a}</b><div class="small muted">${b}</div></div></div>`).join("")}
      </div>

      ${hist.length ? `<h2>Dernières sessions</h2><div class="table-wrap"><table><thead><tr><th>Date</th><th>Session</th><th class="num">Score</th><th class="num">Vraiment su</th></tr></thead><tbody>
        ${hist.map((x) => `<tr><td>${new Date(x.date).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}</td><td>${esc(x.title)}</td><td class="num">${x.score}/${x.n}</td><td class="num">${Math.round((x.solid / x.n) * 100)} %</td></tr>`).join("")}</tbody></table></div>` : ""}
      <p class="small muted" style="margin-top:20px">Profil enregistré dans ce navigateur. <button class="btn sm ghost" id="reset">Réinitialiser mon profil</button></p>
    `));
    $$("[data-act]", el).forEach((b) => b.onclick = () => {
      const a = b.dataset.act;
      if (a === "position") startSession({ type: "position", title: "Test de positionnement", questions: positionPick(), mode: "imm" });
      if (a === "adaptive") startSession({ type: "adaptive", title: "Révision intelligente", questions: adaptivePick(20), mode: "imm", adaptive: true });
      if (a === "due") startSession({ type: "due", title: "À revoir aujourd'hui", questions: shuffle(dueList()).slice(0, 25), mode: "imm", adaptive: true });
      if (a === "errors") startSession({ type: "errors", title: "Erreurs récurrentes", questions: errorsPick(20), mode: "imm", adaptive: true });
    });
    $("#reset", el).onclick = () => { if (confirm("Effacer tout votre profil de connaissances et l'historique ?")) { P.reset(); router(); } };
  }

  // =====================================================================
  // QCM : choix des sessions + banque
  // =====================================================================
  const cfg = store.get("cfg2", { n: 20, mode: "imm", doms: Object.keys(DOMAINES).filter((d) => d !== "saretec"), lvs: [1, 2, 3, 4], examMin: 60 });
  function renderQcm(el, sub) {
    el.append(h(`
      <h1>QCM & examens</h1>
      <div class="tabs">
        <a class="tab ${sub !== "banque" ? "on" : ""}" href="#/qcm">S'entraîner</a>
        <a class="tab ${sub === "banque" ? "on" : ""}" href="#/qcm/banque">Banque de questions (${QUESTIONS.length})</a>
      </div><div id="qbody"></div>`));
    const body = $("#qbody", el);
    if (sub === "banque") return drawBank(body);
    if (sess && !sess.done) body.append(h(`<div class="callout warn">Une session est en cours : <a href="#/session">reprendre « ${esc(sess.title)} »</a></div>`));
    const lvCount = (l) => QUESTIONS.filter((q) => q.lv === l).length;
    body.append(h(`
      <div class="grid grid-2">
        <div class="card exam-card">
          <h3>📝 80 QUESTIONS — CONDITIONS EXAMEN</h3>
          <p class="small muted">Questions mélangées sur tous les domaines annoncés, difficulté réaliste, pas de correction avant la fin. Score global, par domaine, erreurs de connaissance vs raisonnement, et les 10 notions à réviser.</p>
          <div class="row"><label class="field" style="max-width:200px">Durée<select id="examMin">${[45, 60, 75, 90, 0].map((m) => `<option value="${m}" ${cfg.examMin === m ? "selected" : ""}>${m ? m + " min" : "Sans limite"}</option>`).join("")}</select></label>
          <button class="btn primary" id="goExam" style="align-self:flex-end">Démarrer l'examen blanc</button></div>
        </div>
        <div class="card">
          <h3>🧭 Test de positionnement</h3><p class="small muted">28 questions (2 par domaine), correction immédiate. À faire en premier.</p>
          <button class="btn" id="goPos">Démarrer</button>
          <h3 style="margin-top:16px">🧠 Révision intelligente</h3><p class="small muted">20 questions choisies selon votre profil et la répétition espacée ; mini-fiche automatique si vous ratez 2 questions d'une même notion.</p>
          <button class="btn primary" id="goAd">Démarrer</button>
        </div>
      </div>
      <div class="card" style="margin-top:14px">
        <h3>Session personnalisée</h3>
        <b class="small">Domaines</b>
        <div class="chips" id="cDoms">${Object.entries(DOMAINES).map(([k, l]) => `<button class="chip" data-d="${k}">${esc(l)} <span class="muted">(${QUESTIONS.filter((q) => q.d === k).length})</span></button>`).join("")}</div>
        <div class="row small"><button class="btn sm ghost" id="allD">Tout</button><button class="btn sm ghost" id="noD">Aucun</button></div>
        <b class="small">Niveaux</b>
        <div class="chips" id="cLv">${[1, 2, 3, 4].map((l) => `<button class="chip" data-l="${l}">${LV[l]} (${lvCount(l)})</button>`).join("")}</div>
        <b class="small">Nombre</b>
        <div class="chips" id="cN">${[10, 20, 30, 50].map((n) => `<button class="chip" data-n="${n}">${n}</button>`).join("")}</div>
        <b class="small">Correction</b>
        <div class="chips" id="cM"><button class="chip" data-m="imm">Immédiate</button><button class="chip" data-m="fin">À la fin</button></div>
        <div class="row"><button class="btn primary" id="goC">Démarrer</button><span class="small muted" id="cInfo"></span></div>
      </div>`));
    const pool = () => QUESTIONS.filter((q) => cfg.doms.includes(q.d) && cfg.lvs.includes(q.lv));
    const sync = () => {
      $$("#cDoms .chip", body).forEach((c) => c.classList.toggle("on", cfg.doms.includes(c.dataset.d)));
      $$("#cLv .chip", body).forEach((c) => c.classList.toggle("on", cfg.lvs.includes(+c.dataset.l)));
      $$("#cN .chip", body).forEach((c) => c.classList.toggle("on", +c.dataset.n === cfg.n));
      $$("#cM .chip", body).forEach((c) => c.classList.toggle("on", c.dataset.m === cfg.mode));
      $("#cInfo", body).textContent = `${pool().length} questions disponibles`;
      store.set("cfg2", cfg);
    };
    const tog = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : arr.concat(v));
    $$("#cDoms .chip", body).forEach((c) => c.onclick = () => { cfg.doms = tog(cfg.doms, c.dataset.d); sync(); });
    $$("#cLv .chip", body).forEach((c) => c.onclick = () => { cfg.lvs = tog(cfg.lvs, +c.dataset.l); sync(); });
    $$("#cN .chip", body).forEach((c) => c.onclick = () => { cfg.n = +c.dataset.n; sync(); });
    $$("#cM .chip", body).forEach((c) => c.onclick = () => { cfg.mode = c.dataset.m; sync(); });
    $("#allD", body).onclick = () => { cfg.doms = TECH_DOMS.slice(); sync(); };
    $("#noD", body).onclick = () => { cfg.doms = []; sync(); };
    $("#examMin", body).onchange = (e) => { cfg.examMin = +e.target.value; sync(); };
    $("#goExam", body).onclick = () => startSession({ type: "exam", title: "Examen blanc — 80 questions", questions: examPick(80), mode: "fin", limit: cfg.examMin * 60 });
    $("#goPos", body).onclick = () => startSession({ type: "position", title: "Test de positionnement", questions: positionPick(), mode: "imm" });
    $("#goAd", body).onclick = () => startSession({ type: "adaptive", title: "Révision intelligente", questions: adaptivePick(20), mode: "imm", adaptive: true });
    $("#goC", body).onclick = () => startSession({ type: "custom", title: "Session personnalisée", questions: adaptivePick(cfg.n, pool()), mode: cfg.mode, adaptive: cfg.mode === "imm" });
    sync();
  }

  function drawBank(body) {
    let dom = "all", lv = 0, q = "", showAll = false;
    body.append(h(`
      <p class="muted">Toutes les questions, avec niveau, notion et réponse à la demande.</p>
      <div class="chips" id="bd"></div>
      <div class="chips" id="bl">${[0, 1, 2, 3, 4].map((l) => `<button class="chip" data-l="${l}">${l ? LV[l] : "Tous niveaux"}</button>`).join("")}</div>
      <div class="row" style="margin-bottom:14px"><input type="search" id="bs" placeholder="Rechercher…" style="flex:1;min-width:200px"><button class="btn" id="ta">Afficher toutes les réponses</button></div>
      <div id="bList"></div>`));
    const bd = $("#bd", body);
    [["all", "Tous"], ...Object.entries(DOMAINES)].forEach(([k, l]) => { const b = document.createElement("button"); b.className = "chip"; b.dataset.d = k; b.textContent = l; b.onclick = () => { dom = k; fill(); }; bd.append(b); });
    $$("#bl .chip", body).forEach((c) => c.onclick = () => { lv = +c.dataset.l; fill(); });
    function fill() {
      $$("#bd .chip", body).forEach((c) => c.classList.toggle("on", c.dataset.d === dom));
      $$("#bl .chip", body).forEach((c) => c.classList.toggle("on", +c.dataset.l === lv));
      const ql = norm(q);
      const list = QUESTIONS.filter((x) => (dom === "all" || x.d === dom) && (!lv || x.lv === lv) && (!ql || norm(x.q + " " + x.r.join(" ")).includes(ql)));
      $("#bList", body).innerHTML = `<p class="small muted">${list.length} question(s)</p>` + list.map((x) => `
        <details ${showAll ? "open" : ""}><summary>${esc(x.q)} <span class="tag lv lv${x.lv}">N${x.lv}</span></summary><div>
          <ul>${x.r.map((r, i) => `<li class="${i === 0 ? "ok-txt" : ""}">${i === 0 ? "✓ " : ""}${esc(r)}</li>`).join("")}</ul>
          <div class="small muted">${esc(x.e)} — <a href="#/fiches/${x.n}">${esc(NOTION[x.n] ? NOTION[x.n].t : x.n)}</a></div></div></details>`).join("");
    }
    $("#bs", body).oninput = (e) => { q = e.target.value; fill(); };
    $("#ta", body).onclick = (e) => { showAll = !showAll; e.target.textContent = showAll ? "Masquer les réponses" : "Afficher toutes les réponses"; fill(); };
    fill();
  }

  // =====================================================================
  // FICHES & SCHÉMAS
  // =====================================================================
  const SCHEMA_LIST = [
    ["toiture", "Toiture : charpente et couverture"], ["toitureCouches", "Rampant isolé : couches"], ["murExt", "Mur extérieur + doublage collé"],
    ["doublageOssature", "Doublage sur ossature"], ["cloison", "Cloison 72/48"], ["plancher", "Plancher"], ["facadeIte", "Façade ITE"],
    ["menuiserie", "Menuiserie (coupe + plan)"], ["humidite", "Symptômes d'humidité"], ["fissures", "Fissures"], ["lamesAir", "Lames d'air"],
    ["evier", "Plomberie sous évier"], ["chauffeEau", "Chauffe-eau / groupe de sécurité"], ["vmc", "VMC simple flux"], ["renovation", "Rénovation ancien : avant / à éviter / après"]
  ];
  function renderFiches(el, sub, arg) {
    if (sub && NOTION[sub]) return drawFiche(el, NOTION[sub]);
    const tab = sub === "schemas" ? "schemas" : sub === "renovation" ? "renovation" : sub === "mur" ? "mur" : "notions";
    el.append(h(`
      <h1>Fiches & schémas</h1>
      <p class="lead">Fiches courtes (définition, rôle, localisation, confusion, exemple sinistre) et coupes à reconstruire mentalement.</p>
      <div class="tabs">
        <a class="tab ${tab === "notions" ? "on" : ""}" href="#/fiches">Fiches (${NOTIONS.length})</a>
        <a class="tab ${tab === "schemas" ? "on" : ""}" href="#/fiches/schemas">Schémas & coupes</a>
        <a class="tab ${tab === "renovation" ? "on" : ""}" href="#/fiches/renovation">Rénovation bâti ancien</a>
        <a class="tab ${tab === "mur" ? "on" : ""}" href="#/fiches/mur">À écrire sur le mur</a>
      </div><div id="fb"></div>`));
    const fb = $("#fb", el);
    if (tab === "schemas") {
      fb.append(h(`<div class="chips">${SCHEMA_LIST.map(([k, l]) => `<button class="chip" data-s="${k}">${esc(l)}</button>`).join("")}</div><div id="sch"></div>`));
      const show = (k) => { $$(".chip", fb).forEach((c) => c.classList.toggle("on", c.dataset.s === k)); $("#sch", fb).innerHTML = `<div class="card">${schema(k)}</div>`; store.set("lastSchema", k); };
      $$(".chip", fb).forEach((c) => c.onclick = () => show(c.dataset.s));
      show(store.get("lastSchema", "toiture"));
      return;
    }
    if (tab === "renovation") return drawRenovation(fb);
    if (tab === "mur") {
      fb.append(h(`<p class="muted">Les formules à afficher au-dessus de votre bureau. 🟥 = notions à fort rendement.</p>
        <div class="mur-grid big">${NOTIONS.filter((n) => n.f.mur).sort((a, b) => a.p - b.p).flatMap((n) => n.f.mur.map((m) => `<a class="mur-card ${n.p === 1 ? "p1" : ""}" href="#/fiches/${n.id}">${esc(m)}<span class="small muted">${esc(n.t)}</span></a>`)).join("")}</div>`));
      return;
    }
    let dom = sub === "d" && DOMAINES[arg] ? arg : "all", stF = "all";
    fb.append(h(`<div class="chips" id="fd"></div><div class="chips" id="fs"></div><div class="grid grid-3" id="fl"></div>`));
    const fd = $("#fd", fb), fs = $("#fs", fb);
    [["all", "Tous domaines"], ...Object.entries(DOMAINES)].forEach(([k, l]) => { const b = document.createElement("button"); b.className = "chip"; b.dataset.d = k; b.textContent = l; b.onclick = () => { dom = k; fill(); }; fd.append(b); });
    [["all", "Tous statuts"], ...ST_ORDER.map((k) => [k, ST[k].l])].forEach(([k, l]) => { const b = document.createElement("button"); b.className = "chip"; b.dataset.s = k; b.textContent = l; b.onclick = () => { stF = k; fill(); }; fs.append(b); });
    function fill() {
      $$(".chip", fd).forEach((c) => c.classList.toggle("on", c.dataset.d === dom));
      $$(".chip", fs).forEach((c) => c.classList.toggle("on", c.dataset.s === stF));
      const list = NOTIONS.filter((n) => (dom === "all" || n.d === dom) && (stF === "all" || P.notionStat(n.id).status === stF)).sort((a, b) => a.p - b.p);
      $("#fl", fb).innerHTML = list.map((n) => `<a class="card card-link notion-card" href="#/fiches/${n.id}">
        <div class="row">${badge(P.notionStat(n.id).status)}${n.p === 1 ? `<span class="tag accent">${PRIO[1]}</span>` : ""}</div>
        <h3>${esc(n.t)}</h3><p class="small muted">${esc(n.f.def)}</p><span class="small muted">${esc(DOMAINES[n.d])} · ${qOfNotion(n.id).length} questions</span></a>`).join("") || `<p class="muted">Aucune fiche.</p>`;
    }
    fill();
  }
  function drawFiche(el, n) {
    const same = NOTIONS.filter((x) => x.d === n.d), i = same.indexOf(n);
    const prev = same[i - 1], next = same[i + 1];
    el.append(h(`
      <a href="#/fiches/d/${n.d}" class="small">← ${esc(DOMAINES[n.d])}</a>
      <div class="card" style="margin-top:10px">${ficheHTML(n)}</div>
      <div class="row" style="margin-top:14px">
        <button class="btn primary" id="q3">3 questions ciblées</button>
        <button class="btn" id="q5">5 questions</button>
        <span class="spacer"></span>
        ${prev ? `<a class="btn ghost" href="#/fiches/${prev.id}">← ${esc(prev.t)}</a>` : ""}
        ${next ? `<a class="btn ghost" href="#/fiches/${next.id}">${esc(next.t)} →</a>` : ""}
      </div>`));
    $("#q3", el).onclick = () => notionQuiz(n.id, 3);
    $("#q5", el).onclick = () => notionQuiz(n.id, 5);
  }
  function drawRenovation(fb) {
    fb.append(h(`
      <div class="card"><h3>Que conserver ? Que déposer ? Que réparer ? Que rajouter ?</h3>
        <div class="table-wrap"><table class="crdr"><thead><tr><th>Conserver</th><th>Déposer</th><th>Réparer</th><th>Rajouter</th></tr></thead><tbody><tr>
          <td><ul><li>Structure saine (murs, planchers)</li><li>Enduits chaux sains</li><li>Menuiseries anciennes réparables</li><li>Modénatures, moulures</li></ul></td>
          <td><ul><li>Enduits ciment (int./ext.)</li><li>Peintures plastiques sur mur humide</li><li>Doublages et isolants humides / moisis</li><li>Revêtements de sol étanches sur terre-plein humide</li></ul></td>
          <td><ul><li>Joints à la chaux</li><li>Abouts de solives / poutres</li><li>Gouttières, descentes, pieds de mur</li><li>Fissures (après diagnostic)</li></ul></td>
          <td><ul><li>Isolant perspirant / capillaire</li><li>Frein-vapeur hygrovariable continu</li><li>Ventilation (VMC hygro, entrées d'air)</li><li>Retours d'isolant en tableaux, lame technique</li></ul></td>
        </tr></tbody></table></div>
        <p class="small muted" style="margin-top:8px">Ordre : diagnostiquer → traiter l'humidité (cause) → laisser sécher → isoler de façon compatible → ventiler.</p></div>
      <div class="card" style="margin-top:14px"><h3>Coupes AVANT / À ÉVITER / APRÈS</h3>${schema("renovation")}</div>
      <div class="grid grid-2" style="margin-top:14px">
        <div class="card"><h3>Points de vigilance (interfaces)</h3><ul>
          <li><b>Humidité</b> : capillarité, infiltrations, gestion des eaux pluviales au pied du mur</li>
          <li><b>Ventilation</b> : obligatoire dès qu'on rend le logement plus étanche</li>
          <li><b>Ponts thermiques</b> : planchers intermédiaires, refends, tableaux</li>
          <li><b>Pare-vapeur</b> : côté chaud, continu ; hygrovariable en ancien</li>
          <li><b>Réseaux</b> : électricité ancienne, gaines dans la lame technique</li>
          <li><b>Menuiseries</b> : position dans l'épaisseur, retour d'isolant</li>
          <li><b>Épaisseurs disponibles</b> : surface perdue, radiateurs, prises, plinthes</li></ul></div>
        <div class="card">${ficheHTML(NOTION["iti-ancien"], { compact: true })}</div>
      </div>`));
  }

  // =====================================================================
  // DERNIÈRES 2 HEURES
  // =====================================================================
  function renderExpress(el) {
    const stats = {}; NOTIONS.forEach((n) => { stats[n.id] = P.notionStat(n.id).status; });
    const dangerous = TECH_NOTIONS.filter((n) => n.p <= 2 && ["nonacquis", "fragile"].includes(stats[n.id])).sort((a, b) => a.p - b.p || (stats[a.id] === "nonacquis" ? -1 : 1));
    const fallback = dangerous.length ? dangerous : TECH_NOTIONS.filter((n) => n.p === 1 && stats[n.id] !== "acquis");
    const confs = [];
    QUESTIONS.forEach((q) => (P.att[q.id] || []).forEach((a) => { if (!a.ok && a.ch) confs.push({ q, ch: a.ch, ts: a.ts }); }));
    confs.sort((a, b) => b.ts - a.ts);
    const murs = TECH_NOTIONS.filter((n) => n.p === 1 && n.f.mur).flatMap((n) => n.f.mur);
    el.append(h(`
      <h1>⚡ Dernières 2 heures — veille du test</h1>
      <p class="lead">Uniquement : vos lacunes dangereuses, les confusions, les notions à fort rendement, les schémas et unités indispensables. Aucune nouvelle notion secondaire.</p>
      <div class="timeline compact">${[["0:00", "À écrire sur le mur"], ["0:15", "Mes lacunes dangereuses"], ["0:40", "Schémas indispensables"], ["1:00", "Unités & chiffrage"], ["1:10", "Distinctions assurance"], ["1:20", "Quiz express 20 q"], ["1:45", "Mes confusions"]].map(([t, l], i) => `<a class="tl" href="javascript:void 0" data-go="b${i + 1}"><span class="tl-t">${t}</span><b>${l}</b></a>`).join("")}</div>

      <section id="b1"><h2>1 · À écrire sur le mur (15 min)</h2><div class="mur-grid">${murs.map((m) => `<div class="mur-card p1">${esc(m)}</div>`).join("")}</div></section>

      <section id="b2"><h2>2 · Mes lacunes les plus dangereuses (25 min)</h2>
        ${dangerous.length ? "" : `<p class="small muted">Pas encore assez de données : affichage des notions à fort rendement non acquises.</p>`}
        <div class="grid grid-2">${fallback.slice(0, 8).map((n) => `<div class="card mini-fiche">
          <div class="row">${badge(stats[n.id])}<b>${esc(n.t)}</b></div>
          <p class="small">${esc(n.f.def)}</p><p class="small warn-line">⚠ ${esc(n.f.conf)}</p>${murBox(n.f.mur)}
          <div class="row"><a class="btn sm" href="#/fiches/${n.id}">Fiche</a><button class="btn sm primary" data-n3="${n.id}">3 questions</button></div></div>`).join("")}</div></section>

      <section id="b3"><h2>3 · Schémas indispensables (20 min)</h2>
        ${[["toiture", "Toiture"], ["murExt", "Mur extérieur"], ["menuiserie", "Menuiserie"], ["humidite", "Symptômes d'humidité"], ["evier", "Alimentation / évacuation"], ["lamesAir", "Lames d'air"]].map(([k, l]) => `<details class="card sch-d"><summary>${l}</summary><div>${schema(k)}</div></details>`).join("")}</section>

      <section id="b4"><h2>4 · Unités & chiffrage (10 min)</h2>
        <div class="grid grid-2">
          <div class="table-wrap"><table><thead><tr><th>Unité</th><th>Pour…</th></tr></thead><tbody>
            <tr><td><b>m²</b></td><td>peinture, plafond, parquet, carrelage, BA13, isolant, dépose de surface</td></tr>
            <tr><td><b>ml</b></td><td>plinthes, joints, gouttières, faîtage, relevés, corniches</td></tr>
            <tr><td><b>m³</b></td><td>béton, gravats, terre</td></tr>
            <tr><td><b>U</b></td><td>robinet, radiateur, porte, fenêtre, appareil, caisson</td></tr>
            <tr><td><b>Ft</b></td><td>protection, installation, déplacement mobilier, recherche de fuite</td></tr></tbody></table></div>
          <div class="card"><b>Formules</b><ul class="formulas">
            <li>Sol / plafond = L × l</li><li>Périmètre = 2 × (L + l)</li><li>Murs = périmètre × h − ouvertures</li><li>Plinthes = périmètre − portes</li>
            <li>Fourniture = surface × (1 + chutes)</li><li>Indemnité = VàN − vétusté − franchise</li><li>TVA : 10 % logement &gt; 2 ans ; 20 % &lt; 2 ans</li></ul>
            <b>Chaîne</b><div class="chain small">${["Ouvrage", "Composition", "Dommage", "Travaux", "Quantité", "Prix"].map((x) => `<span>${x}</span>`).join("")}</div>
            <div class="chain small">${["Protéger", "Déposer", "Évacuer", "Préparer", "Fournir / poser", "Finir"].map((x) => `<span>${x}</span>`).join("")}</div></div>
        </div></section>

      <section id="b5"><h2>5 · Distinctions assurance & diagnostic essentielles (10 min)</h2>
        <div class="table-wrap"><table class="dist"><tbody>
          ${[["Origine / cause / dommage", "Où (flexible du voisin) / pourquoi (rupture par usure) / conséquence (plafond taché)"],
            ["Franchise / plafond", "Reste à charge de l'assuré / maximum payé par l'assureur"],
            ["Exclusion / déchéance", "Risque non couvert / perte du droit pour manquement après sinistre"],
            ["Réserve / refus", "Position de garantie suspendue / garantie écartée"],
            ["Recours / subrogation", "Action contre le responsable / l'assureur qui a payé prend les droits de l'assuré"],
            ["IRSI", "Gestionnaire = assureur de l'OCCUPANT ; T1 ≤ 1 600 € HT sans recours ; T2 ≤ 5 000 € HT"],
            ["GPA / biennale / décennale", "1 an tous désordres / 2 ans équipements dissociables / 10 ans solidité-destination — à partir de la RÉCEPTION"],
            ["Fuite / infiltration", "Réseau / pluie ; alimentation = permanent, évacuation = à l'usage"],
            ["Condensation / capillarité", "Air humide + paroi froide (hiver, angles) / eau du sol en pied de mur (frange + sels)"],
            ["Pare-vapeur", "Côté CHAUD ; lame d'air ≠ isolant"],
            ["Locataire / bailleur / copro", "Entretien (joints, flexibles) / vétusté / parties communes (colonnes, toiture, façade)"],
            ["Réemploi / recyclage", "Même usage sans transformation / matière transformée"],
            ["Amiante / plomb", "Permis < 1er juillet 1997 / logement < 1949"]].map(([a, b]) => `<tr><th>${a}</th><td>${b}</td></tr>`).join("")}
        </tbody></table></div></section>

      <section id="b6"><h2>6 · Quiz express (25 min)</h2>
        <div class="card"><p class="small muted">20 questions de niveau 2-3 tirées de vos notions fragiles / non acquises à fort rendement, correction immédiate.</p><button class="btn primary" id="goEx">Lancer le quiz express</button></div></section>

      <section id="b7"><h2>7 · Mes confusions récentes</h2>
        ${confs.length ? `<div class="card"><ul class="conf-list">${confs.slice(0, 15).map((c) => `<li><b>${esc(c.q.q)}</b><br>✗ ${esc(c.ch)}<br><span class="ok-txt">✓ ${esc(c.q.r[0])}</span></li>`).join("")}</ul></div>` : `<p class="muted small">Aucune confusion enregistrée pour l'instant.</p>`}</section>
    `));
    $$("[data-go]", el).forEach((a) => a.onclick = () => $("#" + a.dataset.go).scrollIntoView({ behavior: "smooth" }));
    $$("[data-n3]", el).forEach((b) => b.onclick = () => notionQuiz(b.dataset.n3));
    $("#goEx", el).onclick = () => startSession({ type: "express", title: "Quiz express — dernières 2 h", questions: expressPick(20), mode: "imm", adaptive: false });
  }

  // =====================================================================
  // CARBONE & RÉGLEMENTATION
  // =====================================================================
  function renderEnv(el, sub) {
    const tab = sub === "reglementation" ? "regl" : sub === "plus" ? "plus" : "carbone";
    el.append(h(`
      <h1>Carbone & réglementation</h1>
      <p class="lead">Le niveau utile pour un test de recrutement bâtiment : court, appliqué à l'expertise.</p>
      <div class="tabs">
        <a class="tab ${tab === "carbone" ? "on" : ""}" href="#/environnement">Carbone (l'essentiel)</a>
        <a class="tab ${tab === "regl" ? "on" : ""}" href="#/environnement/reglementation">Réglementation utile</a>
        <a class="tab ${tab === "plus" ? "on" : ""}" href="#/environnement/plus">Pour aller plus loin</a>
      </div><div id="eb"></div>`));
    const eb = $("#eb", el);
    if (tab === "carbone") {
      eb.append(h(`
        <div class="chain">${["Extraction", "Fabrication", "Transport", "Mise en œuvre", "Usage / entretien", "Fin de vie"].map((x) => `<span>${x}</span>`).join("")}</div>
        <p class="small muted">ACV = toutes ces étapes. Carbone incorporé = tout sauf l'énergie consommée pendant l'usage du bâtiment.</p>
        <div class="table-wrap" style="margin:12px 0"><table><thead><tr><th>Notion</th><th>À retenir</th></tr></thead><tbody>
          <tr><td>Carbone incorporé</td><td>Émissions liées aux MATÉRIAUX (kgCO₂eq)</td></tr>
          <tr><td>Énergie grise</td><td>Énergie consommée sur le cycle de vie hors usage</td></tr>
          <tr><td>ACV</td><td>Du berceau à la tombe ; RE2020 : 50 ans, méthode dynamique</td></tr>
          <tr><td>FDES / INIES</td><td>Fiche environnementale d'un produit / base de données nationale</td></tr>
          <tr><td>Durée de vie</td><td>Matériau remplacé souvent = impact multiplié</td></tr>
          <tr><td>Fort impact</td><td>Ciment/béton, acier, aluminium, verre, plastiques</td></tr>
          <tr><td>Faible impact</td><td>Bois, biosourcés (stockent du carbone), terre, réemploi</td></tr>
          <tr><td>Réemploi ≠ recyclage</td><td>Même usage sans transformation ≠ matière transformée</td></tr>
          <tr><td>Dans un sinistre</td><td>Réparer &gt; remplacer ; réemployer ; limiter les déplacements (télé-expertise !)</td></tr>
        </tbody></table></div>
        ${murBox(["Réparer < remplacer en carbone", "Prévention > réemploi > recyclage > valorisation > élimination", "RE2020 = neuf ; DPE = existant"])}
        <div class="grid grid-2" style="margin-top:14px">${NOTIONS.filter((n) => n.d === "carbone").map((n) => `<div class="card">${ficheHTML(n, { compact: true })}<button class="btn sm primary" data-n3="${n.id}">3 questions</button></div>`).join("")}</div>`));
    } else if (tab === "regl") {
      const groups = [...new Set(REGLEMENTATION.map((r) => r.g))];
      eb.append(h(`<div class="callout warn small">⚠ = information chiffrée ou susceptible d'avoir évolué : <b>vérifiez avec une source à jour</b> (Légifrance, service-public.fr, France Assureurs) avant de la citer.</div>
        ${groups.map((g) => `<h2>${esc(g)}</h2><div class="grid grid-2">${REGLEMENTATION.filter((r) => r.g === g).map((r) => `<div class="card regl">
          <h3>${esc(r.nom)} ${r.v ? `<span class="tag accent" title="À vérifier avec une source à jour">⚠ à vérifier</span>` : ""}</h3>
          <div class="small"><b>Concerne :</b> ${esc(r.concerne)}</div>
          <div class="small"><b>Pourquoi pour l'expert :</b> ${esc(r.interet)}</div>
          <div class="retenir">🟥 ${esc(r.retenir)}</div></div>`).join("")}</div>`).join("")}
        <div class="card" style="margin-top:14px"><button class="btn primary" id="rq">QCM réglementation + assurance (15 q)</button></div>`));
      $("#rq", eb).onclick = () => startSession({ type: "custom", title: "Réglementation & assurance", questions: adaptivePick(15, QUESTIONS.filter((q) => q.d === "regl" || q.d === "assur")), mode: "imm", adaptive: true });
    } else {
      eb.append(h(`<div class="chips" id="envToc">${ENV_SECTIONS.map((s) => `<button class="chip" data-id="${s.id}">${esc(s.titre)}</button>`).join("")}</div>
        ${ENV_SECTIONS.map((s) => `<section id="env-${s.id}" style="scroll-margin-top:70px"><h2>${esc(s.titre)}</h2>${s.html}</section>`).join("")}`));
      $$("#envToc .chip", eb).forEach((b) => b.onclick = () => $("#env-" + b.dataset.id).scrollIntoView({ behavior: "smooth" }));
    }
    $$("[data-n3]", eb).forEach((b) => b.onclick = () => notionQuiz(b.dataset.n3));
  }

  // =====================================================================
  // MISES EN SITUATION
  // =====================================================================
  function renderCas(el, sub, arg) {
    if (sub === "x" && arg) { const c = CAS_EXPERT.find((x) => x.id === decodeURIComponent(arg)); if (c) return drawExpertCase(el, c); }
    if (sub === "g" && arg) { const c = CAS.find((x) => x.id === arg); if (c) return drawCase(el, c); }
    if (sub && !["outils", "guides"].includes(sub)) { const c = CAS.find((x) => x.id === sub); if (c) return drawCase(el, c); }
    const tab = sub === "outils" ? "outils" : sub === "guides" ? "guides" : "expert";
    const done = store.get("casScores", {});
    el.append(h(`
      <h1>Mises en situation</h1>
      <p class="lead">Rédigez votre réponse comme à l'oral avec le manager, puis comparez : ce qui était correct, incomplet, dangereux, et ce qu'un expert aurait vérifié.</p>
      <div class="tabs">
        <a class="tab ${tab === "expert" ? "on" : ""}" href="#/cas">Cas d'expertise (${CAS_EXPERT.length})</a>
        <a class="tab ${tab === "guides" ? "on" : ""}" href="#/cas/guides">Cas guidés chiffrés (${CAS.length})</a>
        <a class="tab ${tab === "outils" ? "on" : ""}" href="#/cas/outils">Outils de chiffrage</a>
      </div><div id="cbody"></div>`));
    const body = $("#cbody", el);
    if (tab === "outils") return drawTools(body);
    if (tab === "guides") {
      body.append(h(`<div class="grid grid-2">${CAS.map((c) => `<a class="card card-link" href="#/cas/g/${c.id}">
        <div class="row" style="margin-bottom:6px"><span class="tag">${esc(c.tag)}</span><span class="tag accent">${esc(c.niveau)}</span>${c.chiffrage ? `<span class="tag">Chiffrage</span>` : ""}</div>
        <h3>${esc(c.titre)}</h3><p class="muted small" style="margin:0">${esc(c.resume)}</p></a>`).join("")}</div>`));
      return;
    }
    body.append(h(`<div class="chain small" style="margin-bottom:14px">${["Origine", "Dommages", "Vérifications", "Travaux", "Chiffrage", "Assurance"].map((x) => `<span>${x}</span>`).join("")}</div>
      <div class="grid grid-2">${CAS_EXPERT.map((c) => `<a class="card card-link" href="#/cas/x/${encodeURIComponent(c.id)}">
        <div class="row" style="margin-bottom:6px"><span class="tag">${esc(c.tag)}</span><span class="tag lv lv${c.niveau}">${LV[c.niveau]}</span>${done[c.id] !== undefined ? `<span class="tag ${done[c.id] >= 70 ? "ok-tag" : "accent"}">Fait : ${done[c.id]} %</span>` : ""}${c.chiffrage ? `<span class="tag">Chiffrage</span>` : ""}</div>
        <h3>${esc(c.titre)}</h3><p class="muted small" style="margin:0">${c.enonce.replace(/<[^>]+>/g, "").slice(0, 150)}…</p></a>`).join("")}</div>`));
  }

  function kwHit(text, kw, negCheck) {
    const k = norm(kw);
    if (!k) return false;
    if (k.length <= 3) return new RegExp("(^|[^a-z0-9])" + k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([^a-z0-9]|$)").test(text);
    let i = text.indexOf(k);
    while (i >= 0) {
      if (!negCheck) return true;
      const before = text.slice(Math.max(0, i - 22), i);
      if (!/(^|\s)(pas|non|ne|n'|sans|aucun|jamais|eviter|evite|ni)(\s|$)[^.]*$/.test(before)) return true;
      i = text.indexOf(k, i + 1);
    }
    return false;
  }
  function drawExpertCase(el, c, back) {
    const key = "xnote_" + c.id;
    el.append(h(`
      ${back === false ? "" : `<a href="#/cas" class="small">← Toutes les mises en situation</a>`}
      <h1 style="margin-top:10px">${esc(c.titre)}</h1>
      <div class="row" style="margin-bottom:12px"><span class="tag">${esc(c.tag)}</span><span class="tag lv lv${c.niveau}">${LV[c.niveau]}</span></div>
      <div class="card enonce">${c.enonce}</div>
      <div class="card" style="margin-top:12px">
        <b>Votre réponse</b> <span class="small muted">— pensez : qualification, origine, lien causal, étendue, vérifications / pièces manquantes, travaux, chiffrage, garantie, recours.</span>
        <textarea id="ans" style="min-height:180px;margin-top:8px" placeholder="Rédigez comme si vous répondiez au manager…">${esc(store.get(key, ""))}</textarea>
        <div class="row" style="margin-top:10px"><button class="btn primary" id="analyse">Analyser ma réponse</button><button class="btn ghost sm" id="peek">Voir la correction sans répondre</button></div>
      </div>
      <div id="fb"></div>`));
    const ta = $("#ans", el);
    ta.oninput = () => store.set(key, ta.value);
    const run = (forced) => {
      const text = norm(ta.value || "");
      if (!forced && text.trim().length < 40) { alert("Rédigez d'abord une réponse (au moins quelques phrases) : c'est l'exercice qui fait progresser."); return; }
      const items = [];
      c.grille.forEach((g) => g.items.forEach((it) => items.push({ k: g.k, t: it.t, hit: !forced && (it.kw || []).some((kw) => kwHit(text, kw, false)) })));
      const dang = c.dangers.map((d) => ({ t: d.t, hit: !forced && (d.kw || []).some((kw) => kwHit(text, kw, true)) }));
      const fb = $("#fb", el);
      const render = () => {
        const score = Math.round((items.filter((x) => x.hit).length / items.length) * 100);
        fb.innerHTML = `
          <h2>Analyse ${forced ? "(correction)" : `— couverture ${score} %`}</h2>
          ${forced ? "" : `<p class="small muted">Détection automatique par mots-clés : cochez / décochez si votre formulation était différente.</p>`}
          <div class="grid grid-2">
            <div class="card"><h3 class="ok-txt">✔ Ce qui était correct</h3>${items.filter((x) => x.hit).length ? `<ul class="chk">${items.map((x, i) => x.hit ? `<li><label><input type="checkbox" data-i="${i}" checked> <b>${esc(x.k)}</b> — ${esc(x.t)}</label></li>` : "").join("")}</ul>` : `<p class="small muted">—</p>`}</div>
            <div class="card"><h3 style="color:var(--warn)">◐ Ce qui était incomplet / manquant</h3>${items.filter((x) => !x.hit).length ? `<ul class="chk">${items.map((x, i) => !x.hit ? `<li><label><input type="checkbox" data-i="${i}"> <b>${esc(x.k)}</b> — ${esc(x.t)}</label></li>` : "").join("")}</ul>` : `<p class="small muted">Tout y est !</p>`}</div>
            <div class="card"><h3 class="ko-txt">⚠ Ce qui était dangereux</h3><ul>${dang.map((d) => `<li class="${d.hit ? "ko-txt" : ""}">${d.hit ? "<b>Détecté dans votre réponse :</b> " : ""}${esc(d.t)}</li>`).join("")}</ul><p class="small muted">${dang.some((d) => d.hit) ? "Relisez votre formulation : si elle était nuancée, ignorez l'alerte." : "Pièges à éviter dans ce type de cas."}</p></div>
            <div class="card"><h3>🔎 Ce qu'un expert aurait vérifié</h3><ul>${c.expert.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
          </div>
          <h3>La chaîne complète</h3>
          <div class="chain-cards">${[["Origine", c.chaine.origine], ["Dommages", c.chaine.dommages], ["Vérifications", c.chaine.verifications], ["Travaux", c.chaine.travaux], ["Chiffrage", c.chaine.chiffrage], ["Assurance", c.chaine.assurance]].map(([k, v]) => `<div class="cc"><b>${k}</b><span>${esc(v)}</span></div>`).join("")}</div>
          <p class="small" style="margin-top:10px">Notions liées : ${c.notions.map((id) => NOTION[id] ? `<a href="#/fiches/${id}">${esc(NOTION[id].t)}</a> ${badge(P.notionStat(id).status)}` : "").join(" · ")}</p>
          <div id="xch"></div>`;
        $$(".chk input", fb).forEach((cb) => cb.onchange = () => { items[+cb.dataset.i].hit = cb.checked; save(); render(); });
        if (c.chiffrage) drawChiffrage($("#xch", fb), c);
      };
      const save = () => { if (forced) return; const s = store.get("casScores", {}); s[c.id] = Math.round((items.filter((x) => x.hit).length / items.length) * 100); store.set("casScores", s); };
      save(); render();
      fb.scrollIntoView({ behavior: "smooth" });
    };
    $("#analyse", el).onclick = () => run(false);
    $("#peek", el).onclick = () => { if (confirm("Voir la correction sans avoir répondu ? Vous progresserez beaucoup plus en rédigeant d'abord.")) run(true); };
  }

  // ---------- Cas guidés (existant) ----------
  function drawCase(el, c) {
    el.append(h(`
      <a href="#/cas/guides" class="small">← Cas guidés</a>
      <h1 style="margin-top:10px">${esc(c.titre)}</h1>
      <div class="row" style="margin-bottom:14px"><span class="tag">${esc(c.tag)}</span><span class="tag accent">${esc(c.niveau)}</span></div>
      <div class="card"><h3>Contexte</h3>${c.contexte}<h3>Données</h3><ul>${c.donnees.map((d) => `<li>${esc(d)}</li>`).join("")}</ul></div>
      <h2>Questions</h2>
      <div class="row" style="margin-bottom:8px"><span class="spacer"></span><button class="btn sm" id="showAllSol">Afficher toutes les corrections</button></div>
      <div id="steps"></div><div id="chiffrage"></div>
      <h2>À retenir</h2><div class="callout ok"><ul style="margin:0">${c.retenir.map((r) => `<li>${esc(r)}</li>`).join("")}</ul></div>`));
    const steps = $("#steps", el);
    c.etapes.forEach((s, i) => {
      const key = `note_${c.id}_${i}`;
      steps.append(h(`<div class="card step"><div class="step-q">${i + 1}. ${esc(s.q)}</div>
        <textarea placeholder="Votre réponse (enregistrée dans ce navigateur)…" style="margin-top:10px">${esc(store.get(key, ""))}</textarea>
        <div class="row" style="margin-top:8px"><button class="btn sm sol-btn">Voir la correction</button></div>
        <div class="solution callout hidden">${s.r}</div></div>`));
      const card = steps.lastElementChild;
      $("textarea", card).oninput = (e) => store.set(key, e.target.value);
      $(".sol-btn", card).onclick = (e) => { const sol = $(".solution", card); sol.classList.toggle("hidden"); e.target.textContent = sol.classList.contains("hidden") ? "Voir la correction" : "Masquer la correction"; };
    });
    $("#showAllSol", el).onclick = () => { $$(".solution", steps).forEach((s) => s.classList.remove("hidden")); $$(".sol-btn", steps).forEach((b) => { b.textContent = "Masquer la correction"; }); };
    if (c.chiffrage) drawChiffrage($("#chiffrage", el), c);
  }

  function drawChiffrage(box, c) {
    const ch = c.chiffrage;
    const lignes = ch.lignes.map((l) => ({ ...l }));
    box.append(h(`
      <h2>Chiffrage</h2>
      <div class="card"><p>Établissez votre estimation (métré × prix unitaires), puis comparez. <span class="muted small">Prix indicatifs fournis pour l'exercice — l'important est la logique, les unités et les quantités. Quantités et prix modifiables.</span></p>
        <div class="row"><label class="field" style="max-width:240px">Votre estimation (total HT, €)<input type="number" class="myEst" min="0" step="10"></label>
          <button class="btn primary showCh" style="align-self:flex-end">Afficher le chiffrage corrigé</button></div>
        <div class="cmp small" style="margin-top:8px"></div></div>
      <div class="chTable hidden" style="margin-top:14px"></div>`));
    const tbl = $(".chTable", box), est = $(".myEst", box);
    const compute = () => {
      let ht = 0, vet = 0;
      lignes.forEach((l) => { l.tot = l.q * l.pu; ht += l.tot; vet += l.tot * (1 + ch.tva / 100) * (l.v / 100); });
      const tva = ht * ch.tva / 100, ttc = ht + tva;
      let indem = Math.max(0, ttc - vet - ch.franchise); const avantCoef = indem;
      if (ch.coef) indem *= ch.coef.value;
      return { ht, tva, ttc, vet, indem, avantCoef };
    };
    const draw = () => {
      const r = compute();
      tbl.innerHTML = `<div class="table-wrap"><table>
        <thead><tr><th>Désignation</th><th>U</th><th class="num">Qté</th><th class="num">PU HT</th><th class="num">Total HT</th><th class="num">Vétusté</th></tr></thead>
        <tbody>${lignes.map((l, i) => `<tr><td>${esc(l.d)}<div class="calc-line">Métré : ${esc(l.calc)}</div></td><td><b>${esc(l.u)}</b></td>
          <td class="num"><input class="pu" data-i="${i}" data-k="q" type="number" step="0.1" value="${l.q}"></td>
          <td class="num"><input class="pu" data-i="${i}" data-k="pu" type="number" step="0.5" value="${l.pu}"></td>
          <td class="num">${eur(l.tot)}</td><td class="num">${l.v ? l.v + " %" : "—"}</td></tr>`).join("")}</tbody>
        <tfoot>
          <tr><td colspan="4">Total HT</td><td class="num">${eur(r.ht)}</td><td></td></tr>
          <tr><td colspan="4">TVA ${ch.tva} %</td><td class="num">${eur(r.tva)}</td><td></td></tr>
          <tr><td colspan="4">Total TTC (valeur à neuf)</td><td class="num">${eur(r.ttc)}</td><td></td></tr>
          <tr><td colspan="4">Vétusté déduite</td><td class="num">− ${eur(r.vet)}</td><td></td></tr>
          <tr><td colspan="4">Franchise</td><td class="num">− ${eur(ch.franchise)}</td><td></td></tr>
          ${ch.coef ? `<tr><td colspan="4">Sous-total</td><td class="num">${eur(r.avantCoef)}</td><td></td></tr><tr><td colspan="4">${esc(ch.coef.label)} × ${nf(ch.coef.value, 4)}</td><td class="num">− ${eur(r.avantCoef - r.indem)}</td><td></td></tr>` : ""}
          <tr class="total"><td colspan="4">Indemnité immédiate</td><td class="num">${eur(r.indem)}</td><td></td></tr>
        </tfoot></table></div>
        <p class="small muted" style="margin-top:8px">${esc(ch.note)}${r.vet > 0 ? " La vétusté peut être partiellement récupérable sur factures selon le contrat." : ""}</p>`;
      $$("input.pu", tbl).forEach((inp) => inp.onchange = () => { lignes[+inp.dataset.i][inp.dataset.k] = num(inp.value); draw(); compare(); });
    };
    const compare = () => {
      const mine = num(est.value), out = $(".cmp", box);
      if (!mine || tbl.classList.contains("hidden")) { out.innerHTML = ""; return; }
      const ref = compute().ht, ecart = ((mine - ref) / ref) * 100, ok = Math.abs(ecart) <= 15;
      out.innerHTML = `Votre estimation : <b>${eur(mine)}</b> · Correction : <b>${eur(ref)}</b> · Écart : <b class="${ok ? "ok-txt" : "ko-txt"}">${ecart > 0 ? "+" : ""}${nf(ecart, 1)} %</b> ${ok ? "— cohérent." : "— vérifiez quantités et postes oubliés."}`;
    };
    $(".showCh", box).onclick = (e) => { tbl.classList.toggle("hidden"); e.target.textContent = tbl.classList.contains("hidden") ? "Afficher le chiffrage corrigé" : "Masquer le chiffrage"; compare(); };
    est.oninput = compare;
    draw();
  }

  // ---------- Calculateurs (existant) ----------
  const CALCS = [
    { id: "piece", titre: "Métré d'une pièce", desc: "Surfaces de murs, plafond, sol, plinthes et peinture.",
      f: [["L", "Longueur (m)", 4], ["l", "Largeur (m)", 3], ["h", "Hauteur (m)", 2.5], ["op", "Surface des ouvertures (m²)", 3.39], ["pt", "Largeur cumulée des portes (m)", 0.9], ["co", "Couches de peinture", 2], ["re", "Rendement peinture (m²/L)", 10], ["ch", "Chutes revêtement sol (%)", 10]],
      run: (v) => { const sol = v.L * v.l, per = 2 * (v.L + v.l), mb = per * v.h, mn = Math.max(0, mb - v.op);
        return [["Sol / plafond (m²)", nf(sol) + " m²"], ["Périmètre (ml)", nf(per) + " ml"], ["Murs bruts", nf(mb) + " m²"], ["Murs nets", nf(mn) + " m²"], ["Plinthes", nf(Math.max(0, per - v.pt)) + " ml"], ["Peinture murs + plafond", nf(v.re ? (mn + sol) * v.co / v.re : 0, 1) + " L"], ["Revêtement de sol à commander", nf(sol * (1 + v.ch / 100)) + " m²"]]; } },
    { id: "vetuste", titre: "Vétusté et indemnité", desc: "Vétusté linéaire plafonnée, franchise, vétusté récupérable.",
      f: [["van", "Valeur à neuf TTC (€)", 4000], ["age", "Âge (ans)", 6], ["dv", "Durée de vie (ans)", 10], ["pl", "Plafond de vétusté (%)", 75], ["fr", "Franchise (€)", 150], ["rec", "Vétusté récupérable max. (% VàN)", 25]],
      run: (v) => { const taux = Math.min(v.dv ? v.age / v.dv * 100 : 0, v.pl), vet = v.van * taux / 100, imm = Math.max(0, v.van - vet - v.fr), dif = Math.min(vet, v.van * v.rec / 100);
        return [["Taux de vétusté", nf(taux, 1) + " %"], ["Vétusté", eur(vet)], ["Indemnité immédiate", eur(imm)], ["Indemnité différée (sur factures)", eur(dif)], ["Total maximum", eur(imm + dif)]]; } },
    { id: "rp", titre: "Règles proportionnelles", desc: "Capitaux (L121-5) et prime (L113-9).",
      f: [["dom", "Dommage (€)", 80000], ["cap", "Capital assuré (€)", 450000], ["val", "Valeur réelle (€)", 600000], ["pp", "Prime payée (€)", 480], ["pd", "Prime due (€)", 620], ["fr", "Franchise (€)", 1000]],
      run: (v) => { const rc = v.val ? Math.min(1, v.cap / v.val) : 1, rpm = v.pd ? Math.min(1, v.pp / v.pd) : 1;
        return [["Rapport capitaux", nf(rc * 100, 1) + " %"], ["Indemnité (capitaux) − franchise", eur(Math.max(0, v.dom * rc - v.fr))], ["Rapport primes", nf(rpm * 100, 1) + " %"], ["Indemnité (prime) − franchise", eur(Math.max(0, v.dom * rpm - v.fr))]]; } },
    { id: "toit", titre: "Couverture", desc: "Surface en rampant, tuiles, faîtières.",
      f: [["s", "Surface au sol couverte (m²)", 40], ["p", "Pente (degrés)", 35], ["pc", "Part à refaire (%)", 60], ["t", "Tuiles au m²", 13], ["ca", "Casse (%)", 5], ["fa", "Faîtage (ml)", 10], ["fu", "Faîtières par ml", 3]],
      run: (v) => { const ramp = v.s / Math.cos(v.p * Math.PI / 180), z = ramp * v.pc / 100;
        return [["Surface en rampant", nf(ramp) + " m²"], ["Surface à refaire", nf(z) + " m²"], ["Tuiles", Math.ceil(z * v.t * (1 + v.ca / 100)) + " U"], ["Faîtières", Math.ceil(v.fa * v.fu) + " U"]]; } },
    { id: "beton", titre: "Béton", desc: "Volume, ciment, sacs.",
      f: [["L", "Longueur (m)", 5], ["l", "Largeur (m)", 4], ["e", "Épaisseur (cm)", 12], ["d", "Dosage (kg/m³)", 350], ["sac", "Sac (kg)", 35]],
      run: (v) => { const vol = v.L * v.l * v.e / 100, kg = vol * v.d; return [["Volume", nf(vol, 3) + " m³"], ["Ciment", nf(kg, 0) + " kg"], ["Sacs", (v.sac ? Math.ceil(kg / v.sac) : 0) + " U"]]; } },
    { id: "macon", titre: "Paroi : blocs / plaques", desc: "Blocs béton et plaques de plâtre.",
      f: [["L", "Longueur (m)", 6], ["h", "Hauteur (m)", 2.5], ["op", "Ouvertures (m²)", 1.9], ["bm", "Blocs par m²", 10], ["fa", "Faces en plaques", 2], ["pm", "Surface plaque (m²)", 3], ["ch", "Chutes (%)", 10]],
      run: (v) => { const s = Math.max(0, v.L * v.h - v.op); return [["Surface nette", nf(s) + " m²"], ["Blocs (+5 %)", Math.ceil(s * v.bm * 1.05) + " U"], ["Plaques", (v.pm ? Math.ceil(s * v.fa * (1 + v.ch / 100) / v.pm) : 0) + " U"]]; } },
    { id: "tva", titre: "HT / TTC", desc: "20 % (< 2 ans), 10 % (logement > 2 ans), 5,5 % (rénovation énergétique).",
      f: [["ht", "Montant HT (€)", 5000], ["t", "TVA (%)", 10], ["ttc", "Montant TTC (€)", 6000]],
      run: (v) => [["TTC", eur(v.ht * (1 + v.t / 100))], ["TVA", eur(v.ht * v.t / 100)], ["HT depuis TTC", eur(v.ttc / (1 + v.t / 100))]] }
  ];
  function drawTools(body) {
    body.append(h(`<p class="muted">Vérifiez vos calculs faits à la main. En test, on attend la formule et l'unité.</p><div class="grid grid-2" id="calcs"></div>`));
    const wrap = $("#calcs", body);
    CALCS.forEach((c) => {
      wrap.append(h(`<div class="card" id="calc-${c.id}"><h3>${esc(c.titre)}</h3><p class="small muted">${esc(c.desc)}</p>
        <div class="calc-grid">${c.f.map(([k, l, d]) => `<label class="field">${esc(l)}<input type="number" step="any" data-k="${k}" value="${d}"></label>`).join("")}</div><div class="result-box"></div></div>`));
      const card = $("#calc-" + c.id, wrap);
      const update = () => { const v = {}; $$("input", card).forEach((i) => { v[i.dataset.k] = num(i.value); }); $(".result-box", card).innerHTML = c.run(v).map(([l, r]) => `<div><span>${esc(l)}</span><b>${esc(r)}</b></div>`).join(""); };
      $$("input", card).forEach((i) => i.oninput = update);
      update();
    });
  }

  // =====================================================================
  // VOCABULAIRE (existant)
  // =====================================================================
  const vocabState = { cat: "all", q: "", mode: "liste", deck: [], idx: 0, flipped: false, unknownOnly: false };
  function renderVocab(el) {
    el.append(h(`<h1>Vocabulaire</h1><p class="lead">Glossaire et flashcards (${VOCAB.length} termes).</p>
      <div class="tabs"><button class="tab" data-mode="liste">Glossaire</button><button class="tab" data-mode="flash">Flashcards</button></div>
      <div class="chips" id="vcats"></div><div id="vbody"></div>`));
    const chips = $("#vcats", el);
    [["all", "Tous"], ...Object.entries(VOCAB_CATS)].forEach(([k, label]) => {
      const n = k === "all" ? VOCAB.length : VOCAB.filter((v) => v.c === k).length;
      const b = document.createElement("button"); b.className = "chip"; b.textContent = `${label} (${n})`; b.dataset.cat = k;
      b.onclick = () => { vocabState.cat = k; vocabState.deck = []; draw(); }; chips.append(b);
    });
    $$(".tab", el).forEach((t) => t.onclick = () => { vocabState.mode = t.dataset.mode; vocabState.deck = []; draw(); });
    const filtered = () => { const q = norm(vocabState.q); return VOCAB.filter((v) => (vocabState.cat === "all" || v.c === vocabState.cat) && (!q || norm(v.t + " " + v.d).includes(q))); };
    function draw() {
      $$(".chip", chips).forEach((c) => c.classList.toggle("on", c.dataset.cat === vocabState.cat));
      $$(".tab", el).forEach((t) => t.classList.toggle("on", t.dataset.mode === vocabState.mode));
      const body = $("#vbody", el); body.innerHTML = "";
      if (vocabState.mode === "liste") drawList(body); else drawFlash(body);
    }
    function drawList(body) {
      body.append(h(`<input type="search" id="vsearch" placeholder="Rechercher un terme ou une définition…" value="${esc(vocabState.q)}" style="margin-bottom:16px"><div class="vocab-grid" id="vgrid"></div>`));
      const fill = () => {
        const list = filtered().slice().sort((a, b) => a.t.localeCompare(b.t, "fr"));
        $("#vgrid", body).innerHTML = list.length ? list.map((v) => `<div class="card term"><h4>${esc(v.t)} <span class="tag">${esc(VOCAB_CATS[v.c].split(" ")[0])}</span></h4><p>${esc(v.d)}</p></div>`).join("") : `<p class="muted">Aucun résultat.</p>`;
      };
      const input = $("#vsearch", body); input.oninput = () => { vocabState.q = input.value; fill(); }; fill();
    }
    function drawFlash(body) {
      const known = new Set(store.get("known", []));
      if (!vocabState.deck.length) {
        let pool = VOCAB.filter((v) => vocabState.cat === "all" || v.c === vocabState.cat);
        if (vocabState.unknownOnly) pool = pool.filter((v) => !known.has(v.t));
        vocabState.deck = shuffle(pool); vocabState.idx = 0; vocabState.flipped = false;
      }
      const deck = vocabState.deck, total = VOCAB.filter((v) => vocabState.cat === "all" || v.c === vocabState.cat);
      const knownCount = total.filter((v) => known.has(v.t)).length;
      if (!deck.length || vocabState.idx >= deck.length) {
        body.append(h(`<div class="flash-wrap"><div class="card" style="text-align:center"><h3>${deck.length ? "Paquet terminé" : "Aucune carte à réviser"}</h3>
          <p class="muted">${knownCount} / ${total.length} termes acquis.</p><div class="row" style="justify-content:center"><button class="btn primary" id="restart">Recommencer</button><button class="btn" id="resetKnown">Réinitialiser</button></div></div></div>`));
        $("#restart", body).onclick = () => { vocabState.deck = []; draw(); };
        $("#resetKnown", body).onclick = () => { store.set("known", [...known].filter((t) => !total.some((v) => v.t === t))); vocabState.deck = []; draw(); };
        return;
      }
      const card = deck[vocabState.idx];
      body.append(h(`<div class="flash-wrap">
        <div class="row small muted" style="margin-bottom:8px"><span>Carte ${vocabState.idx + 1} / ${deck.length}</span><span class="spacer"></span><label class="check"><input type="checkbox" id="unk" ${vocabState.unknownOnly ? "checked" : ""}> Seulement non acquis</label></div>
        <div class="progress" style="margin-bottom:14px"><span style="width:${(vocabState.idx / deck.length) * 100}%"></span></div>
        <div class="card flash" id="fcard" tabindex="0" role="button">${vocabState.flipped ? `<div><div class="tag" style="margin-bottom:10px">${esc(card.t)}</div><div class="fd">${esc(card.d)}</div></div>` : `<div><div class="ft">${esc(card.t)}</div><p class="muted small" style="margin-top:12px">Cliquez (ou Espace) pour la définition</p></div>`}</div>
        <div class="row" style="justify-content:center;margin-top:14px"><button class="btn" id="again">À revoir</button><button class="btn primary" id="gotit">Je savais ✓</button></div>
        <p class="small muted" style="text-align:center;margin-top:10px">${knownCount} / ${total.length} acquis</p></div>`));
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
  // ENTRETIEN
  // =====================================================================
  function renderEntretien(el) {
    const E = ENTRETIEN, done = new Set(store.get("checklist2", []));
    const qcats = [...new Set(E.questions.map((q) => q.cat))];
    el.append(h(`
      <h1>Entretiens manager & RH</h1>
      <p class="lead">Processus annoncé : test écrit → manager → RH.</p>
      <div class="grid">${E.process.map((p, i) => `<div class="card" style="display:flex;gap:14px"><div class="brand-mark" style="flex:none">${i + 1}</div><div><b>${esc(p.t)}</b><p class="small muted" style="margin:4px 0 0">${esc(p.d)}</p></div></div>`).join("")}</div>
      <h2>Questions probables</h2>
      <div class="chips" id="eqcats"><button class="chip on" data-c="all">Toutes</button>${qcats.map((c) => `<button class="chip" data-c="${esc(c)}">${esc(c)}</button>`).join("")}</div>
      <div id="eqlist"></div>
      <h2>Méthode STAR</h2>
      <div class="grid grid-4">${E.star.map(([t, d]) => `<div class="card"><b>${esc(t)}</b><p class="small muted" style="margin:4px 0 0">${esc(d)}</p></div>`).join("")}</div>
      <h2>Trame d'un compte rendu / rapport</h2>
      <div class="table-wrap"><table><tbody>${E.rapport.map(([t, d]) => `<tr><th style="width:200px">${esc(t)}</th><td>${esc(d)}</td></tr>`).join("")}</tbody></table></div>
      <h2>Questions à poser</h2><ul>${E.aPoser.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>
      <h2>Checklist de la veille</h2>
      <div class="card" id="check">${E.checklist.map((c, i) => `<label class="check" style="margin:8px 0"><input type="checkbox" data-i="${i}" ${done.has(i) ? "checked" : ""}> ${esc(c)}</label>`).join("")}</div>`));
    let cur = "all";
    const fill = () => {
      $$("#eqcats .chip", el).forEach((c) => c.classList.toggle("on", c.dataset.c === cur));
      $("#eqlist", el).innerHTML = E.questions.filter((q) => cur === "all" || q.cat === cur).map((q) => `<details><summary>${esc(q.q)} <span class="tag" style="margin-left:6px">${esc(q.cat)}</span></summary><div>${esc(q.a)}</div></details>`).join("");
    };
    $$("#eqcats .chip", el).forEach((c) => c.onclick = () => { cur = c.dataset.c; fill(); });
    $$("#check input", el).forEach((i) => i.onchange = () => { if (i.checked) done.add(+i.dataset.i); else done.delete(+i.dataset.i); store.set("checklist2", [...done]); });
    fill();
  }

  // =====================================================================
  // MODULE SARETEC — ENTRETIEN RH & CONNAISSANCE DE L'ENTREPRISE
  // =====================================================================
  const SAR_TABS = [["60s", "Saretec en 60 s"], ["mission", "Entreprise à mission"], ["carbone", "Bas carbone"], ["distance", "Expertise à distance"],
    ["metier", "Télé-expert : attentes"], ["economie", "Économie de la construction"], ["eco", "Capsens · Keywiiz · OSF"], ["pourquoi", "Pourquoi Saretec ?"],
    ["rh", "Simulation RH (20 q)"], ["express", "Saretec express"], ["sources", "Sources"]];
  const srcTags = (str) => esc(str).replace(/\[(S\/I|S|I)([^\]]*)\]/g, (m, t, rest) => `<span class="src src-${t === "I" ? "i" : "s"}">${t === "I" ? "Interprétation" : t === "S/I" ? "Source + interprétation" : "Source"}${rest.replace(/^,\s*/, " · ")}</span>`);
  const words = (t) => (String(t).trim().match(/\S+/g) || []).length;
  const speak = (t) => `${words(t)} mots ≈ ${Math.round(words(t) / 2.5)} s à l'oral`;
  const SAR_NOTIONS = () => NOTIONS.filter((n) => n.d === "saretec").map((n) => n.id);

  function analyseRH(text, attendus, specific) {
    const nt = norm(text || "");
    const items = attendus.map((a) => ({ t: a.t, hit: a.kw.length ? a.kw.some((k) => kwHit(nt, k, false)) : null }));
    const dangers = SARETEC_DANGERS.concat(specific || []).filter((d) => d.kw.some((k) => kwHit(nt, k, true))).map((d) => d.t);
    return { items, dangers };
  }
  function practiceBox(key, question, modele, after) {
    const id = "pb" + Math.random().toString(36).slice(2, 8);
    return {
      html: `<div class="card practice" id="${id}"><b>${esc(question)}</b>
        <textarea placeholder="Répondez comme à l'oral, avec vos mots…" style="margin-top:8px">${esc(store.get(key, ""))}</textarea>
        <div class="row" style="margin-top:8px"><button class="btn sm primary pb-go">Voir la réponse modèle</button><span class="small muted pb-len"></span></div>
        <div class="pb-out hidden"></div></div>`,
      bind(root) {
        const box = $("#" + id, root), ta = $("textarea", box), len = $(".pb-len", box);
        const upd = () => { len.textContent = ta.value.trim() ? speak(ta.value) : ""; };
        ta.oninput = () => { store.set(key, ta.value); upd(); }; upd();
        $(".pb-go", box).onclick = () => {
          if (words(ta.value) < 15 && !confirm("Vous n'avez presque rien écrit. Voir le modèle quand même ? (Vous progresserez plus en répondant d'abord.)")) return;
          const out = $(".pb-out", box); out.classList.remove("hidden");
          out.innerHTML = `<div class="callout ok" style="margin-top:10px"><b>Réponse modèle (${speak(modele)})</b><p style="margin:6px 0 0">${esc(modele)}</p></div>${after || ""}`;
        };
      }
    };
  }

  function saretecDash() {
    const st = (id) => badge(P.notionStat(id).status);
    const rh = store.get("rhScores", {});
    const done = Object.keys(rh).length, avg = done ? Math.round(Object.values(rh).reduce((a, b) => a + b, 0) / done) : 0;
    const cats = [
      ["1. L'entreprise", "60s", ["sar-entreprise", "sar-ecosysteme"], "Qui, quoi, pour qui, quels risques"],
      ["2. Le métier de télé-expert", "metier", ["sar-teleexpert", "sar-economie"], "Missions, qualités attendues, qui décide"],
      ["3. L'expertise à distance", "distance", ["sar-distance"], "Les étapes, l'intérêt, les limites"],
      ["4. Entreprise à mission / bas carbone", "mission", ["sar-mission", "sar-carbone"], "Statut, objectifs, carbone des réparations"],
      ["5. Questions RH", "rh", [], `${done}/20 questions travaillées${done ? ` · couverture moyenne ${avg} %` : ""}`]
    ];
    return `<h2>CE QUE JE DOIS SAVOIR POUR SARETEC</h2>
      <p class="small muted">Préparation de l'entretien RH — séparée du test technique.</p>
      <div class="grid grid-3 sar-dash">${cats.map(([t, tab, ns, d]) => `<a class="card card-link" href="#/saretec/${tab}"><h3>${t}</h3><p class="small muted" style="margin:0 0 6px">${esc(d)}</p><div class="row">${ns.map((id) => st(id)).join("")}</div></a>`).join("")}
        <a class="card card-link urgent" href="#/saretec/express"><h3>⚡ Saretec express</h3><p class="small muted" style="margin:0">Les 20 éléments à savoir le jour J.</p></a></div>`;
  }

  function renderSaretec(el, sub) {
    const tab = SAR_TABS.some((t) => t[0] === sub) ? sub : "60s";
    const S = SARETEC;
    const nQ = QUESTIONS.filter((q) => q.d === "saretec").length;
    el.append(h(`
      <h1>Saretec — entretien RH & connaissance de l'entreprise</h1>
      <p class="lead">Objectif : répondre à « Qu'avez-vous retenu de Saretec ? » pendant 1 à 2 minutes, naturellement, sans réciter.</p>
      <div class="callout small">Module RH <b>séparé</b> du test technique : ses ${nQ} QCM ne sont jamais mélangés aux examens et révisions techniques. <span class="src src-s">Source</span> = page officielle (${esc(S.consult)}) · <span class="src src-i">Interprétation</span> = mise en perspective pour l'entretien.</div>
      <div class="tabs">${SAR_TABS.map(([k, l]) => `<a class="tab ${k === tab ? "on" : ""}" href="#/saretec/${k}">${l}</a>`).join("")}</div>
      <div id="sb"></div>`));
    const sb = $("#sb", el);
    const qBtn = (ns, label) => `<button class="btn primary sm" data-sq="${ns.join(",")}">${label}</button>`;
    const binders = [];

    if (tab === "60s") {
      const pb = practiceBox("sar_pitch", "Entraînez-vous : « Que savez-vous de Saretec ? » (visez 60 à 90 s)", S.pitch60, `<p class="small muted" style="margin-top:6px">Personnalisez : remplacez les formules par ce qui VOUS a marquée. Ne gardez qu'un ou deux chiffres.</p>`);
      binders.push(pb);
      sb.append(h(`<div class="grid grid-2">${S.sec60.map(([t, d], i) => `<div class="card s60"><span class="s60-n">${i + 1}</span><div><b>${esc(t)}</b><p class="small" style="margin:4px 0 0">${esc(d)}</p></div></div>`).join("")}</div>
        <h2>À dire en 60 secondes</h2>${pb.html}
        <h2>Ce que Saretec met en avant pour ses collaborateurs</h2><div class="card"><ul>${S.rejoindre.map((x) => `<li>${srcTags(x)}</li>`).join("")}</ul></div>
        <div class="row" style="margin-top:12px">${qBtn(["sar-entreprise"], "QCM « L'entreprise »")}</div>`));
    }
    if (tab === "mission") {
      const pb = practiceBox("sar_mission", S.mission.question + " (20-30 s)", S.mission.modele);
      binders.push(pb);
      sb.append(h(`
        <div class="grid grid-2">
          <div class="card"><h3>Juridiquement (loi PACTE)</h3><ol>${S.mission.juridique.map((x) => `<li>${esc(x)}</li>`).join("")}</ol></div>
          <div class="card"><h3>Chez Saretec</h3><ul>${S.mission.saretec.map((x) => `<li>${srcTags(x)}</li>`).join("")}</ul></div>
        </div>
        <h2>Ce que le recruteur a cité → où le retrouver</h2>
        <div class="table-wrap"><table><tbody>${S.mission.recruteur.map(([a, b]) => `<tr><th style="width:34%">${esc(a)}</th><td>${esc(b)}</td></tr>`).join("")}</tbody></table></div>
        <p class="small muted">Correspondance établie entre les mots du recruteur et les objectifs statutaires officiels <span class="src src-i">Interprétation</span></p>
        <div class="callout">${srcTags(S.mission.coherence)}</div>
        ${murBox(["Mission = statuts + comité + contrôle externe", "« Un monde plus sûr, pour tous »"])}
        <h2>Question d'entretien</h2>${pb.html}
        <div class="card" style="margin-top:12px"><b>À éviter</b><ul>${S.mission.eviter.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
        <div class="row" style="margin-top:12px">${qBtn(["sar-mission"], "QCM « Entreprise à mission »")}</div>`));
    }
    if (tab === "carbone") {
      const C = S.carbone;
      const pbs = C.entretien.map((x, i) => practiceBox("sar_carb_" + i, x.q, x.m));
      binders.push(...pbs);
      sb.append(h(`
        <div class="chain">${C.chaine.map((x) => `<span>${esc(x)}</span>`).join("")}</div>
        <div class="callout"><b>Pourquoi un cabinet d'expertise agit sur le carbone sans faire les travaux ?</b><br>Parce que l'expert est au centre (assureur, assuré, artisans) : ce qu'il constate, préconise et <b>chiffre</b> oriente la réparation qui sera réalisée.</div>
        <h2>Ce que disent les sources (avec leur date)</h2>
        <div class="card"><ul>${C.sources.map((x) => `<li>${srcTags(x)}</li>`).join("")}</ul>
          <p class="small warn-line">⚠ La page « Objectif Bas Carbone » n'est pas datée : citez l'idée (réduire le carbone des réparations, sans surcoût) plutôt que les chiffres.</p></div>
        <h2>Les leviers</h2>
        <div class="table-wrap"><table><tbody>${C.leviers.map(([a, b]) => `<tr><th style="width:30%">${esc(a)}</th><td>${esc(b)}</td></tr>`).join("")}</tbody></table></div>
        <div class="row" style="margin:14px 0">${qBtn(["sar-carbone"], "QCM bas carbone")}</div>
        <h2>3 questions d'entretien</h2>${pbs.map((p) => p.html).join("")}
        <h2>Mini-cas pratique</h2><div id="sarCase"></div>`));
      drawExpertCase($("#sarCase", sb), C.cas, false);
    }
    if (tab === "distance") {
      const D = S.distance;
      sb.append(h(`
        <p class="small muted">Schéma de travail type, reconstitué à partir des pages officielles (missions du télé-expert, modalités d'expertise) <span class="src src-i">Interprétation</span> — ce n'est pas un process interne publié.</p>
        <div class="flow">${D.etapes.map(([t, r, moi], i) => `<div class="flow-step"><div class="flow-n">${i + 1}</div><div><b>${esc(t)}</b><div class="small">${esc(r)}</div><div class="small muted">Moi : ${esc(moi)}</div></div></div>`).join('<div class="flow-arrow">↓</div>')}</div>
        <div class="grid grid-2" style="margin-top:16px">
          <div class="card"><h3 class="ok-txt">Pourquoi c'est pertinent</h3><ul>${D.pour.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
          <div class="card"><h3 class="ko-txt">Ses limites → expertise sur site</h3><ul>${D.limites.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
        </div>
        ${murBox(["Distance = rapide, mais savoir dire « il faut aller voir »", "Origine d'abord, puis dommages ; vue large → détail → repère"])}
        <div class="row">${qBtn(["sar-distance"], "Questions sur les limites de la distance")}${qBtn(["tele-expertise"], "Questions techniques télé-expertise")}</div>`));
    }
    if (tab === "metier") {
      sb.append(h(`
        <div class="card"><b>Fiche métier officielle — missions</b> <span class="src src-s">Source</span><ul>
          <li>Empathie et pédagogie pour accompagner les sinistrés <b>dans le cadre des garanties contractualisées</b></li>
          <li>S'appuyer sur la visio pour évaluer les dommages</li><li>Analyser et déterminer les causes</li><li>Valider les garanties et chiffrer dommages et réparations</li></ul></div>
        <h2>Les qualités attendues — concrètement</h2>
        ${S.qualites.map((x, i) => `<details class="qual"><summary>${esc(x.q)}</summary><div>
          <p><b>Dans le métier :</b> ${esc(x.sens)}</p>
          <p><b>Question possible :</b> « ${esc(x.question)} »</p>
          <textarea data-k="qual_${i}" placeholder="Votre réponse…">${esc(store.get("qual_" + i, ""))}</textarea>
          <details class="inner"><summary>Voir une bonne réponse</summary><p class="callout ok" style="margin:6px 0">${esc(x.bonne)}</p></details>
          <p class="ko-txt small">✗ À éviter : ${esc(x.erreur)}</p></div></details>`).join("")}
        <div class="row" style="margin-top:12px">${qBtn(["sar-teleexpert"], "QCM « Le métier »")}</div>`));
      $$("textarea[data-k]", sb).forEach((t) => { t.oninput = () => store.set(t.dataset.k, t.value); });
    }
    if (tab === "economie") {
      sb.append(h(`
        <div class="card"><h3>Études & Quantum <span class="src src-s">Source</span></h3><ul>
          <li>Évaluer, chiffrer et répartir l'ensemble des coûts des travaux de réparation d'un sinistre</li>
          <li>Interface entre assureur, expert, avocat, bureaux d'études et équipes d'exécution</li>
          <li>Assistance expertise dommage (en lien avec l'inspecteur de compagnie et l'expert), garants financiers (constructeurs de maisons défaillants), efficacité énergétique</li>
          <li>Fiche métier « économiste » : des économies significatives <b>à qualité équivalente</b>, pas « réparer pour pas cher »</li></ul></div>
        <h2>Qui fait quoi ?</h2>
        <div class="table-wrap"><table><thead><tr><th>Verbe</th><th>Ce que c'est</th><th>Qui</th></tr></thead><tbody>${S.economie.map(([a, b, c]) => `<tr><th>${esc(a)}</th><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join("")}</tbody></table></div>
        <div class="callout warn"><b>À ne jamais dire :</b> « l'expert décide de l'indemnisation ». L'expert fournit une analyse et un chiffrage dans son rapport ; <b>l'assureur décide</b> et règle l'assuré.</div>
        <div class="callout"><b>Lien avec mon poste</b> : mon métré et mon chiffrage de télé-expert suivent la même logique que l'économiste (ouvrage → dommage → travaux → quantité → prix), à l'échelle des sinistres courants.</div>
        ${murBox(["Constater → métrer → chiffrer → expertiser → l'assureur décide"])}
        <div class="row">${qBtn(["sar-economie"], "QCM constater / métrer / chiffrer / décider")}<a class="btn sm" href="#/fiches/chaine-chiffrage">Fiche technique « logique de chiffrage »</a></div>`));
    }
    if (tab === "eco") {
      sb.append(h(`<div class="grid grid-3">${S.eco.map((c) => `<div class="card"><h3>${esc(c.t)}</h3><ul class="small">${c.items.map((x) => `<li>${srcTags(x)}</li>`).join("")}</ul>${murBox([c.mur])}</div>`).join("")}</div>
        <div class="row" style="margin-top:12px">${qBtn(["sar-ecosysteme"], "QCM Capsens · Keywiiz · OSF")}</div>`));
    }
    if (tab === "pourquoi") {
      const P2 = S.pourquoi;
      sb.append(h(`
        <p>Construisez <b>votre</b> réponse bloc par bloc (1 à 2 phrases chacun), puis assemblez-la. Visez 45 à 90 secondes.</p>
        ${P2.blocs.map(([t, consigne, ex], i) => `<div class="card pq"><b>${i + 1}. ${esc(t)}</b><div class="small muted">${esc(consigne)} — ex. : « ${esc(ex)} »</div><textarea data-k="pq_${i}" placeholder="Votre phrase…">${esc(store.get("pq_" + i, ""))}</textarea></div>`).join("")}
        <div class="row" style="margin-top:10px"><button class="btn primary" id="pqGo">Assembler et vérifier ma réponse</button></div>
        <div id="pqOut"></div>
        <h2>5 formulations possibles (à adapter, pas à réciter)</h2>
        <div class="grid grid-2">${P2.formulations.map((f) => `<div class="card small">${esc(f)}</div>`).join("")}</div>
        <div class="card" style="margin-top:12px"><b class="ko-txt">À éviter absolument</b><ul>${P2.eviter.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`));
      $$("textarea[data-k]", sb).forEach((t) => { t.oninput = () => store.set(t.dataset.k, t.value); });
      $("#pqGo", sb).onclick = () => {
        const parts = P2.blocs.map((_, i) => String(store.get("pq_" + i, "") || "").trim());
        const txt = parts.filter(Boolean).join(" ");
        const missing = P2.blocs.filter((_, i) => !parts[i]).map((b) => b[0]);
        const dang = analyseRH(txt, [], [{ t: "Avantages (télétravail, salaire) mis en avant", kw: ["teletravail", "salaire", "avantages"] }]).dangers;
        const sec = Math.round(words(txt) / 2.5);
        $("#pqOut", sb).innerHTML = `<div class="card" style="margin-top:12px"><h3>Votre réponse assemblée</h3><p>${txt ? esc(txt) : "<i>Rien à assembler.</i>"}</p>
          <p class="small muted">${speak(txt)} ${sec > 100 ? "— trop long : gardez 1 phrase par bloc." : sec && sec < 30 ? "— un peu court : développez l'élément Saretec et votre profil." : ""}</p>
          ${missing.length ? `<p class="small warn-line">Blocs manquants : ${missing.map(esc).join(", ")}</p>` : `<p class="small ok-txt">Les 6 blocs sont présents.</p>`}
          ${dang.length ? `<p class="small ko-txt">⚠ ${dang.map(esc).join(" · ")}</p>` : ""}
          <p class="small muted">Test final : cette réponse pourrait-elle être dite à une autre entreprise ? Si oui, renforcez le bloc 5 (un élément précis et vérifié sur Saretec).</p></div>`;
      };
    }
    if (tab === "rh") drawRH(sb);
    if (tab === "express") {
      const E = S.express;
      sb.append(h(`<p>20 éléments maximum. À relire le matin de l'entretien.</p>
        <div class="grid grid-3">
          <div class="card lvl lvl-r"><b>🟥 À SAVOIR PAR CŒUR</b><ol>${E.rouge.map((x) => `<li>${esc(x)}</li>`).join("")}</ol></div>
          <div class="card lvl lvl-y"><b>🟨 À SAVOIR EXPLIQUER</b><ol>${E.jaune.map((x) => `<li>${esc(x)}</li>`).join("")}</ol></div>
          <div class="card lvl lvl-g"><b>🟩 À AVOIR COMPRIS</b><ol>${E.vert.map((x) => `<li>${esc(x)}</li>`).join("")}</ol></div>
        </div>
        ${murBox(["Saretec expertise, l'assureur décide", "Mission = statuts + comité + contrôle externe", "Bas carbone = réparations, sans surcoût", "Distance = rapide, mais savoir dire « il faut aller voir »"])}
        <div class="row">${qBtn(SAR_NOTIONS(), "QCM Saretec (15 questions)")}</div>`));
    }
    if (tab === "sources") {
      sb.append(h(`<div class="callout warn small">Règles appliquées : priorité aux pages officielles ; chaque chiffre est daté ou signalé comme non daté ; les interprétations sont marquées. Dernière consultation : ${esc(S.consult)}. En cas de changement, la page officielle fait foi.</div>
        <div class="table-wrap"><table><thead><tr><th>Ressource</th><th>Utilisée pour</th></tr></thead><tbody>${S.sources.map(([t, u, d]) => `<tr><td><a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a></td><td class="small">${esc(d)}</td></tr>`).join("")}</tbody></table></div>
        <div class="card" style="margin-top:12px"><b>Points de vigilance</b><ul class="small">
          <li>Effectifs : la même page indique « 2 000 femmes et hommes » (texte) et « 2 500 collaborateurs » (chiffres clés) → dites « plus de 2 000 collaborateurs ».</li>
          <li>Les chiffres de la page « Objectif Bas Carbone » (−7 %/an, pilotes Gan/MAIF, nombre de désignations) ne sont pas datés.</li>
          <li>Le rapport de mission 2025-2026 n'a été parcouru qu'au niveau de l'édito : lisez le sommaire avant l'entretien pour pouvoir en citer un point.</li>
          <li>Les vidéos YouTube et le LinkedIn n'ont pas été analysés ici.</li></ul></div>`));
    }
    binders.forEach((b) => b.bind(sb));
    $$("[data-sq]", sb).forEach((b) => {
      b.onclick = () => {
        const ns = b.dataset.sq.split(",");
        const qs = shuffle(QUESTIONS.filter((q) => ns.includes(q.n)));
        startSession({ type: "saretec", title: "Saretec — " + b.textContent, questions: qs.slice(0, 15), mode: "imm" });
      };
    });
  }

  function drawRH(sb) {
    const R = SARETEC_RH;
    let i = Math.min(store.get("rhIdx", 0), R.length - 1);
    const scores = store.get("rhScores", {});
    sb.append(h(`<p>Simulation de l'entretien RH : répondez <b>avant</b> de voir l'analyse. Chronométrez-vous à voix haute si possible (30 à 90 s par réponse).</p>
      <div class="palette" id="rhPal"></div><div id="rhQ" style="margin-top:12px"></div><div id="rhFoot"></div>`));
    let t0 = null, tInt = null;
    const pal = () => {
      $("#rhPal", sb).innerHTML = R.map((_, j) => `<button data-j="${j}" class="${scores[j] !== undefined ? "answered" : ""} ${j === i ? "current" : ""}" title="${esc(R[j].q)}">${j + 1}</button>`).join("");
      $$("#rhPal button", sb).forEach((b) => { b.onclick = () => { i = +b.dataset.j; store.set("rhIdx", i); draw(); }; });
    };
    function draw() {
      pal(); clearInterval(tInt); tInt = null;
      const r = R[i], key = "rh_" + i;
      $("#rhQ", sb).innerHTML = `<div class="card">
        <div class="small muted">Question ${i + 1} / ${R.length}</div>
        <div class="question">${esc(r.q)}</div>
        <textarea id="rhA" style="min-height:140px" placeholder="Votre réponse, avec vos mots…">${esc(store.get(key, ""))}</textarea>
        <div class="row" style="margin-top:8px"><button class="btn sm" id="rhT">⏱ Chrono oral</button><span class="small muted" id="rhL"></span><span class="spacer"></span>
          <button class="btn sm ghost" id="rhP" ${i === 0 ? "disabled" : ""}>← Préc.</button><button class="btn primary" id="rhGo">Analyser ma réponse</button><button class="btn sm ghost" id="rhN" ${i === R.length - 1 ? "disabled" : ""}>Suiv. →</button></div>
        <div id="rhOut"></div></div>`;
      const ta = $("#rhA", sb), L = $("#rhL", sb);
      const upd = () => { L.textContent = ta.value.trim() ? speak(ta.value) : ""; };
      ta.oninput = () => { store.set(key, ta.value); upd(); }; upd();
      $("#rhT", sb).onclick = (e) => {
        if (tInt) { clearInterval(tInt); tInt = null; e.target.textContent = `⏱ ${Math.round((Date.now() - t0) / 1000)} s — relancer`; return; }
        t0 = Date.now(); tInt = setInterval(() => { e.target.textContent = `⏹ ${Math.round((Date.now() - t0) / 1000)} s`; }, 500);
      };
      $("#rhP", sb).onclick = () => { i--; store.set("rhIdx", i); draw(); };
      $("#rhN", sb).onclick = () => { i++; store.set("rhIdx", i); draw(); };
      $("#rhGo", sb).onclick = () => {
        if (words(ta.value) < 12) { alert("Répondez d'abord (quelques phrases) : l'analyse porte sur VOTRE réponse."); return; }
        const res = analyseRH(ta.value, r.a, r.d);
        const scored = res.items.filter((x) => x.hit !== null);
        const pct = scored.length ? Math.round((scored.filter((x) => x.hit).length / scored.length) * 100) : 0;
        scores[i] = pct; store.set("rhScores", scores); pal();
        const sec = Math.round(words(ta.value) / 2.5);
        $("#rhOut", sb).innerHTML = `<h3 style="margin-top:16px">Analyse — couverture ${pct} %</h3>
          <div class="grid grid-2">
            <div class="card"><b class="ok-txt">✔ Présent</b><ul>${res.items.filter((x) => x.hit).map((x) => `<li>${esc(x.t)}</li>`).join("") || "<li class='muted'>—</li>"}</ul>
              <b style="color:var(--warn)">◐ Manquant ou non formulé</b><ul>${res.items.filter((x) => x.hit === false).map((x) => `<li>${esc(x.t)}</li>`).join("") || "<li class='muted'>—</li>"}</ul>
              ${res.items.some((x) => x.hit === null) ? `<p class="small muted">À vérifier vous-même : ${res.items.filter((x) => x.hit === null).map((x) => esc(x.t)).join(" ; ")}</p>` : ""}</div>
            <div class="card"><b class="ko-txt">⚠ Formulations dangereuses</b><ul>${res.dangers.map((d) => `<li class="ko-txt">${esc(d)}</li>`).join("") || "<li class='ok-txt'>Aucune détectée</li>"}</ul>
              <p class="small muted">Durée estimée : ${sec} s ${sec > 100 ? "— trop long, resserrez." : sec < 20 ? "— un peu court, ajoutez un exemple concret." : "— bonne longueur."}</p></div>
          </div>
          <div class="callout ok"><b>Version améliorée, naturelle</b> (à reformuler avec vos mots)<p style="margin:6px 0 0">${esc(r.m)}</p></div>
          <p class="small muted">L'analyse repère des mots-clés : si vous avez exprimé une idée autrement, considérez-la comme présente.</p>`;
      };
      const tot = Object.keys(scores).length;
      $("#rhFoot", sb).innerHTML = tot ? `<p class="small muted" style="margin-top:10px">${tot}/20 questions travaillées. <button class="btn sm ghost" id="rhReset">Réinitialiser la simulation</button></p>` : "";
      const rr = $("#rhReset", sb);
      if (rr) rr.onclick = () => { if (confirm("Effacer vos réponses et scores RH ?")) { R.forEach((_, j) => store.set("rh_" + j, "")); store.set("rhScores", {}); store.set("rhIdx", 0); router(); } };
    }
    draw();
  }

  router();
})();
