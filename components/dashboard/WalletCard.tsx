"use client";

import { useState } from "react";
import { useMetaMask } from "@/hooks/useMetaMask";

interface WalletCardProps {
  address: string | null;
  isConnected: boolean;
  chainId: string;
}

export default function WalletCard({
  address,
  isConnected,
  chainId,
}: WalletCardProps) {
  const { formatAddress, connectWallet } = useMetaMask();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      await connectWallet();
    } catch (err) {
      // Error handled by toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">Wallet Details</h2>

      {isConnected && address ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Wallet Address
            </label>
            <div className="px-4 py-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
              <span className="text-white font-mono text-sm">{address}</span>
              <button
                onClick={() => navigator.clipboard.writeText(address)}
                className="text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                title="Copy address"
              >
                📋
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Network</label>
            <div className="px-4 py-3 bg-white/5 rounded-lg border border-white/10">
              <span className="text-white">{chainId}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-semibold">
                Connected
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-300 mb-4">No wallet connected</p>
          <button
            onClick={handleConnect}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Connecting..." : "Connect MetaMask"}
          </button>
        </div>
      )}
    </div>
  );
}
