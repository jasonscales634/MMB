// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import drYunus from "../assets/icons/DrYunus.png";
import bangladeshBank from "../assets/icons/Bangladesh-Bank.jpg";
import photo1 from "../assets/icons/photo1.jpg";

const images = [drYunus, bangladeshBank, photo1];

/* ================= STYLES ================= */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');

.hm-root { font-family: 'Hind Siliguri', 'Noto Sans Bengali', 'Kalpurush', system-ui, sans-serif; }

@keyframes hmHeroIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
.hm-hero-in { animation: hmHeroIn .7s ease-out both; }

@media (prefers-reduced-motion: reduce) {
  .hm-hero-in { animation: none !important; }
}
`;

/* ================= BUTTON STYLES ================= */

const GOLD_BTN =
  "bg-gradient-to-b from-[#E8CB7E] via-[#C9A24B] to-[#B48A34] text-[#1B1405] " +
  "shadow-[0_10px_24px_-8px_rgba(201,162,75,0.75),inset_0_1px_0_rgba(255,255,255,0.55)] " +
  "hover:brightness-105 active:translate-y-px " +
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C9A24B]/40";

const GHOST_BTN =
  "border border-white/30 text-white hover:bg-white/10 active:translate-y-px " +
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30";

/* ================= ICONS ================= */

const Svg = ({ children, className = "w-6 h-6", strokeWidth = 1.7 }) => (
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

const ShieldIcon = () => (
  <Svg>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </Svg>
);

const BoltIcon = () => (
  <Svg>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </Svg>
);

const DocIcon = () => (
  <Svg>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M9 15l2 2 4-4" />
  </Svg>
);

/* ================= CONTENT ================= */

const features = [
  {
    icon: <ShieldIcon />,
    title: "১০০% নিরাপদ",
    text: "এনক্রিপ্টেড সিস্টেমে আপনার তথ্য সুরক্ষিত থাকে।",
  },
  {
    icon: <BoltIcon />,
    title: "দ্রুত অনুমোদন",
    text: "ডিজিটাল প্রক্রিয়ায় আপনার আবেদন দ্রুত যাচাই করা হয়।",
  },
  {
    icon: <DocIcon />,
    title: "সহজ আবেদন",
    text: "কোনো ঝামেলা নেই। মোবাইল থেকেই আবেদন করুন।",
  },
];

const steps = [
  {
    title: "নিবন্ধন করুন",
    text: "নাম, ফোন নম্বর ও পাসওয়ার্ড দিয়ে অ্যাকাউন্ট খুলুন।",
  },
  {
    title: "ব্যক্তিগত তথ্য দিন",
    text: "পরিচয় ও ঠিকানার তথ্য জমা দিন।",
  },
  {
    title: "ঋণের আবেদন করুন",
    text: "প্রয়োজনীয় ঋণের পরিমাণ ও মেয়াদ দিয়ে আবেদন জমা দিন।",
  },
  {
    title: "অনুমোদনের অপেক্ষা করুন",
    text: "যাচাই শেষে আপনার আবেদনের অবস্থা জানানো হবে।",
  },
];

/* ================= HOME ================= */

const Home = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  // ================= SLIDER =================
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hm-root min-h-screen bg-[#FAF8F3] text-[#0A1F2E]">
      <style>{styles}</style>

      {/* ================= HERO ================= */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-[#0A1F2E] text-white">
        {/* SLIDER IMAGES */}
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F2E] via-[#0A1F2E]/80 to-[#0A1F2E]/50 md:bg-gradient-to-r md:from-[#0A1F2E] md:via-[#0A1F2E]/80 md:to-[#0A1F2E]/30" />

        {/* CONTENT */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-24">
          <div className="hm-hero-in max-w-2xl">
            <p className="mb-4 text-lg font-semibold text-[#E6C878]">
              ক্ষুদ্র ঋণ উন্নয়ন প্রকল্প
            </p>

            <h1 className="text-4xl font-bold leading-[1.25] md:text-6xl md:leading-[1.2]">
              সহজ, দ্রুত ও নিরাপদ লোন
              <br />
              আপনার দোরগোড়ায়
            </h1>

            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/80">
              ঘরে বসেই অনলাইনে আবেদন করুন। কাগজপত্রের ঝামেলা ছাড়া ডিজিটাল
              প্রক্রিয়ায় আপনার ঋণের আবেদন জমা দিন।
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/register")}
                className={`rounded-xl px-8 py-3.5 text-[17px] font-semibold transition ${GOLD_BTN}`}
              >
                এখনই আবেদন করুন
              </button>

              <button
                onClick={() => navigate("/login")}
                className={`rounded-xl px-8 py-3.5 text-[17px] font-medium transition ${GHOST_BTN}`}
              >
                লগইন করুন
              </button>
            </div>
          </div>
        </div>

        {/* SLIDER DOTS */}
        <div className="absolute inset-x-0 bottom-6 z-20">
          <div className="mx-auto flex max-w-6xl gap-2 px-5">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrent(idx)}
                aria-label={`স্লাইড ${idx + 1}`}
                aria-current={current === idx}
                className={`h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24B] ${
                  current === idx ? "w-7 bg-[#C9A24B]" : "w-2.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-2xl font-bold md:text-3xl">কেন আমাদের বেছে নেবেন</h2>

        <div className="mt-10 grid grid-cols-1 gap-y-10 md:grid-cols-3 md:divide-x md:divide-[#E3DDCC]">
          {features.map((item) => (
            <div key={item.title} className="md:px-8 md:first:pl-0 md:last:pr-0">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#C9A24B]/50 bg-[#C9A24B]/10 text-[#8A6A1F]">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold">{item.title}</h3>

              <p className="mt-2 text-[16px] leading-relaxed text-[#5B6770]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= STEPS ================= */}
      <section className="border-y border-[#E3DDCC] bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">চার ধাপে আবেদন</h2>

            <p className="mt-3 max-w-sm text-[16px] leading-relaxed text-[#5B6770]">
              পুরো প্রক্রিয়া অনলাইনে। প্রতিটি ধাপ শেষ করলেই আবেদন পরের ধাপে এগিয়ে যায়।
            </p>
          </div>

          <ol>
            {steps.map((step, index) => (
              <li key={step.title} className="relative flex gap-5 pb-9 last:pb-0">
                {index < steps.length - 1 && (
                  <span className="absolute left-5 top-11 bottom-0 w-px bg-[#DDD3B8]" />
                )}

                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0A1F2E] text-[17px] font-bold text-[#E6C878]">
                  {index + 1}
                </span>

                <div className="pt-1">
                  <h3 className="text-lg font-bold">{step.title}</h3>

                  <p className="mt-1 text-[16px] leading-relaxed text-[#5B6770]">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div
          className="flex flex-col gap-6 rounded-3xl border border-[#C9A24B]/40 px-7 py-10 text-white md:flex-row md:items-center md:justify-between md:px-12"
          style={{
            background:
              "radial-gradient(900px 400px at 20% -20%, #17495a 0%, #0A1F2E 65%)",
          }}
        >
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold md:text-3xl">আজই আবেদন শুরু করুন</h2>

            <p className="mt-2 text-[16px] leading-relaxed text-white/75">
              অ্যাকাউন্ট খুলে ব্যক্তিগত তথ্য জমা দিলেই আপনার ঋণের আবেদন প্রক্রিয়া শুরু হবে।
            </p>
          </div>

          <button
            onClick={() => navigate("/register")}
            className={`shrink-0 rounded-xl px-8 py-3.5 text-[17px] font-semibold transition ${GOLD_BTN}`}
          >
            নিবন্ধন করুন
          </button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0A1F2E] py-10 text-white/70">
        <div className="mx-auto max-w-6xl px-5 text-center text-[15px]">
          <p>© ২০২৬ লোন সিস্টেম। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
