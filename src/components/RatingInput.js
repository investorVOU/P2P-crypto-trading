import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import Feather from 'react-native-vector-icons/Feather';

const RatingInput = ({ rating, onRatingChange }) => {
  const tw = useTailwind();
  
  return (
    <View style={tw('items-center')}>
      <Text style={tw('text-gray-600 mb-2')}>Rate your experience with this trade</Text>
      <View style={tw('flex-row justify-center')}>
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity
            key={star}
            onPress={() => onRatingChange(star)}
            style={tw('mx-2')}
          >
            <Feather 
              name={star <= rating ? "star" : "star"}
              size={36} 
              color={star <= rating ? "#F59E0B" : "#CBD5E0"} 
            />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={tw('text-gray-600 mt-2 text-lg font-medium')}>
        {rating === 1 ? 'Poor' : 
         rating === 2 ? 'Fair' : 
         rating === 3 ? 'Good' : 
         rating === 4 ? 'Very Good' : 
         rating === 5 ? 'Excellent' : 'Select a rating'}
      </Text>
    </View>
  );
};

export default RatingInput;
