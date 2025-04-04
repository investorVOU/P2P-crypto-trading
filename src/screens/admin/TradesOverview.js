import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useDispatch, useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { fetchAllTrades, updateTradeStatus } from '../../redux/slices/tradeSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const TradesOverview = ({ navigation }) => {
  const tw = useTailwind();
  const dispatch = useDispatch();
  const { trades, status, error } = useSelector(state => state.trade);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchAllTrades());
  }, [dispatch]);

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

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleTradePress = (trade) => {
    navigation.navigate('TradeDetails', { tradeId: trade.id });
  };

  const filteredTrades = trades.filter(trade => {
    // Apply status filter
    if (filter !== 'all' && trade.status !== filter) return false;
    
    // Apply search filter if there's a search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        trade.id.toString().includes(query) ||
        trade.currency.toLowerCase().includes(query) ||
        (trade.counterparty?.username || '').toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  if (status === 'loading' && trades.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={tw('flex-1 bg-gray-100')}>
      {/* Search bar */}
      <View style={tw('p-4 bg-white border-b border-gray-200')}>
        <View style={tw('flex-row items-center bg-gray-100 rounded-lg px-3 py-2')}>
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={tw('flex-1 ml-2 text-base text-gray-800')}
            placeholder="Search trades..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      
      {/* Filters */}
      <View style={tw('flex-row px-4 py-3 bg-white border-b border-gray-200')}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={tw(`px-4 py-2 rounded-full mr-2 ${filter === 'all' ? 'bg-blue-500' : 'bg-gray-200'}`)}
            onPress={() => handleFilterChange('all')}
          >
            <Text style={tw(`font-medium ${filter === 'all' ? 'text-white' : 'text-gray-800'}`)}>All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={tw(`px-4 py-2 rounded-full mr-2 ${filter === 'open' ? 'bg-blue-500' : 'bg-gray-200'}`)}
            onPress={() => handleFilterChange('open')}
          >
            <Text style={tw(`font-medium ${filter === 'open' ? 'text-white' : 'text-gray-800'}`)}>Open</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={tw(`px-4 py-2 rounded-full mr-2 ${filter === 'in_escrow' ? 'bg-blue-500' : 'bg-gray-200'}`)}
            onPress={() => handleFilterChange('in_escrow')}
          >
            <Text style={tw(`font-medium ${filter === 'in_escrow' ? 'text-white' : 'text-gray-800'}`)}>In Escrow</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={tw(`px-4 py-2 rounded-full mr-2 ${filter === 'completed' ? 'bg-blue-500' : 'bg-gray-200'}`)}
            onPress={() => handleFilterChange('completed')}
          >
            <Text style={tw(`font-medium ${filter === 'completed' ? 'text-white' : 'text-gray-800'}`)}>Completed</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={tw(`px-4 py-2 rounded-full mr-2 ${filter === 'disputed' ? 'bg-blue-500' : 'bg-gray-200'}`)}
            onPress={() => handleFilterChange('disputed')}
          >
            <Text style={tw(`font-medium ${filter === 'disputed' ? 'text-white' : 'text-gray-800'}`)}>Disputed</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={tw(`px-4 py-2 rounded-full ${filter === 'cancelled' ? 'bg-blue-500' : 'bg-gray-200'}`)}
            onPress={() => handleFilterChange('cancelled')}
          >
            <Text style={tw(`font-medium ${filter === 'cancelled' ? 'text-white' : 'text-gray-800'}`)}>Cancelled</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {error && <ErrorMessage message={error} />}

      <FlatList
        data={filteredTrades}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={tw('bg-white p-4 mb-2 border-b border-gray-200')}
            onPress={() => handleTradePress(item)}
          >
            <View style={tw('flex-row justify-between items-center mb-2')}>
              <Text style={tw('font-bold text-gray-800')}>Trade #{item.id}</Text>
              <View style={tw(`px-2 py-1 rounded-full ${getStatusColor(item.status)}`)}>
                <Text style={tw('text-sm font-medium')}>{getStatusText(item.status)}</Text>
              </View>
            </View>
            
            <View style={tw('flex-row justify-between mb-1')}>
              <Text style={tw('text-gray-600')}>Amount:</Text>
              <Text style={tw('font-medium')}>{item.amount} {item.currency}</Text>
            </View>
            
            <View style={tw('flex-row justify-between mb-1')}>
              <Text style={tw('text-gray-600')}>Type:</Text>
              <Text style={tw('font-medium capitalize')}>{item.type}</Text>
            </View>
            
            <View style={tw('flex-row justify-between mb-1')}>
              <Text style={tw('text-gray-600')}>User:</Text>
              <Text style={tw('font-medium')}>{item.user?.username || 'Unknown'}</Text>
            </View>
            
            <View style={tw('flex-row justify-between')}>
              <Text style={tw('text-gray-600')}>Date:</Text>
              <Text style={tw('font-medium')}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={tw('p-2')}
        ListEmptyComponent={
          <View style={tw('flex-1 justify-center items-center p-8')}>
            <Feather name="inbox" size={64} color="#CBD5E0" />
            <Text style={tw('text-gray-500 mt-4 text-center')}>
              No trades found matching your criteria
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default TradesOverview;
