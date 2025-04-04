import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useDispatch, useSelector } from 'react-redux';
import { createDispute } from '../redux/slices/tradeSlice';
import DisputeForm from '../components/DisputeForm';
import Feather from 'react-native-vector-icons/Feather';

const DisputeScreen = ({ navigation, route }) => {
  const tw = useTailwind();
  const dispatch = useDispatch();
  const { tradeId } = route.params;
  const { currentTrade } = useSelector(state => state.trade);
  
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState('');
  
  const handleSubmitDispute = (formData) => {
    if (!formData.reason || !formData.description) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    
    dispatch(createDispute({
      tradeId,
      ...formData
    }));
    
    Alert.alert(
      "Dispute Submitted",
      "Your dispute has been submitted successfully. Our support team will review it and get back to you soon.",
      [
        { 
          text: "OK", 
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <ScrollView style={tw('flex-1 bg-gray-50')}>
      <View style={tw('p-4')}>
        {/* Header */}
        <View style={tw('mb-6')}>
          <Text style={tw('text-2xl font-bold text-gray-800')}>File a Dispute</Text>
          <Text style={tw('text-gray-600 mt-1')}>
            We're sorry to hear you're having issues with your trade. Please provide details below.
          </Text>
        </View>
        
        {/* Trade info */}
        {currentTrade && (
          <View style={tw('bg-white rounded-lg shadow-sm p-4 mb-6')}>
            <Text style={tw('text-lg font-bold mb-2 text-gray-800')}>Trade Information</Text>
            <View style={tw('flex-row justify-between mb-1')}>
              <Text style={tw('text-gray-600')}>Trade ID:</Text>
              <Text style={tw('font-medium')}>{currentTrade.id}</Text>
            </View>
            <View style={tw('flex-row justify-between mb-1')}>
              <Text style={tw('text-gray-600')}>Amount:</Text>
              <Text style={tw('font-medium')}>{currentTrade.amount} {currentTrade.currency}</Text>
            </View>
            <View style={tw('flex-row justify-between mb-1')}>
              <Text style={tw('text-gray-600')}>Trade with:</Text>
              <Text style={tw('font-medium')}>{currentTrade.counterparty?.username || 'User'}</Text>
            </View>
          </View>
        )}
        
        {/* Dispute Form */}
        <DisputeForm onSubmit={handleSubmitDispute} />
        
        {/* Additional info */}
        <View style={tw('bg-yellow-50 rounded-lg p-4 mt-6 border border-yellow-200')}>
          <View style={tw('flex-row')}>
            <Feather name="info" size={20} color="#F59E0B" style={tw('mr-2')} />
            <Text style={tw('text-yellow-800 font-medium')}>Important Information</Text>
          </View>
          <Text style={tw('text-yellow-700 mt-2')}>
            Our dispute resolution team will review your case as soon as possible. Both parties will
            have an opportunity to provide evidence. Most disputes are resolved within 24-48 hours.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default DisputeScreen;
