import React from 'react';
import { Component } from 'react/cjs/react.production.min';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Accueil from './Accueil';
import CreationPseudo from './CreationPseudo';
import Menu from './Menu';
import CreationNavires from './CreationNavires';
import Jeux from './Jeux';

const Stack = createNativeStackNavigator();

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Accueil" screenOptions={{headerShown: false}}>
                    <Stack.Screen name="Accueil" component={Accueil} />
                    <Stack.Screen name="CreationPseudo" component={CreationPseudo} />
                    <Stack.Screen name="Menu" component={Menu} />
                    <Stack.Screen name="CreationNavires" component={CreationNavires} />
                    <Stack.Screen name="Jeux" component={Jeux} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

export default App;