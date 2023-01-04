import React, { useContext, useEffect, } from "react";
import { View, Text, TouchableOpacity, StyleSheet, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ResponseType, useAuthRequest } from "expo-auth-session";
import AuthContext from "../contexts/AuthContext";
import colors from "../constants/colors";
import authHandler from "../oAuth/AuthenticationHandler";

const discovery = {
    authorizationEndpoint: "https://accounts.spotify.com/authorize",
    tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const AuthScreen = (props) => {

    const {
        token,
        setToken,
        setExpirationTime,
        setRefreshToken,
    } = useContext(AuthContext)

    const handleLogin = async () => {
        const result = await authHandler.getTokens();
        setExpirationTime(result.expirationTime);
        setRefreshToken(result.refreshToken);
        setToken(result.accessToken);
    }
    
    return (
        <SafeAreaView
            style={styles.container}
        >
            <Text style={styles.headerTxt}>Spotemy</Text>
            <TouchableOpacity
                onPress={handleLogin}
                style={styles.submitBtn}
            >
                <Text style={styles.submitBtnTxt}>Sign in with Spotify</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    headerTxt: {
        fontSize: 28,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    submitBtn: {
        backgroundColor: colors.SPOTIFY_GREEN,
        paddingVertical: 20,
        marginHorizontal: 15,
        borderRadius: 30,
    },
    submitBtnTxt: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',

    }
})

export default AuthScreen;

