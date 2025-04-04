import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeModal: null,
  modalData: {},
  notifications: [],
  isDarkMode: false,
  notificationCount: 0,
  sidebarOpen: false
};

let nextNotificationId = 1;

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Modal actions
    openModal: (state, action) => {
      const { type, data } = action.payload;
      state.activeModal = type;
      state.modalData = data || {};
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalData = {};
    },
    
    // Notification actions
    addNotification: (state, action) => {
      const notification = {
        id: nextNotificationId++,
        createdAt: new Date().toISOString(),
        type: action.payload.type || 'info',
        ...action.payload
      };
      state.notifications.unshift(notification);
      // Keep max 5 notifications
      if (state.notifications.length > 5) {
        state.notifications.pop();
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Theme actions
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      
      // Update HTML class for dark mode
      if (state.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    
    // Notification count actions
    incrementNotificationCount: (state) => {
      state.notificationCount += 1;
    },
    resetNotificationCount: (state) => {
      state.notificationCount = 0;
    },
    
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    }
  },
});

export const {
  openModal,
  closeModal,
  addNotification,
  removeNotification,
  clearNotifications,
  toggleDarkMode,
  incrementNotificationCount,
  resetNotificationCount,
  toggleSidebar,
  closeSidebar
} = uiSlice.actions;

export default uiSlice.reducer;
