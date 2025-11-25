"use client";

import { User } from "@/hooks/useAdminPanel";

interface DeleteUserModalProps {
  user: User;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteUserModal({
  user,
  onConfirm,
  onCancel,
  loading = false,
}: DeleteUserModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-500/20 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Delete User
        </h2>

        <p className="text-gray-300 mb-6 text-center">
          Are you sure you want to delete the user{" "}
          <span className="font-semibold text-white">{user.email}</span>? This
          action cannot be undone.
        </p>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Deleting..." : "Delete User"}
          </button>
        </div>
      </div>
    </div>
  );
}
