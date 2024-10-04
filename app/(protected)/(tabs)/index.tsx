import { Link, Redirect, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import EventCard from '~/components/EventCard';
import { Attendee, Event, NearByEvent } from '~/types/db';
import { supabase } from '~/utils/supabase';
import * as Location from 'expo-location';
import ToggleView from '~/components/ToggleView';
import Mapbox, { Camera, Images, MapView, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { point,featureCollection } from '@turf/helpers';
import GBottomSheet from '~/components/BottomSheet';
import EventPreview from '~/components/EventPreview';

const MarkerPin = require('~/assets/marker.png');

export default function Home() {
  const [events, setEvents] = useState<NearByEvent[] | null>(null);
  const [attendance, setAttendance] = useState<Attendee[] | null>(null);
  const [selectedView, setSelectedView] = useState<'events' | 'map'>('events')
  const [points, setPoints] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [sheetIndex, setSheetIndex] = useState(-1);


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

  useEffect(() => {
    if (events) {
      const points = events
        .filter((event) => event.lat && event.long)
        .map((event) => point([event.long, event.lat], { event }));
      setPoints(points);
    }
  }
  , [events]);


  return (
    <>
      <Stack.Screen options={{ title: 'Events' }} />
      <View style={[styles.container, selectedView === 'map' ? { padding: 0 } : {}]}>
     { selectedView == 'events' ? <FlatList
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
        : <MapView
            style={{ flex: 1 }}
            styleJSON={Mapbox.StyleURL.Dark}
            logoEnabled={false}
            rotateEnabled={false}

            >
              <Camera
                zoomLevel={14}
                followUserLocation={selectedEvent ? false : true}
                centerCoordinate={[selectedEvent?.long, selectedEvent?.lat]}
                />

              <ShapeSource
                id="events"
                shape={featureCollection(points)}
                onPress={(e) => {
                  console.log('e', e);
                  const event = e.features[0].properties?.event;
                  setSelectedEvent(event);
                  setShowBottomSheet(true);
                }}
                >
                  <SymbolLayer
                    id="events-icons"
                    style={{
                      iconImage: 'pin',
                      iconAllowOverlap: true,
                      iconSize: .1,
                    }}
                  />
                    <Images images={{ 'pin': MarkerPin }} />

                </ShapeSource>
            </MapView>
      } 
        <GBottomSheet visible={showBottomSheet && selectedView === 'map'}
         setVisible={setShowBottomSheet} setSheetIndex={setSheetIndex}>
      <EventPreview event={selectedEvent} sheetIndex={sheetIndex} />
        </GBottomSheet>
     { !showBottomSheet &&   <ToggleView selected={selectedView} setSelected={setSelectedView} />}
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
