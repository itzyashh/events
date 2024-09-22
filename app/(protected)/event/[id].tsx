import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { Fontisto } from '@expo/vector-icons'
import { supabase } from '~/utils/supabase'
import { Event } from '~/types/db'


const Page = () => {

  const { id } = useLocalSearchParams()

  const [event, setEvent] = React.useState<Event | null>(null)

  const getEvent = async () => { 
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .returns<Event>()
      .single()

    if (error) {
      console.error('error', error)
    }

    if (data) {
      console.log(data)
      setEvent(data)
    }
  }

  useEffect(() => {
    getEvent()
  }, [])




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

    <Image source={{ uri: event?.image_url ?? '' }} style={styles.image} />
    <View style={styles.eventInfo}>
      <Text style={styles.title}>{event?.title}</Text>
      <Text style={styles.location}>{event?.location}</Text>
      <Text style={styles.date}>{event?.start_date} - {event?.end_date}</Text>
      <Text style={styles.description}>{event?.description}</Text>


    </View>

    <View style={styles.footer}>
      <Text style={styles.footerText}>Free</Text>
      <View style={styles.footerButton}>
        <Text style={styles.footerButtonText}>Register</Text>
      </View>
    </View>
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
  },
  footerButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },


})