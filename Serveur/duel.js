module.exports = app => {
    var router = require('express').Router();

    const Duel = require('./Classes/Duel');
    const Joueur = require('./Classes/Joueur');
    const Navire = require('./Classes/Navire');
    var batailleNavale = require("./Classes/BatailleNavale");
    var bn = new batailleNavale();

    //------------------------------------------------
    // Récupérer tous les duels
    //------------------------------------------------
    router.get('/', (req, res) => {
        let reponse = bn.duels;
        res.status(200).json({
            action: "list",
            data: reponse
        });
        res.end();
    });

    //------------------------------------------------
    // Récupérer un duels
    //------------------------------------------------
    router.get('/:id', (req, res) => {
        let id = parseInt(req.params.id);
        let reponse = bn.trouverDuel(id);
        res.status(200).json({
            action: "list",
            data: reponse
        });
        res.end();
    });

    //------------------------------------------------
    // Récupérer aquiletour
    //------------------------------------------------
    router.get('/aquiletour/:id/:joueur', (req, res) => {
        let id = parseInt(req.params.id);
        let joueur = req.params.joueur;
        let duel = bn.trouverDuel(id);
        let reponse = false;

        if (duel.joueurA.nom === joueur) {
            reponse = duel.joueurA.aquiletour;
        } else if (duel.joueurB.nom === joueur) {
            reponse = duel.joueurB.aquiletour;
        }

        res.status(200).json({
            action: "aquiletour " + joueur,
            data: reponse
        });
        res.end();
    });

    //------------------------------------------------
    // Récupérer le status d'un duel
    //------------------------------------------------
    router.get('/status/:id/:joueur', (req, res) => {
        let id = parseInt(req.params.id);
        let joueur = req.params.joueur;
        let duel = bn.trouverDuel(id);
        let reponse = {status: duel.status};

        if (duel.joueurA.nom === joueur) {
            reponse.victoire = duel.joueurA.victoire;
        } else if (duel.joueurB.nom === joueur) {
            reponse.victoire = duel.joueurB.victoire;
        }

        res.status(200).json({
            action: "status",
            data: reponse
        });
        res.end();
    });

    //------------------------------------------------
    // Récupérer les navires d'un joueur
    //------------------------------------------------
    router.get('/navires/:id/:joueur', (req, res) => {
        let id = parseInt(req.params.id);
        let joueur = req.params.joueur;
        let duel = bn.trouverDuel(id);
        let reponse = [];

        if (duel.joueurA.nom === joueur) {
            reponse = duel.joueurA.navires;
        } else if (duel.joueurB.nom === joueur) {
            reponse = duel.joueurB.navires;
        }

        res.status(200).json({
            action: "navires : " + joueur,
            data: reponse
        });
        res.end();
    });

    //------------------------------------------------
    // Creer et ajouter un duel
    //------------------------------------------------
    router.post('/creer', (req, res) => {
        let data = req.body;

        // Création Joueur A
        let naviresA = [];
        for (let pos of data.joueurA.positions) {
            let nv = new Navire();
            nv.creer(pos);
            naviresA.push(nv);
        }

        let joueurA = new Joueur(data.joueurA.nom, naviresA);

        // Création Joueur B
        let naviresB = [];
        for (let pos of data.joueurB.positions) {
            let nv = new Navire();
            nv.creer(pos);
            naviresB.push(nv);
        }

        let joueurB = new Joueur(data.joueurB.nom, naviresB);

        // Initiative
        joueurA.aquiletour = true;
        joueurB.aquiletour = false;

        // Création et ajout du Duel
        let duel = new Duel();
        duel.ajouterJoueurs(joueurA, joueurB);
        duel.status = "demarree";
        bn.ajouterDuel(duel);

        res.status(200).json({
            action: "ajout",
            data: duel.id
        });
        res.end();
    });

    //------------------------------------------------
    // Tirer
    //------------------------------------------------
    router.put('/:id/:joueur/:tir', (req, res) => {
        let tir = req.params.tir;
        let id = parseInt(req.params.id);
        let joueur = req.params.joueur;
        let reponse = bn.evaluer(id, joueur, tir);

        let duel = bn.trouverDuel(id);
        let joueurAdverse = bn.trouverAdversaire(duel, joueur);
        for (let nv of joueurAdverse.navires) {
            nv.positions.forEach(position => {
                // Si les coordonnées du tir correspondes aux coordonnées d'une des positions du navire, et que le navire est coulé, on récupère ses positions et on les ajoute à la réponse
                if (position[0]+"" === tir+"" && nv.estCoule()) {
                    // Copie de l'objet navire 'nv' pour ne pas le modifier directement
                    const navire = JSON.parse(JSON.stringify(nv));
    
                    // Suppression des 'false' pour pouvoir envoyer uniquement les coordonnées du navire
                    for (i = 0; i<nv.positions.length; i++) {
                        navire.positions[i] = navire.positions[i][0];
                    }
                    reponse = [reponse, navire.positions];
                }
            });
        }

        // Formatage pour la vérification côté client
        if (typeof(reponse[0]) === 'number') {
            reponse = [reponse];
        }

        res.status(200).json({
            action: "tir",
            data: reponse
        });
        res.end();
    });

    //------------------------------------------------
    // Supprimer un duel
    //------------------------------------------------
    router.delete('/supprimer/:id', (req, res) => {
        for (let i = 0; i < bn.duels.length; i++) {
            if (bn.duels[i].id === parseInt(req.params.id)) {
                // Sauvegarder le duel avant
                bn.duels.splice(i, 1);
                break;
            }
        }
        res.status(200).json({
            action: "suppression",
            data: req.params.id
        });
        res.end();
    });

    // Préfixe de la route
    app.use('/duel', router);
}