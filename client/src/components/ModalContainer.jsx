import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../features/ui/uiSlice';

// Import modal components
import ConfirmationModal from './modals/ConfirmationModal';
import DisputeModal from './modals/DisputeModal';
import RatingModal from './modals/RatingModal';
import DepositModal from './modals/DepositModal';
import WithdrawModal from './modals/WithdrawModal';

const ModalContainer = () => {
  const dispatch = useDispatch();
  const { activeModal, modalData } = useSelector((state) => state.ui);
  
  if (!activeModal) return null;
  
  // Close the modal when clicking outside or on the X button
  const handleClose = () => {
    dispatch(closeModal());
  };
  
  // Prevent clicks inside the modal from bubbling up
  const handleModalClick = (e) => {
    e.stopPropagation();
  };
  
  // Render the appropriate modal based on activeModal
  const renderModal = () => {
    switch (activeModal) {
      case 'confirmation':
        return <ConfirmationModal onClose={handleClose} {...modalData} />;
      case 'dispute':
        return <DisputeModal onClose={handleClose} {...modalData} />;
      case 'rating':
        return <RatingModal onClose={handleClose} {...modalData} />;
      case 'deposit':
        return <DepositModal onClose={handleClose} {...modalData} />;
      case 'withdraw':
        return <WithdrawModal onClose={handleClose} {...modalData} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={handleClose}>
      <div className="relative bg-white dark:bg-secondary-800 rounded-lg shadow-xl max-w-lg w-full max-h-screen overflow-y-auto" onClick={handleModalClick}>
        {renderModal()}
      </div>
    </div>
  );
};

export default ModalContainer;
