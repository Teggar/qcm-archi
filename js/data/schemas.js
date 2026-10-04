// Schémas SVG : coupes de parois (générateur) + schémas dessinés.
// Chaque schéma renvoie du HTML : <figure> avec SVG numéroté + légende.
(function () {
  let uid = 0;
  const FILL = {
    maconnerie: ["#c98b6b", "hatch"], bloc: ["#b9b4ab", "hatch"], pierre: ["#bfa77f", "stone"],
    beton: ["#b7b7b7", "dots"], isolant: ["#f2d36b", "wave"], pse: ["#e3ebf5", "grid"],
    biosource: ["#d8b26e", "wave"], platre: ["#f3efe6", ""], enduit: ["#e3cfa8", ""], chaux: ["#efe3c4", ""],
    ciment: ["#9e9e9e", "dots"], air: ["none", "air"], airv: ["none", "airv"], membrane: ["#2f7fd0", ""],
    frein: ["#3fa7a0", ""], ecran: ["#4c9a63", ""], metal: ["#7d8794", ""], bois: ["#b98a55", "wood"],
    tuile: ["#b5532f", ""], carrelage: ["#8fb9cf", "tiles"], chape: ["#cfc9bd", "dots"], colle: ["#ddd5c4", "plots"],
    peinture: ["#5d9bd6", ""], parquet: ["#c8955a", "wood"], bardage: ["#a7774a", "wood"], laine: ["#f2d36b", "wave"]
  };

  function defs(id) {
    return `<defs>
      <pattern id="${id}hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="#00000033" stroke-width="2"/></pattern>
      <pattern id="${id}dots" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#00000040"/><circle cx="5.5" cy="5" r=".7" fill="#00000030"/></pattern>
      <pattern id="${id}wave" width="14" height="10" patternUnits="userSpaceOnUse"><path d="M0 5 Q3.5 0 7 5 T14 5" fill="none" stroke="#00000035" stroke-width="1"/></pattern>
      <pattern id="${id}grid" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="2.5" fill="none" stroke="#00000025"/></pattern>
      <pattern id="${id}stone" width="22" height="16" patternUnits="userSpaceOnUse"><path d="M0 8h22M11 0v8M4 8v8" stroke="#00000035" fill="none"/></pattern>
      <pattern id="${id}wood" width="6" height="30" patternUnits="userSpaceOnUse"><path d="M3 0 Q5 15 3 30" stroke="#00000030" fill="none"/></pattern>
      <pattern id="${id}tiles" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M0 0h20v20" stroke="#ffffff90" fill="none"/></pattern>
      <pattern id="${id}plots" width="20" height="40" patternUnits="userSpaceOnUse"><rect x="2" y="6" width="16" height="14" rx="5" fill="#bdb3a0"/></pattern>
      <marker id="${id}arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2f7fd0"/></marker>
      <marker id="${id}arrR" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#d0452f"/></marker>
    </defs>`;
  }
  const num = (x, y, n) => `<g class="sn"><circle cx="${x}" cy="${y}" r="10" fill="var(--primary)"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--primary-ink)">${n}</text></g>`;
  const lead = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--muted)" stroke-width="1"/>`;
  const txt = (x, y, s, a = "middle", sz = 12) => `<text x="${x}" y="${y}" text-anchor="${a}" font-size="${sz}" fill="var(--muted)">${s}</text>`;
  const legend = (items) => `<ol class="legend">${items.map((it) => `<li${it.bad ? ' class="bad"' : ""}><b>${it.l}</b>${it.r ? " — " + it.r : ""}</li>`).join("")}</ol>`;
  const fig = (title, svg, items, note) => `<figure class="schema">${title ? `<figcaption>${title}</figcaption>` : ""}${svg}${items ? legend(items) : ""}${note ? `<p class="schema-note">${note}</p>` : ""}</figure>`;

  function layerRect(id, x, y, w, h, f, bad) {
    const [c, p] = FILL[f] || ["#ccc", ""];
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c === "none" ? "transparent" : c}" stroke="var(--text)" stroke-opacity=".35"/>`;
    if (p === "air" || p === "airv") {
      s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="var(--muted)" stroke-dasharray="3 3"/>`;
      if (p === "airv") for (let k = 0; k < 3; k++) s += `<line x1="${x + w / 2}" y1="${y + h - 20 - k * 50}" x2="${x + w / 2}" y2="${y + h - 50 - k * 50}" stroke="#2f7fd0" stroke-width="1.6" marker-end="url(#${id}arr)"/>`;
    } else if (p) s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id}${p})"/>`;
    if (bad) s += `<rect x="${x + 1}" y="${y + 1}" width="${Math.max(w - 2, 1)}" height="${h - 2}" fill="none" stroke="#d0452f" stroke-width="2.5" stroke-dasharray="6 3"/>`;
    return s;
  }

  // Générateur de coupe. dir "h" : couches de gauche (a) à droite (b). dir "v" : de haut (a) en bas (b).
  function coupe(o) {
    const id = "s" + (++uid) + "_";
    const L = o.layers;
    let body = "", W, H;
    if (o.dir !== "v") {
      const x0 = 56, y0 = 52, h = 170;
      let x = x0;
      L.forEach((ly, i) => {
        body += layerRect(id, x, y0, ly.w, h, ly.f, ly.bad);
        const cx = x + ly.w / 2, ny = i % 2 ? 34 : 14;
        body += lead(cx, ny + 10, cx, y0) + num(cx, ny, i + 1);
        x += ly.w;
      });
      W = x + 56; H = y0 + h + 22;
      body += txt(28, y0 + h / 2, o.a || "Ext.") + txt(W - 28, y0 + h / 2, o.b || "Int.");
      body += `<line x1="${x0}" y1="${y0 + h + 12}" x2="${x}" y2="${y0 + h + 12}" stroke="var(--muted)" marker-start="url(#${id}arr)" marker-end="url(#${id}arr)" opacity=".5"/>`;
    } else {
      const x0 = 70, w = o.width || 300;
      let y = 26;
      L.forEach((ly, i) => {
        body += layerRect(id, x0, y, w, ly.w, ly.f, ly.bad);
        const cy = y + ly.w / 2, nx = i % 2 ? 22 : 46;
        body += lead(nx + 10, cy, x0, cy) + num(nx, cy, i + 1);
        y += ly.w;
      });
      W = x0 + w + 20; H = y + 22;
      body += txt(x0 + w / 2, 18, o.a || "Dessus") + txt(x0 + w / 2, y + 16, o.b || "Dessous");
    }
    const svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.title || "Coupe"}" style="max-width:${Math.min(W * 1.25, 640)}px">${defs(id)}${body}</svg>`;
    return fig(o.title, svg, L.map((ly) => ({ l: ly.l, r: ly.r, bad: ly.bad })), o.note);
  }

  // ---------- Toiture : charpente traditionnelle + couverture ----------
  function toiture() {
    const id = "s" + (++uid) + "_";
    const th = Math.atan2(-220, 270), c = Math.cos(th), s = Math.sin(th), deg = th * 180 / Math.PI;
    const X0 = 38, Y0 = 300;
    const G = (x, y) => [X0 + x * c - y * s, Y0 + x * s + y * c];
    const d = [G(0, -1)[0] - G(0, 0)[0], G(0, -1)[1] - G(0, 0)[1]]; // normale vers l'extérieur du versant
    let pitch = `<rect x="-12" y="-14" width="362" height="18" fill="#b98a55" stroke="#00000055"/><rect x="-12" y="-14" width="362" height="18" fill="url(#${id}wood)"/>`;
    pitch += `<rect x="0" y="28" width="350" height="11" fill="#c9a37a" stroke="#00000040"/>`; // arbalétrier
    [20, 175, 335].forEach((p) => { pitch += `<rect x="${p - 12}" y="4" width="24" height="24" fill="#9c6f3f" stroke="#00000066"/>`; });
    pitch += `<line x1="-6" y1="-15.5" x2="350" y2="-15.5" stroke="#4c9a63" stroke-width="2.5"/>`;
    pitch += `<rect x="-4" y="-22" width="354" height="6" fill="#d7b98f" stroke="#00000040"/>`;
    const lit = []; for (let x = 4; x <= 330; x += 28) lit.push(x);
    lit.forEach((x) => { pitch += `<rect x="${x}" y="-30" width="7" height="8" fill="#a8763f" stroke="#00000055"/>`; });
    lit.forEach((x) => { pitch += `<rect x="${x - 3}" y="-38" width="35" height="7" rx="1.5" fill="#b5532f" stroke="#00000066"/>`; });
    const one = `<g transform="translate(${X0} ${Y0}) rotate(${deg})">${pitch}</g>`;
    let body = defs(id);
    body += `<rect x="30" y="306" width="46" height="60" fill="#c98b6b" stroke="#00000055"/><rect x="30" y="306" width="46" height="60" fill="url(#${id}hatch)"/>`;
    body += `<rect x="524" y="306" width="46" height="60" fill="#c98b6b" stroke="#00000055"/><rect x="524" y="306" width="46" height="60" fill="url(#${id}hatch)"/>`;
    body += `<rect x="52" y="304" width="496" height="10" fill="#c9a37a" stroke="#00000040"/>`; // entrait
    const top = G(345, 34);
    body += `<rect x="294" y="${top[1]}" width="12" height="${304 - top[1]}" fill="#c9a37a" stroke="#00000040"/>`; // poinçon
    body += one + `<g transform="translate(600 0) scale(-1 1)">${one}</g>`;
    const apex = G(350, -38);
    body += `<path d="M${300 - 16} ${apex[1] + 6} Q300 ${apex[1] - 16} ${300 + 16} ${apex[1] + 6}" fill="#b5532f" stroke="#00000066"/>`;
    const eg = G(-10, -24);
    body += `<path d="M${eg[0] - 9} ${eg[1]} a9 9 0 0 0 18 0" fill="#9aa3ad" stroke="#00000066"/>`;
    const L = (n, lx, ly, dist) => { const f = G(lx, ly); const p = [f[0] + d[0] * dist, f[1] + d[1] * dist]; return lead(f[0], f[1], p[0], p[1]) + num(p[0], p[1], n); };
    const I = (n, lx, ly, dist) => { const f = G(lx, ly); const p = [f[0] - d[0] * dist, f[1] - d[1] * dist]; return lead(f[0], f[1], p[0], p[1]) + num(p[0], p[1], n); };
    body += L(1, 64, -35, 36) + L(2, 124, -26, 52) + L(3, 182, -19, 58) + L(4, 240, -15.5, 62) + L(5, 296, -5, 72);
    body += I(6, 335, 16, 36) + I(7, 175, 16, 42) + I(8, 20, 16, 38) + I(9, 255, 34, 34);
    body += lead(300, 240, 330, 240) + num(338, 240, 10) + lead(430, 309, 430, 286) + num(430, 278, 11);
    body += lead(300, apex[1] - 8, 300, 16) + num(300, 14, 12);
    body += lead(eg[0], eg[1] - 2, eg[0], eg[1] - 32) + num(eg[0], eg[1] - 40, 13);
    body += lead(76, 345, 104, 345) + num(114, 345, 14);
    body += txt(520, 26, "Rive = bord latéral", "middle", 11) + txt(520, 40, "(sur le pignon, hors coupe)", "middle", 11);
    const svg = `<svg viewBox="0 0 600 372" role="img" aria-label="Coupe de toiture">${body}</svg>`;
    return fig("Toiture à charpente traditionnelle — coupe transversale", svg, [
      { l: "Tuiles (couverture)", r: "assurent l'étanchéité à l'eau ; se recouvrent (pureau = partie visible)" },
      { l: "Liteaux", r: "tasseaux HORIZONTAUX sur lesquels s'accrochent les tuiles" },
      { l: "Contre-liteaux", r: "tasseaux posés DANS LE SENS DE LA PENTE, sur l'écran, au droit des chevrons : créent la lame de ventilation sous les tuiles" },
      { l: "Écran sous-toiture (HPV)", r: "membrane de secours contre l'eau poussée par le vent / la neige, sous la couverture" },
      { l: "Chevrons", r: "pièces INCLINÉES, dans le sens de la pente, posées sur les pannes" },
      { l: "Panne faîtière", r: "panne au sommet, sous le faîtage" },
      { l: "Panne intermédiaire (ventrière)", r: "soutient les chevrons à mi-portée" },
      { l: "Panne sablière", r: "en pied de versant, posée sur le mur" },
      { l: "Arbalétrier (ferme)", r: "pièce inclinée de la ferme qui porte les pannes" },
      { l: "Poinçon (ferme)", r: "pièce verticale centrale de la ferme" },
      { l: "Entrait (ferme)", r: "pièce horizontale basse qui tient l'écartement des arbalétriers" },
      { l: "Faîtage", r: "ligne haute de rencontre des versants, couverte de tuiles faîtières" },
      { l: "Égout + gouttière", r: "bas de pente où l'eau quitte la toiture" },
      { l: "Mur porteur", r: "reçoit la panne sablière et l'entrait" }
    ], "Ordre de l'extérieur vers l'intérieur : tuiles → liteaux → contre-liteaux → écran → chevrons → pannes → fermes. Pannes = horizontales, parallèles au faîtage. Chevrons = dans la pente.");
  }

  // ---------- Menuiserie : coupe verticale + plan ----------
  function menuiserie() {
    const id = "s" + (++uid) + "_";
    let b = defs(id);
    const R = (x, y, w, h, f) => layerRect(id, x, y, w, h, f);
    b += R(150, 10, 140, 60, "maconnerie") + R(150, 70, 140, 40, "beton");
    b += R(290, 10, 24, 100, "isolant") + R(314, 10, 8, 100, "platre") + R(290, 330, 24, 100, "isolant") + R(314, 330, 8, 100, "platre");
    b += R(150, 352, 140, 78, "maconnerie");
    b += `<polygon points="150,352 116,352 116,340 226,327 226,316 236,316 236,326 290,326 290,352" fill="#b7b7b7" stroke="#00000066"/>`;
    b += `<rect x="126" y="352" width="5" height="5" fill="var(--bg)"/>`;
    b += `<rect x="240" y="110" width="50" height="22" fill="#e9ecef" stroke="#00000077"/>`;
    b += `<rect x="236" y="300" width="54" height="26" fill="#e9ecef" stroke="#00000077"/>`;
    b += `<rect x="246" y="132" width="38" height="20" fill="#f7f7f7" stroke="#00000077"/><rect x="246" y="280" width="38" height="20" fill="#f7f7f7" stroke="#00000077"/>`;
    b += `<polygon points="246,293 232,299 232,302 246,299" fill="#f7f7f7" stroke="#00000077"/>`;
    b += `<rect x="258" y="152" width="12" height="128" fill="#cfe6f5" stroke="#4a7fa8"/><line x1="264" y1="152" x2="264" y2="280" stroke="#4a7fa8" stroke-dasharray="2 3"/>`;
    b += `<rect x="270" y="152" width="8" height="10" fill="#d0d4d8" stroke="#00000077"/><rect x="270" y="270" width="8" height="10" fill="#d0d4d8" stroke="#00000077"/>`;
    b += `<rect x="240" y="106" width="50" height="4" fill="#333"/><rect x="236" y="326" width="54" height="3" fill="#333"/>`;
    b += `<circle cx="239" cy="312" r="2.5" fill="#2f7fd0"/>`;
    b += txt(90, 230, "EXT.") + txt(390, 230, "INT.");
    b += lead(118, 90, 150, 90) + num(108, 90, 1);
    b += lead(290, 121, 340, 121) + num(350, 121, 2);
    b += lead(284, 142, 340, 148) + num(350, 150, 3);
    b += lead(270, 215, 340, 215) + num(350, 215, 4);
    b += lead(278, 275, 340, 262) + num(350, 262, 5);
    b += lead(290, 313, 340, 300) + num(350, 300, 6);
    b += lead(231, 316, 200, 286) + num(192, 282, 7);
    b += lead(233, 301, 200, 262) + num(192, 258, 8);
    b += lead(122, 346, 92, 326) + num(84, 322, 9);
    b += lead(200, 392, 130, 400) + num(120, 400, 10);
    b += lead(252, 108, 210, 140) + num(204, 146, 11);
    b += lead(239, 312, 200, 305) + num(192, 306, 12);
    b += lead(302, 60, 340, 60) + num(350, 60, 13);
    // Plan
    b += txt(515, 196, "Vue en plan", "middle", 12);
    b += R(410, 240, 60, 60, "maconnerie") + R(560, 240, 60, 60, "maconnerie") + R(410, 300, 60, 12, "isolant") + R(560, 300, 60, 12, "isolant");
    b += `<rect x="470" y="262" width="90" height="14" fill="#e9ecef" stroke="#00000077"/>`;
    b += `<line x1="470" y1="240" x2="470" y2="262" stroke="#e08a1e" stroke-width="4"/><line x1="560" y1="240" x2="560" y2="262" stroke="#e08a1e" stroke-width="4"/>`;
    b += `<line x1="470" y1="276" x2="470" y2="312" stroke="#3fa76b" stroke-width="4"/><line x1="560" y1="276" x2="560" y2="312" stroke="#3fa76b" stroke-width="4"/>`;
    b += txt(515, 232, "ext.", "middle", 11) + txt(515, 330, "int.", "middle", 11);
    b += lead(470, 250, 446, 226) + num(438, 220, 14);
    b += lead(470, 296, 446, 326) + num(438, 332, 15);
    const svg = `<svg viewBox="0 0 640 440" role="img" aria-label="Coupe de menuiserie">${b}</svg>`;
    return fig("Fenêtre dans un mur maçonné — coupe verticale et vue en plan", svg, [
      { l: "Linteau", r: "porte la maçonnerie au-dessus de la baie" },
      { l: "Dormant", r: "cadre FIXE, fixé à la maçonnerie" },
      { l: "Ouvrant", r: "cadre MOBILE qui porte le vitrage" },
      { l: "Vitrage (double vitrage)", r: "2 verres + intercalaire scellé ; buée ENTRE les verres = scellement défaillant" },
      { l: "Parclose", r: "baguette qui maintient le vitrage dans la feuillure" },
      { l: "Pièce d'appui du dormant", r: "traverse basse du dormant" },
      { l: "Rejingot", r: "relevé de l'appui maçonné devant le dormant : stoppe l'eau qui ruisselle" },
      { l: "Jet d'eau", r: "profil en bas de l'ouvrant qui rejette l'eau vers l'extérieur" },
      { l: "Appui maçonné + larmier", r: "pente vers l'extérieur ; le larmier (rainure en sous-face) fait goutter l'eau loin de la façade" },
      { l: "Allège", r: "partie de mur sous la fenêtre" },
      { l: "Calfeutrement", r: "joint entre dormant et maçonnerie (mastic, mousse imprégnée) : point faible d'infiltration" },
      { l: "Trous de drainage (busettes)", r: "évacuent l'eau de la feuillure ; bouchés = eau à l'intérieur" },
      { l: "Doublage intérieur", r: "isolant + plaque ; retour d'isolant en tableau pour limiter le pont thermique" },
      { l: "Tableau", r: "face latérale de la baie côté EXTÉRIEUR du dormant (en orange)" },
      { l: "Embrasure / ébrasement", r: "face latérale côté INTÉRIEUR (en vert)" }
    ]);
  }

  // ---------- Symptômes d'humidité ----------
  function humidite() {
    const id = "s" + (++uid) + "_";
    let b = defs(id);
    b += `<rect x="20" y="20" width="560" height="280" fill="#ece6da" stroke="var(--muted)"/>`;
    b += `<line x1="20" y1="300" x2="580" y2="300" stroke="var(--text)" stroke-width="2"/>`;
    b += `<rect x="390" y="90" width="100" height="110" fill="#cfe6f5" stroke="#4a7fa8"/><rect x="384" y="200" width="112" height="8" fill="#b7b7b7"/>`;
    b += `<path d="M232 285 Q240 262 252 270 T272 262 T295 270 T318 258 T342 268 T366 262 L366 300 L232 300 Z" fill="#a4835a" opacity=".55"/>`;
    for (let i = 0; i < 18; i++) b += `<circle cx="${238 + (i * 37) % 126}" cy="${276 + (i * 13) % 20}" r="1.6" fill="#fff"/>`;
    for (let i = 0; i < 40; i++) b += `<circle cx="${578 - (i * 7) % 44}" cy="${22 + (i * 11) % 58}" r="${1 + (i % 3) * .6}" fill="#2b2b2b" opacity=".7"/>`;
    for (let i = 0; i < 16; i++) b += `<circle cx="${22 + (i * 9) % 40}" cy="${22 + (i * 5) % 18}" r="1.3" fill="#2b2b2b" opacity=".6"/>`;
    b += `<path d="M398 208 q-6 24 2 52 q3 12 -3 26" stroke="#a4835a" stroke-width="10" fill="none" opacity=".5" stroke-linecap="round"/>`;
    b += `<ellipse cx="200" cy="30" rx="60" ry="9" fill="#d9c08a" opacity=".55" stroke="#8a6a3a" stroke-width="2"/>`;
    b += `<rect x="70" y="210" width="110" height="90" fill="#e9ecef" stroke="#00000066"/><rect x="62" y="202" width="126" height="8" fill="#b7b7b7"/>`;
    b += `<path d="M125 210 v40 q0 12 10 12 h30" stroke="#888" stroke-width="5" fill="none"/>`;
    b += `<ellipse cx="128" cy="298" rx="42" ry="4" fill="#3d8bd9" opacity=".5"/>`;
    for (let i = 0; i < 6; i++) b += `<circle cx="${292 + (i % 3) * 16}" cy="${120 + Math.floor(i / 3) * 18}" r="6" fill="none" stroke="var(--muted)" stroke-width="1.5"/>`;
    b += lead(300, 285, 300, 250) + num(300, 242, 1);
    b += lead(565, 50, 530, 70) + num(522, 76, 2);
    b += lead(398, 245, 440, 245) + num(450, 245, 3);
    b += lead(200, 39, 200, 70) + num(200, 80, 4);
    b += lead(128, 296, 128, 270) + num(150, 262, 5);
    b += lead(308, 130, 330, 150) + num(338, 156, 6);
    b += lead(40, 34, 60, 60) + num(66, 66, 7);
    const svg = `<svg viewBox="0 0 600 320" role="img" aria-label="Carte des symptômes d'humidité">${b}</svg>`;
    return fig("Lire les symptômes sur un mur (vue intérieure)", svg, [
      { l: "Frange horizontale en pied de mur + sels blancs", r: "hypothèse : remontées capillaires → vérifier : constance hors pluie, bâti ancien, enduit ciment, humidité décroissante avec la hauteur" },
      { l: "Points noirs dans l'angle haut, mur extérieur", r: "hypothèse : condensation sur pont thermique → vérifier : saison froide, ventilation, chauffage, hygrométrie" },
      { l: "Coulure sous l'angle de la fenêtre", r: "hypothèse : infiltration (calfeutrement, appui, drainage) → vérifier : lien avec pluie battante, exposition" },
      { l: "Auréole au plafond avec contour marqué", r: "hypothèse : fuite / débordement à l'étage → vérifier : humidimètre, logement du dessus, cycles humide-sec" },
      { l: "Eau en pied de meuble d'évier", r: "hypothèse : fuite siphon / flexible / évacuation → vérifier : alimentation (permanent) ou évacuation (à l'usage)" },
      { l: "Peinture cloquée", r: "support humide derrière : chercher la source avant de repeindre" },
      { l: "Moisissures derrière un meuble contre mur froid", r: "air confiné + paroi froide = condensation, pas une fuite" }
    ], "Règle : un symptôme → plusieurs hypothèses → une vérification par hypothèse. Ne jamais conclure sur l'aspect seul.");
  }

  // ---------- Évier : alimentation / évacuation ----------
  function evier() {
    const id = "s" + (++uid) + "_";
    let b = defs(id);
    b += `<rect x="440" y="20" width="30" height="310" fill="#c98b6b"/><rect x="440" y="20" width="30" height="310" fill="url(#${id}hatch)"/>`;
    b += `<rect x="60" y="140" width="240" height="190" fill="#e9ecef" stroke="#00000066"/><rect x="60" y="318" width="240" height="12" fill="#d6c3a0" stroke="#00000066"/>`;
    b += `<path d="M80 110 h200 v4 h-10 v30 h-180 v-30 h-10z" fill="#cfd4da" stroke="#00000077"/>`;
    b += `<path d="M230 110 v-34 h-30" stroke="#7d8794" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    b += `<path d="M440 215 H385" stroke="#2f7fd0" stroke-width="6"/><path d="M440 240 H385" stroke="#d0452f" stroke-width="6"/>`;
    b += `<rect x="372" y="207" width="14" height="16" fill="#7d8794"/><rect x="372" y="232" width="14" height="16" fill="#7d8794"/>`;
    b += `<path d="M372 215 C330 215 250 200 238 118" stroke="#2f7fd0" stroke-width="3" fill="none" stroke-dasharray="5 2"/>`;
    b += `<path d="M372 240 C320 240 240 220 226 118" stroke="#d0452f" stroke-width="3" fill="none" stroke-dasharray="5 2"/>`;
    b += `<path d="M180 144 v86 a16 16 0 0 0 32 0 v-12" stroke="#8c8c8c" stroke-width="10" fill="none"/>`;
    b += `<path d="M212 222 L440 236" stroke="#8c8c8c" stroke-width="10"/>`;
    b += `<path d="M180 222 v14 a16 16 0 0 0 32 0 v-12" stroke="#3d8bd9" stroke-width="5" fill="none" opacity=".7"/>`;
    b += `<ellipse cx="160" cy="316" rx="50" ry="4" fill="#3d8bd9" opacity=".55"/>`;
    b += txt(410, 200, "EF", "middle", 11) + txt(410, 262, "EC", "middle", 11);
    b += lead(230, 80, 200, 50) + num(192, 44, 1);
    b += lead(300, 205, 320, 170) + num(326, 162, 2);
    b += lead(379, 207, 379, 180) + num(379, 170, 3);
    b += lead(420, 215, 420, 290) + num(420, 300, 4);
    b += lead(180, 146, 140, 130) + num(130, 124, 5);
    b += lead(196, 246, 160, 270) + num(150, 274, 6);
    b += lead(320, 229, 340, 270) + num(344, 280, 7);
    b += lead(212, 222, 250, 270) + num(254, 280, 8);
    b += lead(100, 318, 92, 290) + num(88, 282, 9);
    const svg = `<svg viewBox="0 0 500 340" role="img" aria-label="Plomberie sous évier">${b}</svg>`;
    return fig("Sous un évier : alimentation (sous pression) et évacuation (gravitaire)", svg, [
      { l: "Robinet mitigeur", r: "reçoit EF + EC" },
      { l: "Flexibles d'alimentation", r: "sous pression permanente : rupture = fuite continue" },
      { l: "Robinets d'arrêt EF / EC", r: "isolent le point d'eau : 1er réflexe en mesure conservatoire" },
      { l: "Canalisations d'alimentation (cuivre, PER, multicouche)", r: "EF bleu / EC rouge, en pression (~3 bar)" },
      { l: "Bonde", r: "sortie de la cuve de l'évier" },
      { l: "Siphon", r: "garde d'eau qui bloque les odeurs ; écrous et joints = fuite fréquente" },
      { l: "Évacuation PVC", r: "écoulement par gravité, avec pente ; fuite seulement quand on utilise l'évier" },
      { l: "Raccords du siphon", r: "à contrôler en premier (desserrage, joint usé)" },
      { l: "Fond de meuble en aggloméré", r: "dommage typique : gonflement" }
    ], "Fuite permanente (même sans usage) → côté ALIMENTATION. Fuite seulement pendant l'usage → côté ÉVACUATION.");
  }

  // ---------- Chauffe-eau & groupe de sécurité ----------
  function chauffeEau() {
    const id = "s" + (++uid) + "_";
    let b = defs(id);
    b += `<rect x="190" y="20" width="130" height="240" rx="30" fill="#eef1f4" stroke="#00000077" stroke-width="1.5"/>`;
    b += `<rect x="236" y="190" width="40" height="8" fill="#d0452f" opacity=".7"/><rect x="250" y="120" width="10" height="70" fill="#9aa3ad"/>`;
    b += `<path d="M230 260 V300" stroke="#2f7fd0" stroke-width="6"/><path d="M290 260 V330 H420" stroke="#d0452f" stroke-width="6" fill="none"/>`;
    b += `<rect x="210" y="300" width="44" height="34" rx="4" fill="#7d8794" stroke="#00000077"/>`;
    b += `<path d="M232 334 V370 H100" stroke="#2f7fd0" stroke-width="6" fill="none"/>`;
    b += `<rect x="130" y="358" width="20" height="24" fill="#5a6470"/>`;
    b += `<path d="M210 318 H160 V350" stroke="#8c8c8c" stroke-width="4" fill="none" stroke-dasharray="4 3"/>`;
    b += `<path d="M148 350 h24 l-8 14 h-8z" fill="#8c8c8c"/><path d="M160 364 V395" stroke="#8c8c8c" stroke-width="5"/>`;
    b += txt(70, 374, "EF réseau", "middle", 11) + txt(440, 324, "EC", "start", 11);
    b += lead(320, 80, 360, 80) + num(370, 80, 1);
    b += lead(254, 317, 300, 296) + num(310, 290, 2);
    b += lead(160, 340, 120, 330) + num(110, 326, 3);
    b += lead(140, 370, 140, 395) + num(140, 405, 4);
    b += lead(260, 150, 360, 150) + num(370, 150, 5);
    b += lead(380, 330, 380, 360) + num(380, 370, 6);
    const svg = `<svg viewBox="0 0 480 420" role="img" aria-label="Chauffe-eau et groupe de sécurité">${b}</svg>`;
    return fig("Chauffe-eau à accumulation et groupe de sécurité", svg, [
      { l: "Ballon (cuve)", r: "fuite de cuve (corrosion) = appareil à remplacer" },
      { l: "Groupe de sécurité", r: "sur l'arrivée d'eau FROIDE : robinet + clapet anti-retour + soupape tarée à 7 bar + vidange" },
      { l: "Évacuation du groupe (entonnoir siphonné)", r: "quelques gouttes pendant la chauffe = NORMAL (dilatation de l'eau)" },
      { l: "Réducteur de pression (si pression réseau élevée)", r: "écoulement permanent du groupe → pression trop forte ou groupe défectueux" },
      { l: "Résistance + anode", r: "l'anode protège la cuve de la corrosion" },
      { l: "Départ eau chaude", r: "vers les points de puisage" }
    ]);
  }

  // ---------- VMC simple flux ----------
  function vmc() {
    const id = "s" + (++uid) + "_";
    let b = defs(id);
    const room = (x, y, w, h, t) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="var(--surface)" stroke="var(--text)" stroke-width="2"/>` + txt(x + w / 2, y + h / 2 + 4, t, "middle", 13);
    b += room(20, 30, 240, 140, "Séjour") + room(20, 170, 240, 110, "Chambre") + room(260, 30, 70, 250, "Dgt");
    b += room(330, 30, 250, 100, "Cuisine") + room(330, 130, 150, 80, "SdB") + room(480, 130, 100, 80, "WC") + room(330, 210, 250, 70, "Chambre 2");
    const inArrow = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2f7fd0" stroke-width="3" marker-end="url(#${id}arr)"/>`;
    b += inArrow(0, 80, 30, 80) + inArrow(0, 225, 30, 225) + inArrow(600, 250, 572, 250);
    b += `<path d="M40 100 C150 110 230 150 262 160" stroke="#2f7fd0" stroke-width="1.6" fill="none" stroke-dasharray="5 4" marker-end="url(#${id}arr)"/>`;
    b += `<path d="M300 150 C310 100 330 80 360 70" stroke="#2f7fd0" stroke-width="1.6" fill="none" stroke-dasharray="5 4" marker-end="url(#${id}arr)"/>`;
    b += `<path d="M300 180 C320 180 340 170 360 168" stroke="#2f7fd0" stroke-width="1.6" fill="none" stroke-dasharray="5 4" marker-end="url(#${id}arr)"/>`;
    const out = (x, y) => `<circle cx="${x}" cy="${y}" r="9" fill="none" stroke="#d0452f" stroke-width="2.5"/><line x1="${x}" y1="${y - 9}" x2="${x}" y2="${y - 26}" stroke="#d0452f" stroke-width="2.5" marker-end="url(#${id}arrR)"/>`;
    b += out(545, 75) + out(400, 175) + out(530, 175);
    b += `<rect x="256" y="140" width="8" height="24" fill="#2f7fd0" opacity=".5"/><rect x="326" y="160" width="8" height="24" fill="#2f7fd0" opacity=".5"/>`;
    b += lead(15, 70, 15, 50) + num(15, 40, 1) + lead(545, 50, 520, 18) + num(510, 14, 2) + lead(260, 152, 236, 132) + num(228, 126, 3) + lead(400, 160, 430, 150) + num(440, 148, 4);
    const svg = `<svg viewBox="0 0 600 300" role="img" aria-label="Ventilation simple flux">${b}</svg>`;
    return fig("VMC simple flux : l'air entre par les pièces sèches et sort par les pièces humides", svg, [
      { l: "Entrées d'air", r: "dans les pièces PRINCIPALES (séjour, chambres), en menuiserie ou coffre" },
      { l: "Bouches d'extraction", r: "dans les pièces DE SERVICE (cuisine, SdB, WC), reliées au caisson motorisé" },
      { l: "Passage de transit", r: "détalonnage des portes (jour sous porte) pour que l'air circule" },
      { l: "Extraction en continu", r: "VMC arrêtée, bouches encrassées ou entrées bouchées → condensation, moisissures" }
    ], "Hygroréglable : les débits varient selon l'humidité. Double flux : insufflation + extraction avec échangeur de chaleur.");
  }

  // ---------- Fissures en façade ----------
  function fissures() {
    const id = "s" + (++uid) + "_";
    let b = defs(id);
    b += `<polygon points="30,70 300,10 570,70" fill="#b5532f" opacity=".85"/>`;
    b += `<rect x="40" y="70" width="520" height="230" fill="#e3cfa8" stroke="#00000066"/>`;
    b += `<rect x="40" y="300" width="520" height="14" fill="#9e9e9e"/>`;
    const win = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#cfe6f5" stroke="#4a7fa8"/>`;
    b += win(110, 120, 80, 80) + win(360, 120, 80, 80) + `<rect x="250" y="200" width="60" height="100" fill="#a7774a" stroke="#00000066"/>`;
    const cr = (d) => `<path d="${d}" stroke="#c2321f" stroke-width="2.5" fill="none" stroke-linejoin="round"/>`;
    b += cr("M42 292 h16 v-14 h18 v-14 h18 v-14 h18 v-14");
    b += cr("M440 120 l12 -10 l6 -8 l10 -10");
    b += cr("M450 182 l20 2 l18 -2 l22 3 l20 -2 l26 1");
    b += cr("M520 72 l-3 30 l4 30 l-3 40 l4 40 l-3 40 l3 40");
    b += cr("M110 200 l-4 22 l3 20 l-3 18");
    for (let i = 0; i < 6; i++) b += `<path d="M${160 + i * 9} ${236 + (i % 2) * 8} l8 6 l-4 9 l7 4" stroke="#8a6a3a" stroke-width="1" fill="none"/>`;
    b += num(66, 236, 1) + num(476, 92, 2) + num(492, 168, 3) + num(538, 110, 4) + num(92, 238, 5) + num(186, 270, 6);
    const svg = `<svg viewBox="0 0 600 320" role="img" aria-label="Types de fissures">${b}</svg>`;
    return fig("Lire une fissure : forme → hypothèse → vérification", svg, [
      { l: "En escalier près d'un angle", r: "tassement différentiel des fondations (sécheresse/argiles, fuite de réseau enterré) → vérifier évolution (jauges), sol, végétation, réseaux" },
      { l: "À 45° depuis l'angle d'une baie", r: "concentration de contraintes, linteau, mouvement de structure → vérifier si elle traverse et évolue" },
      { l: "Horizontale au niveau d'un plancher", r: "dilatation/retrait du plancher ou chaînage → souvent peu évolutive" },
      { l: "Verticale traversante", r: "jonction de deux ouvrages (extension, matériaux différents) ou mouvement de fondation → vérifier si elle descend jusqu'au soubassement" },
      { l: "Sous l'angle d'un appui de fenêtre", r: "retrait, appui mal désolidarisé, concentration de contraintes" },
      { l: "Faïençage (réseau fin)", r: "retrait de l'enduit en surface : esthétique, sauf infiltration" }
    ], "Classement usuel : microfissure < 0,2 mm ; fissure 0,2 à 2 mm ; lézarde > 2 mm. Une seule mesure ne dit pas si la fissure est ACTIVE.");
  }

  // ---------- Lames d'air ----------
  function lamesAir() {
    return `<div class="grid grid-2">` +
      coupe({ title: "Bardage ventilé (lame VENTILÉE)", layers: [
        { l: "Bardage", f: "bardage", w: 20, r: "peau extérieure, protège de la pluie" },
        { l: "Lame d'air ventilée", f: "airv", w: 34, r: "ouverte en bas et en haut : évacue l'eau et la vapeur ; n'isole PAS" },
        { l: "Pare-pluie", f: "ecran", w: 5, r: "protège l'isolant" },
        { l: "Isolant", f: "isolant", w: 70, r: "c'est lui qui isole" },
        { l: "Mur", f: "bloc", w: 70, r: "structure" }] }) +
      coupe({ title: "Doublage collé (lame NON ventilée)", layers: [
        { l: "Mur", f: "bloc", w: 70, r: "structure" },
        { l: "Plots de colle + lame d'air", f: "colle", w: 16, r: "lame close ; si elle communique en haut/bas avec la pièce → l'air circule et court-circuite l'isolant" },
        { l: "Isolant (PSE / PU)", f: "pse", w: 60, r: "isolant du complexe" },
        { l: "Plaque de plâtre", f: "platre", w: 12, r: "parement" }] }) + `</div>`;
  }

  window.SCHEMAS = {
    coupe, toiture, menuiserie, humidite, evier, chauffeEau, vmc, fissures, lamesAir,
    murExt: () => coupe({ title: "Mur extérieur maçonné avec doublage collé (cas courant 1970-2010)", layers: [
      { l: "Enduit extérieur", f: "enduit", w: 14, r: "imperméabilise la façade, laisse respirer" },
      { l: "Bloc béton (parpaing) ou brique", f: "bloc", w: 90, r: "porteur" },
      { l: "Plots de mortier adhésif", f: "colle", w: 12, r: "collent le complexe ; créent une lame d'air" },
      { l: "Isolant (PSE, PU, laine)", f: "pse", w: 60, r: "isolant du complexe de doublage" },
      { l: "Plaque de plâtre", f: "platre", w: 12, r: "parement intérieur" },
      { l: "Peinture / revêtement", f: "peinture", w: 4, r: "finition" }],
      note: "Doublage collé = complexe isolant + plaque collé par plots. Derrière : vide entre plots. Un dégât des eaux derrière un doublage collé sèche très mal." }),
    doublageOssature: () => coupe({ title: "Doublage sur ossature métallique", layers: [
      { l: "Mur existant", f: "bloc", w: 80, r: "support, non modifié" },
      { l: "Isolant (laine minérale/biosourcée)", f: "laine", w: 60, r: "entre mur et ossature, maintenu par les appuis" },
      { l: "Fourrures métalliques + appuis", f: "metal", w: 10, r: "ossature qui porte la plaque" },
      { l: "Pare-vapeur", f: "membrane", w: 4, r: "côté CHAUD (intérieur), continu" },
      { l: "Plaque de plâtre BA13", f: "platre", w: 12, r: "vissée sur fourrures" }],
      note: "Ossature = plaque indépendante du mur. Démontage et remplacement partiel plus faciles qu'un doublage collé." }),
    cloison: () => coupe({ title: "Cloison distributive 72/48", a: "Pièce A", b: "Pièce B", layers: [
      { l: "Peinture", f: "peinture", w: 4, r: "finition" },
      { l: "Plaque BA13 (12,5 mm)", f: "platre", w: 16, r: "parement" },
      { l: "Montants 48 mm + laine", f: "laine", w: 54, r: "ossature (entraxe usuel 60 cm) + isolant acoustique" },
      { l: "Plaque BA13 (12,5 mm)", f: "platre", w: 16, r: "parement" },
      { l: "Faïence / peinture", f: "carrelage", w: 6, r: "finition côté pièce B" }],
      note: "72/48 : 48 mm de montant + 2 × 12,5 mm de plaque ≈ 72 mm (73). Pièce humide : plaque hydrofuge (H1, carton vert) + protection en pied." }),
    plancher: () => coupe({ dir: "v", title: "Plancher : du revêtement au plafond", a: "Logement du dessus", b: "Logement du dessous", layers: [
      { l: "Revêtement (carrelage, parquet, PVC)", f: "carrelage", w: 10, r: "finition de sol" },
      { l: "Colle / sous-couche", f: "colle", w: 6, r: "liaison ou résilient acoustique" },
      { l: "Chape (mortier ciment ou anhydrite)", f: "chape", w: 26, r: "dresse le sol ; l'anhydrite craint l'eau" },
      { l: "Isolant / sous-couche acoustique", f: "pse", w: 16, r: "si chape flottante" },
      { l: "Dalle béton armé", f: "beton", w: 40, r: "structure porteuse" },
      { l: "Plénum + suspentes", f: "air", w: 22, r: "vide technique du faux plafond" },
      { l: "Plaque de plâtre (plafond)", f: "platre", w: 10, r: "plafond suspendu" }] }),
    toitureCouches: () => coupe({ dir: "v", title: "Rampant de toiture isolé — couches", a: "Extérieur", b: "Combles aménagés", layers: [
      { l: "Tuiles", f: "tuile", w: 14, r: "étanchéité à l'eau" },
      { l: "Liteaux + lame ventilée", f: "airv", w: 18, r: "ventile la sous-face des tuiles" },
      { l: "Contre-liteaux", f: "bois", w: 8, r: "dans la pente, maintiennent l'écran" },
      { l: "Écran sous-toiture HPV", f: "ecran", w: 4, r: "hautement perméable à la vapeur" },
      { l: "Isolant entre chevrons", f: "laine", w: 40, r: "1re couche" },
      { l: "Isolant sous chevrons", f: "laine", w: 24, r: "2e couche croisée (limite les ponts thermiques)" },
      { l: "Pare-vapeur", f: "membrane", w: 4, r: "côté chaud, continu, adhésivé" },
      { l: "Fourrures (lame technique)", f: "air", w: 12, r: "passage des gaines sans percer le pare-vapeur" },
      { l: "Plaque de plâtre", f: "platre", w: 10, r: "parement" }] }),
    facadeIte: () => coupe({ title: "Façade isolée par l'extérieur (ITE sous enduit)", layers: [
      { l: "Enduit de finition", f: "enduit", w: 8, r: "aspect, protection" },
      { l: "Sous-enduit armé (treillis)", f: "chaux", w: 8, r: "résiste aux chocs et à la fissuration" },
      { l: "Isolant (PSE, laine, fibre de bois)", f: "pse", w: 70, r: "collé et/ou chevillé" },
      { l: "Colle", f: "colle", w: 8, r: "fixation" },
      { l: "Mur support", f: "bloc", w: 80, r: "structure" },
      { l: "Enduit intérieur / plaque", f: "platre", w: 10, r: "parement" }] }),
    renovation: () => `<div class="grid grid-3 renov">` +
      coupe({ title: "AVANT — mur ancien d'origine", layers: [
        { l: "Enduit chaux", f: "chaux", w: 12, r: "perméable : le mur sèche vers l'extérieur" },
        { l: "Mur moellons / pierre (50 cm)", f: "pierre", w: 90, r: "gère l'humidité, inertie" },
        { l: "Enduit plâtre/chaux intérieur", f: "chaux", w: 12, r: "perméable" }] }) +
      coupe({ title: "À ÉVITER — rénovation « étanche »", layers: [
        { l: "Enduit ciment", f: "ciment", w: 12, bad: true, r: "bloque le séchage : humidité piégée" },
        { l: "Mur moellons", f: "pierre", w: 90, r: "s'humidifie" },
        { l: "Plots de colle", f: "colle", w: 10, r: "transmettent l'humidité" },
        { l: "PSE", f: "pse", w: 40, bad: true, r: "fermé à la vapeur côté mur" },
        { l: "Pare-vapeur étanche mal placé / BA13", f: "membrane", w: 8, bad: true, r: "la paroi ne sèche plus d'aucun côté" }] }) +
      coupe({ title: "APRÈS — rénovation compatible", layers: [
        { l: "Enduit chaux (refait/conservé)", f: "chaux", w: 12, r: "laisse sécher vers l'extérieur" },
        { l: "Mur moellons (assaini)", f: "pierre", w: 90, r: "cause d'humidité traitée AVANT d'isoler" },
        { l: "Isolant perspirant (fibre de bois, chaux-chanvre…)", f: "biosource", w: 40, r: "capillaire, tolère l'humidité" },
        { l: "Frein-vapeur hygrovariable", f: "frein", w: 5, r: "freine l'hiver, laisse sécher vers l'intérieur l'été" },
        { l: "Lame technique + plaque", f: "air", w: 14, r: "réseaux sans percer le frein-vapeur" }] }) + `</div>`
  };
})();
