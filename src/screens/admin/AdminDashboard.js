import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useDispatch, useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { fetchAdminStats } from '../../redux/slices/authSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const AdminDashboard = ({ navigation }) => {
  const tw = useTailwind();
  const dispatch = useDispatch();
  const { adminStats, status, error } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  if (status === 'loading' && !adminStats) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  // Default stats if none exist
  const stats = adminStats || {
    activeTrades: 15,
    completedTrades: 247,
    disputedTrades: 3,
    activeUsers: 42,
    totalVolume: 12580,
    userGrowth: 12
  };

  return (
    <ScrollView style={tw('flex-1 bg-gray-100')}>
      {/* Header */}
      <View style={tw('bg-gray-800 pt-6 pb-8 px-4')}>
        <Text style={tw('text-white text-2xl font-bold mb-1')}>Admin Dashboard</Text>
        <Text style={tw('text-gray-400')}>
          Platform overview and management
        </Text>
      </View>
      
      {/* Stats Cards */}
      <View style={tw('px-4 -mt-4')}>
        <View style={tw('flex-row flex-wrap')}>
          {/* Active Trades */}
          <View style={tw('bg-white rounded-lg shadow-sm p-4 mb-4 w-1/2 pr-2')}>
            <View style={tw('flex-row items-center mb-2')}>
              <View style={tw('w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2')}>
                <Feather name="refresh-cw" size={16} color="#3B82F6" />
              </View>
              <Text style={tw('text-gray-500')}>Active Trades</Text>
            </View>
            <Text style={tw('text-2xl font-bold text-gray-800')}>{stats.activeTrades}</Text>
          </View>
          
          {/* Users */}
          <View style={tw('bg-white rounded-lg shadow-sm p-4 mb-4 w-1/2 pl-2')}>
            <View style={tw('flex-row items-center mb-2')}>
              <View style={tw('w-8 h-8 rounded-full bg-green-100 items-center justify-center mr-2')}>
                <Feather name="users" size={16} color="#10B981" />
              </View>
              <Text style={tw('text-gray-500')}>Active Users</Text>
            </View>
            <Text style={tw('text-2xl font-bold text-gray-800')}>{stats.activeUsers}</Text>
            <Text style={tw('text-green-500 text-sm')}>+{stats.userGrowth}% this week</Text>
          </View>
          
          {/* Volume */}
          <View style={tw('bg-white rounded-lg shadow-sm p-4 mb-4 w-1/2 pr-2')}>
            <View style={tw('flex-row items-center mb-2')}>
              <View style={tw('w-8 h-8 rounded-full bg-purple-100 items-center justify-center mr-2')}>
                <Feather name="dollar-sign" size={16} color="#8B5CF6" />
              </View>
              <Text style={tw('text-gray-500')}>Total Volume</Text>
            </View>
            <Text style={tw('text-2xl font-bold text-gray-800')}>${stats.totalVolume}</Text>
          </View>
          
          {/* Disputes */}
          <View style={tw('bg-white rounded-lg shadow-sm p-4 mb-4 w-1/2 pl-2')}>
            <View style={tw('flex-row items-center mb-2')}>
              <View style={tw('w-8 h-8 rounded-full bg-red-100 items-center justify-center mr-2')}>
                <Feather name="alert-circle" size={16} color="#EF4444" />
              </View>
              <Text style={tw('text-gray-500')}>Open Disputes</Text>
            </View>
            <Text style={tw('text-2xl font-bold text-gray-800')}>{stats.disputedTrades}</Text>
          </View>
        </View>
      </View>
      
      {/* Quick actions */}
      <View style={tw('px-4 mb-4')}>
        <Text style={tw('text-lg font-bold text-gray-800 mb-3')}>Quick Actions</Text>
        
        <View style={tw('bg-white rounded-lg shadow-sm overflow-hidden mb-4')}>
          <TouchableOpacity 
            style={tw('p-4 border-b border-gray-100 flex-row items-center')}
            onPress={() => navigation.navigate('TradesOverview')}
          >
            <View style={tw('w-10 h-10 rounded-full bg-gray-100 justify-center items-center mr-3')}>
              <Feather name="list" size={20} color="#3B82F6" />
            </View>
            <View style={tw('flex-1')}>
              <Text style={tw('text-gray-800 font-medium')}>Manage Trades</Text>
              <Text style={tw('text-gray-500 text-sm')}>View and manage all platform trades</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#CBD5E0" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={tw('p-4 border-b border-gray-100 flex-row items-center')}
            onPress={() => navigation.navigate('DisputesOverview')}
          >
            <View style={tw('w-10 h-10 rounded-full bg-gray-100 justify-center items-center mr-3')}>
              <Feather name="alert-triangle" size={20} color="#EF4444" />
            </View>
            <View style={tw('flex-1')}>
              <Text style={tw('text-gray-800 font-medium')}>Resolve Disputes</Text>
              <Text style={tw('text-gray-500 text-sm')}>Handle open trade disputes</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#CBD5E0" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={tw('p-4 flex-row items-center')}
          >
            <View style={tw('w-10 h-10 rounded-full bg-gray-100 justify-center items-center mr-3')}>
              <Feather name="user-check" size={20} color="#10B981" />
            </View>
            <View style={tw('flex-1')}>
              <Text style={tw('text-gray-800 font-medium')}>User Management</Text>
              <Text style={tw('text-gray-500 text-sm')}>Manage user accounts and permissions</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#CBD5E0" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Recent activity */}
      <View style={tw('px-4 mb-8')}>
        <Text style={tw('text-lg font-bold text-gray-800 mb-3')}>Recent Activity</Text>
        
        <View style={tw('bg-white rounded-lg shadow-sm overflow-hidden')}>
          <View style={tw('p-4 border-b border-gray-100')}>
            <Text style={tw('text-gray-800 font-medium')}>New dispute filed</Text>
            <Text style={tw('text-gray-500 text-sm')}>Trade #1234 - 10 minutes ago</Text>
          </View>
          
          <View style={tw('p-4 border-b border-gray-100')}>
            <Text style={tw('text-gray-800 font-medium')}>Trade completed</Text>
            <Text style={tw('text-gray-500 text-sm')}>Trade #1233 - 25 minutes ago</Text>
          </View>
          
          <View style={tw('p-4 border-b border-gray-100')}>
            <Text style={tw('text-gray-800 font-medium')}>New user registered</Text>
            <Text style={tw('text-gray-500 text-sm')}>User ID #4567 - 1 hour ago</Text>
          </View>
          
          <View style={tw('p-4')}>
            <Text style={tw('text-gray-800 font-medium')}>Wallet withdrawal requested</Text>
            <Text style={tw('text-gray-500 text-sm')}>User ID #2345 - 2 hours ago</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default AdminDashboard;
