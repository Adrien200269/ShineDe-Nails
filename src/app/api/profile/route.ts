import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      const allProfiles = await prisma.profile.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { customOrders: true },
          },
        },
      });
      return NextResponse.json({ success: true, data: allProfiles });
    }

    const profile = await prisma.profile.findUnique({
      where: { email },
    });

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error("Prisma GET profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, saved_measurements, savedMeasurements, fullName, phone } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });
    }

    const measurementsData = saved_measurements || savedMeasurements;

    const profile = await prisma.profile.upsert({
      where: { email },
      update: {
        savedMeasurements: measurementsData,
        fullName: fullName || undefined,
        phone: phone || undefined,
      },
      create: {
        email,
        fullName: fullName || "",
        phone: phone || null,
        savedMeasurements: measurementsData,
      },
    });

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error("Prisma POST profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
