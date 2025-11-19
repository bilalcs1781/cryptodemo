import { useState } from "react";
import httpClient from "@/lib/http-client";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/lib/api-utils";

export interface PaymentIntent {
  amount: number;
  currency: string;
  description: string;
  metadata?: {
    orderId?: string;
    productName?: string;
    customerEmail?: string;
    [key: string]: any;
  };
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  transactionId: string;
}

export interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  createdAt?: string;
  metadata?: {
    orderId?: string;
    productName?: string;
    customerEmail?: string;
    [key: string]: any;
  };
}

export function usePayments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentIntent = async (
    paymentData: PaymentIntent
  ): Promise<PaymentIntentResponse> => {
    try {
      setLoading(true);
      setError(null);

      const response = await httpClient.post("/payments/create-intent", {
        amount: paymentData.amount,
        currency: paymentData.currency || "usd",
        description: paymentData.description,
        metadata: paymentData.metadata || {},
      });

      const responseData = response.data;
      return {
        clientSecret: responseData.clientSecret || "",
        paymentIntentId: responseData.paymentIntentId || "",
        transactionId: responseData.transactionId || "",
      };
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(`Failed to create payment intent: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTransactions = async (): Promise<PaymentTransaction[]> => {
    try {
      setLoading(true);
      setError(null);

      const response = await httpClient.get("/payments/transactions");

      // Handle different response structures
      const transactionsData = Array.isArray(response.data)
        ? response.data
        : response.data.data || response.data.transactions || [];

      const formattedTransactions: PaymentTransaction[] = transactionsData.map(
        (transaction: any) => ({
          id: transaction.id || transaction._id || "",
          amount: transaction.amount || 0,
          currency: transaction.currency || "usd",
          status: transaction.status || "pending",
          description: transaction.description || "",
          createdAt:
            transaction.createdAt ||
            transaction.created_at ||
            new Date().toISOString(),
          metadata: transaction.metadata || {},
        })
      );

      return formattedTransactions;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(`Failed to fetch transactions: ${errorMessage}`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    createPaymentIntent,
    getTransactions,
    loading,
    error,
  };
}
