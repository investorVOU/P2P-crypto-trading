import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useDispatch, useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { fetchWallet, fetchTransactions } from '../redux/slices/walletSlice';
import WalletCard from '../components/WalletCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const WalletScreen = ({ navigation }) => {
  const tw = useTailwind();
  const dispatch = useDispatch();
  const { balances, transactions, status, error } = useSelector((state) => state.wallet);

  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleDeposit = () => {
    // Navigate to deposit screen
    // navigation.navigate('DepositScreen');
    // For demo we'll just show an alert
    alert('Deposit functionality would be implemented here');
  };

  const handleWithdraw = () => {
    // Navigate to withdraw screen
    // navigation.navigate('WithdrawScreen');
    // For demo we'll just show an alert
    alert('Withdraw functionality would be implemented here');
  };

  const handleCurrencySelect = (currency) => {
    // Navigate to currency details
    // navigation.navigate('CurrencyDetails', { currency });
    // For demo we'll just show an alert
    alert(`${currency} details would be shown here`);
  };

  if (status === 'loading' && (!balances.length || !transactions.length)) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <ScrollView style={tw('flex-1 bg-gray-50')}>
      {/* Wallet Balance Summary */}
      <View style={tw('bg-blue-500 pt-6 pb-8')}>
        <Text style={tw('text-blue-100 text-center mb-2')}>Total Balance (USD)</Text>
        <Text style={tw('text-white text-4xl font-bold text-center')}>
          ${balances.reduce((total, balance) => total + balance.usdValue, 0).toFixed(2)}
        </Text>
        
        <View style={tw('flex-row justify-center mt-6')}>
          <TouchableOpacity 
            style={tw('bg-white bg-opacity-20 py-2 px-6 rounded-full mr-4 flex-row items-center')}
            onPress={handleDeposit}
          >
            <Feather name="arrow-down" size={16} color="white" style={tw('mr-2')} />
            <Text style={tw('text-white font-medium')}>Deposit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={tw('bg-white bg-opacity-20 py-2 px-6 rounded-full flex-row items-center')}
            onPress={handleWithdraw}
          >
            <Feather name="arrow-up" size={16} color="white" style={tw('mr-2')} />
            <Text style={tw('text-white font-medium')}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Currency balances */}
      <View style={tw('px-4 -mt-4')}>
        <FlatList
          data={balances}
          keyExtractor={(item) => item.currency}
          renderItem={({ item }) => (
            <WalletCard 
              currency={item.currency}
              amount={item.amount}
              usdValue={item.usdValue}
              onPress={() => handleCurrencySelect(item.currency)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw('pb-2')}
          ListEmptyComponent={
            <View style={tw('bg-white rounded-lg shadow-sm p-6 items-center w-64 mr-4')}>
              <Feather name="credit-card" size={32} color="#CBD5E0" />
              <Text style={tw('text-gray-500 mt-2 text-center')}>
                No currencies in wallet
              </Text>
            </View>
          }
        />
      </View>

      {/* Transaction History */}
      <View style={tw('p-4')}>
        <View style={tw('flex-row justify-between items-center mb-4')}>
          <Text style={tw('text-xl font-bold text-gray-800')}>Transaction History</Text>
          <TouchableOpacity>
            <Text style={tw('text-blue-500')}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={tw('bg-white rounded-lg shadow-sm overflow-hidden')}>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <View 
                key={transaction.id} 
                style={tw('p-4 border-b border-gray-100 flex-row items-center')}
              >
                <View style={tw('w-10 h-10 rounded-full bg-gray-100 justify-center items-center mr-3')}>
                  <Feather 
                    name={
                      transaction.type === 'deposit' ? 'arrow-down' : 
                      transaction.type === 'withdraw' ? 'arrow-up' : 
                      transaction.type === 'trade' ? 'refresh-cw' : 'activity'
                    } 
                    size={20} 
                    color="#3B82F6" 
                  />
                </View>
                
                <View style={tw('flex-1')}>
                  <Text style={tw('text-gray-800 font-medium')}>
                    {transaction.type === 'deposit' ? 'Deposit' : 
                     transaction.type === 'withdraw' ? 'Withdrawal' : 
                     transaction.type === 'trade' ? 'Trade' : 'Transaction'}
                  </Text>
                  <Text style={tw('text-gray-500 text-sm')}>
                    {new Date(transaction.date).toLocaleString()}
                  </Text>
                </View>
                
                <Text style={tw(`${
                  transaction.type === 'deposit' || transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                } font-medium`)}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} {transaction.currency}
                </Text>
              </View>
            ))
          ) : (
            <View style={tw('p-6 items-center')}>
              <Feather name="inbox" size={32} color="#CBD5E0" />
              <Text style={tw('text-gray-500 mt-2 text-center')}>
                No transactions yet
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default WalletScreen;
