import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const name = data.name?.trim();
    const email = data.email?.trim();
    const projectType = data.projectType?.trim();
    const budgetRange = data.budgetRange?.trim();
    const location = data.location?.trim();
    const message = data.message?.trim();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required." },
        { status: 400 }
      );
    }

    // Rough spam/validation checks
    if (name.length > 200 || email.length > 200 || (message && message.length > 5000)) {
      return NextResponse.json(
        { success: false, error: "Input is too long." },
        { status: 400 }
      );
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error("Missing RESEND_API_KEY");
      return NextResponse.json(
        { success: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    const html = `
      <h2>New Consultation Inquiry from G3 Builders</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Project Type:</strong> ${projectType || "N/A"}</p>
      <p><strong>Budget Range:</strong> ${budgetRange || "N/A"}</p>
      <p><strong>Location:</strong> ${location || "N/A"}</p>
      <p><strong>Message:</strong></p>
      <p>${message ? message.replace(/\n/g, "<br>") : "N/A"}</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "G3 Inquiries <onboarding@resend.dev>", // Default resend dev email or use custom domain if configured
        to: ["verspektive@gmail.com"], // Match the EMAIL constant in page.tsx
        subject: `New G3 Inquiry from ${name}`,
        html: html,
        reply_to: email,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend API error:", err);
      return NextResponse.json(
        { success: false, error: "Failed to send email." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Inquiry route error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
