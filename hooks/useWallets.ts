import { useState, useEffect } from "react";
import httpClient from "@/lib/http-client";
import { getErrorMessage } from "@/lib/api-utils";

export interface Wallet {
  _id: string;
  address: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export function useWallets() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWallets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await httpClient.get("/wallet/all");
      
      // Handle different response structures
      let walletsData: Wallet[] = [];
      if (response.data?.data) {
        walletsData = Array.isArray(response.data.data) 
          ? response.data.data 
          : [];
      } else if (response.data?.wallets) {
        walletsData = Array.isArray(response.data.wallets) 
          ? response.data.wallets 
          : [];
      } else if (Array.isArray(response.data)) {
        walletsData = response.data;
      }

      setWallets(walletsData);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error("Error fetching wallets:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  return {
    wallets,
    loading,
    error,
    refetch: fetchWallets,
  };
}



