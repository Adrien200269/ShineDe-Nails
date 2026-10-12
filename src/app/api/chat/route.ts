import { NextRequest, NextResponse } from "next/server";
import { getMessagesByOrderId, getAllConversations, addMessage } from "@/lib/chat-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const mode = searchParams.get("mode");

    if (mode === "conversations") {
      const conversations = getAllConversations();
      return NextResponse.json({ success: true, data: conversations });
    }

    if (!orderId) {
      const conversations = getAllConversations();
      return NextResponse.json({ success: true, data: conversations });
    }

    const messages = getMessagesByOrderId(orderId);
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error("Chat GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch chat messages" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, orderNumber, customerEmail, customerName, senderRole, senderName, message, imageUrl } = body;

    if (!orderId || !message || !senderRole) {
      return NextResponse.json(
        { success: false, error: "orderId, message, and senderRole are required." },
        { status: 400 }
      );
    }

    const created = addMessage({
      orderId,
      orderNumber: orderNumber || orderId,
      customerEmail,
      customerName,
      senderRole,
      senderName: senderName || (senderRole === "admin" ? "ShineDe Artist" : "Customer"),
      message,
      imageUrl,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("Chat POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send chat message" },
      { status: 500 }
    );
  }
}
