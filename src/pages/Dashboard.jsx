import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import TopBar from "../components/TopBar";
import DownBar from "../components/DownBar";

/* ================= STYLES ================= */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');

.db-root { font-family: 'Hind Siliguri', 'Noto Sans Bengali', 'Kalpurush', system-ui, sans-serif; }
`;

/* ================= BUTTON STYLES ================= */

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

const Svg = ({ children, className = "w-6 h-6", strokeWidth = 1.9 }) => (
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

const WalletIcon = () => (
  <Svg className="w-5 h-5">
    <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3" />
    <path d="M3 7v11a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-3" />
    <path d="M21 10h-5a2 2 0 0 0 0 4h5z" />
  </Svg>
);

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
    message: "আপনার অনুমোদিত ঋণ দেরির কারণে উত্তোলন সম্ভব নয়!",
  },
};

/* ================= DASHBOARD ================= */

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showInfoNotice, setShowInfoNotice] = useState(false);
  const [showLoanNotice, setShowLoanNotice] = useState(false);

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("access") ||
        localStorage.getItem("token");

      const headers = {
        Authorization: token ? `Bearer ${token}` : "",
      };

      // USER
      const userRes = await api.get("/user/kyc/me", { headers });

      const userData = userRes.data;
      setUser(userData);

      // LOANS
      const loanRes = await api.get("/loan/loan/my-loans", { headers });

      const loanData = loanRes.data || [];

      // latest loan
      const latestLoan = loanData.length ? loanData[0] : null;
      setLoan(latestLoan);

      // UI states
      setShowInfoNotice(!userData?.kyc_submitted);
      setShowLoanNotice(loanData.length === 0);
    } catch (err) {
      console.log(err);

      // সেশন শেষ হলে লগইন পেজে পাঠানো হবে
      if (err.response?.status === 401) {
        localStorage.removeItem("access");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login", { replace: true });
        return;
      }

      setUser(null);
      setLoan(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="db-root flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FAF8F3]">
        <style>{styles}</style>

        <svg className="h-10 w-10 animate-spin text-[#C9A24B]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
          <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>

        <p className="text-[17px] font-semibold text-[#0A1F2E]">লোড হচ্ছে...</p>
      </div>
    );
  }

  const status = loan ? STATUS[loan.loan_status] : null;
  const loanAmount = loan?.amount ?? loan?.loan_amount;

  return (
    <div className="db-root min-h-screen bg-[#FAF8F3] pb-28 text-[#0A1F2E]">
      <style>{styles}</style>

      <TopBar />

      <main className="mx-auto mt-8 max-w-3xl space-y-6 px-4">
        {/* ================= BALANCE ================= */}
        <section
          className="rounded-3xl border border-[#C9A24B]/40 p-6 text-white
                     shadow-[0_24px_60px_-24px_rgba(10,31,46,0.8)] sm:p-8"
          style={{
            background:
              "radial-gradient(900px 420px at 15% -20%, #17495a 0%, #0A1F2E 65%)",
          }}
        >
          <p className="text-[15px] text-white/70">অ্যাকাউন্ট </p>

          <p className="mt-2 text-5xl font-bold tracking-tight">
            <span className="mr-1 text-[#E6C878]">৳</span>
            {Number(user?.balance || 0).toLocaleString("en-BD")}
          </p>

          <button
            onClick={() => navigate("/withdrew")}
            className={`mt-7 flex w-full items-center justify-center gap-2.5 rounded-xl
                        py-3.5 text-[17px] font-semibold transition ${GOLD_BTN}`}
          >
            <WalletIcon />
            <span>ঋণ উত্তোলন</span>
          </button>
        </section>

        {/* ================= NOTICE ================= */}
        {showInfoNotice && (
          <NoticeBox
            text="প্রথমে ব্যক্তিগত তথ্য পূরণ করুন।"
            buttonText="তথ্য দিন"
            onClick={() => navigate("/personal-info")}
          />
        )}

        {showLoanNotice && !showInfoNotice && (
          <NoticeBox
            text="আপনি এখনো ঋণের জন্য আবেদন করেননি।"
            buttonText="আবেদন করুন"
            onClick={() => navigate("/loan")}
          />
        )}

        {/* ================= LOAN STATE ================= */}
        {status && (
          <StatusCard status={status} amount={loanAmount} />
        )}
      </main>

      <DownBar />
    </div>
  );
};

/* ================= STATUS CARD ================= */
const StatusCard = ({ status, amount }) => (
  <section className={`rounded-2xl border p-5 ${status.wrap}`}>
    <div className="flex items-start gap-4">
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${status.circle}`}
      >
        {status.icon}
      </span>

      <div className="min-w-0">
        <h2 className={`text-lg font-bold ${status.title}`}>{status.heading}</h2>

        <p className={`mt-1 text-[16px] leading-relaxed ${status.text}`}>
          {status.message}
        </p>
      </div>
    </div>

    {amount != null && (
      <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4">
        <span className={`text-[15px] ${status.text}`}>ঋণের পরিমাণ</span>

        <span className={`text-lg font-bold ${status.title}`}>
          ৳{Number(amount).toLocaleString("en-BD")}
        </span>
      </div>
    )}
  </section>
);

/* ================= NOTICE ================= */
const NoticeBox = ({ text, buttonText, onClick }) => (
  <section className="flex flex-col gap-4 rounded-2xl border border-[#EBDCA8] bg-[#FDF6E3] p-5 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-3.5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F8E9B8] text-[#B07A10]">
        <InfoIcon />
      </span>

      <p className="text-[16px] font-medium leading-relaxed text-[#5C4512]">
        {text}
      </p>
    </div>

    <button
      onClick={onClick}
      className={`shrink-0 rounded-xl px-6 py-2.5 text-[16px] font-semibold transition ${INK_BTN}`}
    >
      {buttonText}
    </button>
  </section>
);

export default Dashboard;
