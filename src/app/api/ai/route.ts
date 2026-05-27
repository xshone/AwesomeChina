import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages } = await request.json() as { messages: { role: string; content: string }[] };

    // Record AI usage (optional analytics)
    void prisma; // ensure import is used

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        stream: true,
        messages: [
          {
            role: "system",
            content: `You are an expert China travel guide assistant. You help foreign travelers plan their trips to China. 
You provide helpful, accurate, and enthusiastic information about Chinese cities, attractions, food, culture, visa requirements, transportation, useful apps, and practical travel tips.
Always be warm, encouraging, and make travelers excited to visit China. 
When recommending food, describe the taste and experience vividly. 
Keep answers concise but comprehensive. 
If asked about current events or very recent information, acknowledge your knowledge cutoff.`,
          },
          ...messages,
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "AI service error" }, { status: 500 });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
