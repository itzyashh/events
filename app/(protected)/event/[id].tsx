import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { Fontisto } from '@expo/vector-icons'
import { supabase } from '~/utils/supabase'
import { Attendee, Event } from '~/types/db'
import { showToastable } from 'react-native-toastable'
import { showToast } from '~/utils/Toast'
import { useAuth } from '~/providers/AuthProvider'


const Page = () => {

  const { id } = useLocalSearchParams()
  const { user } = useAuth()

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
      console.error('error', attendeeError)
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

  const onJoin = async () => {

    const { data, error } = await supabase
      .from('attendees')
      .insert({
        event_id: id,
        user_id: user?.id
      })
      .select('*')
      .returns<Attendee>()

      if (error) console.error('error', error)

      if (!error) {
        showToast('Registered successfully!', 'success')
        setAttendee(data)
      }

}


  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Event',
        headerBackTitleVisible: false,
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: '#000',
        },
        headerRight: () => <Fontisto name="bookmark-alt" size={24} color="#ffffff" />
         }} />

    <Image source={{ uri: event?.image_url ?? undefined }} style={styles.image} />
    <View style={styles.eventInfo}>
      <Text style={styles.title}>{event?.title}</Text>
      <Text style={styles.location}>{event?.location}</Text>
      <Text style={styles.date}>{event?.start_date} - {event?.end_date}</Text>
      <Text style={styles.description}>{event?.description}</Text>


    </View>

{ loading ? <ActivityIndicator size={'large'} /> :   <View style={[styles.footer, { justifyContent: attendee ? 'center' : 'space-between' }]}>
 { !attendee && <Text style={styles.footerText}>Free</Text>}
 {    attendee ? <Text style={styles.attendeeText}>You are registered</Text>
 
 :<Pressable onPress={onJoin} style={styles.footerButton}>
        <Text style={styles.footerButtonText}>Register</Text>
      </Pressable>}
    </View>}
    </View>

  )
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


})