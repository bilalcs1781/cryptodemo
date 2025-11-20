"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminPanel } from "@/hooks/useAdminPanel";
import { useWallets } from "@/hooks/useWallets";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/common/Navbar";
import AdminTable from "@/components/admin/AdminTable";
import WalletsTable from "@/components/admin/WalletsTable";
import EditUserModal from "@/components/admin/EditUserModal";
import DeleteUserModal from "@/components/admin/DeleteUserModal";
import Footer from "@/components/common/Footer";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function AdminPanel() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const {
    users,
    editingUser,
    showEditModal,
    deletingUser,
    showDeleteModal,
    loading,
    error,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
    updateEditingUser,
  } = useAdminPanel();

  const { wallets, loading: walletsLoading, error: walletsError, refetch: refetchWallets } = useWallets();

  useEffect(() => {
    // Check if user is authenticated and has admin role
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user && user.role !== "admin") {
      router.push("/dashboard");
      return;
    }
  }, [isAuthenticated, user, router]);

  // Show loading while checking authentication
  if (!isAuthenticated || (user && user.role !== "admin")) {
    return <LoadingScreen />;
  }

  if (loading) {
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

        {walletsError && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
            Wallets Error: {walletsError}
          </div>
        )}

        <div className="mb-8">
          <AdminTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>

        <div>
          <WalletsTable
            wallets={wallets}
            loading={walletsLoading}
          />
        </div>
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

      {showDeleteModal && deletingUser && (
        <DeleteUserModal
          user={deletingUser}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          loading={loading}
        />
      )}

      <Footer />
    </div>
  );
}
