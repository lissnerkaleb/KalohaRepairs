import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type Estimate = {
  low: number;
  high: number;
  summary: string;
  caveat: string;
};

type SubmitBody = {
  propertyName: string;
  address: string;
  contact: string;
  urgency: string;
  description: string;
  photos?: string[]; // base64 data URLs
  estimate?: Estimate | null;
};

const URGENCY_LABELS: Record<string, string> = {
  "before-next-guest": "Before next guest arrives",
  "this-week": "Sometime this week",
  "no-rush": "No rush — next available",
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SubmitBody;
    const { propertyName, address, contact, urgency, description, photos = [], estimate } = body;

    if (!propertyName || !address || !contact || !description) {
      return NextResponse.json(
        { error: "Please fill out all required fields." },
        { status: 400 }
      );
    }

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      return NextResponse.json(
        { error: "Submission service isn't configured yet." },
        { status: 503 }
      );
    }

    const form = new FormData();
    form.append("access_key", accessKey);
    form.append("subject", `New repair request — ${propertyName}`);
    form.append("from_name", "Kaloha Repairs website");
    form.append("Property", propertyName);
    form.append("Address", address);
    form.append("Contact", contact);
    form.append("Urgency", URGENCY_LABELS[urgency] ?? urgency);
    form.append("Description", description);

    if (estimate) {
      form.append(
        "AI estimate",
        `$${estimate.low.toLocaleString()} – $${estimate.high.toLocaleString()} — ${estimate.summary}`
      );
    }

    // Attach up to 3 photos. Web3Forms accepts file uploads via multipart
    // form fields named "attachment".
    for (const [i, dataUrl] of photos.slice(0, 3).entries()) {
      const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!match) continue;
      const [, mimeType, base64] = match;
      const buffer = Buffer.from(base64, "base64");
      const blob = new Blob([buffer], { type: mimeType });
      form.append("attachment", blob, `photo-${i + 1}.${mimeType.split("/")[1]}`);
    }

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: form,
    });

    const result = await response.json();
    if (!response.ok || result.success === false) {
      console.error("Web3Forms error:", result);
      return NextResponse.json(
        { error: "Couldn't send your request right now. Please try again or call/text directly." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit route error:", err);
    return NextResponse.json(
      { error: "Something went wrong submitting your request." },
      { status: 500 }
    );
  }
}
