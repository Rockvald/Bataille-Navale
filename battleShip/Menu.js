import React from 'react';
import {
    ImageBackground,
    Pressable,
    View,
    StyleSheet,
    Image,
    ScrollView,
    Text,
    Modal
} from 'react-native';
import { Component } from 'react/cjs/react.production.min';

const urlBase = require("./url.json").url;

class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pseudo: props.route.params.pseudo,
            erreur: false,
            messageErreur: "",
            partiesAttenteJoueur: []
        };

        this.recupParties();

        this.recupPartiesAttenteJoueur = setInterval(() => {
            // Mise à jour du pseudo en cas de modification de celui-ci
            if (this.state.pseudo !== this.props.route.params.pseudo) {
                this.setState(s => s.pseudo = this.props.route.params.pseudo);
            }

            this.recupParties();
        }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.recupPartiesAttenteJoueur);
    }

    erreurReseau(erreur) {
        if (erreur.message === "Network request failed" && !this.state.erreur) {
            this.setState(s => s.messageErreur = "La connexion au serveur a été perdu ...")
            this.setState(s => s.erreur = true);
        }
    }

    recupParties() {
        fetch(urlBase + '/partie/attentejoueur').then(
            ret => ret.json().then(
                rep => {
                    this.setState(s => s.erreur = false);
                    this.setState(s => s.partiesAttenteJoueur = rep.data);
                }
            )
        ).catch(erreur => this.erreurReseau(erreur));
    }

    creerPartie() {
        fetch(urlBase + '/partie/creer/' + this.state.pseudo, { method: "POST" }).then(
            ret => ret.json().then(
                rep => {
                    this.props.navigation.navigate('CreationNavires', { pseudo: this.state.pseudo, idPartie: rep.data });
                }
            )
        ).catch(erreur => this.erreurReseau(erreur));
    }

    rejoindrePartie(idPartie) {
        fetch(urlBase + '/partie/ajouterjoueur/' + idPartie + "/" + this.state.pseudo, { method: 'PUT' }).then(
            ret => ret.json().then(
                rep => {
                    this.props.navigation.navigate('CreationNavires', { pseudo: this.state.pseudo, idPartie: idPartie });
                }
            )
        ).catch(erreur => this.erreurReseau(erreur));
    }

    render() {
        return (
            <ImageBackground source={require('./assets/Background/backgroundMenu.png')} resizeMode="cover" style={{ height: "100%" }}>
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
                    <ScrollView style={styles.partiesCreer}>
                        {
                            this.state.partiesAttenteJoueur.map(partie => (
                                <View style={styles.partie} key={partie.id}>
                                    <Text style={{ color: '#ffffff' }}>Joueur : {partie.joueurA.nom}</Text>
                                    <Pressable style={styles.boutonRejoindre} onPress={() => {
                                        this.rejoindrePartie(partie.id);
                                    }}>
                                        <Image style={{ resizeMode: 'contain', width: 150 }} source={require('./assets/Boutons/Rejoindre.png')} />
                                    </Pressable>
                                </View>
                            ))
                        }
                    </ScrollView>
                    <Pressable style={styles.boutonCreer} onPress={() => {
                        this.creerPartie();
                    }}>
                        <Image style={{ resizeMode: 'contain', width: 250 }} source={require('./assets/Boutons/Creer.png')} />
                    </Pressable>
                    <Pressable style={styles.pseudo} onPress={() => {
                        this.props.navigation.navigate('CreationPseudo', { pseudo: this.state.pseudo });
                    }}>
                        <Text style={{ color: 'white' }}>Modifier votre pseudo</Text>
                    </Pressable>
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        justifyContent: 'space-around',
        alignItems: 'center'
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
    partiesCreer: {
        flexGrow: 0,
        width: '75%',
        height: '50%'
    },
    partie: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 75,
        borderBottomWidth: 1,
        borderBottomColor: '#ffffff',
    },
    boutonCreer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 100
    },
    boutonRejoindre: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '25%',
        height: '25%',
        backgroundColor: 'blue'
    },
    pseudo: {
        backgroundColor: "#f5b01d",
        borderColor: '#000000',
        borderWidth: 1,
        padding: 5,
        borderRadius: 5
    }
});

export default Menu;