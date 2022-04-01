import React from 'react';
import {
    ImageBackground,
    Pressable,
    View,
    StyleSheet,
    Image
} from 'react-native';
import { Component } from 'react/cjs/react.production.min';
import SplashScreen from 'react-native-splash-screen';
import MMKVStorage from 'react-native-mmkv-storage';

const MMKV = new MMKVStorage.Loader().initialize();

class Accueil extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pseudoTrouvee: false,
            pseudo: null
        };
    }

    componentDidMount() {
        let pseudo = MMKV.getString('pseudo');

        if (pseudo !== null) {
            this.setState(s => {
                s.pseudo = pseudo;
                s.pseudoTrouvee = true;
            });
        }

        SplashScreen.hide();
    }

    render() {
        return (
            <ImageBackground source={require('./assets/Background/background.png')} resizeMode="cover" style={{height: "100%"}}>
                <View style={styles.container}>
                    <View style={styles.logo}>
                        <Image style={{ resizeMode: 'contain', width: 300 }} source={require('./assets/Logo/Logo3.png')} />
                    </View>
                    <Pressable style={styles.bouton} onPress={() => this.state.pseudoTrouvee ? this.props.navigation.navigate('Menu', { pseudo: this.state.pseudo }) : this.props.navigation.navigate('CreationPseudo')}>
                        <Image style={{ resizeMode: 'contain', width: 250 }} source={require('./assets/Boutons/Jouer.png')} />
                    </Pressable>
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bouton: {
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Accueil;