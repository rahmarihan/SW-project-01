import React from 'react';

const ConfirmationDialog = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null; // Only render when open is true

  return (
    <div className="modal">
      <h3>{title}</h3>
      <p>{message}</p>
      <button onClick={onConfirm} style={{ marginRight: 8 }}>Yes</button>
      <button onClick={onCancel}>No</button>
    </div>
  );
};

export default ConfirmationDialog;