const BatailleNavale = require('./Classes/BatailleNavale');
const Navires = require('./Classes/Navire');
const Joueur = require('./Classes/Joueur');
const Duel = require('./Classes/Duel');

let bn = new BatailleNavale();

// Joueur A

// Créer les navires
let naviresA = [];
naviresA.push(new Navires([[0,1], [0,2], [0,3]]));
naviresA.push(new Navires([[2,1], [2,2], [2,3]]));

// Créer le joueur
let joueurA = new Joueur('Karim', naviresA);


// Joueur B

// Créer les navires
let naviresB = [];
naviresB.push(new Navires([[3,1], [3,2], [3,3]]));
naviresB.push(new Navires([[4,1], [4,2], [4,3]]));

// Créer le joueur
let joueurB = new Joueur('Julien', naviresB);


// Duel
let duel = new Duel(joueurA, joueurB);

// Ajouter le duel
bn.ajouterDuel(duel);
console.log(bn);

// Le joueurA tire
let ret = bn.evaluer(duel.id, "Karim", [3,1]);
console.log("Retour : ", ret);

// Démarrée le duel
duel.status = "demarree";

ret = bn.evaluer(duel.id, "Karim", [3,2]);
console.log("Retour : ", ret);

ret = bn.evaluer(duel.id, "Karim", [3,3]);
console.log("Retour : ", ret);

ret = bn.evaluer(duel.id, "Karim", [4,1]);
console.log("Retour : ", ret);

ret = bn.evaluer(duel.id, "Karim", [4,2]);
console.log("Retour : ", ret);

ret = bn.evaluer(duel.id, "Karim", [4,3]);
console.log("Retour : ", ret);

console.log(bn.estTerminer(duel.id));
console.log(bn.trouverDuel(duel.id));