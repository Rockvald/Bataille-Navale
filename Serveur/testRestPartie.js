const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
let url = "http://localhost:4000/duel/781/karim/2,0";
fetch(url, {
    headers: {
        'Accept': 'application/json',
    },
    method: 'PUT'
})
// Récuperer toutes les parties
fetch('http://localhost:4000/duel').then(
    ret => ret.json().then(
        rep => {
            console.log(rep.data);
        }
    )
);

// Récuperer une partie
// fetch('http://localhost:4000/partie/5').then(
//     ret => ret.json().then(
//         rep => {
//             console.log(rep.data);
//         }
//     )
// );

// Récupérer les parties en attente du joueurB
// fetch('http://localhost:4000/partie/attentejoueur').then(
//     ret => ret.json().then(
//         rep => {
//             console.log(rep.data);
//         }
//     )
// );

// Créer une partie
// fetch("http://localhost:4000/partie/creer/pierre", { method: "POST" }).then(
//     ret => ret.json().then(
//         rep => {
//             console.log(rep.data)
//         }
//     )
// );

// Ajouter un joueur à une partie
// fetch('http://localhost:4000/partie/ajouterjoueur/2/tom', { method: 'PUT' }).then(
//     ret => ret.json().then(
//         rep => {
//             console.log(rep.action, ":", rep.data);
//         }
//     )
// );

// Ajouter les navires d'un joueur à une partie
// fetch('http://localhost:4000/partie/ajouternavires/4/karim', {
//     method: "PUT",
//     headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(
//         [
//             [[0, 1], [0, 2], [0, 3]],
//             [[2, 1], [2, 2], [2, 3]],
//         ]
//     )
// }).then(
//     ret => ret.json().then(
//         rep => {
//             console.log(rep.action, ":", rep.data);
//         }
//     )
// );

// Supprimer une partie
// fetch("http://localhost:4000/partie/supprimer/5", { method: "DELETE" }).then(
//     ret => ret.json().then(
//         rep => {
//             console.log(rep.data)
//         }
//     )
// );