// Page Entretien : processus annoncé par le recruteur (poste de Télé-Expert / Expert sinistre bâtiment, assurance habitation).
window.ENTRETIEN = {
  process: [
    { t: "Test écrit / QCM (~80 questions)", d: "Thèmes annoncés : réglementation, matériaux et systèmes constructifs, supports intérieurs/extérieurs, toiture, carbone/environnement, vocabulaire, chiffrage, logique d'expertise. → Entraînez-vous avec l'examen blanc 80 questions." },
    { t: "Entretien avec le manager", d: "Technique et raisonnement : cas de sinistre à l'oral, questions à poser à un assuré au téléphone, organisation d'une journée de télé-expertise, rigueur, rédaction." },
    { t: "Entretien RH", d: "Motivation, parcours (architecte → expertise), posture relationnelle, conditions (horaires, sédentarité plateau, objectifs de production, formation)." }
  ],
  questions: [
    { cat: "Motivation", q: "Présentez-vous.",
      a: "2 minutes : formation d'architecte → ce qu'elle vous apporte (lecture des ouvrages, plans, raisonnement, rapport aux entreprises) → pourquoi l'expertise sinistre maintenant → ce que vous apportez au poste (rigueur, pédagogie, sens du client). Reconnaissez avec simplicité ce que vous consolidez (technique fine, assurance)." },
    { cat: "Motivation", q: "Pourquoi passer de l'architecture à l'expertise sinistre ?",
      a: "Même matière (le bâtiment), autre angle : diagnostic, causalité, chiffrage, relation avec des personnes en difficulté. Variété des dossiers, utilité concrète, rythme soutenu. Évitez de dénigrer l'architecture." },
    { cat: "Motivation", q: "Pourquoi la télé-expertise plutôt que l'expertise terrain ?",
      a: "Traitement rapide et efficace des sinistres simples, volume de dossiers, apprentissage accéléré de nombreux cas, outils numériques (visio, photos). Montrer que vous savez qu'il faut savoir poser les bonnes questions et reconnaître quand une visite est nécessaire." },
    { cat: "Métier", q: "Qu'est-ce qu'un télé-expert ?",
      a: "Un expert qui instruit et évalue les sinistres à distance (téléphone, visio, photos, devis), qualifie l'origine et la cause, donne un avis sur la garantie, chiffre les dommages, prépare les recours et oriente vers une expertise sur place si nécessaire." },
    { cat: "Métier", q: "Un assuré vous appelle pour une tache au plafond. Déroulez votre entretien téléphonique.",
      a: "Sécurité / mesures conservatoires → chronologie (quand, depuis quand, évolue ?) → lien avec la pluie ou l'usage d'eau → ce qu'il y a au-dessus → actions faites (plombier, voisin, syndic) → pièces à transmettre (photos larges et détaillées, dimensions, constat, facture, devis) → explication des étapes suivantes." },
    { cat: "Métier", q: "Comment distinguez-vous une fuite, une infiltration et une condensation ?",
      a: "Fuite : réseau (permanent si alimentation, à l'usage si évacuation). Infiltration : liée à la pluie, à l'exposition. Condensation : diffuse, saisonnière (hiver), angles et parois froides, lien avec la ventilation. Toujours vérifier plutôt que conclure sur l'aspect." },
    { cat: "Métier", q: "Quand basculez-vous d'une télé-expertise vers une visite ?",
      a: "Cause incertaine après questions et photos, suspicion structurelle (fissures actives, charpente), montant important, incohérences / suspicion de fraude, nécessité d'investigations (recherche de fuite)." },
    { cat: "Métier", q: "Comment vérifiez-vous un devis transmis par l'assuré ?",
      a: "Ligne par ligne : chaque poste correspond-il à un dommage constaté ? Unités cohérentes (m², ml, U, Ft) ? Quantités cohérentes avec le métré ? Pas d'amélioration ? Postes oubliés (préparation, protection) ? Prix dans les usages ? TVA adaptée ?" },
    { cat: "Situation", q: "Un assuré conteste la vétusté appliquée.",
      a: "Écouter, reformuler, expliquer le principe indemnitaire et le calcul, rappeler la vétusté récupérable sur factures si le contrat le prévoit, réexaminer sur justificatifs (factures d'origine). Rester factuel et courtois ; tracer l'échange." },
    { cat: "Situation", q: "Un assuré très énervé vous reproche la lenteur du dossier.",
      a: "Laisser parler, reconnaître la gêne, faire le point précis (ce qui manque, qui doit agir), donner une prochaine étape datée, tenir l'engagement." },
    { cat: "Situation", q: "Vous détectez une incohérence (dommage ancien présenté comme récent).",
      a: "Rester neutre : décrire les faits objectifs (contours multiples, factures, dates), demander des justificatifs, ne pas accuser, informer le gestionnaire qui décide." },
    { cat: "Organisation", q: "Vous traitez de nombreux dossiers par jour. Comment vous organisez-vous ?",
      a: "Priorisation (urgences, mesures conservatoires, délais), trames d'appel, saisie au fil de l'eau, relances planifiées, regroupement des tâches similaires, rédaction concise et standardisée." },
    { cat: "Personnalité", q: "Vos points faibles ?",
      a: "Un point réel et un plan d'action. Ex. : « Mes connaissances techniques fines sont encore en construction — je me suis organisée pour les consolider (fiches, cas) et je sais vérifier avant d'affirmer. »" },
    { cat: "Personnalité", q: "Comment réagissez-vous quand vous ne connaissez pas la réponse technique ?",
      a: "Je ne devine pas : je formule des hypothèses, je vérifie (DTU, collègue, documentation), je demande les éléments manquants. C'est une qualité attendue d'un expert." }
  ],
  aPoser: [
    "Comment est organisée la formation des nouveaux télé-experts (tutorat, durée) ?",
    "Combien de dossiers traite un télé-expert par jour en moyenne, et quels types (DDE, bris de glace, électrique…) ?",
    "Quels outils utilisez-vous (visio-expertise, logiciel de chiffrage, bases de prix) ?",
    "Comment se fait le lien avec les experts terrain quand une visite est nécessaire ?",
    "Quelles sont les perspectives d'évolution (expertise terrain, spécialisation construction) ?"
  ],
  checklist: [
    "Pitch de 2 minutes répété à voix haute",
    "3 exemples STAR (problème technique, relation difficile, forte charge)",
    "Chaîne Origine → dommages → vérifications → travaux → chiffrage → assurance",
    "Unités : m², ml, m³, U, Ft",
    "Fuite / infiltration / condensation / capillarité : 1 symptôme typique chacune",
    "Coupe toiture : tuile → liteau → contre-liteau → écran → chevron → panne",
    "IRSI : occupant gestionnaire ; 1 600 / 5 000 € HT",
    "GPA 1 an / biennale 2 ans / décennale 10 ans à partir de la réception",
    "3 questions à poser",
    "Pièce d'identité, CV imprimé, de quoi noter"
  ],
  star: [
    ["S — Situation", "Le contexte : où, quand, avec qui."],
    ["T — Tâche", "Votre rôle, l'objectif ou le problème."],
    ["A — Action", "Ce que VOUS avez fait (« je »)."],
    ["R — Résultat", "Le résultat et ce que vous en avez appris."]
  ],
  rapport: [
    ["1. Références", "N° de sinistre, assuré, adresse, date du sinistre, contrat et garanties."],
    ["2. Circonstances", "Récit factuel, chronologie."],
    ["3. Constatations", "Dommages, localisation, mesures, photos."],
    ["4. Origine et cause", "Hypothèses, vérifications, conclusion argumentée."],
    ["5. Avis sur la garantie", "Rattachement au contrat, exclusions éventuelles (avis : la décision appartient à l'assureur)."],
    ["6. Évaluation", "Métré, postes, prix, vétusté, franchise, indemnité immédiate / différée."],
    ["7. Recours", "Responsable, assureur, convention applicable."],
    ["8. Conclusion", "Synthèse et suites à donner."]
  ]
};
