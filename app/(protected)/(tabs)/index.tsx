import { Link, Redirect, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import EventCard from '~/components/EventCard';
import { Attendee, Event, NearByEvent } from '~/types/db';
import { supabase } from '~/utils/supabase';
import * as Location from 'expo-location';

export default function Home() {
  const [events, setEvents] = useState<NearByEvent[] | null>(null);
  const [attendance, setAttendance] = useState<Attendee[] | null>(null);



  const getEvents = async () => {
    let { data: events, error } = await supabase.from('events').select('*').returns<Event[]>();

    let { data: attendees, error: attendeeError } = await supabase
      .from('attendees')
      .select('*')
      .returns<Attendee[]>();

    if (attendeeError) {
      console.error('attendess error', attendeeError);
    }

    if (attendees) setAttendance(attendees);

    if (error) {
      console.error('error', error);
    }

    // if (events) setEvents(events)
  };

  const getNearbyEvents = async (location: Location.LocationObject | null) => {
    if (!location) return;

    const { data: nearbyEvents, error } = await supabase
      .rpc('nearby_events', {
        lat: location?.coords.latitude,
        long: location?.coords.longitude,
      })
      .returns<NearByEvent[]>();

    console.log('nearbyEvents', nearbyEvents);
    console.log('err', error);
    if (error) {
      console.error('error', error);
      return;
    }

    if (nearbyEvents) setEvents(nearbyEvents);
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    getNearbyEvents(location);
  };

  useEffect(() => {
    getLocation();
    getEvents();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Events' }} />
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              attendance={attendance?.filter((a) => a.event_id === item.id).length}
            />
          )}
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
    backgroundColor: '#020408',
  },
});
