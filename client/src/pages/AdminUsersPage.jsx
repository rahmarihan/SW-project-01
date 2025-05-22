import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import UserRow from '../components/UserRow';
import UpdateUserRoleModal from '../components/UpdateUserRoleModal';
import ConfirmationDialog from '../components/ConfirmationDialog';

const AdminUsersPage = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const fetchUsers = () => {
    axios
      .get('/api/v1/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setUsers(res.data.users))
      .catch(() => toast.error('Failed to fetch users'));
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setShowConfirmDialog(true);
  };

  const handleRoleUpdate = (role) => {
    axios
      .put(`/api/v1/users/${selectedUser._id}/role`, { role }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        toast.success('Role updated');
        fetchUsers();
        setShowRoleModal(false);
      })
      .catch(() => toast.error('Failed to update role'));
  };

  const handleDelete = () => {
    axios
      .delete(`/api/v1/users/${selectedUser._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
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
          {users.map((user) => (
            <UserRow
              key={user._id}
              user={user}
              onUpdateRole={() => openRoleModal(user)}
              onDelete={() => openDeleteDialog(user)}
            />
          ))}
        </tbody>
      </table>

      {showRoleModal && (
        <UpdateUserRoleModal
          user={selectedUser}
          onClose={() => setShowRoleModal(false)}
          onConfirm={handleRoleUpdate}
        />
      )}

      {showConfirmDialog && (
        <ConfirmationDialog
          message={`Delete user "${selectedUser.name}"?`}
          onCancel={() => setShowConfirmDialog(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default AdminUsersPage;
