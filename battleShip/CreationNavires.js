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

class CreationNavires extends Component {
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
            idPartie: props.route.params.idPartie,
            message: "Placer un navire de 2 cases",
            erreur: false,
            messageErreur: "",
            flotte: [],
            navire: []
        }
    }

    ajouterPositions(positions) {
        if (this.state.flotte.length === 0) {
            this.verifPositions(positions, 2);
        } else if (this.state.flotte.length === 1 || this.state.flotte.length === 2) {
            this.verifPositions(positions, 3);
        } else if (this.state.flotte.length === 3) {
            this.verifPositions(positions, 4);
        } else if (this.state.flotte.length === 4) {
            this.verifPositions(positions, 5);
        }
    }

    verifPositions(positions, longueurNavire) {
        let navire = this.state.navire;
        let dejaPrise = false;

        if (this.state.flotte.length > 0) {
            this.state.flotte.forEach((navire) => {
                if (navire.includes(positions)) {
                    dejaPrise = true;
                }
            });
        }

        if (!navire.includes(positions) && navire.length === 0 && !dejaPrise) {
            this.setState(s => s.navire.push(positions));
        } else if (!navire.includes(positions) && navire.length < longueurNavire) {
            if (dejaPrise) {
                this.setState(s => s.messageErreur = "Cette cases fait déjà partie d'un autre navire !")
                this.setState(s => s.erreur = true);
                setTimeout(() => { this.setState(s => s.erreur = false) }, 3000);
            } else if (this.positionAdjacente(positions, navire[navire.length - 1]) && (positions[0] === navire[0][0] || positions[1] === navire[0][1])) {
                this.setState(s => s.navire.push(positions));
            } else if (!this.positionAdjacente(positions, navire[navire.length - 1])) {
                this.setState(s => s.messageErreur = "Cette case n'est pas adjacente à la précédente");
                this.setState(s => s.erreur = true);
                setTimeout(() => { this.setState(s => s.erreur = false) }, 3000);
            } else {
                this.setState(s => s.messageErreur = "Cette case n'est pas aligné avec le reste du navire");
                this.setState(s => s.erreur = true);
                setTimeout(() => { this.setState(s => s.erreur = false) }, 3000);
            }
        } else if (!navire.includes(positions) && navire.length === longueurNavire) {
            this.setState(s => s.messageErreur = "Vous avez déjà placé toutes les cases de ce navire")
            this.setState(s => s.erreur = true);
            setTimeout(() => { this.setState(s => s.erreur = false) }, 3000);
        } else if (navire.includes(positions)) {
            let id = navire.indexOf(positions);
            this.setState(s => s.navire.splice(id, 1));
        }
    }

    positionAdjacente(pos1, pos2) {
        let adjacent = false;

        if ((pos1[0] === pos2[0]) && (pos1[1] === (pos2[1] + 1) || pos1[1] === (pos2[1] - 1))) {
            adjacent = true;
        }

        if ((pos1[1] === pos2[1]) && (pos1[0] === (pos2[0] + 1) || pos1[0] === (pos2[0] - 1))) {
            adjacent = true;
        }

        return adjacent;
    }

    annuler() {
        this.setState(s => s.navire = []);
    }

    valider() {
        let ajout = false;
        if (this.state.flotte.length === 0 && this.state.navire.length === 2) {
            ajout = true;
        } else if ((this.state.flotte.length === 1 || this.state.flotte.length === 2) && this.state.navire.length === 3) {
            ajout = true;
        } else if (this.state.flotte.length === 3 && this.state.navire.length === 4) {
            ajout = true;
        } else if (this.state.flotte.length === 4 && this.state.navire.length === 5) {
            ajout = true;
        } else {
            this.setState(s => s.messageErreur = "Votre navire n'est pas complet !")
            this.setState(s => s.erreur = true);
            setTimeout(() => this.setState(s => s.erreur = false), 3000);
        }

        if (ajout) {
            this.setState(s => s.flotte.push(this.state.navire))
            this.setState(s => s.navire = []);
            this.setState(s => s.messageErreur = "Votre navire est ajouté à la flotte")
            this.setState(s => s.erreur = true);
            setTimeout(() => this.setState(s => s.erreur = false), 1750);
        }

        setTimeout(() => {
            if (this.state.flotte.length === 0) {
                this.setState(s => s.message = "Placer un navire de 2 cases");
            } else if (this.state.flotte.length === 1) {
                this.setState(s => s.message = "Placer un navire de 3 cases");
            } else if (this.state.flotte.length === 2) {
                this.setState(s => s.message = "Placer un autre navire de 3 cases");
            } else if (this.state.flotte.length === 3) {
                this.setState(s => s.message = "Placer un navire de 4 cases");
            } else if (this.state.flotte.length === 4) {
                this.setState(s => s.message = "Placer un navire de 5 cases");
            } else if (this.state.flotte.length === 5) {
                fetch(urlBase + '/partie/ajouternavires/' + this.state.idPartie + '/' + this.state.pseudo, {
                    method: "PUT",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.state.flotte)
                });

                // Attente joueurAdverse
                setTimeout(() => {
                    this.setState(s => s.messageErreur = "En attente du joueur adverse ...")
                    this.setState(s => s.erreur = true);
                }, 3000);

                let joueurAdversePret = setInterval(() => {
                    fetch(urlBase + '/partie/' + this.state.idPartie).then(
                        ret => ret.json().then(
                            rep => {
                                if (rep.data.idDuel !== null) {
                                    this.setState(s => s.erreur = false);
                                    setTimeout(() => {
                                        clearInterval(joueurAdversePret);
                                        this.props.navigation.navigate('Jeux', { pseudo: this.state.pseudo, idDuel: rep.data.idDuel });
                                    }, 10);
                                }
                            }
                        )
                    );
                }, 5000);
            }
        }, 10);
    }

    setCouleur(positions) {
        let couleur = "lightblue";

        if (this.state.flotte.length > 0) {
            this.state.flotte.forEach(navire => {
                if (navire.includes(positions)) {
                    couleur = "orange";
                }
            });
        }

        if (this.state.navire.length > 0) {
            if (this.state.navire.includes(positions)) {
                couleur = "orange";
            }
        }

        return couleur;
    }

    render() {
        return (
            <ImageBackground source={require('./assets/Background/background.png')} resizeMode="cover">
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.erreur}
                >
                    <View style={styles.modalView}>
                        <Image style={styles.fondErreur} source={require('./assets/Boutons/BoutonSansTexte.png')} />
                        <Text style={styles.erreur}>{this.state.messageErreur}</Text>
                    </View>
                </Modal>
                <View style={styles.container}>
                    <View>
                        <Image style={styles.fondMessage} source={require('./assets/Boutons/BoutonSansTexte.png')} />
                        <Text style={styles.message}>{this.state.message}</Text>
                    </View>
                    <GridView
                        data={this.state.ocean}
                        span={10}
                        spacing={1}
                        width="83%"
                        marginTop="10%"
                        square
                        flat
                        render={item =>
                            <Pressable
                                style={{ backgroundColor: this.setCouleur(item), flex: 1, borderRadius: 4, opacity: 0.75 }}
                                onPress={() => {
                                    this.ajouterPositions(item);
                                }}
                            ></Pressable>
                        }
                    />
                    <View style={styles.boutons}>
                        <Pressable
                            onPress={() => this.annuler()}
                        >
                            <Image style={{ resizeMode: 'contain', width: 150, height: 75 }} source={require('./assets/Boutons/Annuler.png')} />
                        </Pressable>

                        <Pressable
                            onPress={() => this.valider()}
                        >
                            <Image style={{ resizeMode: 'contain', width: 150, height: 75 }} source={require('./assets/Boutons/Valider.png')} />
                        </Pressable>
                    </View>
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    modalView: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 103
    },
    fondErreur: {
        position: 'relative',
        top: 98,
        resizeMode: 'contain',
        width: 210
    },
    erreur: {
        textAlign: 'center',
        color: '#ffffff',
        width: "50%",
        padding: 10
    },
    fondMessage: {
        position: 'relative',
        top: 30,
        resizeMode: 'stretch',
        width: 275,
        height: 40
    },
    message: {
        textAlign: 'center',
        color: '#ffffff'
    },
    boutons: {
        width: "100%",
        height: "33%",
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    }
});

export default CreationNavires;