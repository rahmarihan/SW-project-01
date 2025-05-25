import React from 'react';

const UserRow = ({ user, onUpdateRole, onDelete }) => (
  <tr>
    <td>{user.name}</td>
    <td>{user.email}</td>
    <td>{user.role}</td>
    <td>
      <button onClick={() => onUpdateRole(user)}>Update Role</button>
      <button onClick={() => onDelete(user)}>Delete</button>
    </td>
  </tr>
);

export default UserRow;
