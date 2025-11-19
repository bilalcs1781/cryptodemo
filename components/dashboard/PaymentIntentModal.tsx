"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_PUBLISHABLE_KEY } from "@/lib/stripe-config";
import { usePayments, PaymentIntent } from "@/hooks/usePayments";
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
  const [step, setStep] = useState<"form" | "payment">("form");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [formData, setFormData] = useState<PaymentIntent>({
    amount: 0,
    currency: "usd",
    description: "",
    metadata: {
      orderId: "",
      productName: "",
      customerEmail: user?.email || "",
    },
  });

  const handleCreateIntent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.amount <= 0) {
      return;
    }

    try {
      const response = await createPaymentIntent({
        ...formData,
        amount: Math.round(formData.amount * 100), // Convert to cents
        metadata: {
          orderId: formData.metadata?.orderId || "",
          productName: formData.metadata?.productName || formData.description,
          customerEmail: formData.metadata?.customerEmail || user?.email || "",
        },
      });

      setClientSecret(response.clientSecret);
      setStep("payment");
    } catch (error) {
      // Error handled by toast in hook
    }
  };

  const handleBack = () => {
    setStep("form");
    setClientSecret("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto">
        {step === "form" ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-6">
              Create Payment Intent
            </h2>

            <form onSubmit={handleCreateIntent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
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
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Premium subscription"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.metadata?.productName || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metadata: {
                        ...formData.metadata,
                        productName: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Premium Subscription"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Order ID
                </label>
                <input
                  type="text"
                  value={formData.metadata?.orderId || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metadata: {
                        ...formData.metadata,
                        orderId: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="12345"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Customer Email
                </label>
                <input
                  type="email"
                  value={formData.metadata?.customerEmail || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metadata: {
                        ...formData.metadata,
                        customerEmail: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="customer@example.com"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  disabled={formData.amount <= 0}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Payment
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : clientSecret ? (
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
              formData={formData}
              onBack={handleBack}
              onSuccess={() => {
                setFormData({
                  amount: 0,
                  currency: "usd",
                  description: "",
                  metadata: {
                    orderId: "",
                    productName: "",
                    customerEmail: user?.email || "",
                  },
                });
                setStep("form");
                setClientSecret("");
                onSuccess?.();
                onClose();
              }}
            />
          </Elements>
        ) : null}
      </div>
    </div>
  );
}

function PaymentFormContent({
  formData,
  onBack,
  onSuccess,
}: {
  formData: PaymentIntent;
  onBack: () => void;
  onSuccess: () => void;
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
            ${formData.amount.toFixed(2)}
          </div>
          {formData.description && (
            <>
              <div className="text-sm text-gray-400 mb-1 mt-2">Description</div>
              <div className="text-sm text-white">{formData.description}</div>
            </>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={!stripe || !elements || processing}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? "Processing..." : "Pay Now"}
          </button>
          <button
            type="button"
            onClick={onBack}
            disabled={processing}
            className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
        </div>
      </form>
    </>
  );
}
