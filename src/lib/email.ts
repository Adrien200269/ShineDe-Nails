import nodemailer from "nodemailer";

const gmailUser = process.env.GMAIL_USER || "shresthasabja0@gmail.com";
const gmailAppPassword = (process.env.GMAIL_APP_PASSWORD || "fmjdomvhjqxikbfu").replace(/\s+/g, "");

// Nodemailer SMTP Transporter connected to Google Gmail
export const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailUser,
    pass: gmailAppPassword,
  },
});

/**
 * Send a 6-Digit Email Verification Code via Gmail
 */
export async function sendVerificationCodeEmail({
  to,
  code,
  name,
}: {
  to: string;
  code: string;
  name?: string;
}) {
  const recipientName = name || to.split("@")[0] || "Valued Customer";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FDF1F8; margin: 0; padding: 24px; color: #2D142C; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 24px; padding: 36px 28px; border: 1px solid #FCE7F3; box-shadow: 0 10px 30px rgba(233, 63, 102, 0.08); text-align: center; }
          .logo { font-size: 26px; font-weight: 800; color: #E93F66; font-family: Georgia, serif; letter-spacing: -0.5px; margin-bottom: 4px; }
          .tagline { font-size: 10px; font-weight: 700; color: #E93F66; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; }
          .divider { height: 1px; background: #FCE7F3; margin: 20px 0; }
          .title { font-size: 22px; font-weight: 700; color: #1F2937; margin-bottom: 8px; font-family: Georgia, serif; }
          .text { font-size: 14px; color: #6B7280; line-height: 1.6; margin-bottom: 24px; }
          .otp-card { background: #FFF5F7; border: 2px dashed #F472B6; border-radius: 18px; padding: 18px 24px; display: inline-block; margin: 12px 0 24px 0; }
          .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; color: #E93F66; letter-spacing: 8px; margin: 0; }
          .expiry { font-size: 11px; color: #9CA3AF; margin-top: 6px; }
          .footer { font-size: 11px; color: #9CA3AF; margin-top: 28px; line-height: 1.5; }
          .social { color: #E93F66; font-weight: 700; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">ShineDe Nails</div>
          <div class="tagline">PRESS. SLAY. REPEAT.</div>
          
          <div class="divider"></div>
          
          <div class="title">Verify Your Gmail Address ✨</div>
          <div class="text">
            Hi <strong>${recipientName}</strong>! Use the verification code below to confirm your account and access your handcrafted press-on orders.
          </div>
          
          <div class="otp-card">
            <div class="otp-code">${code}</div>
            <div class="expiry">Valid for 15 minutes · Do not share this code</div>
          </div>
          
          <div class="text" style="font-size: 12px; margin-bottom: 0;">
            If you did not request this verification, you can safely ignore this email.
          </div>
          
          <div class="divider"></div>
          
          <div class="footer">
            Handcrafted with love in Kathmandu, Nepal 🇳🇵<br>
            Follow our latest drops: <a href="https://instagram.com/shine.denails" class="social">@shine.denails</a>
          </div>
        </div>
      </body>
    </html>
  `;

  return mailTransporter.sendMail({
    from: `"ShineDe Nails" <${gmailUser}>`,
    to,
    subject: `${code} is your ShineDe Nails Verification Code ✨`,
    html,
  });
}

/**
 * Send Order Confirmation Receipt to Customer and Admin via Gmail
 */
export async function sendOrderConfirmationEmail({
  to,
  customerName,
  orderNumber,
  totalPrice,
  shape,
  length,
  finish,
  imageUrl,
}: {
  to: string;
  customerName: string;
  orderNumber: string;
  totalPrice: number;
  shape: string;
  length: string;
  finish: string;
  imageUrl?: string;
}) {
  const formattedPrice = `Rs. ${totalPrice.toLocaleString("en-IN")}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FDF1F8; margin: 0; padding: 24px; color: #2D142C; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 24px; padding: 36px 28px; border: 1px solid #FCE7F3; box-shadow: 0 10px 30px rgba(233, 63, 102, 0.08); }
          .header { text-align: center; }
          .logo { font-size: 26px; font-weight: 800; color: #E93F66; font-family: Georgia, serif; letter-spacing: -0.5px; }
          .tagline { font-size: 10px; font-weight: 700; color: #E93F66; letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; }
          .badge { display: inline-block; background: #ECFDF5; color: #059669; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 99px; border: 1px solid #A7F3D0; margin: 16px 0 10px 0; text-transform: uppercase; letter-spacing: 1px; }
          .title { font-size: 24px; font-weight: 700; color: #111827; font-family: Georgia, serif; text-align: center; margin-bottom: 6px; }
          .subtitle { font-size: 13px; color: #6B7280; text-align: center; margin-bottom: 24px; }
          .receipt-box { background: #FFF5F7; border-radius: 18px; padding: 20px; border: 1px solid #FCE7F3; margin-bottom: 24px; }
          .row { display: flex; justify-content: space-between; font-size: 13px; padding: 8px 0; border-bottom: 1px dashed #FCE7F3; }
          .row:last-child { border-bottom: none; }
          .label { color: #6B7280; }
          .value { font-weight: 700; color: #111827; }
          .total-row { display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; color: #E93F66; padding-top: 12px; }
          .img-preview { width: 100%; max-height: 200px; object-fit: cover; border-radius: 14px; margin-bottom: 16px; border: 1px solid #FCE7F3; }
          .timeline { background: #FAFAFA; border-radius: 16px; padding: 16px; font-size: 12px; color: #4B5563; margin-bottom: 24px; }
          .timeline-step { margin-bottom: 8px; }
          .timeline-step:last-child { margin-bottom: 0; }
          .footer { text-align: center; font-size: 11px; color: #9CA3AF; margin-top: 24px; border-top: 1px solid #FCE7F3; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ShineDe Nails</div>
            <div class="tagline">PRESS. SLAY. REPEAT.</div>
            <div class="badge">Order Confirmed</div>
            <div class="title">You&apos;re About to Slay! ✨</div>
            <div class="subtitle">Thank you <strong>${customerName}</strong>! Our nail artists in Nepal have received your custom order.</div>
          </div>
          
          ${imageUrl ? `<img src="${imageUrl}" class="img-preview" alt="Design Preview" />` : ""}
          
          <div class="receipt-box">
            <div class="row">
              <span class="label">Order Number</span>
              <span class="value" style="font-family: monospace; color: #E93F66;">${orderNumber}</span>
            </div>
            <div class="row">
              <span class="label">Nail Silhouette</span>
              <span class="value" style="text-transform: capitalize;">${shape}</span>
            </div>
            <div class="row">
              <span class="label">Length</span>
              <span class="value" style="text-transform: capitalize;">${length.replace("_", " ")}</span>
            </div>
            <div class="row">
              <span class="label">Topcoat Finish</span>
              <span class="value" style="text-transform: capitalize;">${finish}</span>
            </div>
            <div class="total-row">
              <span>Total Amount</span>
              <span>${formattedPrice}</span>
            </div>
          </div>
          
          <div class="timeline">
            <div class="timeline-step">💅 <strong>1. Gel & Charm Matching:</strong> Our artist is preparing the custom pigments & stones.</div>
            <div class="timeline-step">📏 <strong>2. Handcrafting:</strong> Formed to your exact nail bed dimensions.</div>
            <div class="timeline-step">📦 <strong>3. Dispatch:</strong> Cured, packaged in our signature box with application kit, and shipped across Nepal.</div>
          </div>
          
          <div class="footer">
            ShineDe Nails Nepal 🇳🇵 · Contact: <a href="mailto:${gmailUser}" style="color: #E93F66;">${gmailUser}</a><br>
            Instagram: <a href="https://instagram.com/shine.denails" style="color: #E93F66; font-weight: 700;">@shine.denails</a>
          </div>
        </div>
      </body>
    </html>
  `;

  return mailTransporter.sendMail({
    from: `"ShineDe Nails Orders" <${gmailUser}>`,
    to,
    cc: gmailUser, // Also notifies the store owner shresthasabja0@gmail.com
    subject: `Order Confirmed: ${orderNumber} - ShineDe Nails ✨`,
    html,
  });
}
