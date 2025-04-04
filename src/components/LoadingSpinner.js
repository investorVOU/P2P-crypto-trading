import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useTailwind } from 'tailwind-rn';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  const tw = useTailwind();
  
  return (
    <View style={tw('flex-1 justify-center items-center bg-white')}>
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text style={tw('text-gray-600 mt-4')}>{message}</Text>
    </View>
  );
};

export default LoadingSpinner;
