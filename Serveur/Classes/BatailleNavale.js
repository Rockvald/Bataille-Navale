class BatailleNavale {
    constructor() {
        this.duels = []
    }

    evaluer(_id, _joueur, _tir) {
        //, _joueur, _tir
        // trouver le duel concerné
        let duel = this.trouverDuel(_id);
        let joueurAdverse = this.trouverAdversaire(duel, _joueur);
        let ret = [];
        for (let nv of joueurAdverse.navires) {
            if (nv.estCoule()) {
                continue;
            }
            ret.push(nv.evaluerImpact(_tir));
        }

        if (ret.length === 1 && ret[0] === 2) {
            duel.terminer(_joueur, joueurAdverse);
        }

        // basculer le tour 
        this.aquiletour(duel);
        // Les impacts de chaque navire 
        return ret;
    }

    estTerminer(_id) {
        return this.trouverDuel(_id).estTerminer();
    }

    trouverDuel(_id) {
        // recherche du duel
        let duel = null;
        for (let _duel of this.duels) {
            if (_duel.id === _id) {
                // Extraire le tir, evaluer limpacte et modifier
                duel = _duel;
                break;
            }
        }
        return duel;
    }

    trouverAdversaire(_duel, _nom) {
        return _duel.joueurA.nom === _nom ? _duel.joueurB : _duel.joueurA;
    }

    aquiletour(_duel) {
        // Aqui le tour : bascule 
        _duel.joueurA.aquiletour = !_duel.joueurA.aquiletour;
        _duel.joueurB.aquiletour = !_duel.joueurB.aquiletour;
    }

    ajouterDuel(_duel) {
        this.duels.push(_duel);
    }
}

module.exports = BatailleNavale;