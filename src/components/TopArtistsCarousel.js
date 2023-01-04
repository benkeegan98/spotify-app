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

const TopArtistsCarousel = (props) => {

    const {
        navigation,
        user
    } = props;

    const { spotify } = useContext(AuthContext);

    const [topArtists, setTopArtists] = useState(null);
    const [activeTimeRange, setActiveTimeRange] = useState(timeFrames.MEDIUM)

    const scrollViewRef = useRef(null);

    useEffect(() => {
        fetchTopArtists();
    }, [activeTimeRange])

    const fetchTopArtists = async () => {

        spotify.getMyTopArtists({ time_range: activeTimeRange.id })
            .then(artists => {
                setTopArtists(artists);
                if (scrollViewRef) {
                    scrollViewRef.current.scrollTo({ y: 0 });
                }
            })
            .catch(err => {
                alert("Failed to get artists");
            })
    }

    const onPressArtist = (artistId) => {
        navigation.navigate("ArtistScreen", {
            artistId: artistId,
        })
    }

    if(!topArtists) {
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
                {topArtists && topArtists.items.map((artist, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => onPressArtist(artist.id)}
                        style={styles.square}
                    >
                        <Image source={{ uri: artist.images[0].url }} style={styles.image} />
                        <View
                            style={styles.rankingCircle}
                        >
                            <Text style={styles.rankingTxt}>{(index + 1).toString() + ''}</Text>
                        </View>
                        
                        <Text style={styles.name}>{artist.name}</Text>
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
        height: 220,
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
})

export default TopArtistsCarousel;