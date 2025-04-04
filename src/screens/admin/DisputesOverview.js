import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useDispatch, useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { fetchDisputes, resolveDispute } from '../../redux/slices/tradeSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const DisputesOverview = ({ navigation }) => {
  const tw = useTailwind();
  const dispatch = useDispatch();
  const { disputes, status, error } = useSelector(state => state.trade);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchDisputes());
  }, [dispatch]);

  const handleResolveDispute = (disputeId, resolution) => {
    Alert.alert(
      "Resolve Dispute",
      `Are you sure you want to resolve this dispute in favor of the ${resolution}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Confirm", 
          onPress: () => {
            dispatch(resolveDispute({ 
              disputeId,
              resolution
            }));
          }
        }
      ]
    );
  };

  const handleViewTrade = (tradeId) => {
    navigation.navigate('TradeDetails', { tradeId });
  };

  const filteredDisputes = disputes.filter(dispute => {
    if (filter === 'all') return true;
    return dispute.status === filter;
  });

  if (status === 'loading' && disputes.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={tw('flex-1 bg-gray-100')}>
      {/* Filters */}
      <View style={tw('flex-row p-4 bg-white border-b border-gray-200')}>
        <TouchableOpacity 
          style={tw(`px-4 py-2 rounded-full mr-2 ${filter === 'all' ? 'bg-blue-500' : 'bg-gray-200'}`)}
          onPress={() => setFilter('all')}
        >
          <Text style={tw(`font-medium ${filter === 'all' ? 'text-white' : 'text-gray-800'}`)}>All</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={tw(`px-4 py-2 rounded-full mr-2 ${filter === 'pending' ? 'bg-blue-500' : 'bg-gray-200'}`)}
          onPress={() => setFilter('pending')}
        >
          <Text style={tw(`font-medium ${filter === 'pending' ? 'text-white' : 'text-gray-800'}`)}>Pending</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={tw(`px-4 py-2 rounded-full ${filter === 'resolved' ? 'bg-blue-500' : 'bg-gray-200'}`)}
          onPress={() => setFilter('resolved')}
        >
          <Text style={tw(`font-medium ${filter === 'resolved' ? 'text-white' : 'text-gray-800'}`)}>Resolved</Text>
        </TouchableOpacity>
      </View>

      {error && <ErrorMessage message={error} />}

      <FlatList
        data={filteredDisputes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={tw('bg-white p-4 mb-2 border-b border-gray-200')}>
            <View style={tw('flex-row justify-between items-center mb-3')}>
              <Text style={tw('font-bold text-gray-800')}>Dispute #{item.id}</Text>
              <View style={tw(`px-2 py-1 rounded-full ${
                item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              }`)}>
                <Text style={tw('text-sm font-medium capitalize')}>{item.status}</Text>
              </View>
            </View>
            
            <View style={tw('mb-3')}>
              <Text style={tw('text-gray-600 mb-1')}>Trade:</Text>
              <Text style={tw('font-medium')}>#{item.tradeId} - {item.tradeAmount} {item.tradeCurrency}</Text>
            </View>
            
            <View style={tw('mb-3')}>
              <Text style={tw('text-gray-600 mb-1')}>Reason:</Text>
              <Text style={tw('font-medium')}>{item.reason}</Text>
            </View>
            
            <View style={tw('mb-3')}>
              <Text style={tw('text-gray-600 mb-1')}>Description:</Text>
              <Text style={tw('text-gray-800')}>{item.description}</Text>
            </View>
            
            <View style={tw('mb-3')}>
              <Text style={tw('text-gray-600 mb-1')}>Submitted by:</Text>
              <Text style={tw('font-medium')}>{item.user?.username || 'User'} on {new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
            
            <View style={tw('flex-row mt-4')}>
              <TouchableOpacity
                style={tw('bg-blue-500 py-2 px-4 rounded-lg mr-2')}
                onPress={() => handleViewTrade(item.tradeId)}
              >
                <Text style={tw('text-white font-medium')}>View Trade</Text>
              </TouchableOpacity>
              
              {item.status === 'pending' && (
                <>
                  <TouchableOpacity
                    style={tw('bg-green-500 py-2 px-4 rounded-lg mr-2')}
                    onPress={() => handleResolveDispute(item.id, 'buyer')}
                  >
                    <Text style={tw('text-white font-medium')}>Favor Buyer</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={tw('bg-orange-500 py-2 px-4 rounded-lg')}
                    onPress={() => handleResolveDispute(item.id, 'seller')}
                  >
                    <Text style={tw('text-white font-medium')}>Favor Seller</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}
        contentContainerStyle={tw('p-2')}
        ListEmptyComponent={
          <View style={tw('flex-1 justify-center items-center p-8')}>
            <Feather name="check-circle" size={64} color="#CBD5E0" />
            <Text style={tw('text-gray-500 mt-4 text-center')}>
              {filter === 'all' ? 'No disputes found' : 
               filter === 'pending' ? 'No pending disputes' : 
               'No resolved disputes'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default DisputesOverview;
