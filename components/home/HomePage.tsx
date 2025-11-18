"use client";

import Link from "next/link";
import { useCryptoPrices } from "@/hooks/useCryptoPrices";

export default function HomePage() {
  const { cryptoPrices, loading, error } = useCryptoPrices();

  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return `$${price.toFixed(6)}`;
    } else if (price < 1) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-white">
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              CryptoHub
            </span>
          </div>
          <div className="flex gap-4">
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

      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              CryptoHub
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
            Your gateway to the world of cryptocurrency. Track prices, manage
            your wallet, and stay ahead of the market.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link
              href="/signup"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg text-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
            >
              Sign In
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Live Prices
              </h3>
              <p className="text-gray-300">
                Real-time cryptocurrency prices from top exchanges
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Secure Wallet
              </h3>
              <p className="text-gray-300">
                Connect your MetaMask wallet securely
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Easy Payments
              </h3>
              <p className="text-gray-300">
                Seamless payment integration with Stripe
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              Live Cryptocurrency Prices
            </h2>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-300">Loading prices...</div>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center py-12">
                <div className="text-red-300">Error: {error}</div>
              </div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cryptoPrices.map((crypto) => (
                  <div
                    key={crypto.id}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">
                          {crypto.name}
                        </h3>
                        <p className="text-gray-400 text-sm">{crypto.symbol}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-2xl font-bold text-white mb-2">
                        {formatPrice(crypto.price)}
                      </div>
                      <div
                        className={`text-sm font-semibold ${
                          crypto.change24h >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {crypto.change24h >= 0 ? "+" : ""}
                        {crypto.change24h.toFixed(2)}% (24h)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 text-center text-gray-400 text-sm">
              <p>Prices update every 60 seconds • Data provided by CoinGecko</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-6 py-8 mt-20 border-t border-white/10">
        <div className="text-center text-gray-400">
          <p>&copy; 2024 CryptoHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
