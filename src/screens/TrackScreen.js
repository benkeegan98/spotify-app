import { setStatusBarBackgroundColor } from "expo-status-bar";
import { Fragment, useContext, useEffect, useState } from "react";
import { StyleSheet, View, Image, Text, } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

import ArtistPreview from "../components/ArtistPreview";
import colors from "../constants/colors";
import AuthContext from "../contexts/AuthContext";
import { getDuration, getFeaturePercentage, getKeySignature, getModality, getTempo, getTimeSignature, } from "../helpers/audioFeatures";

const TrackScreen = (props) => {

    const {
        navigation,
        route,
    } = props;

    const {
        trackId = null
    } = route.params;

    const { spotify } = useContext(AuthContext);

    const [track, setTrack] = useState(null);
    const [audioFeatures, setAudioFeatures] = useState(null);
    const [audioAnalysis, setAudioAnalysis] = useState(null);

    useEffect(() => {
        if(trackId) {
            fetchTrack(trackId);
            fetchTrackAudioFeatures(trackId);
            fetchTrackAudioAnalysis(trackId);
        }
    }, [trackId])

    const fetchTrack = async (trackId) => {
        spotify.getTrack(trackId)
            .then(track => {
                setTrack(track);
            })
    }

    const fetchTrackAudioFeatures = async (trackId) => {
        spotify.getAudioFeaturesForTrack(trackId)
            .then(features => {
                console.log("AUDIO FEATURES: ", features)
                setAudioFeatures(features);
            })
    }

    const fetchTrackAudioAnalysis = async (trackId) => {
        spotify.getAudioAnalysisForTrack(trackId)
            .then(analysis => {
                console.log("AUDIO ANALYSIS: ", analysis)
                setAudioAnalysis(analysis);
            })
    }

    const onPressArtist = (artistId) => {
        navigation.push("ArtistScreen", {
            artistId: artistId
        });
    }

    if (!track && !audioAnalysis && !audioFeatures) return (
        <View style={styles.container}>
            {null}
        </View>
    )

    else return (
        <ScrollView contentContainerStyle={styles.container}>
            {track && (
                <Fragment>
                    <Image source={{ uri: track.album.images[0].url }} style={styles.image} />
                    <Text style={styles.title}>{track.name}</Text>
                    <Text style={styles.album}>{track.album.name}</Text>

                    <View style={{ paddingVertical: 10,}}>
                        {track.artists.map((artist, key) => (
                            <TouchableOpacity
                                key={key}
                                onPress={() => onPressArtist(artist.id)}
                                style={{ paddingVertical: 5,}}
                            >
                                <ArtistPreview artistId={artist.id} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </Fragment>
            )}

            {audioFeatures && (
                <View>
                    <Text style={styles.sectionHeader}>Audio Features</Text>

                    <View style={styles.audioFeatureRow}>
                        <Text style={styles.audioFeatureLabel}>Duration:</Text>
                        <Text style={styles.audioFeatureValue}>{getDuration(audioFeatures.duration_ms)}</Text>
                    </View>

                    <View style={styles.audioFeatureRow}>
                        <Text style={styles.audioFeatureLabel}>Key:</Text>
                        <Text style={styles.audioFeatureValue}>{getKeySignature(audioFeatures.key)}</Text>
                    </View>

                    <View style={styles.audioFeatureRow}>
                        <Text style={styles.audioFeatureLabel}>Modality:</Text>
                        <Text style={styles.audioFeatureValue}>{getModality(audioFeatures.mode)}</Text>
                    </View>

                    <View style={styles.audioFeatureRow}>
                        <Text style={styles.audioFeatureLabel}>Tempo (BPM):</Text>
                        <Text style={styles.audioFeatureValue}>{getTempo(audioFeatures.tempo)}</Text>
                    </View>

                    <View style={styles.audioFeatureRow}>
                        <Text style={styles.audioFeatureLabel}>Time Signature:</Text>
                        <Text style={styles.audioFeatureValue}>{getTimeSignature(audioFeatures.time_signature)}</Text>
                    </View>

                    <View style={styles.audioFeatureRow}>
                        <Text style={styles.audioFeatureLabel}>Loudness:</Text>
                        <Text style={styles.audioFeatureValue}>{`${audioFeatures.loudness.toFixed(1)} dB`}</Text>
                    </View>

                    {/* ----------- */}

                    <Text style={{...styles.audioFeatureLabel, paddingHorizontal: 20, paddingVertical: 5}}>Acousticness:</Text>
                    <View style={styles.progressBarContainer}>
                        <View style={{ ...styles.progressBarFilled, width: getFeaturePercentage(audioFeatures.acousticness), }}/>
                    </View>

                    <Text style={{...styles.audioFeatureLabel, paddingHorizontal: 20, paddingVertical: 5}}>Danceability:</Text>
                    <View style={styles.progressBarContainer}>
                        <View style={{ ...styles.progressBarFilled, width: getFeaturePercentage(audioFeatures.danceability), }}/>
                    </View>

                    <Text style={{...styles.audioFeatureLabel, paddingHorizontal: 20, paddingVertical: 5}}>Energy:</Text>
                    <View style={styles.progressBarContainer}>
                        <View style={{ ...styles.progressBarFilled, width: getFeaturePercentage(audioFeatures.energy), }}/>
                    </View>

                    <Text style={{...styles.audioFeatureLabel, paddingHorizontal: 20, paddingVertical: 5}}>Liveness:</Text>
                    <View style={styles.progressBarContainer}>
                        <View style={{ ...styles.progressBarFilled, width: getFeaturePercentage(audioFeatures.liveness), }}/>
                    </View>


                    <Text style={{...styles.audioFeatureLabel, paddingHorizontal: 20, paddingVertical: 5}}>Instrumentalness:</Text>
                    <View style={styles.progressBarContainer}>
                        <View style={{ ...styles.progressBarFilled, width: getFeaturePercentage(audioFeatures.instrumentalness), }}/>
                    </View>
                    <View style={styles.scaleContainer}>
                        <Text style={styles.scaleText}>Vocal</Text>
                        <Text style={styles.scaleText}>Instrumental</Text>
                    </View>

                    <Text style={{...styles.audioFeatureLabel, paddingHorizontal: 20, paddingVertical: 5}}>Speechiness:</Text>
                    <View style={styles.progressBarContainer}>
                        <View style={{ ...styles.progressBarFilled, width: getFeaturePercentage(audioFeatures.speechiness), }}/>
                    </View>
                    <View style={styles.scaleContainer}>
                        <Text style={styles.scaleText}>All Music</Text>
                        <Text style={styles.scaleText}>All Spoken Word</Text>
                    </View>

                    <Text style={{...styles.audioFeatureLabel, paddingHorizontal: 20, paddingVertical: 5}}>Valence:</Text>
                    <View style={styles.progressBarContainer}>
                        <View style={{ ...styles.progressBarFilled, width: getFeaturePercentage(audioFeatures.valence), }}/>
                    </View>
                    <View style={styles.scaleContainer}>
                        <Text style={styles.scaleText}>Sad, Depressed</Text>
                        <Text style={styles.scaleText}>Happy, Euphoric</Text>
                    </View>
                </View>
            )}
            
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flexGrow: 1,
        paddingBottom: 40,
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
        fontSize: 25,
    },
    artist: {
        color: 'white',
        fontSize: 20,
    },
    album: {
        color: colors.SPOTIFY_GREEN,
        fontSize: 20,
    },
    sectionHeader: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        marginVertical: 10,
    },
    audioFeatureRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    audioFeatureLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    audioFeatureValue: {
        color: colors.SPOTIFY_GREEN,
        fontSize: 16,
    },
    audioFeatureBarContainer: {
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    progressBarContainer: {
        width: '90%',
        backgroundColor: 'silver',
        alignSelf: 'center',
        borderRadius: 15,
    },
    progressBarFilled: {
        backgroundColor: colors.SPOTIFY_GREEN,
        height: 15,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
    },
    scaleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 5,
    },
    scaleText: {
        color: 'white',
        fontSize: 14,
    }
})

export default TrackScreen;