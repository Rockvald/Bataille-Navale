module.exports = app => {
    var router = require('express').Router();

    //------------------------------------------------
    // Joueurs enregistré par defauts 
    //------------------------------------------------
    let joueurs = [
        {
            nom: 'karim',
            etat: 'dispo',
            flotte: {
                navires: []
            }
        },
        {
            nom: 'julien',
            etat: 'dispo',
            flotte: {
                navires: []
            }
        },
        {
            nom: 'camille',
            etat: 'dispo',
            flotte: {
                navires: []
            }
        },
    ]

    //------------------------------------------------
    // trouve un joueur
    // trouve => on donne l'infos
    // pas trouve => on donne {}
    //------------------------------------------------
    router.get('/:joueur', (req, res) => {
        console.log(req.params)
        let reponse = {};
        let trouve = false;
        for (let joueur of joueurs) {
            if (joueur.nom === req.params.joueur) {
                trouve = true;
                reponse = joueur;
                break;
            }
        }
        res.status(200).json({
            action: trouve ? "trouve" : "pastrouve",
            data: reponse
        });
    });

    //------------------------------------------------
    // prendre tous les joueurs
    //------------------------------------------------
    router.get('/', (req, res) => {
        console.log(joueurs);
        // trouver le joueur dans liste sinon ajouter 
        let reponse = joueurs;
        res.status(200).json({
            action: "list",
            data: reponse
        });
    });

    //------------------------------------------------
    // Ajouter un joueur avec une flotte vide
    //------------------------------------------------
    router.post('/:joueur', (req, res) => {
        console.log(req.params)
        // trouver le joueur dans liste sinon ajouter 
        let reponse = {};
        let trouve = false;
        for (let joueur of joueurs) {
            if (joueur.nom === req.params.joueur) {
                trouve = true;
                reponse = joueur;
                break;
            }
        }
        if (trouve != true) {
            // Ajouter le joueur
            let joueur = {
                nom: req.params.joueur,
                etat: 'dispo',
                flotte: {
                    navires: []
                }
            };
            joueurs.push(joueur)
            reponse = joueur;
        }
        res.status(200).json({
            action: "ajout",
            data: reponse
        });
    });

    //------------------------------------------------
    // modifier un joueur en particulier 
    //------------------------------------------------
    router.put('/:joueur', (req, res) => {
        console.log(req.params.joueur)
        // recherche du joueur
        let reponse = {};
        for (let joueur of joueurs) {
            if (joueur.nom === req.params.joueur) {
                // modifier joueur
                reponse = JSON.parse(req.body)
                joueurs.push(reponse);
                break;
            }
        }
        res.status(200).json({
            action: "mdification",
            data: reponse
        });
    });

    //------------------------------------------------
    // supprimer 
    //------------------------------------------------
    router.delete('/:joueur', (req, res) => {
        console.log(req.params.joueur)
        // recherche du joueur
        let reponse = {};
        for (let i = 0; i < joueurs.length; i++) {
            if (joueurs[i].nom === req.params.joueur) {
                // modifier joueur
                joueurs.splice(i, 1);
                break;
            }
        }
        res.status(200).json({
            action: "suppression",
            data: req.params.joueur
        });
    });

    // Préfixe de la route
    app.use('/registery', router);
}