import React, { Component, useState, useContext, useEffect } from 'react';
import SpotifyWebAPI from 'spotify-web-api-js';

const AuthContext = React.createContext();

export const AuthStore = (props) => {

    const [token, setToken] = useState(null);
    const [expirationTime, setExpirationTime] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [spotify, setSpotify] = useState(null);

    useEffect(() => {

        const setSpotifyClient = async (accessToken) => {
            let spotifyClient = new SpotifyWebAPI();
            spotifyClient.setAccessToken(accessToken);
            setSpotify(spotifyClient);
        }

        if(token) {
            setSpotifyClient(token)
        }
    }, [token])

    return (
        <AuthContext.Provider value={{
            token,
            setToken,
            expirationTime,
            setExpirationTime,
            refreshToken,
            setRefreshToken,

            spotify,
            setSpotify,
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext;