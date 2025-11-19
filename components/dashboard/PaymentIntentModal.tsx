"use client";

import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_PUBLISHABLE_KEY } from "@/lib/stripe-config";
import { usePayments } from "@/hooks/usePayments";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface PaymentIntentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PaymentIntentModal({
  isOpen,
  onClose,
  onSuccess,
}: PaymentIntentModalProps) {
  const { createPaymentIntent } = usePayments();
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount(0);
      setDescription("");
      setClientSecret("");
    }
  }, [isOpen]);

  const handleCreateIntent = async () => {
    if (amount <= 0 || !description.trim()) {
      toast.error("Please enter amount and description");
      return;
    }

    try {
      setLoading(true);
      const response = await createPaymentIntent({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        description: description.trim(),
        metadata: {
          customerEmail: user?.email || "",
        },
      });

      setClientSecret(response.clientSecret);
    } catch (error) {
      // Error handled by toast in hook
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (!clientSecret) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Create Payment</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount (USD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Payment description"
                required
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleCreateIntent}
                disabled={loading || amount <= 0 || !description.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Continue to Payment"}
              </button>
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto">
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "night",
              variables: {
                colorPrimary: "#8b5cf6",
                colorBackground: "#1e293b",
                colorText: "#ffffff",
                colorDanger: "#ef4444",
                fontFamily: "system-ui, sans-serif",
                spacingUnit: "4px",
                borderRadius: "8px",
              },
            },
          }}
        >
          <PaymentFormContent
            amount={amount}
            description={description}
            onSuccess={() => {
              setClientSecret("");
              setAmount(0);
              setDescription("");
              onSuccess?.();
              onClose();
            }}
            onCancel={() => {
              setClientSecret("");
            }}
          />
        </Elements>
      </div>
    </div>
  );
}

function PaymentFormContent({
  amount,
  description,
  onSuccess,
  onCancel,
}: {
  amount: number;
  description: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/dashboard",
        },
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-white mb-6">Complete Payment</h2>

      <form onSubmit={handlePaymentSubmit} className="space-y-4">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <PaymentElement />
        </div>

        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">Amount</div>
          <div className="text-xl font-bold text-white">
            ${amount.toFixed(2)}
          </div>
          {description && (
            <>
              <div className="text-sm text-gray-400 mb-1 mt-2">Description</div>
              <div className="text-sm text-white">{description}</div>
            </>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={!stripe || !elements || processing}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? "Processing..." : "Pay Now"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
