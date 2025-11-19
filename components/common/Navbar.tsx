"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useMetaMask } from "@/hooks/useMetaMask";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function Navbar() {
  const { address, isConnected } = useSelector(
    (state: RootState) => state.wallet
  );
  const { connectWallet, disconnect, formatAddress } = useMetaMask();
  const { isAuthenticated, user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleDisconnect = () => {
    disconnect();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="container mx-auto px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl sm:text-2xl font-bold text-white">
          <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            CryptoHub
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {isConnected && address ? (
            <div className="flex items-center gap-3">
              <div className="px-3 py-2 bg-green-500/20 text-green-300 rounded-lg text-sm font-semibold">
                {formatAddress(address)}
              </div>
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 cursor-pointer transition-colors text-sm"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={loading}
              className="px-4 py-2 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? "Connecting..." : "Connect MetaMask"}
            </button>
          )}
          {isAuthenticated ? (
            <>
              {user && user.role === "admin" && (
                <Link
                  href="/admin"
                  className="px-4 py-2 text-white hover:text-purple-400 transition-colors text-sm sm:text-base"
                >
                  Admin Panel
                </Link>
              )}
              <Link
                href="/dashboard"
                className="px-4 py-2 text-white hover:text-purple-400 transition-colors text-sm sm:text-base"
              >
                Dashboard
              </Link>
              {user && (
                <div className="px-3 py-2 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-semibold">
                  {user.name || user.email}
                </div>
              )}
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 cursor-pointer transition-colors text-sm sm:text-base"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-white hover:text-purple-400 transition-colors text-sm sm:text-base"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg text-sm sm:text-base"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          onClick={toggleMobileMenu}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              mobileMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              mobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pb-4 border-t border-white/10 pt-4">
          <div className="flex flex-col gap-4">
            {isConnected && address ? (
              <>
                <div className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg text-sm font-semibold text-center">
                  {formatAddress(address)}
                </div>
                <button
                  onClick={handleDisconnect}
                  className="w-full px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 cursor-pointer transition-colors text-sm"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={handleConnect}
                disabled={loading}
                className="w-full px-4 py-2 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? "Connecting..." : "Connect MetaMask"}
              </button>
            )}
            {isAuthenticated ? (
              <>
                {user && user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-white hover:text-purple-400 transition-colors text-center"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-white hover:text-purple-400 transition-colors text-center"
                >
                  Dashboard
                </Link>
                {user && (
                  <div className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-semibold text-center">
                    {user.name || user.email}
                  </div>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 cursor-pointer transition-colors text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-white hover:text-purple-400 transition-colors text-center"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
