import React from 'react';

const ConfirmationModal = ({ 
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
}) => {
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">{title}</h3>
        <button
          onClick={onClose}
          className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 focus:outline-none"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="mt-4">
        <p className="text-secondary-600 dark:text-secondary-400">{message}</p>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className={`btn ${isDangerous ? 'btn-danger' : 'btn-primary'}`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
