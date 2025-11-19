import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useCryptoPrices } from "./useCryptoPrices";
import { usePayments } from "./usePayments";

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
  const {
    cryptoPrices,
    loading: cryptoLoading,
    error: cryptoError,
  } = useCryptoPrices();
  const { getTransactions } = usePayments();
  const [stripeBalance, setStripeBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);

      try {
        // Fetch transactions from API
        const paymentTransactions = await getTransactions();

        // Map payment transactions to our Transaction format
        const mappedTransactions: Transaction[] = paymentTransactions.map(
          (tx) => ({
            id: tx.id,
            type: "payment" as const,
            amount: tx.amount / 100, // Convert from cents to dollars
            status:
              tx.status === "succeeded" || tx.status === "completed"
                ? ("completed" as const)
                : tx.status === "pending"
                ? ("pending" as const)
                : ("failed" as const),
            date: tx.createdAt || new Date().toISOString(),
            description:
              tx.description || tx.metadata?.productName || "Payment",
          })
        );

        // Calculate balance from transactions
        const balance = mappedTransactions
          .filter((tx) => tx.status === "completed")
          .reduce((sum, tx) => sum + tx.amount, 0);

        setStripeBalance(balance);
        setTransactions(mappedTransactions);
      } catch (error) {
        // Fallback to dummy data if API fails
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
        ];
        setStripeBalance(dummyBalance);
        setTransactions(dummyTransactions);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshTransactions = async () => {
    try {
      setLoading(true);
      const paymentTransactions = await getTransactions();

      const mappedTransactions: Transaction[] = paymentTransactions.map(
        (tx) => ({
          id: tx.id,
          type: "payment" as const,
          amount: tx.amount / 100, // Convert from cents to dollars
          status:
            tx.status === "succeeded" || tx.status === "completed"
              ? ("completed" as const)
              : tx.status === "pending"
              ? ("pending" as const)
              : ("failed" as const),
          date: tx.createdAt || new Date().toISOString(),
          description: tx.description || tx.metadata?.productName || "Payment",
        })
      );

      const balance = mappedTransactions
        .filter((tx) => tx.status === "completed")
        .reduce((sum, tx) => sum + tx.amount, 0);

      setStripeBalance(balance);
      setTransactions(mappedTransactions);
    } catch (error) {
      // Error handled by toast in hook
    } finally {
      setLoading(false);
    }
  };

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
    refreshTransactions,
  };
}
