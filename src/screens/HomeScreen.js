import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrades } from '../redux/slices/tradeSlice';
import TradeCard from '../components/TradeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Feather from 'react-native-vector-icons/Feather';

const HomeScreen = ({ navigation }) => {
  const tw = useTailwind();
  const dispatch = useDispatch();
  const { trades, status, error } = useSelector((state) => state.trade);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchTrades());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchTrades());
  };

  const handleTradePress = (trade) => {
    navigation.navigate('TradeDetails', { tradeId: trade.id });
  };

  const handleNewTrade = () => {
    navigation.navigate('TradeDetails', { isNewTrade: true });
  };

  // For development - direct access to admin screen
  const goToAdminDashboard = () => {
    navigation.navigate('Admin');
  };

  if (status === 'loading' && trades.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={tw('flex-1 bg-gray-50')}>
      {/* Top section with filters */}
      <View style={tw('p-4 bg-white border-b border-gray-200')}>
        <Text style={tw('text-xl font-bold mb-2 text-gray-800')}>Available Trades</Text>
        
        <View style={tw('flex-row justify-between items-center')}>
          <TouchableOpacity 
            style={tw('bg-blue-500 py-2 px-4 rounded-lg flex-row items-center')}
            onPress={handleNewTrade}
          >
            <Feather name="plus" size={16} color="white" />
            <Text style={tw('text-white font-medium ml-1')}>New Trade</Text>
          </TouchableOpacity>

          {/* Dev only - Remove in production */}
          <TouchableOpacity 
            style={tw('bg-gray-700 py-2 px-4 rounded-lg')}
            onPress={goToAdminDashboard}
          >
            <Text style={tw('text-white font-medium')}>Admin Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error && <ErrorMessage message={error} />}

      <FlatList
        data={trades}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TradeCard 
            trade={item}
            onPress={() => handleTradePress(item)}
          />
        )}
        contentContainerStyle={tw('p-4')}
        refreshControl={
          <RefreshControl refreshing={status === 'loading'} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={tw('flex-1 justify-center items-center p-8')}>
            <Feather name="inbox" size={64} color="#CBD5E0" />
            <Text style={tw('text-gray-500 mt-4 text-center')}>
              No trades found. Pull down to refresh or create a new trade.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default HomeScreen;
