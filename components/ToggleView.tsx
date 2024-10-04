import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons'

type ToggleViewProps = {
    selected: 'events' | 'map'
    setSelected: (selected: 'events' | 'map') => void
}

const ToggleView = ({ selected, setSelected }: ToggleViewProps) => {

    
    const handleTap = () => {
        setSelected(selected === 'events' ? 'map' : 'events')
    }

  return (
    <Pressable style={styles.container}
        onPress={handleTap}
    >
        {
            selected === 'events' ? (
                <MaterialIcons name="event-note" size={30} color="black" />
            ) : (
                <FontAwesome6 name="map-location-dot" size={30} color="black" />
            )
        }
    </Pressable>
  )
}

export default ToggleView

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(78, 102, 161)'
    }
})