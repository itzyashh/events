import { Link, Redirect, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import EventCard from '~/components/EventCard';
import { Attendee, Event } from '~/types/db';
import { supabase } from '~/utils/supabase';


export default function Home() {

  const [events, setEvents] = useState<Event[] | null>(null)
  const [attendance, setAttendance] = useState<Attendee[] | null>(null)

  const getEvents = async () => {

let { data: events, error } = await supabase
.from('events')
.select('*')
.returns<Event[]>()

let { data: attendees, error: attendeeError } = await supabase
.from('attendees')
.select('*')
.returns<Attendee[]>()


if (attendeeError) {
console.error('attendess error', attendeeError)
}

if (attendees) setAttendance(attendees)
        
if (error) {
console.error('error', error)
}

console.log('events',events)

// if (events) setEvents(events)
  }

  const getNearbyEvents = async () => {
    const { data: nearbyEvents, error } = await supabase.rpc('nearby_events', {
      lat: 18.543013,
      long: 73.828717
    }).returns<Event[]>()

    console.log('nearbyEvents',nearbyEvents)
    console.log('err',error)
    if (error) {
      console.error('error', error)
      return
    }

    if (nearbyEvents) setEvents(nearbyEvents)
    
  } 

  useEffect(() => {
    getEvents()
    getNearbyEvents()
  }, [])

  return (
    <>
      <Stack.Screen options={{ title: 'Events' }} />
      <View style={styles.container}>

    <FlatList
    showsVerticalScrollIndicator={false}
    renderItem={({ item }) => (
        <EventCard event={item} attendance={attendance?.filter((a) => a.event_id === item.id).length} />
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
