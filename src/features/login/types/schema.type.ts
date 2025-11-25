import type z from "zod";

import type { loginSchema } from "../schema";

export type LoginSchemaType = z.infer<typeof loginSchema>;
