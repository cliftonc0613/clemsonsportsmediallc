import { z } from "zod";

/**
 * Phone number validation
 *
 * More robust validation that:
 * 1. Allows common formatting characters: +, -, (), spaces, dots
 * 2. Requires exactly 10-15 digits (international standard)
 * 3. Rejects numbers with too few or too many digits
 *
 * Accepts: +1 (123) 456-7890, 123-456-7890, 123.456.7890, 1234567890, +44 20 7946 0958
 */
function isValidPhoneNumber(phone: string): boolean {
  // Extract only digits from the phone number
  const digitsOnly = phone.replace(/\D/g, "");

  // Must have between 10 and 15 digits (international standard)
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return false;
  }

  // Check for valid formatting characters only
  // Allow: digits, +, -, (), spaces, dots
  const validCharsRegex = /^[0-9+\-().\s]+$/;
  if (!validCharsRegex.test(phone)) {
    return false;
  }

  // Reject obvious invalid patterns
  // All same digit (e.g., 1111111111)
  if (/^(\d)\1+$/.test(digitsOnly)) {
    return false;
  }

  // Sequential digits (e.g., 1234567890)
  if (digitsOnly === "1234567890" || digitsOnly === "0123456789") {
    return false;
  }

  return true;
}

/**
 * Contact Form Validation Schema
 * Shared between client-side form and server-side API validation
 */
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address").max(254, "Email is too long"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(25, "Phone number is too long")
    .refine(isValidPhoneNumber, "Please enter a valid phone number"),
  service: z.string().max(100, "Service selection is too long").optional(),
  budget: z.string().max(50, "Budget selection is too long").optional(),
  timeline: z.string().max(50, "Timeline selection is too long").optional(),
  referral: z.string().max(200, "Referral information is too long").optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000, "Message is too long"),
  // Honeypot field - should always be empty (bots fill hidden fields)
  website: z.string().max(0, "Form submission rejected").optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
