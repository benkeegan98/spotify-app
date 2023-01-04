import { useContext, useEffect, useState, useRef, } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import colors from "../constants/colors";
import AuthContext from "../contexts/AuthContext";

const timeFrames = {
    SHORT: {
        label: "4 weeks",
        id: 'short_term'
    },
    MEDIUM: {
        label: "6 months",
        id: 'medium_term'
    },
    LONG: {
        label: "All time",
        id: 'long_term'
    }
}

const TopTracksCarousel = (props) => {

    const { navigation } = props;

    const { spotify } = useContext(AuthContext);

    const [topTracks, setTopTracks] = useState(null);
    const [activeTimeRange, setActiveTimeRange] = useState(timeFrames.MEDIUM);

    const scrollViewRef = useRef(null);

    useEffect(() => {
        fetchTopTracks();
    }, [activeTimeRange])

    const fetchTopTracks = async () => {

        spotify.getMyTopTracks({ time_range: activeTimeRange.id })
            .then(tracks => {
                setTopTracks(tracks);
                if (scrollViewRef) {
                    scrollViewRef.current.scrollTo({ y: 0 });
                }
            })
            .catch(err => {
                alert("Failed to get tracks");
            })
    }

    const onPressTrack = (trackId) => {
        navigation.navigate("TrackScreen", {
            trackId: trackId
        });
    }

    if(!topTracks) {
        return null;
    }

    else return (
        <View>
            <View style={{ flexDirection: "row", justifyContent: 'space-evenly'}}>
                {Object.values(timeFrames).map((timeFrame, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setActiveTimeRange(timeFrame)}
                        style={{
                            backgroundColor: activeTimeRange.id === timeFrame.id ? colors.SPOTIFY_GREEN : undefined,
                            padding: 10,
                            borderRadius: 15,
                        }}
                    >
                        <Text style={{ color: 'white'}}>{timeFrame.label}</Text>
                    </TouchableOpacity>
                ))}
                
            </View>
            <ScrollView
                horizontal
                ref={scrollViewRef}
                contentContainerStyle={styles.container}
            >
                {topTracks && topTracks.items.map((track, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => onPressTrack(track.id)}
                        style={styles.square}
                    >
                        <Image source={{ uri: track.album.images[0].url }} style={styles.image} />
                        <View
                            style={styles.rankingCircle}
                        >
                            <Text style={styles.rankingTxt}>{(index + 1).toString() + ''}</Text>
                        </View>
                        
                        <Text numberOfLines={2} style={styles.name}>{track.name}</Text>
                        <Text style={styles.album}>{track.album.name}</Text>
                        <Text style={styles.artist}>{track.artists[0].name}</Text>
                        
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
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
    totalTracks: {
        color: 'white',
        fontSize: 14,
    }
})

export default TopTracksCarousel;