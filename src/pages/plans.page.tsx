import React from "react";

import { Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

import { useSubscriptionDetailsQuery } from "@/api/query/use-subscription-details.query";
import { Button } from "@/components/ui/button";

const PlansPage = () => {
  const navigate = useNavigate();
  const { data: subscriptionData, isLoading, error } = useSubscriptionDetailsQuery();

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
              // Get USD pricing
              const usdPricing = plan.pricing.find(
                (p) => p.currency === "USD"
              );
              const monthly_usd = usdPricing?.monthly || 0;

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
                          {monthly_usd === 0
                            ? "Custom"
                            : `$${monthly_usd}`}
                        </span>
                        {monthly_usd > 0 && (
                          <span className="text-sm text-gray-500">/mo*</span>
                        )}
                      </div>
                      {monthly_usd > 0 && (
                        <div className="text-sm text-gray-600">
                          <span className="line-through">
                            ${Math.round(monthly_usd * 1.2)}
                          </span>{" "}
                          <span className="text-green-600">
                            Save ${Math.round(monthly_usd * 0.2 * 12)}/year
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
                    onClick={() => {
                      if (plan.plan_type === "enterprise") {
                        scrollToForm();
                      } else {
                        navigate(`/signup?plan_id=${plan._id}`);
                      }
                    }}
                    className={`group w-full ${
                      isPopular
                        ? "bg-[#42BD00] text-white hover:bg-[#369900]"
                        : "border-2 border-[#42BD00] bg-white text-[#42BD00] hover:bg-[#42BD0010]"
                    }`}
                  >
                    {plan.plan_type === "enterprise" ? "Contact Sale" : "Purchase"}
                    {plan.plan_type !== "enterprise" && (
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

