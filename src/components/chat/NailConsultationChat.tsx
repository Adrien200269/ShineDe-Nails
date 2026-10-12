"use client";

import * as React from "react";
import { Send, Sparkles, User, ShieldCheck, CheckCheck, MessageCircle, Clock, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/lib/chat-store";

interface NailConsultationChatProps {
  orderId: string;
  orderNumber?: string;
  customerName?: string;
  customerEmail?: string;
  shape?: string;
  length?: string;
  inspoImage?: string;
  currentUserRole: "admin" | "customer";
  currentUserName: string;
}

export function NailConsultationChat({
  orderId,
  orderNumber,
  customerName,
  customerEmail,
  shape,
  length,
  inspoImage,
  currentUserRole,
  currentUserName,
}: NailConsultationChatProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const fetchMessages = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/chat?orderId=${encodeURIComponent(orderId)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setMessages(data.data);
      }
    } catch (err) {
      console.warn("Failed to fetch messages:", err);
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  React.useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000); // Poll every 4 seconds for new messages
    return () => clearInterval(interval);
  }, [fetchMessages]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    const textToSend = inputValue.trim();
    setInputValue("");
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          orderNumber: orderNumber || orderId,
          customerEmail,
          customerName,
          senderRole: currentUserRole,
          senderName: currentUserName,
          message: textToSend,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setMessages((prev) => [...prev, data.data]);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const cannedResponses =
    currentUserRole === "admin"
      ? [
          "Your custom set is currently being sculpted with salon gel! 💅",
          "Noted! We'll adjust the accent nail finish as requested.",
          "Your sizes match our standard Medium specs perfectly 💕",
          "Dispatched with our Kathmandu Pathao courier! Delivery in 24-48 hrs.",
        ]
      : [
          "Can we make the index finger glossy instead?",
          "Can you add gold foil accents to the thumbs?",
          "When will this set be ready for delivery?",
          "My thumb is 16.5mm, can you make it slightly wider?",
        ];

  return (
    <div className="flex flex-col h-[520px] rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface shadow-sm overflow-hidden">
      {/* Header with Order Summary */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-pink-100 dark:border-brand-dark-border bg-pink-50/60 dark:bg-brand-dark-card/60">
        <div className="flex items-center gap-3">
          {inspoImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={inspoImage}
              alt="Inspo"
              className="h-10 w-10 rounded-xl object-cover border border-pink-200 dark:border-brand-dark-border"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary-light text-brand-primary">
              <Sparkles className="h-5 w-5" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-gray-900 dark:text-white text-sm">
                Nail Design Consultation
              </span>
              <span className="text-[10px] font-bold bg-pink-100 dark:bg-pink-950/60 text-brand-primary px-2 py-0.5 rounded-full border border-pink-200/60">
                {orderNumber || orderId}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-brand-dark-muted">
              {shape && length ? `${shape.toUpperCase()} · ${length.toUpperCase()} | ` : ""}
              {currentUserRole === "admin" ? `Chatting with ${customerName || "Customer"}` : "Direct with Nail Artist"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900/40">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Studio</span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 subtle-sparkle-bg">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-400 dark:text-brand-dark-muted">
            <MessageCircle className="h-10 w-10 text-pink-300 dark:text-pink-700 mb-2" />
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              No consultation messages yet
            </p>
            <p className="text-[11px] text-gray-400 max-w-xs mt-1">
              {currentUserRole === "admin"
                ? "Send the customer a design update or ask for specific nail details."
                : "Ask our nail technician about finishes, charms, or custom size adjustments."}
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderRole === currentUserRole;
            const isAdminMsg = msg.senderRole === "admin";

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[10px] font-bold text-gray-500 dark:text-brand-dark-muted">
                    {msg.senderName}
                  </span>
                  {isAdminMsg && (
                    <span className="text-[9px] font-bold bg-brand-primary text-white px-1.5 py-0.2 rounded-full">
                      Nail Artist
                    </span>
                  )}
                  <span className="text-[9px] text-gray-400">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-xs ${
                    isMe
                      ? "bg-brand-primary text-white rounded-tr-xs"
                      : "bg-white dark:bg-brand-dark-card border border-pink-100 dark:border-brand-dark-border text-gray-900 dark:text-white rounded-tl-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Canned Quick Replies */}
      <div className="px-3 py-1.5 bg-pink-50/40 dark:bg-brand-dark-card/40 border-t border-pink-100 dark:border-brand-dark-border flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-gray-400 shrink-0 font-bold">Quick:</span>
        {cannedResponses.map((text, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setInputValue(text)}
            className="text-[10px] whitespace-nowrap bg-white dark:bg-brand-dark-surface border border-pink-200 dark:border-brand-dark-border px-2.5 py-1 rounded-full text-gray-700 dark:text-brand-dark-text hover:border-brand-primary hover:text-brand-primary transition-all shrink-0"
          >
            {text}
          </button>
        ))}
      </div>

      {/* Message Input Footer */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-pink-100 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={
            currentUserRole === "admin"
              ? "Message customer about gel colors, gems, sizing..."
              : "Ask nail artist about your set specs..."
          }
          className="flex-1 rounded-full border border-pink-200 dark:border-brand-dark-border bg-pink-50/50 dark:bg-brand-dark-card px-4 py-2 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand-primary"
        />

        <Button
          type="submit"
          disabled={!inputValue.trim() || isSending}
          size="sm"
          className="rounded-full shadow-pink-sm px-4 gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </form>
    </div>
  );
}
