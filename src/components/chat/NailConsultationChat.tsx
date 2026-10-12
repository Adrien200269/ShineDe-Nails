"use client";

import * as React from "react";
import {
  Send,
  Sparkles,
  MessageCircle,
  Mic,
  Play,
  Pause,
  Trash2,
  Volume2,
} from "lucide-react";
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

// Decorative waveform bar pattern for voice note visualizer
const WAVEFORM_BAR_HEIGHTS = [6, 12, 18, 10, 22, 14, 16, 8, 20, 15, 12, 18, 14, 8, 16, 10, 6];

function VoiceMessagePlayer({
  audioUrl,
  duration,
  isMe,
}: {
  audioUrl: string;
  duration?: number;
  isMe: boolean;
}) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [totalDuration, setTotalDuration] = React.useState(duration || 0);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
        setTotalDuration(Math.round(audio.duration));
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch((err) => {
        console.warn("Audio playback failed:", err);
      });
    }
  };

  const handleSeek = (index: number) => {
    const audio = audioRef.current;
    if (!audio || totalDuration <= 0) return;
    const ratio = index / WAVEFORM_BAR_HEIGHTS.length;
    const targetTime = ratio * totalDuration;
    audio.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const formatSecs = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progress = totalDuration > 0 ? currentTime / totalDuration : 0;

  return (
    <div className="flex items-center gap-2.5 py-1 min-w-[200px] max-w-full select-none">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={togglePlay}
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-xs ${
          isMe
            ? "bg-white text-brand-primary hover:bg-pink-50"
            : "bg-brand-primary text-white hover:bg-brand-primary-hover shadow-pink-sm"
        }`}
        aria-label={isPlaying ? "Pause voice message" : "Play voice message"}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>

      {/* Waveform & Time Info */}
      <div className="flex-1 space-y-1">
        {/* Interactive Waveform Bars */}
        <div className="flex items-center gap-1 h-6 cursor-pointer">
          {WAVEFORM_BAR_HEIGHTS.map((height, idx) => {
            const barProgress = idx / WAVEFORM_BAR_HEIGHTS.length;
            const isFilled = barProgress <= progress;

            return (
              <span
                key={idx}
                onClick={() => handleSeek(idx)}
                style={{ height: `${height}px` }}
                className={`w-1 rounded-full transition-colors ${
                  isMe
                    ? isFilled
                      ? "bg-white"
                      : "bg-white/40 hover:bg-white/70"
                    : isFilled
                    ? "bg-brand-primary"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-brand-primary/60"
                }`}
              />
            );
          })}
        </div>

        {/* Time Progress */}
        <div
          className={`flex items-center justify-between text-[10px] font-mono leading-none ${
            isMe ? "text-pink-100" : "text-gray-500 dark:text-brand-dark-muted"
          }`}
        >
          <span>{formatSecs(currentTime > 0 ? currentTime : totalDuration)}</span>
          <span className="flex items-center gap-1">
            <Volume2 className="w-3 h-3 opacity-70" />
            <span>Voice Note</span>
          </span>
        </div>
      </div>
    </div>
  );
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

  // Voice recording state
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordingDuration, setRecordingDuration] = React.useState(0);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const recordingTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const durationRef = React.useRef<number>(0);

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
    const interval = setInterval(fetchMessages, 4000); // Poll every 4s for fresh messages
    return () => clearInterval(interval);
  }, [fetchMessages]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clean up any ongoing audio streams or timers on unmount
  React.useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

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

  // Start voice message recording
  const startRecording = async () => {
    try {
      if (typeof window === "undefined" || !navigator?.mediaDevices?.getUserMedia) {
        alert("Audio recording is not supported in this browser environment.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];

      // Detect supported mime type
      const mimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/mp4",
        "audio/aac",
      ];
      let selectedMime = "";
      for (const mime of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mime)) {
          selectedMime = mime;
          break;
        }
      }

      const recorder = selectedMime
        ? new MediaRecorder(stream, { mimeType: selectedMime })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.start(250);
      setIsRecording(true);
      setRecordingDuration(0);
      durationRef.current = 0;

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          durationRef.current = prev + 1;
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Microphone access error:", err);
      alert(
        "Could not access your microphone. Please enable microphone permissions in your browser to record voice messages."
      );
    }
  };

  // Cancel and discard ongoing recording
  const cancelRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    audioChunksRef.current = [];
    setIsRecording(false);
    setRecordingDuration(0);
  };

  // Stop recording and send voice message
  const stopAndSendRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") return;

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    const duration = durationRef.current || 1;

    recorder.onstop = async () => {
      try {
        setIsSending(true);
        const mimeType = recorder.mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        // Convert blob to Base64 Data URL for universal storage and playback
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;

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
              message: "Voice note",
              audioUrl: base64Audio,
              audioDuration: duration,
            }),
          });

          const data = await res.json();
          if (data.success && data.data) {
            setMessages((prev) => [...prev, data.data]);
          }
          setIsSending(false);
        };
      } catch (err) {
        console.error("Failed to send voice message:", err);
        setIsSending(false);
      } finally {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        audioChunksRef.current = [];
        setIsRecording(false);
        setRecordingDuration(0);
      }
    };

    recorder.stop();
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const cannedResponses =
    currentUserRole === "admin"
      ? [
          "Your custom set is currently being sculpted with salon gel. We will notify you once ready.",
          "Noted. We will adjust the accent nail finish as requested.",
          "Your sizes match our standard Medium specifications.",
          "Dispatched with our Kathmandu courier. Delivery expected in 24 to 48 hours.",
        ]
      : [
          "Can we make the index finger glossy instead?",
          "Can you add gold foil accents to the thumbs?",
          "When will this set be ready for delivery?",
          "My thumb is 16.5 mm, can you make it slightly wider?",
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
              {currentUserRole === "admin"
                ? `Chatting with ${customerName || "Customer"}`
                : "Direct with Nail Artist"}
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
                ? "Send the customer a design update or voice note about specific details."
                : "Ask our nail technician questions or send a voice message with requests."}
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
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-xs ${
                    isMe
                      ? "bg-brand-primary text-white rounded-tr-xs"
                      : "bg-white dark:bg-brand-dark-card border border-pink-100 dark:border-brand-dark-border text-gray-900 dark:text-white rounded-tl-xs"
                  }`}
                >
                  {/* Voice message audio bubble */}
                  {msg.audioUrl ? (
                    <VoiceMessagePlayer
                      audioUrl={msg.audioUrl}
                      duration={msg.audioDuration}
                      isMe={isMe}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                  )}
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

      {/* Message Input Footer with Voice Message Recording */}
      <div className="p-3 border-t border-pink-100 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface">
        {isRecording ? (
          /* ACTIVE RECORDING CONTROLS */
          <div className="flex items-center justify-between bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-full px-4 py-2 animate-in fade-in duration-200">
            {/* Pulsing indicator & timer */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
              <span className="text-xs font-bold text-red-600 dark:text-red-400 font-mono">
                {formatTimer(recordingDuration)}
              </span>
              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 hidden sm:inline">
                Recording voice note...
              </span>
            </div>

            {/* Sound wave animated visual bars */}
            <div className="flex items-center gap-1 h-4">
              <span className="w-1 bg-red-400 rounded-full animate-pulse h-3" />
              <span className="w-1 bg-red-500 rounded-full animate-pulse delay-75 h-5" />
              <span className="w-1 bg-red-400 rounded-full animate-pulse delay-150 h-2" />
              <span className="w-1 bg-red-500 rounded-full animate-pulse delay-100 h-4" />
              <span className="w-1 bg-red-400 rounded-full animate-pulse delay-200 h-3" />
            </div>

            {/* Cancel & Send Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={cancelRecording}
                className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 text-gray-500 hover:text-red-600 transition-colors"
                title="Discard voice message"
                aria-label="Discard recording"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={stopAndSendRecording}
                disabled={isSending}
                className="flex items-center gap-1.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-pink-sm active:scale-95 transition-all"
              >
                {isSending ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Send Note</span>
              </button>
            </div>
          </div>
        ) : (
          /* STANDARD INPUT BAR WITH MICROPHONE BUTTON */
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            {/* Record Voice Note Button */}
            <button
              type="button"
              onClick={startRecording}
              disabled={isSending}
              title="Record voice note"
              aria-label="Record voice note"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 hover:bg-pink-200 dark:bg-brand-dark-card dark:hover:bg-brand-primary/20 text-brand-primary transition-all active:scale-95 shrink-0"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                currentUserRole === "admin"
                  ? "Message or tap mic for voice note..."
                  : "Message or tap mic to send voice note..."
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
        )}
      </div>
    </div>
  );
}
