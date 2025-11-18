import { useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

const DUMMY_USERS: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@cryptohub.com",
    role: "admin",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "user",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "user",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    name: "Alice Williams",
    email: "alice.williams@example.com",
    role: "user",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: "user",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function useAdminPanel() {
  const [users, setUsers] = useState<User[]>(DUMMY_USERS);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleEdit = (user: User) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              name: editingUser.name,
              email: editingUser.email,
              role: editingUser.role,
            }
          : user
      )
    );

    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
    }
  };

  const updateEditingUser = (updates: Partial<User>) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, ...updates });
    }
  };

  return {
    users,
    editingUser,
    showEditModal,
    deleteConfirm,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
    updateEditingUser,
  };
}
