import { useContext, useEffect, useState, } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import colors from "../constants/colors";
import AuthContext from "../contexts/AuthContext";

const RecentlyPlayedCarousel = (props) => {

    const { navigation } = props;

    const { spotify } = useContext(AuthContext);

    const [recentlyPlayed, setRecentlyPlayed] = useState(null);

    useEffect(() => {
        fetchRecentlyPlayed();
    }, [])

    const fetchRecentlyPlayed = async () => {

        spotify.getMyRecentlyPlayedTracks()
            .then(tracks => {
                console.log("RECENTS: ", tracks);
                setRecentlyPlayed(tracks)
            })
            .catch(err => {
                alert("Failed to get recently played");
            })
    }

    const onPressTrack = (trackId) => {
        navigation.navigate("TrackScreen", {
            trackId: trackId
        });
    }

    if(!recentlyPlayed) {
        return null;
    }

    else return (
        
        <ScrollView
            horizontal
            contentContainerStyle={styles.container}
        >
            {recentlyPlayed && recentlyPlayed.items.map((track, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => onPressTrack(track.track.id)}
                    style={styles.square}
                >
                    <Image source={{ uri: track.track.album.images[0].url }} style={styles.image} />
                    <View
                        style={styles.rankingCircle}
                    >
                        <Text style={styles.rankingTxt}>{(index + 1).toString() + ''}</Text>
                    </View>
                    
                    <Text style={styles.name}>{track.track.name}</Text>
                    <Text style={styles.album}>{track.track.album.name}</Text>
                    <Text style={styles.artist}>{track.track.artists[0].name}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
        
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
    },
    rankingCircle: {
        position: 'absolute',
        top: 2,
        left: 2,
        backgroundColor: colors.SPOTIFY_GREEN,
        height: 36,
        width: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rankingTxt: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    square: {
        minHeight: 240,
        maxHeight: 275,
        width: 180,
        margin: 10,
    },
    image: {
        height: 180,
        width: 180,
    },
    likedSongsImg: {
        height: 90,
        width: 90,
        resizeMode: 'cover',
    },
    name: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 5,
    },
    artist: {
        color: 'white',
        fontSize: 15,
        marginTop: 2,
    },
    album: {
        color: colors.SPOTIFY_GREEN,
        fontSize: 15,
        marginTop: 2,
    },
})

export default RecentlyPlayedCarousel;