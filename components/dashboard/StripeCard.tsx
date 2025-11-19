"use client";

import { useState } from "react";
import { Transaction } from "@/hooks/useDashboard";
import PaymentIntentModal from "./PaymentIntentModal";

interface StripeCardProps {
  transactions: Transaction[];
  onRefresh?: () => void;
}

export default function StripeCard({
  transactions,
  onRefresh,
}: StripeCardProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "pending":
        return "text-yellow-400";
      case "failed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "text-green-400";
      case "withdrawal":
        return "text-red-400";
      case "payment":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <>
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Payment Transactions
          </h2>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all text-sm"
          >
            Create Payment
          </button>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Recent Transactions
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No transactions found
              </div>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${getTypeColor(
                          transaction.type
                        )} bg-white/10`}
                      >
                        {transaction.type.toUpperCase()}
                      </span>
                      <span
                        className={`text-xs font-semibold ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        transaction.amount >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {transaction.amount >= 0 ? "+" : ""}$
                      {Math.abs(transaction.amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mb-1">
                    {transaction.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(transaction.date)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <PaymentIntentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => {
          onRefresh?.();
        }}
      />
    </>
  );
}
