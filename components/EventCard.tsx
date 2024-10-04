import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import dayjs from 'dayjs';
import { BlurView } from 'expo-blur';
import { Link } from 'expo-router';
import { Event, NearByEvent } from '~/types/db';
import { FontAwesome5 } from '@expo/vector-icons';


const helperImage = 'https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'

type EventCardProps = {
    event: NearByEvent
    attendance?: number;
}

const EventCard = ({ event,attendance }: EventCardProps) => {

    const distance = event.dist_meters
    const distanceInKm = Math.round(distance / 1000)

  return (
    // <Link href={`/event/${event.id}?lat=${event.lat}&long=${event.long}`} asChild>
    <Link href={{
        pathname: `/(protected)/event/[id]`,
        params: {
            id: event.id,
            lat: event.lat,
            long: event.long
        }
    }} asChild>
    <Pressable style={styles.container}>
    <View style={styles.capsule}>
    <FontAwesome5 name="users" size={14} color="#ffffff" />
    <Text style={styles.attendance}>{attendance}</Text>
    </View>
    <View style={[styles.capsule, {top: 42,backgroundColor: '#255a71d3',paddingVertical: 4}]}>
    <Text style={styles.attendance}>{distanceInKm + ' km'}</Text>
    </View>
    <Image source={{ uri: event.image_url ?? '' }} style={styles.eventImage} />
      <ImageBackground source={{ uri: !event?.is_image_white ? event.image_url ?? '' : helperImage }} blurRadius={40} 
      style={styles.infoContainer}>
        <View style={styles.dateContainer}>
            <Text style={styles.month}>{dayjs(event.start_date).format('MMM')}</Text>
            <Text style={styles.day}>{dayjs(event.start_date).format('DD')}</Text>
        </View>

              <View style={{ flexShrink: 1, paddingLeft: 8 , borderBottomRightRadius: 16}}>
                  <Text numberOfLines={2} adjustsFontSizeToFit style={styles.title}>{event.title}</Text>
                  <Text adjustsFontSizeToFit style={styles.location}>{event.location}</Text>
                  <Text style={styles.date}>{event.start_date} - {event.end_date}</Text>
                  <Text style={[styles.date, {marginTop:4, fontWeight:'bold'}]}>⏰ {dayjs(event.event_time).format('HH:MM')}</Text>
              </View>
          </ImageBackground>
    </Pressable>
    </Link>
  )
}

export default EventCard

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        marginVertical: 16,
        overflow: 'hidden',
    },
    infoContainer: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        borderTopWidth: StyleSheet.hairlineWidth
    },
    dateContainer: {
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 16,
    },
    month: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: 'NewRocker_400Regular'
    },
    day: {
        color: '#e0e2ed',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'NewRocker_400Regular',
    },
    eventImage: {
        width: '100%',
        height: 80,
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
    },

    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    location: {
        color: 'white',
        fontSize: 16,
        marginVertical: 4,
    },
    date: {
        color: 'white',
        fontSize: 14,
        letterSpacing: 1,
        fontWeight: '500',
    },
    attendance: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
    },
    capsule: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#0be93bd3',
        padding: 6,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1,
        gap: 4,
    }

})