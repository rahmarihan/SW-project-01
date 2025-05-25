import { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import UserRow from './UserRow';
import ConfirmationDialog from './ConfirmationDialog';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate();

  // Fetch all users
  const fetchUsers = () => {
    api
      .getAllUsers()
      .then((res) => {
        console.log('Users API response:', res.data);
        setUsers(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => toast.error('Failed to fetch users'));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Open role update modal
  const openRoleModal = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setShowConfirmDialog(true);
  };

  // Update user role
  const handleRoleUpdate = (role) => {
    const userId = selectedUser._id || selectedUser.id;
    api
      .updateUserRole(userId, role)
      .then(() => {
        toast.success('Role updated');
        fetchUsers();
        setShowRoleModal(false);
      })
      .catch(() => toast.error('Failed to update role'));
  };

  // Delete user
  const handleDelete = () => {
    const userId = selectedUser._id || selectedUser.id;
    api
      .deleteUser(userId)
      .then(() => {
        toast.success('User deleted');
        fetchUsers();
        setShowConfirmDialog(false);
      })
      .catch(() => toast.error('Delete failed'));
  };

  return (
    <div className="container">
      <h2>All Users</h2>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(users) ? users : []).map((user) => (
            <UserRow
              key={user._id}
              user={user}
              onUpdateRole={openRoleModal}
              onDelete={openDeleteDialog}
            />
          ))}
        </tbody>
      </table>

      {/* Role update modal */}
      {showRoleModal && (
        <div className="modal">
          <h3>Update Role for {selectedUser.name}</h3>
          <select
            value={selectedUser.role}
            onChange={e => setSelectedUser({ ...selectedUser, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="organizer">Organizer</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={() => {
              handleRoleUpdate(selectedUser.role);
            }}
            style={{ marginRight: 8 }}
          >
            Confirm
          </button>
          <button onClick={() => setShowRoleModal(false)}>Cancel</button>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmationDialog
        open={showConfirmDialog}
        title="Delete User"
        message={`Delete user "${selectedUser?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmDialog(false)}
      />

      {/* Back to Admin Dashboard button */}
      <button
        style={{
          marginTop: 32,
          padding: '8px 18px',
          background: '#2d3748',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
        onClick={() => navigate('/admin')}
      >
        ← Back to Admin Dashboard
      </button>
    </div>
  );
};

export default AdminUsersPage;
