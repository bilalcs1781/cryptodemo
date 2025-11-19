import { useState, useEffect } from "react";
import httpClient from "@/lib/http-client";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/lib/api-utils";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
  age?: number;
  address?: string;
}

export function useAdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await httpClient.get("/users");

      // Handle different response structures
      const usersData = Array.isArray(response.data)
        ? response.data
        : response.data.data || response.data.users || [];

      const formattedUsers: User[] = usersData.map((user: any) => ({
        id: user.id || user._id || "",
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
        createdAt:
          user.createdAt || user.created_at || new Date().toISOString(),
        age: user.age,
        address: user.address,
      }));

      setUsers(formattedUsers);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(`Failed to fetch users: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      setLoading(true);
      const response = await httpClient.patch(`/users/${editingUser.id}`, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        ...(editingUser.age && { age: editingUser.age }),
        ...(editingUser.address && { address: editingUser.address }),
      });

      // Update local state
      const updatedUser =
        response.data.data || response.data.user || response.data;
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                name: updatedUser.name || editingUser.name,
                email: updatedUser.email || editingUser.email,
                role: updatedUser.role || editingUser.role,
                age: updatedUser.age || editingUser.age,
                address: updatedUser.address || editingUser.address,
              }
            : user
        )
      );

      setShowEditModal(false);
      setEditingUser(null);
      toast.success("User updated successfully!");
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(`Failed to update user: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      try {
        setLoading(true);
        await httpClient.delete(`/users/${id}`);

        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        setDeleteConfirm(null);
        toast.success("User deleted successfully!");
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        toast.error(`Failed to delete user: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
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
    loading,
    error,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
    updateEditingUser,
    refetchUsers: fetchUsers,
  };
}
