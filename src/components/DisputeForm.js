import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import Feather from 'react-native-vector-icons/Feather';

const DisputeForm = ({ onSubmit }) => {
  const tw = useTailwind();
  
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState('');
  
  const handleSubmit = () => {
    onSubmit({
      reason,
      description,
      evidence
    });
  };
  
  return (
    <View style={tw('bg-white rounded-lg shadow-sm p-4')}>
      <Text style={tw('text-lg font-bold mb-4 text-gray-800')}>Dispute Details</Text>
      
      <View style={tw('mb-4')}>
        <Text style={tw('text-gray-700 mb-1 font-medium')}>Reason for Dispute*</Text>
        <View style={tw('border border-gray-300 rounded-lg overflow-hidden')}>
          <Picker
            selectedValue={reason}
            onValueChange={(itemValue) => setReason(itemValue)}
            style={tw('w-full')}
          >
            <Picker.Item label="Select a reason" value="" />
            <Picker.Item label="Non-payment" value="non_payment" />
            <Picker.Item label="Payment issues" value="payment_issues" />
            <Picker.Item label="Seller not responding" value="seller_not_responding" />
            <Picker.Item label="Buyer not responding" value="buyer_not_responding" />
            <Picker.Item label="Terms disagreement" value="terms_disagreement" />
            <Picker.Item label="Fraudulent activity" value="fraud" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
      </View>
      
      <View style={tw('mb-4')}>
        <Text style={tw('text-gray-700 mb-1 font-medium')}>Description*</Text>
        <Text style={tw('text-gray-500 text-sm mb-2')}>
          Please provide a detailed description of the issue
        </Text>
        <TextInput
          style={tw('border border-gray-300 rounded-lg p-3 h-32 text-gray-800')}
          multiline
          textAlignVertical="top"
          placeholder="Describe the dispute in detail..."
          value={description}
          onChangeText={setDescription}
        />
      </View>
      
      <View style={tw('mb-6')}>
        <Text style={tw('text-gray-700 mb-1 font-medium')}>Evidence or References</Text>
        <Text style={tw('text-gray-500 text-sm mb-2')}>
          Provide transaction IDs, screenshots, or any other evidence that supports your case
        </Text>
        <TextInput
          style={tw('border border-gray-300 rounded-lg p-3 h-24 text-gray-800')}
          multiline
          textAlignVertical="top"
          placeholder="Add supporting evidence..."
          value={evidence}
          onChangeText={setEvidence}
        />
      </View>
      
      <TouchableOpacity
        style={tw('bg-red-500 py-3 px-6 rounded-lg')}
        onPress={handleSubmit}
      >
        <Text style={tw('text-white font-bold text-center')}>Submit Dispute</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DisputeForm;
