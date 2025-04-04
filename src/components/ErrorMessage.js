import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import Feather from 'react-native-vector-icons/Feather';

const ErrorMessage = ({ message, onRetry }) => {
  const tw = useTailwind();
  
  return (
    <View style={tw('bg-red-50 border-l-4 border-red-500 p-4 m-4 rounded')}>
      <View style={tw('flex-row items-center mb-2')}>
        <Feather name="alert-circle" size={20} color="#EF4444" style={tw('mr-2')} />
        <Text style={tw('text-red-700 font-medium')}>Error</Text>
      </View>
      <Text style={tw('text-red-600 mb-2')}>{message}</Text>
      {onRetry && (
        <TouchableOpacity 
          style={tw('bg-red-100 py-2 px-4 rounded self-start mt-2')}
          onPress={onRetry}
        >
          <Text style={tw('text-red-700 font-medium')}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ErrorMessage;
