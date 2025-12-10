import z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password must be at least 1 character long"),
  acceptPrivacyPolicy: z.boolean().refine((val) => val === true, {
    message: "You must accept the Privacy & Policy",
  }),
  acceptTermsAndConditions: z.boolean().refine((val) => val === true, {
    message: "You must accept the Terms & Conditions",
  }),
});
