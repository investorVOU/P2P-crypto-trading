import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { View, Text } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import HomeScreen from '../screens/HomeScreen';
import TradeScreen from '../screens/TradeScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WalletScreen from '../screens/WalletScreen';
import DisputeScreen from '../screens/DisputeScreen';
import AdminDashboard from '../screens/admin/AdminDashboard';
import TradesOverview from '../screens/admin/TradesOverview';
import DisputesOverview from '../screens/admin/DisputesOverview';
// Icons
import Feather from 'react-native-vector-icons/Feather';

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AdminStack = createStackNavigator();

// Admin navigation stack
function AdminNavigator() {
  const tw = useTailwind();
  
  return (
    <AdminStack.Navigator
      screenOptions={{
        headerStyle: tw('bg-gray-800'),
        headerTintColor: '#fff',
        headerTitleStyle: tw('font-bold'),
      }}
    >
      <AdminStack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: 'Admin Dashboard' }} />
      <AdminStack.Screen name="TradesOverview" component={TradesOverview} options={{ title: 'Trades Overview' }} />
      <AdminStack.Screen name="DisputesOverview" component={DisputesOverview} options={{ title: 'Disputes' }} />
    </AdminStack.Navigator>
  );
}

// Main Stack for trade details, etc.
function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="TradeDetails" component={TradeScreen} options={{ title: 'Trade Details' }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
      <Stack.Screen name="Dispute" component={DisputeScreen} options={{ title: 'File a Dispute' }} />
      <Stack.Screen name="Admin" component={AdminNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// Tab Navigator
function MainTabNavigator() {
  const tw = useTailwind();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Wallet') {
            iconName = 'credit-card';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: tw('bg-white border-t border-gray-200'),
        headerStyle: tw('bg-white border-b border-gray-200'),
        headerTitleStyle: tw('text-gray-800 font-bold'),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'P2P Trading' }} />
      <Tab.Screen name="Wallet" component={WalletScreen} options={{ title: 'My Wallet' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const isAdmin = useSelector(state => state.auth.user?.isAdmin);
  
  // For development purposes, we'll allow admin access directly
  // In a real app, we'd properly route based on user role after authentication
  
  return <MainStack />;
}
