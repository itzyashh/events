import { ActivityIndicator, Alert, Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { Fontisto } from '@expo/vector-icons'
import { supabase } from '~/utils/supabase'
import { Attendee, Event } from '~/types/db'
import { showToastable } from 'react-native-toastable'
import { showToast } from '~/utils/Toast'
import { useAuth } from '~/providers/AuthProvider'
import Mapbox, { Camera, MapView, MarkerView } from '@rnmapbox/maps'


const Page = () => {

  const { id, lat ,long } = useLocalSearchParams()
  const { user } = useAuth()
  const longitude = parseFloat(long)
  const latitude = parseFloat(lat)

  const [event, setEvent] = React.useState<Event | null>(null)
  const [attendee, setAttendee] = React.useState<Attendee | null>(null)
  const [loading, setLoading] = React.useState(false)

  const getEvent = async () => { 
    setLoading(true)
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .returns<Event>()
      .single()

    const { data: attendeeData, error: attendeeError } = await supabase
      .from('attendees')
      .select('*')
      .eq('event_id', id)
      .eq('user_id', user?.id)
      .returns<Attendee>()
      .single()

    if (attendeeError) {
      console.log('error', attendeeError)
    }
    if (error) {
      console.error('error', error)
    }

    if (attendeeData) {
      console.log(attendeeData)
      setAttendee(attendeeData)
    }

    if (data) {
      console.log(data)
      setEvent(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    getEvent()
  }, [])

  const openeMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    const appleMapsUrl = `http://maps.apple.com/?daddr=${latitude},${longitude}`;

    // Check if Google Maps can be opened
    Linking.canOpenURL(googleMapsUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(googleMapsUrl);
        } else if (Platform.OS === 'ios') {
          // If Google Maps is not supported and it's an iOS device, fallback to Apple Maps
          Linking.openURL(appleMapsUrl)
            .then((supported) => {
              if (!supported) {
                Alert.alert('Neither Google Maps nor Apple Maps are available.');
              }
            })
            .catch((err) => console.error('An error occurred', err));
        } else {
          // If on Android and Google Maps is not available
          Alert.alert('Google Maps not supported on this device.');
        }
      })
      .catch((err) => console.log('An error occurred', err));
  };


  const onJoin = async () => {

    const { data, error } = await supabase
      .from('attendees')
      .insert({
        event_id: id,
        user_id: user?.id
      })
      .select('*')
      .returns<Attendee>()

      if (error) console.log('attendeeserror', error)

      if (!error) {
        showToast('Registered successfully!', 'success')
        setAttendee(data)
      }

}


  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Event',
          headerBackTitleVisible: false,
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#000',
          },
          headerRight: () => <Fontisto name="bookmark-alt" size={24} color="#ffffff" />,
        }}
      />

      <Image
        resizeMode="contain"
        source={{ uri: event?.image_url ?? undefined }}
        style={styles.image}
      />
      <View style={styles.eventInfo}>
        <Text style={styles.title}>{event?.title}</Text>
        <Text style={styles.location}>{event?.location}</Text>
        <Text style={styles.date}>
          {event?.start_date} - {event?.end_date}
        </Text>
        <Text style={styles.description}>{event?.description}</Text>

        <MapView style={{ height: 300, marginTop: 16 }} styleURL={Mapbox.StyleURL.Dark}>
          <Pressable style={styles.directionButton} onPress={openeMaps}>
            <Text style={styles.directionText}>Get Directions</Text>
          </Pressable>
          <Camera zoomLevel={15} centerCoordinate={[longitude, latitude]} />
          <MarkerView coordinate={[longitude, latitude]} allowOverlapWithPuck>
            <Fontisto name="map-marker-alt" size={34} color="#9aace0" />
          </MarkerView>
        </MapView>
      </View>

      {loading ? (
        <ActivityIndicator size={'large'} />
      ) : (
        <View style={[styles.footer, { justifyContent: attendee ? 'center' : 'space-between' }]}>
          {!attendee && <Text style={styles.footerText}>Free</Text>}
          {attendee ? (
            <Text style={styles.attendeeText}>You are registered</Text>
          ) : (
            <Pressable onPress={onJoin} style={styles.footerButton}>
              <Text style={styles.footerButtonText}>Register</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}



export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020408',
  },
  image: {
    width: '100%',
    height: 300,
  },
  eventInfo: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  location: {
    fontSize: 18,
    color: '#fff',
  },
  date: {
    fontSize: 16,
    color: '#fff',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    marginTop: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#101010',
    
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingHorizontal: 44,
    paddingBottom: 24,
  },
  footerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  footerButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  attendeeText: {
    color: '#68f568',
    fontSize: 16,
    fontWeight: 'bold',
  },
  directionButton: {
    position: 'absolute',
    top: 16,
    right: 6,
    backgroundColor: '#a4ea79',
    padding: 8,
    borderRadius: 8,
  },
  directionText: {
    color: '#000',
    fontWeight: 'bold',
  },


})