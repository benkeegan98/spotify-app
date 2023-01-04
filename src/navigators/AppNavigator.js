import React, { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';

const AppNavigator = (props) => {

    const authContext = useContext(AuthContext);

    const signedIn = authContext.token ? true : false;

    if (!signedIn) {
        return (
            <AuthScreen />
        )
    } else {
        return (
            <HomeScreen />
        )
    }
}

export default AppNavigator;