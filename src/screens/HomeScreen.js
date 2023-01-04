import React, { useEffect, useContext, } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../constants/colors";
import AuthContext from "../contexts/AuthContext";
import UserContext from "../contexts/UserContext";
import authHandler from "../oAuth/AuthenticationHandler";

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import Dashboard from "../components/Dashboard";
import TrackScreen from "./TrackScreen";
import ArtistScreen from "./ArtistScreen";

const Stack = createStackNavigator();

const HomeScreen = (props) => {

    const authContext = useContext(AuthContext);
    const {
        user,
        setUser
    } = useContext(UserContext);

    const {
        spotify
    } = authContext;

    const MyTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            text: 'white',
            background: 'black'
        },
    };

    useEffect(() => {

        let didCancel = false;

        if(authContext.expirationTime) {
            const tokenExpirationTime = authContext.expirationTime;

            const refreshTokens = async () => {
                const result = await authHandler.refreshTokens();
                authContext.setExpirationTime(result.expirationTime);
                authContext.setRefreshToken(result.refreshToken);
                authContext.setToken(result.accessToken);
            }

            if (!tokenExpirationTime || new Date().getTime() > tokenExpirationTime) {
                
                if(!didCancel) refreshTokens();

            }
        }

        return () => { didCancel = true; }

    }, [])

    useEffect(() => {
        const getUser = async (spotifyClient) => {
            const currUser = await spotifyClient.getMe();
            setUser(await currUser);
        }

        if(spotify) {
            getUser(spotify);
        }
    }, [spotify])

    if (!user) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>
                    HELLO, WORLD!
                </Text>
            </SafeAreaView>
        )
    }

    else return (
        <SafeAreaView style={styles.container}>
            <NavigationContainer theme={MyTheme}>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        
                    }}
                >
                    <Stack.Screen
                        name="Dashboard"
                    >
                        {(props) => <Dashboard {...props} user={user} />}
                    </Stack.Screen>
                    <Stack.Screen
                        name="TrackScreen"
                        component={TrackScreen}
                    />
                    <Stack.Screen
                        name="ArtistScreen"
                        component={ArtistScreen}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaView>
        
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
    },
    headerTxt: {
        color: colors.SPOTIFY_GREEN,
    },
    sectionHeader: {
        color: 'white',
        fontSize: 32,
        paddingHorizontal: 10,
        marginVertical: 15,
    },
    row: {
        flexDirection: 'row',
    }
})

export default HomeScreen;