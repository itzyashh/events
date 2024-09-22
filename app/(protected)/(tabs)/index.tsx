import { Link, Redirect, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import EventCard from '~/components/EventCard';
import { Event } from '~/types/db';
import { supabase } from '~/utils/supabase';


export default function Home() {

  const [events, setEvents] = useState<Event[] | null>(null)

  const getEvents = async () => {

let { data: events, error } = await supabase
.from('events')
.select('*')
.returns<Event[]>()
        
if (error) {
console.error('error', error)
}

if (events) setEvents(events)
  }

  useEffect(() => {
    getEvents()
  }, [])

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
