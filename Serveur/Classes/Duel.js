class Duel {
    constructor() {
        this.id = new Date().getTime() % 1000;
        this.debut = new Date().toISOString();
        this.fin = null;
        this.status = "attente"; // demarre, termine
        this.joueurA = null;
        this.joueurB = null;
    }

    ajouterJoueurs(joueurA, joueurB) {
        this.joueurA = joueurA;
        this.joueurB = joueurB;
    }

    terminer(gagnant, perdant) {
        this.fin = new Date().toISOString();
        this.status = "termine";
        perdant.victoire = "perdant";
        this.moi(gagnant).victoire = "gagnant";
    }

    estTerminer() {
        return this.status === "termine" ? true : false;
    }

    moi(_nom) {
        return this.joueurA.nom === _nom ? this.joueurA : this.joueurB;
    }
}

module.exports = Duel;
