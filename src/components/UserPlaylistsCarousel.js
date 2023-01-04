import { useContext, useEffect, useState, } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import colors from "../constants/colors";
import AuthContext from "../contexts/AuthContext";

const UserPlaylistsCarousel = (props) => {

    const { user } = props;

    const { spotify } = useContext(AuthContext);

    const [playlists, setPlaylists] = useState(null);
    const [likedSongs, setLikedSongs] = useState(null);

    useEffect(() => {

        const fetchPlaylists = async (userId) => {

            spotify.getUserPlaylists(userId)
                .then(playlistRes => {
                    setPlaylists(playlistRes.items);
                })
                .catch(err => {
                    alert("Failed to get playlists");
                })
        }

        const fetchLikedSongs = async () => {
            spotify.getMySavedTracks()
                .then(tracks => {
                    console.log("liked songs: ", tracks)
                    setLikedSongs(tracks);
                })
                .catch(err => {
                    alert("Failed to get playlists");
                })
        }

        if(user.id) {
            fetchPlaylists(user.id);
            fetchLikedSongs();
        }

    }, [])

    if(!playlists && !likedSongs) {
        return null;
    }

    else return (
        <ScrollView
            horizontal
            contentContainerStyle={styles.container}
        >
            {likedSongs && likedSongs.items && (
                <TouchableOpacity
                    style={styles.square}
                >
                    <View style={{ flexWrap: 'wrap', flexDirection: 'row', }}>
                        {likedSongs.items.slice(0,4).map((track, key) => (
                            <Image
                                key={key}
                                source={{ uri: track.track.album.images[0].url }}
                                style={styles.likedSongsImg}
                            />
                        ))}
                    </View>
                    <Text style={styles.name}>Liked Songs</Text>
                    <Text style={styles.totalTracks}>{`${likedSongs.total} track${likedSongs.total !== 1 ? 's' : ''}`}</Text>
                </TouchableOpacity>
            )}
            
            {playlists && playlists.map((playlist, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.square}
                >
                    <Image source={{ uri: playlist.images[0].url }} style={styles.image} />
                    <Text style={styles.name}>{playlist.name}</Text>
                    <Text style={styles.totalTracks}>{`${playlist.tracks.total} track${playlist.tracks.total !== 1 ? 's' : ''}`}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
    },
    square: {
        minHeight: 220,
        maxHeight: 280,
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
    totalTracks: {
        color: 'white',
        fontSize: 14,
    }
})

export default UserPlaylistsCarousel;