import { Image, StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";

const ProfileView = (props) => {

    const { user } = props;

    if(!user) return null;

    else return (
        <View style={styles.container}>
            
            <Image 
                source={{ uri: user.images[0].url }}
                style={styles.profilePicture}
            />
            <Text style={styles.nameTxt}>{user.display_name}</Text>
            <Text style={styles.usernameTxt}>{user.id}</Text>
            {/* <Text style={styles.emailTxt}>{user.email}</Text> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    nameTxt: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 15,
    },
    usernameTxt: {
        color: colors.SPOTIFY_GREEN,
        fontSize: 16,
    },
    emailTxt: {
        color: 'white',
        fontSize: 14,
    },
    profilePicture: {
        height: 150,
        width: 150,
        resizeMode: 'contain',
        borderRadius: 75,
    }
})

export default ProfileView;