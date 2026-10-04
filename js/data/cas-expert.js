// Cas d'expertise en raisonnement. L'utilisatrice écrit sa réponse, puis reçoit l'analyse :
// - grille : points attendus (kw = mots-clés détectés automatiquement, sans accents, minuscules)
// - dangers : erreurs graves (kw = détection d'une formulation risquée dans la réponse)
// - expert : ce qu'un professionnel aurait vérifié
// - chaine : origine → dommages → vérifications → travaux → chiffrage → assurance
// - chiffrage (optionnel) : même format que les cas guidés
window.CAS_EXPERT = [
  {
    id: "aureole-chambre", titre: "Auréole au plafond d'une chambre", tag: "Dégât des eaux", niveau: 2,
    notions: ["etendue", "origine-cause", "irsi", "ba13-dde", "tele-expertise"],
    enonce: "Un assuré signale un dégât des eaux dans une chambre. Une auréole de 80 cm apparaît au plafond. Le voisin du dessus signale une fuite ancienne réparée il y a trois jours. L'assuré fournit un devis pour refaire entièrement le plafond de 18 m² et repeindre toute la chambre. <b>Que fais-tu ?</b>",
    grille: [
      { k: "Qualification", items: [{ t: "Dégât des eaux en immeuble, origine chez un tiers (voisin du dessus)", kw: ["degat des eaux", "dde", "voisin", "tiers"] }] },
      { k: "Origine / cause", items: [{ t: "Identifier précisément l'origine (quel équipement chez le voisin) et la cause (rupture, joint…) ; demander la facture de réparation", kw: ["facture", "plombier", "origine", "cause", "reparation de la fuite"] }] },
      { k: "Lien causal & chronologie", items: [{ t: "Vérifier que l'auréole correspond à la fuite (aplomb, ancienneté, contours multiples = ancien ?)", kw: ["lien", "causal", "chronolog", "ancien", "aplomb", "date"] }] },
      { k: "Étendue", items: [{ t: "Plafond : nature (plaque ? enduit sur dalle ?), état après séchage ; murs : sont-ils réellement atteints ?", kw: ["nature du plafond", "plaque", "seche", "sechage", "humidimetre", "murs"] }] },
      { k: "Travaux nécessaires", items: [{ t: "Si plaque saine : impression anti-taches + peinture du plafond entier ; pas de remplacement ni des 4 murs sans dommage", kw: ["impression", "anti-tache", "antitache", "peinture du plafond", "pas de remplacement", "plafond entier"] }] },
      { k: "Pièces manquantes", items: [{ t: "Photos, constat amiable, coordonnées de l'assureur du voisin, âge des peintures, dimensions", kw: ["photo", "constat", "assureur du voisin", "coordonnees", "dimension", "age"] }] },
      { k: "Chiffrage", items: [{ t: "Métré : plafond 18 m² ; murs uniquement si atteints ; vétusté sur peinture ; franchise", kw: ["18 m", "metre", "vetuste", "franchise", "m2", "m²"] }] },
      { k: "Garantie / convention", items: [{ t: "Convention IRSI (immeuble, ≤ 5 000 € HT) : assureur de l'occupant gestionnaire ; tranche selon montant", kw: ["irsi", "convention", "tranche", "gestionnaire"] }] },
      { k: "Recours", items: [{ t: "Recours éventuel contre l'assureur du voisin si tranche 2", kw: ["recours", "subrog"] }] }
    ],
    dangers: [
      { t: "Accepter le devis tel quel (remplacement du plafond + toute la chambre) sans justification", kw: ["accepte le devis", "valider le devis", "on accepte", "accepter le devis"] },
      { t: "Faire repeindre immédiatement alors que la fuite est réparée depuis 3 jours seulement (séchage non vérifié)", kw: ["repeindre immediatement", "tout de suite", "immediatement"] },
      { t: "Refuser parce que la fuite vient du voisin (l'assureur de l'occupant gère en IRSI)", kw: ["refuser", "pas notre", "au voisin de payer"] }
    ],
    expert: ["Mesure d'humidité du plafond avant travaux", "Nature exacte du plafond et état de la plaque (planéité, dureté)", "Cohérence entre position de l'auréole et équipement fuyard", "Montant HT pour situer la tranche IRSI", "Âge des peintures pour la vétusté"],
    chaine: { origine: "Fuite chez le voisin du dessus, réparée il y a 3 jours", dommages: "Auréole 80 cm au plafond (murs à vérifier)", verifications: "Séchage, nature et état du plafond, lien causal, pièces", travaux: "Impression isolante + peinture plafond entier (18 m²)", chiffrage: "≈ 18 m² × (impression + peinture) + protection ; murs exclus s'ils sont sains", assurance: "IRSI, assureur de l'occupant ; tranche 1 très probable → pas de recours" },
    chiffrage: { tva: 10, franchise: 150, note: "Exemple de chiffrage avec prix fournis par l'énoncé (indicatifs). Peinture de 5 ans, vétusté 10 %/an.", lignes: [
      { d: "Protection sol et mobilier", u: "Ft", q: 1, pu: 60, v: 0, calc: "Forfait" },
      { d: "Impression isolante anti-taches", u: "m²", q: 18, pu: 10, v: 50, calc: "Plafond entier" },
      { d: "Peinture plafond 2 couches", u: "m²", q: 18, pu: 26, v: 50, calc: "Plafond entier" }] }
  },
  {
    id: "fuite-evier", titre: "Fuite sous évier chez un locataire", tag: "Dégât des eaux", niveau: 1,
    notions: ["alim-evac", "conservatoires", "responsabilites", "unites", "chaine-chiffrage"],
    enonce: "Une locataire appelle : le meuble sous l'évier est gonflé, le sol (carrelage) était trempé ce matin. Elle a fermé le robinet sous l'évier et ça ne coule plus. Le mur derrière est taché sur environ 40 cm. Elle demande le remplacement complet de la cuisine équipée. <b>Comment mènes-tu la télé-expertise ?</b>",
    grille: [
      { k: "Origine / cause", items: [{ t: "Distinguer alimentation (permanent) et évacuation (à l'usage) : a-t-elle fermé le robinet d'alimentation ? Ça fuyait sans usage ?", kw: ["alimentation", "evacuation", "permanent", "usage", "siphon", "flexible"] }] },
      { k: "Mesures conservatoires", items: [{ t: "Robinet fermé : bien. Faire intervenir un plombier ; conserver la pièce défectueuse ; photos", kw: ["plombier", "conserver", "photo", "robinet"] }] },
      { k: "Étendue", items: [{ t: "Meuble bas (caisson) ; mur derrière (pan) ; carrelage normalement non endommagé ; voisin du dessous ?", kw: ["caisson", "meuble", "pan de mur", "carrelage", "voisin du dessous"] }] },
      { k: "Travaux", items: [{ t: "Remplacement du caisson / façade concernés si possible ; nettoyage, traitement, peinture du pan ; pas la cuisine entière sans justification (raccord impossible ?)", kw: ["remplacement du caisson", "caisson", "peinture", "pas toute la cuisine", "raccord"] }] },
      { k: "Responsabilités", items: [{ t: "Joint / flexible usé : entretien locatif ; réparation de la fuite non garantie ; dommages consécutifs selon contrat", kw: ["locatif", "entretien", "locataire", "reparation de la fuite", "proprietaire"] }] },
      { k: "Chiffrage", items: [{ t: "Unités : caisson U, peinture m², dépose/pose Ft, évacuation Ft", kw: ["u", "m2", "m²", "forfait", "ft"] }] }
    ],
    dangers: [
      { t: "Accorder la cuisine entière sans vérifier si un caisson identique peut être remplacé", kw: ["toute la cuisine", "cuisine complete", "cuisine entiere"] },
      { t: "Oublier de vérifier le logement du dessous", kw: [] }
    ],
    expert: ["Caractère permanent ou à l'usage de la fuite", "Référence du meuble (disponible ?)", "Âge de la cuisine (vétusté)", "Logement du dessous touché ?", "Facture du plombier et pièce remplacée"],
    chaine: { origine: "Raccord / flexible / siphon sous évier", dommages: "Caisson aggloméré gonflé, tache murale", verifications: "Type de fuite, référence meuble, voisin du dessous", travaux: "Caisson, nettoyage, peinture du pan de mur", chiffrage: "Caisson U + pose Ft + peinture m²", assurance: "MRH de la locataire ; réparation de la fuite = entretien" }
  },
  {
    id: "canalisation-encastree", titre: "Tache dans le couloir près de la salle de bains", tag: "Recherche de fuite", niveau: 3,
    notions: ["recherche-fuite", "fuite-infiltration", "diag", "responsabilites"],
    enonce: "Dans un appartement (copropriété, 1985), une tache humide monte en bas de la cloison du couloir, côté opposé à la salle de bains. Elle s'étend lentement depuis 3 semaines, même quand personne n'utilise l'eau. Le compteur divisionnaire de l'appartement tourne robinets fermés. <b>Ton analyse et tes actions ?</b>",
    grille: [
      { k: "Qualification", items: [{ t: "Fuite sur l'alimentation sous pression (compteur qui tourne, permanente), probablement encastrée", kw: ["alimentation", "pression", "compteur", "encastr", "permanent"] }] },
      { k: "Vérifications", items: [{ t: "Recherche de fuite non destructive (gaz traceur, thermographie, écoute) avant d'ouvrir", kw: ["recherche de fuite", "gaz traceur", "thermograph", "non destructi"] }] },
      { k: "Mesures conservatoires", items: [{ t: "Couper l'eau de l'appartement en dehors des usages, protéger, surveiller", kw: ["couper", "fermer", "robinet"] }] },
      { k: "Étendue", items: [{ t: "Cloison des deux côtés, isolant, sol/plinthes, logement du dessous", kw: ["deux faces", "isolant", "plinthe", "dessous"] }] },
      { k: "Responsabilités", items: [{ t: "Canalisation privative après la vanne du logement (selon règlement de copro) ; si locataire : vétusté = bailleur", kw: ["privati", "reglement", "bailleur", "proprietaire", "copropriete"] }] },
      { k: "Assurance", items: [{ t: "Frais de recherche de fuite souvent garantis ; réparation du tuyau en principe non ; dommages selon contrat", kw: ["frais de recherche", "recherche de fuite", "pas la reparation", "dommages"] }] }
    ],
    dangers: [
      { t: "Casser la cloison au hasard sans recherche de fuite préalable", kw: ["casser", "ouvrir la cloison", "demolir"] },
      { t: "Conclure à une remontée capillaire (au 1985 en étage, avec compteur qui tourne)", kw: ["capillar"] }
    ],
    expert: ["Plan des réseaux / position des nourrices", "Tracé probable des canalisations encastrées", "Limite parties communes / privatives", "Logement du dessous"],
    chaine: { origine: "Canalisation d'alimentation encastrée", dommages: "Cloison, isolant, plinthes, éventuellement voisin dessous", verifications: "Compteur, recherche non destructive", travaux: "Ouverture localisée, réparation, remplacement plaque + isolant, finitions", chiffrage: "RDF Ft + ouverture/refermeture m² + finitions m²/ml", assurance: "RDF souvent garantie ; réparation du tuyau non ; recours selon responsable" }
  },
  {
    id: "infil-toiture", titre: "Tache au rampant sous une fenêtre de toit", tag: "Infiltration toiture", niveau: 2,
    notions: ["toit-points", "couverture", "tempete", "isolants", "ecran"],
    enonce: "Maison individuelle de 2008, combles aménagés. Une tache brune apparaît au plafond rampant, sous l'angle bas d'une fenêtre de toit, après chaque pluie forte. Pas de tempête récente. L'assuré veut faire refaire la toiture du versant. <b>Que vérifies-tu et comment qualifies-tu ?</b>",
    grille: [
      { k: "Qualification", items: [{ t: "Infiltration (liée à la pluie), localisée à un point singulier : raccord de la fenêtre de toit (abergement / raccord d'étanchéité)", kw: ["infiltration", "abergement", "raccord", "point singulier", "fenetre de toit", "velux"] }] },
      { k: "Garantie", items: [{ t: "Pas de tempête : la garantie dépend du contrat (infiltrations souvent exclues ou limitées) ; défaut d'entretien ou de pose à examiner", kw: ["pas de tempete", "exclu", "contrat", "entretien", "pose"] }] },
      { k: "Chronologie / âge", items: [{ t: "Maison de 2008 : décennale expirée (réception > 10 ans) sauf date de réception plus tardive à vérifier", kw: ["decennale", "reception", "10 ans", "2008"] }] },
      { k: "Étendue", items: [{ t: "Plaque du rampant, isolant derrière (souvent mouillé), pare-vapeur", kw: ["isolant", "pare-vapeur", "plaque", "laine"] }] },
      { k: "Travaux", items: [{ t: "Reprise du raccord (abergement) — cause, pas forcément garantie ; remplacement local plaque + isolant mouillé ; peinture du pan", kw: ["reprise", "abergement", "remplacement local", "isolant"] }] }
    ],
    dangers: [
      { t: "Accepter la réfection complète du versant pour une infiltration ponctuelle", kw: ["refaire la toiture", "toiture complete", "tout le versant"] },
      { t: "Qualifier en tempête sans événement climatique", kw: ["tempete"] }
    ],
    expert: ["Photos extérieures de l'abergement (drone, perche, couvreur)", "Date de réception de la maison", "État de l'isolant au droit de la tache", "Lien systématique avec la pluie"],
    chaine: { origine: "Raccord de fenêtre de toit", dommages: "Plaque et isolant du rampant", verifications: "Abergement, lien pluie, isolant, date de réception", travaux: "Reprise raccord (cause) + plaque, isolant, peinture", chiffrage: "Couvreur Ft ; plaque m² ; isolant m² ; peinture m²", assurance: "Selon contrat (infiltration) ; pas tempête ; décennale à vérifier selon réception" }
  },
  {
    id: "infil-facade", titre: "Mur intérieur humide côté ouest", tag: "Infiltration façade", niveau: 3,
    notions: ["fuite-infiltration", "facade", "mur-ext", "baie", "garantie-franchise"],
    enonce: "Appartement au 2e étage. Après les pluies d'automne avec vent d'ouest, le doublage du mur de façade du séjour présente une tache en partie basse, sous la fenêtre. L'enduit extérieur présente des fissures. Le syndic dit que « c'est privatif ». <b>Analyse ?</b>",
    grille: [
      { k: "Qualification", items: [{ t: "Infiltration par la façade et/ou la menuiserie (appui, calfeutrement, drainage), corrélée à la pluie battante", kw: ["infiltration", "facade", "pluie battante", "appui", "calfeutrement", "drainage"] }] },
      { k: "Hypothèses", items: [{ t: "Au moins 2 hypothèses : fissures d'enduit / appui-rejingot / calfeutrement / condensation", kw: ["hypothese", "rejingot", "condensation", "enduit"] }] },
      { k: "Responsabilités", items: [{ t: "La façade (gros œuvre) est en principe une partie commune : contester l'affirmation du syndic, vérifier le règlement ; la menuiserie peut être privative", kw: ["partie commune", "syndic", "reglement", "menuiserie privative", "gros oeuvre"] }] },
      { k: "Garantie", items: [{ t: "Infiltrations par façade souvent exclues de la garantie DDE de la MRH, mais couvertes côté immeuble selon contrats", kw: ["exclu", "mri", "assurance de l'immeuble", "contrat"] }] },
      { k: "Étendue / travaux", items: [{ t: "Doublage : contrôler isolant et plaque ; réparer la cause en façade (copro) avant les embellissements", kw: ["isolant", "doublage", "cause", "avant les embellissements", "d'abord"] }] }
    ],
    dangers: [
      { t: "Refaire les embellissements avant que la cause en façade soit traitée", kw: ["repeindre", "refaire la peinture"] },
      { t: "Accepter « c'est privatif » sans vérifier le règlement de copropriété", kw: ["privatif"] }
    ],
    expert: ["Exposition (vent dominant) et corrélation pluie", "Inspection appui / rejingot / larmier / drainage", "Fissures d'enduit traversantes ?", "Règlement de copropriété"],
    chaine: { origine: "Façade et/ou menuiserie", dommages: "Doublage du séjour", verifications: "Hypothèses façade/menuiserie/condensation, règlement copro", travaux: "Cause (façade, copro) puis plaque/isolant/peinture", chiffrage: "Selon atteinte du doublage", assurance: "MRI copro pour la façade ; MRH selon contrat" }
  },
  {
    id: "parquet-lv", titre: "Parquet contrecollé gonflé dans la cuisine ouverte", tag: "Revêtement de sol", niveau: 3,
    notions: ["sols", "etendue", "chaine-chiffrage", "vetuste", "carbone-incorpore"],
    enonce: "Le tuyau de vidange du lave-vaisselle s'est déboîté. Un parquet contrecollé posé flottant (8 ans) dans une pièce de 35 m² (cuisine ouverte sur séjour, pose continue) présente un tuilage sur 6 m² près de la cuisine. L'assuré demande le remplacement des 35 m² ; le modèle existe encore. <b>Ta position et ton chiffrage ?</b>",
    grille: [
      { k: "Origine", items: [{ t: "Évacuation du lave-vaisselle (déboîtement) : fuite à l'usage", kw: ["evacuation", "vidange", "deboit", "usage"] }] },
      { k: "Séchage / diagnostic", items: [{ t: "Mesurer l'humidité, laisser sécher : un tuilage peut partiellement se résorber ; vérifier la sous-couche et la chape", kw: ["secher", "sechage", "humidit", "sous-couche", "chape"] }] },
      { k: "Étendue", items: [{ t: "Modèle disponible : remplacement localisé possible des lames abîmées (pose flottante démontable) ; 35 m² seulement si raccord impossible", kw: ["localis", "lames", "modele disponible", "raccord", "6 m"] }] },
      { k: "Chiffrage", items: [{ t: "Dépose/repose des lames, fourniture avec chutes, plinthes ml, déplacement mobilier Ft", kw: ["depose", "chute", "plinthe", "mobilier", "ml"] }] },
      { k: "Vétusté", items: [{ t: "Appliquer une vétusté sur le revêtement (8 ans)", kw: ["vetuste"] }] },
      { k: "Carbone", items: [{ t: "Réparation localisée = moins de carbone et de déchets que 35 m² neufs", kw: ["carbone", "dechet", "reemploi"] }] }
    ],
    dangers: [{ t: "Accorder 35 m² alors que le modèle est disponible et la réparation localisée possible", kw: ["35 m", "toute la piece"] }],
    expert: ["Disponibilité de la référence", "Possibilité de démonter jusqu'à la zone (pose flottante)", "Sous-couche / chape humide ?", "Factures d'achat (âge)"],
    chaine: { origine: "Vidange lave-vaisselle déboîtée", dommages: "6 m² de contrecollé tuilé", verifications: "Séchage, référence, sous-couche", travaux: "Remplacement localisé des lames", chiffrage: "≈ 6-8 m² fourniture (+ chutes) + main-d'œuvre démontage/remontage", assurance: "MRH DDE, vétusté 8 ans" },
    chiffrage: { tva: 10, franchise: 150, note: "Prix indicatifs fournis par l'énoncé. Vétusté contrecollé 8 ans / durée de vie 25 ans ≈ 32 %.", lignes: [
      { d: "Déplacement et protection du mobilier", u: "Ft", q: 1, pu: 150, v: 0, calc: "Forfait" },
      { d: "Démontage des lames jusqu'à la zone sinistrée", u: "m²", q: 10, pu: 12, v: 0, calc: "Zone 6 m² + accès" },
      { d: "Fourniture contrecollé (+ 10 % chutes)", u: "m²", q: 6.6, pu: 55, v: 32, calc: "6 × 1,10" },
      { d: "Repose des lames (anciennes + neuves)", u: "m²", q: 10, pu: 22, v: 0, calc: "Zone démontée" },
      { d: "Plinthes", u: "ml", q: 4, pu: 12, v: 32, calc: "Linéaire de la zone" },
      { d: "Évacuation déchets", u: "Ft", q: 1, pu: 60, v: 0, calc: "Forfait" }] }
  },
  {
    id: "ba13-sdb", titre: "Cloison de salle de bains détrempée", tag: "Plaques de plâtre", niveau: 3,
    notions: ["ba13-dde", "cloison", "isolants", "ba13-types", "chaine-chiffrage"],
    enonce: "Fuite sur l'alimentation encastrée de la douche, réparée. La cloison 72/48 entre salle de bains (faïence) et chambre (peinture) est mouillée sur 1,20 m de large et 80 cm de haut. Côté chambre, la plaque est molle en pied et la peinture cloque. <b>Que prévois-tu ?</b>",
    grille: [
      { k: "Diagnostic", items: [{ t: "Plaque molle = perte de cohésion → remplacement côté chambre ; vérifier l'isolant et l'ossature", kw: ["molle", "remplacement", "isolant", "ossature", "rail"] }] },
      { k: "Côté salle de bains", items: [{ t: "Faïence : vérifier la plaque derrière (sonner, humidimètre) ; si saine, conserver", kw: ["faience", "derriere", "conserver", "saine"] }] },
      { k: "Mode opératoire", items: [{ t: "Découpe à l'axe des montants, remplacement isolant mouillé, plaque (hydrofuge si local humide), bandes, enduit, impression, peinture du pan", kw: ["axe des montants", "bande", "enduit", "impression", "hydrofuge"] }] },
      { k: "Séchage", items: [{ t: "Séchage contrôlé avant refermeture", kw: ["sechage", "secher", "humidimetre"] }] },
      { k: "Chiffrage", items: [{ t: "Plaque m², isolant m², bandes/enduit, peinture du pan entier m², plinthe ml", kw: ["m2", "m²", "ml", "pan"] }] }
    ],
    dangers: [
      { t: "Se contenter d'une peinture sur plaque molle", kw: ["juste peindre", "peinture seule", "simple peinture"] },
      { t: "Refermer sans contrôler l'isolant et le séchage", kw: [] }
    ],
    expert: ["Fermeté de la plaque (doigt, tournevis)", "État de la laine (tassée ?)", "Rails bas rouillés ?", "Moisissures côté intérieur"],
    chaine: { origine: "Alimentation encastrée de la douche", dommages: "Plaque côté chambre, isolant, peinture", verifications: "Fermeté, isolant, ossature, côté faïence", travaux: "Remplacement partiel + finitions du pan", chiffrage: "≈ 1 m² de plaque, isolant, joints, peinture du pan (≈ 3,5 × 2,5 m)", assurance: "DDE MRH ; réparation du tuyau non garantie en principe" }
  },
  {
    id: "peinture-cloquee", titre: "Peinture cloquée en pied de mur, maison ancienne", tag: "Humidité", niveau: 3,
    notions: ["capillarite", "bati-ancien", "diag", "garantie-franchise"],
    enonce: "Maison en pierre de 1890. L'assuré déclare un « dégât des eaux » : la peinture cloque et des traces blanches apparaissent sur le bas des murs du rez-de-chaussée, sur tout le pourtour du séjour, jusqu'à 60 cm de haut. Il a refait la peinture (acrylique) il y a un an. Pas de canalisation dans ces murs. <b>Ton analyse ?</b>",
    grille: [
      { k: "Qualification", items: [{ t: "Remontées capillaires (frange régulière, sels, bâti ancien), aggravées par une peinture fermée", kw: ["capillar", "salpetre", "sels", "remontee"] }] },
      { k: "Hypothèses écartées", items: [{ t: "Fuite peu probable (pas de réseau, sur tout le pourtour) ; vérifier quand même extérieur (EP, sol, enduit ciment)", kw: ["pas de fuite", "pas de canalisation", "enduit ciment", "eaux pluviales", "gouttiere"] }] },
      { k: "Garantie", items: [{ t: "Phénomène progressif, non accidentel : en principe pas un dégât des eaux garanti", kw: ["non accidentel", "progressif", "pas garanti", "exclu", "non garanti"] }] },
      { k: "Conseil", items: [{ t: "Conseils : enduits et peintures perméables (chaux), gestion des eaux au pied du mur, ventilation", kw: ["chaux", "permeable", "respir", "ventil"] }] }
    ],
    dangers: [{ t: "Indemniser comme un dégât des eaux accidentel sans démontrer d'événement", kw: ["indemniser", "garanti"] }],
    expert: ["Hauteur et régularité de la frange", "Humidité décroissante avec la hauteur", "État extérieur : enduit, sol, gouttières", "Historique (récurrent chaque année ?)"],
    chaine: { origine: "Sol (capillarité)", dommages: "Peinture cloquée, sels", verifications: "Profil d'humidité, extérieur, réseaux", travaux: "Traitement de fond (hors assurance), finitions perméables", chiffrage: "Sans objet en indemnité si non garanti", assurance: "Non accidentel → généralement non garanti" }
  },
  {
    id: "moisissures-fenetres", titre: "Moisissures après changement des fenêtres", tag: "Condensation", niveau: 2,
    notions: ["condensation", "ventilation-defaut", "renov-interfaces", "vmc"],
    enonce: "Locataire d'un T3 (immeuble 1978) : depuis le remplacement des fenêtres par le bailleur l'an dernier, moisissures noires dans les angles hauts des chambres et sur les joints de la salle de bains, buée sur les vitres le matin. Elle déclare un dégât des eaux. <b>Qualification et conseils ?</b>",
    grille: [
      { k: "Qualification", items: [{ t: "Condensation par défaut de renouvellement d'air (fenêtres étanches sans entrées d'air ?)", kw: ["condensation", "ventilation", "entree d'air", "entrees d'air", "renouvellement"] }] },
      { k: "Vérifications", items: [{ t: "Entrées d'air sur les nouvelles fenêtres, bouches d'extraction (fonctionnent ?), détalonnage, hygrométrie, chauffage", kw: ["entree", "bouche", "vmc", "detalonnage", "hygrometr", "chauffage"] }] },
      { k: "Garantie", items: [{ t: "Pas un dégât des eaux accidentel ; peut relever de la décence / responsabilité du bailleur (ventilation, arrêté 1982)", kw: ["pas un degat", "non accidentel", "bailleur", "decence", "1982"] }] },
      { k: "Conseils", items: [{ t: "Aérer, ne pas boucher les entrées d'air, éloigner les meubles des murs froids, chauffer régulièrement", kw: ["aerer", "meuble", "ne pas boucher", "chauffer"] }] }
    ],
    dangers: [{ t: "Conclure à une infiltration ou une fuite sans élément", kw: ["infiltration", "fuite"] }],
    expert: ["Présence d'entrées d'air sur les menuiseries", "Fonctionnement de la VMC (test feuille)", "Taux d'humidité intérieur", "Mode d'occupation (séchage du linge)"],
    chaine: { origine: "Vapeur intérieure non évacuée", dommages: "Moisissures, buée", verifications: "Ventilation, entrées d'air, hygrométrie", travaux: "Rétablir la ventilation (bailleur) ; nettoyage", chiffrage: "Hors indemnisation DDE en principe", assurance: "Non accidentel ; question bailleur / décence" }
  },
  {
    id: "fissure-ete", titre: "Fissures après un été sec, sans arrêté", tag: "Fissuration", niveau: 3,
    notions: ["fissures", "rga", "catnat", "garanties-construction"],
    enonce: "Maison individuelle réceptionnée en 2019. Après l'été, fissures en escalier à l'angle nord-est (jusqu'à 2 mm) et portes qui frottent. La commune a déposé une demande de reconnaissance CatNat, pas encore d'arrêté. L'assuré veut faire reboucher et repeindre. <b>Comment raisonnes-tu ?</b>",
    grille: [
      { k: "Qualification", items: [{ t: "Mouvement de fondation (tassement différentiel), hypothèse sécheresse / argiles", kw: ["tassement", "fondation", "argile", "secheresse", "rga"] }] },
      { k: "Garanties possibles", items: [{ t: "CatNat seulement si arrêté publié (déclaration 30 j après) ; maison < 10 ans : piste décennale / DO si atteinte à la solidité ou impropriété", kw: ["arrete", "catnat", "30 jours", "decennale", "do", "dommages-ouvrage", "reception"] }] },
      { k: "Vérifications", items: [{ t: "Suivi par jauges, étude G5, fondations, réseaux enterrés, végétation", kw: ["jauge", "g5", "etude", "reseau", "arbre", "vegetation"] }] },
      { k: "Travaux", items: [{ t: "Ne pas reboucher avant d'avoir traité la cause (risque de réapparition, perte de preuves)", kw: ["ne pas reboucher", "cause d'abord", "pas reboucher", "avant de reboucher"] }] }
    ],
    dangers: [
      { t: "Valider un simple rebouchage-peinture", kw: ["reboucher et repeindre", "simple rebouchage"] },
      { t: "Affirmer que la CatNat s'applique sans arrêté", kw: ["catnat s'applique"] }
    ],
    expert: ["Évolution des fissures", "Profondeur des fondations / nature du sol", "Date de réception (2019 → dans les 10 ans)", "Suivi de la publication de l'arrêté"],
    chaine: { origine: "Mouvement de sol probable", dommages: "Fissures structurelles, menuiseries", verifications: "Jauges, G5, réseaux, végétation", travaux: "Selon étude : reprise en sous-œuvre éventuelle, puis finitions", chiffrage: "Après étude", assurance: "CatNat si arrêté ; DO / décennale (maison 2019) à examiner" }
  },
  {
    id: "orage-elec", titre: "Appareils hors service après un orage", tag: "Dommage électrique", niveau: 2,
    notions: ["elec", "vetuste", "garantie-franchise"],
    enonce: "Après un orage, un assuré déclare : box internet, téléviseur (6 ans), lave-linge (11 ans) et portail motorisé hors service. Il fournit des factures de remplacement à neuf. <b>Que demandes-tu et comment évalues-tu ?</b>",
    grille: [
      { k: "Garantie", items: [{ t: "Vérifier l'existence de la garantie dommages électriques (souvent spécifique / option) et ses limites", kw: ["garantie dommages electriques", "option", "plafond", "contrat"] }] },
      { k: "Preuve de la cause", items: [{ t: "Attestation / rapport du réparateur : cause surtension, réparable ou non", kw: ["attestation", "rapport", "reparateur", "surtension"] }] },
      { k: "Évaluation", items: [{ t: "Réparation si possible, sinon remplacement avec vétusté selon âge ; box souvent propriété du fournisseur", kw: ["reparation", "vetuste", "age", "fournisseur", "box"] }] },
      { k: "Cohérence", items: [{ t: "Orage confirmé (date, météo, foudroiement), plusieurs appareils touchés simultanément = cohérent", kw: ["meteo", "foudre", "date", "coherent"] }] }
    ],
    dangers: [{ t: "Rembourser à neuf sans vétusté ni attestation de cause", kw: ["a neuf", "rembourser les factures"] }],
    expert: ["Attestation de cause", "Âge et valeur des appareils", "Propriété de la box", "Plafond de la garantie"],
    chaine: { origine: "Surtension (foudre)", dommages: "4 équipements", verifications: "Attestation réparateur, âges, propriété", travaux: "Réparation ou remplacement", chiffrage: "Valeur de remplacement − vétusté − franchise", assurance: "Garantie dommages électriques (si souscrite)" }
  },
  {
    id: "feu-cuisine", titre: "Petit incendie de cuisine", tag: "Incendie", niveau: 2,
    notions: ["incendie", "conservatoires", "etendue", "chaine-chiffrage"],
    enonce: "Une casserole a pris feu sur la plaque de cuisson. La hotte et le meuble haut au-dessus ont brûlé ; le plafond de la cuisine (12 m²) est noirci ; une odeur de fumée persiste dans le séjour attenant. Personne n'est blessé. <b>Ta démarche ?</b>",
    grille: [
      { k: "Sécurité / conservatoire", items: [{ t: "Sécurité électrique (contrôle avant remise en service), aération, nettoyage rapide des suies", kw: ["electri", "securite", "suies", "nettoyage", "aerer"] }] },
      { k: "Origine", items: [{ t: "Feu d'origine domestique (casserole) : pas de tiers responsable a priori ; conserver les éléments si doute sur un appareil", kw: ["casserole", "pas de recours", "pas de tiers", "appareil"] }] },
      { k: "Étendue", items: [{ t: "Hotte, meuble haut, plafond cuisine ; séjour : nettoyage / désodorisation, pas forcément peinture", kw: ["hotte", "meuble haut", "plafond", "odeur", "desodor"] }] },
      { k: "Chiffrage", items: [{ t: "Nettoyage technique, impression bloquante suie, peinture plafond (m²), remplacement hotte (U) et meuble (U)", kw: ["impression", "m2", "m²", "u", "nettoyage"] }] },
      { k: "Garantie", items: [{ t: "Garantie incendie ; vétusté sur hotte et meubles ; franchise", kw: ["incendie", "vetuste", "franchise"] }] }
    ],
    dangers: [{ t: "Repeindre directement sans nettoyer / bloquer les suies", kw: ["repeindre directement"] }],
    expert: ["État de l'installation électrique", "Âge de la cuisine", "Extension des fumées", "Disponibilité du meuble"],
    chaine: { origine: "Casserole sur plaque", dommages: "Hotte, meuble, plafond, odeurs", verifications: "Électricité, extension des suies", travaux: "Nettoyage, remplacements, peinture", chiffrage: "U + m² + Ft", assurance: "Incendie MRH, vétusté, franchise" }
  },
  {
    id: "chauffe-eau-placard", titre: "Chauffe-eau qui fuit dans un placard", tag: "Plomberie", niveau: 3,
    notions: ["chauffe-eau", "origine-cause", "sols", "responsabilites"],
    enonce: "Appartement loué. Le chauffe-eau (14 ans) installé dans un placard du couloir fuit : eau au sol, parquet massif du couloir tuilé sur 3 m². L'eau suinte sous la cuve, pas au groupe de sécurité. <b>Ton analyse ?</b>",
    grille: [
      { k: "Cause", items: [{ t: "Cuve percée par corrosion (vétusté de l'appareil)", kw: ["cuve", "corrosion", "percee", "vetuste"] }] },
      { k: "Responsabilités", items: [{ t: "Remplacement du chauffe-eau : vétusté → bailleur (pas une réparation locative) ; non indemnisé comme dommage", kw: ["bailleur", "proprietaire", "pas garanti", "remplacement du chauffe-eau"] }] },
      { k: "Dommages", items: [{ t: "Parquet massif : séchage contrôlé puis ponçage / vitrification si les lames se stabilisent ; remplacement local si déformation persistante", kw: ["sechage", "poncage", "vitrification", "massif"] }] },
      { k: "Voisin", items: [{ t: "Vérifier le logement du dessous", kw: ["dessous", "voisin"] }] }
    ],
    dangers: [{ t: "Indemniser le chauffe-eau neuf comme un dommage", kw: ["remplacer le chauffe-eau par l'assur", "indemniser le chauffe-eau"] }],
    expert: ["Localisation exacte de la fuite (cuve vs raccords vs groupe)", "Âge de l'appareil", "Humidité du parquet et de la chape", "Logement du dessous"],
    chaine: { origine: "Cuve du chauffe-eau", dommages: "Parquet massif 3 m², éventuellement voisin", verifications: "Point de fuite, humidité, voisin", travaux: "Séchage, ponçage/vitrification ou remplacement local", chiffrage: "m² parquet ; appareil hors indemnité", assurance: "Dommages : MRH ; appareil : bailleur" }
  },
  {
    id: "vmc-goutte", titre: "Eau qui goutte d'une bouche de VMC", tag: "VMC / condensation", niveau: 3,
    notions: ["vmc", "condensation", "pare-vapeur", "fuite-infiltration"],
    enonce: "Maison de plain-pied, combles perdus. En janvier, de l'eau goutte régulièrement de la bouche d'extraction de la salle de bains et a taché le plafond autour. L'assuré pense à une fuite de toiture. <b>Hypothèses et vérifications ?</b>",
    grille: [
      { k: "Hypothèses", items: [{ t: "Condensation dans la gaine VMC non isolée en combles froids (hypothèse prioritaire) ; infiltration de toiture par la sortie de toit (à vérifier)", kw: ["condensation", "gaine", "non isole", "sortie de toit", "infiltration"] }] },
      { k: "Vérifications", items: [{ t: "Gaine isolée ? pente, points bas ? lien avec la pluie ou avec le froid / les douches ?", kw: ["gaine", "isol", "pente", "pluie", "froid", "douche"] }] },
      { k: "Garantie", items: [{ t: "Condensation dans un réseau mal installé : plutôt défaut d'installation / entretien que DDE accidentel (selon contrat)", kw: ["defaut d'installation", "pas accidentel", "non accidentel", "contrat"] }] }
    ],
    dangers: [{ t: "Conclure directement à une fuite de toiture", kw: ["fuite de toiture"] }],
    expert: ["Photos de la gaine en combles", "Corrélation avec la pluie ou le froid", "Sortie de toit / chapeau"],
    chaine: { origine: "Vapeur extraite condensant dans la gaine", dommages: "Plafond autour de la bouche", verifications: "Isolation de la gaine, lien pluie/froid", travaux: "Gaine isolée (hors indemnité) + plafond", chiffrage: "Plafond m² si garanti", assurance: "Selon contrat ; plutôt défaut d'installation" }
  }
];
