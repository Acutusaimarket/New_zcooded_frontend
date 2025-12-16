import { useCallback, useEffect, useState } from "react";

import { ArrowLeft, CreditCard } from "lucide-react";
import { useNavigate } from "react-router";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { subscriptionApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

type PlanTier = "basic" | "pro";

interface PlanDetails {
  name: string;
  creditsPerBlock: number;
  pricePerBlock: number;
}

const DEFAULT_PLAN_DETAILS: Record<PlanTier, PlanDetails> = {
  basic: {
    name: "Basic",
    creditsPerBlock: 50,
    pricePerBlock: 1000,
  },
  pro: {
    name: "Pro",
    creditsPerBlock: 80,
    pricePerBlock: 1000,
  },
};

const getPlanTierFromPlanType = (planType?: string): PlanTier | "" => {
  if (!planType) return "";
  const normalizedPlanType = planType.toLowerCase();
  if (normalizedPlanType === "basic" || normalizedPlanType === "free")
    return "basic";
  if (normalizedPlanType === "pro" || normalizedPlanType === "enterprise")
    return "pro";
  return "";
};

type CreditsTopupResponse = {
  status: number;
  success: boolean;
  message: string;
  data: {
    razorpay_key_id: string;
    order_id: string;
    amount: number;
    currency: string;
    credits_to_add: number;
  };
};

const AddCreditsPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [blocks, setBlocks] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derive plan from /auth/me (plan_type or enabled_plan)
  const derivedPlanTier =
    getPlanTierFromPlanType(user?.plan_type) ||
    getPlanTierFromPlanType(user?.enabled_plan?.plan_type) ||
    getPlanTierFromPlanType(user?.enabled_plan?.name);
  const planDetailsMap: Record<PlanTier, PlanDetails> = DEFAULT_PLAN_DETAILS;

  const planDetails = derivedPlanTier ? planDetailsMap[derivedPlanTier] : null;
  const blocksNumber = parseInt(blocks) || 0;
  const totalPrice = planDetails ? blocksNumber * planDetails.pricePerBlock : 0;
  const totalCredits = planDetails
    ? blocksNumber * planDetails.creditsPerBlock
    : 0;

  const loadRazorpayScript = useCallback(async () => {
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

  const handlePay = async () => {
    if (!planDetails || !derivedPlanTier || blocksNumber <= 0) {
      return;
    }

    try {
      setError(null);
      setIsProcessing(true);

      await loadRazorpayScript();

      const payload = {
        credits_to_add: totalCredits,
        currency: "INR",
      };

      const response = await axiosPrivateInstance.post<CreditsTopupResponse>(
        subscriptionApiEndPoint.creditsTopup,
        payload
      );

      const topupData = response.data?.data;

      if (!topupData?.razorpay_key_id || !topupData?.order_id) {
        throw new Error("Topup details are missing");
      }

      const razorpay = new window.Razorpay({
        key: topupData.razorpay_key_id,
        amount: topupData.amount,
        currency: topupData.currency,
        order_id: topupData.order_id,
        name: "Zcooded",
        description: `Add ${totalCredits.toLocaleString()} credits`,
        handler: function (_response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          setIsProcessing(false);

          // Show success message
          toast.success(
            `Successfully added ${totalCredits.toLocaleString()} credits!`,
            {
              duration: 3000,
            }
          );

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.info("Payment cancelled");
          },
        },
        notes: {
          credits_to_add: totalCredits.toString(),
          plan: derivedPlanTier,
        },
        prefill: {
          // You can add user details here if available
        },
      });

      razorpay.on(
        "payment.failed",
        function (response: {
          error: {
            code: string;
            description: string;
            source: string;
            step: string;
            reason: string;
            metadata: Record<string, unknown>;
          };
        }) {
          setIsProcessing(false);
          toast.error(
            `Payment failed: ${response.error.description || "Please try again"}`
          );
        }
      );

      razorpay.open();
    } catch (err) {
      console.error("Credits topup failed", err);
      setIsProcessing(false);

      // Handle specific backend error: user must have an active subscription
      if (isAxiosError(err) && err.response?.status === 400) {
        const message =
          err.response?.data?.message ||
          "You must have an active subscription to purchase credits";
        setError(message);
        toast.error(message);
        return;
      }

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Unable to process payment. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden px-4 py-8 sm:px-6 sm:py-12 md:py-16"
      style={{
        backgroundColor: "#F8FAF7",
        fontFamily: "Alina",
      }}
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="h-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-[#00bf63]" />
            <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">
              Add <span className="text-[#00bf63]">Credits</span>
            </h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Your Plan</CardTitle>
            <CardDescription>
              Specify the number of credit blocks you want to purchase. Your
              plan is detected automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {!planDetails && (
              <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Unable to detect your plan from your account. Please ensure you
                have an active subscription.
              </div>
            )}

            {planDetails && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="blocks">Number of Blocks</Label>
                  <Input
                    id="blocks"
                    type="number"
                    min="1"
                    placeholder="Enter number of blocks"
                    value={blocks}
                    onChange={(e) => setBlocks(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    {planDetails.name}: ₹{planDetails.pricePerBlock} per block (
                    {planDetails.creditsPerBlock} credits per block)
                  </p>
                </div>

                {blocksNumber > 0 && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Plan:
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {planDetails.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Blocks:
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {blocksNumber}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Credits per Block:
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {planDetails.creditsPerBlock}
                        </span>
                      </div>
                      <div className="my-2 border-t border-gray-300"></div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Total Credits:
                        </span>
                        <span className="text-lg font-bold text-[#00bf63]">
                          {totalCredits.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-gray-900">
                          Total Price:
                        </span>
                        <span className="text-2xl font-bold text-[#00bf63]">
                          ₹{totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handlePay}
                  disabled={!planDetails || blocksNumber <= 0 || isProcessing}
                  className="w-full bg-[#00bf63] hover:bg-[#00a050] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isProcessing
                    ? "Processing..."
                    : `Pay ₹${totalPrice.toFixed(2)}`}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddCreditsPage;
