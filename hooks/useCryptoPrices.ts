import { useState, useEffect } from "react";
import httpClient from "@/lib/http-client";
import { AxiosError } from "axios";

export interface CryptoPrice {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  image: string;
}

const CRYPTO_IDS = [
  "bitcoin",
  "ethereum",
  "binancecoin",
  "cardano",
  "solana",
  "polkadot",
];

// Hardcoded crypto names mapping
const getCryptoName = (id: string, symbol: string): string => {
  const normalizedId = id?.toLowerCase() || "";
  const normalizedSymbol = symbol?.toLowerCase() || "";

  // Check by ID first
  if (normalizedId.includes("bitcoin") || normalizedSymbol === "btc") {
    return "Bitcoin";
  }
  if (normalizedId.includes("ethereum") || normalizedSymbol === "eth") {
    return "Ethereum";
  }
  if (normalizedId.includes("binance") || normalizedSymbol === "bnb") {
    return "Binance Coin";
  }
  if (normalizedId.includes("cardano") || normalizedSymbol === "ada") {
    return "Cardano";
  }
  if (normalizedId.includes("solana") || normalizedSymbol === "sol") {
    return "Solana";
  }
  if (normalizedId.includes("polkadot") || normalizedSymbol === "dot") {
    return "Polkadot";
  }

  // Fallback: capitalize first letter of symbol
  return symbol
    ? symbol.charAt(0).toUpperCase() + symbol.slice(1).toLowerCase()
    : "Unknown";
};

export function useCryptoPrices() {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch prices for all coins - backend endpoint accepts comma-separated coinIds
        const coinIdsParam = CRYPTO_IDS.join(",");
        const { data } = await httpClient.get("/crypto/prices", {
          params: {
            coinIds: coinIdsParam,
            currency: "usd",
          },
        });

        // Handle different response structures from backend
        // The response might be an array or an object with a data property
        const pricesData = Array.isArray(data)
          ? data
          : data.data || data.prices || [];

        // Map backend response to our CryptoPrice interface
        const formattedPrices: CryptoPrice[] = pricesData.map((crypto: any) => {
          const id =
            crypto.id || crypto.coinId || crypto.symbol?.toLowerCase() || "";
          const symbol = (crypto.symbol || crypto.coinId || "").toUpperCase();

          return {
            id,
            name: crypto.name || crypto.coinName || getCryptoName(id, symbol),
            symbol,
            price: crypto.price || crypto.currentPrice || crypto.usd || 0,
            change24h:
              crypto.change24h ||
              crypto.priceChange24h ||
              crypto.change_24h ||
              0,
            image: crypto.image || crypto.logo || "",
          };
        });

        setCryptoPrices(formattedPrices);
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(
            err.response?.data?.error?.message ||
              err.response?.data?.message ||
              err.message ||
              "Failed to fetch cryptocurrency prices"
          );
        } else {
          setError(err instanceof Error ? err.message : "An error occurred");
        }
        console.error("Error fetching crypto prices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();

    const interval = setInterval(fetchPrices, 60000);

    return () => clearInterval(interval);
  }, []);

  return { cryptoPrices, loading, error };
}
