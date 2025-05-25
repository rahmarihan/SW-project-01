import { useState } from 'react';

const UpdateUserRoleModal = ({ user, onClose, onConfirm }) => {
  const [role, setRole] = useState(user.role);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(role);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Update Role for {user.name}</h3>
        <form onSubmit={handleSubmit}>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="User">User</option>
            <option value="Event Organizer">Event Organizer</option>
            <option value="Admin">Admin</option>
          </select>
          <br />
          <button type="submit">Save</button>
          <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserRoleModal;
