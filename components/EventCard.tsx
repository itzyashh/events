import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Event } from '~/data/events';
import dayjs from 'dayjs';
import { BlurView } from 'expo-blur';
import { Link } from 'expo-router';


const helperImage = 'https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'

type EventCardProps = {
    event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <Link href={`/event/${event.id}`} asChild>
    <Pressable style={styles.container}>
      <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
      <ImageBackground source={{ uri: !event?.isImageWhite ? event.imageUrl : helperImage }} blurRadius={40} 
      style={styles.infoContainer}>
        <View style={styles.dateContainer}>
            <Text style={styles.month}>{dayjs(event.timestamp).format('MMM')}</Text>
            <Text style={styles.day}>{dayjs(event.timestamp).format('DD')}</Text>
        </View>

              <View style={{ flexShrink: 1, paddingLeft: 8 , borderBottomRightRadius: 16}}>
                  <Text numberOfLines={2} adjustsFontSizeToFit style={styles.title}>{event.title}</Text>
                  <Text adjustsFontSizeToFit style={styles.location}>{event.location}</Text>
                  <Text style={styles.date}>{event.startDate} - {event.endDate} ⏰ {dayjs(event.timestamp).format('HH:MM')} </Text>
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

})