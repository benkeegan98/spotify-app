import { Fragment, useContext, useEffect, useState } from "react";
import { StyleSheet, View, Image, Text, } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import ArtistPreview from "../components/ArtistPreview";
import colors from "../constants/colors";

import AuthContext from "../contexts/AuthContext";

const ArtistScreen = (props) => {

    const {
        navigation,
        route,
    } = props;

    const {
        artistId = null
    } = route.params;

    const { spotify } = useContext(AuthContext);

    const [artist, setArtist] = useState(null);
    const [topTracks, setTopTracks] = useState(null);
    const [relatedArtists, setRelatedArtists] = useState(null);

    useEffect(() => {
        if(artistId) {
            fetchArtist(artistId);
            fetchArtistTopTracks(artistId);
            fetchRelatedArtists(artistId);
        }
    }, [artistId]);

    const fetchArtist = async (id) => {
        spotify.getArtist(id)
            .then(artiste => {
                console.log("GET ARTIST: ", artiste);
                setArtist(artiste);
            })
            .catch(err => {
                alert('Failed to get artist');
            })
    }

    const fetchArtistTopTracks = async (id) => {
        spotify.getArtistTopTracks(id, 'US')
            .then(tracks => {
                console.log("GOt ARTist TOP TRACKS: ", tracks);
                setTopTracks(tracks);
            })
            .catch(err => {
                alert('Failed to get top tracks');
                console.log("FAILED TO GET TOP TRACKS: ", err);
            })
    }

    const fetchRelatedArtists = async (id) => {
        spotify.getArtistRelatedArtists(id)
            .then(artists => {
                console.log("Got related artists: ", artists);
                setRelatedArtists(artists);
            })
            .catch(err => {
                alert('Failed to get related artists');
                console.log("FAILED TO GET RELATED ARTISTS: ", err);
            })
    }

    const onPressTrack = (trackId) => {
        navigation.push("TrackScreen", {
            trackId: trackId
        });
    }

    const onPressArtist = (id) => {
        navigation.push("ArtistScreen", {
            artistId: id
        });
    }


    if (!artist && !topTracks && !relatedArtists) return (
        <View style={styles.container}>
            {null}
        </View>
    )

    else return (
        <ScrollView 
            contentContainerStyle={styles.container}
        >
            {artist && (
                <Fragment>
                    <Image source={{ uri: artist.images[0].url }} style={styles.image} />
                    <Text style={styles.title}>{artist.name}</Text>
                    <View style={{ paddingVertical: 10, flexDirection: 'row', flexWrap: 'wrap', }}>
                        {artist.genres.map((genre, key) => (
                            <TouchableOpacity key={key} style={{ paddingVertical: 5, backgroundColor: colors.SPOTIFY_GREEN, borderRadius: 15, paddingHorizontal: 10, margin: 3, }}>
                                <Text style={{ color: 'white', fontSize: 15,}}>{genre}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Fragment>
            )}
            
            {topTracks && topTracks.tracks && (
                <View>
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginVertical: 15, }}>Top Tracks</Text>
                    {topTracks.tracks.map((track, key) => (
                        <TouchableOpacity 
                            key={key}
                            onPress={() => onPressTrack(track.id)}
                            style={{ flexDirection: 'row', marginVertical: 5, }}
                        >
                            <Image source={{ uri: track.album.images[0].url }} style={{ height: 50, width: 50, borderRadius: 25, resizeMode: 'cover'}} />
                            <View style={{ flex: 1,paddingHorizontal: 10, }}>
                                <Text style={{ color: 'white', fontWeight: 'bold',  }}>{track.name}</Text>
                                <Text style={{ color: 'white', }}>{track.album.name}</Text>
                            </View>
                            
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {relatedArtists && relatedArtists.artists && (
                <View>
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginVertical: 15, }}>Related Artists</Text>
                    {relatedArtists.artists.map((artiste, key) => (
                        <TouchableOpacity 
                            key={key}
                            onPress={() => onPressArtist(artiste.id)}
                            style={{ flexDirection: 'row', marginVertical: 5, }}
                        >
                            <ArtistPreview artistId={artiste.id} />
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flexGrow: 1,
    },
    image: {
        height: 300,
        width: 300,
        alignSelf: 'center',
        marginVertical: 15,
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 28,
    },
    artist: {
        color: 'white',
        fontSize: 20,
    },
    album: {
        color: 'white',
        fontSize: 20,
    }
})

export default ArtistScreen;