import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function UsersDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Loading states
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingEditId, setLoadingEditId] = useState(null); // userId being edited
  const [loadingDeleteId, setLoadingDeleteId] = useState(null); // userId being deleted

  // Edit user state
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');

  useEffect(() => {
    if (currentUser && currentUser.isOverallAdmin) {
      fetchUsers();
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setError('');
    try {
      const res = await fetch('/api/user/by-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.userId, isOverallAdmin: currentUser.isOverallAdmin }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoadingAdd(true);
    try {
      const res = await fetch('/api/user/create-by-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, userId: currentUser.userId, isOverallAdmin: currentUser.isOverallAdmin }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('User added successfully');
        setUsername(''); setEmail(''); setPassword('');
        fetchUsers();
      } else {
        setError(data.message || 'Failed to add user');
      }
    } catch (err) {
      setError('Failed to add user');
    } finally {
      setLoadingAdd(false);
    }
  };

  // Start editing a user
  const startEditUser = (user) => {
    setEditingUserId(user._id);
    setEditUsername(user.username);
    setEditEmail(user.email);
  };

  // Cancel editing
  const cancelEditUser = () => {
    setEditingUserId(null);
    setEditUsername('');
    setEditEmail('');
  };

  // Save edited user
  const saveEditUser = async (userId) => {
    setError('');
    setSuccess('');
    setLoadingEditId(userId);
    try {
      const res = await fetch(`/api/user/update/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: editUsername, email: editEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('User updated successfully');
        setEditingUserId(null);
        fetchUsers();
      } else {
        setError(data.message || 'Failed to update user');
      }
    } catch (err) {
      setError('Failed to update user');
    } finally {
      setLoadingEditId(null);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    setError('');
    setSuccess('');
    setLoadingDeleteId(userId);
    try {
      const res = await fetch(`/api/user/delete/${userId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('User deleted successfully');
        fetchUsers();
      } else {
        setError(data.message || 'Failed to delete user');
      }
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setLoadingDeleteId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Users Management</h2>
      <form className="mb-6 space-y-2" onSubmit={handleAddUser}>
        <div>
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="border p-2 rounded w-full" required />
        </div>
        <div>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 rounded w-full" required />
        </div>
        <div>
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 rounded w-full" required />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loadingAdd}>
          {loadingAdd ? 'Adding...' : 'Add User'}
        </button>
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
      </form>
      <h3 className="text-xl font-semibold mb-2">All Users</h3>
      {loadingUsers ? (
        <div className="text-center py-8">Loading users...</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Username</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td className="p-2 border">
                  {editingUserId === user._id ? (
                    <input
                      type="text"
                      value={editUsername}
                      onChange={e => setEditUsername(e.target.value)}
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td className="p-2 border">
                  {editingUserId === user._id ? (
                    <input
                      type="email"
                      value={editEmail}
                      onChange={e => setEditEmail(e.target.value)}
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="p-2 border">{user.isOverallAdmin ? 'Overall Admin' : user.isAdmin ? 'Admin' : 'User'}</td>
                <td className="p-2 border flex gap-2">
                  {editingUserId === user._id ? (
                    <>
                      <button onClick={() => saveEditUser(user._id)} className="bg-green-500 text-white px-2 py-1 rounded" disabled={loadingEditId === user._id}>
                        {loadingEditId === user._id ? 'Saving...' : 'Save'}
                      </button>
                      <button onClick={cancelEditUser} className="bg-gray-400 text-white px-2 py-1 rounded" disabled={loadingEditId === user._id}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditUser(user)} className="bg-blue-500 text-white px-2 py-1 rounded" disabled={loadingEditId || loadingDeleteId === user._id}>Edit</button>
                      <button onClick={() => handleDeleteUser(user._id)} className="bg-red-500 text-white px-2 py-1 rounded" disabled={loadingDeleteId === user._id}>
                        {loadingDeleteId === user._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
