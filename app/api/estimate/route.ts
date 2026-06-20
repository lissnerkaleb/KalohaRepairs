import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type EstimateRequestBody = {
  description: string;
  images?: string[]; // base64 data URLs
};

export async function POST(req: NextRequest) {
  try {
    const { description, images = [] } =
      (await req.json()) as EstimateRequestBody;

    if (!description || description.trim().length < 5) {
      return NextResponse.json(
        { error: "Please describe the job in a bit more detail." },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Estimation service is not configured yet." },
        { status: 503 }
      );
    }

    const content: Array<
      | { type: "text"; text: string }
      | { type: "image"; source: { type: "base64"; media_type: string; data: string } }
    > = [
      {
        type: "text",
        text: `You are a cost estimator for a Kihei, Maui handyman business called Kaloha Repairs, focused on vacation rental turnover repairs. A customer described this job:

"${description}"

Give a realistic ballpark labor + materials cost RANGE in USD for Maui pricing (which runs higher than mainland due to shipping/labor costs). Respond ONLY with JSON, no markdown, in this exact shape:
{"low": number, "high": number, "summary": "one sentence on what's likely involved", "caveat": "one sentence noting this is a rough estimate and final pricing depends on an in-person look"}`,
      },
    ];

    for (const img of images.slice(0, 4)) {
      const match = img.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match) {
        content.push({
          type: "image",
          source: { type: "base64", media_type: match[1], data: match[2] },
        });
      }
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 300,
        messages: [{ role: "user", content }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", errText);
      return NextResponse.json(
        { error: "Couldn't generate an estimate right now. Try again shortly." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const textBlock = data.content?.find((b: { type: string }) => b.type === "text");
    const raw = textBlock?.text ?? "";
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Got an unexpected response. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Estimate route error:", err);
    return NextResponse.json(
      { error: "Something went wrong generating your estimate." },
      { status: 500 }
    );
  }
}
