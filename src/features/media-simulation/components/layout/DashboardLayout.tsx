import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

export const DashboardLayout = ({
  children,
  className,
}: DashboardLayoutProps) => {
  return <div className={cn("space-y-6", className)}>{children}</div>;
};
