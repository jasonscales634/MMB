import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DownBar from "../components/DownBar";
import api from "../services/api";

import bkashIcon from "../assets/icons/BKash.png";
import nagadIcon from "../assets/icons/Nagad.png";

/* ================= STYLES ================= */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');

.wd-root { font-family: 'Hind Siliguri', 'Noto Sans Bengali', 'Kalpurush', system-ui, sans-serif; }
`;

const NAVY_BG = {
  background: "radial-gradient(900px 420px at 15% -20%, #17495a 0%, #0A1F2E 65%)",
};

const GOLD_BTN =
  "bg-gradient-to-b from-[#E8CB7E] via-[#C9A24B] to-[#B48A34] text-[#1B1405] " +
  "shadow-[0_10px_24px_-8px_rgba(201,162,75,0.75),inset_0_1px_0_rgba(255,255,255,0.55)] " +
  "hover:brightness-105 active:translate-y-px " +
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C9A24B]/40";

const INK_BTN =
  "bg-[#0A1F2E] text-white hover:bg-[#123244] active:translate-y-px " +
  "shadow-[0_10px_24px_-10px_rgba(10,31,46,0.8)] " +
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0A1F2E]/30";

/* ================= ICONS ================= */

const Svg = ({ children, className = "w-6 h-6" }) => (
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

const BackIcon = () => (
  <Svg className="w-5 h-5">
    <path d="M15 18l-6-6 6-6" />
  </Svg>
);

const CheckCircleIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12.5l2.7 2.7L16 9.8" />
  </Svg>
);

const ClockIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

const CrossCircleIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="10" />
    <path d="M9 9l6 6M15 9l-6 6" />
  </Svg>
);

const AlertIcon = () => (
  <Svg>
    <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    <path d="M12 9v4M12 17h.01" />
  </Svg>
);

const InfoIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-5M12 8h.01" />
  </Svg>
);

const CardIcon = () => (
  <Svg>
    <rect x="2" y="5" width="20" height="14" rx="2.5" />
    <path d="M2 10h20M6 15h4" />
  </Svg>
);

const BankIcon = () => (
  <Svg>
    <path d="M3 10l9-6 9 6" />
    <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8" />
    <path d="M3 21h18" />
  </Svg>
);

const EyeIcon = ({ off }) => (
  <Svg className="w-5 h-5">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="M3 3l18 18" />}
  </Svg>
);

const CopyIcon = () => (
  <Svg className="w-4 h-4">
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </Svg>
);

/* ================= HELPERS ================= */

const METHOD_BN = {
  bkash: "বিকাশ",
  nagad: "নগদ",
  rocket: "রকেট",
  bank: "ব্যাংক",
};

const bnMethodName = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("bkash") || n.includes("বিকাশ")) return METHOD_BN.bkash;
  if (n.includes("nagad") || n.includes("নগদ")) return METHOD_BN.nagad;
  if (n.includes("rocket") || n.includes("রকেট")) return METHOD_BN.rocket;
  if (n.includes("bank") || n.includes("ব্যাংক")) return METHOD_BN.bank;
  return name || "—";
};

const methodIcon = (m) => {
  const key = `${m.method_type || ""} ${m.method_name || ""}`.toLowerCase();
  if (key.includes("bkash")) return <img src={bkashIcon} alt="বিকাশ" className="h-8 w-8 object-contain" />;
  if (key.includes("nagad")) return <img src={nagadIcon} alt="নগদ" className="h-8 w-8 object-contain" />;
  return <CardIcon />;
};

const maskNumber = (num = "") => {
  if (!num) return "•••• •••• ••••";
  if (num.length <= 6) return "•".repeat(num.length);
  return `${num.slice(0, 3)}${"•".repeat(num.length - 6)}${num.slice(-3)}`;
};

const formatTk = (v) =>
  Number(v || 0).toLocaleString("bn-BD", { maximumFractionDigits: 0 });

const authHeaders = () => {
  const token = localStorage.getItem("access") || localStorage.getItem("token");
  return { Authorization: token ? `Bearer ${token}` : "" };
};

/* ================= LOAN STATUS CONFIG ================= */

const STATUS = {
  Approved: {
    wrap: "bg-[#EEF8F3] border-[#BFE3D0]",
    circle: "bg-[#D6F0E2] text-[#1F9D6B]",
    title: "text-[#15724E]",
    text: "text-[#2B5B47]",
    icon: <CheckCircleIcon />,
    heading: "ঋণ অনুমোদিত হয়েছে",
    message: "অভিনন্দন! আপনার ঋণ অনুমোদিত হয়েছে, আপনি এখন ঋণ উত্তোলন করতে পারেন।",
  },
  Pending: {
    wrap: "bg-[#FDF6E3] border-[#EBDCA8]",
    circle: "bg-[#F8E9B8] text-[#B07A10]",
    title: "text-[#8A5F08]",
    text: "text-[#6B5320]",
    icon: <ClockIcon />,
    heading: "অনুমোদনের অপেক্ষায়",
    message: "আপনার ঋণের আবেদন পর্যবেক্ষণ করা হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।",
  },
  Rejected: {
    wrap: "bg-[#F3F4F5] border-[#D9DCDF]",
    circle: "bg-[#E4E7EA] text-[#5B6770]",
    title: "text-[#33404A]",
    text: "text-[#5B6770]",
    icon: <CrossCircleIcon />,
    heading: "আবেদন প্রত্যাখ্যাত",
    message: "আপনার ঋণ আবেদন বাতিল করা হয়েছে।",
  },
  Processing: {
    wrap: "bg-[#FCEFEF] border-[#F0C9C9]",
    circle: "bg-[#F9D9D9] text-[#D64545]",
    title: "text-[#B02F2F]",
    text: "text-[#7A3A3A]",
    icon: <AlertIcon />,
    heading: "প্রক্রিয়াধীন",
    message: "আপনার অনুমোদিত ঋণ দেরির কারণে উত্তোলন এখন সম্ভব নয়!",
  },
  "Payment Pending": {
    wrap: "bg-[#EDF3FB] border-[#C9DBF2]",
    circle: "bg-[#DCE9F7] text-[#1F4E8C]",
    title: "text-[#1F4E8C]",
    text: "text-[#33557F]",
    icon: <ClockIcon />,
    heading: "পেমেন্ট যাচাই চলছে",
    message: "আপনার পাঠানো পেমেন্ট স্ক্রিনশট যাচাই করা হচ্ছে।",
  },
};

/* ================= MAIN ================= */

const Withdrew = () => {
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loan, setLoan] = useState(null);
  const [methods, setMethods] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [showNumber, setShowNumber] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const load = async () => {
      const headers = authHeaders();

      const [pRes, lRes, mRes] = await Promise.allSettled([
        api.get("/user/payment/me", { headers }),
        api.get("/loan/loan/my-loans", { headers }),
        api.get("/paymentmethod/active"),
      ]);

      if ([pRes, lRes].some((r) => r.status === "rejected" && r.reason?.response?.status === 401)) {
        localStorage.removeItem("access");
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      if (pRes.status === "fulfilled") setPayment(pRes.value.data || null);

      if (lRes.status === "fulfilled") {
        const loans = Array.isArray(lRes.value.data) ? [...lRes.value.data] : [];
        loans.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setLoan(loans[0] || null);
      }

      if (mRes.status === "fulfilled") setMethods(mRes.value.data || []);

      setPageLoading(false);
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copy = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {}
  };

  const hasPayment = !!(
    payment &&
    (payment.payment_method_id ||
      payment.mobile_wallet_number ||
      payment.bank_account_number)
  );

  const accountNumber =
    payment?.mobile_wallet_number || payment?.bank_account_number || "";

  const isBank = !!payment?.bank_account_number;
  const isShotOn = loan?.shot_status === "On";
  const feeMethods = methods.filter((m) => m.account_number);
  const status = loan ? STATUS[loan.loan_status] : null;

  /* ================= LOADING ================= */
  if (pageLoading) {
    return (
      <div className="wd-root flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FAF8F3]">
        <style>{styles}</style>
        <svg className="h-10 w-10 animate-spin text-[#C9A24B]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
          <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <p className="text-[17px] font-semibold text-[#0A1F2E]">লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="wd-root min-h-screen bg-[#FAF8F3] pb-28 text-[#0A1F2E]">
      <style>{styles}</style>

      {/* ===== TOP BAR ===== */}
      <header className="sticky top-0 z-40 border-b border-[#C9A24B]/30 bg-[#0A1F2E] text-white shadow-lg">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 active:scale-95"
            aria-label="পেছনে যান"
          >
            <BackIcon />
          </button>
          <h1 className="text-lg font-bold tracking-wide">ঋণ উত্তোলন</h1>
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-3xl space-y-5 px-4">
        {/* ================= ১) পেমেন্ট অ্যাকাউন্ট ================= */}
        {hasPayment ? (
          <section
            className="relative overflow-hidden rounded-3xl border border-[#C9A24B]/40 p-6 text-white shadow-[0_24px_60px_-24px_rgba(10,31,46,0.8)] sm:p-8"
            style={NAVY_BG}
          >
            <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full bg-white/5" />

            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] uppercase tracking-widest text-white/60">
                    পেমেন্ট পদ্ধতি
                  </p>
                  <p className="mt-1 text-xl font-bold text-[#E6C878]">
                    {bnMethodName(payment.payment_method)}
                  </p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-[#E6C878]">
                  {isBank ? <BankIcon /> : <CardIcon />}
                </span>
              </div>

              <p className="mt-7 text-[13px] text-white/60">অ্যাকাউন্ট নম্বর</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="break-all font-mono text-2xl font-semibold tracking-[0.14em]">
                  {showNumber ? accountNumber : maskNumber(accountNumber)}
                </p>
                <button
                  type="button"
                  onClick={() => setShowNumber((s) => !s)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 active:scale-95"
                  aria-label="নম্বর দেখান বা লুকান"
                >
                  <EyeIcon off={showNumber} />
                </button>
              </div>

              {isBank && (
                <div className="mt-5 grid grid-cols-2 gap-3 text-[14px]">
                  <div className="rounded-xl bg-white/10 p-3">
                    <p className="text-white/60">অ্যাকাউন্ট হোল্ডার</p>
                    <p className="mt-0.5 truncate font-bold">{payment.bank_account_name || "—"}</p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-3">
                    <p className="text-white/60">ব্যাংক</p>
                    <p className="mt-0.5 truncate font-bold">{payment.bank_name || "—"}</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        ) : (
          <NoticeBox
            title="পেমেন্ট অ্যাকাউন্ট যোগ করা নেই"
            text="ঋণ উত্তোলনের জন্য প্রথমে আপনার ব্যাংক বা মোবাইল ওয়ালেট অ্যাকাউন্ট যোগ করুন।"
            buttonText="অ্যাকাউন্ট যোগ করুন"
            onClick={() => navigate("/payment-info")}
          />
        )}

        {/* ================= ২) ঋণের আবেদন নেই ================= */}
        {!loan && (
          <NoticeBox
            title="ঋণের আবেদন করা হয়নি"
            text="আপনি এখনো ঋণের জন্য আবেদন করেননি। উত্তোলনের আগে ঋণের আবেদন করুন।"
            buttonText="ঋণের আবেদন করুন"
            onClick={() => navigate("/loan")}
          />
        )}

        {/* ================= SHOT ON: ফি ও তথ্য ================= */}
        {isShotOn && (
          <section className="rounded-3xl border border-[#E9E2CF] bg-white p-5 shadow-[0_10px_40px_-20px_rgba(10,31,46,0.25)] sm:p-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0A1F2E] text-[#E6C878]">
                <InfoIcon />
              </span>
              <h2 className="text-lg font-bold">উত্তোলনের তথ্য</h2>
            </div>

            <div className="whitespace-pre-line rounded-2xl border border-[#F0EBDD] bg-[#FAF8F3] p-4 text-[15px] leading-relaxed text-[#33404A]">
              {loan?.shot_info || "কোনো তথ্য নেই"}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#0A1F2E] px-5 py-4 text-white">
              <span className="text-[15px] text-white/70">প্রদেয় ফি</span>
              <span className="text-2xl font-bold text-[#E6C878]">
                ৳{formatTk(loan?.shot_amount)}
              </span>
            </div>
          </section>
        )}

        {/* ================= কর্পোরেট নম্বর ================= */}
        {isShotOn && feeMethods.length > 0 && (
          <section
            className="rounded-3xl border border-[#C9A24B]/40 p-6 text-white shadow-[0_24px_60px_-24px_rgba(10,31,46,0.8)]"
            style={NAVY_BG}
          >
            <p className="text-center text-[15px] leading-relaxed text-white/80">
              ফি প্রদানের জন্য নিচের কর্পোরেট নম্বরে সেন্ড-মানি করুন।
            </p>

            <div className="mt-5 space-y-3">
              {feeMethods.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-white/10 p-3.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/90 text-[#0A1F2E]">
                      {methodIcon(m)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] text-white/65">{bnMethodName(m.method_name)}</p>
                      <p className="truncate font-mono text-lg font-bold tracking-wider">
                        {m.account_number}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => copy(m.id, m.account_number)}
                    className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[13px] font-semibold transition hover:bg-white/25 active:scale-95"
                  >
                    <CopyIcon />
                    {copiedId === m.id ? "কপি হয়েছে" : "কপি"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= লোনের অবস্থা ================= */}
        {!isShotOn && status && (
          <section className={`rounded-2xl border p-5 ${status.wrap}`}>
            <div className="flex items-start gap-4">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${status.circle}`}>
                {status.icon}
              </span>
              <div className="min-w-0">
                <h2 className={`text-lg font-bold ${status.title}`}>{status.heading}</h2>
                <p className={`mt-1 text-[16px] leading-relaxed ${status.text}`}>{status.message}</p>
              </div>
            </div>

            {loan?.amount != null && (
              <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4">
                <span className={`text-[15px] ${status.text}`}>ঋণের পরিমাণ</span>
                <span className={`text-lg font-bold ${status.title}`}>৳{formatTk(loan.amount)}</span>
              </div>
            )}
          </section>
        )}
      </main>

      <DownBar />
    </div>
  );
};

/* ================= NOTICE BOX ================= */
const NoticeBox = ({ title, text, buttonText, onClick }) => (
  <section className="rounded-2xl border border-[#EBDCA8] bg-[#FDF6E3] p-5">
    <div className="flex items-start gap-3.5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F8E9B8] text-[#B07A10]">
        <InfoIcon />
      </span>
      <div>
        <h3 className="text-[17px] font-bold text-[#5C4512]">{title}</h3>
        <p className="mt-1 text-[15px] leading-relaxed text-[#6B5320]">{text}</p>
      </div>
    </div>

    <button
      onClick={onClick}
      className={`mt-4 w-full rounded-xl px-6 py-3 text-[16px] font-semibold transition ${INK_BTN}`}
    >
      {buttonText}
    </button>
  </section>
);

export default Withdrew;
