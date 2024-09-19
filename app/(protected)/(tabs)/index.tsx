import { Link, Redirect, Stack } from 'expo-router';
import { StyleSheet, View, FlatList } from 'react-native';
import EventCard from '~/components/EventCard';
import events from '~/data/events';


export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <View style={styles.container}>

    <FlatList
    showsVerticalScrollIndicator={false}
    renderItem={({ item }) => (
        <EventCard event={item} />
    )
  }
    data={events}
    keyExtractor={(item) => item.id.toString()}
    />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingVertical: 0,
    backgroundColor: "#020408"
  },
});
