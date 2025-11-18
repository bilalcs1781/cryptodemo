"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useMetaMask } from "@/hooks/useMetaMask";
import { useState } from "react";

export default function Navbar() {
  const { address, isConnected } = useSelector(
    (state: RootState) => state.wallet
  );
  const { connectWallet, disconnect, formatAddress } = useMetaMask();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      await connectWallet();
    } catch (err) {
      // Error is already handled by toast in useMetaMask hook
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <nav className="container mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white">
          <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            CryptoHub
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {isConnected && address ? (
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg text-sm font-semibold">
                {formatAddress(address)}
              </div>
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Connecting..." : "Connect MetaMask"}
            </button>
          )}
          <Link
            href="/login"
            className="px-4 py-2 text-white hover:text-purple-400 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
