import type { EnabledPlan } from "./token-usage.type";

export type UserType = {
  created_at: string;
  updated_at: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  id: string;
  plan_type?: string;
  enabled_plan?: EnabledPlan | null;
};
