module.exports = app => {
    var router = require('express').Router();
    const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

    //------------------------------------------------
    // Parties enregistré par defauts 
    //------------------------------------------------
    let parties = [
        // Partie tout juste créer
        {
            id: 1,
            idDuel: null,
            status: 'attenteJoueurB',
            joueurA: {
                nom: 'karim',
                positions: []
            },
            joueurB: {
                nom: '',
                positions: []
            },
        },
        // Le joueurA a ajouté ses navires, mais il n'y a pas encore de joueurB
        {
            id: 2,
            idDuel: null,
            status: 'attenteJoueurB',
            joueurA: {
                nom: 'karim',
                positions: [
                    [[0, 0], [0, 1], [0, 2]],
                    [[2, 0], [2, 1], [2, 2]],
                ]
            },
            joueurB: {
                nom: '',
                positions: []
            },
        },
        // Le joueurB à rejoint la partie, et aucun des deux joueurs n'a donnée ses navires
        {
            id: 3,
            idDuel: null,
            status: 'attenteNavires',
            joueurA: {
                nom: 'karim',
                positions: []
            },
            joueurB: {
                nom: 'julien',
                positions: []
            },
        },
        // L'un des joueurs n'a pas encore donnée ses navires
        {
            id: 4,
            idDuel: null,
            status: 'attenteNavires',
            joueurA: {
                nom: 'karim',
                positions: []
            },
            joueurB: {
                nom: 'julien',
                positions: [
                    [[3, 5], [4, 5], [5, 5]],
                    [[8, 5], [8, 6], [8, 7]],
                    [[9, 1], [9, 2]],
                    [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1]],
                    [[2, 6], [2, 7], [2, 8], [2, 9]],
                ]
            },
        },
        // Les deux joueurs sont présent et ont donnée leur navires, la partie à commencé
        {
            id: 5,
            idDuel: 317,
            status: 'commencé',
            joueurA: {
                nom: 'karim',
                positions: [
                    [[0, 0], [0, 1], [0, 2]],
                    [[2, 0], [2, 1], [2, 2]],
                ]
            },
            joueurB: {
                nom: 'julien',
                positions: [
                    [[3, 5], [4, 5], [5, 5]],
                    [[8, 5], [8, 6], [8, 7]],
                    [[9, 1], [9, 2]],
                    [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1]],
                    [[2, 6], [2, 7], [2, 8], [2, 9]],
                ]
            },
        },
    ]

    //------------------------------------------------
    // Récupérer toutes les parties
    //------------------------------------------------
    router.get('/', (req, res) => {
        let reponse = parties;

        res.status(200).json({
            action: "liste tout",
            data: reponse
        });
        res.end();
    });

    //------------------------------------------------
    // Récupérer les parties en attente du joueurB
    //------------------------------------------------
    router.get('/attentejoueur', (req, res) => {
        let reponse = [];
        for (let partie of parties) {
            if (partie.status === 'attenteJoueurB') {
                reponse.push(partie);
            }
        }

        res.status(200).json({
            action: "liste attente joueur",
            data: reponse
        });
        res.end();
    });

    //------------------------------------------------
    // Récupérer la partie d'un joueur
    //------------------------------------------------
    router.get('/:id', (req, res) => {
        let reponse = {};
        let trouve = false;
        for (let partie of parties) {
            if (partie.id === parseInt(req.params.id)) {
                reponse = partie;
                trouve = true;
                break;
            }
        }

        res.status(200).json({
            action: trouve ? "trouve" : "pastrouve",
            data: reponse
        });
        res.end();
    });

    //------------------------------------------------
    // Créer une partie
    //------------------------------------------------
    router.post('/creer/:joueur', (req, res) => {
        let partie = {
            id: new Date().getTime() % 1000,
            idDuel: null,
            status: 'attenteJoueurB',
            joueurA: {
                nom: req.params.joueur,
                positions: []
            },
            joueurB: {
                nom: '',
                positions: []
            },
        };
        parties.push(partie)

        res.status(200).json({
            action: "ajout",
            data: partie.id
        });
        res.end();
    });

    //------------------------------------------------
    // Ajouter un joueur à une partie
    //------------------------------------------------
    router.put('/ajouterjoueur/:id/:joueur', (req, res) => {
        for (let partie of parties) {
            if (partie.id === parseInt(req.params.id)) {
                partie.joueurB.nom = req.params.joueur;
                partie.status = "attenteNavires";
                break;
            }
        }

        res.status(200).json({
            action: "ajout joueur",
            data: req.params.joueur
        });
        res.end();
    });

    //------------------------------------------------
    // Ajouter les navires d'un joueur à une partie
    //------------------------------------------------
    router.put('/ajouternavires/:id/:joueur', (req, res) => {
        for (let partie of parties) {
            if (partie.id === parseInt(req.params.id)) {
                if (partie.joueurA.nom === req.params.joueur) {
                    partie.joueurA.positions = req.body;
                } else if (partie.joueurB.nom === req.params.joueur) {
                    partie.joueurB.positions = req.body;
                }

                if (partie.joueurA.positions.length > 0 && partie.joueurB.positions.length > 0) {
                    let url = "http://localhost:4000/duel/creer"
                    fetch(url, {
                        method: "post",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(partie)
                    }).then(ret => ret.json()).then(rep => {
                        partie.idDuel = rep.data;
                    });

                    partie.status = "commencé";
                }

                break;
            }
        }

        res.status(200).json({
            action: "ajout navires",
            data: req.params.joueur
        });
        res.end();
    });

    //------------------------------------------------
    // Supprimer une partie
    //------------------------------------------------
    router.delete('/supprimer/:id', (req, res) => {
        for (let i = 0; i < parties.length; i++) {
            if (parties[i].id === parseInt(req.params.id)) {
                parties.splice(i, 1);
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
    app.use('/partie', router);
}