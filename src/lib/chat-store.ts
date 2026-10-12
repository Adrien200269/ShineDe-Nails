import fs from "fs";
import path from "path";

export interface ChatMessage {
  id: string;
  orderId: string;
  orderNumber?: string;
  customerEmail?: string;
  customerName?: string;
  senderRole: "admin" | "customer";
  senderName: string;
  message: string;
  imageUrl?: string;
  createdAt: string;
}

// In-memory fallback
let inMemoryMessages: ChatMessage[] = [
  {
    id: "msg-demo-1",
    orderId: "SDN-8492-PINK",
    orderNumber: "SDN-8492-PINK",
    customerEmail: "aastha@example.com",
    customerName: "Aastha Sharma",
    senderRole: "customer",
    senderName: "Aastha",
    message: "Hi! Can you make the ring finger extra glossy with the gold foil line art?",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "msg-demo-2",
    orderId: "SDN-8492-PINK",
    orderNumber: "SDN-8492-PINK",
    customerEmail: "aastha@example.com",
    customerName: "Aastha Sharma",
    senderRole: "admin",
    senderName: "ShineDe Artist (Sabja)",
    message: "Hello Aastha! Absolutely 💕 We'll use our high-shine diamond top coat for the ring finger. Your 16mm thumb sizing is noted!",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

const DATA_FILE = path.join(process.cwd(), ".chat_messages.json");

function loadFromFile(): void {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      const data = JSON.parse(content);
      if (Array.isArray(data) && data.length > 0) {
        inMemoryMessages = data;
      }
    }
  } catch (err) {
    console.warn("Failed to load chat messages from disk:", err);
  }
}

function saveToFile(): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(inMemoryMessages, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to save chat messages to disk:", err);
  }
}

// Initialize on first import
loadFromFile();

export function getMessagesByOrderId(orderId: string): ChatMessage[] {
  loadFromFile();
  return inMemoryMessages
    .filter(
      (m) =>
        m.orderId === orderId ||
        (m.orderNumber && m.orderNumber.toLowerCase() === orderId.toLowerCase())
    )
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function getAllConversations(): {
  orderId: string;
  orderNumber?: string;
  customerName?: string;
  customerEmail?: string;
  latestMessage: ChatMessage;
  totalMessages: number;
}[] {
  loadFromFile();
  const map = new Map<string, ChatMessage[]>();

  for (const msg of inMemoryMessages) {
    const key = msg.orderId || msg.orderNumber || "unknown";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(msg);
  }

  const result: {
    orderId: string;
    orderNumber?: string;
    customerName?: string;
    customerEmail?: string;
    latestMessage: ChatMessage;
    totalMessages: number;
  }[] = [];

  map.forEach((msgs, orderId) => {
    const sorted = msgs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const latest = sorted[0];
    result.push({
      orderId,
      orderNumber: latest.orderNumber || orderId,
      customerName: latest.customerName || (latest.senderRole === "customer" ? latest.senderName : "Customer"),
      customerEmail: latest.customerEmail,
      latestMessage: latest,
      totalMessages: msgs.length,
    });
  });

  return result.sort(
    (a, b) => new Date(b.latestMessage.createdAt).getTime() - new Date(a.latestMessage.createdAt).getTime()
  );
}

export function addMessage(data: Omit<ChatMessage, "id" | "createdAt">): ChatMessage {
  loadFromFile();
  const newMsg: ChatMessage = {
    ...data,
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  inMemoryMessages.push(newMsg);
  saveToFile();
  return newMsg;
}
