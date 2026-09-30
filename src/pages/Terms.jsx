// src/pages/Terms.jsx
import React from "react";
import TopBar from "../components/TopBar";
import DownBar from "../components/DownBar";

/* ================= STYLES ================= */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');

.tm-root { font-family: 'Hind Siliguri', 'Noto Sans Bengali', 'Kalpurush', system-ui, sans-serif; }
.tm-num { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; font-variant-numeric: tabular-nums; }
`;

const NAVY_CARD_BG = "radial-gradient(900px 420px at 15% -20%, #17495a 0%, #0A1F2E 65%)";

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

const DocIcon = ({ className }) => (
  <Svg className={className}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </Svg>
);

const CoinIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="9" />
    <path d="M14.5 9.5c-.4-.9-1.4-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1.1 0-2.1-.6-2.5-1.5M12 6.5V8M12 16v1.5" />
  </Svg>
);

const EditIcon = () => (
  <Svg>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </Svg>
);

const LockIcon = () => (
  <Svg>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </Svg>
);

const ClockIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

const HeadsetIcon = () => (
  <Svg>
    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
    <rect x="3" y="14" width="4" height="6" rx="1.5" />
    <rect x="17" y="14" width="4" height="6" rx="1.5" />
  </Svg>
);

/* ================= SMALL COMPONENTS ================= */

const Section = ({ icon, title, children }) => (
  <section className="rounded-3xl border border-[#E9E2CF] bg-white p-5 shadow-[0_10px_40px_-20px_rgba(10,31,46,0.25)] sm:p-6">
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#C9A24B]/50 bg-[#0A1F2E] text-[#E6C878]">
        {icon}
      </span>
      <h3 className="text-[18px] font-bold text-[#0A1F2E]">{title}</h3>
    </div>
    {children}
  </section>
);

const Point = ({ children }) => (
  <li className="flex items-start gap-3">
    <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A24B]" />
    <span>{children}</span>
  </li>
);

const SubTitle = ({ children }) => (
  <h4 className="mb-1 text-[16px] font-bold text-[#8A6A1F]">{children}</h4>
);

/* ================= MAIN ================= */

const Terms = () => {
  return (
    <div className="tm-root min-h-screen bg-[#FAF8F3] pb-28 text-[#0A1F2E]">
      <style>{styles}</style>
      <TopBar />

      <main className="mx-auto mt-6 max-w-3xl space-y-6 px-4">
        {/* ===== HEADER ===== */}
        <section
          className="relative overflow-hidden rounded-3xl border border-[#C9A24B]/40 p-6 text-white shadow-[0_24px_60px_-24px_rgba(10,31,46,0.8)] sm:p-8"
          style={{ background: NAVY_CARD_BG }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E6C878] to-transparent" />

          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#E6C878]">
              <DocIcon className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold">নিয়মাবলী ও শর্তাবলী</h1>
              <p className="text-[14px] text-white/70">ক্ষুদ্র ঋণ উন্নয়ন প্রজেক্ট</p>
            </div>
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-white/80">
            আমাদের সাথে থাকার জন্য ধন্যবাদ! খুব সহজেই আপনি ঘরে বসে ঋণ নিতে পারেন।{" "}
            <span className="tm-num font-semibold text-[#E6C878]">20 হাজার</span> থেকে{" "}
            <span className="tm-num font-semibold text-[#E6C878]">50 লক্ষ</span> টাকা পর্যন্ত ঋণ গ্রহণ সম্ভব।
            অনুগ্রহ করে নিচের শর্তাবলী মনোযোগ সহকারে পড়ুন।
          </p>
        </section>

        {/* ===== LOAN RULES ===== */}
        <Section icon={<DocIcon />} title="ঋণ সম্পর্কিত শর্তাবলী">
          <ul className="space-y-3 text-[15px] leading-relaxed text-[#33404A]">
            <Point>
              প্রতি মাসের <span className="tm-num font-semibold">1–10</span> তারিখের মধ্যে বিকাশ/নগদ কিস্তি
              পরিশোধ করতে হবে।
            </Point>
            <Point>
              যদি কোনো মাসে কিস্তি পরিশোধ করতে না পারেন, পরবর্তী দুই মাসের কিস্তি একত্রে পরিশোধ করা যাবে।
            </Point>
            <Point>দুই মাসের বেশি কিস্তি বাকি থাকলে অতিরিক্ত জরিমানা প্রযোজ্য হতে পারে।</Point>
            <Point>ফোন বা মেসেজে প্রয়োজন ছাড়া যোগাযোগ এড়িয়ে চলুন।</Point>
            <Point>
              ভুল তথ্য দেওয়া থেকে বিরত থাকুন; ভুয়া বা ভুল তথ্য দিলে ব্যাংক বা কর্তৃপক্ষ আইনি ব্যবস্থা নিতে
              পারে।
            </Point>
          </ul>
        </Section>

        {/* ===== FEES ===== */}
        <Section icon={<CoinIcon />} title="জামানত / অগ্রিম ফি">
          <p className="text-[15px] leading-relaxed text-[#33404A]">
            ঋণ গ্রহণের ক্ষমতা যাচাই বা বীমার উদ্দেশ্যে সাময়িক ফি নেওয়া হতে পারে। ফি যাচাই বা বীমা কিস্তি
            পরিশোধের পরে পুরো ফি ফেরত দেওয়া হবে।
          </p>

          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#EBDCA8] bg-[#FDF6E3] p-4">
            <span className="mt-0.5 text-[#B07A10]">
              <EditIcon />
            </span>
            <div className="text-[15px] leading-relaxed text-[#5C4512]">
              <SubTitle>তথ্য সংশোধন ফি</SubTitle>
              একাউন্ট নম্বর বা ব্যক্তিগত তথ্য ভুল হলে সংশোধনের জন্য ফি প্রযোজ্য হতে পারে।
            </div>
          </div>
        </Section>

        {/* ===== PASSWORD ===== */}
        <Section icon={<LockIcon />} title="পাসওয়ার্ড সম্পর্কিত">
          <p className="text-[15px] leading-relaxed text-[#33404A]">
            পাসওয়ার্ড ভুলে গেলে অবিলম্বে আমাদের গ্রাহক প্রতিনিধির সাথে যোগাযোগ করুন।
          </p>
        </Section>

        {/* ===== DURATION ===== */}
        <Section icon={<ClockIcon />} title="ঋণ গ্রহণের সময়সীমা">
          <p className="text-[15px] leading-relaxed text-[#33404A]">
            ঋণ কত দ্রুত সম্পূর্ণ হবে তা ঋণের পরিমাণ ও যাচাইকরণের প্রক্রিয়ার উপর নির্ভর করে। সাধারণত কয়েক
            ঘণ্টা থেকে <span className="tm-num font-semibold">1–5</span> দিন সময় লাগতে পারে।
          </p>
        </Section>

        {/* ===== SUPPORT ===== */}
        <section
          className="relative overflow-hidden rounded-3xl border border-[#C9A24B]/40 p-6 text-white shadow-[0_24px_60px_-24px_rgba(10,31,46,0.8)]"
          style={{ background: NAVY_CARD_BG }}
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-[#E6C878]">
              <HeadsetIcon />
            </span>
            <h3 className="text-[18px] font-bold">সাহায্য ও যোগাযোগ</h3>
          </div>

          <p className="text-[15px] leading-relaxed text-white/80">
            সাহায্য পেতে আমাদের সাথে চ্যাট করুন অথবা নিচে দেওয়া যোগাযোগ মাধ্যমগুলো ব্যবহার করুন।
          </p>

          <div className="mt-5 grid gap-3 text-[14px] sm:grid-cols-2">
            <InfoBox label="ঠিকানা">
              বোরাক টাওয়ার <span className="tm-num">7</span>ম তলা, <span className="tm-num">71-72</span> পুরাতন
              এ্যলিফ্যান্ট রোড, ঢাকা।
            </InfoBox>
            <InfoBox label="কার্যক্রম">
              সকাল <span className="tm-num">9</span>টা থেকে রাত <span className="tm-num">9</span>টা (শনিবার –
              বৃহস্পতিবার)
            </InfoBox>
            <InfoBox label="WhatsApp">
              <a
                href="https://wa.me/8801884503477"
                className="tm-num font-semibold text-[#E6C878] underline underline-offset-4"
              >
                +880 1884-503477
              </a>
            </InfoBox>
            <InfoBox label="IMO">
              <span className="tm-num font-semibold text-[#E6C878]">+880 1884-503477</span>
            </InfoBox>
          </div>
        </section>
      </main>

      <DownBar />
    </div>
  );
};

const InfoBox = ({ label, children }) => (
  <div className="rounded-xl bg-white/10 p-3.5">
    <p className="text-white/65">{label}</p>
    <p className="mt-0.5 text-[15px] font-medium leading-relaxed text-white">{children}</p>
  </div>
);

export default Terms;
