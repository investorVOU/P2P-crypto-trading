import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import Feather from 'react-native-vector-icons/Feather';

const WalletCard = ({ currency, amount, usdValue, onPress }) => {
  const tw = useTailwind();
  
  const getCurrencyColor = (currency) => {
    switch(currency) {
      case 'BTC': return 'bg-orange-500';
      case 'ETH': return 'bg-purple-500';
      case 'USDT': return 'bg-green-500';
      case 'USD': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getCurrencyIcon = (currency) => {
    switch(currency) {
      case 'BTC': return 'circle';
      case 'ETH': return 'hexagon';
      case 'USDT': return 'dollar-sign';
      case 'USD': return 'dollar-sign';
      default: return 'circle';
    }
  };
  
  return (
    <TouchableOpacity 
      style={tw('bg-white rounded-lg shadow-sm p-4 mr-4 w-60')}
      onPress={onPress}
    >
      <View style={tw('flex-row justify-between items-center mb-3')}>
        <View style={tw('flex-row items-center')}>
          <View style={tw(`w-10 h-10 rounded-full ${getCurrencyColor(currency)} justify-center items-center mr-2`)}>
            <Feather name={getCurrencyIcon(currency)} size={20} color="white" />
          </View>
          <Text style={tw('font-bold text-lg text-gray-800')}>{currency}</Text>
        </View>
        <Feather name="chevron-right" size={20} color="#CBD5E0" />
      </View>
      
      <Text style={tw('text-2xl font-bold text-gray-800 mb-1')}>{amount}</Text>
      <Text style={tw('text-gray-500')}>${usdValue.toFixed(2)} USD</Text>
    </TouchableOpacity>
  );
};

export default WalletCard;
