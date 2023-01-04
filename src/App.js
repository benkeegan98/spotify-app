import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AuthStore } from './contexts/AuthContext';
import { UserStore } from './contexts/UserContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './navigators/AppNavigator';

export default function App() {

    return (
        <AuthStore>
            <UserStore>
              <SafeAreaProvider>
                  <AppNavigator />
              </SafeAreaProvider>
            </UserStore>
        </AuthStore>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
