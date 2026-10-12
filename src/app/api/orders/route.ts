import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const userId = searchParams.get("userId");

    const whereClause: any = {};
    if (userId) {
      whereClause.userId = userId;
    } else if (email) {
      whereClause.customerEmail = email;
    }

    const orders = await prisma.customOrder.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("Prisma GET orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders from database" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const userId = body.user_id || body.userId;
    const authCookie = req.cookies.get("shinede_auth_session")?.value;
    let cookieUserId: string | null = null;
    if (authCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(authCookie));
        cookieUserId = parsed.id || null;
      } catch {
        // Ignore parsing errors
      }
    }

    const effectiveUserId = userId || cookieUserId;

    if (!effectiveUserId) {
      return NextResponse.json(
        { success: false, error: "Authentication required. You must log in to place an order." },
        { status: 401 }
      );
    }

    const customerEmail = body.customer_email || body.customerEmail;
    const customerName = body.customer_name || body.customerName;
    const customerPhone = body.customer_phone || body.customerPhone || null;
    const sizeData = body.size_data || body.sizeData;

    // Ensure user profile exists to satisfy foreign key relation
    let profileId: string | null = null;
    if (customerEmail) {
      try {
        const profile = await prisma.profile.upsert({
          where: { email: customerEmail },
          update: {
            fullName: customerName,
            phone: customerPhone || undefined,
          },
          create: {
            id: effectiveUserId,
            email: customerEmail,
            fullName: customerName,
            phone: customerPhone || undefined,
            savedMeasurements: sizeData as any,
          },
        });
        profileId = profile.id;
      } catch (err) {
        console.warn("Profile upsert warning:", err);
      }
    }

    const createdOrder = await prisma.customOrder.create({
      data: {
        orderNumber: body.order_number || body.orderNumber,
        userId: profileId || effectiveUserId,
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        imageUrl: body.image_url || body.imageUrl,
        shape: body.shape,
        length: body.length,
        finish: body.finish || "glossy",
        sizingType: body.sizing_type || body.sizingType,
        sizeData: sizeData,
        notes: body.notes || "",
        status: body.status || "Pending",
        totalPrice: body.total_price || body.totalPrice || 700.0,
        paymentStatus: body.payment_status || body.paymentStatus || "paid",
      },
    });

    // Send Gmail confirmation to customer and admin
    if (createdOrder.customerEmail) {
      sendOrderConfirmationEmail({
        to: createdOrder.customerEmail,
        customerName: createdOrder.customerName,
        orderNumber: createdOrder.orderNumber,
        totalPrice: Number(createdOrder.totalPrice),
        shape: createdOrder.shape,
        length: createdOrder.length,
        finish: createdOrder.finish,
        imageUrl: createdOrder.imageUrl,
      }).catch((emailErr) => console.warn("Gmail notification email warning:", emailErr));
    }

    return NextResponse.json({ success: true, data: createdOrder }, { status: 201 });
  } catch (error) {
    console.error("Prisma POST order error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order in database" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, orderNumber, status, paymentStatus } = body;

    const identifier = orderId || orderNumber;
    if (!identifier) {
      return NextResponse.json(
        { success: false, error: "orderId or orderNumber required" },
        { status: 400 }
      );
    }

    const updated = await prisma.customOrder.update({
      where: orderId ? { id: orderId } : { orderNumber: orderNumber },
      data: {
        ...(status ? { status } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Prisma PATCH order error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
