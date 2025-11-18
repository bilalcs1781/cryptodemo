import { useState, useEffect } from "react";

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

export function useCryptoPrices() {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${CRYPTO_IDS.join(
            ","
          )}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cryptocurrency prices");
        }

        const data = await response.json();

        const formattedPrices: CryptoPrice[] = data.map((crypto: any) => ({
          id: crypto.id,
          name: crypto.name,
          symbol: crypto.symbol.toUpperCase(),
          price: crypto.current_price,
          change24h: crypto.price_change_percentage_24h || 0,
          image: crypto.image,
        }));

        setCryptoPrices(formattedPrices);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
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
