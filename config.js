/* =====================================================================
   ZANZIBAR · CATERING & EVENTI — config.js
   Qui ci sono TUTTI i dati e i testi del sito: per il cliente vero
   si cambia solo questo file.
   - "// DA CONFERMARE" = dato segnaposto da chiedere al cliente.
   - "// TESTO DI ESEMPIO DA CONFERMARE" = testo di bozza da far approvare.
   - Nei testi, una parola tra *asterischi* diventa corsivo.
   Dopo aver cambiato titoli o descrizioni delle pagine (le voci "meta"),
   rigenera le pagine con:  node _strumenti/genera.mjs
   ===================================================================== */
window.SITO = (() => {

  /* Voci di "Cosa possiamo curare", uguali per tutti gli eventi
     (ogni evento può cambiarne qualcuna più sotto). */
  const CURA = { // TESTO DI ESEMPIO DA CONFERMARE
    aperitivo: ["Aperitivo di benvenuto", "Calici, analcolici e assaggi caldi per accogliere gli ospiti appena arrivano."],
    buffet: ["Buffet", "Isole di antipasti, primi o dolci, sempre in ordine e rinnovate durante la festa."],
    tavolo: ["Servizio al tavolo", "Portate servite dal nostro personale, con i tempi giusti tra un piatto e l'altro."],
    torta: ["Torta", "La torta della festa, con il momento del taglio e il servizio al tavolo."],
    bar: ["Open bar", "Un angolo bar con chi prepara spritz, cocktail e analcolici per tutta la serata."],
    allestimento: ["Allestimento", "Tavoli, tovagliato, piatti, bicchieri e posate; su richiesta fiori e luci."],
    personale: ["Personale", "Camerieri e cuochi in divisa, coordinati da un responsabile per tutto l'evento."],
  };

  /* Domande frequenti, uguali per tutti gli eventi */
  const FAQ = { // TESTO DI ESEMPIO DA CONFERMARE
    ospiti: ["C'è un numero minimo di ospiti?", "Dipende dal tipo di servizio. Scrivici il numero indicativo di invitati e ti diciamo subito quale formula è adatta."],
    zone: ["In quali zone lavorate?", "Partiamo da Torre de' Passeri e lavoriamo a Pescara, Chieti e nelle rispettive province. Per altre zone chiedici: valutiamo caso per caso."],
    anticipo: ["Con quanto anticipo bisogna prenotare?", "Prima ci contatti, più date troviamo libere, soprattutto per i fine settimana da maggio a settembre. Scrivici appena hai la data."],
    allergie: ["Gestite allergie e intolleranze?", "Sì: indicale nella richiesta di preventivo. Prepariamo piatti dedicati, serviti a parte e ben riconoscibili."],
  };

  return {
    nome: "Zanzibar",
    sottotitolo: "Catering & Eventi", // DA CONFERMARE (nome provvisorio)
    descrizione: "Catering per matrimoni, cerimonie, feste private ed eventi aziendali tra Torre de' Passeri, Pescara e Chieti.", // TESTO DI ESEMPIO DA CONFERMARE
    indirizzoSito: "https://carestiadavide2004-cmd.github.io/bozza-zanzibar-catering/", // indirizzo della bozza online

    contatti: {
      telefono: "000 000 0000",        // DA CONFERMARE
      telefonoLink: "+390000000000",   // DA CONFERMARE (lo stesso numero, senza spazi)
      whatsapp: "390000000000",        // DA CONFERMARE (39 + numero, senza + e senza spazi)
      email: "info@esempio.it",        // DA CONFERMARE
      indirizzo: "Via Esempio 1",      // DA CONFERMARE
      cap: "65029",                    // DA CONFERMARE
      citta: "Torre de' Passeri",
      provincia: "PE",
    },

    zona: { // DA CONFERMARE
      testo: "Torre de' Passeri, Pescara, Chieti e provincia",
      luoghi: ["Torre de' Passeri", "Pescara e provincia", "Chieti e provincia"],
      nota: "Per altre zone chiedici: valutiamo caso per caso.", // TESTO DI ESEMPIO DA CONFERMARE
    },

    /* Orari in cui rispondiamo (servono per "Rispondiamo ora / Ora chiusi").
       0 = domenica, 1 = lunedì … 6 = sabato. [] = chiuso. */
    orari: { // DA CONFERMARE
      etichetta: "Rispondiamo al telefono",
      giorni: {
        1: [["09:00", "13:00"], ["15:30", "19:30"]],
        2: [["09:00", "13:00"], ["15:30", "19:30"]],
        3: [["09:00", "13:00"], ["15:30", "19:30"]],
        4: [["09:00", "13:00"], ["15:30", "19:30"]],
        5: [["09:00", "13:00"], ["15:30", "19:30"]],
        6: [["09:00", "13:00"]],
        0: [],
      },
      testo: "Lun–Ven 9–13 e 15:30–19:30 · Sab 9–13",
    },

    social: { // DA CONFERMARE (indirizzi delle pagine vere)
      instagram: "https://www.instagram.com/",
      facebook: "https://www.facebook.com/",
    },

    legale: { // DA CONFERMARE: tutti i dati legali
      ragioneSociale: "Nome attività S.r.l.",
      piva: "00000000000",
      codiceFiscale: "00000000000",
      sedeLegale: "Via Esempio 1, 65029 Torre de' Passeri (PE)",
      emailPrivacy: "privacy@esempio.it",
      pec: "nomeattivita@pec.it",
      aggiornamentoPrivacy: "19 novembre 2026",
    },

    /* Chiave del modulo (la crea il cliente, gratis, su web3forms.com).
       Finché resta questo segnaposto il modulo NON invia nulla. */
    web3formsKey: "INSERIRE-CHIAVE-WEB3FORMS", // DA CONFERMARE

    /* Messaggio già scritto per WhatsApp: {evento} diventa il tipo di evento scelto */
    whatsappMessaggio: "Ciao Zanzibar! Vorrei un preventivo per {evento}.", // TESTO DI ESEMPIO DA CONFERMARE

    home: { // TESTO DI ESEMPIO DA CONFERMARE (tutti i testi della home)
      meta: {
        titolo: "Zanzibar · Catering & Eventi a Torre de' Passeri",
        descrizione: "Catering per matrimoni, comunioni, compleanni, eventi aziendali, aperitivi e lauree tra Torre de' Passeri, Pescara e Chieti.",
      },
      heroSottotitolo: "Catering per matrimoni, cerimonie e feste, tra Pescara e Chieti.",
      intro: {
        etichetta: "Il catering dello Zanzibar",
        frase: "Portiamo la cucina di casa dove si festeggia, con il servizio di una *sala* elegante.",
        testo: "Siamo lo Zanzibar di Torre de' Passeri. Oltre al bar, prepariamo catering per matrimoni, cerimonie, feste private ed eventi aziendali. Ogni proposta nasce da un incontro: ascoltiamo, assaggiamo insieme e poi pensiamo a tutto noi.",
        foto: "antipasti-nei-calici",
      },
      eventi: {
        etichetta: "Eventi",
        titolo: "Ogni festa ha il suo *sapore*",
        testo: "Scegli il tuo evento: per ognuno trovi come lavoriamo, cosa possiamo curare e una proposta di esempio.",
      },
      passi: {
        etichetta: "Come lavoriamo",
        titolo: "Dal primo caffè al *giorno* della festa",
        testo: "Cinque passaggi, sempre gli stessi, perché ogni festa riesca senza sorprese.",
        lista: [
          ["Primo contatto", "Ci racconti data, luogo, numero di ospiti e che festa hai in mente. Ti rispondiamo con le prime idee."],
          ["Sopralluogo", "Veniamo a vedere il posto: spazi, cucina d'appoggio, percorsi del servizio, luce e orari."],
          ["Degustazione", "Assaggi i piatti proposti, così scegli con calma e con il palato, non solo sulla carta."],
          ["Menù su misura", "Mettiamo per iscritto menù, allestimento, personale e tempi della giornata."],
          ["Il giorno dell'evento", "Arriviamo prima degli ospiti, allestiamo, serviamo e lasciamo tutto in ordine."],
        ],
      },
      galleria: {
        etichetta: "Galleria",
        titolo: "Il nostro *mestiere*, da vicino",
      },
      recensioni: {
        titolo: "Recensioni di esempio",
        nota: "Testi segnaposto: qui andranno le recensioni vere dei clienti.",
        lista: [
          ["Ci hanno seguito dal primo incontro all'ultimo brindisi. Gli ospiti parlano ancora degli arrosticini all'aperitivo.", "Cliente di esempio", "Matrimonio"],
          ["Pranzo della comunione in giardino: tutto puntuale, bambini compresi. Noi ci siamo solo goduti la giornata.", "Cliente di esempio", "Prima comunione"],
          ["Coffee break e pranzo per il nostro convegno: servizio discreto e tavoli sempre in ordine.", "Cliente di esempio", "Evento aziendale"],
        ],
      },
      preventivo: {
        etichetta: "Preventivo",
        titolo: "Raccontaci la tua *festa*",
        testo: "Scrivici data, luogo e numero di ospiti: ti rispondiamo con una proposta su misura, senza impegno.",
      },
      contatti: {
        etichetta: "Contatti",
        titolo: "Dove *lavoriamo*",
        testo: "Partiamo da Torre de' Passeri e arriviamo dove serve: in villa, in sala, in giardino o a casa tua.",
      },
    },

    /* ---------------- EVENTI ----------------
       chiave: nome delle cartelle di foto e video · pagina: file in /eventi/
       titolo: la parola gigante nella hero · posizioneTitolo: "alto" o "basso"
       (dove il video ha spazio libero, per non coprire le persone) */
    eventi: [
      {
        chiave: "matrimoni",
        pagina: "matrimoni",
        nome: "Matrimoni",
        titolo: "Matrimoni",
        posizioneTitolo: "alto",
        // TESTO DI ESEMPIO DA CONFERMARE (da qui fino a "faq")
        sopratitolo: "Catering per il ricevimento",
        breve: "Il ricevimento, dall'aperitivo al taglio della torta.",
        heroSottotitolo: "Aperitivo, cena e torta: il vostro ricevimento, curato da chi conosce la cucina di qui.",
        meta: {
          titolo: "Catering per matrimoni · Zanzibar Catering & Eventi",
          descrizione: "Catering per matrimoni tra Pescara, Chieti e provincia: aperitivo di benvenuto, menù su misura, servizio al tavolo e allestimento.",
        },
        intro: {
          frase: "Il giorno del *sì* merita una tavola che vi somigli.",
          testo: "Partiamo da voi: il luogo, il numero di invitati, i piatti che vi raccontano. Costruiamo il ricevimento passo dopo passo, con una degustazione prima di decidere e una squadra in sala che segue il ritmo della festa, dal brindisi al taglio della torta.",
          foto: "tavola-sotto-il-porticato",
        },
        passi: [
          ["Il primo incontro", "Ci raccontate data, location, numero di invitati e lo stile che avete in mente."],
          ["Il sopralluogo", "Visitiamo la location con voi: cucina d'appoggio, spazi per il buffet, percorsi del servizio."],
          ["La degustazione", "Assaggiate le proposte e scegliete il menù con calma, piatto per piatto."],
          ["Gli ultimi dettagli", "Fissiamo tempi, allestimento, tavolo degli sposi e personale in sala."],
          ["Il giorno del matrimonio", "Arriviamo per primi e andiamo via per ultimi: voi pensate solo a festeggiare."],
        ],
        cura: [CURA.aperitivo, CURA.buffet, CURA.tavolo, ["Torta nuziale", "Il taglio della torta come momento della festa, con servizio al tavolo e brindisi."], CURA.bar, CURA.allestimento, CURA.personale],
        proposta: [
          ["Aperitivo di benvenuto", ["Bollicine, cocktail analcolici e acqua aromatizzata", "Arrosticini cotti al momento", "Pallotte cacio e uova, olive ripiene e fritti caldi", "Salumi e pecorini del territorio"]],
          ["Antipasto", ["Tartare di manzo con insalatina e scaglie di pecorino"]],
          ["Primi", ["Maccheroni alla chitarra con ragù bianco", "Risotto allo zafferano dell'Aquila"]],
          ["Secondo", ["Agnello al forno con patate al rosmarino"]],
          ["Dolce", ["Torta nuziale a vostra scelta", "Confettata con confetti di Sulmona"]],
          ["In tavola", ["Vini d'Abruzzo: Pecorino, Trebbiano e Montepulciano", "Acqua, caffè e amari"]],
        ],
        faq: [FAQ.ospiti, FAQ.zone, FAQ.anticipo, FAQ.allergie],
      },
      {
        chiave: "comunioni",
        pagina: "comunioni-battesimi-cresime",
        nome: "Comunioni, battesimi e cresime",
        titolo: "Cerimonie",
        posizioneTitolo: "basso",
        // TESTO DI ESEMPIO DA CONFERMARE (da qui fino a "faq")
        sopratitolo: "Comunioni, battesimi e cresime",
        breve: "Il pranzo di famiglia, in giardino o in sala.",
        heroSottotitolo: "Il pranzo della festa, curato da noi: voi godetevi la giornata con la famiglia.",
        meta: {
          titolo: "Catering per comunioni, battesimi e cresime · Zanzibar",
          descrizione: "Catering per comunioni, battesimi e cresime tra Pescara e Chieti: pranzo in giardino o in sala, menù per grandi e bambini, torta e confettata.",
        },
        intro: {
          frase: "Una giornata di *famiglia*, senza pensieri per chi la organizza.",
          testo: "Comunione, battesimo o cresima: a casa, in giardino o in sala, prepariamo un pranzo che mette d'accordo nonni e bambini. Pensiamo noi a cucina, servizio e confettata, così voi restate con i vostri ospiti.",
          foto: "abito-della-comunione",
        },
        passi: [
          ["Primo contatto", "Ci dite data, luogo e numero di ospiti, bambini compresi."],
          ["Sopralluogo", "Se la festa è a casa o in giardino, veniamo a vedere spazi e cucina d'appoggio."],
          ["Assaggio", "Assaggiate le proposte e scegliete il menù per grandi e piccoli."],
          ["Menù e allestimento", "Definiamo menù, tavolo dei dolci, confettata e orari."],
          ["Il giorno della festa", "Allestiamo, serviamo e alla fine sistemiamo tutto."],
        ],
        cura: [CURA.aperitivo, CURA.buffet, CURA.tavolo, ["Torta e confettata", "La torta della cerimonia e un tavolo di confetti e piccoli dolci."], ["Bevande", "Succhi, analcolici e vini per gli adulti, serviti al tavolo o al buffet."], CURA.allestimento, CURA.personale],
        proposta: [
          ["Aperitivo", ["Succhi di frutta, bollicine e analcolici", "Rustici, pizzette e sfogliatine calde"]],
          ["Antipasto", ["Salumi e formaggi del territorio con verdure sott'olio", "Frittatine alle erbe e ricotta fresca"]],
          ["Primi", ["Lasagna al forno con ragù di carne", "Gnocchi al pomodoro fresco e basilico"]],
          ["Secondo", ["Arrosto di vitello con patate al forno"]],
          ["Per i bambini", ["Pasta al pomodoro", "Cotoletta con patate al forno"]],
          ["Dolce", ["Torta della cerimonia", "Confettata con confetti di Sulmona"]],
        ],
        faq: [FAQ.ospiti, FAQ.zone, FAQ.anticipo, FAQ.allergie],
      },
      {
        chiave: "compleanni",
        pagina: "compleanni-feste-private",
        nome: "Compleanni e feste private",
        titolo: "Compleanni",
        posizioneTitolo: "alto",
        // TESTO DI ESEMPIO DA CONFERMARE (da qui fino a "faq")
        sopratitolo: "Compleanni e feste private",
        breve: "Feste in giardino, cene tra amici, anniversari.",
        heroSottotitolo: "Compleanni, anniversari e feste private: dalla cena in giardino al buffet in casa.",
        meta: {
          titolo: "Catering per compleanni e feste private · Zanzibar",
          descrizione: "Catering per compleanni, anniversari e feste private tra Pescara e Chieti: buffet, cene in giardino, torta e open bar.",
        },
        intro: {
          frase: "Voi pensate agli *invitati*, alla tavola pensiamo noi.",
          testo: "Un compleanno importante, un anniversario, una cena tra amici in giardino: portiamo cucina, personale e tutto il necessario, dal primo calice alla torta con le candeline.",
          foto: "calici-alzati-candele",
        },
        passi: [
          ["Due parole al telefono", "Ci dici che festa è, quanti siete e dove."],
          ["La proposta", "Ti mandiamo un'idea di menù: buffet, cena servita o aperitivo lungo."],
          ["Assaggio e scelte", "Su richiesta assaggi i piatti, poi scegli torta e bevande."],
          ["Allestimento", "Prepariamo tavoli, luci e angolo bar secondo lo spazio."],
          ["La festa", "Serviamo, teniamo tutto in ordine e al momento giusto arriva la torta."],
        ],
        cura: [CURA.aperitivo, CURA.buffet, CURA.tavolo, ["Torta di compleanno", "La torta con le candeline, portata al momento giusto e servita a tutti."], CURA.bar, CURA.allestimento, CURA.personale],
        proposta: [
          ["Aperitivo", ["Spritz, bollicine e cocktail analcolici", "Olive, taralli e chips di verdure"]],
          ["Buffet", ["Arrosticini cotti al momento", "Pizza al taglio e focacce farcite", "Taglieri di salumi e formaggi", "Insalate di stagione"]],
          ["Dolce", ["Torta di compleanno su ordinazione", "Frutta fresca a pezzi"]],
          ["Al bar", ["Vini d'Abruzzo, birra, acqua e caffè"]],
        ],
        faq: [FAQ.ospiti, FAQ.zone, FAQ.anticipo, FAQ.allergie],
      },
      {
        chiave: "aziendali",
        pagina: "eventi-aziendali",
        nome: "Eventi aziendali",
        titolo: "Eventi aziendali",
        posizioneTitolo: "basso",
        // TESTO DI ESEMPIO DA CONFERMARE (da qui fino a "faq")
        sopratitolo: "Coffee break, pranzi e cene",
        breve: "Coffee break, pranzi di lavoro, inaugurazioni e cene.",
        heroSottotitolo: "Coffee break, pranzi di lavoro, inaugurazioni e cene: puntuali e discreti, come serve a un'azienda.",
        meta: {
          titolo: "Catering per eventi aziendali · Zanzibar Catering & Eventi",
          descrizione: "Catering per aziende tra Pescara e Chieti: coffee break, pranzi di lavoro, inaugurazioni, convegni e cene di fine anno.",
        },
        intro: {
          frase: "Puntuali, *discreti*, sempre in ordine: il servizio che serve a chi lavora.",
          testo: "Convegni, inaugurazioni, pranzi con i clienti, cene di fine anno: organizziamo il catering rispettando orari e programma, con personale in divisa e allestimenti sobri. Ti mandiamo una proposta chiara, con tutto quello che è incluso.",
          foto: "tagliere-tra-gli-ospiti",
        },
        passi: [
          ["La richiesta", "Ci indichi data, orari, numero di partecipanti e tipo di evento."],
          ["Il sopralluogo", "Verifichiamo spazi, accessi, prese di corrente e tempi di allestimento."],
          ["La proposta", "Menù, personale e allestimento in un preventivo chiaro."],
          ["La logistica", "Concordiamo orari di arrivo, montaggio e smontaggio."],
          ["Il giorno dell'evento", "Serviamo secondo il programma e lasciamo gli spazi in ordine."],
        ],
        cura: [CURA.aperitivo, CURA.buffet, CURA.tavolo, ["Coffee break", "Caffè, tè, spremute e lievitati per la pausa del mattino o del pomeriggio."], CURA.bar, CURA.allestimento, CURA.personale],
        proposta: [
          ["Coffee break", ["Caffè, tè e spremute", "Cornetti, biscotti e piccola pasticceria", "Frutta fresca"]],
          ["Pranzo a buffet", ["Insalata di farro con verdure", "Paccheri al pomodoro e basilico", "Bocconcini di pollo alle erbe", "Verdure grigliate"]],
          ["Aperitivo di chiusura", ["Calici di bollicine e analcolici", "Finger food caldi e freddi"]],
        ],
        faq: [FAQ.ospiti, FAQ.zone, FAQ.anticipo, FAQ.allergie],
      },
      {
        chiave: "aperitivi",
        pagina: "aperitivi-buffet",
        nome: "Aperitivi e buffet",
        titolo: "Aperitivi",
        posizioneTitolo: "basso",
        // TESTO DI ESEMPIO DA CONFERMARE (da qui fino a "faq")
        sopratitolo: "Aperitivi e buffet",
        breve: "Finger food, taglieri e open bar, per feste in piedi.",
        heroSottotitolo: "Finger food, taglieri e open bar: una festa in piedi, tra un calice e un assaggio.",
        meta: {
          titolo: "Aperitivi e buffet a domicilio · Zanzibar Catering & Eventi",
          descrizione: "Aperitivi a buffet, finger food, taglieri e open bar per feste, inaugurazioni ed eventi tra Pescara e Chieti.",
        },
        intro: {
          frase: "Un calice in mano e qualcosa di *buono* sempre a portata.",
          testo: "Per un'inaugurazione, una festa in giardino o un dopo-cerimonia, l'aperitivo a buffet è il modo più semplice di stare insieme. Prepariamo finger food, taglieri e un angolo bar, con chi versa e chi serve.",
          foto: "spritz-tavolo-legno",
        },
        passi: [
          ["La richiesta", "Ci dici quanti siete, dove e a che ora."],
          ["La formula", "Scegliamo insieme: aperitivo breve, apericena o buffet completo."],
          ["Il bar", "Decidiamo bevande, cocktail e analcolici."],
          ["L'allestimento", "Tavoli, tovagliato e angolo bar secondo lo spazio."],
          ["La festa", "Serviamo caldo quello che va caldo e rinnoviamo il buffet."],
        ],
        cura: [CURA.aperitivo, CURA.buffet, ["Servizio tra gli ospiti", "Camerieri che passano con vassoi di assaggi caldi e freddi."], CURA.torta, CURA.bar, CURA.allestimento, CURA.personale],
        proposta: [
          ["Al bar", ["Spritz e cocktail della casa", "Bollicine e vini d'Abruzzo", "Cocktail analcolici e succhi"]],
          ["Finger food", ["Tartine e crostini misti", "Mozzarelline e olive ripiene fritte", "Arrosticini cotti al momento"]],
          ["Taglieri", ["Ventricina, salsicce secche e prosciutto", "Pecorini del territorio con miele e confetture"]],
          ["Per chiudere", ["Piccola pasticceria e frutta"]],
        ],
        faq: [FAQ.ospiti, FAQ.zone, FAQ.anticipo, FAQ.allergie],
      },
      {
        chiave: "lauree",
        pagina: "lauree",
        nome: "Lauree",
        titolo: "Lauree",
        posizioneTitolo: "basso",
        // TESTO DI ESEMPIO DA CONFERMARE (da qui fino a "faq")
        sopratitolo: "Feste di laurea",
        breve: "La festa per il traguardo, tra amici e parenti.",
        heroSottotitolo: "Un aperitivo in giardino, un buffet o una cena con tutti: la festa di laurea come la vuoi tu.",
        meta: {
          titolo: "Catering per feste di laurea · Zanzibar Catering & Eventi",
          descrizione: "Catering per feste di laurea tra Pescara e Chieti: aperitivi, buffet e cene con amici e parenti, torta e confetti rossi.",
        },
        intro: {
          frase: "Il traguardo si festeggia *insieme*, con un brindisi all'altezza.",
          testo: "Dopo la proclamazione, la festa: amici, parenti, compagni di corso. Prepariamo aperitivi, buffet o cene servite e pensiamo noi a bollicine, torta e confetti rossi.",
          foto: "spumante-nel-parco",
        },
        passi: [
          ["La data", "Ci dici giorno e ora della proclamazione e dove volete festeggiare."],
          ["La formula", "Aperitivo, buffet o cena: scegliamo in base agli invitati."],
          ["Il menù", "Componiamo il menù e scegliamo torta e bevande."],
          ["L'allestimento", "Prepariamo lo spazio, anche all'aperto."],
          ["La festa", "Il brindisi è pronto quando arrivi con la corona d'alloro."],
        ],
        cura: [CURA.aperitivo, CURA.buffet, CURA.tavolo, ["Torta di laurea", "La torta del traguardo, con i confetti rossi della tradizione."], CURA.bar, CURA.allestimento, CURA.personale],
        proposta: [
          ["Brindisi", ["Bollicine e cocktail analcolici", "Spritz per gli amici"]],
          ["Buffet", ["Rustici e pizzette calde", "Arrosticini cotti al momento", "Taglieri di salumi e formaggi", "Insalate di riso e di pasta"]],
          ["Dolce", ["Torta di laurea", "Confetti rossi"]],
        ],
        faq: [FAQ.ospiti, FAQ.zone, FAQ.anticipo, FAQ.allergie],
      },
    ],

    /* Testi comuni delle pagine evento */ // TESTO DI ESEMPIO DA CONFERMARE
    paginaEvento: {
      passiTitolo: "Come lo *organizziamo*",
      curaTitolo: "Cosa possiamo *curare*",
      curaTesto: "Scegli tu cosa affidarci: possiamo occuparci di tutto o solo di una parte.",
      propostaTitolo: "Una proposta di *esempio*",
      propostaEtichetta: "Proposta di esempio",
      propostaNota: "Il menù vero si costruisce insieme, in base a stagione, luogo e gusti degli ospiti.",
      galleriaTitolo: "Momenti di *festa*",
      faqTitolo: "Domande *frequenti*",
      altriTitolo: "Altri *eventi*",
      preventivoTitolo: "Chiedi un *preventivo*",
      preventivoTesto: "Scrivici data, luogo e numero di ospiti: ti rispondiamo con una proposta su misura, senza impegno.",
    },

    /* FOTO (scaricate da Pexels, elenco completo in credits.md)
       [nome file, larghezza originale, altezza originale, testo alternativo]
       I file sono in assets/img/<gruppo>/<nome>-640.webp, -1280, -1920, -2560 */
    foto: {
    home: [
      ["piatti-impiattati-dall-alto", 6000, 4000, "Antipasti impiattati su piatti bianchi, visti dall'alto"], // pexels 15671273
      ["pasta-fresca-tirata", 4000, 6000, "Mani che sollevano pasta fresca tirata a mano"], // pexels 4377178
      ["calici-con-fragole", 6000, 4000, "Calici di bollicine con fragole preparati su un vassoio"], // pexels 39005665
      ["cuoco-allestisce-buffet", 2339, 4159, "Cuoco che sistema un buffet di verdure e salumi"], // pexels 38009045
      ["coperto-rametto-ulivo", 3004, 4500, "Coperto con piatto in ceramica, tovagliolo e rametto di ulivo"], // pexels 4886942
      ["sfoglia-con-uova", 4382, 1847, "Mani che impastano la sfoglia con farina e uova"], // pexels 6287375
      ["cameriere-fette-di-torta", 3895, 5842, "Cameriere che porta quattro piatti con fette di torta"], // pexels 38774600
      ["tavola-rotonda-calici", 5760, 3840, "Tavola rotonda apparecchiata con calici e tovaglioli in lino"], // pexels 14203533
      ["assaggi-in-coppette", 7613, 5075, "Assaggi serviti in piccole coppe su un piatto di marmo"], // pexels 33791930
      ["fila-di-piatti", 4480, 6720, "Cuoco che completa una lunga fila di piatti"], // pexels 4180994
      ["taglio-pasta-fresca", 3024, 4032, "Mani che tagliano la pasta fresca su un piano di marmo"], // pexels 32726320
      ["servizio-a-tavola", 3309, 4963, "Cameriere che versa da bere a tavola"], // pexels 6897385
      ["tovagliolo-sottopiatto", 3840, 5760, "Tovagliolo piegato su un sottopiatto d'argento"], // pexels 210897
      ["dolci-porzionati", 3371, 5992, "Dolci porzionati nei piatti prima del servizio"], // pexels 38009052
      ["antipasti-nei-calici", 4079, 6118, "Mani che completano antipasti serviti in calici di vetro"], // foto dell'introduzione // pexels 18853367
    ],
    matrimoni: [
      ["brindisi-sotto-le-luci", 2480, 1772, "Sposi e invitati brindano sotto le luci, all'aperto"], // pexels 6119578
      ["torta-al-tramonto", 4016, 6016, "Torta nuziale bianca decorata con fiori, nella luce del tramonto"], // pexels 19869787
      ["tavola-limoni-crepuscolo", 3939, 5901, "Lunga tavola all'aperto con candele e limoni, al crepuscolo"], // pexels 4622288
      ["vassoio-di-flute", 2650, 1769, "Cameriere con un vassoio di flûte di spumante"], // pexels 34618729
      ["taglio-della-torta", 2397, 3224, "Gli sposi tagliano la torta nuziale all'aperto"], // pexels 15283467
      ["candelabri-dorati", 4705, 3137, "Centrotavola con candelabri dorati e fiori"], // pexels 1128782
      ["sposa-al-ricevimento", 4160, 6240, "La sposa entra nella sala del ricevimento"], // pexels 25491319
      ["fiori-bianchi-tavola-legno", 5939, 3965, "Tavola in legno con composizioni di fiori bianchi"], // pexels 19869796
      ["tavolo-rotondo-fiori", 4558, 6837, "Tavolo rotondo con centrotavola di fiori e sedie in legno, in giardino"], // pexels 24023400
      ["tavola-sotto-il-porticato", 3072, 4608, "Tavola imperiale sotto un porticato in pietra, apparecchiata per un ricevimento"], // foto dell'introduzione // pexels 33927686
    ],
    comunioni: [
      ["brindisi-pranzo-in-giardino", 8256, 5504, "Famiglia che brinda durante un pranzo in giardino"], // pexels 8841472
      ["biscotti-angeli", 3392, 5088, "Biscotti decorati con angeli in un piatto di vetro"], // pexels 37803973
      ["torta-bianca-angelo", 4982, 3321, "Torta bianca con un angelo e fiori per una festa in giardino"], // pexels 37803978
      ["confetti-rosa", 5472, 3648, "Confetti rosa in un vaso di vetro"], // pexels 9743069
      ["spremuta-a-tavola", 8006, 5338, "Una mamma versa una spremuta alla figlia durante il pranzo"], // pexels 8841436
      ["cupcake-con-croci", 6240, 4160, "Cupcake decorati con piccole croci per una festa religiosa"], // pexels 16475252
      ["pranzo-in-famiglia", 8256, 5504, "Pranzo in famiglia all'aperto con insalate e piatti colorati"], // pexels 8841432
      ["tavolo-dei-dolci-angelo", 8189, 5462, "Tavolo dei dolci con un angelo di porcellana"], // pexels 28787826
      ["tavola-sul-prato", 8087, 5392, "Famiglia riunita a tavola sul prato"], // pexels 8841223
      ["abito-della-comunione", 1800, 2400, "Bambina sorridente con l'abito bianco della prima comunione"], // foto dell'introduzione // pexels 40658491
    ],
    compleanni: [
      ["brindisi-sotto-le-luci", 6000, 4000, "Amici che brindano sotto le luci di una festa in giardino"], // pexels 5638814
      ["candeline-sulla-torta", 4160, 6240, "Si accendono le candeline sulla torta di compleanno"], // pexels 33038785
      ["sorrisi-a-tavola", 8171, 5447, "Signora sorridente a tavola durante una festa all'aperto"], // pexels 5638644
      ["dolci-e-candela-scintillante", 4000, 6000, "Tavola con dolci, calici e una candela scintillante"], // pexels 32477680
      ["brindisi-cena-in-giardino", 5000, 3333, "Brindisi in famiglia durante una cena in giardino al tramonto"], // pexels 5638749
      ["torta-e-candele", 3079, 4619, "Torta e candele accese su una tavola apparecchiata"], // pexels 16510066
      ["spremuta-in-tavola", 8213, 5475, "Spremuta versata a tavola durante una cena in famiglia"], // pexels 5638677
      ["brindisi-succo-arancia", 3333, 5000, "Brindisi con succo d'arancia durante una festa in famiglia"], // pexels 5638745
      ["insalatiera-in-tavola", 8256, 5504, "Insalatiera portata in tavola durante una festa in giardino"], // pexels 5638275
      ["calici-alzati-candele", 3333, 5000, "Calici alzati sopra una tavola illuminata da candele"], // foto dell'introduzione // pexels 5638750
    ],
    aziendali: [
      ["buffet-sala-luminosa", 6720, 5604, "Professionisti che si servono al buffet in una sala luminosa"], // pexels 38460679
      ["vassoio-flute-e-succhi", 5667, 3778, "Cameriere con un vassoio di flûte di spumante e succo"], // pexels 13375022
      ["assaggio-dal-vassoio", 4001, 6000, "Ospite che prende un assaggio da un vassoio"], // pexels 32774004
      ["buffet-caprese", 6016, 4016, "Buffet con caprese, antipasti e piatti pronti"], // pexels 34307854
      ["coffee-break", 3556, 5310, "Coffee break con caraffe di caffè e tazze"], // pexels 38598141
      ["ospite-al-buffet", 6720, 4480, "Ospite di un evento aziendale che sceglie al buffet"], // pexels 32441077
      ["servizio-caffe-evento", 4160, 6240, "Personale del catering che serve gli ospiti durante un evento al chiuso"], // pexels 32805961
      ["buffet-sala-finestre", 5090, 3612, "Tavoli del buffet allestiti in una sala con grandi finestre"], // pexels 31970815
      ["tagliere-tra-gli-ospiti", 4000, 6000, "Cameriere che porta un tagliere di antipasti tra gli ospiti"], // foto dell'introduzione // pexels 18326544
    ],
    aperitivi: [
      ["buffet-terracotta-gazebo", 8192, 5461, "Buffet sotto un gazebo con vasi in terracotta e fiori arancioni, la sera"], // pexels 37958133
      ["spritz-basilico", 4000, 6000, "Spritz con foglia di basilico servito accanto a un'insalata"], // pexels 28618414
      ["vassoio-finger-food", 3200, 2136, "Vassoio di finger food servito durante un evento"], // pexels 34321369
      ["tagliere-prosciutto-formaggi", 3456, 5184, "Tagliere con prosciutto, formaggi, uva e vino rosso"], // pexels 12310897
      ["tramezzini-quiche-taglieri", 5184, 3456, "Tramezzini, quiche e polpettine su taglieri in legno"], // pexels 39303849
      ["tartine-con-fiori", 4000, 6000, "Tartine decorate con fiori su un vassoio scuro"], // pexels 27259160
      ["bocconcini-e-grissini", 5760, 3840, "Bocconcini salati e grissini su un buffet"], // pexels 38376795
      ["vino-e-tagliere", 3712, 5568, "Vino rosso versato accanto a un tagliere di salumi e frutta"], // pexels 5975609
      ["salatini-buffet-aperto", 3840, 5760, "Finger food e salatini disposti su un buffet all'aperto"], // pexels 38376791
      ["spritz-tavolo-legno", 3168, 4224, "Spritz con fetta d'arancia su un tavolo di legno"], // foto dell'introduzione // pexels 33493346
    ],
    lauree: [
      ["corona-d-alloro", 7008, 4672, "Neolaureato sorridente con la corona d'alloro"], // pexels 34311557
      ["neolaureati-tra-le-siepi", 7008, 4672, "Due neolaureati con la corona d'alloro su un sentiero tra le siepi"], // pexels 27823412
      ["la-corona-sistemata", 6130, 4087, "Un'amica sistema la corona d'alloro al neolaureato"], // pexels 34311549
      ["brindisi-vino-bianco", 2560, 1707, "Amici che brindano con i calici di vino bianco"], // pexels 6132779
      ["festa-con-stuzzichini", 7008, 4672, "Festa di laurea all'aperto con amici e un vassoio di stuzzichini"], // pexels 34311554
      ["mani-che-brindano", 6240, 4160, "Mani che brindano sopra una tavola apparecchiata"], // pexels 4878011
      ["festeggiato-dagli-amici", 7008, 4672, "Neolaureato festeggiato dagli amici all'aperto"], // pexels 34311560
      ["uscita-dall-universita", 6959, 4639, "Neolaureato accolto da amici e parenti all'uscita dell'università"], // pexels 34311555
      ["spumante-nel-parco", 5304, 7952, "Neolaureato che stappa una bottiglia di spumante nel parco"], // foto dell'introduzione // pexels 19350056
    ],
    },
  };
})();
