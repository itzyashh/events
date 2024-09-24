import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { HeaderButton } from '~/components/HeaderButton';
import { TabBarIcon } from '~/components/TabBarIcon';



export default function TabLayout() {
 
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarActiveBackgroundColor: '#000',
        tabBarInactiveBackgroundColor: '#000',
        tabBarStyle: {
          backgroundColor: '#000',
        },
        headerStyle: {
          backgroundColor: '#000',
        },
        headerTintColor: 'white',
        headerShadowVisible: false
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Events',
          tabBarIcon: ({ color }) => <MaterialIcons name="event-note" size={28} color={color} />,
          headerRight: () => 
            <Link asChild href="/(protected)/event/create">
            <TouchableOpacity>
          <Ionicons style={{marginRight:15}} name="add-circle-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
          </Link>
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
