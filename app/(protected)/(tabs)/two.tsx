import { EvilIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


import { ScreenContent } from '~/components/ScreenContent';
import { useAuth } from '~/providers/AuthProvider';
import { supabase } from '~/utils/supabase';
import { decode } from 'base64-arraybuffer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile } from '~/types/db';

export default function Home() {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  const { session, user } = useAuth();

  const getAvatar = async () => {
    let cachecAvatar = await AsyncStorage.getItem('avatar')
    if (cachecAvatar) {
      setAvatarUrl(cachecAvatar)
    }
    const { data, error } = await supabase
      .storage
      .from('avatars')
      .download(`${user?.id}/avatar`)

    if (error) {
      console.error('error', error)
    }

    if (data) {
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
      if (!cachecAvatar && url) await AsyncStorage.setItem('avatar', url)
    }
  }

  const getProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('username, full_name, avatar_url')
      .eq('id', session?.user.id)
      .returns<Profile>()
      .single()

    if (error) {
      console.error('error', error)
    }

    if (data) {
      setUsername(data.username)
      setFullName(data.full_name)
      setAvatarUrl(data.avatar_url)
    }
  }

  const addAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (result.canceled) return;
    if (!user) return;

    const base64String = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: FileSystem.EncodingType.Base64 });
    const arrayBuffer = decode(base64String);

    const { data, error } = await supabase
      .storage
      .from('avatars')
      .upload(`${user.id}/avatar`, arrayBuffer, {
        contentType: result.assets[0].mimeType,
        upsert: true,
      })

    if (error) {
      console.error('error', error)
    }

    if (data) {
      console.log(data, 'data32')
      setAvatarUrl(result.assets[0].uri)
      await AsyncStorage.setItem('avatar', result.assets[0].uri)
    }

  };

  const saveProfile = async () => {
    setSaveLoading(true)
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: session?.user.id,
        username,
        full_name: fullName,
      })

    if (error) console.error('error', error)

    Alert.alert('Success', 'Profile updated successfully')
    setSaveLoading(false)
  }

  useEffect(() => {
    if (session) {
      getProfile()
      getAvatar()
    }
  }, [session])

  return (
    
      <View style={styles.container}>

        <View style={styles.avatarContainer}>
          {
            avatarUrl ? <Image source={{ uri: avatarUrl, cache:'force-cache' }} style={styles.avatar} /> : <EvilIcons name="user" size={150} color="#efefef" />
          }
          <TouchableOpacity onPress={addAvatar} style={styles.avatarButton}>
            <Text style={styles.avatarButtonText}>{ avatarUrl ? 'Change Avatar' : 'Add Avatar' }</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          onChangeText={setUsername}
          value={username}
          autoCapitalize='none'
        />
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={setFullName}
          value={fullName}
          autoCorrect={false}
        />

        <TouchableOpacity 
          onPress={saveProfile}
          style={styles.button}>
            {
              saveLoading ? <ActivityIndicator color={'#fff'} /> : <Text style={styles.buttonText}>Save</Text>
            }
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => supabase.auth.signOut()}
          style={[styles.button,{backgroundColor:'#ff0800c4'}]}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>

      </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#000',
  },
  label: {
    fontSize: 18,
    marginBottom: 12,
    color: 'white',
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
    borderColor: 'white',
    color: 'white',
  },
  button: {
    marginTop: 12,
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 28,
  },
  avatarButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 12,
  },
  avatarButtonText: {
    color: 'white',
    fontSize: 16,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderColor: 'white',
    borderWidth: 1,
  },
});
