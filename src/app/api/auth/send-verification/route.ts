import { NextResponse } from "next/server";
import { sendVerificationCodeEmail } from "@/lib/email";
import { saveOtp } from "@/lib/otp-store";

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      );
    }

    // Generate secure 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Save in memory store (15 minutes expiry)
    saveOtp(email, code);

    // Send verification email via Gmail SMTP
    await sendVerificationCodeEmail({
      to: email,
      code,
      name,
    });

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${email}`,
    });
  } catch (error) {
    console.error("Failed to send Gmail verification email:", error);
    return NextResponse.json(
      { error: "Failed to send verification code. Please check email address or try again." },
      { status: 500 }
    );
  }
}
