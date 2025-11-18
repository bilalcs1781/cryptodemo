"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useMetaMask } from "@/hooks/useMetaMask";

export default function DashboardNav() {
  const { address, isConnected } = useSelector(
    (state: RootState) => state.wallet
  );
  const { disconnect, formatAddress } = useMetaMask();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav className="container mx-auto px-6 py-4 border-b border-white/10">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            CryptoHub
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {isConnected && address && (
            <div className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg text-sm font-semibold">
              {formatAddress(address)}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
