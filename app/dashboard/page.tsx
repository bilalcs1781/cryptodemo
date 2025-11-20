"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/common/Navbar";
import WalletCard from "@/components/dashboard/WalletCard";
import CryptoPricesCard from "@/components/dashboard/CryptoPricesCard";
import StripeCard from "@/components/dashboard/StripeCard";
import LoadingScreen from "@/components/common/LoadingScreen";
import Footer from "@/components/common/Footer";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const {
    wallet,
    cryptoPrices,
    cryptoLoading,
    cryptoError,
    stripeBalance,
    transactions,
    loading,
    refreshTransactions,
  } = useDashboard();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isAuthenticated, router]);

  // Show loading while checking authentication or loading dashboard data
  if (!isAuthenticated || loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />

      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <WalletCard
            address={wallet.address}
            isConnected={wallet.isConnected}
            chainId={wallet.chainId}
          />
          <StripeCard
            transactions={transactions}
            onRefresh={refreshTransactions}
          />
        </div>

        <div className="mt-6">
          <CryptoPricesCard
            prices={cryptoPrices}
            loading={cryptoLoading}
            error={cryptoError}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
