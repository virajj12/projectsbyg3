import { NextResponse } from "next/server";

export const runtime = "edge";

// Upper bound per field, in characters. Anything longer is rejected rather than
// truncated, so a real visitor sees the error instead of a silently cut message.
const LIMITS = {
  name: 200,
  email: 200,
  projectType: 100,
  budgetRange: 100,
  location: 200,
  message: 5000,
} as const;

type Field = keyof typeof LIMITS;

// Deliberately loose: one @, something either side, a dot in the domain.
// The goal is catching typos like "name@gmail", not RFC 5322.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Escapes text for interpolation into the notification email's HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function bad(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export async function POST(req: Request) {
  try {
    let data: unknown;
    try {
      data = await req.json();
    } catch {
      return bad("Invalid request.");
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return bad("Invalid request.");
    }
    const body = data as Record<string, unknown>;

    // Honeypot: the form renders a visually hidden "website" input that people
    // never see or fill. Bots that fill every field get a success response and
    // no email is sent.
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ success: true });
    }

    const fields = {} as Record<Field, string>;
    for (const key of Object.keys(LIMITS) as Field[]) {
      const raw = body[key];
      if (raw !== undefined && raw !== null && typeof raw !== "string") {
        return bad("Invalid request.");
      }
      const value = typeof raw === "string" ? raw.trim() : "";
      if (value.length > LIMITS[key]) {
        return bad("Input is too long.");
      }
      fields[key] = value;
    }

    const { name, email, projectType, budgetRange, location, message } = fields;

    if (!name || !email) {
      return bad("Name and email are required.");
    }
    if (!EMAIL_RE.test(email)) {
      return bad("Please enter a valid email address.");
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error("Missing RESEND_API_KEY");
      return bad("Server configuration error.", 500);
    }

    // Every visitor-supplied value is escaped before it goes into the HTML, so
    // an enquiry cannot inject links, images or markup into the email G3 reads.
    const show = (v: string) => (v ? escapeHtml(v) : "N/A");
    const html = `
      <h2>New Consultation Inquiry from G3 Builders</h2>
      <p><strong>Name:</strong> ${show(name)}</p>
      <p><strong>Email:</strong> ${show(email)}</p>
      <p><strong>Project Type:</strong> ${show(projectType)}</p>
      <p><strong>Budget Range:</strong> ${show(budgetRange)}</p>
      <p><strong>Location:</strong> ${show(location)}</p>
      <p><strong>Message:</strong></p>
      <p>${message ? escapeHtml(message).replace(/\r?\n/g, "<br>") : "N/A"}</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "G3 Inquiries <hey@verspektive.in>", // Default resend dev email or use custom domain if configured
        to: ["hey@verspektive.in"], // Match the EMAIL constant in page.tsx
        // Line breaks are collapsed so a name cannot add lines to the subject.
        subject: `New G3 Inquiry from ${name.replace(/[\r\n]+/g, " ")}`,
        html: html,
        reply_to: email,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend API error:", err);
      return bad("Failed to send email.", 500);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Inquiry route error:", err);
    return bad("Internal server error.", 500);
  }
}
