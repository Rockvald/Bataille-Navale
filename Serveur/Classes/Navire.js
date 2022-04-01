class Navire {
    // liste des positions saisies par le joueur
    //[(0,2),(0,3),(0,4),(0,5)]
    constructor() {
        this.positions = [];
    }

    creer(positions) {
        // console.log(positions.length)
        // ajouter un etat 
        for (let unecase of positions) {
            //[[[0,2],true],[[0,3],true]]
            this.positions.push([unecase, true]);
        }
    }
    // tir = [0,2]
    evaluerImpact(tir) {
        // raté=0, touché=1, coulé=2
        let ret = 0
        for (let i = 0; i < this.positions.length; i++) {
            if (this.positions[i][0] + "" === tir + "") {
                ret = 1;
                this.positions[i][1] = false;
                if (this.estCoule()) ret = 2
            }
        }
        return ret;
    }

    estCoule() {
        let ret = true;
        for (let i = 0; i < this.positions.length; i++) {
            if (this.positions[i][1]) {
                ret = false;
                break;
            }
        }
        return ret;
    }

}

module.exports = Navire
