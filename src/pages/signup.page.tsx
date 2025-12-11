import React, { useState } from "react";

import axios from "axios";
import { ArrowRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";

import { Checkbox } from "@/components/ui/checkbox";
import { authApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

const SignupPage = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("plan_id");
  const [formData, setFormData] = useState({
    email: "",
    phone: "+91",
    full_name: "",
    organization_name: "",
  });
  const [acceptPrivacyPolicy, setAcceptPrivacyPolicy] = useState(false);
  const [acceptTermsAndConditions, setAcceptTermsAndConditions] =
    useState(false);
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!planId) {
      setResult("Plan ID is missing. Please select a plan first.");
      return;
    }

    setIsSubmitting(true);
    setResult("Sending....");

    try {
      const response = await axiosPrivateInstance.post(
        authApiEndPoint.wishlist,
        {
          email: formData.email,
          phone_no: formData.phone,
          plan_id: planId,
          full_name: formData.full_name,
          ...(formData.organization_name && {
            organization_name: formData.organization_name,
          }),
        }
      );

      if (response.data.success) {
        setResult("success");
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } else {
        setResult(
          typeof response.data.message === "string" &&
            response.data.message.trim()
            ? response.data.message
            : "Failed to submit form"
        );
      }
    } catch (error: unknown) {
      console.error("Error:", error);
      if (axios.isAxiosError(error)) {
        setResult(
          error.response?.data?.message ||
            error.response?.data?.detail ||
            "An error occurred. Please try again."
        );
      } else {
        setResult("An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:py-24"
      style={{
        backgroundColor: "#F8FAF7",
        fontFamily: "Alina",
      }}
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center sm:mb-12">
          <h1 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
            Get Started with <span className="text-[#42BD00]">ZCoded</span>
          </h1>
          <p className="px-2 text-sm leading-relaxed text-gray-700 sm:px-0 sm:text-base md:text-lg">
            Fill out the form below to get started with your plan
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12"
          style={{ backgroundColor: "#1a362a" }}
        >
          <div className="mb-4 space-y-4 sm:mb-6">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white sm:mb-2 sm:text-sm">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-[#42BD00] focus:outline-none sm:px-4 sm:py-3 sm:text-base"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white sm:mb-2 sm:text-sm">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-[#42BD00] focus:outline-none sm:px-4 sm:py-3 sm:text-base"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white sm:mb-2 sm:text-sm">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-[#42BD00] focus:outline-none sm:px-4 sm:py-3 sm:text-base"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white sm:mb-2 sm:text-sm">
                Organization Name <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="text"
                name="organization_name"
                value={formData.organization_name}
                onChange={handleChange}
                placeholder="Acutusai"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-[#42BD00] focus:outline-none sm:px-4 sm:py-3 sm:text-base"
              />
            </div>
          </div>

          <div className="mb-4 space-y-3 sm:mb-6">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="privacy-policy"
                checked={acceptPrivacyPolicy}
                onCheckedChange={(checked) =>
                  setAcceptPrivacyPolicy(checked === true)
                }
                className="mt-0.5"
              />
              <label
                htmlFor="privacy-policy"
                className="cursor-pointer text-sm font-normal text-white"
              >
                Accept{" "}
                <a
                  href="https://privacy.acutusai.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#42BD00] underline hover:text-[#369900]"
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy & Policy
                </a>
              </label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms-conditions"
                checked={acceptTermsAndConditions}
                onCheckedChange={(checked) =>
                  setAcceptTermsAndConditions(checked === true)
                }
                className="mt-0.5"
              />
              <label
                htmlFor="terms-conditions"
                className="cursor-pointer text-sm font-normal text-white"
              >
                Accept{" "}
                <a
                  href="https://termandcondition.acutusai.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#42BD00] underline hover:text-[#369900]"
                  onClick={(e) => e.stopPropagation()}
                >
                  Term & condition
                </a>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={
              isSubmitting || !acceptPrivacyPolicy || !acceptTermsAndConditions
            }
            className="group flex w-full items-center justify-center rounded-lg bg-[#42BD00] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#369900] disabled:cursor-not-allowed disabled:opacity-50 sm:px-8 sm:py-3 sm:text-base md:px-10 md:py-4 md:text-lg"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
            {!isSubmitting && (
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
            )}
          </button>

          {result && (
            <div className="mt-4">
              {result === "success" ? (
                <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1 text-sm font-semibold text-green-400">
                        Check Your Registered Email
                      </h3>
                      <p className="text-sm text-green-300">
                        Your credentials have been sent to your registered email
                        address. Please check your inbox to complete the
                        registration process.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-sm font-medium text-red-400">
                    {result}
                  </span>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
