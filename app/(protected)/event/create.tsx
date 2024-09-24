import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, Button } from 'react-native'
import React, { useState } from 'react'
import { Stack } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from 'dayjs';

const Page = () => {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([])
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [type, setType] = useState('start')

    console.log('startDate', startDate)
    console.log('endDate', endDate)

    const pickImages = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsMultipleSelection: true,
          aspect: [4, 3],
          quality: 1,
          selectionLimit: 8,
        });
    
        console.log(result);
    
        if (!result.canceled) {
          setImages(result.assets);
        }
      };

        const onChange = (date: any) => {
            const currentDate = date || date;
            console.log('currentDate', currentDate)
            if(type === 'start') setStartDate(currentDate);
            if(type === 'end') setEndDate(currentDate);
            setDate(currentDate);
            setShow(false)
        };  

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                title: 'Create',
                headerShown: true,
                headerBackVisible: false,
                headerShadowVisible: false,
                headerTintColor: '#ffffff',
                headerStyle: {
                    backgroundColor: '#000',
                },
            }} />
            <TextInput
                style={styles.titleInput}
                placeholder="Title"
                placeholderTextColor="#ffffff"
                onChangeText={setTitle}
                value={title}
                />
            <View style={styles.separator} />

            <TextInput
                style={styles.dInput}
                multiline
                placeholder="Description"
                placeholderTextColor="#ffffff"
                onChangeText={setDescription}
                value={description}
                />
            <View style={styles.separator} />

            <FlatList
                data={images}
                keyExtractor={item => item.uri}
                horizontal
                contentContainerStyle={{ gap: 5, alignItems: 'center' }}
                style={{ flexGrow: 0,marginVertical: 10 }}
                renderItem={({ item }) => (
                    <Image source={{ uri: item.uri }} style={styles.image} />
                )}
                ListFooterComponent={ <TouchableOpacity onPress={pickImages} style={styles.addButton}>
                <MaterialCommunityIcons name="file-image-plus" size={46} color="#ffffff" />
            </TouchableOpacity>}
            />

            <View style={styles.separator} />
            {/* yyyy - mm - dd */}
            <View style={styles.dateContainer}>
                <TouchableOpacity
                    onPress={() => {
                        setShow(true);
                        setMode('date');
                        setType('start');
                    }}

                    style={styles.date}

                    >
                        <Text style={styles.dateText}>{dayjs(startDate).format('DD-MM-YYYY') == 'Invalid Date' ? 'Start Date' : dayjs(startDate).format('DD-MM-YYYY')}</Text>
                        </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setShow(true);
                        setMode('date');
                        setType('end');
                    }}
                    style={styles.date}
                    >
                        <Text style={styles.dateText}>{dayjs(endDate).format('DD-MM-YYYY') == 'Invalid Date' ? 'End Date' : dayjs(endDate).format('DD-MM-YYYY')}</Text>
                        </TouchableOpacity>
            </View>


        <DateTimePickerModal
          isVisible={show}     
          testID="dateTimePicker"
          value={date}
          mode={mode}
          display='spinner'
          is24Hour={true}
          onConfirm={onChange}
          onCancel={() => setShow(false)}

        />
        </View>
    )
}

export default Page

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020408',
        paddingHorizontal: 24,
    },
    titleInput: {
        borderColor: '#ffffff',
        borderWidth: 1,
        padding: 14,
        fontSize: 16,
        color: '#ffffff',
    },
    separator: {
        marginVertical: 8,
    },
    dInput: {
        borderColor: '#ffffff',
        color: '#ffffff',
        borderWidth: 1,
        padding: 14,
        fontSize: 16,
        minHeight: 70,
        maxHeight: 150,
    },
    addButton: {
        height: 100,
        width: 100,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#ffffff',
        alignSelf:'baseline',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 16,
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    date: {
        borderColor: '#ffffff',
        borderWidth: 1,
        padding: 12,
        width: '48%',
        color: '#ffffff',
        borderRadius: 22,
        alignItems: 'center',
    },
    dateText: {
        color: '#ffffff',
        fontSize: 16,
    },


})