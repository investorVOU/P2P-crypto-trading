import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTradeById, updateTradeStatus, createTrade } from '../redux/slices/tradeSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import RatingInput from '../components/RatingInput';
import Feather from 'react-native-vector-icons/Feather';

const TradeScreen = ({ navigation, route }) => {
  const tw = useTailwind();
  const dispatch = useDispatch();
  const { tradeId, isNewTrade } = route.params || {};
  const { currentTrade, status, error } = useSelector((state) => state.trade);
  const user = useSelector((state) => state.auth.user);
  const [rating, setRating] = useState(0);
  
  // New trade state
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeCurrency, setTradeCurrency] = useState('BTC');
  const [tradeType, setTradeType] = useState('buy');

  useEffect(() => {
    if (!isNewTrade && tradeId) {
      dispatch(fetchTradeById(tradeId));
    }
  }, [dispatch, tradeId, isNewTrade]);

  const handleConfirmTrade = () => {
    Alert.alert(
      "Confirm Trade",
      "Are you sure you want to lock funds in escrow?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Confirm", 
          onPress: () => {
            dispatch(updateTradeStatus({ 
              tradeId: currentTrade.id, 
              status: 'in_escrow' 
            }));
          }
        }
      ]
    );
  };

  const handleReleaseFunds = () => {
    Alert.alert(
      "Release Funds",
      "Confirm that you've received payment and want to release funds from escrow?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Release Funds", 
          onPress: () => {
            dispatch(updateTradeStatus({ 
              tradeId: currentTrade.id, 
              status: 'completed' 
            }));
          }
        }
      ]
    );
  };

  const handleCancelTrade = () => {
    Alert.alert(
      "Cancel Trade",
      "Are you sure you want to cancel this trade?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes, Cancel", 
          style: "destructive",
          onPress: () => {
            dispatch(updateTradeStatus({ 
              tradeId: currentTrade.id, 
              status: 'cancelled' 
            }));
          }
        }
      ]
    );
  };

  const handleDispute = () => {
    navigation.navigate('Dispute', { tradeId: currentTrade.id });
  };

  const handleChat = () => {
    navigation.navigate('Chat', { 
      tradeId: currentTrade.id,
      otherUser: currentTrade.counterparty
    });
  };

  const handleSubmitRating = () => {
    // In a real app, we would submit the rating to the backend
    Alert.alert("Rating Submitted", `You rated this trade ${rating} stars.`);
  };

  const handleCreateTrade = () => {
    if (!tradeAmount) {
      Alert.alert("Error", "Please enter a trade amount");
      return;
    }
    
    const newTrade = {
      type: tradeType,
      amount: parseFloat(tradeAmount),
      currency: tradeCurrency,
    };
    
    dispatch(createTrade(newTrade));
    navigation.goBack();
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  // Render new trade form
  if (isNewTrade) {
    return (
      <ScrollView style={tw('flex-1 bg-white')}>
        <View style={tw('p-4')}>
          <Text style={tw('text-2xl font-bold mb-6 text-center text-gray-800')}>
            Create New Trade
          </Text>
          
          <View style={tw('mb-6')}>
            <Text style={tw('text-gray-700 text-lg mb-2 font-semibold')}>Trade Type</Text>
            <View style={tw('flex-row mb-4')}>
              <TouchableOpacity
                style={tw(`flex-1 p-3 rounded-l-lg border border-gray-300 ${tradeType === 'buy' ? 'bg-blue-500' : 'bg-white'}`)}
                onPress={() => setTradeType('buy')}
              >
                <Text style={tw(`text-center font-medium ${tradeType === 'buy' ? 'text-white' : 'text-gray-700'}`)}>
                  Buy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw(`flex-1 p-3 rounded-r-lg border border-gray-300 ${tradeType === 'sell' ? 'bg-blue-500' : 'bg-white'}`)}
                onPress={() => setTradeType('sell')}
              >
                <Text style={tw(`text-center font-medium ${tradeType === 'sell' ? 'text-white' : 'text-gray-700'}`)}>
                  Sell
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={tw('mb-6')}>
            <Text style={tw('text-gray-700 text-lg mb-2 font-semibold')}>Currency</Text>
            <View style={tw('flex-row flex-wrap mb-4')}>
              {['BTC', 'ETH', 'USDT', 'USD'].map(currency => (
                <TouchableOpacity
                  key={currency}
                  style={tw(`mr-2 mb-2 p-3 rounded-lg border border-gray-300 ${tradeCurrency === currency ? 'bg-blue-500' : 'bg-white'}`)}
                  onPress={() => setTradeCurrency(currency)}
                >
                  <Text style={tw(`font-medium ${tradeCurrency === currency ? 'text-white' : 'text-gray-700'}`)}>
                    {currency}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={tw('mb-8')}>
            <Text style={tw('text-gray-700 text-lg mb-2 font-semibold')}>Amount</Text>
            <TextInput
              style={tw('p-3 border border-gray-300 rounded-lg text-lg')}
              keyboardType="numeric"
              placeholder="Enter amount"
              value={tradeAmount}
              onChangeText={setTradeAmount}
            />
          </View>
          
          <TouchableOpacity
            style={tw('bg-blue-500 py-4 px-6 rounded-lg')}
            onPress={handleCreateTrade}
          >
            <Text style={tw('text-white font-bold text-center text-lg')}>
              Create Trade
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={tw('mt-4 py-4 px-6 rounded-lg border border-gray-300')}
            onPress={() => navigation.goBack()}
          >
            <Text style={tw('text-gray-700 font-bold text-center')}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // If trade not found
  if (!currentTrade) {
    return (
      <View style={tw('flex-1 justify-center items-center p-4')}>
        <Feather name="alert-circle" size={64} color="#CBD5E0" />
        <Text style={tw('text-lg text-gray-600 mt-4')}>Trade not found</Text>
        <TouchableOpacity
          style={tw('mt-4 bg-blue-500 py-2 px-4 rounded')}
          onPress={() => navigation.goBack()}
        >
          <Text style={tw('text-white font-medium')}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render trade details
  return (
    <ScrollView style={tw('flex-1 bg-gray-50')}>
      {/* Trade status banner */}
      <View style={tw(`p-3 ${
        currentTrade.status === 'open' ? 'bg-blue-100' :
        currentTrade.status === 'in_escrow' ? 'bg-yellow-100' :
        currentTrade.status === 'completed' ? 'bg-green-100' :
        currentTrade.status === 'disputed' ? 'bg-red-100' : 'bg-gray-100'
      }`)}>
        <Text style={tw('text-center font-bold')}>
          Status: {' '}
          <Text style={tw(`${
            currentTrade.status === 'open' ? 'text-blue-700' :
            currentTrade.status === 'in_escrow' ? 'text-yellow-700' :
            currentTrade.status === 'completed' ? 'text-green-700' :
            currentTrade.status === 'disputed' ? 'text-red-700' : 'text-gray-700'
          }`)}>
            {currentTrade.status === 'open' ? 'Open' :
             currentTrade.status === 'in_escrow' ? 'In Escrow' :
             currentTrade.status === 'completed' ? 'Completed' :
             currentTrade.status === 'disputed' ? 'Disputed' : 'Cancelled'}
          </Text>
        </Text>
      </View>

      <View style={tw('p-4')}>
        {/* Trade header */}
        <View style={tw('bg-white rounded-lg shadow-sm p-4 mb-4')}>
          <Text style={tw('text-2xl font-bold mb-2 text-gray-800')}>
            {currentTrade.type === 'buy' ? 'Buy' : 'Sell'} {currentTrade.amount} {currentTrade.currency}
          </Text>
          <View style={tw('flex-row justify-between items-center')}>
            <Text style={tw('text-gray-600')}>Trade #{currentTrade.id}</Text>
            <Text style={tw('text-gray-600')}>
              {new Date(currentTrade.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Trade details */}
        <View style={tw('bg-white rounded-lg shadow-sm p-4 mb-4')}>
          <Text style={tw('text-lg font-bold mb-4 text-gray-800')}>Trade Details</Text>
          
          <View style={tw('mb-3')}>
            <Text style={tw('text-gray-500')}>Amount:</Text>
            <Text style={tw('text-lg font-medium')}>
              {currentTrade.amount} {currentTrade.currency}
            </Text>
          </View>
          
          <View style={tw('mb-3')}>
            <Text style={tw('text-gray-500')}>Price:</Text>
            <Text style={tw('text-lg font-medium')}>
              ${currentTrade.price} USD
            </Text>
          </View>
          
          <View style={tw('mb-3')}>
            <Text style={tw('text-gray-500')}>Total:</Text>
            <Text style={tw('text-lg font-medium')}>
              ${(currentTrade.amount * currentTrade.price).toFixed(2)} USD
            </Text>
          </View>
          
          <View style={tw('mb-3')}>
            <Text style={tw('text-gray-500')}>Payment Method:</Text>
            <Text style={tw('text-lg font-medium')}>
              {currentTrade.paymentMethod || 'Bank Transfer'}
            </Text>
          </View>
          
          <View style={tw('mb-3')}>
            <Text style={tw('text-gray-500')}>Trading with:</Text>
            <Text style={tw('text-lg font-medium')}>
              {currentTrade.counterparty?.username || 'User123'}
            </Text>
          </View>
        </View>

        {/* Escrow information */}
        <View style={tw('bg-white rounded-lg shadow-sm p-4 mb-4')}>
          <Text style={tw('text-lg font-bold mb-2 text-gray-800')}>Escrow Information</Text>
          <Text style={tw('text-gray-600 mb-4')}>
            {currentTrade.status === 'open' ? 
              'Funds will be securely held in escrow until both parties confirm completion.' :
            currentTrade.status === 'in_escrow' ?
              'Funds are currently locked in escrow. They will be released after confirmation.' :
            currentTrade.status === 'completed' ?
              'This trade has been completed and funds released from escrow.' :
            currentTrade.status === 'disputed' ?
              'This trade is under dispute. Our support team will contact you.' :
              'This trade has been cancelled.'}
          </Text>
          
          {/* Action buttons based on trade status */}
          <View style={tw('flex-row flex-wrap justify-center mt-2')}>
            {currentTrade.status === 'open' && (
              <TouchableOpacity
                style={tw('bg-blue-500 py-3 px-6 rounded-lg mr-2 mb-2')}
                onPress={handleConfirmTrade}
              >
                <Text style={tw('text-white font-bold')}>Lock in Escrow</Text>
              </TouchableOpacity>
            )}
            
            {currentTrade.status === 'in_escrow' && (
              <TouchableOpacity
                style={tw('bg-green-500 py-3 px-6 rounded-lg mr-2 mb-2')}
                onPress={handleReleaseFunds}
              >
                <Text style={tw('text-white font-bold')}>Release Funds</Text>
              </TouchableOpacity>
            )}
            
            {(currentTrade.status === 'open' || currentTrade.status === 'in_escrow') && (
              <TouchableOpacity
                style={tw('bg-red-500 py-3 px-6 rounded-lg mr-2 mb-2')}
                onPress={handleDispute}
              >
                <Text style={tw('text-white font-bold')}>File Dispute</Text>
              </TouchableOpacity>
            )}
            
            {currentTrade.status === 'open' && (
              <TouchableOpacity
                style={tw('bg-gray-500 py-3 px-6 rounded-lg mb-2')}
                onPress={handleCancelTrade}
              >
                <Text style={tw('text-white font-bold')}>Cancel Trade</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Chat button */}
        <TouchableOpacity
          style={tw('bg-white rounded-lg shadow-sm p-4 mb-4 flex-row justify-center items-center')}
          onPress={handleChat}
        >
          <Feather name="message-circle" size={20} color="#3B82F6" />
          <Text style={tw('text-blue-500 font-bold ml-2')}>Chat with Trader</Text>
        </TouchableOpacity>

        {/* Rating section - only show if trade is completed */}
        {currentTrade.status === 'completed' && (
          <View style={tw('bg-white rounded-lg shadow-sm p-4 mb-4')}>
            <Text style={tw('text-lg font-bold mb-4 text-gray-800')}>Rate this Trade</Text>
            <RatingInput 
              rating={rating}
              onRatingChange={setRating}
            />
            <TouchableOpacity
              style={tw('bg-blue-500 py-3 px-6 rounded-lg mt-4')}
              onPress={handleSubmitRating}
            >
              <Text style={tw('text-white font-bold text-center')}>Submit Rating</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default TradeScreen;
