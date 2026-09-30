import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import TopBar from "../components/TopBar";
import DownBar from "../components/DownBar";

/* ================= STYLES ================= */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');

.ln-root { font-family: 'Hind Siliguri', 'Noto Sans Bengali', 'Kalpurush', system-ui, sans-serif; }
.ln-num { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; font-variant-numeric: tabular-nums; }
`;

const GOLD_BTN =
  "bg-gradient-to-b from-[#E8CB7E] via-[#C9A24B] to-[#B48A34] text-[#1B1405] " +
  "shadow-[0_10px_24px_-8px_rgba(201,162,75,0.75),inset_0_1px_0_rgba(255,255,255,0.55)] " +
  "hover:brightness-105 active:translate-y-px " +
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C9A24B]/40 " +
  "disabled:opacity-60 disabled:cursor-not-allowed";

/* ================= CONFIG (ব্যাকএন্ডের সাথে মিল) ================= */

// বার্ষিক flat সুদ: interest = amount * 2.4% * (months / 12)
const INTEREST_RATE = 2.4;

const MONTH_OPTIONS = [12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120];

const AMOUNT_OPTIONS = [
  { value: 50000, label: "50 হাজার" },
  { value: 100000, label: "1 লক্ষ" },
  { value: 150000, label: "1.5 লক্ষ" },
  { value: 200000, label: "2 লক্ষ" },
  { value: 300000, label: "3 লক্ষ" },
  { value: 400000, label: "4 লক্ষ" },
  { value: 500000, label: "5 লক্ষ" },
  { value: 600000, label: "6 লক্ষ" },
  { value: 700000, label: "7 লক্ষ" },
  { value: 800000, label: "8 লক্ষ" },
  { value: 900000, label: "9 লক্ষ" },
  { value: 1000000, label: "10 লক্ষ" },
  { value: 1500000, label: "15 লক্ষ" },
  { value: 2000000, label: "20 লক্ষ" },
  { value: 3000000, label: "30 লক্ষ" },
];

const STATUS = {
  Pending: {
    label: "অনুমোদনের অপেক্ষায়",
    badge: "bg-[#F8E9B8] text-[#8A5F08]",
    note: "আপনার ঋণের আবেদন পর্যবেক্ষণ করা হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।",
  },
  Approved: {
    label: "অনুমোদিত",
    badge: "bg-[#D6F0E2] text-[#15724E]",
    note: "অভিনন্দন! আপনার ঋণ অনুমোদিত হয়েছে।",
  },
  Rejected: {
    label: "প্রত্যাখ্যাত",
    badge: "bg-[#E4E7EA] text-[#33404A]",
    note: "আপনার ঋণ আবেদন বাতিল করা হয়েছে।",
  },
  Processing: {
    label: "প্রক্রিয়াধীন",
    badge: "bg-[#F9D9D9] text-[#B02F2F]",
    note: "আপনার ঋণ প্রক্রিয়াধীন আছে।",
  },
  "Payment Pending": {
    label: "পেমেন্ট যাচাই চলছে",
    badge: "bg-[#DCE9F7] text-[#1F4E8C]",
    note: "আপনার পাঠানো পেমেন্ট স্ক্রিনশট যাচাই করা হচ্ছে।",
  },
};

/* ================= HELPERS ================= */

// ইংরেজি ডিজিট + লক্ষ/কোটি স্টাইল কমা: 1,00,000
const formatTk = (value) =>
  Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

// মাস -> বছর লেখা: 12 -> "1 বছর", 18 -> "1.5 বছর"
const yearsLabel = (m) => {
  const y = m / 12;
  return `${Number.isInteger(y) ? y : y.toFixed(1)} বছর`;
};

// বার্ষিক flat সুদ (ব্যাকএন্ডের calc_loan-এর মতো)
const calcLoan = (amount, months, rate = INTEREST_RATE) => {
  if (!amount || !months) return { total: 0, monthly: 0, interest: 0 };
  const interest = amount * (rate / 100) * (months / 12);
  const total = amount + interest;
  return { total, monthly: total / months, interest };
};

const authHeaders = () => {
  const token = localStorage.getItem("access") || localStorage.getItem("token");
  return { Authorization: token ? `Bearer ${token}` : "" };
};

const formatDate = (d) => {
  const date = new Date(d);
  if (isNaN(date)) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

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

const BankIcon = () => (
  <Svg className="w-6 h-6">
    <path d="M3 10l9-6 9 6" />
    <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8" />
    <path d="M3 21h18" />
  </Svg>
);

const AlertIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v5M12 16.5h.01" />
  </Svg>
);

const ShieldIcon = () => (
  <Svg>
    <path d="M12 2l8 3v6c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11V5l8-3z" />
    <path d="M9 12l2 2 4-4" />
  </Svg>
);

/* ================= MAIN ================= */

const Loan = () => {
  const navigate = useNavigate();

  const [pageLoading, setPageLoading] = useState(true);
  const [loanDetails, setLoanDetails] = useState(null);

  const [months, setMonths] = useState(null);
  const [amount, setAmount] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* ---------- লোড ---------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/loan/loan/my-loans", {
          headers: authHeaders(),
        });

        const loans = Array.isArray(res.data) ? [...res.data] : [];

        if (loans.length > 0) {
          loans.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setLoanDetails(loans[0]);
        }
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          localStorage.removeItem("access");
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
        }
      } finally {
        setPageLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- জমা ---------- */
  const handleSubmit = async () => {
    setError("");

    if (!amount || !months) {
      setError("দয়া করে মাস এবং টাকার পরিমাণ নির্বাচন করুন");
      return;
    }

    setSubmitting(true);

    try {
      // ব্যাকএন্ড শুধু amount ও months নেয়, কিস্তি সার্ভারেই হিসাব হয়
      await api.post(
        "/loan/loan/create",
        { amount: Number(amount), months: Number(months) },
        { headers: authHeaders() }
      );

      navigate("/payment-info", { replace: true });
    } catch (err) {
      console.log("LOAN CREATE ERROR:", err.response?.data);

      const d = err.response?.data?.detail;
      if (typeof d === "string") {
        setError(d);
      } else if (Array.isArray(d)) {
        // 422 validation error: কোন field-এ সমস্যা দেখাবে
        setError(d.map((x) => `${(x.loc || []).join(".")}: ${x.msg}`).join(", "));
      } else {
        setError("সার্ভার সমস্যা হয়েছে, আবার চেষ্টা করুন");
      }
      setSubmitting(false);
    }
  };

  const calc = calcLoan(amount, months);
  const showSummary = amount && months;

  /* ================= LOADING ================= */
  if (pageLoading) {
    return (
      <div className="ln-root flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FAF8F3]">
        <style>{styles}</style>
        <svg className="h-10 w-10 animate-spin text-[#C9A24B]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
          <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <p className="text-[17px] font-semibold text-[#0A1F2E]">লোড হচ্ছে...</p>
      </div>
    );
  }

  /* ================= EXISTING LOAN ================= */
  if (loanDetails) {
    const st = STATUS[loanDetails.loan_status] || {
      label: loanDetails.loan_status || "—",
      badge: "bg-slate-200 text-slate-700",
      note: "",
    };

    const totalMonths = Number(loanDetails.months || 0);
    const paid = Number(loanDetails.paid_installments || 0);
    const remaining = Math.max(totalMonths - paid, 0);
    const percent = totalMonths ? Math.min((paid / totalMonths) * 100, 100) : 0;

    const rate = Number(loanDetails.interest_rate ?? INTEREST_RATE);
    const loanCalc = calcLoan(Number(loanDetails.amount || 0), totalMonths, rate);
    const totalPayable = loanCalc.total;

    return (
      <div className="ln-root min-h-screen bg-[#FAF8F3] pb-28 text-[#0A1F2E]">
        <style>{styles}</style>
        <TopBar />

        <main className="mx-auto mt-8 max-w-3xl space-y-6 px-4">
          {/* ===== BANK CARD ===== */}
          <section
            className="relative overflow-hidden rounded-3xl border border-[#C9A24B]/40 p-6 text-white
                       shadow-[0_24px_60px_-24px_rgba(10,31,46,0.8)] sm:p-8"
            style={{
              background:
                "radial-gradient(900px 420px at 15% -20%, #17495a 0%, #0A1F2E 65%)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[15px] text-white/70">ঋণের পরিমাণ</p>
                <p className="ln-num mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                  <span className="mr-1 text-[#E6C878]">৳</span>
                  {formatTk(loanDetails.amount)}
                </p>
              </div>

              <span className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-bold ${st.badge}`}>
                {st.label}
              </span>
            </div>

            {/* কিস্তির অগ্রগতি */}
            <div className="mt-7">
              <div className="mb-2 flex items-center justify-between text-[14px] text-white/75">
                <span>কিস্তি পরিশোধ</span>
                <span className="ln-num">
                  {paid} / {totalMonths} টি
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#E8CB7E] to-[#C9A24B] transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            <p className="mt-5 text-[15px] leading-relaxed text-white/80">{st.note}</p>
          </section>

          {/* ===== DETAILS ===== */}
          <section className="rounded-3xl border border-[#E9E2CF] bg-white p-5 shadow-[0_10px_40px_-20px_rgba(10,31,46,0.25)] sm:p-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0A1F2E] text-[#E6C878]">
                <BankIcon />
              </span>
              <h2 className="text-lg font-bold">ঋণের বিস্তারিত</h2>
            </div>

            <div className="divide-y divide-[#F0EBDD]">
              <Row label="আবেদনের তারিখ" value={formatDate(loanDetails.created_at)} />
              <Row label="ঋণের মেয়াদ" value={`${totalMonths} মাস (${yearsLabel(totalMonths)})`} />
              <Row label="সুদের হার (বার্ষিক)" value={`${rate}%`} />
              <Row label="মোট সুদ" value={`৳${formatTk(loanCalc.interest)}`} />
              <Row label="মাসিক কিস্তি" value={`৳${formatTk(loanDetails.monthly_installment)}`} highlight />
              <Row label="মোট পরিশোধযোগ্য" value={`৳${formatTk(totalPayable)}`} />
              <Row label="পরিশোধ হয়েছে" value={`${paid} টি`} />
              <Row label="বাকি কিস্তি" value={`${remaining} টি`} danger />
            </div>
          </section>

          <div className="flex items-start gap-3 rounded-2xl border border-[#EBDCA8] bg-[#FDF6E3] p-4 text-[15px] leading-relaxed text-[#5C4512]">
            <span className="mt-0.5 text-[#B07A10]">
              <AlertIcon />
            </span>
            <p>
              প্রতি মাসের <span className="ln-num">1–10</span> তারিখের মধ্যে কিস্তি পরিশোধ করতে হবে। একটি ঋণ
              চলাকালীন নতুন ঋণের আবেদন করা যাবে না।
            </p>
          </div>
        </main>

        <DownBar />
      </div>
    );
  }

  /* ================= APPLY FORM ================= */
  return (
    <div className="ln-root min-h-screen bg-[#FAF8F3] pb-28 text-[#0A1F2E]">
      <style>{styles}</style>
      <TopBar />

      <main className="mx-auto mt-8 max-w-3xl space-y-6 px-4">
        {/* ===== HEADER CARD ===== */}
        <section
          className="rounded-3xl border border-[#C9A24B]/40 p-6 text-white
                     shadow-[0_24px_60px_-24px_rgba(10,31,46,0.8)] sm:p-8"
          style={{
            background:
              "radial-gradient(900px 420px at 15% -20%, #17495a 0%, #0A1F2E 65%)",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#E6C878]">
              <BankIcon />
            </span>
            <div>
              <h1 className="text-2xl font-bold">ঋণের আবেদন</h1>
              <p className="text-[14px] text-white/70">ক্ষুদ্র ঋণ উন্নয়ন প্রজেক্ট</p>
            </div>
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-white/80">
            ঋণ অনুমোদিত হলে প্রতি মাসের <span className="ln-num">1–10</span> তারিখের মধ্যে কিস্তি পরিশোধ করতে
            হবে। বার্ষিক সুদের হার <span className="ln-num">{INTEREST_RATE}%</span> (flat)।
          </p>
        </section>

        {/* ===== STEP 1: MONTHS ===== */}
        <section className="rounded-3xl border border-[#E9E2CF] bg-white p-5 shadow-[0_10px_40px_-20px_rgba(10,31,46,0.25)] sm:p-6">
          <StepTitle no="1" text="কত মাসের জন্য ঋণ নিতে চান?" />

          <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {MONTH_OPTIONS.map((m) => (
              <Chip
                key={m}
                active={months === m}
                sub={yearsLabel(m)}
                onClick={() => {
                  setMonths(m);
                  setError("");
                }}
              >
                {m} মাস
              </Chip>
            ))}
          </div>
        </section>

        {/* ===== STEP 2: AMOUNT ===== */}
        <section className="rounded-3xl border border-[#E9E2CF] bg-white p-5 shadow-[0_10px_40px_-20px_rgba(10,31,46,0.25)] sm:p-6">
          <StepTitle no="2" text="কত টাকা নিতে চান?" />

          <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {AMOUNT_OPTIONS.map((a) => (
              <Chip
                key={a.value}
                active={amount === a.value}
                sub={`৳${formatTk(a.value)}`}
                onClick={() => {
                  setAmount(a.value);
                  setError("");
                }}
              >
                {a.label}
              </Chip>
            ))}
          </div>
        </section>

        {/* ===== SUMMARY ===== */}
        {showSummary && (
          <section
            className="rounded-3xl border border-[#C9A24B]/40 p-6 text-white
                       shadow-[0_24px_60px_-24px_rgba(10,31,46,0.8)]"
            style={{
              background:
                "radial-gradient(900px 420px at 15% -20%, #17495a 0%, #0A1F2E 65%)",
            }}
          >
            <p className="text-[15px] text-white/70">মাসিক কিস্তি</p>
            <p className="ln-num mt-1 text-4xl font-bold tracking-tight">
              <span className="mr-1 text-[#E6C878]">৳</span>
              {formatTk(calc.monthly)}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 text-[14px]">
              <SummaryItem label="ঋণের পরিমাণ" value={`৳${formatTk(amount)}`} />
              <SummaryItem label="মেয়াদ" value={`${months} মাস`} />
              <SummaryItem label={`মোট সুদ (${INTEREST_RATE}% বার্ষিক)`} value={`৳${formatTk(calc.interest)}`} />
              <SummaryItem label="মোট পরিশোধযোগ্য" value={`৳${formatTk(calc.total)}`} gold />
            </div>
          </section>
        )}

        {/* ===== ERROR ===== */}
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-[#F0C9C9] bg-[#FCEFEF] p-4 text-[15px] font-medium text-[#B02F2F]">
            <AlertIcon />
            <p>{error}</p>
          </div>
        )}

        {/* ===== নির্দেশনা ===== */}
        {(!months || !amount) && !error && (
          <p className="text-center text-[14px] text-[#5B6770]">
            {!months && !amount
              ? "প্রথমে মেয়াদ (ধাপ 1) ও পরিমাণ (ধাপ 2) নির্বাচন করুন"
              : !months
              ? "মেয়াদ (ধাপ 1) নির্বাচন করুন"
              : "পরিমাণ (ধাপ 2) নির্বাচন করুন"}
          </p>
        )}

        {/* ===== SUBMIT ===== */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !months || !amount}
          className={`flex w-full items-center justify-center gap-2.5 rounded-xl py-4 text-[17px] font-semibold transition ${GOLD_BTN}`}
        >
          <ShieldIcon />
          <span>{submitting ? "প্রসেসিং..." : "আবেদন সম্পূর্ণ করুন"}</span>
        </button>
      </main>

      <DownBar />
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */

const StepTitle = ({ no, text }) => (
  <div className="flex items-center gap-3">
    <span className="flex h-9 shrink-0 items-center justify-center rounded-full bg-[#0A1F2E] px-3.5 text-[13px] font-bold text-[#E6C878]">
      ধাপ <span className="ln-num ml-1">{no}</span>
    </span>
    <h2 className="text-[17px] font-bold">{text}</h2>
  </div>
);

const Chip = ({ active, onClick, children, sub }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-col items-center justify-center rounded-xl border px-2 py-2.5 transition active:scale-95 ${
      active
        ? "border-[#C9A24B] bg-[#0A1F2E] text-[#E6C878] shadow-[0_8px_20px_-8px_rgba(10,31,46,0.7)]"
        : "border-[#E2DAC2] bg-[#FAF8F3] text-[#0A1F2E] hover:border-[#C9A24B]"
    }`}
  >
    <span className="ln-num text-[16px] font-bold leading-tight">{children}</span>
    {sub && (
      <span className={`ln-num mt-0.5 text-[11px] font-medium ${active ? "text-[#E6C878]/80" : "text-[#5B6770]"}`}>
        {sub}
      </span>
    )}
  </button>
);

const SummaryItem = ({ label, value, gold }) => (
  <div className="rounded-xl bg-white/10 p-3">
    <p className="text-white/65">{label}</p>
    <p className={`ln-num mt-0.5 text-[16px] font-bold ${gold ? "text-[#E6C878]" : "text-white"}`}>{value}</p>
  </div>
);

const Row = ({ label, value, highlight, danger }) => (
  <div className="flex items-center justify-between gap-4 py-3.5">
    <span className="text-[15px] text-[#5B6770]">{label}</span>
    <span
      className={`ln-num text-right text-[16px] font-bold ${
        highlight ? "text-[#B07A10]" : danger ? "text-[#B02F2F]" : "text-[#0A1F2E]"
      }`}
    >
      {value}
    </span>
  </div>
);

export default Loan;
