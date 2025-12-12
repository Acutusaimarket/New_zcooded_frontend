import React from "react";

import { Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { useSubscriptionDetailsQuery } from "@/api/query/use-subscription-details.query";
import { axiosPrivateInstance } from "@/lib/axios";
import { subscriptionApiEndPoint } from "@/lib/api-end-point";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PlansPage = () => {
  const navigate = useNavigate();
  const { data: subscriptionData, isLoading, error } = useSubscriptionDetailsQuery();
  const [isProcessingPlanId, setIsProcessingPlanId] = React.useState<string | null>(null);
  const [checkoutError, setCheckoutError] = React.useState<string | null>(null);

  type CheckoutResponse = {
    status: number;
    success: boolean;
    message: string;
    data: {
      razorpay_key_id: string;
      subscription_id: string;
      customer_id: string;
      plan_id: string;
      amount: number;
      currency: string;
      billing_cycle: string;
    };
  };

  const loadRazorpayScript = React.useCallback(async () => {
    if (typeof window === "undefined") {
      throw new Error("Window is not available");
    }

    if (window.Razorpay) return;

    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
      document.body.appendChild(script);
    });
  }, []);

  const handlePurchase = async (plan: (typeof subscriptionData.data)[number]) => {
    if (plan.plan_type === "enterprise") {
      scrollToForm();
      return;
    }

    try {
      setCheckoutError(null);
      setIsProcessingPlanId(plan._id);

      await loadRazorpayScript();

      const preferredPricing =
        plan.pricing.find((p) => p.currency === "INR") ?? plan.pricing[0];
      const billingCycle = "monthly";
      const payload = {
        plan_id: plan._id,
        billing_cycle: billingCycle,
        currency: preferredPricing?.currency ?? "INR",
      };

      const response = await axiosPrivateInstance.post<CheckoutResponse>(
        subscriptionApiEndPoint.checkout,
        payload
      );

      const checkoutData = response.data?.data;

      if (!checkoutData?.razorpay_key_id || !checkoutData?.subscription_id) {
        throw new Error("Checkout details are missing");
      }

      const razorpay = new window.Razorpay({
        key: checkoutData.razorpay_key_id,
        subscription_id: checkoutData.subscription_id,
        name: "Zcooded",
        description: `${plan.name} plan`,
        currency: checkoutData.currency ?? payload.currency,
        handler: function (response: {
          razorpay_payment_id: string;
          razorpay_subscription_id: string;
          razorpay_signature: string;
        }) {
          // Prevent any default behavior or page refresh
          setIsProcessingPlanId(null);
          
          // Show success message
          toast.success("Payment successful! Redirecting to dashboard...", {
            duration: 3000,
          });
          
          // Redirect after a short delay to show the success message
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPlanId(null);
            toast.info("Payment cancelled");
          },
        },
        notes: {
          plan_id: plan._id,
          billing_cycle: payload.billing_cycle,
        },
        prefill: {
          // You can add user details here if available
        },
      });

      razorpay.on("payment.failed", function (response: {
        error: {
          code: string;
          description: string;
          source: string;
          step: string;
          reason: string;
          metadata: Record<string, unknown>;
        };
      }) {
        setIsProcessingPlanId(null);
        toast.error(
          `Payment failed: ${response.error.description || "Please try again"}`
        );
      });

      razorpay.open();
    } catch (err) {
      console.error("Checkout failed", err);
      setCheckoutError(
        err instanceof Error
          ? err.message
          : "Unable to start checkout. Please try again."
      );
    } finally {
      setIsProcessingPlanId(null);
    }
  };

  const scrollToForm = () => {
    navigate("/");
    setTimeout(() => {
      const formSection = document.getElementById("ready-to-launch");
      if (formSection) {
        formSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:py-24"
      style={{
        backgroundColor: "#F8FAF7",
        fontFamily: "Alina",
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center sm:mb-16">
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
            Choose Your <span className="text-[#42BD00]">Plan</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-700 sm:text-lg md:text-xl">
            Select the perfect plan for your needs. All plans include our core features with varying limits and capabilities.
          </p>
        </div>

        {checkoutError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {checkoutError}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#42BD00] border-r-transparent"></div>
              <p className="text-gray-600">Loading plans...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600">
                Failed to load plans. Please try again later.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {subscriptionData?.data
              ?.filter(
                (plan) =>
                  plan.name.toLowerCase() !== "freemium" &&
                  plan.plan_type !== "free"
              )
              ?.map((plan, index) => {
              // Prefer INR pricing for display
              const inrPricing = plan.pricing.find(
                (p) => p.currency === "INR"
              );
              const monthly_inr = inrPricing?.monthly || 0;

              // Determine if this is the popular plan (Pro plan)
              const isPopular = plan.plan_type === "pro";

              // Get description and greatFor based on plan type
              const getDescription = () => {
                switch (plan.plan_type) {
                  case "free":
                    return "Perfect for getting started";
                  case "basic":
                    return "Unlock Pro Features to transform your brands";
                  case "pro":
                    return "Unleash your marketing team's potential";
                  case "enterprise":
                    return "Our most comprehensive AI solution";
                  default:
                    return "";
                }
              };

              const getGreatFor = () => {
                switch (plan.plan_type) {
                  case "free":
                    return "Small businesses";
                  case "basic":
                    return "Mid-sized businesses";
                  case "pro":
                    return "High-volume ad teams";
                  case "enterprise":
                    return "Agencies";
                  default:
                    return "";
                }
              };

              return (
                <div
                  key={index}
                  className={`relative rounded-2xl border-2 bg-white p-6 shadow-lg transition-all hover:shadow-xl ${
                    isPopular
                      ? "border-[#42BD00] ring-2 ring-[#42BD0033]"
                      : "border-gray-200"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-[#42BD00] px-4 py-1 text-xs font-semibold text-white">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="mb-2 text-2xl font-bold text-gray-900">
                      {plan.name}
                    </h3>
                    <p className="mb-3 text-sm text-gray-600">
                      {getDescription()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Great for: {getGreatFor()}
                    </p>
                  </div>

                  {plan.plan_type !== "free" && (
                    <div className="mb-6 space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">
                          {monthly_inr === 0
                            ? "Custom"
                            : `₹${monthly_inr}`}
                        </span>
                        {monthly_inr > 0 && (
                          <span className="text-sm text-gray-500">/mo*</span>
                        )}
                      </div>
                      {monthly_inr > 0 && (
                        <div className="text-sm text-gray-600">
                          <span className="line-through">
                            ₹{Math.round(monthly_inr * 1.2)}
                          </span>{" "}
                          <span className="text-green-600">
                            Save ₹{Math.round(monthly_inr * 0.2 * 12)}/year
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mb-6 space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <span className="text-sm font-medium text-gray-700">
                        Credits
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {plan.credits === 999999
                          ? "Tailored Your Need"
                          : plan.credits.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <span className="text-sm font-medium text-gray-700">
                        Max Users
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {plan.max_users === 999999
                          ? "Tailored Your Need"
                          : plan.max_users}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6 space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900">
                      Features:
                    </h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#42BD00]" />
                          <span className="text-xs text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => handlePurchase(plan)}
                    disabled={isProcessingPlanId === plan._id}
                    className={`group w-full ${
                      isPopular
                        ? "bg-[#42BD00] text-white hover:bg-[#369900]"
                        : "border-2 border-[#42BD00] bg-white text-[#42BD00] hover:bg-[#42BD0010]"
                    }`}
                  >
                    {isProcessingPlanId === plan._id
                      ? "Processing..."
                      : plan.plan_type === "enterprise"
                        ? "Contact Sale"
                        : "Purchase"}
                    {plan.plan_type !== "enterprise" && isProcessingPlanId !== plan._id && (
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlansPage;

