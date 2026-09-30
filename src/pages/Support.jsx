// src/pages/Support.jsx
import React from "react";
import TopBar from "../components/TopBar";
import DownBar from "../components/DownBar";

/* ================= STYLES ================= */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');

.sp-root { font-family: 'Hind Siliguri', 'Noto Sans Bengali', 'Kalpurush', system-ui, sans-serif; }
.sp-num { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; font-variant-numeric: tabular-nums; }
`;

const NAVY_CARD_BG = "radial-gradient(900px 420px at 15% -20%, #17495a 0%, #0A1F2E 65%)";

const GOLD_BTN =
  "bg-gradient-to-b from-[#E8CB7E] via-[#C9A24B] to-[#B48A34] text-[#1B1405] " +
  "shadow-[0_10px_24px_-8px_rgba(201,162,75,0.75),inset_0_1px_0_rgba(255,255,255,0.55)] " +
  "hover:brightness-105 active:translate-y-px " +
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C9A24B]/40";

/* ================= ICONS ================= */

const Svg = ({ children, className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const HeadsetIcon = () => (
  <Svg className="w-6 h-6">
    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
    <rect x="3" y="14" width="4" height="6" rx="1.5" />
    <rect x="17" y="14" width="4" height="6" rx="1.5" />
  </Svg>
);

const PinIcon = () => (
  <Svg>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Svg>
);

const ClockIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

const ChatIcon = () => (
  <Svg>
    <path d="M21 12a8 8 0 0 1-11.8 7L3 20l1.2-4.8A8 8 0 1 1 21 12z" />
  </Svg>
);

/* ================= SMALL COMPONENTS ================= */

const InfoCard = ({ icon, title, children }) => (
  <section className="rounded-3xl border border-[#E9E2CF] bg-white p-5 shadow-[0_10px_40px_-20px_rgba(10,31,46,0.25)] sm:p-6">
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#C9A24B]/50 bg-[#0A1F2E] text-[#E6C878]">
        {icon}
      </span>
      <h2 className="text-[18px] font-bold text-[#0A1F2E]">{title}</h2>
    </div>
    <div className="mt-4 border-t border-[#F0EBDD] pt-4 text-[16px] leading-relaxed text-[#33404A]">
      {children}
    </div>
  </section>
);

/* ================= MAIN ================= */

const Support = () => {
  return (
    <div className="sp-root min-h-screen bg-[#FAF8F3] pb-28 text-[#0A1F2E]">
      <style>{styles}</style>
      <TopBar />

      <main className="mx-auto mt-6 max-w-2xl space-y-6 px-4">
        {/* ===== HEADER ===== */}
        <section
          className="relative overflow-hidden rounded-3xl border border-[#C9A24B]/40 p-6 text-white shadow-[0_24px_60px_-24px_rgba(10,31,46,0.8)] sm:p-8"
          style={{ background: NAVY_CARD_BG }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E6C878] to-transparent" />

          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#E6C878]">
              <HeadsetIcon />
            </span>
            <div>
              <h1 className="text-2xl font-bold">সাহায্য ও যোগাযোগ</h1>
              <p className="text-[14px] text-white/70">ক্ষুদ্র ঋণ উন্নয়ন প্রজেক্ট</p>
            </div>
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-white/80">
            যেকোনো প্রশ্ন বা সমস্যায় আমাদের গ্রাহক প্রতিনিধি আপনাকে সাহায্য করতে প্রস্তুত।
          </p>
        </section>

        {/* ===== ADDRESS ===== */}
        <InfoCard icon={<PinIcon />} title="ঠিকানা">
          <p>
            বেইস এজওয়াটার, <span className="sp-num">12</span>, গুলশান নর্থ অ্যাভিনিউ, গুলশান-
            <span className="sp-num">2</span>, ঢাকা-<span className="sp-num">1212</span>, বাংলাদেশ
          </p>
        </InfoCard>

        {/* ===== WORKING HOURS ===== */}
        <InfoCard icon={<ClockIcon />} title="কার্যক্রম">
          <p>
            সকাল <span className="sp-num">9</span>টা থেকে রাত <span className="sp-num">9</span>টা, শনি থেকে
            বৃহস্পতিবার
          </p>
        </InfoCard>

        {/* ===== WHATSAPP ===== */}
        <a
          href="https://wa.me/8801884503477"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex w-full items-center justify-center gap-2.5 rounded-xl py-4 text-[17px] font-semibold transition ${GOLD_BTN}`}
        >
          <ChatIcon />
          <span>WhatsApp-এ চ্যাট করুন</span>
        </a>
      </main>

      <DownBar />
    </div>
  );
};

export default Support;
