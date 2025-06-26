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
    // eslint-disable-next-line
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
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h2 className="text-3xl font-bold mb-6 text-black tracking-tight">Users Management</h2>
      <form className="mb-8 space-y-3 bg-white p-6 rounded-2xl shadow-md border border-[#ececec]" onSubmit={handleAddUser}>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="rounded-xl border border-[#ececec] px-4 py-2 text-base text-black focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/20 transition w-full"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="rounded-xl border border-[#ececec] px-4 py-2 text-base text-black focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/20 transition w-full"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="rounded-xl border border-[#ececec] px-4 py-2 text-base text-black focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/20 transition w-full"
            required
          />
          <button
            type="submit"
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold px-6 py-2 rounded-xl transition active:scale-95 w-full md:w-auto"
            disabled={loadingAdd}
          >
            {loadingAdd ? 'Adding...' : 'Add User'}
          </button>
        </div>
        {error && <p className="text-[#ff385c] font-bold mt-2">{error}</p>}
        {success && <p className="text-green-700 font-bold mt-2">{success}</p>}
      </form>
      <h3 className="text-2xl font-semibold mb-4 text-black">All Users</h3>
      {loadingUsers ? (
        <div className="text-center py-8 text-[#ff385c] animate-pulse">Loading users...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-[#ececec]">
          <table className="w-full text-left rounded-2xl">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#ececec]">
                <th className="p-3 text-black">Username</th>
                <th className="p-3 text-black">Email</th>
                <th className="p-3 text-black">Role</th>
                <th className="p-3 text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b border-[#ececec] hover:bg-[#fff5f7] transition">
                  <td className="p-3 text-black">
                    {editingUserId === user._id ? (
                      <input
                        type="text"
                        value={editUsername}
                        onChange={e => setEditUsername(e.target.value)}
                        className="rounded-xl border border-[#ececec] px-2 py-1 text-black focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/20 transition w-full"
                      />
                    ) : (
                      user.username
                    )}
                  </td>
                  <td className="p-3 text-black">
                    {editingUserId === user._id ? (
                      <input
                        type="email"
                        value={editEmail}
                        onChange={e => setEditEmail(e.target.value)}
                        className="rounded-xl border border-[#ececec] px-2 py-1 text-black focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/20 transition w-full"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="p-3 text-black">{user.isOverallAdmin ? 'Overall Admin' : user.isAdmin ? 'Admin' : 'User'}</td>
                  <td className="p-3 flex gap-2">
                    {editingUserId === user._id ? (
                      <>
                        <button
                          onClick={() => saveEditUser(user._id)}
                          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold px-3 py-1 rounded-xl transition active:scale-95"
                          disabled={loadingEditId === user._id}
                        >
                          {loadingEditId === user._id ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={cancelEditUser}
                          className="bg-[#fafafa] border border-[#ececec] text-black font-bold px-3 py-1 rounded-xl transition hover:bg-[#f3f3f3]"
                          disabled={loadingEditId === user._id}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditUser(user)}
                          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold px-3 py-1 rounded-xl transition active:scale-95"
                          disabled={loadingEditId || loadingDeleteId === user._id}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="bg-black border-2 border-[#ff9900] font-bold px-3 py-1 rounded-xl transition hover:bg-[#fff7ed] active:scale-95 text-orange-500"
                          disabled={loadingDeleteId === user._id}
                        >
                          {loadingDeleteId === user._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
