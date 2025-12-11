import { useState } from "react";

import { ArrowLeft, CreditCard } from "lucide-react";
import { useNavigate } from "react-router";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PlanTier = "basic" | "pro";

interface PlanDetails {
  name: string;
  creditsPerBlock: number;
  pricePerBlock: number;
}

const PLAN_DETAILS: Record<PlanTier, PlanDetails> = {
  basic: {
    name: "Basic Tier",
    creditsPerBlock: 50,
    pricePerBlock: 10,
  },
  pro: {
    name: "Pro Tier",
    creditsPerBlock: 80,
    pricePerBlock: 10,
  },
};

const AddCreditsPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<PlanTier | "">("");
  const [blocks, setBlocks] = useState<string>("");

  const planDetails = selectedPlan ? PLAN_DETAILS[selectedPlan] : null;
  const blocksNumber = parseInt(blocks) || 0;
  const totalPrice = planDetails
    ? blocksNumber * planDetails.pricePerBlock
    : 0;
  const totalCredits = planDetails
    ? blocksNumber * planDetails.creditsPerBlock
    : 0;

  const handlePay = () => {
    if (!selectedPlan || blocksNumber <= 0) {
      return;
    }
    // TODO: Implement payment processing
    console.log("Payment processing:", {
      plan: selectedPlan,
      blocks: blocksNumber,
      totalPrice,
      totalCredits,
    });
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
            <CreditCard className="h-6 w-6 text-[#42BD00]" />
            <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">
              Add <span className="text-[#42BD00]">Credits</span>
            </h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Your Plan</CardTitle>
            <CardDescription>
              Choose your plan and specify the number of credit blocks you want
              to purchase.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="plan-select">Select Plan</Label>
              <Select
                value={selectedPlan}
                onValueChange={(value) => setSelectedPlan(value as PlanTier)}
              >
                <SelectTrigger id="plan-select">
                  <SelectValue placeholder="Select your plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">
                    Basic Tier - $10 per 50 additional credit block (1 Block =
                    50 credits)
                  </SelectItem>
                  <SelectItem value="pro">
                    Pro Tier - $10 per 80 additional credit block (1 Block = 80
                    credits)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedPlan && (
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
                    {planDetails?.name}: ${planDetails?.pricePerBlock} per block
                    ({planDetails?.creditsPerBlock} credits per block)
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
                          {planDetails?.name}
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
                          {planDetails?.creditsPerBlock}
                        </span>
                      </div>
                      <div className="my-2 border-t border-gray-300"></div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Total Credits:
                        </span>
                        <span className="text-lg font-bold text-[#42BD00]">
                          {totalCredits.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-gray-900">
                          Total Price:
                        </span>
                        <span className="text-2xl font-bold text-[#42BD00]">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handlePay}
                  disabled={!selectedPlan || blocksNumber <= 0}
                  className="w-full bg-[#42BD00] hover:bg-[#369900] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Pay ${totalPrice.toFixed(2)}
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

