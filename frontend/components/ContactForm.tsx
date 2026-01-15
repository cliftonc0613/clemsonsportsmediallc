"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, WifiOff, CloudOff } from "lucide-react";
import Link from "next/link";
import { useOnlineStatus, isBackgroundSyncSupported } from "@/lib/hooks/useOnlineStatus";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WPService } from "@/lib/wordpress";
import { contactFormSchema, type ContactFormValues } from "@/lib/schemas";

const budgetOptions = [
  { value: "under-5k", label: "Under $5,000" },
  { value: "5k-10k", label: "$5,000 - $10,000" },
  { value: "10k-25k", label: "$10,000 - $25,000" },
  { value: "25k-50k", label: "$25,000 - $50,000" },
  { value: "50k-plus", label: "$50,000+" },
  { value: "not-sure", label: "Not sure yet" },
];

const timelineOptions = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-month", label: "Within 1 month" },
  { value: "1-3-months", label: "1-3 months" },
  { value: "3-6-months", label: "3-6 months" },
  { value: "6-plus-months", label: "6+ months" },
  { value: "flexible", label: "Flexible / No rush" },
];

const referralOptions = [
  { value: "google", label: "Google Search" },
  { value: "social-media", label: "Social Media" },
  { value: "referral", label: "Friend/Colleague Referral" },
  { value: "blog", label: "Blog/Article" },
  { value: "advertisement", label: "Advertisement" },
  { value: "other", label: "Other" },
];

interface ContactFormProps {
  services?: WPService[];
}

export function ContactForm({ services = [] }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQueuedOffline, setIsQueuedOffline] = useState(false);

  // Handle background sync success notification
  const handleSyncSuccess = useCallback((queue: string) => {
    if (queue === "contact-form-queue") {
      toast.success("Message sent!", {
        description: "Your queued message was sent when you came back online.",
      });
      setIsQueuedOffline(false);
    }
  }, []);

  const isOnline = useOnlineStatus(handleSyncSuccess);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      budget: "",
      timeline: "",
      referral: "",
      message: "",
      website: "", // Honeypot field
    },
  });

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit form");
      }

      toast.success("Message sent successfully!", {
        description: "We'll get back to you as soon as possible.",
      });

      form.reset();
      setIsQueuedOffline(false);
    } catch (error) {
      // Check if we're offline and Background Sync is supported
      if (!navigator.onLine && isBackgroundSyncSupported()) {
        toast.info("Message queued for delivery", {
          description: "Your message will be sent automatically when you're back online.",
          icon: <CloudOff className="h-4 w-4" />,
        });
        setIsQueuedOffline(true);
        form.reset();
      } else {
        toast.error("Failed to send message", {
          description:
            error instanceof Error
              ? error.message
              : "Please try again later or contact us directly.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input placeholder="John Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email & Phone - Side by Side */}
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone *</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="(123) 456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Service Interest & Budget Range - Side by Side */}
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="service"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Interest</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a service (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {services.length > 0 ? (
                      services.map((service) => (
                        <SelectItem key={service.id} value={service.slug}>
                          {service.title.rendered}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="web-design">Web Design</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Range</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your budget (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {budgetOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Timeline & Referral - Side by Side */}
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="timeline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timeline</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="When do you need this? (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timelineOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="referral"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How did you hear about us?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {referralOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Message */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your project, goals, and any specific requirements..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The more details you provide, the better we can help you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Honeypot field - hidden from real users, catches bots */}
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Offline Status Indicator */}
        {!isOnline && (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
            <WifiOff className="h-4 w-4" />
            <span>You&apos;re offline. Your message will be sent when you reconnect.</span>
          </div>
        )}

        {/* Queued Message Indicator */}
        {isQueuedOffline && isOnline && (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
            <CloudOff className="h-4 w-4" />
            <span>A message is queued and will be sent shortly...</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            size="lg"
            className="min-w-[200px] bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isOnline ? "Sending..." : "Queuing..."}
              </>
            ) : (
              <>
                {!isOnline && <WifiOff className="mr-2 h-4 w-4" />}
                {isOnline ? "Send Message" : "Queue Message"}
              </>
            )}
          </Button>
        </div>

        {/* Privacy Policy */}
        <p className="text-center text-sm text-muted-foreground">
          By submitting this form, you agree to our{" "}
          <Link href="/privacy-policy" className="underline text-neutral-900 hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300">
            Privacy Policy
          </Link>
        </p>
      </form>
    </Form>
  );
}
