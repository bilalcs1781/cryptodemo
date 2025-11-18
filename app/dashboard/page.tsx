"use client";

import { useDashboard } from "@/hooks/useDashboard";
import DashboardNav from "@/components/dashboard/DashboardNav";
import WalletCard from "@/components/dashboard/WalletCard";
import CryptoPricesCard from "@/components/dashboard/CryptoPricesCard";
import StripeCard from "@/components/dashboard/StripeCard";
import LoadingScreen from "@/components/dashboard/LoadingScreen";

export default function DashboardPage() {
  const {
    wallet,
    cryptoPrices,
    cryptoLoading,
    cryptoError,
    stripeBalance,
    transactions,
    loading,
  } = useDashboard();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <DashboardNav />

      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <WalletCard
            address={wallet.address}
            isConnected={wallet.isConnected}
            chainId={wallet.chainId}
          />
          <StripeCard balance={stripeBalance} transactions={transactions} />
        </div>

        <div className="mt-6">
          <CryptoPricesCard
            prices={cryptoPrices}
            loading={cryptoLoading}
            error={cryptoError}
          />
        </div>
      </main>
    </div>
  );
}
