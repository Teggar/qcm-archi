// Mises en situation. Prix unitaires = ordres de grandeur indicatifs HT (fourniture + pose), modifiables dans l'interface.
// Ligne de chiffrage : d = désignation, u = unité, q = quantité, pu = prix unitaire HT, v = vétusté (%), calc = détail du métré.
window.CAS = [
  {
    id: "dde-irsi",
    titre: "Dégât des eaux en appartement (IRSI)",
    tag: "Dégât des eaux",
    niveau: "Débutant",
    resume: "Fuite d'un flexible de lave-linge à l'étage supérieur : convention applicable, métré d'une chambre, vétusté et tranche IRSI.",
    contexte: "<p>Copropriété de 1975. Mme A., propriétaire occupante au 3e étage, déclare des dommages dans sa chambre. L'origine : le <b>flexible d'alimentation du lave-linge</b> de l'appartement du 4e, occupé par un locataire (M. B.), s'est rompu. La fuite a été réparée par un plombier le lendemain.</p><p>Vous êtes mandaté par l'assureur MRH de Mme A.</p>",
    donnees: [
      "Chambre : 3,50 m × 3,00 m, hauteur sous plafond 2,50 m",
      "Porte : 0,83 × 2,04 m — Fenêtre : 1,20 × 1,35 m",
      "Dommages : auréoles au plafond et sur 2 murs (mais teinte uniforme : on reprend toute la pièce), stratifié gonflé sur toute la surface",
      "Peintures refaites il y a 4 ans ; stratifié posé il y a 8 ans",
      "Franchise contractuelle MRH : 150 €",
      "Le permis de construire de l'immeuble date de 1974"
    ],
    etapes: [
      { q: "Quelle convention s'applique a priori et qui est l'assureur gestionnaire ?",
        r: "<p>Dégât des eaux dans un immeuble : <b>convention IRSI</b> si les dommages du local sont ≤ 5 000 € HT. L'<b>assureur gestionnaire</b> est l'assureur de l'<b>occupant du local sinistré</b>, donc l'assureur MRH de Mme A. C'est lui qui organise l'expertise et indemnise.</p><p>La tranche (1 ou 2) sera déterminée après évaluation du montant des dommages du local.</p>" },
      { q: "Quelles constatations et pièces devez-vous recueillir lors de la visite ?",
        r: "<ul><li>Origine et cause : flexible rompu (usure ? défaut de serrage ?), facture du plombier, photo de la pièce défectueuse si conservée.</li><li>Constat amiable dégât des eaux signé avec le voisin du dessus (et le syndic si parties communes).</li><li>Relevés d'humidité (humidimètre) pour délimiter la zone et vérifier le séchage avant travaux.</li><li>Photos, métré contradictoire, âge et nature des revêtements (factures d'origine).</li><li>Coordonnées de l'assureur de M. B. (pour les recours éventuels).</li><li>Immeuble antérieur à 1997 : vigilance <b>amiante</b> si travaux sur certains matériaux (dalles de sol, colles…).</li></ul>" },
      { q: "Réalisez le métré de la chambre (plafond, murs nets, sol, plinthes).",
        r: "<ul><li>Plafond : 3,50 × 3,00 = <b>10,50 m²</b></li><li>Périmètre : 2 × (3,50 + 3,00) = 13,00 m</li><li>Murs bruts : 13,00 × 2,50 = 32,50 m²</li><li>Déductions : porte 0,83 × 2,04 = 1,69 m² ; fenêtre 1,20 × 1,35 = 1,62 m²</li><li>Murs nets : 32,50 − 3,31 = <b>29,19 m²</b> → 29,2 m²</li><li>Sol : 10,50 m² ; avec 10 % de chutes : <b>11,55 m²</b> → 11,6 m²</li><li>Plinthes : 13,00 − 0,83 = <b>12,17 ml</b> → 12,2 ml</li></ul>" },
      { q: "Après chiffrage, dans quelle tranche IRSI se situe le dossier ? Quelles conséquences ?",
        r: "<p>Le total HT (≈ 2 040 €) est compris entre 1 600 et 5 000 € HT : <b>tranche 2</b>. L'expertise est réalisée par l'expert de l'assureur gestionnaire <b>pour le compte commun</b> des assureurs concernés ; un <b>recours</b> est possible contre l'assureur du responsable selon les règles conventionnelles.</p><p>En tranche 1 (≤ 1 600 € HT), l'assureur gestionnaire aurait indemnisé sans recours.</p>" }
    ],
    chiffrage: {
      tva: 10,
      franchise: 150,
      note: "TVA 10 % : logement achevé depuis plus de 2 ans. Vétusté : peinture 10 %/an (4 ans → 40 %), stratifié durée de vie ~20 ans (8 ans → 40 %).",
      lignes: [
        { d: "Protection des sols et mobilier, préparation", u: "Ft", q: 1, pu: 80, v: 0, calc: "Forfait" },
        { d: "Déplacement / remise en place du mobilier", u: "Ft", q: 1, pu: 120, v: 0, calc: "Forfait" },
        { d: "Impression isolante anti-taches plafond", u: "m²", q: 10.5, pu: 12, v: 40, calc: "3,50 × 3,00" },
        { d: "Peinture plafond 2 couches", u: "m²", q: 10.5, pu: 28, v: 40, calc: "3,50 × 3,00" },
        { d: "Peinture murs 2 couches", u: "m²", q: 29.2, pu: 25, v: 40, calc: "13,00 × 2,50 − 1,69 − 1,62" },
        { d: "Dépose et évacuation du stratifié", u: "m²", q: 10.5, pu: 8, v: 0, calc: "Surface au sol" },
        { d: "Fourniture et pose stratifié + sous-couche", u: "m²", q: 11.6, pu: 40, v: 40, calc: "10,50 × 1,10 (10 % chutes)" },
        { d: "Plinthes assorties", u: "ml", q: 12.2, pu: 12, v: 40, calc: "13,00 − 0,83" }
      ]
    },
    retenir: [
      "IRSI : assureur gestionnaire = assureur de l'occupant du local sinistré.",
      "Tranche 1 ≤ 1 600 € HT / tranche 2 de 1 600 à 5 000 € HT, appréciées par local.",
      "Toujours vérifier le séchage (humidimètre) avant de lancer les embellissements.",
      "Déduire les ouvertures et justifier chaque quantité : c'est ce qui rend un chiffrage défendable."
    ]
  },

  {
    id: "secheresse",
    titre: "Fissures sur maison individuelle (sécheresse / CatNat)",
    tag: "Catastrophe naturelle",
    niveau: "Confirmé",
    resume: "Maison de 1985 sur sol argileux, fissures en escalier après un été sec. Garantie, investigations, solution réparatoire, chiffrage.",
    contexte: "<p>M. et Mme C. sont propriétaires d'une maison de plain-pied construite en 1985 sur un terrain argileux. Après un été très sec, des fissures sont apparues à l'angle nord-est et les portes intérieures frottent. La commune vient d'être reconnue en état de catastrophe naturelle « mouvements de terrain différentiels consécutifs à la sécheresse et à la réhydratation des sols » par arrêté publié au JO.</p>",
    donnees: [
      "Fondations : semelles filantes à 0,50 m de profondeur",
      "Un chêne de 15 m de haut à 6 m de l'angle nord-est",
      "Fissures en escalier jusqu'à 3 mm d'ouverture à l'angle NE, fissures intérieures en tête de cloisons",
      "Déclaration faite 20 jours après la publication de l'arrêté",
      "Franchise légale CatNat sécheresse (habitation) : 1 520 €"
    ],
    etapes: [
      { q: "Quelle garantie peut être mobilisée ? La déclaration est-elle recevable ?",
        r: "<p>La garantie <b>catastrophes naturelles</b> du contrat MRH (régime de la loi du 13 juillet 1982), déclenchée par l'arrêté publié au JO. La déclaration est faite dans le délai de <b>30 jours</b> suivant la publication : elle est recevable.</p><p>La décennale n'est pas mobilisable : la maison a été réceptionnée il y a bien plus de 10 ans.</p>" },
      { q: "Quelle condition essentielle doit vérifier l'expert pour que la garantie CatNat joue ?",
        r: "<p>Que l'intensité anormale de l'agent naturel (la sécheresse) soit la <b>cause déterminante</b> des dommages, et que les dommages soient bien postérieurs à / concomitants de la période visée par l'arrêté. Il faut écarter ou pondérer d'autres causes : fuite de réseau, défaut de conception des fondations, désordres anciens (photos, témoins, dates).</p>" },
      { q: "Quelles investigations proposez-vous ?",
        r: "<ul><li>Relevé cartographique des fissures (ouverture, orientation, localisation) et pose de <b>jauges</b> pour suivre leur évolution.</li><li><b>Étude géotechnique G5</b> : sondages, nature et profondeur du sol argileux, teneur en eau, présence de racines.</li><li>Vérification des fondations (fouille de reconnaissance) : profondeur, état.</li><li>Recherche de fuites sur réseaux enterrés (EU/EP, alimentation).</li><li>Nivellement pour mesurer les déformations.</li></ul>" },
      { q: "Quelle solution réparatoire est cohérente ?",
        r: "<p>Traiter la <b>cause</b> avant les effets : <b>reprise en sous-œuvre</b> de la zone concernée (micropieux + longrines, ou injections de résine expansive selon l'étude), éventuellement accompagnée d'une gestion de la végétation (abattage / écran anti-racines) et de la gestion des eaux pluviales. Puis traitement des fissures (agrafage, harpage), réfection des enduits et embellissements, réglage des menuiseries.</p><p>Réparer seulement les fissures sans traiter les fondations conduirait à une réapparition des désordres.</p>" },
      { q: "Quels facteurs aggravants l'expert doit-il signaler ?",
        r: "<p>Fondations peu profondes (0,50 m en sol argileux), proximité d'un grand arbre (distance inférieure à sa hauteur), absence de trottoir périphérique ou de gestion des EP. Ces éléments n'excluent pas forcément la garantie mais doivent figurer dans le rapport et éclairent la solution réparatoire.</p>" }
    ],
    chiffrage: {
      tva: 10,
      franchise: 1520,
      note: "Ordres de grandeur très variables selon l'étude géotechnique. Pas de vétusté sur la structure ; vétusté appliquée sur les finitions.",
      lignes: [
        { d: "Étude géotechnique G5", u: "Ft", q: 1, pu: 2500, v: 0, calc: "Forfait bureau d'études" },
        { d: "Reprise en sous-œuvre par micropieux", u: "U", q: 14, pu: 1500, v: 0, calc: "Façades nord + est (≈ 1 micropieu tous les 1,30 m sur 18 ml)" },
        { d: "Longrines de liaison béton armé", u: "ml", q: 18, pu: 450, v: 0, calc: "Linéaire de façades reprises" },
        { d: "Agrafage et traitement des fissures", u: "ml", q: 12, pu: 95, v: 0, calc: "Relevé des fissures extérieures et intérieures" },
        { d: "Réfection enduit de façade", u: "m²", q: 45, pu: 55, v: 20, calc: "18 ml × 2,50 m de hauteur" },
        { d: "Reprise enduits + peinture intérieurs", u: "m²", q: 30, pu: 35, v: 30, calc: "Murs et cloisons fissurés" },
        { d: "Réglage / rabotage des menuiseries", u: "U", q: 3, pu: 150, v: 0, calc: "3 portes qui frottent" }
      ]
    },
    retenir: [
      "CatNat : arrêté au JO + déclaration sous 30 jours + cause déterminante = intensité anormale de l'agent naturel.",
      "Fissures en escalier aux angles = signe classique de tassement différentiel.",
      "G5 = étude géotechnique de diagnostic.",
      "Toujours traiter la cause (fondations) avant les effets (fissures)."
    ]
  },

  {
    id: "do-terrasse",
    titre: "Infiltrations sous toiture-terrasse d'un immeuble neuf (DO)",
    tag: "Dommages-Ouvrage",
    niveau: "Confirmé",
    resume: "Immeuble réceptionné il y a 18 mois, infiltrations au dernier étage. Qualification décennale, délais DO, recours, chiffrage avec TVA 20 %.",
    contexte: "<p>Un petit immeuble R+3 de 8 logements a été réceptionné sans réserve le 15 mars 2024. En septembre 2025, le syndic déclare à l'assureur Dommages-Ouvrage des infiltrations dans deux appartements du dernier étage, sous la toiture-terrasse inaccessible.</p><p>Vous êtes l'expert désigné par l'assureur DO.</p>",
    donnees: [
      "Toiture-terrasse inaccessible avec protection lourde (gravillons) : 12 × 10 m",
      "Constat : relevé d'étanchéité décollé en périphérie, hauteur du relevé ≈ 8 cm au-dessus de la protection",
      "Appartement 1 : plafond du séjour taché (25 m²) ; appartement 2 : plafond d'une chambre (12 m²)",
      "Entreprise d'étanchéité titulaire d'une RC décennale"
    ],
    etapes: [
      { q: "Le désordre relève-t-il de la DO ? Pourquoi ?",
        r: "<p>Oui. Le sinistre survient après l'année de parfait achèvement et dans les 10 ans suivant la réception. Des <b>infiltrations</b> dans des logements les rendent <b>impropres à leur destination</b> : désordre de <b>nature décennale</b>. La DO préfinance les réparations sans recherche de responsabilité.</p>" },
      { q: "Quels délais devez-vous (vous et l'assureur) respecter ?",
        r: "<ul><li><b>Rapport préliminaire</b> communiqué à l'assuré avant la décision.</li><li><b>60 jours</b> à compter de la déclaration complète pour notifier la position sur la garantie.</li><li><b>90 jours</b> à compter de la déclaration pour présenter une offre d'indemnité.</li><li>À défaut : l'assuré peut engager les travaux, indemnité majorée d'intérêts au double du taux légal.</li></ul>" },
      { q: "Quelle est la cause technique ? Quelle norme de référence ?",
        r: "<p>Hauteur de relevé insuffisante (≈ 8 cm) par rapport au minimum de <b>15 cm</b> au-dessus de la protection prévu par le <b>NF DTU 43.1</b>, et décollement du relevé : l'eau stagnante ou rejaillissante passe derrière le relevé. Non-conformité aux règles de l'art imputable à l'entreprise d'étanchéité (et éventuellement à la maîtrise d'œuvre).</p>" },
      { q: "Comment l'assureur DO récupère-t-il les sommes versées ?",
        r: "<p>Par <b>recours subrogatoire</b> contre les constructeurs responsables et leurs assureurs RC décennale. Entre assureurs, la <b>convention CRAC</b> permet une expertise unique et un règlement accéléré des recours. D'où l'importance de convoquer l'entreprise et son assureur dès le début de l'expertise.</p>" },
      { q: "Quel taux de TVA appliquer sur les travaux de réparation ? Pourquoi ?",
        r: "<p><b>20 %</b> : l'immeuble est achevé depuis <b>moins de 2 ans</b>, le taux réduit de 10 % ne s'applique pas. Pas d'abattement de vétusté sur un ouvrage neuf en DO.</p>" }
    ],
    chiffrage: {
      tva: 20,
      franchise: 0,
      note: "Périmètre de la terrasse : 2 × (12 + 10) = 44 ml. Bande de protection déposée sur 1 m de large en rive : 44 m².",
      lignes: [
        { d: "Installation de chantier, sécurité (garde-corps provisoires)", u: "Ft", q: 1, pu: 1800, v: 0, calc: "Forfait" },
        { d: "Dépose / repose protection gravillons en rive", u: "m²", q: 44, pu: 20, v: 0, calc: "44 ml × 1 m" },
        { d: "Réfection relevés d'étanchéité bicouche avec rehausse ≥ 15 cm", u: "ml", q: 44, pu: 95, v: 0, calc: "Périmètre 2 × (12 + 10)" },
        { d: "Couvertine aluminium sur acrotère", u: "ml", q: 44, pu: 65, v: 0, calc: "Périmètre" },
        { d: "Essai d'étanchéité (mise en eau)", u: "Ft", q: 1, pu: 600, v: 0, calc: "Forfait" },
        { d: "Traitement anti-taches plafonds", u: "m²", q: 37, pu: 10, v: 0, calc: "25 + 12" },
        { d: "Peinture plafonds 2 couches", u: "m²", q: 37, pu: 28, v: 0, calc: "25 + 12" }
      ]
    },
    retenir: [
      "DO : 60 jours pour la position, 90 jours pour l'offre, rapport préliminaire avant décision.",
      "Infiltrations rendant le logement impropre = nature décennale.",
      "Relevé d'étanchéité : 15 cm minimum au-dessus de la protection (NF DTU 43.1).",
      "TVA 20 % si le logement a moins de 2 ans."
    ]
  },

  {
    id: "incendie-cuisine",
    titre: "Incendie de cuisine et règle proportionnelle de prime",
    tag: "Incendie",
    niveau: "Intermédiaire",
    resume: "Feu de friteuse dans une maison : chiffrage cuisine + séjour enfumé, vétusté, franchise, et fausse déclaration non intentionnelle du nombre de pièces.",
    contexte: "<p>Un feu de friteuse a détruit la cuisine de M. D. et enfumé le séjour attenant. Lors de l'expertise, vous constatez que la maison compte <b>6 pièces principales</b>, alors que le contrat MRH en déclare <b>4</b>. M. D. explique de bonne foi avoir aménagé les combles il y a 3 ans sans prévenir son assureur.</p>",
    donnees: [
      "Cuisine : 4,00 × 3,00 m, HSP 2,50 m, ouvertures totales 4 m² ; équipements de cuisine détruits (10 ans d'âge)",
      "Séjour : 6,00 × 5,00 m, HSP 2,50 m, ouvertures 8 m², murs et plafond noircis par les suies",
      "Prime payée : 480 €/an ; prime qui aurait été due pour 6 pièces : 620 €/an",
      "Franchise contractuelle : 300 €"
    ],
    etapes: [
      { q: "Métré de la cuisine et du séjour ?",
        r: "<ul><li>Cuisine — plafond : 4 × 3 = <b>12 m²</b> ; murs : 2 × (4 + 3) × 2,50 − 4 = <b>31 m²</b> ; sol avec 10 % de chutes : <b>13,2 m²</b>.</li><li>Séjour — plafond : 6 × 5 = 30 m² ; murs : 2 × (6 + 5) × 2,50 − 8 = 47 m² ; total à nettoyer et repeindre : <b>77 m²</b>.</li></ul>" },
      { q: "Quelle règle s'applique au regard de l'omission sur le nombre de pièces ?",
        r: "<p>L'omission est <b>non intentionnelle</b> (bonne foi) et constatée après sinistre : <b>règle proportionnelle de prime</b> (art. L113-9 C. assur.). L'indemnité est réduite dans le rapport prime payée / prime due = 480 / 620 ≈ <b>0,774</b>.</p><p>Si la fausse déclaration avait été intentionnelle : nullité du contrat (L113-8), à prouver par l'assureur.</p>" },
      { q: "Quelles mesures conservatoires et précautions à la visite ?",
        r: "<ul><li>Mise en sécurité électrique (diagnostic par un électricien), ventilation.</li><li>Nettoyage rapide des suies (corrosives sur métaux et appareils électroniques).</li><li>Conservation des débris pour identifier l'origine (friteuse : pas de recours sauf défaut produit).</li><li>Évaluer les besoins de relogement si la maison est inhabitable (frais de relogement garantis selon contrat).</li></ul>" },
      { q: "Comment présenter l'indemnité à l'assuré ?",
        r: "<p>Calcul : montant TTC − vétusté − franchise, puis application du coefficient 480/620. Expliquer avec pédagogie la règle proportionnelle (texte de loi, déclaration initiale), rappeler que la garantie valeur à neuf permet souvent de récupérer une partie de la vétusté sur factures, et conseiller la mise à jour du contrat.</p>" }
    ],
    chiffrage: {
      tva: 10,
      franchise: 300,
      coef: { label: "Règle proportionnelle de prime (480 / 620)", value: 480 / 620 },
      note: "Vétusté : équipements de cuisine 10 ans → 40 % ; peintures 30 % ; électricité 10 %.",
      lignes: [
        { d: "Mise en sécurité électrique (mesure conservatoire)", u: "Ft", q: 1, pu: 350, v: 0, calc: "Forfait" },
        { d: "Démolition et évacuation cuisine sinistrée", u: "Ft", q: 1, pu: 900, v: 0, calc: "Forfait" },
        { d: "Reprise installation électrique cuisine", u: "Ft", q: 1, pu: 1800, v: 10, calc: "Forfait électricien" },
        { d: "Doublage BA13 murs cuisine", u: "m²", q: 31, pu: 45, v: 0, calc: "2 × (4 + 3) × 2,50 − 4" },
        { d: "Plafond BA13 sur ossature cuisine", u: "m²", q: 12, pu: 50, v: 0, calc: "4 × 3" },
        { d: "Peinture murs + plafond cuisine", u: "m²", q: 43, pu: 28, v: 30, calc: "31 + 12" },
        { d: "Carrelage sol cuisine (fourniture + pose)", u: "m²", q: 13.2, pu: 75, v: 30, calc: "12 × 1,10" },
        { d: "Cuisine équipée (meubles, plan de travail, pose)", u: "Ft", q: 1, pu: 8500, v: 40, calc: "Sur devis cuisiniste" },
        { d: "Lessivage / décontamination suies séjour", u: "m²", q: 77, pu: 9, v: 0, calc: "30 + (2 × (6 + 5) × 2,50 − 8)" },
        { d: "Peinture séjour (impression + 2 couches)", u: "m²", q: 77, pu: 26, v: 30, calc: "Plafond 30 + murs 47" }
      ]
    },
    retenir: [
      "Omission non intentionnelle → règle proportionnelle de prime (L113-9).",
      "Fausse déclaration intentionnelle → nullité (L113-8).",
      "Suies = urgence de nettoyage (corrosion).",
      "Expliquer, justifier, rester factuel : l'assuré doit comprendre chaque abattement."
    ]
  },

  {
    id: "tempete-toiture",
    titre: "Tempête : toiture endommagée",
    tag: "Tempête (TOC)",
    niveau: "Intermédiaire",
    resume: "Tuiles arrachées et faîtage endommagé : conditions de la garantie, calcul de la surface en rampant et du nombre de tuiles.",
    contexte: "<p>Lors d'une tempête, des rafales à 130 km/h ont été relevées par la station météo la plus proche. Chez Mme E., une partie du pan sud de la toiture a perdu ses tuiles et le faîtage est endommagé. L'eau a mouillé l'isolant des combles.</p>",
    donnees: [
      "Maison : emprise couverte au sol 10 m × 8 m, toiture 2 pans symétriques, pente 35°",
      "Tuiles mécaniques grand moule : 13 U/m² ; faîtières : 3 U/ml",
      "Zone endommagée : environ 60 % du pan sud",
      "Faîtage : 10 ml à refaire ; isolant combles mouillé : 20 m²",
      "Toiture de 25 ans ; franchise 300 €"
    ],
    etapes: [
      { q: "Quelle garantie et sous quelles conditions ?",
        r: "<p>La garantie <b>Tempête (TOC)</b>, obligatoirement incluse dans les contrats couvrant l'incendie (art. L122-7). Les contrats exigent généralement : vents d'une intensité telle qu'ils détruisent ou endommagent un certain nombre de bâtiments de bonne construction dans la commune et/ou une vitesse supérieure à un seuil (souvent 100 km/h) attestée par Météo-France. Ici 130 km/h : condition remplie (à vérifier selon le contrat).</p>" },
      { q: "Calculez la surface de couverture d'un pan, puis la surface endommagée.",
        r: "<ul><li>Surface au sol d'un pan : 10 × 4 = 40 m².</li><li>Surface en rampant d'un pan = 40 / cos(35°) = 40 / 0,819 = <b>48,8 m²</b>.</li><li>Zone endommagée : 48,8 × 60 % = <b>29,3 m²</b>.</li></ul>" },
      { q: "Combien de tuiles et de faîtières commander ?",
        r: "<ul><li>Tuiles : 29,3 × 13 = 381 ; + 5 % de casse → <b>400 tuiles</b>.</li><li>Faîtières : 10 ml × 3 = <b>30 U</b>.</li></ul>" },
      { q: "Quels points de vigilance pour la garantie ?",
        r: "<ul><li><b>Défaut d'entretien</b> : tuiles poreuses, liteaux pourris, mousses → exclusion possible si c'est la cause.</li><li><b>Mesures conservatoires</b> : bâchage rapide (garanti en général).</li><li>Les dommages intérieurs dus à la pluie ne sont couverts que s'ils résultent de la destruction partielle de la toiture par la tempête.</li><li>Possibilité de <b>réemployer</b> les tuiles saines déposées (démarche environnementale et économique).</li></ul>" }
    ],
    chiffrage: {
      tva: 10,
      franchise: 300,
      note: "Vétusté : couverture 25 ans → 30 % sur fournitures et pose de tuiles (durée de vie longue de la terre cuite) ; isolant 20 %.",
      lignes: [
        { d: "Bâchage provisoire (mesure conservatoire)", u: "Ft", q: 1, pu: 450, v: 0, calc: "Forfait" },
        { d: "Échafaudage / sécurité", u: "Ft", q: 1, pu: 1200, v: 0, calc: "Forfait" },
        { d: "Dépose tuiles endommagées", u: "m²", q: 29.3, pu: 12, v: 0, calc: "40 / cos 35° × 60 %" },
        { d: "Fourniture tuiles mécaniques", u: "U", q: 400, pu: 1.6, v: 30, calc: "29,3 × 13 × 1,05" },
        { d: "Pose tuiles (révision liteaux comprise)", u: "m²", q: 29.3, pu: 28, v: 30, calc: "Surface endommagée" },
        { d: "Réfection faîtage (closoir + faîtières)", u: "ml", q: 10, pu: 55, v: 30, calc: "Longueur du faîtage" },
        { d: "Remplacement isolant combles mouillé", u: "m²", q: 20, pu: 25, v: 20, calc: "Zone humide relevée" }
      ]
    },
    retenir: [
      "Surface en rampant = surface au sol / cos(pente).",
      "Toujours ajouter un % de casse sur les tuiles (≈ 5 %).",
      "TOC : garantie obligatoire avec le risque incendie ; conditions de vent fixées par le contrat.",
      "Distinguer dommage tempête et défaut d'entretien."
    ]
  },

  {
    id: "carrelage",
    titre: "Carrelage décollé 14 mois après réception",
    tag: "Qualification juridique",
    niveau: "Intermédiaire",
    resume: "Maison neuve, carrelage qui sonne creux et se soulève dans le séjour : GPA, biennale, décennale ou dommages intermédiaires ?",
    contexte: "<p>M. et Mme F. ont fait construire une maison réceptionnée sans réserve il y a 14 mois. Le carrelage du séjour-cuisine (35 m²) sonne creux sur la quasi-totalité de la surface et plusieurs carreaux se sont soulevés, avec arêtes vives et fissures.</p>",
    donnees: [
      "Carrelage collé sur chape, surface 35 m², périmètre de plinthes 26 ml",
      "Pas de réserve à la réception",
      "Assurance DO souscrite par les propriétaires",
      "Maison achevée depuis moins de 2 ans"
    ],
    etapes: [
      { q: "La garantie de parfait achèvement peut-elle jouer ?",
        r: "<p>Non : la GPA est d'<b>un an</b> à compter de la réception. Les désordres apparus 14 mois après la réception sont hors délai.</p>" },
      { q: "La garantie biennale peut-elle jouer ?",
        r: "<p>Non en principe : un carrelage collé ou scellé n'est pas un élément d'équipement <b>dissociable</b> (sa dépose détériore le support). Et un revêtement n'est pas un équipement destiné à fonctionner.</p>" },
      { q: "Quand la décennale (et donc la DO) peut-elle être retenue ?",
        r: "<p>Si le désordre rend l'ouvrage <b>impropre à sa destination</b> : décollement <b>généralisé</b>, carreaux soulevés et arêtes vives présentant un <b>danger</b> pour les occupants, impossibilité d'usage normal. La jurisprudence l'admet régulièrement dans ce type de cas. Dans ce cas, la DO préfinance, puis recours contre le carreleur.</p>" },
      { q: "Et si le désordre était seulement ponctuel et esthétique ?",
        r: "<p>Il relèverait des <b>dommages intermédiaires</b> : responsabilité contractuelle du carreleur pour <b>faute prouvée</b> (non garanti par la DO). L'expert doit donc précisément décrire l'étendue, l'évolutivité et les conséquences sur l'usage.</p>" },
      { q: "Quelles causes techniques rechercher ?",
        r: "<ul><li>Absence ou insuffisance de <b>joints périphériques</b> et de fractionnement (dilatation).</li><li>Colle inadaptée, encollage simple au lieu de double encollage pour grands formats, temps ouvert dépassé.</li><li>Chape trop humide ou insuffisamment sèche à la pose, plancher chauffant mis en chauffe trop tôt.</li><li>Référentiel : NF DTU 52.2 (pose collée des revêtements céramiques).</li></ul>" }
    ],
    chiffrage: {
      tva: 20,
      franchise: 0,
      note: "TVA 20 % : construction de moins de 2 ans. Pas de vétusté sur un ouvrage neuf.",
      lignes: [
        { d: "Déménagement / protection mobilier", u: "Ft", q: 1, pu: 300, v: 0, calc: "Forfait" },
        { d: "Dépose carrelage et plinthes + évacuation", u: "m²", q: 35, pu: 20, v: 0, calc: "Surface sinistrée" },
        { d: "Ragréage / préparation du support", u: "m²", q: 35, pu: 18, v: 0, calc: "Surface sinistrée" },
        { d: "Fourniture carrelage (10 % chutes)", u: "m²", q: 38.5, pu: 35, v: 0, calc: "35 × 1,10" },
        { d: "Pose collée double encollage + joints", u: "m²", q: 35, pu: 45, v: 0, calc: "Surface posée" },
        { d: "Plinthes carrelage", u: "ml", q: 26, pu: 18, v: 0, calc: "Périmètre déduction faite des seuils" }
      ]
    },
    retenir: [
      "Raisonner par élimination : GPA (1 an) → biennale (dissociable) → décennale (gravité) → dommages intermédiaires.",
      "La gravité décennale s'apprécie concrètement : étendue, danger, usage.",
      "Décrire précisément les faits : c'est le rapport qui permettra la qualification."
    ]
  },

  {
    id: "sous-assurance",
    titre: "Sous-assurance d'un local commercial",
    tag: "Calcul d'indemnité",
    niveau: "Débutant",
    resume: "Application de la règle proportionnelle de capitaux après un incendie partiel.",
    contexte: "<p>Un commerçant est assuré pour son local (bâtiment) à hauteur de <b>450 000 €</b>. Un incendie partiel cause <b>80 000 €</b> de dommages. Votre estimation de la valeur de reconstruction à neuf du bâtiment au jour du sinistre est de <b>600 000 €</b>. Le contrat prévoit une franchise de 1 000 € et ne comporte pas de clause de renonciation à la règle proportionnelle.</p>",
    donnees: [
      "Capital assuré : 450 000 €",
      "Valeur réelle (reconstruction à neuf) : 600 000 €",
      "Dommages : 80 000 € (après vétusté)",
      "Franchise : 1 000 €"
    ],
    etapes: [
      { q: "Y a-t-il sous-assurance ? Dans quelle proportion ?",
        r: "<p>Oui : 450 000 / 600 000 = <b>75 %</b>. Le bien n'est assuré qu'aux trois quarts de sa valeur.</p>" },
      { q: "Calculez l'indemnité.",
        r: "<p>Règle proportionnelle de capitaux (art. L121-5) : 80 000 × 75 % = 60 000 €. Après franchise : 60 000 − 1 000 = <b>59 000 €</b>.</p><p class='muted small'>Selon la rédaction du contrat, la franchise peut être déduite avant ou après l'application de la règle proportionnelle : (80 000 − 1 000) × 75 % = 59 250 €. Il faut lire les conditions générales.</p>" },
      { q: "Comment éviter cette situation ? Quel conseil donner ?",
        r: "<ul><li>Faire évaluer régulièrement la valeur de reconstruction (indexation du capital, indice FFB).</li><li>Souscrire un contrat avec renonciation à la règle proportionnelle ou une assurance « au premier risque ».</li><li>L'expert peut signaler la sous-assurance à l'assureur pour adaptation du contrat.</li></ul>" }
    ],
    retenir: [
      "Indemnité = dommage × capital assuré / valeur réelle.",
      "Vérifier l'ordre d'application franchise / règle proportionnelle dans le contrat.",
      "Le contrat peut prévoir une renonciation à la règle proportionnelle."
    ]
  },

  {
    id: "assure-mecontent",
    titre: "Assuré mécontent qui conteste la vétusté",
    tag: "Relationnel",
    niveau: "Tous niveaux",
    resume: "Mise en situation orale : un assuré refuse l'offre et menace de prendre un avocat. Posture, arguments, solutions.",
    contexte: "<p>Après un dégât des eaux, vous avez proposé une indemnité de 2 450 € après déduction de 900 € de vétusté et 150 € de franchise. L'assuré vous appelle, très énervé : « Je paie mon assurance depuis 20 ans, vous me volez ! Je vais prendre un avocat et un expert. »</p><p class='muted'>Ce type de mise en situation est fréquent en entretien : on évalue votre posture autant que votre technique.</p>",
    donnees: [
      "Contrat MRH avec garantie valeur à neuf : vétusté récupérable dans la limite de 25 % sur factures sous 2 ans",
      "Vétusté calculée sur des peintures de 6 ans et un parquet de 12 ans"
    ],
    etapes: [
      { q: "Quelle est votre première réaction ?",
        r: "<p><b>Écouter</b> sans interrompre, laisser l'émotion s'exprimer, <b>reformuler</b> (« Je comprends que vous soyez déçu, un sinistre c'est déjà pénible… »). Rester calme, courtois, ne jamais prendre la critique personnellement.</p>" },
      { q: "Comment expliquer la vétusté ?",
        r: "<p>Pédagogie et transparence : le contrat indemnise la valeur du bien au jour du sinistre (principe indemnitaire), un revêtement de 12 ans n'a plus la valeur d'un neuf. Montrer le <b>calcul détaillé</b> (âge, durée de vie, taux) et les clauses du contrat.</p>" },
      { q: "Quelle solution concrète pouvez-vous proposer ?",
        r: "<ul><li>Rappeler la <b>vétusté récupérable</b> : sur présentation des factures de travaux, une partie de la vétusté sera versée (indemnité différée).</li><li>Vérifier qu'aucune erreur n'a été commise (âges, quantités) et accepter de réexaminer avec des justificatifs (factures d'origine).</li><li>Proposer, le cas échéant, une réparation en nature par un réseau d'artisans.</li></ul>" },
      { q: "Et s'il maintient sa contestation ?",
        r: "<p>Rappeler ses droits avec neutralité : recours à un <b>expert d'assuré</b> (garantie honoraires éventuelle), procédure de contre-expertise / <b>tierce expertise</b> prévue au contrat, service réclamations puis <b>médiateur de l'assurance</b>. Tracer l'échange par écrit et en informer le mandant.</p>" }
    ],
    retenir: [
      "Écouter → reformuler → expliquer → proposer → tracer.",
      "Ne jamais promettre ce qui relève de la décision de l'assureur.",
      "La pédagogie du chiffrage désamorce la majorité des conflits."
    ]
  }
];
