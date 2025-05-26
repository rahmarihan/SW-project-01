import React from 'react';

const ConfirmationDialog = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-btn-group">
          <button className="modal-btn confirm" onClick={onConfirm}>Confirm</button>
          <button className="modal-btn cancel" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;