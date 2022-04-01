import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Pressable,
    ImageBackground,
    Image,
    Modal
} from 'react-native';
import { Component } from 'react/cjs/react.production.min';
import GridView from 'react-native-flex-grid-view';

const urlBase = require("./url.json").url;

class Jeux extends Component {
    constructor(props) {
        super(props);

        let ocean = [];
        for (let l = 0; l < 10; l++) {
            for (let c = 0; c < 10; c++) {
                ocean.push([l, c]);
            }
        }

        this.state = {
            ocean: ocean,
            pseudo: props.route.params.pseudo,
            idDuel: props.route.params.idDuel,
            messageVisible: false,
            message: "",
            dejaAfficher: false,
            caseTouche: [],
            caseCoule: [],
            caseRate: [],
            victoire: null,
            flotte: []
        }

        this.aquiletour();
        this.navires();

        this.recupInfo = setInterval(() => {
            this.aquiletour();
            this.navires();
        }, 5000);
    }

    aquiletour() {
        fetch(urlBase + "/duel/aquiletour/" + this.state.idDuel + "/" + this.state.pseudo).then(reponse => reponse.json()).then(donnees => {
            if (donnees.data && !this.state.dejaAfficher) {
                this.setState(s => s.message = "C'est  à  votre  tour  de  jouer  !");
                this.setState(s => s.messageVisible = true);
                this.setState(s => s.dejaAfficher = true);
                setTimeout(() => this.setState(s => s.messageVisible = false), 3000);
            } else if (!donnees.data) {
                this.setState(s => s.dejaAfficher = false);
                this.setState(s => s.message = "C'est le tour de votre adversaire");
                this.setState(s => s.messageVisible = true);
            }
        });
    }

    navires() {
        fetch(urlBase + "/duel/navires/" + this.state.idDuel + "/" + this.state.pseudo).then(reponse => reponse.json()).then(donnees => {
            this.setState(s => s.flotte = donnees.data);
        });
    }

    tirer(tir) {
        fetch(urlBase + "/duel/" + this.state.idDuel + "/" + this.state.pseudo + "/" + tir, {
            headers: {
                'Accept': 'application/json',
            },
            method: 'PUT'
        }).then(ret => ret.json()).then(
            ret => {
                if (ret.data.length === 0) {
                    this.setState(s => s.caseRate.push(tir));

                    fetch(urlBase + "/duel/" + this.state.idDuel).then(reponse => reponse.json()).then(donnees => {
                        console.log("Victoire");
                        console.log("Récap du duel : ");
                        console.log("Début : " + donnees.data.debut);
                        console.log("Fin : " + donnees.data.fin);
                        console.log(donnees.data.joueurA.nom + " : " + donnees.data.joueurA.victoire);
                        console.log(donnees.data.joueurB.nom + " : " + donnees.data.joueurB.victoire);
                    });
                } else if (ret.data[0].includes(1)) {
                    this.setState(s => s.caseTouche.push(tir));
                } else if (ret.data[0].includes(2)) {
                    this.setState(s => s.caseTouche.push(tir));

                    // Initialisation du temps du timer
                    let timer = 0;

                    // On ne peux pas ajouter directement les case retourné car lorsqu'on les compares aux cases 'tir' avec un 'includes()' dans la fonction setCouleur elles ne sont pas vu comme identique. On est donc obligé d'ajouter les cases touché comme ci-dessous
                    ret.data[1].forEach(positionRetour => {
                        this.state.caseTouche.forEach(positionTouche => {
                            if (positionRetour + "" === positionTouche + "") {
                                // Lancement d'un timer pour permettre aux case de s'actualiser l'une après l'autre
                                setTimeout(() => {
                                    this.setState(s => s.caseCoule.push(positionTouche));
                                }, timer);
                                timer += 250; // Incrémentation du timer de 250ms
                            }
                        });
                    });
                } else {
                    this.setState(s => s.caseRate.push(tir));
                }

                // Vérifier si la partie est terminé
                fetch(urlBase + "/duel/status/" + this.state.idDuel + "/" + this.state.pseudo).then(reponse => reponse.json()).then(donnees => {
                    if (donnees.data.status === "termine") {
                        clearInterval(this.recupInfo);
                        this.setState(s => s.messageVisible = false);

                        // Attente de la mise à jour de l'affichage des navires avant d'afficher le resultat
                        setTimeout(() => {
                            if (donnees.data.victoire === "gagnant") {
                                this.setState(s => s.victoire = true);
                            } else if (donnees.data.victoire === "perdant") {
                                this.setState(s => s.victoire = false);
                            }
                        }, 1500);

                        // Retour au menu
                        setTimeout(() => {
                            this.props.navigation.navigate('Menu', { pseudo: this.state.pseudo });
                        }, 10000);
                    } else {
                        this.aquiletour();
                    }
                });
            }
        )
    }

    setCouleur(coordonnee) {
        if (this.state.caseCoule.includes(coordonnee)) {
            return 'red';
        } else if (this.state.caseTouche.includes(coordonnee)) {
            return 'orange';
        } else if (this.state.caseRate.includes(coordonnee)) {
            return 'black';
        } else {
            return "lightblue"
        }
    }

    render() {
        return (
            <ImageBackground source={require('./assets/Background/background.png')} resizeMode="cover">
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.messageVisible}
                >
                    <View style={styles.modalView}>
                        <Image style={styles.fondMessage} source={require('./assets/Boutons/BoutonSansTexte.png')} />
                        <Text style={styles.message}>{this.state.message}</Text>
                    </View>
                </Modal>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.victoire !== null ? true : false}
                >
                    <View style={styles.victoire}>
                        <Image style={{ resizeMode: 'contain', width: 250 }} source={this.state.victoire ? require('./assets/Images_Bataille/victoire.png') : require('./assets/Images_Bataille/defaite.png')} />
                    </View>
                </Modal>

                <View style={styles.container}>
                    <GridView
                        data={this.state.ocean}
                        span={10}
                        spacing={1}
                        width="83%"
                        marginTop="5%"
                        square
                        flat
                        render={item =>
                            <Pressable
                                style={{ backgroundColor: this.setCouleur(item), flex: 1, borderRadius: 4, opacity: 0.75 }}
                                onPress={() => {
                                    this.tirer(item);
                                }}
                            ></Pressable>
                        }
                    />
                    <View style={styles.bottom}>
                        <View>
                            <Image style={styles.fondTitreFlotte} source={require('./assets/Boutons/BoutonSansTexte.png')} />
                            <Text style={styles.titreFlotte}>Votre flotte</Text>
                        </View>
                        <View style={styles.navires}>
                            {
                                this.state.flotte.map((navire) => (
                                    <View style={styles.listeCoordonnee} key={navire.positions}>
                                        {
                                            navire.positions.map((coordonnee) => (
                                                <View style={{
                                                    marginTop: "25%",
                                                    height: "25%",
                                                    borderRadius: 4,
                                                    backgroundColor: coordonnee[1] ? "orange" : "red"
                                                }} key={coordonnee[0]} ></View>
                                            ))
                                        }
                                    </View>
                                ))
                            }
                        </View>
                    </View>
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    modalView: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 23
    },
    victoire: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 75
    },
    fondMessage: {
        position: 'relative',
        top: 98,
        resizeMode: 'contain',
        width: 210
    },
    message: {
        textAlign: 'center',
        color: '#ffffff',
        width: "50%",
        padding: 10
    },
    bottom: {
        width: "90%",
        height: "40%",
        marginBottom: "3%",
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(173, 216, 230, 0.4)',
        borderRadius: 10
    },
    fondTitreFlotte: {
        position: 'relative',
        top: 10,
        resizeMode: 'stretch',
        width: 150,
        height: 40
    },
    titreFlotte: {
        position: 'relative',
        bottom: 20,
        textAlign: 'center',
        color: '#ffffff'
    },
    navires: {
        width: "100%",
        height: "50%",
        marginBottom: "5%",
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
    },
    listeCoordonnee: {
        width: "9%"
    },
    coordonnee: {
        marginTop: "25%",
        height: "25%",
        borderRadius: 4,
        backgroundColor: 'red'
    }
});

export default Jeux;