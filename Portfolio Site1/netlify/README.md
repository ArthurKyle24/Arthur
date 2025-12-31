Netlify Function: send-whatsapp

This function forwards the site's contact form to WhatsApp using Twilio. It expects the following environment variables set in Netlify:

- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- TWILIO_WHATSAPP_FROM (example: whatsapp:+14155238886)
- TARGET_WHATSAPP_NUMBER (example: whatsapp:+2349022086672)

Deploy steps:
1. Commit and push your repo to GitHub.
2. Create a new site on Netlify and link your GitHub repo.
3. In Site Settings -> Build & deploy -> Environment -> Environment variables, add the four variables above.
4. Build & Deploy. Netlify will install dependencies and build functions.

Local testing (optional):
- Install Netlify CLI: `npm i -g netlify-cli`
- Run locally from project root:

```powershell
cd 'C:\Users\Arthur\Desktop\PROJECTS\Portfolio Site1'
netlify dev
```

This will start a local server and emulate Netlify Functions. The front-end will POST to `/.netlify/functions/send-whatsapp`.

Notes:
- Make sure the Twilio 'from' number is WhatsApp-enabled (Twilio sandbox or a messaging-enabled number).
- If you use the Twilio sandbox, your 'from' should look like `whatsapp:+14155238886` and you'll need to configure sandbox settings in Twilio.
- Netlify's free tier supports functions, but check quota for heavy usage.
