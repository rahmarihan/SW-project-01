const UserRow = ({ user, onUpdateRole, onDelete }) => {
  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>
        <button onClick={onUpdateRole}>Update Role</button>
        <button style={{ color: 'red', marginLeft: '10px' }} onClick={onDelete}>Delete</button>
      </td>
    </tr>
  );
};

export default UserRow;
