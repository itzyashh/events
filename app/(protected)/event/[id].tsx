import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import events from '~/data/events'
import { Fontisto } from '@expo/vector-icons'

const Page = () => {

  const { id } = useLocalSearchParams()

  // @ts-ignore
  const event = events.find((event) => event.id == parseInt(id))

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

    <Image source={{ uri: event?.imageUrl }} style={styles.image} />
    <View style={styles.eventInfo}>
      <Text style={styles.title}>{event?.title}</Text>
      <Text style={styles.location}>{event?.location}</Text>
      <Text style={styles.date}>{event?.startDate} - {event?.endDate}</Text>
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