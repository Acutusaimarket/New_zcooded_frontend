import React, { useState } from "react";

import { ArrowRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";

import { authApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import { Button } from "@/components/ui/button";

const SignupPage = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("plan_id");
  const [formData, setFormData] = useState({
    email: "",
    phone: "+91",
  });
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
        }
      );

      if (response.data.success) {
        setResult("Form Submitted Successfully");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setResult(response.data.message || "Failed to submit form");
      }
    } catch (error: any) {
      console.error("Error:", error);
      setResult(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "An error occurred. Please try again."
      );
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
                Email
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
                Phone Number
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
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex w-full items-center justify-center rounded-lg bg-[#42BD00] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#369900] disabled:cursor-not-allowed disabled:opacity-50 sm:px-8 sm:py-3 sm:text-base md:px-10 md:py-4 md:text-lg"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
            {!isSubmitting && (
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
            )}
          </button>

          {result && (
            <div className="mt-4 text-center">
              <span
                className={`text-sm font-medium ${
                  result.includes("Successfully")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {result}
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignupPage;

