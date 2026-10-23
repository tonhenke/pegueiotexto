export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";
  const pubId = clientId.replace(/^ca-/, "");

  if (!pubId) {
    return new Response(
      "# Google AdSense ads.txt - configure NEXT_PUBLIC_ADSENSE_CLIENT_ID to populate\n",
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      }
    );
  }

  // Google AdSense standard ads.txt entry
  const content = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
