import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import Feather from 'react-native-vector-icons/Feather';

const TradeCard = ({ trade, onPress }) => {
  const tw = useTailwind();

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_escrow': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'open': return 'Open';
      case 'in_escrow': return 'In Escrow';
      case 'completed': return 'Completed';
      case 'disputed': return 'Disputed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getIcon = (type) => {
    return type === 'buy' ? 'arrow-down' : 'arrow-up';
  };

  const getIconColor = (type) => {
    return type === 'buy' ? '#10B981' : '#EF4444';
  };

  return (
    <TouchableOpacity 
      style={tw('bg-white rounded-lg shadow-sm mb-4 overflow-hidden')}
      onPress={onPress}
    >
      <View style={tw('p-4')}>
        <View style={tw('flex-row justify-between items-center mb-3')}>
          <View style={tw('flex-row items-center')}>
            <View style={tw(`w-8 h-8 rounded-full ${trade.type === 'buy' ? 'bg-green-100' : 'bg-red-100'} justify-center items-center mr-2`)}>
              <Feather 
                name={getIcon(trade.type)} 
                size={16} 
                color={getIconColor(trade.type)} 
              />
            </View>
            <Text style={tw('font-bold text-lg text-gray-800 capitalize')}>
              {trade.type} {trade.currency}
            </Text>
          </View>
          <View style={tw(`px-2 py-1 rounded-full ${getStatusColor(trade.status)}`)}>
            <Text style={tw('text-xs font-medium')}>{getStatusText(trade.status)}</Text>
          </View>
        </View>
        
        <View style={tw('flex-row justify-between mb-1')}>
          <Text style={tw('text-gray-500')}>Amount:</Text>
          <Text style={tw('font-medium')}>{trade.amount} {trade.currency}</Text>
        </View>
        
        <View style={tw('flex-row justify-between mb-1')}>
          <Text style={tw('text-gray-500')}>Price:</Text>
          <Text style={tw('font-medium')}>${trade.price} / {trade.currency}</Text>
        </View>
        
        <View style={tw('flex-row justify-between mb-1')}>
          <Text style={tw('text-gray-500')}>Payment:</Text>
          <Text style={tw('font-medium')}>{trade.paymentMethod || 'Bank Transfer'}</Text>
        </View>
        
        <View style={tw('flex-row justify-between')}>
          <Text style={tw('text-gray-500')}>User:</Text>
          <View style={tw('flex-row items-center')}>
            {trade.counterparty?.rating > 0 && (
              <View style={tw('flex-row items-center mr-1')}>
                <Feather name="star" size={14} color="#F59E0B" />
                <Text style={tw('text-gray-600 ml-1')}>{trade.counterparty?.rating || '0.0'}</Text>
              </View>
            )}
            <Text style={tw('font-medium')}>{trade.counterparty?.username || 'User'}</Text>
          </View>
        </View>
      </View>
      
      <View style={tw('p-3 bg-gray-50 border-t border-gray-100 flex-row justify-between')}>
        <Text style={tw('text-gray-500')}>
          Created {new Date(trade.createdAt).toLocaleDateString()}
        </Text>
        <Text style={tw('text-blue-500 font-medium')}>View Details</Text>
      </View>
    </TouchableOpacity>
  );
};

export default TradeCard;
