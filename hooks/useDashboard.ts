import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useCryptoPrices } from "./useCryptoPrices";

export interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "payment";
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  description: string;
}

export function useDashboard() {
  const { address, isConnected, chainId } = useSelector(
    (state: RootState) => state.wallet
  );
  const { cryptoPrices, loading: cryptoLoading, error: cryptoError } =
    useCryptoPrices();
  const [stripeBalance, setStripeBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);

      const dummyBalance = 1250.75;
      const dummyTransactions: Transaction[] = [
        {
          id: "1",
          type: "deposit",
          amount: 500.0,
          status: "completed",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          description: "Initial deposit",
        },
        {
          id: "2",
          type: "payment",
          amount: -150.25,
          status: "completed",
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          description: "Payment for services",
        },
        {
          id: "3",
          type: "deposit",
          amount: 1000.0,
          status: "completed",
          date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          description: "Top-up deposit",
        },
        {
          id: "4",
          type: "withdrawal",
          amount: -200.0,
          status: "pending",
          date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          description: "Withdrawal request",
        },
        {
          id: "5",
          type: "payment",
          amount: -99.0,
          status: "completed",
          date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          description: "Subscription payment",
        },
      ];

      setStripeBalance(dummyBalance);
      setTransactions(dummyTransactions);
      setLoading(false);
    };

    loadDashboardData();
  }, []);

  const formatChainId = (chainId: string | null) => {
    if (!chainId) return "N/A";
    const chainIdNum = parseInt(chainId, 16);
    const chainNames: { [key: number]: string } = {
      1: "Ethereum Mainnet",
      5: "Goerli Testnet",
      11155111: "Sepolia Testnet",
      137: "Polygon",
      56: "BSC",
    };
    return chainNames[chainIdNum] || `Chain ID: ${chainIdNum}`;
  };

  return {
    wallet: {
      address,
      isConnected,
      chainId: formatChainId(chainId),
    },
    cryptoPrices,
    cryptoLoading,
    cryptoError,
    stripeBalance,
    transactions,
    loading,
  };
}

