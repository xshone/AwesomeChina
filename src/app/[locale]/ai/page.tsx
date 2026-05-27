"use client";

import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIPage() {
  const t = useTranslations("ai");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [t("q1"), t("q2"), t("q3"), t("q4"), t("q5")];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok || !res.body) throw new Error("Failed");

      const assistantMsg: Message = { role: "assistant", content: "" };
      setMessages([...newMessages, assistantMsg]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data) as { choices?: { delta?: { content?: string } }[] };
              const content = parsed.choices?.[0]?.delta?.content ?? "";
              if (content) {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: updated[updated.length - 1].content + content,
                  };
                  return updated;
                });
              }
            } catch {
              // skip parse errors
            }
          }
        }
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🤖</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{t("title")}</h1>
        <p className="text-sm text-gray-500">{t("subtitle")}</p>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.length === 0 && (
          <div>
            <p className="text-center text-sm text-gray-400 mb-6">{t("suggested")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => void sendMessage(q)}
                  className="text-left bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 hover:border-red-300 hover:bg-red-50 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-3", msg.role === "user" && "flex-row-reverse")}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.role === "assistant" ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-600"
            )}>
              {msg.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className={cn(
              "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
              msg.role === "assistant"
                ? "bg-white border border-gray-100 text-gray-800 shadow-sm"
                : "bg-red-600 text-white"
            )}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); void sendMessage(input); }}
        className="flex gap-2 bg-white border border-gray-200 rounded-2xl p-2 shadow-sm"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("placeholder")}
          className="flex-1 px-3 py-2 text-sm focus:outline-none bg-transparent"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-red-600 text-white rounded-xl px-4 py-2 hover:bg-red-700 transition-colors disabled:opacity-40 flex items-center gap-1"
        >
          <Send className="w-4 h-4" />
          <span className="text-sm font-medium">{t("send")}</span>
        </button>
      </form>
    </div>
  );
}
