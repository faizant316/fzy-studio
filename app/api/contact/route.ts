import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

// Notification inbox for new project requests.
const NOTIFY_TO = "faizant316@gmail.com";
// Verified Resend sender on fzydev.com.
const FROM = "FZY Dev <hello@fzydev.com>";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { name, email, company, projectType, timeline, description } = await req.json();

  if (!name || !email || !projectType) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  // Notify the studio — the critical email; if this fails, the request fails.
  try {
    await resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      replyTo: email,
      subject: `New project request: ${projectType} from ${name}`,
      html: `
        <div style="font-family: ui-monospace, monospace; background: #0a0a0a; color: #f5f0eb; padding: 2rem; border-radius: 12px; max-width: 560px;">
          <p style="font-size: 1.4rem; font-weight: 700; margin: 0 0 0.4rem; color: #c9a96a;">FZY</p>
          <p style="font-size: 1.1rem; font-weight: 700; margin: 0 0 1.5rem;">New project request</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="color: #8a8580; padding: 0.4rem 0; width: 130px;">Name</td><td style="color: #f5f0eb;">${name}</td></tr>
            <tr><td style="color: #8a8580; padding: 0.4rem 0;">Email</td><td style="color: #f5f0eb;">${email}</td></tr>
            ${company ? `<tr><td style="color: #8a8580; padding: 0.4rem 0;">Business</td><td style="color: #f5f0eb;">${company}</td></tr>` : ""}
            <tr><td style="color: #8a8580; padding: 0.4rem 0;">Project type</td><td style="color: #f5f0eb;">${projectType}</td></tr>
            <tr><td style="color: #8a8580; padding: 0.4rem 0;">Timeline</td><td style="color: #f5f0eb;">${timeline || "Not specified"}</td></tr>
          </table>
          ${description ? `<p style="color: #8a8580; margin: 1.5rem 0 0.25rem;">Details</p><p style="color: #f5f0eb; margin: 0; line-height: 1.6;">${description}</p>` : ""}
          <p style="color: #444; font-size: 0.75rem; margin: 2rem 0 0;">Sent via fzydev.com</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Studio notification failed:", err);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }

  // Confirmation to the client — best-effort; never block the request on this.
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      // hello@ has no inbox; route visitor replies to the real business inbox.
      replyTo: "faizan@fzydev.com",
      subject: "We got your request · FZY",
      html: `
        <div style="font-family: ui-monospace, monospace; background: #0a0a0a; color: #f5f0eb; padding: 2rem; border-radius: 12px; max-width: 560px;">
          <p style="font-size: 1.4rem; font-weight: 700; margin: 0 0 1rem;">Hey ${name},</p>
          <p style="color: #aaa; line-height: 1.7; margin: 0 0 1rem;">Thanks for reaching out to <strong style="color: #c9a96a;">FZY</strong>. We got your request about a <strong style="color: #f5f0eb;">${projectType}</strong> and we'll be in touch within 24 hours with a clear next step.</p>
          <p style="color: #aaa; line-height: 1.7; margin: 0 0 2rem;">In the meantime, feel free to reply with any extra details.</p>
          <p style="color: #f5f0eb; margin: 0;">FZY Dev</p>
          <p style="color: #444; font-size: 0.75rem; margin: 1.5rem 0 0;">FZY · fzydev.com</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Client confirmation failed (non-fatal):", err);
  }

  return NextResponse.json({ success: true });
}
