import { z } from "zod";

/**
 * Phone number validation regex
 * Accepts: +1 (123) 456-7890, 123-456-7890, 123.456.7890, 1234567890, +44 20 7946 0958
 * Requires at least 10 digits (excluding formatting characters)
 */
const phoneRegex = /^[+]?[(]?[0-9]{1,3}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;

/**
 * Contact Form Validation Schema
 * Shared between client-side form and server-side API validation
 */
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .regex(phoneRegex, "Please enter a valid phone number"),
  service: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  referral: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  // Honeypot field - should always be empty (bots fill hidden fields)
  website: z.string().max(0, "Form submission rejected").optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
