"use client";

import { useAdminPanel } from "@/hooks/useAdminPanel";
import Navbar from "@/components/common/Navbar";
import AdminTable from "@/components/admin/AdminTable";
import EditUserModal from "@/components/admin/EditUserModal";
import Footer from "@/components/common/Footer";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function AdminPanel() {
  const {
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
  } = useAdminPanel();

  if (loading && users.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />

      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-300">Manage users and system settings</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
            Error: {error}
          </div>
        )}

        <AdminTable
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          deleteConfirm={deleteConfirm}
          loading={loading}
        />
      </main>

      {showEditModal && editingUser && (
        <EditUserModal
          user={editingUser}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          onUpdate={updateEditingUser}
          loading={loading}
        />
      )}

      <Footer />
    </div>
  );
}
