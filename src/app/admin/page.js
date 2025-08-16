"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AdminPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'content'

  useEffect(() => {
    fetchUsers();
    fetchContent();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    setUsers(data.users || []);
  };

  const fetchContent = async () => {
    const res = await fetch('/api/admin/content');
    const data = await res.json();
    setContent(data);
  };

  const handleDeleteUser = async (id) => {
    await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  const handleUpdateUserRole = async (id, newRole) => {
    await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role: newRole }),
    });
    fetchUsers();
  };

  const handleEditUser = async (user) => {
    const newName = prompt('Enter new name:', user.name);
    const newMiddleName = prompt('Enter new middle name:', user.middleName);
    const newSurname = prompt('Enter new surname:', user.surname);
    const newSuffix = prompt('Enter new suffix:', user.suffix);
    const newEmail = prompt('Enter new email:', user.email);

    if (newName !== null && newMiddleName !== null && newSurname !== null && newSuffix !== null && newEmail !== null) {
      await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user._id,
          name: newName,
          middleName: newMiddleName,
          surname: newSurname,
          suffix: newSuffix,
          email: newEmail,
        }),
      });
      fetchUsers();
    }
  };

  const handleDeleteContent = async (id) => {
    await fetch(`/api/admin/content?id=${id}`, { method: 'DELETE' });
    fetchContent();
  };

  const handleUpdateContent = async (id, currentTitle, currentDescription) => {
    const newTitle = prompt('Enter new title:', currentTitle);
    const newDescription = prompt('Enter new description:', currentDescription);
    if (newTitle !== null && newDescription !== null) {
      await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title: newTitle, description: newDescription }),
      });
      fetchContent();
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 mr-2 rounded ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          User Management
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 rounded ${activeTab === 'content' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Content Management
        </button>
      </div>

      {activeTab === 'users' && (
        <div>
          <h2 className="mb-4 text-2xl font-semibold">User Management</h2>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">Email</th>
                <th className="px-4 py-2 border-b">Role</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-2 border-b">{user._id}</td>
                  <td className="px-4 py-2 border-b">{user.email}</td>
                  <td className="px-4 py-2 border-b">{user.role}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="px-3 py-1 mr-2 text-white bg-red-500 rounded"
                    >
                      Delete
                    </button>
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}
                      className="px-3 py-1 mr-2 text-black border border-gray-300 rounded"
                    >
                      <option value="admin">Admin</option>
                      <option value="teacher">Teacher</option>
                      <option value="student">Student</option>
                    </select>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="px-3 py-1 text-white bg-blue-500 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'content' && (
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Content Management</h2>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">Title</th>
                <th className="px-4 py-2 border-b">Description</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {content.map((item) => (
                <tr key={item._id}>
                  <td className="px-4 py-2 border-b">{item._id}</td>
                  <td className="px-4 py-2 border-b">{item.title}</td>
                  <td className="px-4 py-2 border-b">{item.description}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => handleDeleteContent(item._id)}
                      className="px-3 py-1 mr-2 text-white bg-red-500 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleUpdateContent(item._id, item.title, item.description)}
                      className="px-3 py-1 text-white bg-green-500 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;