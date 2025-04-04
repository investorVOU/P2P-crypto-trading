import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useSelector, useDispatch } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { fetchUserProfile, logout } from '../redux/slices/authSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const ProfileScreen = ({ navigation }) => {
  const tw = useTailwind();
  const dispatch = useDispatch();
  const { user, profile, status, error } = useSelector(state => state.auth);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserProfile(user.id));
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (status === 'loading' && !profile) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  // If profile data is not available, show a placeholder
  if (!profile) {
    return (
      <View style={tw('flex-1 justify-center items-center p-4')}>
        <Text style={tw('text-lg text-gray-600 mb-4')}>Profile data not available</Text>
        <TouchableOpacity
          style={tw('bg-blue-500 py-2 px-4 rounded')}
          onPress={() => dispatch(fetchUserProfile(user?.id))}
        >
          <Text style={tw('text-white')}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={tw('flex-1 bg-gray-50')}>
      {/* Profile header */}
      <View style={tw('bg-blue-500 pt-6 pb-8 items-center')}>
        <View style={tw('w-24 h-24 rounded-full bg-white justify-center items-center mb-3 overflow-hidden')}>
          {profile.avatar ? (
            <Image 
              source={{ uri: profile.avatar }} 
              style={tw('w-full h-full')}
              resizeMode="cover"
            />
          ) : (
            <Feather name="user" size={40} color="#3B82F6" />
          )}
        </View>
        <Text style={tw('text-white text-xl font-bold')}>{profile.username}</Text>
        <Text style={tw('text-blue-100')}>Joined {new Date(profile.createdAt).toLocaleDateString()}</Text>
        
        <View style={tw('flex-row mt-4')}>
          <View style={tw('items-center mr-8')}>
            <Text style={tw('text-white text-lg font-bold')}>{profile.completedTrades || 0}</Text>
            <Text style={tw('text-blue-100')}>Trades</Text>
          </View>
          <View style={tw('items-center')}>
            <Text style={tw('text-white text-lg font-bold')}>{profile.rating || '0.0'}</Text>
            <Text style={tw('text-blue-100')}>Rating</Text>
          </View>
        </View>
      </View>

      {/* Profile details */}
      <View style={tw('p-4')}>
        <View style={tw('bg-white rounded-lg shadow-sm p-4 mb-4')}>
          <Text style={tw('text-lg font-bold mb-4 text-gray-800')}>User Information</Text>
          
          <View style={tw('mb-3')}>
            <Text style={tw('text-gray-500')}>Full Name:</Text>
            <Text style={tw('text-lg')}>{profile.fullName || 'Not provided'}</Text>
          </View>
          
          <View style={tw('mb-3')}>
            <Text style={tw('text-gray-500')}>Email:</Text>
            <Text style={tw('text-lg')}>{profile.email || 'Not provided'}</Text>
          </View>
          
          <View style={tw('mb-3')}>
            <Text style={tw('text-gray-500')}>Phone:</Text>
            <Text style={tw('text-lg')}>{profile.phone || 'Not provided'}</Text>
          </View>
          
          <View>
            <Text style={tw('text-gray-500')}>Verification Status:</Text>
            <View style={tw('flex-row items-center mt-1')}>
              <View style={tw(`w-3 h-3 rounded-full ${profile.verified ? 'bg-green-500' : 'bg-yellow-500'} mr-2`)} />
              <Text style={tw('text-lg')}>{profile.verified ? 'Verified' : 'Unverified'}</Text>
            </View>
          </View>
        </View>

        {/* Trade history summary */}
        <View style={tw('bg-white rounded-lg shadow-sm p-4 mb-4')}>
          <Text style={tw('text-lg font-bold mb-4 text-gray-800')}>Trade Statistics</Text>
          
          <View style={tw('flex-row justify-between mb-3')}>
            <Text style={tw('text-gray-500')}>Completed Trades:</Text>
            <Text style={tw('text-lg font-medium')}>{profile.completedTrades || 0}</Text>
          </View>
          
          <View style={tw('flex-row justify-between mb-3')}>
            <Text style={tw('text-gray-500')}>Successful Rate:</Text>
            <Text style={tw('text-lg font-medium')}>{profile.successRate || '100'}%</Text>
          </View>
          
          <View style={tw('flex-row justify-between mb-3')}>
            <Text style={tw('text-gray-500')}>Average Response Time:</Text>
            <Text style={tw('text-lg font-medium')}>{profile.responseTime || '< 5'} mins</Text>
          </View>
          
          <View style={tw('flex-row justify-between')}>
            <Text style={tw('text-gray-500')}>Rating:</Text>
            <View style={tw('flex-row')}>
              {Array(5).fill(0).map((_, i) => (
                <Feather 
                  key={i}
                  name="star" 
                  size={18} 
                  color={i < Math.floor(profile.rating || 0) ? "#F59E0B" : "#CBD5E0"}
                  style={tw('ml-1')}
                />
              ))}
              <Text style={tw('ml-2 text-lg font-medium')}>{profile.rating || '0.0'}</Text>
            </View>
          </View>
        </View>

        {/* Action buttons */}
        <View style={tw('bg-white rounded-lg shadow-sm p-4 mb-4')}>
          <TouchableOpacity 
            style={tw('flex-row items-center py-3 border-b border-gray-100')}
            onPress={() => navigation.navigate('Wallet')}
          >
            <Feather name="credit-card" size={20} color="#3B82F6" style={tw('mr-3')} />
            <Text style={tw('text-gray-800 text-lg')}>My Wallet</Text>
            <Feather name="chevron-right" size={20} color="#CBD5E0" style={tw('ml-auto')} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={tw('flex-row items-center py-3 border-b border-gray-100')}
          >
            <Feather name="settings" size={20} color="#3B82F6" style={tw('mr-3')} />
            <Text style={tw('text-gray-800 text-lg')}>Settings</Text>
            <Feather name="chevron-right" size={20} color="#CBD5E0" style={tw('ml-auto')} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={tw('flex-row items-center py-3 border-b border-gray-100')}
          >
            <Feather name="help-circle" size={20} color="#3B82F6" style={tw('mr-3')} />
            <Text style={tw('text-gray-800 text-lg')}>Help & Support</Text>
            <Feather name="chevron-right" size={20} color="#CBD5E0" style={tw('ml-auto')} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={tw('flex-row items-center py-3')}
            onPress={handleLogout}
          >
            <Feather name="log-out" size={20} color="#EF4444" style={tw('mr-3')} />
            <Text style={tw('text-red-500 text-lg')}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
