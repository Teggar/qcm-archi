// Contenu de la page Entretien
window.ENTRETIEN = {
  process: [
    { t: "Préqualification téléphonique (RH)", d: "15 à 30 min : parcours, motivation, mobilité géographique, permis B, disponibilité, prétentions salariales. Préparez votre pitch de 2 minutes." },
    { t: "Tests / QCM", d: "Questionnaires techniques (bâtiment, pathologies, assurance construction et IARD), parfois tests de logique ou de personnalité, et exercice écrit (rédaction d'un compte rendu, chiffrage d'un petit sinistre). Entraînez-vous avec les QCM et les mises en situation de ce site." },
    { t: "Entretien avec le manager (responsable d'agence / technique)", d: "Questions techniques orales, cas pratiques, posture face à l'assuré, organisation d'un portefeuille de dossiers, travail en autonomie et sur la route." },
    { t: "Éventuel second entretien / direction", d: "Validation de l'adéquation culturelle, du projet professionnel et des conditions (véhicule, secteur, formation interne)." },
    { t: "Proposition et intégration", d: "Période de formation et d'accompagnement par un expert confirmé (tutorat) avant de gérer son propre portefeuille." }
  ],
  questions: [
    { cat: "Motivation", q: "Présentez-vous.",
      a: "Pitch de 2 minutes : (1) formation et expériences clés dans le bâtiment / l'assurance, (2) compétences techniques transférables (pathologies, métré, chiffrage, lecture de plans), (3) qualités relationnelles, (4) pourquoi l'expertise sinistre maintenant. Terminez par ce que vous apportez au poste." },
    { cat: "Motivation", q: "Pourquoi le métier d'expert sinistre ?",
      a: "Variété des dossiers (aucun sinistre ne se ressemble), terrain + analyse technique + dimension juridique, rôle utile auprès de personnes en difficulté, autonomie. Appuyez-vous sur une expérience concrète (chantier, malfaçon, sinistre vécu)." },
    { cat: "Motivation", q: "Pourquoi Saretec ?",
      a: "Renseignez-vous sur le site et les actualités du groupe : acteur majeur de l'expertise après sinistre en France, couverture nationale, diversité des marchés (IARD, construction, RC…), formation interne. Citez un élément précis (engagement environnemental, innovation, valeurs) et reliez-le à votre projet." },
    { cat: "Motivation", q: "Où vous voyez-vous dans 5 ans ?",
      a: "Expert autonome sur un portefeuille de dossiers, spécialisé (construction / DO, gros dommages…), éventuellement tuteur de nouveaux experts. Montrer de l'ambition réaliste et l'envie de rester." },
    { cat: "Métier", q: "Quelle est la différence entre un expert d'assurance, un expert d'assuré et un expert judiciaire ?",
      a: "Expert d'assurance : mandaté par l'assureur. Expert d'assuré : mandaté par l'assuré pour défendre ses intérêts. Expert judiciaire : désigné par le juge, inscrit sur une liste de cour d'appel, au service de la justice. Dans tous les cas : impartialité et rigueur technique." },
    { cat: "Métier", q: "Décrivez les étapes de traitement d'un dossier.",
      a: "Réception de la mission → prise de contact rapide avec l'assuré (et convocation des parties) → visite : constatations, photos, métré, causes → avis sur la garantie → évaluation (devis, chiffrage, vétusté) → accord de l'assuré (lettre d'acceptation) → rapport au mandant → préservation des recours. Le tout dans les délais (conventions, DO)." },
    { cat: "Métier", q: "Comment déterminez-vous l'origine d'une infiltration ?",
      a: "Observation (localisation, forme des auréoles, évolution avec la pluie), mesures d'humidité, inspection de l'enveloppe (toiture, relevés, menuiseries, joints, EP), tests (mise en eau, fluorescéine, caméra thermique), recherche de fuite si besoin. Hypothèses éliminées une à une." },
    { cat: "Métier", q: "Expliquez la différence entre GPA, biennale et décennale.",
      a: "GPA : 1 an, tous désordres signalés, à la charge de l'entrepreneur. Biennale : 2 ans, éléments d'équipement dissociables. Décennale : 10 ans, dommages compromettant la solidité ou rendant impropre à la destination. Toutes courent à partir de la réception." },
    { cat: "Métier", q: "Qu'est-ce que la convention IRSI ?",
      a: "Convention entre assureurs (depuis le 1er juin 2018) pour les dégâts des eaux et incendies en immeuble jusqu'à 5 000 € HT par local. Assureur gestionnaire = assureur de l'occupant. Tranche 1 ≤ 1 600 € HT sans recours ; tranche 2 de 1 600 à 5 000 € HT avec expertise pour compte commun et recours." },
    { cat: "Situation", q: "Un assuré est en détresse après l'incendie de sa maison. Comment réagissez-vous ?",
      a: "Empathie et disponibilité, priorités concrètes : sécurité, relogement (garanties frais de relogement), mesures conservatoires, acompte si possible. Expliquer clairement les prochaines étapes et délais, rester joignable. Ne pas promettre ce qui ne dépend pas de vous." },
    { cat: "Situation", q: "Un assuré conteste votre évaluation.",
      a: "Écouter, reformuler, réexpliquer le calcul avec les pièces, accepter de réexaminer sur justificatifs, rappeler les voies (expert d'assuré, tierce expertise, médiateur). Tracer par écrit. (Voir la mise en situation « Assuré mécontent ».)" },
    { cat: "Situation", q: "Une entreprise vous propose une contrepartie pour valider son devis.",
      a: "Refus net, information de votre hiérarchie. L'indépendance et l'intégrité sont la base du métier ; toute compromission met en danger l'assuré, l'assureur et le cabinet." },
    { cat: "Situation", q: "Vous suspectez une fraude (sinistre provoqué, dommages anciens).",
      a: "Rester factuel : constater, photographier, recueillir des éléments objectifs (dates, factures, témoignages), ne pas accuser l'assuré. Informer le mandant qui décidera des suites (enquête, refus)." },
    { cat: "Organisation", q: "Comment gérez-vous un portefeuille de 80 à 100 dossiers ?",
      a: "Priorisation (urgences, délais conventionnels / DO, montants), planification des tournées par secteur, relances programmées, outils de gestion, rédaction des rapports au fil de l'eau, communication proactive avec les mandants." },
    { cat: "Organisation", q: "Êtes-vous mobile ? Acceptez-vous les renforts lors d'événements climatiques ?",
      a: "Le métier implique beaucoup de route sur un secteur et, lors d'événements majeurs (tempête, grêle, inondations, sécheresse), des renforts dans d'autres régions. Répondez honnêtement et montrez de la flexibilité." },
    { cat: "Personnalité", q: "Vos points forts et points faibles ?",
      a: "Points forts liés au poste : rigueur, sens du contact, capacité d'analyse, résistance au stress. Point faible réel mais maîtrisé, avec l'action corrective (ex. « j'ai tendance à trop détailler mes rapports, j'utilise maintenant des trames »)." },
    { cat: "Personnalité", q: "Quelles sont vos prétentions salariales ?",
      a: "Renseignez-vous en amont (offres comparables, convention collective applicable, niveau junior/confirmé). Donnez une fourchette et parlez du package : véhicule de fonction, frais, variable, formation." }
  ],
  aPoser: [
    "Comment se déroule la formation / l'intégration d'un nouvel expert ? Y a-t-il un tutorat ?",
    "Quel est le secteur géographique et le volume moyen de dossiers par expert ?",
    "Quelle est la répartition des types de missions (IARD, construction, DO, RC) dans l'agence ?",
    "Quels outils utilisez-vous (logiciel de gestion, chiffrage, expertise à distance) ?",
    "Comment l'entreprise intègre-t-elle les enjeux environnementaux dans ses préconisations ?",
    "Quelles sont les perspectives d'évolution (spécialisation, gros dommages, management) ?"
  ],
  checklist: [
    "Relire l'offre d'emploi et souligner les compétences demandées",
    "Préparer un pitch de 2 minutes et 3 exemples concrets (méthode STAR)",
    "Connaître l'entreprise : activité, implantations, actualités récentes",
    "Réviser GPA / biennale / décennale / DO, IRSI, CatNat, règles proportionnelles",
    "Savoir faire un métré de pièce et un calcul de vétusté de tête",
    "Préparer 3 questions à poser",
    "Avoir CV, diplômes, permis, et un carnet pour noter",
    "Tenue professionnelle, arriver 10 min en avance"
  ],
  star: [
    ["S — Situation", "Le contexte : où, quand, avec qui."],
    ["T — Tâche", "Votre rôle, l'objectif ou le problème à résoudre."],
    ["A — Action", "Ce que VOUS avez fait concrètement (verbes d'action, « je »)."],
    ["R — Résultat", "Le résultat mesurable et ce que vous en avez appris."]
  ],
  rapport: [
    ["1. Références", "N° de sinistre, mandant, assuré, adresse du risque, date du sinistre, date de la mission, contrat et garanties."],
    ["2. Déroulement de l'expertise", "Dates des réunions, personnes présentes ou convoquées (caractère contradictoire)."],
    ["3. Circonstances", "Récit factuel de la survenance tel que rapporté et vérifié."],
    ["4. Constatations", "Description des dommages, localisation, mesures, photos annexées."],
    ["5. Cause et origine", "Analyse technique argumentée, investigations réalisées."],
    ["6. Avis sur la garantie", "Rattachement aux garanties du contrat, exclusions éventuelles — c'est un avis, la décision appartient à l'assureur."],
    ["7. Évaluation", "Chiffrage détaillé (quantités, PU), vétusté, franchise, indemnité immédiate et différée."],
    ["8. Recours", "Responsables identifiés, assureurs, conventions applicables, pièces conservées."],
    ["9. Conclusion", "Synthèse en quelques lignes et suites à donner."]
  ]
};
