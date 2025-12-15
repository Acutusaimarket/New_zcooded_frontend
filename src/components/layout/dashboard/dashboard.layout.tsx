import { useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router";

import { CreditCard } from "lucide-react";

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

const DEFAULT_PLAN_DETAILS = {
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
} as const;

const DashboardLayout = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [dismissed, setDismissed] = useState(false);

  const isFreePlan = useMemo(() => {
    const plan = user?.plan_type || user?.enabled_plan?.plan_type;
    if (!plan) return true;
    return plan.toLowerCase() === "free";
  }, [user?.plan_type, user?.enabled_plan?.plan_type]);

  const showUpgrade = isFreePlan && !dismissed;

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
        <div className="relative flex flex-1 flex-col gap-4 p-4 pt-0">
          {showUpgrade && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
              <Card className="w-full max-w-3xl border-[#E5E7EB] shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-[#42BD00]" />
                    <div>
                      <CardTitle>Upgrade to Add Credits</CardTitle>
                      <CardDescription>
                        You are currently on the Free plan. Upgrade to purchase
                        credit blocks.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  {Object.entries(DEFAULT_PLAN_DETAILS).map(([key, plan]) => (
                    <div
                      key={key}
                      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">{plan.name}</p>
                          <p className="text-xs text-gray-500">
                            {plan.creditsPerBlock} credits / block
                          </p>
                        </div>
                        <p className="text-lg font-bold text-[#42BD00]">
                          ₹{plan.pricePerBlock}
                        </p>
                      </div>
                      <Button
                        className="mt-4 w-full"
                        variant="outline"
                        onClick={() => navigate("/plans")}
                      >
                        Upgrade
                      </Button>
                    </div>
                  ))}
                </CardContent>
                <CardContent className="flex flex-col gap-3 pt-0">
                  <Button
                    className="w-full bg-[#42BD00] hover:bg-[#369900]"
                    onClick={() => navigate("/plans")}
                  >
                    View all plans
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setDismissed(true)}
                  >
                    Not now
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
