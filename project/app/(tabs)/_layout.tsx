import React from 'react';
import { Tabs } from 'expo-router';
import { Camera, Settings, Home } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tabBarActiveColor = '#4F46E5'; // Indigo color
  const tabBarInactiveColor = colorScheme === 'dark' ? '#9CA3AF' : '#6B7280';
  const tabBarStyle = {
    backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    height: 60,
    paddingBottom: 10,
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tabBarActiveColor,
        tabBarInactiveTintColor: tabBarInactiveColor,
        tabBarStyle: tabBarStyle,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({ color, size }) => (
            <Camera size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}