const ConfirmationDialog = ({ message, onCancel, onConfirm }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onConfirm} style={{ color: 'red' }}>Yes, Delete</button>
        <button onClick={onCancel} style={{ marginLeft: '10px' }}>Cancel</button>
      </div>
    </div>
  );
};

export default ConfirmationDialog;