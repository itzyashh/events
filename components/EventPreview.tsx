import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Event } from '~/types/db'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { Feather, FontAwesome, FontAwesome6 } from '@expo/vector-icons'
import { router } from 'expo-router'

type EventPreviewProps = {
     event: Event   
     sheetIndex: number
    }

const EventPreview: React.FC<EventPreviewProps> = ({ event, sheetIndex }) => {


    console.log('%c🤪 ~ file: EventPreview.tsx:13 : ', 'color: #4c14ca',sheetIndex)

    const goToEvent = () => {
        router.push({
            pathname: '/event/[id]',
            params: { 
                id: event.id,
                lat: event.lat,
                long: event.long,
             },
        })
    }


  return (
    <View>

   { sheetIndex >= 1 && <Animated.Image
         entering={FadeInUp.duration(500)}
         exiting={FadeInDown.duration(500)}
         
         source={{ uri: event.image_url, cache:'default' }} style={{ width: '100%', height: 200 }} />}

        <ImageBackground
            blurRadius={10}
            tintColor={'rgba(0,0,0,0.5)'}
            imageStyle={{ display: sheetIndex >= 1 ? 'none' : 'flex' }}
         source={{ uri: event.image_url }} 
        style={{ padding: 16,
         }}>

      <Text style={styles.eventName}>{event.title}</Text>
      <Text 
      numberOfLines={sheetIndex >= 1 ? 3 : 2}
      style={styles.description}>{event.description}</Text>

      <Pressable style={styles.button} onPress={goToEvent}>
        <Feather name="corner-down-right" size={24} color="#e9e9e9" />
        <Text style={{ color: '#fff', fontSize: 15 }}>Go to details</Text>
        </Pressable>

    </ImageBackground>
    </View>
  )
}

export default EventPreview

const styles = StyleSheet.create({
    eventName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    description: {
        fontSize: 16,
        color: '#e5e5e5',
        marginTop: 12,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#4767e6',
        padding: 10,
        alignSelf: 'flex-start',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        gap: 8,
    },
})