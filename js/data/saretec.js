// Module SARETEC — Entretien RH & connaissance de l'entreprise.
// Sources : pages officielles saretec.fr et saretec-recrute.fr consultées le 5 octobre 2026 (voir onglet Sources).
// Règle : [S] = information sourcée (page officielle) ; [I] = interprétation / mise en perspective pour l'entretien.
(function () {
  const CONSULT = "consulté le 5 oct. 2026";

  // ---------------- Domaine + notions (suivi de niveau séparé du technique) ----------------
  window.DOMAINES.saretec = "Saretec / RH";
  window.NOTIONS.push(
    { id: "sar-entreprise", d: "saretec", t: "Qui est Saretec ?", p: 1, f: {
      def: "Groupe d'accompagnement avant et après sinistre : conseil & prévention, expertise (cœur de métier), réparation, mobilité.",
      role: "Intervient pour les professionnels de l'assurance (assureurs, mutuelles, agents, courtiers), des entreprises et des collectivités, au bénéfice des sinistrés.",
      loc: "Né en 1977, d'abord dans la construction, puis dommages, protection juridique, responsabilité civile. Agences partout en France.",
      conf: "Saretec n'est pas un assureur : il expertise pour le compte des assureurs, qui décident de l'indemnisation.",
      sin: "Un dégât des eaux chez un assuré : l'assureur mandate Saretec, l'expert qualifie, vérifie les garanties, chiffre et rend son rapport.",
      mur: ["Prévention → Expertise → Réparation", "Saretec expertise, l'assureur décide"],
      rouge: ["1977", "≈ 450 000 missions traitées (2025)", "4 pôles : construction, dommages, protection juridique, RC"],
      jaune: ["Expertise sur site, par téléphone, en visio, via des solutions digitales"],
      vert: ["Tous risques couverts par les polices d'assurance, hors automobile"], svg: "" } },
    { id: "sar-mission", d: "saretec", t: "Entreprise à mission", p: 1, f: {
      def: "Statut créé par la loi PACTE (2019) : l'entreprise inscrit dans ses statuts une raison d'être et des objectifs sociaux et environnementaux, suivis par un comité de mission et vérifiés par un organisme tiers indépendant.",
      role: "Passer d'une déclaration d'intention à un engagement contrôlé.",
      loc: "Saretec est entreprise à mission depuis 2023 ; audit par un OTI tous les deux ans, avec rapport public.",
      conf: "Entreprise à mission ≠ association ni label : c'est une société commerciale qui garde un objectif économique.",
      sin: "Exemple concret d'objectif : « impulser la transformation des entreprises du bâtiment et de la réparation » → démarche bas carbone sur les chantiers de réparation.",
      mur: ["Mission = statuts + comité + contrôle externe", "« Un monde plus sûr, pour tous »"],
      rouge: ["Depuis 2023", "Raison d'être : œuvrer pour un monde plus sûr pour tous"],
      jaune: ["Cohérent avec un métier qui répare, protège et prévient"],
      vert: ["Relier la mission à des gestes du quotidien de l'expert"], svg: "" } },
    { id: "sar-carbone", d: "saretec", t: "Objectif Bas Carbone", p: 1, f: {
      def: "Démarche visant à réduire l'empreinte carbone des chantiers de réparation après sinistre, souvent réalisés « à l'identique » sans considération environnementale.",
      role: "L'expert, au centre entre assureur, assuré et artisans, oriente les solutions de réparation.",
      loc: "Méthode de quantification propre à la réparation (s'appuyant sur INIES) + catalogue de prestations alternatives, sans surcoût.",
      conf: "L'expert ne réalise pas les travaux, mais son analyse et son chiffrage orientent ce qui sera fait.",
      sin: "DDE avec peinture : proposer une peinture moins émissive (ex. recyclée) au même prix ; réparer un parquet plutôt que le remplacer.",
      mur: ["SINISTRE → RÉPARATION → TRAVAUX → MATÉRIAUX → CARBONE", "Bas carbone = sans surcoût"],
      rouge: ["Cible : les chantiers de réparation (pas le neuf)"],
      jaune: ["Objectif affiché : −7 %/an d'impact CO₂ des chantiers (page non datée)"],
      vert: ["Réparer plutôt que remplacer ; réemployer ; éviter des déplacements"], svg: "" } },
    { id: "sar-distance", d: "saretec", t: "Expertise à distance", p: 1, f: {
      def: "Expertise menée par téléphone, visio et échanges digitaux (photos, documents) au lieu d'un déplacement sur site.",
      role: "Traiter rapidement les sinistres qui s'y prêtent, en interaction directe avec l'assuré.",
      loc: "Modalité proposée par Saretec aux côtés de l'expertise sur site.",
      conf: "À distance ne veut pas dire moins rigoureux : on vérifie autrement, et on sait dire quand une visite est nécessaire.",
      sin: "DDE documenté : visio guidée (origine puis dommages), mesures avec repère, pièces justificatives ; fissures évolutives : visite sur site.",
      mur: ["Distance = rapide, mais savoir dire « il faut aller voir »"],
      rouge: ["Limites : vérification physique impossible, visibilité, doute sur l'origine, enjeu important"],
      jaune: ["Avantages : rapidité, accessibilité, moins de déplacements, sinistres fréquents"],
      vert: ["Guider l'assuré : vue large → détail → repère métrique"], svg: "" } },
    { id: "sar-teleexpert", d: "saretec", t: "Le métier de Télé-Expert chez Saretec", p: 1, f: {
      def: "Expert qui accompagne les sinistrés à distance : causes, observation des dommages en visio, validation des garanties, chiffrage.",
      role: "Analyse technique + relation avec l'assuré + rapport à l'assureur.",
      loc: "Plateau / télétravail, outils visio et téléphoniques.",
      conf: "Télé-expert ≠ gestionnaire de sinistres : il apporte une analyse technique (causes, chiffrage) ; il ne décide pas seul de l'indemnisation.",
      sin: "Assuré inquiet après un DDE : écouter, expliquer simplement la cause et ce que couvre le contrat, chiffrer, annoncer les étapes.",
      mur: ["Empathie + pédagogie + causes + garanties + chiffrage"],
      rouge: ["Les 4 missions de la fiche métier"],
      jaune: ["Qualités : écoute, élocution, clarté, précision, curiosité"],
      vert: ["Donner des exemples concrets de chaque qualité"], svg: "" } },
    { id: "sar-economie", d: "saretec", t: "Économie de la construction (Études & Quantum)", p: 2, f: {
      def: "Évaluer, chiffrer et répartir les coûts des travaux de réparation ; assistance technique et économique.",
      role: "Chiffrage au plus juste, interface entre assureur, expert, avocat, bureaux d'études et entreprises.",
      loc: "Filiale du pôle Réparation du groupe.",
      conf: "Constater ≠ métrer ≠ chiffrer ≠ expertiser ≠ décider. L'assureur décide de l'indemnisation.",
      sin: "Gros DDE : l'économiste établit les quantités et le coût des travaux ; l'expert les intègre à son analyse ; l'assureur indemnise.",
      mur: ["Constater → métrer → chiffrer → expertiser → l'assureur décide"],
      rouge: ["Qui fait quoi"], jaune: ["« Économies significatives à qualité équivalente » (pas « le moins cher »)"],
      vert: ["Relier à mon métré et à mon chiffrage de télé-expert"], svg: "" } },
    { id: "sar-ecosysteme", d: "saretec", t: "Capsens, Keywiiz, Observatoire de la Sécurité des Foyers", p: 2, f: {
      def: "Capsens = organisme de formation du groupe. Keywiiz = solutions digitales pour l'assurance. OSF = observatoire de prévention des risques domestiques (avec Covéa et Verisure, depuis 2019).",
      role: "Former, digitaliser, prévenir : prolongements du métier d'expert.",
      loc: "Pôle Conseil & Prévention du groupe.",
      conf: "Keywiiz n'est pas un logiciel interne de chiffrage : c'est une offre de services web aux professionnels de l'assurance.",
      sin: "OSF : guide 2024 sur le dégât des eaux — le sinistre le plus fréquent que traitera un télé-expert habitation.",
      mur: ["Former · Digitaliser · Prévenir"],
      rouge: ["Capsens = formation"], jaune: ["Keywiiz : SMART.CARE (indemnisation digitale), VEGA (événements climatiques)"], vert: ["OSF = culture de prévention"], svg: "" } }
  );

  // ---------------- QCM Saretec (ne se mélangent pas aux tests techniques) ----------------
  window.QUESTIONS.push(
    { n: "sar-entreprise", lv: 2, t: "c", q: "Selon ses pages officielles, quelle chaîne de valeur le groupe Saretec couvre-t-il ?",
      r: ["De la prévention à la réparation après sinistre, en passant par l'expertise, son cœur de métier", "L'expertise sinistre uniquement, la réparation étant laissée aux assureurs", "La souscription de contrats d'assurance et l'indemnisation des assurés", "La maîtrise d'œuvre de constructions neuves uniquement"],
      e: "Activités affichées : Conseil & Prévention, Expertise, Réparation, Mobilité [S]." },
    { n: "sar-entreprise", lv: 1, t: "c", q: "Pour qui Saretec France réalise-t-elle principalement ses expertises d'assurance ?",
      r: ["Les professionnels de l'assurance (assureurs, mutuelles, agents, courtiers), ainsi que des entreprises et collectivités", "Uniquement les particuliers sinistrés, qui la mandatent directement", "Les tribunaux, en tant qu'experts judiciaires exclusivement", "Les entreprises du BTP, pour vérifier leurs devis"],
      e: "Saretec intervient pour le compte des assureurs ; l'assuré est la personne accompagnée." },
    { n: "sar-entreprise", lv: 2, t: "c", q: "Quels sont les 4 pôles d'expertise d'assurance présentés par Saretec France ?",
      r: ["Construction, Dommages aux biens, Protection juridique, Responsabilité civile", "Construction, Automobile, Santé, Transport", "Dommages aux biens, Vie, Prévoyance, Santé", "Incendie, Vol, Dégât des eaux, Bris de glace"],
      e: "La dernière proposition liste des types de sinistres, pas des pôles [S]." },
    { n: "sar-entreprise", lv: 2, t: "c", q: "Selon la page Saretec France, quel domaine n'est PAS couvert par ses expertises ?",
      r: ["L'automobile", "Les catastrophes naturelles", "Les risques construction et chantiers", "Les risques financiers"],
      e: "« L'ensemble des risques couverts par les polices d'assurance (hors automobile) » [S]." },
    { n: "sar-entreprise", lv: 1, t: "c", q: "Quelles modalités d'expertise Saretec France met-elle en avant ?",
      r: ["Sur site, par entretien téléphonique, en visio-expertise et via des solutions digitales", "Sur site uniquement", "Visio-expertise uniquement", "Sur site et par courrier uniquement"],
      e: "C'est le cadre de votre futur poste [S]." },
    { n: "sar-entreprise", lv: 2, t: "c", q: "Dans quel domaine Saretec est-elle historiquement née ?",
      r: ["La construction (né en 1977 des évolutions du droit de la construction)", "L'expertise automobile", "Le courtage d'assurance", "L'expertise d'objets d'art"],
      e: "Puis développement vers dommages, protection juridique, RC [S]." },
    { n: "sar-mission", lv: 2, t: "c", q: "Juridiquement, une société à mission (loi PACTE, 2019) doit notamment :",
      r: ["Inscrire dans ses statuts une raison d'être et des objectifs sociaux et environnementaux, suivis par un comité de mission et vérifiés par un organisme tiers indépendant", "Adopter le statut d'association à but non lucratif", "Reverser l'intégralité de ses bénéfices à des œuvres", "Obtenir un label privé renouvelé chaque année par ses clients"],
      e: "Article L210-10 du Code de commerce. L'entreprise garde son objectif économique." },
    { n: "sar-mission", lv: 3, t: "c", q: "Comment le respect des objectifs statutaires de Saretec est-il contrôlé ?",
      r: ["Par un organisme tiers indépendant, tous les deux ans, avec un rapport public", "Par le seul conseil d'administration, sans contrôle externe", "Par les assureurs clients, chaque année", "Par l'ADEME, sur demande"],
      e: "Commissaires aux comptes ou organisme accrédité COFRAC [S]." },
    { n: "sar-mission", lv: 2, t: "c", q: "Lequel de ces énoncés figure parmi les objectifs statutaires de Saretec ?",
      r: ["Impulser et guider la transformation progressive des entreprises du bâtiment, de la réparation et de la mobilité", "Devenir le premier assureur habitation de France", "Remplacer toutes les expertises sur site par la visio d'ici 2030", "Réduire de moitié la durée des expertises"],
      e: "Les 3 autres objectifs : enjeux planétaires au cœur des innovations ; transformer approches et outils ; nouvelles formes de collectifs et d'organisation du travail [S]." },
    { n: "sar-mission", lv: 1, t: "c", q: "Depuis quand Saretec est-elle une entreprise à mission ?",
      r: ["2023", "1977", "2019", "2015"],
      e: "1977 = naissance du groupe ; 2019 = loi PACTE qui crée le statut [S]." },
    { n: "sar-carbone", lv: 1, t: "c", q: "Sur quoi porte spécifiquement la démarche « Objectif Bas Carbone » de Saretec ?",
      r: ["Les émissions de CO₂ des chantiers de réparation après sinistre", "Les seules émissions des bureaux et véhicules du groupe", "Les constructions neuves soumises à la RE2020", "La compensation carbone des déplacements des assurés"],
      e: "Saretec souligne que ces chantiers « passent sous les radars » des démarches écologiques, centrées sur le neuf [S]." },
    { n: "sar-carbone", lv: 3, t: "r", q: "Pourquoi un cabinet d'expertise peut-il agir sur le carbone alors qu'il ne réalise pas les travaux ?",
      r: ["Son analyse et son chiffrage orientent les solutions de réparation retenues par l'assureur, l'assuré et l'artisan", "Il est légalement responsable des émissions des artisans", "Il fournit lui-même les matériaux de réparation", "Il ne peut pas agir : seul l'artisan est concerné"],
      e: "Position centrale de l'expert entre assureur, assuré et entreprises [S] ; le chiffrage est un levier [I]." },
    { n: "sar-carbone", lv: 2, t: "c", q: "Quel principe encadre les alternatives bas carbone proposées par Saretec ?",
      r: ["Un prix au maximum équivalent : sans surcoût pour l'assureur ni l'assuré", "Un surcoût accepté d'environ 10 % pour l'environnement", "Le remplacement systématique par des matériaux biosourcés", "Une compensation carbone facturée à l'assuré"],
      e: "« Pour un prix maximum équivalent » (page Objectif Bas Carbone, non datée) [S]." },
    { n: "sar-carbone", lv: 3, t: "c", q: "Pourquoi Saretec a-t-elle créé une méthode de quantification propre à la réparation au lieu d'utiliser directement la base INIES ?",
      r: ["INIES est pensée pour la conception de bâtiments neufs ; la réparation utilise des produits et prestations spécifiques", "La base INIES est réservée aux bureaux d'études agréés", "La RE2020 interdit d'utiliser INIES pour l'existant", "La base INIES ne contient aucune donnée sur la peinture"],
      e: "La méthode s'appuie sur INIES mais l'adapte aux désignations de réparation [S]." },
    { n: "sar-carbone", lv: 2, t: "c", q: "Quel exemple Saretec cite-t-elle pour un dégât des eaux nécessitant des travaux de peinture ?",
      r: ["Inciter à choisir une peinture moins émissive, par exemple recyclée, sans surcoût", "Remplacer systématiquement les plaques de plâtre mouillées", "Imposer un séchage mécanique de plusieurs semaines", "Ne plus indemniser les embellissements"],
      e: "Le catalogue agit sur les matériaux ou sur les procédés de réparation [S]." },
    { n: "sar-carbone", lv: 2, t: "r", q: "En quoi un télé-expert peut-il contribuer indirectement à une démarche bas carbone ?",
      r: ["En évitant des déplacements pour les dossiers adaptés et en orientant, par son chiffrage, vers des réparations moins émissives", "En imposant à l'assuré des matériaux biosourcés", "En réduisant l'indemnité de l'assuré", "Il ne peut pas y contribuer"],
      e: "Le lien télé-expertise / déplacements est une déduction logique [I], cohérente avec la démarche." },
    { n: "sar-distance", lv: 2, t: "r", q: "Quel dossier se prête le mieux à une expertise à distance ?",
      r: ["Un dégât des eaux d'origine identifiée et réparée, avec dommages d'embellissement visibles et documentés", "Des fissures évolutives sur une maison avec portes qui frottent", "Un incendie important avec doute sur l'origine", "Une infiltration d'origine inconnue avec plusieurs hypothèses"],
      e: "Les autres cas exigent des vérifications physiques ou des investigations." },
    { n: "sar-distance", lv: 4, t: "r", q: "En visio, l'assuré ne peut pas montrer l'origine supposée (combles inaccessibles). Que fais-tu ?",
      r: ["Je le consigne, je cherche d'autres éléments (photos d'un intervenant, facture) et, si l'origine reste incertaine, je propose une expertise sur site", "Je retiens l'origine déclarée par l'assuré sans autre vérification", "Je clôture le dossier faute d'images", "Je demande à l'assuré de monter sur le toit pour filmer"],
      e: "Ne jamais mettre l'assuré en danger ; ne pas conclure sans élément." },
    { n: "sar-distance", lv: 2, t: "c", q: "Quelle limite est propre à l'expertise à distance ?",
      r: ["Certaines vérifications physiques sont impossibles (mesure d'humidité, sondage, toucher d'un matériau)", "Il est impossible de vérifier les garanties du contrat", "Il est impossible de chiffrer les dommages", "Il est impossible d'échanger directement avec l'assuré"],
      e: "Garanties, chiffrage et échange restent possibles à distance." },
    { n: "sar-distance", lv: 3, t: "r", q: "Image sombre, dommage peu visible pendant la visio. Quel est le bon réflexe ?",
      r: ["Guider l'assuré (lumière, angle, vue large puis détail, repère métrique) avant de conclure", "Conclure sur la base de la déclaration", "Estimer les surfaces au jugé", "Passer directement à un chiffrage forfaitaire"],
      e: "La qualité de l'observation dépend du guidage par l'expert." },
    { n: "sar-distance", lv: 3, t: "r", q: "Dans quelle situation l'enjeu justifie-t-il de proposer une expertise sur site ?",
      r: ["Montant élevé, atteinte possible à la structure ou doute sérieux sur l'origine ou les circonstances", "Dès que l'assuré est une personne âgée", "Dès qu'un voisin est concerné", "Dès qu'un devis est transmis"],
      e: "Savoir orienter vers le site fait partie de la compétence du télé-expert." },
    { n: "sar-distance", lv: 1, t: "c", q: "Quel avantage de l'expertise à distance pour l'assuré est le plus juste ?",
      r: ["Une prise en charge plus rapide, sans attendre un rendez-vous sur place", "L'absence de franchise", "Une indemnisation plus élevée", "L'absence de vérification des garanties"],
      e: "Rapidité et accessibilité, sans changer les règles du contrat." },
    { n: "sar-teleexpert", lv: 1, t: "c", q: "Selon la fiche métier Saretec, laquelle de ces missions est celle du télé-expert ?",
      r: ["Valider les garanties et chiffrer les dommages et réparations", "Réaliser les travaux de réparation", "Fixer le montant de la prime d'assurance", "Représenter l'assuré contre son assureur"],
      e: "Autres missions : empathie et pédagogie, visio pour évaluer les dommages, déterminer les causes [S]." },
    { n: "sar-teleexpert", lv: 3, t: "r", q: "Qu'est-ce qui distingue un télé-expert d'un gestionnaire de sinistres ?",
      r: ["L'analyse technique : détermination des causes, observation des dommages et chiffrage argumenté", "Le télé-expert n'a aucun contact avec l'assuré", "Le télé-expert décide seul de l'indemnisation", "Le gestionnaire ne vérifie jamais les garanties"],
      e: "Le télé-expert apporte l'analyse ; l'assureur (gestionnaire) décide." },
    { n: "sar-teleexpert", lv: 2, t: "r", q: "Quelle posture est juste vis-à-vis de l'assuré ?",
      r: ["Expliquer avec pédagogie les constats et le cadre des garanties, sans promettre une décision qui appartient à l'assureur", "Défendre l'assuré contre son assureur", "Garantir à l'assuré le remboursement de son devis", "Éviter d'expliquer pour ne pas créer de litige"],
      e: "Empathie et pédagogie « dans le cadre des garanties contractualisées » [S]." },
    { n: "sar-economie", lv: 1, t: "c", q: "Quelle est la différence entre métrer et chiffrer ?",
      r: ["Métrer = mesurer et quantifier les ouvrages ; chiffrer = valoriser ces quantités avec des prix", "Métrer = fixer les prix ; chiffrer = mesurer", "Ce sont deux synonymes", "Métrer = rédiger le rapport ; chiffrer = constater"],
      e: "Constater → métrer → chiffrer." },
    { n: "sar-economie", lv: 2, t: "c", q: "Qui décide de l'indemnisation de l'assuré ?",
      r: ["L'assureur, sur la base notamment du rapport et du chiffrage de l'expert", "L'expert, seul, dans son rapport", "L'artisan qui réalise les travaux", "L'économiste de la construction"],
      e: "L'expert analyse, chiffre et donne un avis ; il ne décide pas seul." },
    { n: "sar-economie", lv: 2, t: "r", q: "Quel ordre est logique ?",
      r: ["Constater → métrer → chiffrer → expertiser (analyse, avis) → l'assureur décide", "Chiffrer → constater → métrer → décider", "Décider → constater → chiffrer → métrer", "Métrer → décider → constater → chiffrer"],
      e: "On ne chiffre que ce qu'on a constaté et quantifié." },
    { n: "sar-economie", lv: 2, t: "c", q: "Que fait Études & Quantum, la filiale d'économie de la construction du groupe ?",
      r: ["Évaluer, chiffrer et répartir les coûts des travaux de réparation, en interface entre assureur, expert, bureaux d'études et entreprises", "Vendre des contrats d'assurance construction", "Réaliser elle-même les travaux de gros œuvre", "Former les assurés à la prévention"],
      e: "Assistance expertise dommage, garants financiers, efficacité énergétique [S]." },
    { n: "sar-economie", lv: 2, t: "c", q: "Selon Saretec, un bon économiste de la construction est-il celui qui trouve toujours la réparation la moins chère ?",
      r: ["Non : il vise des économies significatives à qualité équivalente et sait argumenter ses préconisations", "Oui, le moins cher est la règle", "Non, il retient toujours le devis de l'assuré", "Oui, à condition d'utiliser des matériaux neufs"],
      e: "Fiche métier économiste : « à qualité ISO » [S]." },
    { n: "sar-ecosysteme", lv: 1, t: "c", q: "Qu'est-ce que Capsens ?",
      r: ["L'organisme de formation du groupe, d'abord pour les salariés puis ouvert aux clients", "Le logiciel de chiffrage du groupe", "Le comité de mission", "La filiale de réparation"],
      e: "Formateurs = professionnels de terrain en activité ; présentiel et mix-learning [S]." },
    { n: "sar-ecosysteme", lv: 1, t: "c", q: "Que propose principalement Keywiiz ?",
      r: ["Des solutions digitales pour les professionnels de l'assurance (parcours sinistre, indemnisation, anticipation d'événements climatiques)", "Des formations en présentiel", "Des travaux de réparation", "De l'expertise judiciaire"],
      e: "SMART.CARE et VEGA [S]." },
    { n: "sar-ecosysteme", lv: 1, t: "c", q: "Quel est l'objectif de l'Observatoire de la Sécurité des Foyers (lancé en 2019 avec Covéa et Verisure) ?",
      r: ["Sensibiliser et aider à prévenir les risques domestiques (cambriolage, incendie, dégât des eaux…)", "Contrôler la qualité des expertises", "Certifier les artisans", "Publier les tarifs d'assurance habitation"],
      e: "Un thème par édition ; guide 2024 sur le dégât des eaux [S]." },
    { n: "sar-ecosysteme", lv: 2, t: "r", q: "Pourquoi un groupe d'expertise s'investit-il dans la prévention ?",
      r: ["Son expérience des sinistres lui permet d'identifier les causes fréquentes et d'aider à les éviter", "Pour vendre des contrats d'assurance", "Parce que la loi l'impose aux experts", "Pour augmenter le nombre de sinistres expertisés"],
      e: "Cohérent avec la raison d'être « prévenir et solutionner les sinistres » [S/I]." }
  );

  // ---------------- Contenus des onglets ----------------
  window.SARETEC = {
    consult: CONSULT,
    sec60: [
      ["Qui ?", "Un groupe français d'accompagnement avant et après sinistre, né en 1977 dans la construction. Entreprise à mission depuis 2023."],
      ["Activité", "Conseil & prévention → expertise (cœur de métier) → réparation, plus une activité mobilité."],
      ["Pour qui ?", "Les professionnels de l'assurance (assureurs, mutuelles, agents, courtiers), des entreprises et collectivités — au service des sinistrés."],
      ["Quels risques ?", "Construction, dommages aux biens (DDE, incendie, vol, CatNat…), protection juridique, responsabilité civile. Pas l'automobile."],
      ["Expertise à distance", "Expertise par téléphone, visio et outils digitaux, à côté de l'expertise sur site."],
      ["Télé-expert", "Accompagne le sinistré à distance : causes, observation en visio, garanties, chiffrage, avec empathie et pédagogie."],
      ["Pourquoi la technologie ?", "Traiter vite et bien les sinistres fréquents, rester proche de l'assuré, réduire les déplacements ; le groupe se dit précurseur de la gestion de sinistre digitalisée."],
      ["Engagements", "Mission « un monde plus sûr, pour tous » ; Objectif Bas Carbone sur les chantiers de réparation ; formation (Capsens) ; prévention (OSF) ; qualité de vie et actionnariat salarié."]
    ],
    pitch60: "Saretec est un groupe d'expertise après sinistre, né en 1977 dans la construction, qui accompagne aujourd'hui les assureurs de la prévention jusqu'à la réparation — avec de l'ordre de 450 000 missions traitées en 2025. Son cœur de métier, c'est l'expertise : comprendre la cause d'un sinistre, vérifier ce que couvre le contrat et chiffrer la réparation, sur site ou à distance. Ce qui m'a marquée, c'est la place donnée à l'expertise à distance — c'est précisément le poste de télé-expert — et le fait que Saretec soit entreprise à mission depuis 2023, avec des engagements concrets : par exemple, mesurer et réduire le carbone des chantiers de réparation, sans surcoût pour l'assuré. Pour moi, ça relie trois choses qui me parlent : le bâtiment, la relation avec des personnes qui vivent un moment difficile, et le souci de réparer de façon plus responsable.",
    mission: {
      juridique: [
        "Créée par la loi PACTE du 22 mai 2019 (art. L210-10 du Code de commerce).",
        "La société inscrit dans ses STATUTS une raison d'être et des objectifs sociaux et environnementaux.",
        "Un comité de mission suit leur exécution.",
        "Un organisme tiers indépendant (OTI) vérifie et publie un avis.",
        "L'entreprise reste une société commerciale avec un objectif économique."
      ],
      saretec: [
        "[S] Raison d'être : « Nous œuvrons pour un monde plus sûr pour tous, en prévenant et en solutionnant les sinistres et les crises, avec une attention sincère portée à l'autre et en innovant pour aider nos clients à rendre leurs activités plus durables. »",
        "[S] Entreprise à mission depuis 2023 ; audit par un OTI tous les deux ans, rapport public. Rapport de mission 2025-2026 = 3e édition.",
        "[S] 4 objectifs statutaires : placer la radicalité des enjeux planétaires au cœur des innovations ; transformer les approches d'accompagnement et les outils ; imaginer de nouvelles formes de collectifs et d'organisation du travail ; impulser la transformation progressive des entreprises du bâtiment, de la réparation et de la mobilité.",
        "[S] Implique la société (environnement, enjeux sociaux), les collaborateurs (sens, exemplarité), les clients et partenaires."
      ],
      recruteur: [
        ["Écologie", "→ objectif « enjeux planétaires au cœur des innovations » ; Objectif Bas Carbone"],
        ["Éco-construction", "→ objectif « transformation des entreprises du bâtiment et de la réparation »"],
        ["Bien-être et accompagnement des sinistrés", "→ raison d'être « attention sincère portée à l'autre »"],
        ["Bien-être des salariés", "→ objectif « nouvelles formes de collectifs et d'organisation du travail » ; accords temps choisi, télétravail, actionnariat salarié"]
      ],
      coherence: "[I] Un expert est au centre du sinistre : il voit les causes (donc la prévention), oriente la réparation (donc les matériaux et le carbone), et parle à des personnes fragilisées (donc l'attention à l'autre). La mission formalise ce que le métier permet déjà d'influencer.",
      question: "Qu'avez-vous compris du statut d'entreprise à mission de Saretec ?",
      modele: "Pour moi, c'est le passage d'intentions à des engagements vérifiés : depuis 2023, Saretec a inscrit dans ses statuts une raison d'être — un monde plus sûr pour tous — avec des objectifs sociaux et environnementaux, contrôlés par un organisme indépendant. Ce que je trouve cohérent, c'est que l'expert est justement au bon endroit pour agir : sur la façon de réparer, par exemple côté carbone, et sur la façon d'accompagner les sinistrés.",
      eviter: ["Réciter la définition juridique mot pour mot", "Dire « c'est une entreprise écolo » (trop vague, et c'est aussi social)", "Inventer des chiffres ou des actions non citées dans les sources"]
    },
    carbone: {
      chaine: ["Sinistre", "Réparation", "Travaux", "Matériaux & procédés", "Impact carbone"],
      sources: [
        "[S, page non datée] En France, selon Saretec, le BTP représente environ un quart des émissions de CO₂.",
        "[S, page non datée] Les chantiers de réparation après sinistre, souvent réalisés « à l'identique », passent « sous les radars » des démarches écologiques centrées sur le neuf.",
        "[S, page non datée] Objectif affiché : réduire de 7 % par an l'impact CO₂ de ces chantiers, sans surcoût pour les assureurs ou les assurés, en mobilisant assureurs, assurés, artisans et collaborateurs.",
        "[S, page non datée] Méthode de quantification propre à la réparation, s'appuyant sur la base INIES (près de 600 désignations selon la page) ; évaluations intégrées aux rapports d'expertise ; catalogue de prestations alternatives bas carbone « pour un prix maximum équivalent ».",
        "[S, page non datée] Pilote cité avec Gan Assurances (≈ 10 t de CO₂ évitées en 6 mois) et pilote annoncé avec la MAIF — ne pas présenter ces chiffres comme actuels.",
        "[S, rapport de mission 2025-2026, édito] Le « bordereau bas carbone » est présenté comme partagé en open source avec la profession."
      ],
      leviers: [
        ["Choix des matériaux", "Peinture moins émissive (ex. recyclée), isolant biosourcé si équivalent"],
        ["Pratiques de réparation", "Réparer / poncer / reprendre localement plutôt que remplacer"],
        ["Réemploi", "Tuiles saines, portes, équipements quand c'est pertinent"],
        ["Déplacements", "Expertise à distance pour les dossiers adaptés"],
        ["Chiffrage & prescription", "Ce qui est chiffré oriente ce qui sera réalisé"],
        ["Sensibilisation", "Expliquer à l'assuré et à l'artisan, sans imposer"]
      ],
      entretien: [
        { q: "Qu'avez-vous retenu de notre démarche Objectif Bas Carbone ?",
          m: "Que vous vous êtes attaqués à un angle mort : les chantiers de réparation après sinistre, qui sont souvent refaits à l'identique sans penser au carbone. Vous avez construit une méthode pour mesurer l'impact des réparations et un catalogue d'alternatives au même prix. Ça m'a parlé parce que, comme architecte, je connais l'impact des matériaux — mais ici le levier est au moment du chiffrage." },
        { q: "En quoi un télé-expert peut-il contribuer à une démarche bas carbone ?",
          m: "Indirectement, de deux façons : en évitant des déplacements quand le dossier peut être traité à distance, et surtout par la manière de chiffrer — proposer de réparer plutôt que remplacer quand c'est techniquement satisfaisant, ou une alternative moins émissive au même prix. Et en l'expliquant simplement à l'assuré." },
        { q: "Comment proposer une solution bas carbone à un assuré sans qu'il la vive comme une moindre indemnisation ?",
          m: "En étant transparente : même niveau de qualité, même prix, et c'est lui qui choisit. J'expliquerais concrètement, par exemple qu'un parquet massif peut être poncé plutôt que remplacé, avec le même rendu. Jamais en réduisant son indemnité au nom de l'environnement." }
      ],
      cas: {
        id: "sar-bas-carbone", titre: "Mini-cas : dégât des eaux et réparation bas carbone", tag: "Saretec · Bas carbone", niveau: 3,
        notions: ["sar-carbone", "etendue", "sols"],
        enonce: "En télé-expertise, dégât des eaux dans une chambre : plafond taché (plaque saine après séchage), parquet massif légèrement tuilé sur 3 m², qui s'est stabilisé. Le devis de l'artisan prévoit le remplacement complet du parquet (14 m²) et une peinture standard. <b>Comment intègres-tu une approche bas carbone dans ton analyse, sans léser l'assuré ?</b>",
        grille: [
          { k: "Réparer plutôt que remplacer", items: [{ t: "Parquet massif stabilisé : ponçage / reprise locale plutôt que remplacement des 14 m²", kw: ["poncage", "poncer", "reprise", "localis", "reparer plutot", "pas de remplacement"] }] },
          { k: "Matériaux", items: [{ t: "Peinture moins émissive (ex. recyclée) au même prix", kw: ["peinture recyclee", "peinture bas carbone", "moins emissive", "recycle"] }] },
          { k: "Sans surcoût / sans léser", items: [{ t: "Qualité et prix équivalents ; l'indemnité n'est pas réduite au nom de l'environnement", kw: ["sans surcout", "meme prix", "prix equivalent", "qualite equivalente", "sans leser"] }] },
          { k: "Pédagogie", items: [{ t: "Expliquer à l'assuré et à l'artisan, proposer sans imposer", kw: ["expliquer", "pedagog", "proposer", "choix de l'assure", "sans imposer"] }] },
          { k: "Rôle de l'expert", items: [{ t: "Le chiffrage oriente la réparation ; la décision d'indemnisation appartient à l'assureur", kw: ["chiffrage", "rapport", "assureur decide", "assureur"] }] },
          { k: "Distance", items: [{ t: "Dossier traité à distance = déplacement évité", kw: ["deplacement", "a distance", "visio"] }] }
        ],
        dangers: [
          { t: "Réduire l'indemnité de l'assuré au nom de l'environnement", kw: ["reduire l'indemnite", "moins indemniser", "baisser l'indemnite"] },
          { t: "Imposer une solution à l'assuré ou à l'artisan", kw: ["imposer", "obliger"] },
          { t: "Présenter l'expert comme celui qui décide de l'indemnisation", kw: ["je decide", "l'expert decide"] }
        ],
        expert: ["Vérifier que le parquet est réellement stabilisé (humidité, planéité)", "Comparer le coût ponçage vs remplacement", "Mentionner l'option bas carbone dans le rapport", "Laisser le choix à l'assuré à qualité équivalente"],
        chaine: { origine: "Fuite (DDE)", dommages: "Plafond taché, parquet tuilé 3 m²", verifications: "Séchage, stabilité du parquet, plaque saine", travaux: "Ponçage/vitrification ou reprise locale ; peinture moins émissive", chiffrage: "À prix équivalent ou inférieur au remplacement", assurance: "Garantie DDE ; l'assureur décide sur la base du rapport" }
      }
    },
    distance: {
      etapes: [
        ["Mandat / dossier", "L'assureur confie la mission : références, contrat, déclaration.", "Je lis le dossier avant d'appeler : garanties, franchise, circonstances déclarées."],
        ["Prise de contact", "Premier échange avec l'assuré, souvent sous le coup de l'émotion.", "Je me présente, j'écoute, je rassure, je vérifie la sécurité et les mesures conservatoires."],
        ["Qualification", "Quel type de sinistre ? Quel enjeu ? Distance adaptée ?", "Je décide si la visio suffit ou s'il faut proposer une visite."],
        ["Causes et circonstances", "Quand, où, comment, depuis quand, origine réparée ?", "Je formule des hypothèses et je les teste par mes questions."],
        ["Visio / échange à distance", "L'assuré filme selon mes consignes.", "Origine d'abord, puis dommages ; vue large → détail → repère métrique."],
        ["Observation des dommages", "Nature, étendue, matériaux, état.", "Je relève ce qui est atteint et ce qui ne l'est pas ; je métrique."],
        ["Vérification des garanties", "Le sinistre correspond-il au contrat ?", "Événement garanti, exclusions, plafonds, franchise ; c'est un avis, l'assureur décide."],
        ["Chiffrage", "Valoriser les travaux de réparation.", "Ouvrage → dommage → travaux → quantité → prix ; vérification du devis ; vétusté."],
        ["Conclusion", "Synthèse expliquée à l'assuré.", "Je reformule simplement : cause, ce qui est pris en compte, les prochaines étapes."],
        ["Rapport", "Document factuel et argumenté.", "Faits, cause, avis de garantie, évaluation, recours éventuel."],
        ["Compagnie d'assurance", "Le gestionnaire décide et règle.", "Ma qualité de rapport conditionne la rapidité et la justesse de la décision."]
      ],
      pour: ["Rapidité de prise en charge", "Accessibilité (pas de rendez-vous à caler)", "Réduction des déplacements (temps, coût, carbone)", "Adaptée aux sinistres fréquents et simples (DDE, petits dommages)", "Interaction directe et immédiate avec l'assuré", "Photos, vidéo, documents partagés en temps réel"],
      limites: ["Vérifications physiques impossibles (humidimètre, sondage, toucher)", "Mauvaise visibilité ou assuré peu à l'aise avec l'outil", "Doute sur l'origine ou plusieurs hypothèses", "Enjeu important (montant, structure, sécurité)", "Incohérences ou suspicion de fraude", "Besoin d'investigations (recherche de fuite) → expertise sur site"]
    },
    qualites: [
      { q: "Écoute", sens: "Laisser l'assuré raconter, repérer les détails utiles (dates, bruits, odeurs) et l'émotion.", question: "Racontez une situation où vous avez dû écouter quelqu'un de contrarié.", bonne: "Un exemple réel (client, chantier) : ce que la personne exprimait, comment j'ai reformulé, ce que ça a permis de comprendre ou de débloquer.", erreur: "« Je suis très à l'écoute » sans exemple." },
      { q: "Bonne élocution", sens: "Parler clairement au téléphone, sans jargon, à un rythme adapté.", question: "Comment adaptez-vous votre façon de parler au téléphone ?", bonne: "Phrases courtes, une idée à la fois, reformulation, vérification que l'autre a compris.", erreur: "Confondre élocution et débit rapide." },
      { q: "Relationnel", sens: "Créer la confiance, rester courtoise même face à la tension.", question: "Comment gérez-vous un interlocuteur agressif ?", bonne: "Laisser l'émotion retomber, reconnaître la gêne, revenir aux faits, proposer une prochaine étape concrète.", erreur: "Dire que ça ne vous atteint jamais." },
      { q: "Aisance avec les outils à distance", sens: "Mener une visio fluide, guider l'assuré dans l'utilisation de son téléphone.", question: "Comment guideriez-vous un assuré âgé peu à l'aise avec la visio ?", bonne: "Consignes simples et une à la fois, patience, alternative (photos envoyées par un proche, appel classique), bascule sur site si besoin.", erreur: "Supposer que tout le monde sait utiliser la visio." },
      { q: "Clarté", sens: "Une conclusion compréhensible : cause, prise en charge, étapes.", question: "Expliquez-moi en une minute ce qu'est un pont thermique.", bonne: "Une image simple + une conséquence concrète (« là où l'isolant s'arrête, le mur est plus froid, l'humidité s'y dépose »).", erreur: "Empiler des termes techniques pour impressionner." },
      { q: "Pédagogie", sens: "Faire comprendre une décision technique ou contractuelle sans la subir.", question: "Comment expliquez-vous la vétusté à un assuré qui la conteste ?", bonne: "Le principe (valeur du bien au jour du sinistre), le calcul concret, ce qui peut être récupéré sur factures selon le contrat.", erreur: "« C'est le contrat, je n'y peux rien. »" },
      { q: "Précision", sens: "Mesures, dates, quantités, unités justes ; rapport factuel.", question: "Comment évitez-vous les erreurs dans un chiffrage ?", bonne: "Métré systématique (formules, déductions), contrôle des unités, relecture, comparaison avec un ordre de grandeur.", erreur: "« Je ne fais jamais d'erreur. »" },
      { q: "Curiosité", sens: "Chercher à comprendre le « pourquoi » d'un désordre.", question: "Quelle est la dernière chose technique que vous avez apprise ?", bonne: "Un exemple précis et récent (ex. pourquoi un pare-vapeur se met côté chaud), comment vous l'avez appris.", erreur: "Une réponse générale sur « aimer apprendre »." },
      { q: "Envie d'apprendre", sens: "Combler vite les lacunes, accepter d'être formée et corrigée.", question: "Vous n'avez pas d'expérience en expertise : comment allez-vous monter en compétence ?", bonne: "Méthode concrète : formation interne, tutorat, cas réels, fiches personnelles, retours du manager ; montrer ce que vous avez déjà fait pour préparer.", erreur: "Minimiser l'écart (« je saurai faire ») ou s'excuser." },
      { q: "Capacité à analyser", sens: "Relier des faits, éliminer des hypothèses.", question: "Une tache au plafond apparaît seulement quand il pleut. Que pensez-vous ?", bonne: "Hypothèse infiltration, mais vérifier : ce qu'il y a au-dessus, exposition, lien avec l'usage de l'eau, autres hypothèses.", erreur: "Conclure immédiatement." },
      { q: "Déterminer les causes", sens: "Distinguer origine, cause, dommage ; fuite, infiltration, condensation.", question: "Quelle différence entre origine et cause ?", bonne: "Origine = où (flexible du voisin) ; cause = pourquoi (rupture par usure) ; dommage = conséquence (plafond).", erreur: "Utiliser les mots indifféremment." },
      { q: "Vérifier les garanties", sens: "Rapprocher les faits du contrat : événement, exclusion, plafond, franchise.", question: "Que vérifiez-vous dans le contrat avant de chiffrer ?", bonne: "Que l'événement est garanti, les exclusions, les plafonds et franchises — en sachant que je donne un avis et que l'assureur décide.", erreur: "Dire que l'expert décide de la prise en charge." },
      { q: "Chiffrer", sens: "Transformer un dommage en travaux, quantités et prix justes.", question: "Comment chiffrez-vous un plafond taché ?", bonne: "Nature du plafond, état après séchage, surface (L × l), impression anti-taches + peinture du plafond entier, vétusté.", erreur: "Donner un prix au m² sans méthode." }
    ],
    economie: [
      ["Constater", "Observer et décrire les dommages et les faits.", "Expert (sur site ou à distance)"],
      ["Métrer", "Mesurer et quantifier les ouvrages (m², ml, U…).", "Expert / économiste"],
      ["Chiffrer", "Valoriser les quantités avec des prix ; vérifier les devis.", "Expert / économiste (Études & Quantum)"],
      ["Expertiser", "Analyser : cause, lien de causalité, avis sur la garantie, évaluation, recours.", "Expert — dans son rapport"],
      ["Décider de l'indemnisation", "Appliquer le contrat et régler l'assuré.", "L'assureur (gestionnaire)"]
    ],
    eco: [
      { t: "Capsens — institut de formation", items: ["[S] Organisme de formation créé par le groupe, d'abord pour ses salariés, puis ouvert aux clients.", "[S] Formateurs = professionnels de terrain en activité ; stages, sur-mesure, présentiel ou mix-learning (e-learning, serious game, mises en situation).", "[I] Pour une nouvelle collaboratrice : la montée en compétence est structurée, par des praticiens."], mur: "Capsens = la formation par ceux qui font le métier" },
      { t: "Keywiiz — solutions digitales", items: ["[S] Suite de services web pour les professionnels de l'assurance : parcours digitaux pour l'assuré sinistré.", "[S] SMART.CARE : digitalise l'expertise et les process de réparation / remplacement (machine learning) pour une indemnisation juste et rapide.", "[S] VEGA : veille, alerte et constat rapide lors d'événements météo de grande ampleur.", "[I] Montre que la technologie sert la rapidité, la justesse et l'anticipation — ce que fait aussi la télé-expertise."], mur: "Keywiiz = digitaliser le parcours sinistre" },
      { t: "Observatoire de la Sécurité des Foyers (OSF)", items: ["[S] Lancé en 2019 par Covéa, Verisure et Saretec.", "[S] Chaque édition traite un thème avec données, analyses d'experts et conseils : cambriolage (2019), incendie domestique (2020), dégât des eaux (guide 2024), chute des seniors.", "[I] Traduit une culture de prévention : l'expérience des sinistres sert à les éviter. Le DDE est aussi le sinistre le plus courant en télé-expertise habitation."], mur: "OSF = prévention des risques domestiques" }
    ],
    rejoindre: [
      "[S] Parcours d'intégration : pré-boarding, dispositif « Côte à côte », parrainage, welcome box.",
      "[S] Formation : plateforme de formation, programme « Envol » pour grandir dans le métier d'expert, « Vis mon job », passerelles internes.",
      "[S] Temps & vie choisie : selon les postes, forfait jour ou temps choisi (4, 4,5 ou 5 jours), accord de télétravail (jusqu'à 80 % sur l'année), droit à la déconnexion.",
      "[S] Partage : intéressement, participation, actionnariat 100 % salarié.",
      "[S] Culture affichée : « Fun & Focus », droit à l'erreur, service client (formation « Luxury Attitude » chez Saretec France)."
    ],
    pourquoi: {
      blocs: [
        ["Mon profil bâtiment", "Ce que ma formation d'architecte m'apporte concrètement.", "Je lis un ouvrage, ses couches, ses points faibles ; je sais lire un plan et dialoguer avec des entreprises."],
        ["Mon intérêt pour l'analyse des sinistres", "Ce qui m'attire dans le fait de comprendre une cause.", "Ce qui me plaît, c'est de remonter d'un dommage à sa cause, comme une enquête."],
        ["Le format télé-expert", "Pourquoi la distance me convient.", "Traiter beaucoup de cas variés, vite, en apprenant énormément, avec des outils numériques que j'utilise naturellement."],
        ["La dimension humaine / pédagogique", "Ma façon d'accompagner un sinistré.", "Expliquer clairement à quelqu'un qui vit un moment pénible ce qui s'est passé et ce qui va suivre."],
        ["L'environnement Saretec", "Un élément PRÉCIS et vérifié qui me parle.", "Le statut d'entreprise à mission, et en particulier la démarche bas carbone sur les chantiers de réparation."],
        ["Apprendre et progresser", "Ce que j'attends de l'entreprise, concrètement.", "Une vraie formation (Capsens, accompagnement des nouveaux), et à terme évoluer vers des dossiers plus complexes."]
      ],
      formulations: [
        "« Je cherchais un poste où ma culture du bâtiment sert à analyser plutôt qu'à concevoir. La télé-expertise chez Saretec me permet de voir beaucoup de sinistres différents, d'en comprendre les causes et de l'expliquer à des personnes qui en ont besoin. »",
        "« Ce qui m'a convaincue, c'est la cohérence entre le métier et la mission : un expert est au bon endroit pour influencer la manière de réparer, et Saretec en a fait un engagement, notamment sur le carbone des chantiers. »",
        "« Je veux un métier où l'on apprend vite et en continu. Chez Saretec, la formation est structurée et le volume de dossiers en télé-expertise permet de progresser rapidement. »",
        "« Ce qui me plaît dans la télé-expertise, c'est le mélange : de la technique, de l'enquête, du chiffrage, et une vraie relation avec l'assuré. »",
        "« Je préfère rejoindre un groupe qui couvre toute la chaîne — prévention, expertise, réparation — parce que ça donne du sens à ce qu'on observe sur chaque dossier. »"
      ],
      eviter: ["« Saretec est leader, donc je veux venir chez vous » (sans argument)", "Flatterie (« entreprise formidable, valeurs exceptionnelles »)", "Discours copiable dans n'importe quelle entreprise", "Mettre le télétravail ou les avantages en première motivation", "Réciter le site internet"]
    },
    express: {
      rouge: [
        "Né en 1977, dans la construction",
        "≈ 450 000 missions traitées en 2025 (saretec-recrute.fr)",
        "Raison d'être : « œuvrer pour un monde plus sûr, pour tous »",
        "Entreprise à mission depuis 2023",
        "Activités : conseil & prévention → expertise → réparation (+ mobilité)",
        "4 pôles : construction, dommages aux biens, protection juridique, RC",
        "Modalités : sur site, téléphone, visio, solutions digitales"
      ],
      jaune: [
        "Société à mission : statuts + objectifs sociaux/environnementaux + comité + OTI (tous les 2 ans chez Saretec)",
        "Objectif Bas Carbone : chantiers de réparation, méthode de mesure, alternatives sans surcoût",
        "Télé-expert : empathie, visio, causes, garanties, chiffrage",
        "Pourquoi / limites de l'expertise à distance",
        "L'expert analyse et chiffre ; l'assureur décide",
        "Études & Quantum : économie de la construction (coûts des réparations)",
        "Capsens : formation par des praticiens"
      ],
      vert: [
        "Keywiiz : digitalisation du parcours sinistre (SMART.CARE, VEGA)",
        "OSF : prévention des risques domestiques (guide DDE 2024)",
        "Actionnariat 100 % salarié",
        "Intégration « Côte à côte », programme « Envol »",
        "Télé-expertise = moins de déplacements (lien carbone)",
        "Culture : service client, droit à l'erreur"
      ]
    },
    sources: [
      ["Site officiel — accueil, Notre Groupe", "https://www.saretec.fr/fr/le-groupe/notre-groupe", "Histoire, chaîne de valeur, raison d'être"],
      ["SARETEC, entreprise à mission", "https://www.saretec.fr/fr/saretec-entreprise-a-mission", "Objectifs statutaires, OTI, 2023"],
      ["Notre Responsabilité Sociétale", "https://www.saretec.fr/fr/notre-responsabilite-societale", "Charte achats responsables, rapport de durabilité 2025"],
      ["Objectif Bas Carbone", "https://www.saretec.fr/fr/BasCarbone", "Page NON DATÉE : chiffres à citer avec prudence"],
      ["Économie de la construction — Études & Quantum", "https://www.saretec.fr/fr/activites/reparation/etudes-quantum", "Offre et rôle"],
      ["Capsens", "https://www.saretec.fr/fr/activites/conseil-prevention/capsens", "Institut de formation"],
      ["Keywiiz", "https://www.saretec.fr/fr/activites/conseil-prevention/keywiiz", "Solutions digitales"],
      ["Observatoire de la Sécurité des Foyers", "https://www.saretec.fr/fr/activites/conseil-prevention/observatoire-de-la-securite-des-foyers", "Prévention, thèmes annuels"],
      ["Saretec France — expertise d'assurance", "https://www.saretec.fr/fr/activites/expertise/saretec-france", "Pôles, risques, modalités (dont visio)"],
      ["Saretec recrute — Tout savoir / chiffres", "https://www.saretec-recrute.fr/tout-savoir-sur-saretec/", "Chiffres 2024-2025 (la même page indique « 2 000 femmes et hommes » dans le texte et « 2 500 collaborateurs » dans les chiffres)"],
      ["Saretec recrute — Télé-expert(e)", "https://www.saretec-recrute.fr/decouvrez-nos-metiers/tele-expert/", "Missions et qualités du poste"],
      ["Saretec recrute — Raisons de nous rejoindre", "https://www.saretec-recrute.fr/les-raisons-de-nous-rejoindre/", "Intégration, formation, temps de travail, partage"],
      ["Rapport de mission 2025-2026 (3e édition)", "https://heyzine.com/flip-book/02ef418ffa.html", "Seul l'édito a été parcouru ici : lisez au moins le sommaire et l'édito"],
      ["LinkedIn / YouTube (« L'expertise à distance », « Saretec en images »)", "https://www.youtube.com/@GroupesaretecFR", "Non analysés ici : regardez les 2 vidéos (quelques minutes) avant l'entretien"]
    ]
  };

  // ---------------- Simulation RH : 20 questions ----------------
  // a = points attendus (kw détectés), d = formulations dangereuses spécifiques, m = version améliorée naturelle
  window.SARETEC_RH = [
    { q: "Que savez-vous de Saretec ?", a: [
      { t: "Activité : expertise après sinistre au service des assureurs, de la prévention à la réparation", kw: ["expertise", "assureur", "prevention", "reparation", "sinistre"] },
      { t: "Un repère concret (1977 / construction / ≈ 450 000 missions en 2025)", kw: ["1977", "450", "construction", "missions"] },
      { t: "Entreprise à mission ou démarche bas carbone", kw: ["mission", "carbone"] },
      { t: "Lien avec le poste : expertise à distance", kw: ["distance", "visio", "tele-expert", "teleexpert"] },
      { t: "Une touche personnelle (ce qui m'a marquée)", kw: ["m'a marque", "m'a frappe", "ce qui me parle", "ce qui m'interesse", "j'ai retenu"] }],
      m: "C'est un groupe d'expertise après sinistre, né en 1977 dans la construction, qui travaille pour les assureurs de la prévention jusqu'à la réparation — de l'ordre de 450 000 missions en 2025. Ce que j'ai surtout retenu, c'est la place de l'expertise à distance, qui est le poste que je vise, et le statut d'entreprise à mission, avec par exemple un travail sur le carbone des chantiers de réparation." },
    { q: "Pourquoi Saretec ?", a: [
      { t: "Lien avec mon profil bâtiment", kw: ["architecte", "batiment", "ouvrage", "construction"] },
      { t: "Intérêt pour l'analyse des causes", kw: ["cause", "analyse", "comprendre", "enquete"] },
      { t: "Un élément spécifique et vérifié de Saretec", kw: ["mission", "carbone", "distance", "formation", "capsens", "prevention"] },
      { t: "Ce que je veux apprendre / faire évoluer", kw: ["apprendre", "progresser", "former", "evoluer"] }],
      m: "Parce que c'est un endroit où ma culture du bâtiment sert directement : comprendre pourquoi un ouvrage a été endommagé et chiffrer sa réparation. Et parce que Saretec a fait de l'expertise à distance un vrai métier, avec une formation structurée. Le statut d'entreprise à mission, notamment sur le carbone des réparations, me conforte dans l'idée que ce travail a du sens." },
    { q: "Qu'avez-vous retenu de notre statut d'entreprise à mission ?", a: [
      { t: "Engagements inscrits dans les statuts", kw: ["statut", "statuts"] },
      { t: "Objectifs sociaux ET environnementaux", kw: ["social", "sociaux", "environnement"] },
      { t: "Contrôle externe (OTI) / pas qu'une déclaration", kw: ["controle", "independant", "oti", "verifie", "audit"] },
      { t: "Lien concret avec le métier d'expert", kw: ["reparation", "expert", "sinistre", "carbone", "assure"] }],
      m: "Que ce n'est pas seulement une déclaration : depuis 2023, Saretec a inscrit dans ses statuts une raison d'être — un monde plus sûr pour tous — et des objectifs sociaux et environnementaux vérifiés par un organisme indépendant. Et c'est cohérent : l'expert influence la manière de réparer et accompagne des personnes fragilisées." },
    { q: "Que signifie pour vous notre démarche bas carbone ?", a: [
      { t: "Cible : les chantiers de réparation après sinistre", kw: ["chantier", "reparation"] },
      { t: "Levier : chiffrage / choix des matériaux ou procédés", kw: ["chiffrage", "materiau", "peinture", "procede", "reparer plutot"] },
      { t: "Sans surcoût pour l'assuré", kw: ["sans surcout", "meme prix", "prix equivalent"] }],
      m: "Que le carbone ne concerne pas que le neuf : chaque réparation après sinistre consomme des matériaux. L'expert, par son chiffrage, peut orienter vers une solution moins émissive — réparer plutôt que remplacer, une peinture recyclée — au même prix et sans léser l'assuré." },
    { q: "Pourquoi le métier de Télé-Expert ?", a: [
      { t: "Analyse technique (causes, garanties, chiffrage)", kw: ["cause", "garantie", "chiffr"] },
      { t: "Relation avec l'assuré / pédagogie", kw: ["assure", "pedagog", "expliquer", "accompagner", "ecoute"] },
      { t: "Atouts du format distance (volume, variété, apprentissage)", kw: ["variete", "beaucoup de", "rapide", "apprendre", "distance", "visio"] }],
      m: "Parce qu'il combine ce que j'aime : comprendre un désordre, vérifier ce que couvre le contrat et chiffrer, tout en accompagnant l'assuré. Et le format à distance permet de voir beaucoup de cas variés — c'est la meilleure façon d'apprendre vite." },
    { q: "Pourquoi l'expertise à distance ?", a: [
      { t: "Avantages : rapidité, accessibilité, moins de déplacements", kw: ["rapid", "accessib", "deplacement"] },
      { t: "Adaptée aux sinistres fréquents / simples", kw: ["frequent", "simple", "courant"] },
      { t: "Conscience des limites et de la bascule sur site", kw: ["limite", "sur site", "visite", "se deplacer"] }],
      m: "Parce qu'elle permet de prendre en charge vite l'assuré pour les sinistres fréquents, sans attendre un rendez-vous, et qu'elle évite des déplacements. Mais elle demande de la rigueur : bien guider la visio, et savoir dire quand il faut une expertise sur site — doute sur l'origine, enjeu important, structure." },
    { q: "Comment imaginez-vous votre rôle ?", a: [
      { t: "Étapes : contact, causes, observation, garanties, chiffrage, rapport", kw: ["cause", "garantie", "chiffr", "rapport", "visio"] },
      { t: "L'assureur décide (l'expert donne un avis)", kw: ["assureur decide", "avis", "pour le compte"] },
      { t: "Accompagnement de l'assuré", kw: ["assure", "expliquer", "accompagn"] }],
      m: "Je me vois comme le lien technique entre l'assuré et l'assureur : je comprends ce qui s'est passé, j'observe les dommages en visio, je vérifie le cadre du contrat, je chiffre, et je rédige un rapport clair sur lequel l'assureur peut décider. Et pendant tout ce temps, j'explique à l'assuré où on en est." },
    { q: "Comment gérez-vous un assuré mécontent ?", a: [
      { t: "Écouter / laisser exprimer", kw: ["ecout", "laisser parler", "exprimer"] },
      { t: "Reformuler / reconnaître", kw: ["reformul", "comprends", "reconnai"] },
      { t: "Expliquer factuellement", kw: ["expliqu", "fait", "calcul", "contrat"] },
      { t: "Proposer une suite concrète / tracer", kw: ["prochaine etape", "solution", "proposer", "tracer", "ecrit"] }],
      m: "Je le laisse d'abord s'exprimer, je reformule pour lui montrer que j'ai compris, puis je reviens aux faits : ce qui a été constaté, ce que prévoit le contrat, le calcul. Je propose une suite concrète — un justificatif à fournir, un réexamen — et je trace l'échange." },
    { q: "Comment expliquez-vous une conclusion technique à quelqu'un qui ne connaît rien au bâtiment ?", a: [
      { t: "Mots simples / image ou comparaison", kw: ["simple", "image", "comparaison", "exemple", "sans jargon"] },
      { t: "Conséquence concrète pour lui", kw: ["consequence", "concret", "pour lui", "ce que ca change"] },
      { t: "Vérifier la compréhension", kw: ["verifier", "compris", "reformuler", "questions"] }],
      m: "Avec une image simple et une conséquence concrète. Par exemple : « l'eau du voisin a traversé le plancher ; votre plafond est sec et solide, donc on n'a pas besoin de le remplacer, on le traite pour que la tache ne revienne pas et on repeint ». Puis je vérifie qu'il a compris et qu'il n'a pas de questions." },
    { q: "Que faites-vous lorsque vous ne connaissez pas la réponse ?", a: [
      { t: "Ne pas inventer / le dire", kw: ["ne pas inventer", "je le dis", "honnete", "je ne devine"] },
      { t: "Méthode : vérifier (documentation, DTU, collègue, manager)", kw: ["verifi", "collegue", "manager", "dtu", "documentation", "recherche"] },
      { t: "Revenir vers la personne avec la réponse", kw: ["revenir", "rappeler", "recontacter"] }],
      m: "Je ne devine pas. Je dis que je vérifie, je cherche — documentation, DTU, un collègue ou mon manager — et je reviens vers la personne avec une réponse fiable, dans le délai annoncé." },
    { q: "Comment gérez-vous un volume important de dossiers ?", a: [
      { t: "Priorisation (urgences, délais)", kw: ["priori", "urgen", "delai"] },
      { t: "Organisation / outils / trames", kw: ["organis", "planning", "outil", "trame", "liste"] },
      { t: "Exemple concret vécu", kw: ["par exemple", "lors de", "quand j'", "en agence", "projet"] }],
      m: "Je priorise : sécurité et mesures conservatoires d'abord, puis les délais. Je m'appuie sur des trames pour gagner du temps sans perdre en qualité, et je traite au fil de l'eau. En agence d'architecture, je gérais plusieurs projets en parallèle avec des échéances différentes : c'est la même logique." },
    { q: "Comment garantissez-vous la qualité de vos analyses ?", a: [
      { t: "Méthode (faits → hypothèses → vérification)", kw: ["hypothese", "fait", "verifi", "methode"] },
      { t: "Contrôles (métré, unités, relecture)", kw: ["relecture", "relire", "controle", "unite", "metre"] },
      { t: "Accepter les retours / supervision", kw: ["retour", "manager", "supervision", "audit", "qualite"] }],
      m: "Par une méthode constante : je pars des faits, je formule des hypothèses et je vérifie chacune avant de conclure. Côté chiffrage, je contrôle les unités et les quantités et je relis. Et j'utilise les retours de mon manager ou du contrôle qualité pour m'améliorer." },
    { q: "Comment réagissez-vous à une erreur ?", a: [
      { t: "La reconnaître rapidement", kw: ["reconnai", "assumer", "signaler"] },
      { t: "La corriger / limiter l'impact", kw: ["corrig", "rectifi", "limiter"] },
      { t: "En tirer une leçon / un exemple", kw: ["lecon", "apprendre", "eviter", "exemple", "depuis"] }],
      m: "Je la signale tout de suite, je la corrige et je préviens les personnes concernées. Ensuite je cherche pourquoi elle est arrivée pour ne pas la reproduire — par exemple, j'ai mis en place une check-list de contrôle après une erreur de quantité sur un métré." },
    { q: "Pourquoi devrions-nous vous choisir malgré votre absence d'expérience directe en expertise sinistre ?", a: [
      { t: "Atouts transférables (lecture des ouvrages, plans, entreprises)", kw: ["architecte", "batiment", "ouvrage", "plan", "chantier", "entreprise"] },
      { t: "Preuve de ma capacité à apprendre (préparation faite)", kw: ["prepar", "revis", "appris", "formation", "fiche"] },
      { t: "Qualités relationnelles / pédagogiques", kw: ["pedagog", "relation", "client", "expliquer"] },
      { t: "Ton assumé, sans s'excuser", kw: [] }],
      d: [{ t: "S'excuser ou se dévaloriser (« je ne suis qu'architecte », « je sais que je n'ai pas le niveau »)", kw: ["je ne suis qu", "pas le niveau", "desolee", "malheureusement"] }],
      m: "Parce que j'arrive avec une vraie lecture du bâtiment — les ouvrages, leurs couches, la façon dont ils vieillissent — et l'habitude d'expliquer des sujets techniques à des non-spécialistes. Ce qui me manque, c'est la pratique de l'assurance et de l'expertise : je m'y suis déjà mise, et Saretec forme ses nouveaux experts. Je pense être rapidement opérationnelle sur les dossiers fréquents." },
    { q: "Qu'attendez-vous de votre manager ?", a: [
      { t: "Des retours réguliers / exigeants", kw: ["retour", "feedback", "corrig"] },
      { t: "Un cadre clair (objectifs, priorités)", kw: ["cadre", "objectif", "priorit", "clair"] },
      { t: "Disponibilité au démarrage / partage d'expérience", kw: ["disponib", "experience", "accompagn", "conseil"] }],
      m: "Des retours réguliers et francs, surtout au début, pour progresser vite ; un cadre clair sur les priorités et les attentes ; et qu'il partage son expérience sur les cas difficiles. En retour, j'apporte de la rigueur et je pose mes questions au bon moment." },
    { q: "Comment apprenez-vous une nouvelle méthode ?", a: [
      { t: "Comprendre le pourquoi", kw: ["pourquoi", "comprendre", "logique"] },
      { t: "Pratiquer sur cas réels / exemples", kw: ["pratiqu", "cas", "exemple", "appliqu"] },
      { t: "Supports personnels (fiches, schémas)", kw: ["fiche", "schema", "note", "resume"] },
      { t: "Demander des retours", kw: ["retour", "demander", "corrig"] }],
      m: "Je commence par comprendre la logique, puis je l'applique tout de suite sur des cas concrets. Je me fais des fiches et des schémas — c'est ce que j'ai fait pour préparer ce poste — et je demande qu'on corrige mes premiers dossiers." },
    { q: "Où vous voyez-vous dans quelques années ?", a: [
      { t: "Experte autonome et fiable", kw: ["autonome", "fiable", "experte", "experimente"] },
      { t: "Évolution réaliste (spécialisation, dossiers complexes, terrain)", kw: ["special", "complexe", "terrain", "construction", "evoluer"] },
      { t: "Ancrage dans l'entreprise", kw: ["saretec", "ici", "rester", "au sein"] }],
      m: "D'abord télé-experte autonome et fiable sur les dossiers habitation. Ensuite, j'aimerais aller vers des dossiers plus complexes, peut-être en construction, où ma formation d'architecte serait encore plus utile — idéalement en continuant à grandir chez Saretec." },
    { q: "Qu'est-ce qui vous motive dans ce poste ?", a: [
      { t: "Le contenu (analyse, causes, chiffrage)", kw: ["analyse", "cause", "chiffr", "comprendre"] },
      { t: "L'utilité pour l'assuré", kw: ["utile", "aider", "assure", "accompagner"] },
      { t: "Apprendre en continu", kw: ["apprendre", "varie", "variete"] }],
      d: [{ t: "Mettre en avant d'abord le télétravail, le salaire ou les avantages", kw: ["teletravail", "salaire", "avantage", "horaires"] }],
      m: "Le fait de résoudre un vrai problème à chaque dossier : comprendre ce qui s'est passé, trouver la réparation juste, et que l'assuré reparte en sachant où il en est. Et le fait d'apprendre tous les jours, parce qu'aucun sinistre ne ressemble à un autre." },
    { q: "Qu'est-ce qui pourrait vous mettre en difficulté ?", a: [
      { t: "Une difficulté réelle et crédible", kw: ["difficult", "au debut", "manque", "pas encore"] },
      { t: "Ce que je fais pour y remédier", kw: ["pour y remedier", "je travaille", "je me suis", "formation", "methode", "revis", "j'ai mis"] }],
      d: [{ t: "Répondre « rien » ou un faux défaut (« je suis trop perfectionniste »)", kw: ["perfectionniste", "rien ne", "aucune difficulte"] }],
      m: "Au début, la partie assurance : savoir rapidement ce qui est garanti ou non selon les contrats. C'est pour ça que j'ai commencé à structurer ces notions, et je compte sur la formation et les retours de mon manager pour l'acquérir vite. Les appels très chargés émotionnellement demandent aussi de l'énergie : je m'appuie sur une trame pour rester claire." },
    { q: "Avez-vous des questions pour nous ?", a: [
      { t: "Question sur l'intégration / la formation", kw: ["formation", "integration", "tutorat", "cote a cote", "accompagnement"] },
      { t: "Question sur le quotidien du poste (volume, types de dossiers, outils)", kw: ["dossiers", "par jour", "outil", "quotidien", "types"] },
      { t: "Question sur l'évolution ou la mission", kw: ["evolution", "mission", "carbone", "perspective"] }],
      d: [{ t: "Poser d'abord une question sur les congés / avantages, ou n'avoir aucune question", kw: ["conges", "rtt", "pas de question", "non merci"] }],
      m: "Oui : comment se passent les premières semaines d'un télé-expert — formation, accompagnement, premiers dossiers ? Quels types de sinistres traite-t-on le plus sur le plateau ? Et comment la démarche bas carbone se traduit-elle concrètement dans le travail du télé-expert ?" }
  ];

  // Formulations dangereuses communes à toutes les réponses RH
  window.SARETEC_DANGERS = [
    { t: "« Leader » utilisé comme argument principal, sans explication", kw: ["leader"] },
    { t: "Cliché vide (« dynamique et motivée », « perfectionniste », « passionnée » sans exemple)", kw: ["dynamique et motive", "perfectionniste", "je suis passionnee", "motivee et dynamique"] },
    { t: "Présenter l'expert comme celui qui décide ou paie l'indemnisation", kw: ["je decide", "l'expert decide", "je rembourse", "je paie", "j'indemnise"] },
    { t: "Promettre à l'assuré une prise en charge", kw: ["je lui promets", "je garantis", "promettre"] },
    { t: "Parler négativement d'un ancien employeur ou de l'architecture", kw: ["nul", "mauvais patron", "j'en avais marre", "je deteste"] },
    { t: "Hésitation non assumée (« je ne sais pas trop », « un peu au hasard »)", kw: ["je ne sais pas trop", "un peu au hasard", "par defaut"] }
  ];
})();
