import { authorize, refresh } from 'react-native-app-auth';
import { encode as btoa } from 'base-64';
import * as AuthSession from 'expo-auth-session';
import env from '../env';

class AuthenticationHandler {

    constructor() {
        this.spotifyAuthConfig = {
            clientId: env.spotifyClientId,
            clientSecret: env.spotifyClientSecret,
            // redirectUri: "spotmobile://oauthredirect",
            redirectUri: env.spotifyRedirectUri,
            scopes: [
                "user-read-currently-playing",
                "user-read-recently-played",
                "user-read-playback-state",
                "user-read-playback-position",
                "user-top-read",
                "user-modify-playback-state",
                "streaming",
                "user-read-email",
                "user-read-private",

                "user-follow-modify",
                "user-follow-read",
                
                "playlist-read-collaborative",
                "playlist-modify-public",
                "playlist-read-private",
                "playlist-modify-private",
                "app-remote-control",
                "streaming",
                "user-library-modify",
                "user-library-read",
            ],
            // In order to follow the "Authorization Code Flow" 
            // to fetch token after authorizationEndpoint
            // this must be set to false
            // usePKCE: false,
            serviceConfiguration: env.spotifyServiceConfiguration
        }
    }

    getAuthCode = async () => {
        try {
            // const result = await authorize(this.spotifyAuthConfig);
            const scopes = this.spotifyAuthConfig.scopes.join(' ');

            const result = await AuthSession.startAsync({
                authUrl:
                  'https://accounts.spotify.com/authorize' +
                  '?response_type=code' +
                  '&client_id=' + this.spotifyAuthConfig.clientId +
                  (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
                  '&redirect_uri=' +
                  encodeURIComponent(this.spotifyAuthConfig.redirectUri),
            })

            return await result.params.code;
        } catch (error) {
            console.log("Failed to sign in: ", JSON.stringify(error));
        } 
    }

    getTokens = async () => {
        try {
            const authCode = await this.getAuthCode();
            const credsB64 = btoa(`${this.spotifyAuthConfig.clientId}:${this.spotifyAuthConfig.clientSecret}`);
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${credsB64}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `grant_type=authorization_code&code=${authCode}&redirect_uri=${this.spotifyAuthConfig.redirectUri}`,
            });
            const responseJson = await response.json();
            // destructure the response and rename the properties to be in camelCase to satisfy my linter ;)
            const {
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_in: expiresIn,
            } = responseJson;

            const expirationTime = new Date().getTime() + expiresIn * 1000;

            return {
                accessToken,
                refreshToken,
                expirationTime,
            }

        } catch (err) {
            console.error("Failed to get tokens: ", err);
        }
    }
    
    refreshLogin = async (refreshToken) => {
        const result = await refresh(this.spotifyAuthConfig, {
            refreshToken: refreshToken,
        });
        return result;
    }

    refreshTokens = async (refreshToken) => {
        try {
            const credsB64 = btoa(`${this.spotifyAuthConfig.clientId}:${this.spotifyAuthConfig.clientSecret}`);
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${credsB64}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
            });
            const responseJson = await response.json();
            if (responseJson.error) {
                await getTokens();
            } else {
                const {
                    access_token: newAccessToken,
                    refresh_token: newRefreshToken,
                    expires_in: expiresIn,
                } = responseJson;
            
                const expirationTime = new Date().getTime() + expiresIn * 1000;
                return {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                    expirationTime: expirationTime,
                }
            }
          } catch (err) {
            console.error(err)
          }
    }
}

const authHandler = new AuthenticationHandler();

export default authHandler;