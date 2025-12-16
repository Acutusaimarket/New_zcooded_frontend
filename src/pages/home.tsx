import React, { useEffect, useState } from "react";

import {
  ArrowRight,
  Check,
  ChevronDown,
  Eye,
  Menu,
  RefreshCw,
  Shield,
  Target,
  TrendingUp,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router";

import { useSubscriptionDetailsQuery } from "@/api/query/use-subscription-details.query";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const navigate = useNavigate();
  const { data: subscriptionData, isLoading: isLoadingPlans, error: plansError } = useSubscriptionDetailsQuery();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  const [selectedAudience, setSelectedAudience] = useState<
    "d2c" | "researchers"
  >("d2c");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [result, setResult] = useState("");
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show popup after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 2000); // Show popup after 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const scrollToForm = () => {
    const formSection = document.getElementById("ready-to-launch");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToPricing = () => {
    const pricingSection = document.getElementById("pricing-section");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMobileMenuOpen(false);
  };

  const handlePopupClick = () => {
    setShowPopup(false);
    scrollToForm();
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.currentTarget);

    formData.append("access_key", "b9bc6c3d-bb13-4e28-9b69-43b3d8643420");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.currentTarget.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  // Initialize audience from URL param and keep expanded step reset on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const audience = params.get("audience");
      if (audience === "researchers" || audience === "d2c") {
        setSelectedAudience(audience);
      }
    }
  }, []);

  const handleSelectAudience = (audience: "d2c" | "researchers") => {
    setSelectedAudience(audience);
    setExpandedStep(0);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set("audience", audience);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, "", newUrl);
    }
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        backgroundColor: "#F8FAF7",
        fontFamily: "Alina",
      }}
    >
      {/* Navigation */}
      <nav className="fixed top-0 z-[100] w-full border-b border-gray-200 bg-white/90 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="Company Logo"
                className="h-6 w-auto sm:h-8"
              />
              {/* <p className="text-2xl font-semibold text-gray-900">Zcoded</p> */}
            </div>

            {/* Desktop Menu */}
            <div className="hidden items-center space-x-2 md:flex md:space-x-4">
              <Button
                onClick={scrollToPricing}
                className="bg-[#42BD00] px-3 py-1.5 text-xs text-white hover:bg-[#369900] sm:px-4 sm:py-2 sm:text-sm"
              >
                Plans
              </Button>
              <Button
                onClick={scrollToForm}
                className="bg-[#42BD00] px-3 py-1.5 text-xs text-white hover:bg-[#369900] sm:px-4 sm:py-2 sm:text-sm"
              >
                Get a Demo
              </Button>
              <Button
                asChild
                className="bg-[#42BD00] px-3 py-1.5 text-xs text-white hover:bg-[#369900] sm:px-4 sm:py-2 sm:text-sm"
              >
                <Link to="/blogs">Blogs</Link>
              </Button>
              <Button
                asChild
                className="bg-[#42BD00] px-3 py-1.5 text-xs text-white hover:bg-[#369900] sm:px-4 sm:py-2 sm:text-sm"
              >
                <Link to={"/login"}>Login</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-gray-900 sm:p-2 md:hidden"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="absolute top-full right-0 left-0 border-b border-gray-200 bg-white/90 backdrop-blur-lg md:hidden">
              <div className="space-y-3 px-3 py-3 sm:space-y-4 sm:px-4 sm:py-4">
                {/* <a
                  href="#features"
                  className="block py-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="block py-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  How It Works
                </a>
                <a
                  href="#for-who"
                  className="block py-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Who It's For
                </a> */}
                <Button
                  onClick={scrollToPricing}
                  className="block w-full bg-[#42BD00] text-sm text-white hover:bg-[#369900]"
                >
                  Plans
                </Button>
                <Button
                  onClick={scrollToForm}
                  className="block w-full bg-[#42BD00] text-sm text-white hover:bg-[#369900]"
                >
                  Get a Demo
                </Button>
                <Button
                  asChild
                  className="w-full bg-[#42BD00] text-sm text-white hover:bg-[#369900]"
                >
                  <Link to={"/blogs"}>Blogs</Link>
                </Button>
                <Button
                  asChild
                  className="w-full bg-[#42BD00] text-sm text-white hover:bg-[#369900]"
                >
                  <Link to={"/login"}>Login</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>{" "}
      {/* Page 1: Hero Section - What if You Knew What Your GenZ Audience Wanted */}
      <section
        className="relative min-h-screen overflow-x-hidden overflow-y-hidden px-4 pt-20 sm:px-6 sm:pt-24"
        style={{
          backgroundImage: "url('/bg1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/30 to-blue-50/30"></div>
        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-end pb-8 sm:pb-12">
          <div className="grid items-end gap-6 pb-12 sm:gap-8 sm:pb-20 lg:grid-cols-2 lg:gap-12 lg:pb-32">
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <h1 className="text-2xl leading-tight font-bold sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                <span className="text-[#42BD00]">What</span> if You Knew{" "}
                <span className="text-[#42BD00]">What Your Audience</span>{" "}
                Wanted Before They Did?
              </h1>
              <p className="text-base font-bold text-gray-900 sm:text-lg md:text-xl">
                Predict customer behaviour, from Gen X to Gen Alpha, with ZCoded
              </p>

              <div className="flex flex-col gap-3 sm:gap-4">
                <Button
                  onClick={scrollToForm}
                  className="group flex w-full items-center justify-center rounded-lg bg-[#42BD00] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#369900] sm:w-fit sm:px-8 sm:py-3 sm:text-base md:px-10 md:py-4 md:text-lg"
                >
                  Book a Demo
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>

            <div className="relative hidden w-full lg:block"></div>
          </div>
        </div>

        {/* 1st image - positioned at bottom-right */}
        {(windowWidth === 0 || windowWidth >= 400) && (
          <img
            src="/one.png"
            alt="Gen Z audience"
            className="absolute right-0 bottom-0 z-10 hidden h-auto rounded-2xl object-cover sm:block"
            style={{
              height: windowWidth >= 1024 ? "80%" : "60%",
              maxWidth: windowWidth >= 1024 ? "60%" : "50%",
            }}
          />
        )}
      </section>
      {/* Page 2: D2C Brands Section */}
      <section
        className="px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:py-24"
        style={{ backgroundColor: "#F8FAF7" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">
                <span className="text-[#42BD00]">D2C Brands</span>
                <br />
                <span className="text-gray-900">This One's For You</span>
              </h2>

              <p className="text-base leading-relaxed text-gray-700 sm:text-lg">
                You've got a great product, but you're struggling to sell.
                Instead, you're losing time and money, and you're not any closer
                to understanding what your young customers actually want. Does
                any of this sound familiar?
              </p>

              <div className="space-y-3 sm:space-y-4">
                {[
                  {
                    icon: TrendingUp,
                    text: "Losing time & money to market research",
                    color: "#42BD00",
                  },
                  {
                    icon: Shield,
                    text: "Privacy concerns in using customer data",
                    color: "#42BD00",
                  },
                  {
                    icon: Wallet,
                    text: "Wasted spend on marketing campaigns and product launches without clarity on the viability of the product",
                    color: "#42BD00",
                  },
                  {
                    icon: RefreshCw,
                    text: "GenZ behaviour constantly changing as per new trends",
                    color: "#42BD00",
                  },
                  {
                    icon: Eye,
                    text: "Messaging & pricing based on assumptions",
                    color: "#42BD00",
                  },
                ].map((pain, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 sm:space-x-4"
                  >
                    <div className="mt-1 flex-shrink-0">
                      <pain.icon
                        className="h-5 w-5 sm:h-6 sm:w-6"
                        style={{ color: pain.color }}
                      />
                    </div>
                    <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                      {pain.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src="/2nd.jpg"
                  alt="Young woman shopping"
                  className="h-auto w-full rounded-2xl object-cover"
                />
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{ backgroundColor: "#00D76F40" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Page 3: Decode with ZCoded Section */}
      <section
        className="px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:py-24"
        style={{ backgroundColor: "#F8FAF7" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center sm:mb-12 lg:mb-16">
            <h2 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
              Decode with <span className="text-[#42BD00]">ZCoded</span>
            </h2>
            <p className="mx-auto max-w-3xl px-2 text-base leading-relaxed text-gray-700 sm:px-0 sm:text-lg">
              ZCoded is a digital community of your brand's biggest fans - a
              virtual sandbox where you can test, refine, and launch your
              products in collaboration with your customers.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
            {[
              {
                text: "Real-time testing allows you to figure out what works and what doesn't, quickly and cost-effectively",
                image: "/6th.jpg",
              },
              {
                text: "All data used is anonymous, ensuring customer privacy while giving you accurate insights",
                image: "/5th.jpg",
              },
              {
                text: "AI-Generated customer profiles help you understand who your customers are, predict how they will behave, all before launch",
                image: "/4th.jpg",
              },
              {
                text: "Run trials of your product before launch, preventing wasted spend and misfires",
                image: "/3rd.jpg",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl bg-gray-800 p-4 sm:p-6 md:p-8"
              >
                <p className="mb-4 text-sm leading-relaxed text-white sm:mb-6 sm:text-base md:text-lg">
                  {feature.text}
                </p>
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={feature.image}
                    alt={`Feature ${index + 1}`}
                    className="h-40 w-full object-cover sm:h-48 md:h-64"
                    style={{
                      filter: "brightness(0.9) sepia(0.1) hue-rotate(60deg)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center sm:mt-12">
            <Button
              onClick={scrollToForm}
              className="group mx-auto flex w-full items-center justify-center rounded-lg bg-[#42BD00] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#369900] sm:w-fit sm:px-8 sm:py-3 sm:text-base md:px-10 md:py-4 md:text-lg"
            >
              Book a Demo
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </section>
      {/* Page 4: ZCoded in Action Section */}
      <section
        className="px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:py-24"
        style={{ backgroundColor: "#F8FAF7" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center sm:mb-12 lg:mb-16">
            <h2 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
              <span className="text-[#42BD00]">ZCoded</span> in Action
            </h2>
            <p className="mx-auto max-w-4xl px-2 text-sm leading-relaxed text-gray-700 sm:px-0 sm:text-base md:text-lg">
              Gen Z is dominating the market, and is a notoriously difficult
              demographic to understand.{" "}
              <span className="font-semibold text-[#42BD00]">
                $36B is lost annually
              </span>{" "}
              on campaigns that fail to resonate, often because brands
              misunderstood their audience. (Statista) So how does ZCoded really
              work? Let's get into it.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
            <div className="space-y-3 sm:space-y-4">
              <div className="mb-2 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handleSelectAudience("d2c")}
                  className={`${
                    selectedAudience === "d2c"
                      ? "bg-[#42BD00] text-white"
                      : "bg-white text-gray-900"
                  } rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold transition-colors hover:bg-[#e9f7e6] sm:px-4 sm:text-sm`}
                >
                  D2C Market Leaders
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectAudience("researchers")}
                  className={`${
                    selectedAudience === "researchers"
                      ? "bg-[#42BD00] text-white"
                      : "bg-white text-gray-900"
                  } rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold transition-colors hover:bg-[#e9f7e6] sm:px-4 sm:text-sm`}
                >
                  Market Researchers
                </button>
              </div>

              {(selectedAudience === "d2c"
                ? [
                    {
                      title: "1) Understand Your Audience",
                      description:
                        "Not just the who, but the how and why. With anonymous data collected from real people, synthetic personas are generated, giving you accurate customer behaviour from click to checkout.",
                      icon: Users,
                    },
                    {
                      title: "2) Play with Your Brand’s Digital Community",
                      description:
                        "Now you’re ready to test your products on a digital community of synthetic personas, built to respond to your products, ads, surveys like a real person would. The best part? They’re your biggest fans.",
                      icon: Target,
                    },
                    {
                      title: "3) Test & Refine",
                      description:
                        "Does the digital community like the product? What works, what doesn’t? What can be improved? Find out in real-time, and refine accordingly.",
                      icon: Shield,
                    },
                    {
                      title: "4) Launch with Confidence",
                      description:
                        "With pre-launch clarity, you can predict customer behaviour and launch products knowing you have the approval of your biggest fans. Marketing campaigns just got so much easier!",
                      icon: TrendingUp,
                    },
                  ]
                : [
                    {
                      title: "1) Utilise Real Data",
                      description:
                        "Whether you choose to input sample data from real customers or let ZCoded's repository of validated data do the work, real-time market research is now in the palm of your hand.",
                      icon: Users,
                    },
                    {
                      title: "2) Create Synthetic Personas",
                      description:
                        "ZCoded then builds custom personas that act as a digital community of synthetic buyers, across diverse segments and demographics. It simulates and extracts insights without relying on audience availability or sifting through scattered data.",
                      icon: Target,
                    },
                    {
                      title: "3) Test & Analyse",
                      description:
                        "Does the digital community like the product? What works, what doesn’t? What can be improved? Help your clients find out in real-time.",
                      icon: Shield,
                    },
                    {
                      title: "4) Offer Insights Before Your Clients Launch",
                      description:
                        "With predictive capabilities, you can analyse customer behaviour, equipped with a deep understanding of the target audience, well before your clients' campaigns go live.",
                      icon: TrendingUp,
                    },
                  ]
              ).map((step, index) => (
                <div key={`${selectedAudience}-${index}`}>
                  <button
                    onClick={() =>
                      setExpandedStep(expandedStep === index ? null : index)
                    }
                    className="flex w-full items-center justify-between rounded-lg bg-[#42BD00] p-3 text-white transition-colors hover:bg-[#369900] sm:p-4 md:p-6"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                      <step.icon className="h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6" />
                      <span className="text-left text-xs font-semibold sm:text-sm md:text-base lg:text-lg">
                        {step.title}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 flex-shrink-0 transition-transform sm:h-5 sm:w-5 ${
                        expandedStep === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedStep === index && step.description && (
                    <div className="mt-2 rounded-lg bg-white p-3 text-xs leading-relaxed text-gray-700 sm:p-4 sm:text-sm md:p-6 md:text-base">
                      {step.description}
                    </div>
                  )}
                </div>
              ))}
              {/* <h3 className="mb-6 text-center text-xl font-semibold text-gray-900 sm:text-2xl">
                Steps
              </h3> */}
            </div>

            <div className="rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12">
              <h3 className="mb-3 text-center text-lg font-semibold text-gray-900 sm:mb-4 sm:text-xl md:text-2xl">
                Steps
              </h3>
              <div className="h-48 w-full overflow-hidden rounded-lg sm:h-64 md:h-80 lg:h-96">
                <img
                  src="/7.gif"
                  alt="Screenshots of Steps"
                  className="h-full w-full rounded-lg object-contain"
                  style={{ transform: "scale(1.6)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Page 5: Your Brand with ZCoded Section */}
      <section
        className="px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:py-24"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center sm:mb-12 lg:mb-16">
            <h2 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
              Your Brand with <span className="text-[#42BD00]">ZCoded</span>
            </h2>
            <div className="mx-auto mt-3 h-1 w-16 bg-[#42BD00] sm:mt-4 sm:w-24"></div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
            {[
              {
                icon: Target,
                text: "TikTok trend or health fad, ZCoded will help your brand stay relevant by simulating real-world behaviour, so you're always in the know.",
              },
              {
                icon: Wallet,
                text: "Say goodbye to months of expensive market research, with AI-Generated customer profiles that maintain anonymity and privacy.",
              },
              {
                icon: TrendingUp,
                text: "Don't wait for campaign failure to analyse what works and what doesn't – predict what drives conversion and when customers drop-off so you can launch with clarity and confidence.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl p-4 sm:p-6 md:p-8"
                style={{ backgroundColor: "#F0F7ED" }}
              >
                <div className="mb-4 sm:mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a362a] sm:h-12 sm:w-12 md:h-16 md:w-16">
                    <feature.icon className="h-5 w-5 text-white sm:h-6 sm:w-6 md:h-8 md:w-8" />
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-gray-900 sm:text-sm md:text-base">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section
        id="pricing-section"
        className="px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:py-24"
        style={{ backgroundColor: "#F8FAF7" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center sm:mb-12 lg:mb-16">
            <h2 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
              Choose Your <span className="text-[#42BD00]">Plan</span>
            </h2>
            <p className="mx-auto max-w-3xl px-2 text-base leading-relaxed text-gray-700 sm:px-0 sm:text-lg">
              Select the perfect plan for your business needs
            </p>
          </div>

        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-full px-4 py-1 text-xs font-medium transition-colors sm:text-sm ${
                billingCycle === "monthly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`rounded-full px-4 py-1 text-xs font-medium transition-colors sm:text-sm ${
                billingCycle === "yearly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

          {isLoadingPlans ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#42BD00] border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Loading plans...</p>
              </div>
            </div>
          ) : plansError ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-600">
                  Failed to load plans. Please try again later.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {subscriptionData?.data?.map((plan, index) => {
                // Prefer INR pricing for display on the marketing page
                const inrPricing = plan.pricing.find(
                  (p) => p.currency === "INR"
                );
                const monthlyPrice = inrPricing?.monthly || 0;
                const yearlyPrice = inrPricing?.yearly || 0;
                const activePrice =
                  billingCycle === "monthly" ? monthlyPrice : yearlyPrice;
                const monthlyFromYearly =
                  yearlyPrice > 0 ? Math.round(yearlyPrice / 12) : 0;
                
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
                    ? "border-[#00bf63] ring-2 ring-[#00bf6333]"
                    : "border-gray-200"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-[#00bf63] px-4 py-1 text-xs font-semibold text-white">
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
                        {activePrice === 0 ? "Custom" : `₹${activePrice}`}
                      </span>
                      {activePrice > 0 && (
                        <span className="text-sm text-gray-500">
                          {billingCycle === "monthly" ? "/mo*" : "/yr*"}
                        </span>
                      )}
                    </div>
                    {billingCycle === "yearly" && yearlyPrice > 0 && (
                      <div className="text-sm text-gray-600">
                        ≈ ₹{monthlyFromYearly}/mo (billed yearly)
                      </div>
                    )}
                    {billingCycle === "monthly" && activePrice > 0 && (
                      <div className="text-sm text-gray-600">
                        <span className="line-through">
                          ₹{Math.round(activePrice * 1.2)}
                        </span>{" "}
                        <span className="text-green-600">
                          Save ₹{Math.round(activePrice * 0.2 * 12)}/year
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
                        : `${plan.credits.toLocaleString()}/mo`}
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
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
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
                  className={`w-full ${
                    isPopular
                      ? "bg-[#00bf63] text-white hover:bg-[#00a052]"
                      : "border-2 border-[#00bf63] bg-white text-[#00bf63] hover:bg-[#00bf6310]"
                  }`}
                >
                  {plan.plan_type === "enterprise"
                    ? "Contact Sale"
                    : plan.plan_type === "free"
                      ? "Try it free"
                      : "Get Started"}
                </Button>
              </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      {/* Page 6: Ready to Launch Section */}
      <section
        id="ready-to-launch"
        className="px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:py-24"
        style={{ backgroundColor: "#F8FAF7" }}
      >
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center sm:mb-12">
            <h2 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
              Ready to <span className="text-[#42BD00]">Launch?</span>
            </h2>
            <p className="px-2 text-sm leading-relaxed text-gray-700 sm:px-0 sm:text-base md:text-lg">
              We're changing the game by helping brands truly understand and
              influence their customers. Let's decode your audience together.
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12"
            style={{ backgroundColor: "#1a362a" }}
          >
            <div className="mb-4 grid grid-cols-1 gap-4 sm:mb-6 sm:gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white sm:mb-2 sm:text-sm">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ex: Abilesh"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-[#42BD00] focus:outline-none sm:px-4 sm:py-3 sm:text-base"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white sm:mb-2 sm:text-sm">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  placeholder="Acme Inc."
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-[#42BD00] focus:outline-none sm:px-4 sm:py-3 sm:text-base"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white sm:mb-2 sm:text-sm">
                  Work Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="abilesh@company.com"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-[#42BD00] focus:outline-none sm:px-4 sm:py-3 sm:text-base"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white sm:mb-2 sm:text-sm">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Ex: Manager"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-[#42BD00] focus:outline-none sm:px-4 sm:py-3 sm:text-base"
                />
              </div>
            </div>
            <div className="mb-4 sm:mb-6">
              <label className="mb-1.5 block text-xs font-medium text-white sm:mb-2 sm:text-sm">
                Message
              </label>
              <textarea
                name="message"
                placeholder="Tell us about your goals..."
                rows={4}
                required
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-[#42BD00] focus:outline-none sm:px-4 sm:py-3 sm:text-base"
              ></textarea>
            </div>
            <button
              type="submit"
              className="group flex w-full items-center justify-center rounded-lg bg-[#42BD00] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#369900] sm:px-8 sm:py-3 sm:text-base md:px-10 md:py-4 md:text-lg"
            >
              Book a Demo Today
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
            </button>
            {result && (
              <div className="mt-4 text-center">
                <span
                  className={`text-sm font-medium ${result.includes("Successfully") ? "text-green-400" : "text-red-400"}`}
                >
                  {result}
                </span>
              </div>
            )}
          </form>
        </div>
      </section>{" "}
      {/* Footer */}
      <footer
        className="border-t border-gray-300 px-4 py-8 sm:px-6 sm:py-12"
        style={{ backgroundColor: "#F8FAF7" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
            <div className="text-center text-xs text-gray-600 sm:text-sm">
              © 2025 ZCoded by Acutus AI. All rights reserved.
            </div>
            <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6">
              <a
                href="https://privacy.acutusai.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-600 transition-colors hover:text-gray-900 sm:text-sm"
              >
                Privacy Policy
              </a>
              <a
                href="https://termandcondition.acutusai.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-600 transition-colors hover:text-gray-900 sm:text-sm"
              >
                Terms of Service
              </a>
              {/* <a
                href="mailto:contactus@acutusai.com"
                className="text-xs text-gray-600 transition-colors hover:text-gray-900 sm:text-sm"
              >
                Contact
              </a> */}
            </div>
          </div>
        </div>
      </footer>
      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative mx-4 max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            {/* Close button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Popup content */}
            <div className="text-center">
              <div className="mb-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#42BD00]">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>

              <h3 className="mb-3 text-lg font-bold text-gray-900 sm:text-xl">
                Discover Your Audience
              </h3>

              <p className="mb-6 text-sm text-gray-600 sm:text-base">
                Know more About It click Here
              </p>

              <button
                onClick={handlePopupClick}
                className="group flex w-full items-center justify-center rounded-lg bg-[#42BD00] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#369900] sm:text-base"
              >
                Book a Demo Today
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
