import { useContext, useEffect, useState, } from "react";
import { Image, StyleSheet, Text, View, Dimensions, } from "react-native";
import colors from "../constants/colors";
import AuthContext from "../contexts/AuthContext";

const { width } = Dimensions.get('window');

const ArtistPreview = (props) => {

    const { artistId } = props;

    const { spotify } = useContext(AuthContext);

    const [artist, setArtist] = useState(null);

    useEffect(() => {
        if(artistId) {
            fetchArtist(artistId);
        }
    }, [artistId])

    const fetchArtist = async (id) => {
        spotify.getArtist(id)
            .then(musician => {
                setArtist(musician);
                console.log("ARTIST PREVIEW: ", musician.name);
            })
            .catch(err => {
                alert('Failed to get artist: ', err);
            })
    }

    if (!artist) return null;

    else return (
        <View style={{ flexDirection: 'row', alignItems: 'center', width: width, }}>
            <Image source={{ uri: artist.images[0].url }} style={styles.image} />
            
            <View style={{ flexGrow: 1, marginHorizontal: 5, }}>
                <Text style={styles.name}>{artist.name}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        height: 50,
        width: 50,
        borderRadius: 25,
        resizeMode: 'cover',
        marginHorizontal: 5,
    },
    name: {
        color: 'white',
        fontSize: 15,
        // flex: 1,
        
    }
})

export default ArtistPreview;