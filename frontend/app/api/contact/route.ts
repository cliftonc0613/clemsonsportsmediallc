import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { contactFormSchema } from "@/lib/schemas";
import { contactFormLimiter, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - 5 submissions per minute per IP
    const clientIp = getClientIp(request);
    const { success, remaining, reset } = contactFormLimiter.check(clientIp);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(reset),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(reset),
          },
        }
      );
    }

    const body = await request.json();

    // Validate the form data
    const validatedData = contactFormSchema.parse(body);

    // Log the submission (in production, you would send an email here)
    console.log("Contact form submission:", validatedData);

    // TODO: Send email notification
    // You can integrate with:
    // - Resend (https://resend.com)
    // - SendGrid (https://sendgrid.com)
    // - Nodemailer
    // - AWS SES
    //
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'onboarding@yourdomain.com',
    //   to: 'hello@yourdomain.com',
    //   subject: `New Contact Form Submission from ${validatedData.name}`,
    //   html: `
    //     <h2>New Contact Form Submission</h2>
    //     <p><strong>Name:</strong> ${validatedData.name}</p>
    //     <p><strong>Email:</strong> ${validatedData.email}</p>
    //     <p><strong>Phone:</strong> ${validatedData.phone}</p>
    //     <p><strong>Service:</strong> ${validatedData.service || 'Not specified'}</p>
    //     <p><strong>Budget:</strong> ${validatedData.budget || 'Not specified'}</p>
    //     <p><strong>Timeline:</strong> ${validatedData.timeline || 'Not specified'}</p>
    //     <p><strong>Referral:</strong> ${validatedData.referral || 'Not specified'}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${validatedData.message}</p>
    //   `,
    // });

    // Return success response with rate limit headers
    return NextResponse.json(
      {
        success: true,
        message: "Form submitted successfully",
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset": String(reset),
        },
      }
    );
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process form submission",
      },
      { status: 500 }
    );
  }
}
