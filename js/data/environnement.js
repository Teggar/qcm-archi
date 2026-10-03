// Contenu de la page Réglementation environnementale (HTML)
window.ENV_SECTIONS = [
  {
    id: "re2020",
    titre: "RE2020 — bâtiments neufs",
    html: `
<p>La <b>RE2020</b> remplace la RT2012. Elle s'applique aux permis de construire déposés depuis le <b>1er janvier 2022</b> pour les logements, et depuis le <b>1er juillet 2022</b> pour les bureaux et bâtiments d'enseignement. Trois objectifs :</p>
<ol>
  <li><b>Sobriété énergétique</b> : poursuivre l'amélioration de la performance (Bbio, Cep, Cep,nr).</li>
  <li><b>Décarbonation</b> : prise en compte de l'impact carbone sur tout le cycle de vie (Ic construction, Ic énergie).</li>
  <li><b>Confort d'été</b> : limiter les surchauffes (indicateur DH).</li>
</ol>
<div class="table-wrap"><table>
<thead><tr><th>Indicateur</th><th>Ce qu'il mesure</th><th>Unité</th></tr></thead>
<tbody>
<tr><td>Bbio</td><td>Besoin bioclimatique (qualité de conception du bâti)</td><td>points</td></tr>
<tr><td>Cep / Cep,nr</td><td>Consommation d'énergie primaire totale / non renouvelable</td><td>kWhep/m².an</td></tr>
<tr><td>Ic énergie</td><td>Impact carbone des consommations d'énergie sur 50 ans</td><td>kgCO₂eq/m²</td></tr>
<tr><td>Ic construction</td><td>Impact carbone des produits, composants et équipements (ACV)</td><td>kgCO₂eq/m²</td></tr>
<tr><td>DH</td><td>Degrés-heures d'inconfort estival</td><td>°C.h</td></tr>
</tbody></table></div>
<h3>Seuils Ic construction (kgCO₂eq/m²)</h3>
<div class="table-wrap"><table>
<thead><tr><th>Typologie</th><th class="num">2022</th><th class="num">2025</th><th class="num">2028</th><th class="num">2031</th></tr></thead>
<tbody>
<tr><td>Maison individuelle</td><td class="num">640</td><td class="num">530</td><td class="num">475</td><td class="num">415</td></tr>
<tr><td>Logement collectif</td><td class="num">740</td><td class="num">650</td><td class="num">580</td><td class="num">490</td></tr>
</tbody></table></div>
<p class="small muted">Valeurs de référence (modulables selon les caractéristiques du projet). À vérifier dans les textes en vigueur.</p>
<h3>ACV dynamique</h3>
<p>L'analyse de cycle de vie est calculée sur <b>50 ans</b> avec une méthode <b>dynamique</b> : une tonne de CO₂ émise aujourd'hui pèse plus lourd qu'une tonne émise dans 50 ans. Cela favorise les matériaux qui <b>stockent du carbone</b> (bois, biosourcés) et pénalise les émissions immédiates (béton, acier non décarbonés).</p>
<p>Les données environnementales des produits proviennent des <b>FDES</b> (produits) et <b>PEP</b> (équipements) publiées dans la base <b>INIES</b>. À défaut, des données environnementales par défaut (pénalisantes) sont utilisées.</p>
`
  },
  {
    id: "existant",
    titre: "Bâtiments existants : DPE, passoires, audit",
    html: `
<h3>DPE (diagnostic de performance énergétique)</h3>
<ul>
<li>Réformé et rendu <b>opposable</b> le <b>1er juillet 2021</b>.</li>
<li>Classement de <b>A à G</b> selon un <b>double seuil</b> : consommation d'énergie primaire et émissions de GES ; la plus mauvaise des deux étiquettes est retenue.</li>
<li>Validité : 10 ans (les anciens DPE ont été invalidés progressivement).</li>
</ul>
<h3>Loi Climat et Résilience (22 août 2021) : calendrier de décence énergétique</h3>
<div class="table-wrap"><table>
<thead><tr><th>Échéance</th><th>Mesure</th></tr></thead>
<tbody>
<tr><td>Août 2022</td><td>Gel des loyers des logements classés F et G</td></tr>
<tr><td>1er avril 2023</td><td>Audit énergétique obligatoire pour la vente des maisons / monopropriétés classées F ou G</td></tr>
<tr><td>2025</td><td>Interdiction de mise en location des logements G ; audit étendu aux classes E</td></tr>
<tr><td>2028</td><td>Interdiction de mise en location des logements F</td></tr>
<tr><td>2034</td><td>Interdiction de mise en location des logements E ; audit étendu aux classes D</td></tr>
</tbody></table></div>
<h3>Décret tertiaire (dispositif Éco Énergie Tertiaire)</h3>
<ul>
<li>Bâtiments ou parties de bâtiments à usage tertiaire d'au moins <b>1 000 m²</b>.</li>
<li>Réduction de la consommation d'énergie finale : <b>−40 % en 2030</b>, <b>−50 % en 2040</b>, <b>−60 % en 2050</b> (par rapport à une année de référence ≥ 2010) ou atteinte d'une valeur absolue.</li>
<li>Déclaration annuelle des consommations sur la plateforme <b>OPERAT</b> (ADEME).</li>
</ul>
<div class="callout"><b>Lien avec l'expertise :</b> lors d'un sinistre sur un bâtiment classé F ou G, l'assuré peut souhaiter profiter des travaux pour améliorer la performance. L'expert distingue ce qui relève de la remise en état (indemnisable) de l'amélioration (à la charge de l'assuré, éventuellement aidée par MaPrimeRénov' / CEE). Exception : les mises aux normes imposées par la réglementation peuvent être garanties si le contrat le prévoit.</div>
`
  },
  {
    id: "dechets",
    titre: "Déchets du bâtiment et économie circulaire",
    html: `
<h3>Loi AGEC (anti-gaspillage pour une économie circulaire, 2020)</h3>
<ul>
<li>Crée la <b>REP PMCB</b> (responsabilité élargie du producteur des produits et matériaux de construction du bâtiment), opérationnelle depuis <b>2023</b> : reprise sans frais des déchets du bâtiment triés, maillage de points de collecte.</li>
<li>Renforce le <b>diagnostic PEMD</b> (produits, équipements, matériaux, déchets) avant démolition ou réhabilitation significative (notamment au-delà de 1 000 m² de surface de plancher), depuis juillet 2023.</li>
<li>Traçabilité des déchets de chantier : bordereaux, preuves de dépôt.</li>
</ul>
<h3>Hiérarchie des modes de traitement</h3>
<ol>
<li><b>Prévention</b> (ne pas produire de déchet : réparer plutôt que remplacer)</li>
<li><b>Préparation au réemploi / réutilisation</b></li>
<li><b>Recyclage</b></li>
<li><b>Autre valorisation</b> (dont énergétique)</li>
<li><b>Élimination</b> (stockage, incinération sans valorisation)</li>
</ol>
<div class="callout ok"><b>Réemploi</b> : l'élément est réutilisé pour le même usage sans être devenu un déchet (tuiles, portes, radiateurs, sanitaires…). <b>Recyclage</b> : la matière est transformée (béton concassé en granulats).</div>
`
  },
  {
    id: "risques",
    titre: "Risques naturels et climat",
    html: `
<ul>
<li><b>Retrait-gonflement des argiles (RGA)</b> : l'une des premières causes d'indemnisation CatNat en coût, en forte hausse ; une large part des maisons individuelles est située en zone d'exposition moyenne ou forte.</li>
<li><b>Loi ELAN</b> : depuis le 1er octobre 2020, étude géotechnique préalable (G1) obligatoire lors de la vente d'un terrain constructible en zone d'exposition moyenne ou forte, et étude de conception (ou respect de dispositions constructives) pour la construction.</li>
<li><b>Réforme CatNat (loi du 28 décembre 2021)</b> : délai de déclaration porté à 30 jours après publication de l'arrêté, meilleure transparence, prise en charge des frais de relogement d'urgence.</li>
<li><b>Surprime CatNat</b> portée de 12 % à <b>20 %</b> au 1er janvier 2025 pour les contrats habitation et biens professionnels.</li>
<li><b>État des risques (ERP)</b> à annexer aux ventes et locations ; plans de prévention des risques (PPRN, PPRT) ; portail <b>Géorisques</b>.</li>
</ul>
<div class="callout warn">Le changement climatique augmente la fréquence et l'intensité des sinistres (sécheresse, inondations, grêle, tempêtes). Les cabinets d'expertise doivent absorber des <b>pics d'activité</b> (« événements climatiques ») : mobilité, renforts et capacité à traiter un grand volume de dossiers sont des attentes fortes en entretien.</div>
`
  },
  {
    id: "entreprise",
    titre: "Obligations des entreprises : BEGES, CSRD",
    html: `
<ul>
<li><b>BEGES</b> (bilan des émissions de gaz à effet de serre) : obligatoire pour les entreprises de plus de 500 salariés (250 en outre-mer), mis à jour tous les 4 ans, avec un plan de transition.</li>
<li><b>Scopes</b> : 1 = émissions directes (véhicules de la flotte, chauffage au gaz) ; 2 = indirectes liées à l'énergie achetée (électricité) ; 3 = autres indirectes (achats, déplacements domicile-travail, travaux commandés…).</li>
<li><b>CSRD</b> : directive européenne de reporting de durabilité (normes ESRS), déployée progressivement à partir de 2024 (calendrier réaménagé par l'UE en 2025).</li>
</ul>
<p>Pour un cabinet d'expertise, les postes majeurs sont les <b>déplacements des experts</b> (véhicules) et, indirectement, les <b>travaux de réparation</b> préconisés.</p>
`
  },
  {
    id: "expertise-durable",
    titre: "L'expertise sinistre au service de la réparation durable",
    html: `
<p>Les assureurs et cabinets d'expertise intègrent de plus en plus la dimension environnementale dans le règlement des sinistres. Leviers à citer en entretien :</p>
<div class="grid grid-2">
<div class="card"><h3>Réparer avant de remplacer</h3><p>Ponçage et vitrification d'un parquet plutôt que remplacement, reprise localisée d'enduit, réparation d'appareils électroménagers.</p></div>
<div class="card"><h3>Réemploi et pièces de seconde main</h3><p>Réutiliser les tuiles saines, les menuiseries récupérables, recourir aux plateformes de matériaux de réemploi.</p></div>
<div class="card"><h3>Préconisations à plus faible impact</h3><p>Matériaux biosourcés lorsque la solution est équivalente, filières locales, séchage optimisé (assécheurs) pour éviter des démolitions inutiles.</p></div>
<div class="card"><h3>Réduire les déplacements</h3><p>Expertise à distance (visio-expertise, photos géolocalisées) pour les petits dossiers, optimisation des tournées.</p></div>
<div class="card"><h3>Prévention</h3><p>Conseils à l'assuré pour éviter la récidive : entretien des toitures, gestion des eaux pluviales, végétation près des fondations, détecteurs de fuite.</p></div>
<div class="card"><h3>Mesurer</h3><p>Estimer l'empreinte carbone d'une solution réparatoire (FDES, ratios) pour comparer les options — un argument différenciant.</p></div>
</div>
<div class="callout"><b>Attention au principe indemnitaire :</b> la solution « verte » doit rester une remise en état équivalente. Si elle coûte plus cher, l'écart relève d'un choix de l'assuré ou d'une garantie spécifique du contrat.</div>
`
  }
];
