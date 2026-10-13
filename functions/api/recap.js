
export async function onRequestPost(context) {
  try {
    const apiKey = context.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "GEMINI_API_KEY Secret မရှိသေးပါ။" },
        { status: 500 }
      );
    }

    const body = await context.request.json();
    const story = String(body.story || "").trim();
    const language =
      body.language === "English" ? "English" : "Burmese";

    if (!story) {
      return Response.json(
        { error: "ဇာတ်လမ်းစာသား ထည့်ပေးပါ။" },
        { status: 400 }
      );
    }

    if (story.length > 20000) {
      return Response.json(
        { error: "ဇာတ်လမ်းစာသား အရမ်းရှည်နေပါတယ်။" },
        { status: 400 }
      );
    }

    const prompt = `
Write an engaging movie recap script based only on
the supplied story. Do not invent events.
Write in ${language}. Use natural narration,
an opening hook, and clear scene divisions.

STORY:
${story}
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: prompt }] }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 3000
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          error: "Gemini API တောင်းဆိုမှု မအောင်မြင်ပါ။",
          details: data.error?.message || "API request failed"
        },
        { status: response.status }
      );
    }

    const recap = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("\n");

    if (!recap) {
      return Response.json(
        { error: "Gemini က စာသားမပြန်ပေးပါ။" },
        { status: 502 }
      );
    }

    return Response.json({ ok: true, recap });
  } catch (error) {
    return Response.json(
      { error: "Request မအောင်မြင်ပါ။ JSON ကို စစ်ဆေးပါ။" },
      { status: 500 }
    );
  }
}
