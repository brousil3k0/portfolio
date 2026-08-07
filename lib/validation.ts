import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(100),
  email: z.string().trim().email("Enter a valid email.").max(200),
  message: z.string().trim().min(10, "Message is too short.").max(5000),
  // Must be checked ("on") — the browser omits the field entirely when unchecked.
  gdprConsent: z.literal("on", { message: "You must accept the privacy policy." }),
  // Honeypot — real users never fill this in; must stay empty.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
