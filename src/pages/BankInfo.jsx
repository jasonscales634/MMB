import React, { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import DownBar from "../components/DownBar";
import api from "../services/api";

/* ================= STYLES ================= */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
.bi-root { font-family: 'Hind Siliguri', 'Noto Sans Bengali', 'Kalpurush', system-ui, sans-serif; }
.bc-mono { font-family: 'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace; }
.bc-emboss {
  background: linear-gradient(180deg, #FFF3CF 0%, #E9CB85 55%, #B98F3E 100%);
  -webkit-background-clip: text; background-clip: text;
  color: transparent; -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 1px 0 rgba(0,0,0,.55));
}
`;

/* ================= HELPERS ================= */

const CARD_BG =
  "linear-gradient(135deg, #141A4A 0%, #0A0E2A 52%, #1C2158 100%)";

const CARD_SHADOW =
  "0 34px 60px -24px rgba(8,10,40,0.8), 0 0 0 1px rgba(233,203,133,0.28), inset 0 1px 0 rgba(255,255,255,0.14)";

// প্রথম ৪ ও শেষ ৪ ডিজিট দেখায়, মাঝের অংশ ডট দিয়ে ঢাকা
const buildNumber = (num) => {
  if (!num) return "•••• •••• •••• ••••";

  const clean = String(num).replace(/\s+/g, "");
  if (clean.length <= 8) return "•••• •••• •••• ••••";

  const first = clean.slice(0, 4);
  const last = clean.slice(-4);
  const middleLen = clean.length - 8;
  const middle = "•".repeat(middleLen).match(/.{1,4}/g) || [];

  return [first, ...middle, last].join(" ");
};

/* ================= ICONS ================= */

const Svg = ({ children, className = "w-5 h-5", strokeWidth = 1.8 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const AlertIcon = () => (
  <Svg className="w-6 h-6" strokeWidth={1.9}>
    <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    <path d="M12 9v4M12 17h.01" />
  </Svg>
);

/* ================= CARD PARTS ================= */

const VisaMark = ({ className = "" }) => (
  <span
    className={`italic font-black text-white ${className}`}
    style={{
      fontFamily: "'Arial Black', 'Segoe UI', Arial, sans-serif",
      letterSpacing: "-0.04em",
    }}
  >
    VISA
  </span>
);

const Chip = () => (
  <svg viewBox="0 0 50 38" className="h-9 w-12 sm:h-10 sm:w-14" aria-hidden="true">
    <defs>
      <linearGradient id="bcChipGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#F6E0A0" />
        <stop offset="0.5" stopColor="#D6B25E" />
        <stop offset="1" stopColor="#A98130" />
      </linearGradient>
    </defs>
    <rect x="1" y="1" width="48" height="36" rx="6" fill="url(#bcChipGrad)" stroke="#8A6A1F" strokeWidth="1" />
    <path
      d="M1 13h14v12H1M49 13H35v12h14M15 13V1M35 13V1M15 25v12M35 25v12M15 19h20"
      stroke="#8A6A1F"
      strokeWidth="1"
      fill="none"
      opacity="0.65"
    />
  </svg>
);

const Contactless = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-7 w-7 text-[#E9CB85]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M8.5 8.5a5 5 0 0 1 0 7" />
    <path d="M12 6a8.5 8.5 0 0 1 0 12" />
    <path d="M15.5 3.5a12 12 0 0 1 0 17" />
  </svg>
);

const CardShine = () => (
  <>
    {/* fine guilloche-style pattern */}
    <div
      className="absolute inset-0 opacity-[0.16]"
      style={{
        backgroundImage:
          "repeating-radial-gradient(circle at 115% -10%, transparent 0 9px, rgba(233,203,133,0.55) 9px 10px)",
      }}
    />
    {/* soft light sweep */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-black/30" />
    <div
      className="absolute -left-10 top-0 h-full w-1/3 -skew-x-12 opacity-40"
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)",
      }}
    />
  </>
);

/* ================= PAGE ================= */

const BankInfo = () => {
  const [form, setForm] = useState({
    account_number: "",
    account_holder_name: "",
    status: "inactive",
    cvv: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ================= LOAD USER =================
  const loadUser = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await api.get("/user/kyc/me");

      setForm({
        account_number: res.data.unique_id || "",
        account_holder_name: res.data.full_name || "N/A",
        // কার্ডের স্ট্যাটাস ব্যাকএন্ড থেকে আসে (ডিফল্ট: inactive)
        status: res.data.card_status || "inactive",
        // CVV ব্যাকএন্ড থেকে অটো জেনারেট হয়ে আসে
        cvv: res.data.cvv || "",
      });
    } catch (err) {
      console.error("User load failed", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="bi-root flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FAF8F3]">
        <style>{styles}</style>

        <svg className="h-10 w-10 animate-spin text-[#C9A24B]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
          <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>

        <p className="text-[17px] font-semibold text-[#0A1F2E]">
          ব্যবহারকারীর তথ্য লোড হচ্ছে...
        </p>
      </div>
    );
  }

  const isActive = String(form.status || "").toLowerCase() === "active";
  const number = buildNumber(form.account_number);

  return (
    <div className="bi-root min-h-screen bg-[#FAF8F3] pb-28 text-[#0A1F2E]">
      <style>{styles}</style>

      <TopBar />

      {/* ================= TOP BAR: INACTIVE ================= */}
      {!error && !isActive && (
        <div
          role="alert"
          className="flex items-center justify-center gap-2 bg-[#B02F2F] px-4 py-2.5 text-[16px] font-bold text-white"
        >
          <AlertIcon />
          কার্ডটি সক্রিয় নয়
        </div>
      )}

      <main className="mx-auto mt-8 max-w-3xl space-y-6 px-4">
        <h1 className="text-2xl font-bold">আমার কার্ড</h1>

        {/* ================= ERROR ================= */}
        {error && (
          <section className="flex flex-col gap-4 rounded-2xl border border-[#F0C9C9] bg-[#FCEFEF] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5 text-[#B02F2F]">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F9D9D9]">
                <AlertIcon />
              </span>

              <p className="text-[16px] font-semibold">
                ব্যবহারকারীর তথ্য লোড করতে সমস্যা হয়েছে
              </p>
            </div>

            <button
              onClick={loadUser}
              className="shrink-0 rounded-xl bg-[#0A1F2E] px-6 py-2.5 text-[16px] font-semibold text-white
                         transition hover:bg-[#123244] active:translate-y-px
                         focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0A1F2E]/30"
            >
              আবার চেষ্টা করুন
            </button>
          </section>
        )}

        {/* ================= FRONT ================= */}
        <div className="relative mx-auto mt-2 w-full max-w-md">
          <div
            className="relative aspect-[1.586/1] w-full select-none overflow-hidden rounded-[22px] text-white"
            style={{ background: CARD_BG, boxShadow: CARD_SHADOW }}
          >
            <CardShine />

            <div className="relative flex h-full flex-col justify-between p-5 pt-6 sm:p-6">
              {/* TOP */}
              <div className="flex items-start justify-between gap-3">
                <p className="truncate text-[13px] font-semibold text-[#F1DFB0] sm:text-[14px]">
                  ক্ষুদ্র-ঋণ উন্নয়ন প্রকল্প
                </p>

                <Contactless />
              </div>

              {/* CHIP */}
              <Chip />

              {/* NUMBER */}
              <p className="bc-mono bc-emboss text-[19px] font-semibold tracking-[0.12em] sm:text-[25px]">
                {number}
              </p>

              {/* BOTTOM */}
              <div className="flex items-end justify-between gap-3">
                <div className="flex min-w-0 items-end gap-5">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-[#E9CB85]/70">
                      Valid Thru
                    </p>
                    <p className="bc-mono text-[14px] font-semibold tracking-wide">12/29</p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] uppercase tracking-wider text-[#E9CB85]/70">
                      Card Holder
                    </p>
                    <p className="truncate text-[14px] font-semibold uppercase tracking-wide">
                      {form.account_holder_name}
                    </p>
                  </div>
                </div>

                <VisaMark className="shrink-0 text-[28px] sm:text-[34px]" />
              </div>
            </div>
          </div>
        </div>

        {/* ================= BACK ================= */}
        <div className="relative mx-auto mt-2 w-full max-w-md">
          <div
            className="relative aspect-[1.586/1] w-full select-none overflow-hidden rounded-[22px] text-white"
            style={{ background: CARD_BG, boxShadow: CARD_SHADOW }}
          >
            <CardShine />

            <div className="relative flex h-full flex-col">
              {/* MAGNETIC STRIPE */}
              <div
                className="mt-7 h-11 sm:mt-8 sm:h-12"
                style={{
                  background:
                    "linear-gradient(180deg, #1A1A22 0%, #050508 50%, #14141B 100%)",
                }}
              />

              {/* SIGNATURE PANEL + CVV */}
              <div className="mt-4 flex items-end gap-2 px-5 sm:px-6">
                <div
                  className="h-10 flex-1 rounded-sm"
                  style={{
                    background:
                      "repeating-linear-gradient(135deg, #ffffff 0 6px, #EFEBDD 6px 12px)",
                  }}
                />

                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-[#E9CB85]/80">
                    CVV
                  </span>
                  <div className="bc-mono flex h-10 w-16 items-center justify-center rounded-sm bg-white text-[17px] font-semibold italic tracking-[0.2em] text-[#0A1F2E]">
                    {form.cvv || "•••"}
                  </div>
                </div>
              </div>

              <p className="mt-3 px-5 text-[11px] leading-snug text-white/60 sm:px-6">
                এই কার্ডটি ক্ষুদ্র-ঋণ উন্নয়ন প্রকল্পের সম্পত্তি।
              </p>

              {/* STATUS + HOLOGRAM + LOGO */}
              <div className="mt-auto flex items-end justify-between px-5 pb-5 sm:px-6">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[13px] font-semibold ${
                    isActive
                      ? "bg-[#1F9D6B]/25 text-[#8CF0C1]"
                      : "bg-white/15 text-white/80"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isActive ? "bg-[#3DDC97]" : "bg-white/60"
                    }`}
                  />
                  {isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                </span>

                <div className="flex items-center gap-3">
                  <span
                    className="h-8 w-8 rounded-full opacity-90 ring-1 ring-white/30"
                    style={{
                      background:
                        "conic-gradient(from 210deg, #F6E0A0, #9FD8FF, #E3B6FF, #F6E0A0, #B7F0D0, #F6E0A0)",
                    }}
                    aria-hidden="true"
                  />
                  <VisaMark className="text-[24px]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM: CONTACT ================= */}
        {!error && !isActive && (
          <p className="mx-auto max-w-md text-center text-[16px] font-semibold leading-snug text-[#B02F2F]">
            কার্ডটি সক্রিয় করতে গ্রাহক প্রতিনিধির সাথে যোগাযোগ করুন
          </p>
        )}

      </main>

      <DownBar />
    </div>
  );
};

export default BankInfo;
