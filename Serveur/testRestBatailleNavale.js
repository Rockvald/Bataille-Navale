const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const reader = require("readline-sync");

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function rl_promise(afaire) {
    return new Promise(resolve => {
        rl.question(afaire, (saisie) => {
            resolve(saisie)
        })
    })
}
async function init(id) {
    while (true) {
        let tir = await rl_promise('Tir ? ')
        console.log(tir)
        // inscrire
        let url = "http://localhost:4000/duel/" + id + "/karim/" + tir
        console.log(url)
        fetch(url, {
            headers: {
                'Accept': 'application/json',
                //'Content-Type': 'application/json'
            },
            method: 'PUT'
        }).then(
            ret => ret.json().then(
                ret => {
                    console.log("impact : ", ret)
                    console.log(ret.data.length)
                    if (ret.data.length == 1 && ret.data[0] == 2) {
                        console.log("terminé")
                        rl.close();
                        return
                    }
                }
            )
        )
    }
}


// Ajouter un duel
let url = "http://localhost:4000/duel";
fetch(url).then(
    ret => ret.json().then(
        rep => {
            console.log("***", rep.data[0].id)
            init(rep.data[0].id)
        }
    )
)
