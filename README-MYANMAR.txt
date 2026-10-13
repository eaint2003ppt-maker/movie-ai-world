MOVIE AI WORLD — PLATFORM STARTER

ပါဝင်သောဖိုင်များ
- index.html: Studio UI, Recap draft, Storyboard prompt builder, SRT draft, local project draft
- functions/api/health.js: Backend health check
- functions/api/generate-image.js: fal.ai Image API proxy (FAL_KEY secret လိုအပ်)
- functions/api/generate-video.js: fal.ai Video queue submit proxy (FAL_KEY secret လိုအပ်)

အရေးကြီးသောကန့်သတ်ချက်များ
- ဒီဟာက Starter scaffold ဖြစ်ပြီး full production platform မဟုတ်သေးပါ။
- Account/Login/Cloud sync မပါသေးပါ။ Account page မှာ local browser draft သာ သိမ်းပါတယ်။
- AI Voice generation နဲ့ တိကျတဲ့ Speech-to-text Subtitle API မချိတ်ရသေးပါ။
- Video queue job တင်နိုင်သော်လည်း status polling နဲ့ result download ကို နောက်အဆင့်မှာ ထည့်ရပါမယ်။
- Provider model ID/input schema က model အလိုက် မတူနိုင်ပြီး API ကုန်ကျစရိတ် ရှိနိုင်ပါတယ်။

Cloudflare Pages မှာတင်ရန်
Cloudflare Dashboard ရဲ့ Direct Upload က Functions folder ကို deploy လုပ်ဖို့ မလုံလောက်ပါ။ Git repository ချိတ်ပြီး deploy လုပ်ပါ၊ သို့မဟုတ် Wrangler CLI သုံးပါ.

ဖုန်းကနေ GitHub + Cloudflare Pages နည်းလမ်း
1. ZIP ကို download လုပ်ပြီး Android Files app မှ Extract လုပ်ပါ.
2. GitHub မှ repository အသစ်ဖန်တီးပါ.
3. index.html, functions/ folder, .gitignore တို့ကို repository root မှာ upload လုပ်ပါ။ ZIP ကို တစ်ဖိုင်တည်းတင်ရုံ မလုံလောက်ပါ.
4. Cloudflare Dashboard > Workers & Pages မှာ Git integration ချိတ်ပါ။ လက်ရှိ project ကို Git integration ပြောင်းမရရင် အရင်ဆုံး project အသစ်တစ်ခုနဲ့ စမ်းပြီး အောင်မြင်မှ domain ချိတ်ပါ။ အဟောင်း project ကို မဖျက်ပါနဲ့.
5. Static app အတွက် build command မလိုပါ။ Build output directory ကို root (/) သတ်မှတ်နိုင်ပါတယ်။ UI က root ကို လက်မခံရင် ဖိုင်တွေကို public/ ထဲထားပြီး output directory ကို public သတ်မှတ်ပါ။ functions/ က output directory root အောက်မှာရှိရပါမယ်.
6. Cloudflare Project > Settings > Variables and Secrets မှာ FAL_KEY ဆိုတဲ့ Secret ထည့်ပါ။ Value က fal.ai API key ဖြစ်ပါတယ်။ Encrypt/Secret ကိုရွေးပါ။ API key ကို HTML သို့မဟုတ် public GitHub file ထဲမထည့်ပါနဲ့.
7. Redeploy လုပ်ပါ။ https://YOUR-SITE/api/health ကိုဖွင့်ပြီး JSON response ပြန်လာမလာစစ်ပါ.
8. AI Image / AI Video page မှာ စမ်းပါ။ Error ဖြစ်ရင် model ID, model input format, provider access/billing ကိုစစ်ပါ.

နောက်ထပ် production အဆင့်မှာ မဖြစ်မနေလိုအပ်သည်များ
- User authentication (ဥပမာ Supabase Auth)
- D1 သို့မဟုတ် Supabase database နဲ့ per-user authorization
- R2 storage, job status/result endpoint
- Rate limit, abuse prevention, spending limits
- TTS / Speech-to-text provider
- Privacy policy, terms, copyright compliance
