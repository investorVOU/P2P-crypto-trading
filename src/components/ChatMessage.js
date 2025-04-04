import React from 'react';
import { View, Text } from 'react-native';
import { useTailwind } from 'tailwind-rn';

const ChatMessage = ({ message, isOwnMessage }) => {
  const tw = useTailwind();
  
  return (
    <View style={tw(`flex mb-3 ${isOwnMessage ? 'items-end' : 'items-start'}`)}>
      <View 
        style={tw(`rounded-2xl p-3 max-w-3/4 ${
          isOwnMessage 
            ? 'bg-blue-500 rounded-tr-none' 
            : 'bg-gray-200 rounded-tl-none'
        }`)}
      >
        <Text style={tw(`${isOwnMessage ? 'text-white' : 'text-gray-800'}`)}>
          {message.text}
        </Text>
      </View>
      <Text style={tw('text-xs text-gray-500 mt-1')}>
        {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
      </Text>
    </View>
  );
};

export default ChatMessage;
