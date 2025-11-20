"use client";

import { Wallet } from "@/hooks/useWallets";
import NoData from "@/components/common/NoData";

interface WalletsTableProps {
  wallets: Wallet[];
  loading?: boolean;
}

export default function WalletsTable({
  wallets,
  loading = false,
}: WalletsTableProps) {
  const formatAddress = (address: string) => {
    if (!address) return "N/A";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-2xl font-semibold text-white">Connected Wallets</h2>
        <p className="text-gray-300 text-sm mt-1">
          Total wallets: {wallets.length}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                Wallet Address
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                User Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                Chain ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                Connected At
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {wallets.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8">
                  <NoData message="No wallets connected" />
                </td>
              </tr>
            ) : (
              wallets.map((wallet) => (
                <tr
                  key={wallet.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono text-sm">
                        {formatAddress(wallet.address)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(wallet.address)}
                        className="text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                        title="Copy full address"
                      >
                        📋
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {wallet.userEmail || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {wallet.chainId || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {wallet.createdAt
                      ? new Date(wallet.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <button
                        onClick={() => copyToClipboard(wallet.address)}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Copy wallet address"
                      >
                        Copy
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
