import React from 'react';
import {
    ImageBackground,
    Pressable,
    View,
    StyleSheet,
    Image,
    TextInput
} from 'react-native';
import { Component } from 'react/cjs/react.production.min';
import MMKVStorage from 'react-native-mmkv-storage';

const MMKV = new MMKVStorage.Loader().initialize();

class CreationPseudo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pseudo: this.props.route.params !== undefined ? this.props.route.params.pseudo : null
        };
    }

    render() {
        return (
            <ImageBackground source={require('./assets/Background/background.png')} resizeMode="cover" style={{ height: "100%" }}>
                <View style={styles.container}>
                    <Image style={styles.fondSaisie} source={require('./assets/Boutons/BoutonSansTexte.png')} />
                    <TextInput
                        style={styles.saisiPseudo}
                        onChangeText={(event) => this.setState(s => s.pseudo = event)}
                        value={this.state.pseudo}
                        placeholderTextColor="#ffffff"
                        placeholder={"Saisissez votre pseudo"}
                        keyboardType="default"
                    />
                    <Pressable style={styles.bouton} onPress={() => {
                        MMKV.setString('pseudo', this.state.pseudo);
                        this.props.navigation.navigate('Menu', { pseudo: this.state.pseudo });
                    }}>
                        <Image style={{ resizeMode: 'contain', width: 250 }} source={require('./assets/Boutons/Valider.png')} />
                    </Pressable>
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    fondSaisie: {
        position: 'relative',
        top: 200,
        resizeMode: 'stretch',
        width: 200,
        height: 50
    },
    saisiPseudo: {
        position: 'relative',
        top: 151,
        color: '#ffffff'
    },
    bouton: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        top: 300
    }
});

export default CreationPseudo;