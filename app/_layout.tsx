import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#007AFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pantry"
        options={{
          title: 'Pantry',
          tabBarLabel: 'Pantry',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="barcode" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sous-chef"
        options={{
          title: 'AI Sous Chef',
          tabBarLabel: 'Recipes',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="cutlery" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
