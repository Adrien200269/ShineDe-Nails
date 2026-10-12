import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp-store";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, code, fullName } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      );
    }

    const isValid = verifyOtp(email, code);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired verification code. Please request a new one." },
        { status: 400 }
      );
    }

    // Try finding or creating user profile in Prisma
    let profile = null;
    try {
      profile = await prisma.profile.upsert({
        where: { email: email.trim().toLowerCase() },
        update: {
          fullName: fullName || undefined,
        },
        create: {
          id: `gmail-${Date.now()}`,
          email: email.trim().toLowerCase(),
          fullName: fullName || email.split("@")[0],
        },
      });
    } catch (err) {
      console.warn("Prisma profile upsert warning on verify:", err);
    }

    return NextResponse.json({
      success: true,
      message: "Email successfully verified",
      user: {
        id: profile?.id || `user-${Date.now()}`,
        email: email.trim().toLowerCase(),
        fullName: profile?.fullName || fullName || email.split("@")[0],
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Verification process failed. Please try again." },
      { status: 500 }
    );
  }
}
