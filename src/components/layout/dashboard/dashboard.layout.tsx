import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router";

import { CreditCard, Sparkles, Zap } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import BreadcrumbHeader from "../bread-crumb-header";
import { DashboardSidebar } from "./sidebar/app-sidebar";
import { useAuthStore } from "@/store/auth-store";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [dismissed, setDismissed] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const isFreePlan = useMemo(() => {
    const plan = user?.plan_type || user?.enabled_plan?.plan_type;
    if (!plan) return true;
    return plan.toLowerCase() === "free";
  }, [user?.plan_type, user?.enabled_plan?.plan_type]);

  useEffect(() => {
    if (isFreePlan && !dismissed) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setShowPopup(false);
    }
  }, [isFreePlan, dismissed]);

  const showUpgrade = isFreePlan && !dismissed && showPopup;

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <BreadcrumbHeader />
          </div>
        </header>
        <div
          className={
            showUpgrade
              ? "relative flex flex-1 flex-col gap-4 p-4 pt-0 blur-sm pointer-events-none"
              : "relative flex flex-1 flex-col gap-4 p-4 pt-0"
          }
        >
          <Outlet />
        </div>
          {showUpgrade && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
              <Card className="w-full max-w-md border-[#E5E7EB] shadow-2xl">
                <CardHeader className="pb-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#00bf63]/10">
                    <CreditCard className="h-8 w-8 text-[#00bf63]" />
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    Welcome! Get Started with Credits
                  </CardTitle>
                  <CardDescription className="mt-2 text-base">
                    To unlock the full potential of our platform, choose a plan
                    that suits your need
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00bf63]">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Access Features
                        </p>
                        <p className="text-xs text-gray-600">
                          Unlock advanced tools and capabilities
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00bf63]">
                        <Zap className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Flexible Credit System
                        </p>
                        <p className="text-xs text-gray-600">
                          Purchase  as you need them
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button
                      className="w-full bg-[#00bf63] text-base font-semibold hover:bg-[#00a050]"
                      size="lg"
                      onClick={() => navigate("/plans")}
                    >
                     Purchase Plan
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-sm text-gray-500 hover:text-gray-700"
                      onClick={() => setDismissed(true)}
                    >
                      Maybe later
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
