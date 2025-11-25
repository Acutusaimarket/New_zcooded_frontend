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
  return (
    <div className={cn("bg-background min-h-screen", className)}>
      <div className="container mx-auto max-w-7xl px-4 py-6">{children}</div>
    </div>
  );
};
