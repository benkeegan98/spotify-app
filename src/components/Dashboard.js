import { Text, StyleSheet, } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import ProfileView from "./ProfileView";
import UserPlaylistsCarousel from "./UserPlaylistsCarousel";
import TopArtistsCarousel from "./TopArtistsCarousel";
import TopTracksCarousel from "./TopTracksCarousel";
import RecentlyPlayedCarousel from "./RecentlyPlayedCarousel";

const Dashboard = (props) => {

    const { navigation, user } = props;

    if (!user) return null;

    else return (
        <ScrollView style={styles.container}>
            <ProfileView user={user} />

            <Text style={styles.sectionHeader}>My Playlists</Text>
            <UserPlaylistsCarousel user={user} />

            <Text style={styles.sectionHeader}>Top Artists</Text>
            <TopArtistsCarousel navigation={navigation} />

            <Text style={styles.sectionHeader}>Top Tracks</Text>
            <TopTracksCarousel navigation={navigation} />

            <Text style={styles.sectionHeader}>Recently Played</Text>
            <RecentlyPlayedCarousel navigation={navigation} />

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
    },
    sectionHeader: {
        color: 'white',
        fontSize: 32,
        paddingHorizontal: 10,
        marginVertical: 15,
    },
})

export default Dashboard;