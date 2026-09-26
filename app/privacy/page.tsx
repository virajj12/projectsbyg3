import type { Metadata } from "next";
import { SITE_NAME, breadcrumbList, jsonLd, pageMetadata } from "@/lib/site";

// The layout's title template already appends the site name, so the page
// title is just the page's own name (it used to render the name twice).
export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects, uses and retains the details you send through the enquiry form, and how to request access, correction or erasure.`,
  path: "/privacy",
});

const BREADCRUMBS = {
  "@context": "https://schema.org",
  ...breadcrumbList([
    { name: "Home", path: "/" },
    { name: "Privacy Policy", path: "/privacy" },
  ]),
};

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--g3-black)] pt-32 pb-24 transition-colors duration-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(BREADCRUMBS) }} />
      <article className="container mx-auto px-6 max-w-[800px]">
        <h1 className="g3-display-xl mb-4 text-[var(--g3-ink)]">Privacy Policy</h1>
        <p className="mb-12 font-medium" style={{ color: "var(--g3-ink-faint)" }}>Last updated: <time dateTime="2026-09-24">September 24, 2026</time></p>

        <div className="space-y-12 g3-body leading-relaxed text-[var(--g3-ink)]">
          <section>
            <h2 className="g3-display-md mb-4" style={{ color: "var(--g3-ink)" }}>Information Collected</h2>
            <p>
              When you use our contact form, we may collect the following information that you voluntarily provide:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4" style={{ color: "var(--g3-ink-soft)" }}>
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number, if provided</li>
              <li>Project or service requirements</li>
              <li>Any other message or information you choose to submit</li>
            </ul>
            <p className="mt-4">
              We only collect information that is reasonably necessary to respond to your enquiry and understand your requirements.
            </p>
          </section>

          <section>
            <h2 className="g3-display-md mb-4" style={{ color: "var(--g3-ink)" }}>Purpose of Collection</h2>
            <p>
              The information submitted through our contact form is used strictly to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4" style={{ color: "var(--g3-ink-soft)" }}>
              <li>Respond to your enquiries</li>
              <li>Understand your project requirements</li>
              <li>Communicate with you regarding your enquiry</li>
              <li>Provide relevant information about our services when appropriate</li>
            </ul>
          </section>

          <section>
            <h2 className="g3-display-md mb-4" style={{ color: "var(--g3-ink)" }}>Email Processing and Third-Party Services</h2>
            <p>
              Contact form submissions are transmitted securely through <strong>Resend</strong>, our email delivery provider, directly to our designated business email address. 
            </p>
            <p className="mt-4">
              While we do not maintain a separate customer database solely for contact form submissions on this website, the submitted information may exist in our email system and within the systems involved in transmission (such as Resend) according to their applicable data retention practices. Third-party infrastructure providers may process this information where necessary to provide their communication services.
            </p>
          </section>

          <section>
            <h2 className="g3-display-md mb-4" style={{ color: "var(--g3-ink)" }}>Security</h2>
            <p>
              We implement reasonable technical and organizational safeguards to protect the information you submit. All sensitive credentials, including our email delivery API keys, are strictly maintained server-side and are never exposed to the public internet or your browser.
            </p>
          </section>

          <section>
            <h2 className="g3-display-md mb-4" style={{ color: "var(--g3-ink)" }}>Data Retention</h2>
            <p>
              There is no separate database specifically storing contact form submissions on our website servers. However, emails containing your enquiry information may remain in our business email account and relevant email-delivery systems for as long as reasonably necessary to handle your enquiry, maintain appropriate business records, and comply with applicable requirements.
            </p>
          </section>

          <section>
            <h2 className="g3-display-md mb-4" style={{ color: "var(--g3-ink)" }}>Children&apos;s Data</h2>
            <p>
              Our website and services are not intended to knowingly collect personal data from children except as permitted under applicable law.
            </p>
          </section>

          <section>
            <h2 className="g3-display-md mb-4" style={{ color: "var(--g3-ink)" }}>User Rights and Grievances</h2>
            <p>
              Under applicable Indian law, you may have rights regarding your personal data, including the right to request information about processing, correction, and erasure where applicable.
            </p>
            <p className="mt-4">
              If you have any questions, privacy requests, or grievances regarding how your information is handled, please contact us at:
            </p>
            <p className="mt-4 font-medium">
              <a href="mailto:hey@verspektive.in" className="underline underline-offset-4 hover:opacity-70 transition-opacity" style={{ color: "var(--g3-ink)" }}>
                hey@verspektive.in
              </a>
            </p>
          </section>

          <section>
            <h2 className="g3-display-md mb-4" style={{ color: "var(--g3-ink)" }}>Changes to this Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. The updated version will be indicated by the &quot;Last updated&quot; date at the top of this page.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
