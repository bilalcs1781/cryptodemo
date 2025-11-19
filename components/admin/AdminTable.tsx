"use client";

import { User } from "@/hooks/useAdminPanel";
import NoData from "@/components/common/NoData";

interface AdminTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  deleteConfirm: string | null;
  loading?: boolean;
}

export default function AdminTable({
  users,
  onEdit,
  onDelete,
  deleteConfirm,
  loading = false,
}: AdminTableProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-2xl font-semibold text-white">Users Management</h2>
        <p className="text-gray-300 text-sm mt-1">
          Total users: {users.length}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                Role
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                Created At
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8">
                  <NoData message="No users found" />
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-white">{user.name}</td>
                  <td className="px-6 py-4 text-gray-300">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-blue-500/20 text-blue-300"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(user)}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(user.id)}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                          deleteConfirm === user.id
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                        }`}
                      >
                        {deleteConfirm === user.id ? "Confirm" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
