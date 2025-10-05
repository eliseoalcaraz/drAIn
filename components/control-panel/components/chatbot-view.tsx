"use client";

import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, AlertCircle } from "lucide-react";
import { buildPrompt } from "@/lib/chatbot/prompts";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

export function ChatbotView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content:
        "Hello! I'm your drainage infrastructure assistant. I can help you with questions about pipes, inlets, outlets, storm drains, and reports. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini AI
  const genAI = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)
    : null;

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!genAI) {
      setError(
        "Gemini API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables."
      );
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      // Build conversation history for context
      const conversationHistory = messages
        .slice(-6) // Keep last 3 exchanges for context
        .map(
          (msg) =>
            `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
        );

      // Build the prompt with context
      const prompt = buildPrompt(input, conversationHistory);

      // Call Gemini API
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const botMessage: Message = {
        role: "bot",
        content: text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Gemini API error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Failed to get response: ${errorMessage}`);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "I apologize, but I encountered an error processing your request. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!genAI) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Gemini API key not configured. Please add{" "}
            <code className="bg-muted px-1 py-0.5 rounded">
              NEXT_PUBLIC_GEMINI_API_KEY
            </code>{" "}
            to your{" "}
            <code className="bg-muted px-1 py-0.5 rounded">.env.local</code>{" "}
            file.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 pb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "bot" && (
                <div className="flex-shrink-0">
                  <Bot className="w-8 h-8 p-1.5 bg-primary text-primary-foreground rounded-full" />
                </div>
              )}
              <div
                className={`rounded-lg px-4 py-2.5 max-w-[85%] break-words ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div className={`text-xs mt-1 opacity-70`}>
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              {msg.role === "user" && (
                <div className="flex-shrink-0">
                  <User className="w-8 h-8 p-1.5 bg-primary text-primary-foreground rounded-full" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0">
                <Bot className="w-8 h-8 p-1.5 bg-primary text-primary-foreground rounded-full" />
              </div>
              <div className="bg-muted rounded-lg px-4 py-2.5 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Error Display */}
      {error && (
        <div className="px-4 pb-2">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about drainage infrastructure, reports, or system features..."
            disabled={loading}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            size="icon"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Powered by Google Gemini AI
        </p>
      </div>
    </div>
  );
}
