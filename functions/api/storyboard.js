
export async function onRequestPost({ request, env }) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  };

  try {
    if (!env.GEMINI_API_KEY) {
      return Response.json(
        { error: "Cloudflare မှာ GEMINI_API_KEY မရှိပါ။" },
        { status: 500, headers }
      );
    }

    const body = await request.json();
    const story = String(body.story || "").trim();
    const language =
      String(body.language || "Burmese").toLowerCase();

    if (!story) {
      return Response.json(
        { error: "ဇာတ်လမ်းစာသား အရင်ထည့်ပါ။" },
        { status: 400, headers }
      );
    }

    if (story.length > 20000) {
      return Response.json(
        { error: "ဇာတ်လမ်းစာသား ရှည်လွန်းနေပါတယ်။" },
        { status: 400, headers }
      );
    }

    const outputLanguage =
      language === "en" || language === "english"
        ? "English"
        : "Burmese";

    const prompt = `
You are an expert cinematic storyboard writer.

Convert the story below into exactly 6 numbered scenes.
Write all scene descriptions in ${outputLanguage}.

For each scene include:
1. Scene number and title
2. Visual action and setting
3. Camera angle and movement
4. Character expressions and emotions
5. Dialogue or narration, if appropriate
6. A detailed AI image/video prompt

Keep character appearance and clothing consistent
between scenes. Do not change the story's main events.
Return readable text with clear scene headings.

STORY:
${story}
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: prompt }] }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 6000
          }
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "Gemini storyboard error:",
        response.status,
        JSON.stringify(result).slice(0, 1500)
      );

      return Response.json(
        {
          error:
            response.status === 403
              ? "Gemini API ခွင့်ပြုချက်မရပါ။ Project နဲ့ API Key ကို စစ်ပါ။"
              : response.status === 429
              ? "Gemini API quota ပြည့်နေပါတယ်။"
              : "Gemini API တောင်းဆိုမှု မအောင်မြင်ပါ။",
          status: response.status
        },
        { status: response.status, headers }
      );
    }

    const storyboard = (
      result.candidates?.[0]?.content?.parts || []
    )
      .map(part => part.text || "")
      .join("\n")
      .trim();

    if (!storyboard) {
      return Response.json(
        { error: "Gemini က Storyboard စာသား မပြန်ပေးပါ။" },
        { status: 502, headers }
      );
    }

    return Response.json(
      { ok: true, storyboard },
      { headers }
    );
  } catch (error) {
    console.error("Storyboard function error:", error);

    return Response.json(
      { error: "Server အမှားဖြစ်နေပါတယ်။ ထပ်စမ်းကြည့်ပါ။" },
      { status: 500, headers }
    );
  }
}
