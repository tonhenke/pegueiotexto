"use client";
import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, Zap, Star, Sparkles, ArrowRight, ShieldCheck, Clock, Crown, Flame } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const freePlan = {
  id: "free",
  name: "Free Trial",
  displayPrice: "$0",
  displayPeriod: "/ free",
  billingDetail: "Free forever",
  installment: "No credit card required",
  savings: "Instant access",
  minutes: "5 min to start",
  desc: "Perfect to test our AI accuracy and transcribe your first videos",
  color: "#10B981",
  features: [
    "5 free minutes immediately upon signup",
    "Supports YouTube, TikTok, Instagram Reels and 1,700+ websites",
    "High-accuracy AI transcription powered by Whisper",
    "Download plain text transcript (.TXT)",
    "Interactive audio player synced with timestamps",
    "Earn +10 free minutes for every friend invited",
    "No credit card or payment info needed",
    "Automatic file deletion with guaranteed privacy",
  ],
  cta: "Start Free Now",
  popular: false,
  isFree: true,
};

const packages = [
  {
    id: "starter",
    name: "Starter",
    displayPrice: "R$ 4.90",
    displayPeriod: "one-time",
    billingDetail: "Approx. $0.99 total (~$0.015/min)",
    installment: "No recurring subscription",
    savings: null,
    minutes: "60 minutes",
    desc: "Great for quick one-off tasks and short clips",
    color: "#06B6D4",
    features: [
      "60 minutes of AI transcription",
      "Download in clean plain text (.TXT)",
      "Supports 1,700+ platforms and file uploads",
      "Automatic file deletion & privacy protection",
      "Valid for 6 months to use anytime",
    ],
    cta: "Buy Starter",
    popular: false,
    isFree: false,
  },
  {
    id: "pro",
    name: "Pro",
    displayPrice: "R$ 17.90",
    displayPeriod: "one-time",
    billingDetail: "Approx. $3.50 total (~$0.01/min)",
    installment: "No recurring subscription",
    savings: "Most Popular",
    minutes: "300 minutes",
    desc: "For content creators, editors and podcasters",
    color: "#7C3AED",
    features: [
      "300 minutes of AI transcription",
      "Download in .TXT, .SRT (Subtitles) and .DOCX (Word)",
      "Formatted PDF document export",
      "AI executive bullet summaries included",
      "Interactive audio player synced with timestamps",
      "Public reading link for easy sharing",
      "Supports 1,700+ platforms and file uploads",
      "Valid for 12 months to use anytime",
    ],
    cta: "Buy Pro",
    popular: true,
    isFree: false,
  },
  {
    id: "business",
    name: "Business",
    displayPrice: "R$ 79.90",
    displayPeriod: "one-time",
    billingDetail: "Approx. $15.00 total (~$0.015/min)",
    installment: "No recurring subscription",
    savings: null,
    minutes: "1,000 minutes",
    desc: "For agencies, production teams and power users",
    color: "#EC4899",
    features: [
      "1,000 minutes of AI transcription",
      "Download in all formats (.DOCX, .PDF, .SRT, .TXT)",
      "Unlimited AI executive summaries & takeaways",
      "Interactive audio player synced with timestamps",
      "Public reading link for sharing",
      "Unlimited permanent transcript history",
      "Priority 24/7 email and WhatsApp support",
      "Valid for 24 months to use anytime",
    ],
    cta: "Buy Business",
    popular: false,
    isFree: false,
  },
];

const annualSubscriptions = [
  {
    id: "starter_annual",
    name: "Starter Annual",
    displayPrice: "R$ 3.74",
    displayPeriod: "/ month",
    billingDetail: "R$ 44.90 billed annually (~$8.90/yr)",
    installment: "Pay via Credit Card or PIX",
    savings: "Save 30% (3 months free)",
    minutes: "720 min / yr (60 min/mo)",
    desc: "Transcribe every month with maximum annual savings",
    color: "#06B6D4",
    features: [
      "720 minutes per year (60 min/mo)",
      "Direct 30% annual savings (3 months free)",
      "Download in plain text (.TXT)",
      "Supports 1,700+ platforms & media files",
      "Automatic media deletion with privacy",
      "Guaranteed priority service year-round",
    ],
    cta: "Subscribe Starter Annual",
    popular: false,
    isFree: false,
  },
  {
    id: "pro_annual",
    name: "Pro Annual",
    displayPrice: "R$ 13.25",
    displayPeriod: "/ month",
    billingDetail: "R$ 159.00 billed annually (~$31.00/yr)",
    installment: "Pay via Credit Card or PIX",
    savings: "Save 30% (3 months free)",
    minutes: "3,600 min / yr (300 min/mo)",
    desc: "The favorite plan for digital creators, YouTubers & editors",
    color: "#7C3AED",
    features: [
      "3,600 minutes per year (300 min/mo)",
      "Save 30% compared to monthly purchases",
      "Download in .TXT, .SRT (Subtitles), .DOCX & .PDF",
      "AI executive bullet summaries included",
      "Interactive audio player synced with timestamps",
      "Public reading link for easy sharing",
      "Full permanent transcript history",
      "Maximum priority in the transcription queue",
    ],
    cta: "Subscribe Pro Annual",
    popular: true,
    isFree: false,
  },
  {
    id: "business_annual",
    name: "Business Annual",
    displayPrice: "R$ 56.58",
    displayPeriod: "/ month",
    billingDetail: "R$ 679.00 billed annually (~$135.00/yr)",
    installment: "Pay via Credit Card or PIX",
    savings: "Save 30% (3 months free)",
    minutes: "12,000 min / yr (1,000 min/mo)",
    desc: "The complete transcription solution for teams and agencies",
    color: "#EC4899",
    features: [
      "12,000 minutes per year (1,000 min/mo)",
      "Huge 30% annual discount",
      "Download in all formats (.DOCX, .PDF, .SRT, .TXT)",
      "Unlimited AI executive summaries & insights",
      "Interactive audio player synced with timestamps",
      "Public reading link for team sharing",
      "Unlimited permanent transcript history",
      "VIP 24/7 dedicated support via WhatsApp & email",
    ],
    cta: "Subscribe Business Annual",
    popular: false,
    isFree: false,
  },
];

const faqs = [
  {
    q: "What is included in the free trial?",
    a: "When you sign up, you automatically receive 5 free minutes to test any video or audio transcription without entering a credit card. Furthermore, through our referral program, you get +10 extra free minutes every time a friend signs up with your link.",
  },
  {
    q: "How does the annual discount work?",
    a: "With our annual plans, you pay once for the full year with a 30% discount (equivalent to 3 months free) and receive your entire yearly quota unlocked immediately to use whenever you need across 12 months.",
  },
  {
    q: "How are transcription minutes deducted?",
    a: "Each transcription deducts the actual duration of the media file rounded up to the nearest minute. For instance, a 2-minute and 15-second video consumes 3 minutes from your balance.",
  },
  {
    q: "Do purchased minutes expire?",
    a: "Pay-as-you-go packages remain valid between 6 and 24 months depending on the tier. Annual subscriptions provide continuous access with guaranteed minutes for 12 months.",
  },
  {
    q: "Can I transcribe audio in multiple languages?",
    a: "Yes! Our Whisper-powered AI supports over 90 languages including English, Spanish, Portuguese, French, German, and Italian with native punctuation and high accuracy.",
  },
  {
    q: "What happens to my video or audio files after transcription?",
    a: "We have a strict privacy-first policy: all uploaded or downloaded media files are permanently and automatically deleted from our servers immediately after transcription completes. Only your transcribed text remains safely in your account.",
  },
  {
    q: "Is payment processing safe and secure?",
    a: "100% secure. All payments are encrypted and processed through Stripe, the global standard in digital payment infrastructure. We never store or see your credit card information.",
  },
];

export default function EnglishPricingPage() {
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const activePlans = [freePlan, ...(billingCycle === "annual" ? annualSubscriptions : packages)];

  const handleFreePlan = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/login?signup=true&redirect=/en/pricing";
      }
    } catch {
      window.location.href = "/login?signup=true&redirect=/en/pricing";
    }
  };

  const handleBuyPlan = async (planId: string) => {
    setLoadingPlan(planId);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = `/login?redirect=/en/pricing&plan=${planId}`;
        return;
      }

      const refCode = typeof window !== "undefined" ? localStorage.getItem("pegueiotexto_ref") : null;

      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: planId,
          user_id: user.id,
          email: user.email,
          affiliate_code: refCode,
          success_url: `${window.location.origin}/dashboard?payment=success&plan=${planId}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/en/pricing?payment=cancelled`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert(data.detail || "Error initiating checkout. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to connect to payment server.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />
      <div style={{ paddingTop: "100px" }}>

        {/* HERO */}
        <section style={{ padding: "60px 0 30px", textAlign: "center" }}>
          <div className="container">
            <span className="badge badge-purple" style={{ marginBottom: "20px" }}>
              <Sparkles size={10} /> Fair & Transparent Pricing
            </span>
            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "16px", lineHeight: 1.1 }}>
              Choose the perfect plan for you
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "18px", maxWidth: 580, margin: "0 auto 32px" }}>
              Transcribe with 99.2% accuracy. Start for free with 5 minutes, save up to 30% on annual plans, or buy on-demand packages.
            </p>

            {/* BILLING CYCLE TOGGLE */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(124, 58, 237, 0.35)",
              borderRadius: "100px",
              padding: "6px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)"
            }}>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 22px",
                  borderRadius: "100px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  background: billingCycle === "annual" ? "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)" : "transparent",
                  color: billingCycle === "annual" ? "#FFFFFF" : "var(--text-secondary)",
                  boxShadow: billingCycle === "annual" ? "0 4px 14px rgba(124, 58, 237, 0.4)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                <span>Annual Subscription</span>
                <span style={{
                  fontSize: "10px",
                  background: "rgba(16, 185, 129, 0.25)",
                  color: "#6EE7B7",
                  border: "1px solid rgba(16, 185, 129, 0.45)",
                  borderRadius: "100px",
                  padding: "2px 8px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}>
                  3 months free
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "9px 22px",
                  borderRadius: "100px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  background: billingCycle === "monthly" ? "rgba(255, 255, 255, 0.12)" : "transparent",
                  color: billingCycle === "monthly" ? "#FFFFFF" : "var(--text-secondary)",
                  transition: "all 0.2s ease",
                }}
              >
                <span>Pay-As-You-Go Packages</span>
              </button>
            </div>
          </div>
        </section>

        {/* PRICING CARDS */}
        <section style={{ padding: "0 0 80px" }}>
          <div className="container" style={{ maxWidth: 1320 }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              alignItems: "stretch",
              paddingTop: "24px",
            }}>
              {activePlans.map((plan: any) => (
                <div
                  key={plan.id}
                  className={`pricing-card ${plan.popular ? "featured" : ""}`}
                  style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {plan.popular && (
                    <div style={{
                      position: "absolute",
                      top: "-14px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
                      color: "#FFFFFF",
                      fontSize: "11px",
                      fontWeight: 800,
                      padding: "5px 18px",
                      borderRadius: "100px",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      boxShadow: "0 4px 16px rgba(124, 58, 237, 0.55)",
                      zIndex: 20,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                    }}>
                      <Sparkles size={11} /> Most Popular
                    </div>
                  )}

                  <div>
                    {/* Plan header */}
                    <div style={{ marginBottom: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                        <div style={{ width: 34, height: 34, background: `${plan.color}18`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {plan.id === "free" ? (
                            <Sparkles size={18} color={plan.color} />
                          ) : plan.id.includes("business") ? (
                            <Crown size={18} color={plan.color} />
                          ) : plan.id.includes("pro") ? (
                            <Flame size={18} color={plan.color} />
                          ) : (
                            <Zap size={18} color={plan.color} />
                          )}
                        </div>
                        <h2 style={{ fontSize: "20px", fontWeight: 800 }}>{plan.name}</h2>
                      </div>
                      <p style={{ color: "var(--text-muted)", fontSize: "13px", minHeight: "36px", lineHeight: "1.4" }}>{plan.desc}</p>
                    </div>

                    {/* Savings tag */}
                    <div style={{ minHeight: "28px", marginBottom: "10px" }}>
                      {plan.savings && (
                        <div style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: "8px",
                          background: "rgba(16, 185, 129, 0.12)",
                          border: "1px solid rgba(16, 185, 129, 0.35)",
                          color: "#6EE7B7",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}>
                          {plan.savings}
                        </div>
                      )}
                    </div>

                    {/* Price - Monthly Highlighted */}
                    <div style={{ marginBottom: "22px" }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
                        <span
                          className="price-amount"
                          style={{
                            color: plan.color,
                            fontSize: "2.35rem",
                            fontWeight: 900,
                            letterSpacing: "-0.03em",
                            whiteSpace: "nowrap",
                            display: "inline-flex",
                            alignItems: "baseline",
                            lineHeight: 1,
                          }}
                        >
                          <span>{plan.displayPrice}</span>
                        </span>
                        <span style={{ color: "var(--text-muted)", fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap" }}>
                          {plan.displayPeriod}
                        </span>
                      </div>

                      {/* Lower weight details box */}
                      <div style={{
                        marginTop: "8px",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        minHeight: "48px",
                        justifyContent: "center",
                      }}>
                        <span style={{ color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600 }}>
                          {plan.billingDetail}
                        </span>
                        {plan.installment && (
                          <span style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 500 }}>
                            {plan.installment}
                          </span>
                        )}
                      </div>

                      <p style={{
                        color: "var(--text-primary)",
                        fontSize: "13px",
                        fontWeight: 700,
                        marginTop: "10px",
                        marginBottom: "0",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        background: `${plan.color}12`,
                        padding: "6px 10px",
                        borderRadius: "8px",
                        border: `1px solid ${plan.color}25`,
                      }}>
                        <Clock size={14} color={plan.color} /> {plan.minutes}
                      </p>
                    </div>

                    {/* Features list */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "11px", marginBottom: "26px" }}>
                      {plan.features.map((f: string) => (
                        <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <Check size={16} color={plan.color} style={{ flexShrink: 0, marginTop: "2px" }} />
                          <span style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.45 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    id={`btn-plan-${plan.id}`}
                    className={plan.popular ? "btn-primary" : "btn-secondary"}
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      padding: "14px",
                      fontSize: "14px",
                      fontWeight: 700,
                      opacity: loadingPlan === plan.id ? 0.7 : 1,
                      cursor: loadingPlan ? "not-allowed" : "pointer",
                      ...(plan.isFree ? {
                        background: "rgba(16, 185, 129, 0.12)",
                        borderColor: "rgba(16, 185, 129, 0.4)",
                        color: "#6EE7B7",
                      } : {}),
                    }}
                    onClick={() => plan.isFree ? handleFreePlan() : handleBuyPlan(plan.id)}
                    disabled={loadingPlan !== null}
                  >
                    {loadingPlan === plan.id ? (
                      "Connecting to checkout..."
                    ) : (
                      <>{plan.cta} <ArrowRight size={15} /></>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "0 0 100px" }}>
          <div className="container">
            <div style={{ maxWidth: 740, margin: "0 auto" }}>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "40px", textAlign: "center" }}>
                Frequently Asked Questions
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    id={`faq-${i}`}
                    className="glass-card"
                    style={{ padding: "0", cursor: "pointer", overflow: "hidden" }}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                      <p style={{ fontWeight: 600, fontSize: "15px", margin: 0 }}>{faq.q}</p>
                      <span style={{ color: "var(--brand-primary)", fontSize: "20px", flexShrink: 0, transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                    </div>
                    {openFaq === i && (
                      <div style={{ padding: "0 24px 20px", borderTop: "1px solid var(--border-subtle)" }}>
                        <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.7", marginTop: "16px", margin: 0 }}>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
