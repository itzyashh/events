import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, Button } from 'react-native'
import React, { useState } from 'react'
import { router, Stack } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from 'dayjs';
import { supabase } from '~/utils/supabase';
import { NewEvent,Event } from '~/types/db';
import { useAuth } from '~/providers/AuthProvider';

const Page = () => {

    const { user } = useAuth()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([])
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState<"date" | "time" | "datetime" | undefined>('date');
    const [show, setShow] = useState(false);

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [type, setType] = useState('start')

    const [showTime, setShowTime] = useState(false)
    const [time, setTime] = useState<any>(null);


    const pickImages = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [16, 9],
            quality: 1,
            selectionLimit: 8,
        });

        if (!result.canceled) {
            setImages(result.assets);
        }
    };

    const onChange = (date: any) => {
        const currentDate = date || date;
        if (type === 'start') setStartDate(currentDate);
        if (type === 'end') setEndDate(currentDate);
        setDate(currentDate);
        setShow(false)
    };

    const onTimeChange = (time: any) => {
        const currentTime = time || time;
        setTime(currentTime);
        setShowTime(false)
    };

    const uploadImage = async (eventId: number) => {

        const image = images[0]

        const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer())
        const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg'
        const path = `${eventId}/event.${fileExt}`
        const {data, error} = await supabase.storage.from('eventAssets').upload(path, arraybuffer,{contentType: image.mimeType})

        if (error) {
            console.log('errorImage', error)
            return
        } 
            console.log('dataImage', data)
            const { data:publicUrl } = supabase.storage.from('eventAssets').getPublicUrl(path)
            console.log('publicUrl', publicUrl)
            return publicUrl.publicUrl
    }

    const onSubmit = async () => {

        if (!title || !description || !startDate || !endDate || !time || images.length === 0) {
            return
        }
        const image = images[0]
        const newEvent : NewEvent = {
            title,
            description,
            start_date: startDate,
            end_date: endDate,
            event_time: time.toUTCString(),
            creator_id: user?.id,
            coordinates: 'POINT(73.830040 18.533347)',
        }

        const {data, error} = await supabase
        .from('events')
        .insert([newEvent])           
        .select('*')
        .returns<Event>()
        .single()

        if (error) {
            console.log('error', error)
            return
        } 
            console.log('data', data)

            if (!data) return



            const imageUrl = await uploadImage(data.id)
          const {error:imageUrlError} =  await supabase.
            from('events')
            .update({image_url: imageUrl})
            .eq('id', data.id)
            .select()
            .single()

            if (imageUrlError) {
                console.log('imageUrlError', imageUrlError)
                return
            }




            router.push(`/(protected)/event/${data.id}`)
     




    }   


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

            }}
             />
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
                style={{ flexGrow: 0, marginVertical: 10 }}
                renderItem={({ item }) => (
                    <Image source={{ uri: item.uri }} style={styles.image} />
                )}
                ListFooterComponent={<TouchableOpacity onPress={pickImages} style={styles.addButton}>
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
            <View style={styles.separator} />
            <View style={styles.dateContainer}>
                <TouchableOpacity
                    onPress={() => {
                        setShowTime(true)
                    }}
                    style={styles.date}
                >
                    <Text style={styles.dateText}>{dayjs(time).format('HH:mm') == 'Invalid Date' ? 'Time' : dayjs(time).format('HH:mm')}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.separator} />

            <TouchableOpacity onPress={onSubmit} style={styles.submitButton}>
                <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>



            <DateTimePickerModal
                isVisible={show}
                testID="dateTimePicker"
                date={date}
                mode={mode}
                display='spinner'
                is24Hour={true}
                onConfirm={onChange}
                onCancel={() => setShow(false)}

            />

            <DateTimePickerModal
                isVisible={showTime}
                mode='time'
                display='spinner'
                is24Hour
                onConfirm={onTimeChange}
                minuteInterval={10}
                onCancel={() => setShowTime(false)}
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
        alignSelf: 'baseline',
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
    submitButton: {
        position: 'absolute',
        bottom: 44,
        width: '100%',
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitText: {
        color: '#000',
        fontSize: 16,
    },


})