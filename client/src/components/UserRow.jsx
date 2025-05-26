import React from 'react';

const UserRow = ({ user, onUpdateRole, onDelete }) => (
  <tr>
    <td>{user.name}</td>
    <td>{user.email}</td>
    <td className="role-cell">{user.role}</td>
    <td>
      <div className="action-btn-group">
        <button className="action-btn update" onClick={() => onUpdateRole(user)}>
          Update Role
        </button>
        <button className="action-btn delete" onClick={() => onDelete(user)}>
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default UserRow;
