"use client";

import { CryptoPrice } from "@/hooks/useCryptoPrices";
import CryptoIcon from "@/components/common/CryptoIcon";

interface CryptoPricesCardProps {
  prices: CryptoPrice[];
  loading: boolean;
  error: string | null;
}

export default function CryptoPricesCard({
  prices,
  loading,
  error,
}: CryptoPricesCardProps) {
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
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prices.slice(0, 6).map((crypto) => (
            <div
              key={crypto.id}
              className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <CryptoIcon symbol={crypto.symbol} id={crypto.id} className="w-12 h-12" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-lg mb-1 truncate">{crypto.name}</h3>
                  <p className="text-gray-400 text-sm font-medium">{crypto.symbol}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xl font-bold text-white mb-2">
                  {formatPrice(crypto.price)}
                </div>
                <div
                  className={`text-sm font-semibold ${
                    crypto.change24h >= 0 ? "text-green-400" : "text-red-400"
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
    </div>
  );
}

