import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMessagesByOrderId, getAllConversations, addMessage } from "@/lib/chat-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const mode = searchParams.get("mode");

    // 1. Try fetching from Supabase PostgreSQL via Prisma
    try {
      if (mode === "conversations" || !orderId) {
        const dbMessages = await prisma.chatMessage.findMany({
          orderBy: { createdAt: "desc" },
        });

        if (dbMessages.length > 0) {
          const map = new Map<string, typeof dbMessages>();
          for (const msg of dbMessages) {
            const key = msg.orderId || msg.orderNumber;
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(msg);
          }

          const conversations = Array.from(map.entries()).map(([key, msgs]) => {
            const latest = msgs[0];
            return {
              orderId: key,
              orderNumber: latest.orderNumber || key,
              customerName:
                latest.customerName ||
                (latest.senderRole === "customer" ? latest.senderName : "Customer"),
              customerEmail: latest.customerEmail || undefined,
              latestMessage: {
                id: latest.id,
                orderId: latest.orderId,
                orderNumber: latest.orderNumber,
                customerEmail: latest.customerEmail || undefined,
                customerName: latest.customerName || undefined,
                senderRole: latest.senderRole as "admin" | "customer",
                senderName: latest.senderName,
                message: latest.message,
                imageUrl: latest.imageUrl || undefined,
                audioUrl: latest.audioUrl || undefined,
                audioDuration: latest.audioDuration || undefined,
                createdAt: latest.createdAt.toISOString(),
              },
              totalMessages: msgs.length,
            };
          });

          return NextResponse.json({ success: true, data: conversations });
        }
      } else {
        const dbMessages = await prisma.chatMessage.findMany({
          where: {
            OR: [
              { orderId: orderId },
              { orderNumber: orderId },
            ],
          },
          orderBy: { createdAt: "asc" },
        });

        if (dbMessages.length > 0) {
          const formatted = dbMessages.map((m) => ({
            id: m.id,
            orderId: m.orderId,
            orderNumber: m.orderNumber,
            customerEmail: m.customerEmail || undefined,
            customerName: m.customerName || undefined,
            senderRole: m.senderRole,
            senderName: m.senderName,
            message: m.message,
            imageUrl: m.imageUrl || undefined,
            audioUrl: m.audioUrl || undefined,
            audioDuration: m.audioDuration || undefined,
            createdAt: m.createdAt.toISOString(),
          }));

          return NextResponse.json({ success: true, data: formatted });
        }
      }
    } catch (dbErr) {
      console.warn("Prisma chat GET error, falling back to local chat-store:", dbErr);
    }

    // 2. Fallback to local chat store
    if (mode === "conversations" || !orderId) {
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
    const {
      orderId,
      orderNumber,
      customerEmail,
      customerName,
      senderRole,
      senderName,
      message,
      imageUrl,
      audioUrl,
      audioDuration,
    } = body;

    if (!orderId || (!message && !audioUrl && !imageUrl) || !senderRole) {
      return NextResponse.json(
        { success: false, error: "orderId, content, and senderRole are required." },
        { status: 400 }
      );
    }

    const cleanMessage = message || (audioUrl ? "Voice note" : "");
    const cleanSenderName = senderName || (senderRole === "admin" ? "ShineDe Artist" : "Customer");
    const cleanDuration = typeof audioDuration === "number" ? Math.round(audioDuration) : null;

    // 1. Primary: Save to Supabase PostgreSQL via Prisma
    try {
      const created = await prisma.chatMessage.create({
        data: {
          orderId,
          orderNumber: orderNumber || orderId,
          customerEmail: customerEmail || null,
          customerName: customerName || null,
          senderRole,
          senderName: cleanSenderName,
          message: cleanMessage,
          imageUrl: imageUrl || null,
          audioUrl: audioUrl || null,
          audioDuration: cleanDuration,
        },
      });

      // Mirror to local store for offline cache
      addMessage({
        orderId,
        orderNumber: orderNumber || orderId,
        customerEmail,
        customerName,
        senderRole,
        senderName: cleanSenderName,
        message: cleanMessage,
        imageUrl,
        audioUrl,
        audioDuration: cleanDuration || undefined,
      });

      const responsePayload = {
        id: created.id,
        orderId: created.orderId,
        orderNumber: created.orderNumber,
        customerEmail: created.customerEmail || undefined,
        customerName: created.customerName || undefined,
        senderRole: created.senderRole,
        senderName: created.senderName,
        message: created.message,
        imageUrl: created.imageUrl || undefined,
        audioUrl: created.audioUrl || undefined,
        audioDuration: created.audioDuration || undefined,
        createdAt: created.createdAt.toISOString(),
      };

      return NextResponse.json({ success: true, data: responsePayload }, { status: 201 });
    } catch (dbErr) {
      console.warn("Prisma chat POST error, falling back to local chat-store:", dbErr);
    }

    // 2. Fallback: Save to local store
    const createdLocal = addMessage({
      orderId,
      orderNumber: orderNumber || orderId,
      customerEmail,
      customerName,
      senderRole,
      senderName: cleanSenderName,
      message: cleanMessage,
      imageUrl,
      audioUrl,
      audioDuration: cleanDuration || undefined,
    });

    return NextResponse.json({ success: true, data: createdLocal }, { status: 201 });
  } catch (error) {
    console.error("Chat POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send chat message" },
      { status: 500 }
    );
  }
}
