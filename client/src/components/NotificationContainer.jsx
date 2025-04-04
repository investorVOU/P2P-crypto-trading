import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification } from '../features/ui/uiSlice';

const NotificationContainer = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.ui);
  
  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        dispatch(removeNotification(notifications[0].id));
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notifications, dispatch]);
  
  if (notifications.length === 0) return null;
  
  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-3 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`rounded-md p-4 shadow-lg flex items-start ${
            notification.type === 'success' ? 'bg-success-100 text-success-800 border border-success-200' :
            notification.type === 'error' ? 'bg-danger-100 text-danger-800 border border-danger-200' :
            notification.type === 'warning' ? 'bg-warning-100 text-warning-800 border border-warning-200' :
            'bg-primary-100 text-primary-800 border border-primary-200'
          }`}
        >
          <div className="flex-shrink-0 mr-3">
            {notification.type === 'success' && (
              <svg className="h-5 w-5 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {notification.type === 'error' && (
              <svg className="h-5 w-5 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {notification.type === 'warning' && (
              <svg className="h-5 w-5 text-warning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            {notification.type === 'info' && (
              <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          
          <div className="flex-1">
            {notification.title && (
              <h3 className="text-sm font-medium">{notification.title}</h3>
            )}
            {notification.message && (
              <p className="mt-1 text-sm">{notification.message}</p>
            )}
          </div>
          
          <div className="ml-3 flex-shrink-0">
            <button
              type="button"
              className="inline-flex text-secondary-400 hover:text-secondary-600 focus:outline-none"
              onClick={() => dispatch(removeNotification(notification.id))}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;
