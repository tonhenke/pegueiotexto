import { sendGAEvent } from "@next/third-parties/google";

/**
 * Helper to dispatch custom events to Google Analytics 4 (GA4).
 * Safely runs on client-side only when GA is initialized.
 *
 * Example usage:
 * trackEvent("transcription_start", { platform: "youtube", is_logged_in: true });
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-7YWGQ5XSXY";

export function trackEvent(eventName: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined" || !GA_ID) {
    return;
  }

  sendGAEvent("event", eventName, params);
}
