import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import Mapbox, { Camera, LocationPuck, MapView, MarkerView} from '@rnmapbox/maps';
import { Fontisto } from '@expo/vector-icons';
import { TextInput, TouchableOpacity, FlatList } from 'react-native';
import { getSuggestions, retrievePlace } from '~/api/mapbox';
import { useAuth } from '~/providers/AuthProvider';
import * as Location from 'expo-location';


const LocationPicker = () => {
    const [markerCoordinates, setMarkerCoordinates] = React.useState([0,0]);
    const [cameraCoordinates, setCameraCoordinates] = React.useState(null);
    const [searchArea, setSearchArea] = React.useState('');
    const [isActive, setIsActive] = React.useState(false);
    const [suggestions, setSuggestions] = React.useState([]);
    const { session } = useAuth();
    const [text, setText] = React.useState('');

    const onItemPress = async (item: any) => {
        setText(item.name);
        console.log('item', item);

        if (!session?.access_token) return

        const place = await retrievePlace(item.mapbox_id, session?.access_token);
        console.log('place', place)
        setCameraCoordinates(place.features[0].geometry.coordinates);
        setSearchArea(`${place.features[0].geometry.coordinates[0]},${place.features[0].geometry.coordinates[1]}`);
        setIsActive(false);
    }
    useEffect(() => {
        (async () => {
          
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({});
          setSearchArea(`${location.coords.longitude},${location.coords.latitude}`);
        })();
      }, []);

    const onSearch = async (text: string) => {
 
        setText(text);
        if (!session?.access_token) return

        const res = await getSuggestions(text, searchArea, session?.access_token)
        setSuggestions(res.suggestions);
    }


    return (
        <View style={styles.mapContainer}>
            <View style={styles.searchContainer}>
                <TextInput 
                    value={text}
                    onChangeText={onSearch}
                    placeholderTextColor={'#fff'}
                    style={styles.mapSearchBox} 
                    placeholder="Search" 
                    onFocus={() => setIsActive(true)}
                    onBlur={() => {
                        setTimeout(() => {
                            setIsActive(false);
                        }, 1200);
                    }
                    }

                />
       { isActive && <FlatList
                    style={styles.flatList}
                    data={suggestions}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.suggestionItem} onPress={() => onItemPress(item)}>
                            <Text style={styles.suggestionText}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />}
            </View>
            <MapView
                onPress={(e) => {
                    setMarkerCoordinates([e.geometry.coordinates[0], e.geometry.coordinates[1]]);
                    console.log('e', e);
                }}
                style={styles.mapView}
                styleURL={Mapbox.StyleURL.Dark}
            >
                <Camera followZoomLevel={15} 
                followUserLocation={!cameraCoordinates}
                centerCoordinate={cameraCoordinates}
                 />
                <LocationPuck />
                <MarkerView coordinate={markerCoordinates} allowOverlapWithPuck>
                    <Fontisto name="map-marker-alt" size={34} color="#56df44" />
                </MarkerView>
            </MapView>
        </View>
    )
}

export default LocationPicker

const styles = StyleSheet.create({
    mapSearchBox: {
        width: '100%',
        backgroundColor: '#a8a4a49d',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 22,
        color: '#ffffff',
    },
    mapContainer: {
        position: 'relative',
        width: '100%',
        height: 400,
        borderRadius: 22,
        marginBottom: 150,
    },
    searchContainer: {
        position: 'absolute',
        top: 30,
        zIndex: 100,
        width: '80%',
        marginLeft: 18,
    },
    flatList: {
        alignSelf: 'baseline',
        width: '100%',
        backgroundColor: '#635c5c9d',
        borderRadius: 12,
        marginTop: 6,
    },
    suggestionItem: {
        padding: 12,
    },
    suggestionText: {
        color: '#fff',
        fontWeight: '500',
    },
    separator: {
        height: 0.5,
        alignSelf: 'center',
        width: '100%',
        marginLeft: 12,
        backgroundColor: '#aaaaaa',
    },
    mapView: {
        flex: 1,
    },
});