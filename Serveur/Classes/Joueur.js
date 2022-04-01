class Joueur {
    constructor(nom, navires) {
        this.aquiletour = null;
        this.nom = nom;
        this.navires = navires;
        this.victoire = "encours"    // gagnant/perdant
    }
}

module.exports = Joueur
