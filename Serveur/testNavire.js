const Navire = require("./Classes/Navire");

let navire = new Navire([[0,1], [0,2]]);
console.log(navire.positions);

console.log(navire.evaluerImpact([0,2]));

console.log(navire.estCoule());

console.log(navire.evaluerImpact([0,1]));

console.log(navire.estCoule());