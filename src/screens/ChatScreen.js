import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useSelector, useDispatch } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import ChatMessage from '../components/ChatMessage';
import { fetchMessages, sendMessage } from '../redux/slices/tradeSlice';
import LoadingSpinner from '../components/LoadingSpinner';

const ChatScreen = ({ route, navigation }) => {
  const tw = useTailwind();
  const dispatch = useDispatch();
  const flatListRef = useRef(null);
  const { tradeId, otherUser } = route.params;
  const [messageText, setMessageText] = useState('');
  const { messages, status } = useSelector(state => state.trade);
  const currentUser = useSelector(state => state.auth.user);

  useEffect(() => {
    if (tradeId) {
      dispatch(fetchMessages(tradeId));
    }
  }, [dispatch, tradeId]);

  // Set the chat partner's name in the header
  useEffect(() => {
    if (otherUser) {
      navigation.setOptions({
        title: otherUser.username || 'Chat',
      });
    }
  }, [navigation, otherUser]);

  const handleSendMessage = () => {
    if (messageText.trim() === '') return;
    
    dispatch(sendMessage({
      tradeId,
      text: messageText,
      senderId: currentUser.id,
      receiverId: otherUser.id
    }));
    
    setMessageText('');
  };

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  if (status === 'loading' && !messages.length) {
    return <LoadingSpinner />;
  }

  return (
    <KeyboardAvoidingView
      style={tw('flex-1 bg-gray-100')}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ChatMessage 
            message={item}
            isOwnMessage={item.senderId === currentUser.id}
          />
        )}
        contentContainerStyle={tw('p-4 pb-2')}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
        ListEmptyComponent={
          <View style={tw('flex-1 justify-center items-center p-8')}>
            <Feather name="message-circle" size={64} color="#CBD5E0" />
            <Text style={tw('text-gray-500 mt-4 text-center')}>
              No messages yet. Start the conversation!
            </Text>
          </View>
        }
      />
      
      <View style={tw('p-2 border-t border-gray-200 bg-white')}>
        <View style={tw('flex-row')}>
          <TextInput
            style={tw('flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2')}
            placeholder="Type a message..."
            value={messageText}
            onChangeText={setMessageText}
            multiline
          />
          <TouchableOpacity
            style={tw('bg-blue-500 w-12 h-12 rounded-full justify-center items-center')}
            onPress={handleSendMessage}
          >
            <Feather name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
