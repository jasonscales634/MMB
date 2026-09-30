import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import backIcon from "../assets/icons/back.png";

/* ================= মেথড স্টাইল (type অনুযায়ী) ================= */
const STYLES = {
  bkash: { bn: "বিকাশ", card: "from-pink-600 via-rose-600 to-pink-500", tile: "border-pink-400 bg-pink-50 text-pink-700" },
  nagad: { bn: "নগদ", card: "from-orange-600 via-orange-500 to-amber-500", tile: "border-orange-400 bg-orange-50 text-orange-700" },
  rocket: { bn: "রকেট", card: "from-purple-700 via-violet-600 to-fuchsia-600", tile: "border-violet-400 bg-violet-50 text-violet-700" },
  bank: { bn: "ব্যাংক", card: "from-slate-900 via-indigo-900 to-blue-800", tile: "border-indigo-400 bg-indigo-50 text-indigo-700" },
  default: { bn: null, card: "from-indigo-800 via-indigo-700 to-blue-600", tile: "border-indigo-400 bg-indigo-50 text-indigo-700" },
};

const normalizeMethod = (m) => {
  const t = (m.method_type || "").toLowerCase().trim();
  const s = STYLES[t] || STYLES.default;
  return {
    id: String(m.id),
    name: s.bn || m.method_name,
    type: t === "bank" ? "bank" : "mobile",
    card: s.card,
    tile: s.tile,
  };
};

const groupDigits = (s = "") => s.replace(/(.{4})/g, "$1 ").trim();

const maskNumber = (n = "") =>
  n.length > 4 ? "•".repeat(n.length - 4) + n.slice(-4) : n;

/* ================= ছোট আইকন ================= */
const ChipSvg = () => (
  <svg width="42" height="32" viewBox="0 0 42 32" fill="none">
    <rect x="1" y="1" width="40" height="30" rx="6" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" />
    <path d="M1 11h40M1 21h40M15 1v30M27 1v30" stroke="#b45309" strokeWidth="1" opacity="0.6" />
  </svg>
);

const EyeIcon = ({ off }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="M3 3l18 18" />}
  </svg>
);

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l8 3v6c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11V5l8-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

/* ================= ইনপুট স্টাইল ================= */
const inputCls =
  "w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

const Label = ({ children }) => (
  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{children}</label>
);

/* ================= মূল কম্পোনেন্ট ================= */
const PaymentInfo = () => {
  const navigate = useNavigate();

  const [methods, setMethods] = useState([]);
  const [savedName, setSavedName] = useState("");
  const [payment, setPayment] = useState({
    payment_method_id: "",
    mobile_wallet_number: "",
    bank_account_number: "",
    bank_account_name: "",
    bank_name: "",
    bank_branch_name: "",
  });

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [hasPayment, setHasPayment] = useState(false);
  const [showNumber, setShowNumber] = useState(false);

  /* ================= লোড ================= */
  const fetchAll = async () => {
    // একটি ফেইল করলেও অন্যটি কাজ করবে
    const [mRes, pRes] = await Promise.allSettled([
      api.get("/user/payment/methods"),
      api.get("/user/payment/me"),
    ]);

    if (mRes.status === "fulfilled") {
      setMethods((mRes.value.data || []).map(normalizeMethod));
    }

    if (pRes.status === "fulfilled") {
      const data = pRes.value.data || {};
      const exists =
        data.payment_method_id ||
        data.mobile_wallet_number ||
        data.bank_account_number;

      setHasPayment(!!exists);
      setSavedName(data.payment_method || "");

      setPayment({
        payment_method_id: data.payment_method_id ? String(data.payment_method_id) : "",
        mobile_wallet_number: data.mobile_wallet_number || "",
        bank_account_number: data.bank_account_number || "",
        bank_account_name: data.bank_account_name || "",
        bank_name: data.bank_name || "",
        bank_branch_name: data.bank_branch_name || "",
      });
    } else {
      setHasPayment(false);
      setMessage({ type: "error", text: "পেমেন্ট তথ্য লোড করতে সমস্যা হয়েছে" });
    }

    setPageLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* ================= পরিবর্তন ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    const digitsOnly = ["mobile_wallet_number", "bank_account_number"].includes(name);

    setPayment((prev) => ({
      ...prev,
      [name]: digitsOnly ? value.replace(/\D/g, "") : value,
    }));
    if (message.text) setMessage({ type: "", text: "" });
  };

  const selectMethod = (id) => {
    setPayment((prev) => ({ ...prev, payment_method_id: id }));
    if (message.text) setMessage({ type: "", text: "" });
  };

  /* ================= বর্তমান মেথড ================= */
  let method = methods.find((m) => m.id === payment.payment_method_id);

  // মেথড লিস্ট না এলেও সেভ করা কার্ড দেখানোর ফলব্যাক
  if (!method && hasPayment) {
    method = {
      id: payment.payment_method_id,
      name: savedName || "পেমেন্ট",
      type: payment.bank_account_number ? "bank" : "mobile",
      ...STYLES.default,
    };
  }

  const isBank = method?.type === "bank";
  const isMobile = method?.type === "mobile";
  const accountNumber = payment.mobile_wallet_number || payment.bank_account_number || "";

  /* ================= জমা ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!method) {
      setMessage({ type: "error", text: "একটি পেমেন্ট মেথড নির্বাচন করুন" });
      return;
    }

    if (method.type === "mobile" && !/^01[3-9]\d{8}$/.test(payment.mobile_wallet_number)) {
      setMessage({ type: "error", text: "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন" });
      return;
    }

    if (method.type === "bank" && !payment.bank_account_number.trim()) {
      setMessage({ type: "error", text: "ব্যাংক অ্যাকাউন্ট নম্বর দিন" });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const formData = new FormData();
      formData.append("payment_method_id", payment.payment_method_id);
      formData.append("mobile_wallet_number", method.type === "mobile" ? payment.mobile_wallet_number : "");
      formData.append("payment_description", "");
      formData.append("bank_account_number", method.type === "bank" ? payment.bank_account_number : "");
      formData.append("bank_account_name", method.type === "bank" ? payment.bank_account_name : "");
      formData.append("bank_name", method.type === "bank" ? payment.bank_name : "");
      formData.append("bank_branch_name", method.type === "bank" ? payment.bank_branch_name : "");

      await api.post("/user/payment/update", formData);

      setMessage({ type: "success", text: "সফলভাবে সংরক্ষণ হয়েছে" });
      await fetchAll();
    } catch (err) {
      const d = err?.response?.data?.detail;
      setMessage({
        type: "error",
        text: typeof d === "string" ? d : "সংরক্ষণ করতে সমস্যা হয়েছে",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= টপ বার ================= */
  const TopBar = (
    <div className="sticky top-0 z-30 bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 text-white shadow-lg">
      <div className="max-w-md mx-auto flex items-center gap-3 px-4 py-3.5">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition flex items-center justify-center"
          aria-label="পেছনে যান"
        >
          <img src={backIcon} alt="পেছনে" className="w-5 h-5 invert" />
        </button>
        <h1 className="text-lg font-semibold tracking-wide">পেমেন্ট সেটিংস</h1>
      </div>
    </div>
  );

  /* ================= লোডিং ================= */
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white">
        {TopBar}
        <div className="max-w-md mx-auto px-4 mt-6 space-y-4 animate-pulse">
          <div className="h-52 rounded-3xl bg-slate-200" />
          <div className="h-16 rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white pb-10">
      {TopBar}

      <div className="max-w-md mx-auto px-4 mt-6 space-y-5">
        {/* ===== বার্তা ===== */}
        {message.text && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm font-medium border ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* ================= সেভ করা পেমেন্ট কার্ড ================= */}
        {hasPayment && method && (
          <>
            <div
              className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${method.card} text-white p-6 shadow-[0_20px_50px_rgba(30,27,75,0.35)]`}
            >
              <div className="absolute -top-16 -right-12 w-56 h-56 rounded-full bg-white/10" />
              <div className="absolute -bottom-24 -left-14 w-64 h-64 rounded-full bg-white/5" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-white/70">পেমেন্ট মেথড</p>
                    <p className="text-xl font-bold mt-0.5">{method.name}</p>
                  </div>
                  <ChipSvg />
                </div>

                <div className="mt-8 flex items-center justify-between gap-3">
                  <p className="text-[22px] font-mono font-semibold tracking-[0.18em] break-all">
                    {groupDigits(showNumber ? accountNumber : maskNumber(accountNumber))}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowNumber((s) => !s)}
                    className="shrink-0 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center active:scale-95 transition"
                    aria-label="নম্বর দেখান বা লুকান"
                  >
                    <EyeIcon off={showNumber} />
                  </button>
                </div>

                <div className="mt-7 flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-white/60">
                      {isBank ? "অ্যাকাউন্ট হোল্ডার" : "অ্যাকাউন্ট টাইপ"}
                    </p>
                    <p className="text-sm font-semibold uppercase truncate">
                      {isBank ? payment.bank_account_name || "—" : "মোবাইল ওয়ালেট"}
                    </p>
                  </div>
                  {isBank && (
                    <div className="text-right min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-white/60">ব্যাংক</p>
                      <p className="text-sm font-semibold truncate">{payment.bank_name || "—"}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isBank && (
              <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_10px_40px_rgba(79,70,229,0.07)] px-5 py-2">
                {[
                  ["অ্যাকাউন্টের নাম", payment.bank_account_name],
                  ["ব্যাংকের নাম", payment.bank_name],
                  ["শাখা", payment.bank_branch_name],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
                    <span className="text-xs font-medium text-slate-500 shrink-0">{k}</span>
                    <span className="text-sm font-semibold text-slate-800 text-right break-words">{v || "—"}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold px-4 py-3.5">
              <LockIcon />
              <span>নিরাপত্তার জন্য পেমেন্ট তথ্য পরিবর্তন করা যাবে না</span>
            </div>
          </>
        )}

        {/* ================= ফর্ম ================= */}
        {!hasPayment && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-slate-100 shadow-[0_10px_40px_rgba(79,70,229,0.08)] overflow-hidden"
          >
            <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-blue-500 to-sky-400" />

            <div className="p-5 space-y-5">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center text-xl">
                  💳
                </span>
                <div>
                  <h2 className="font-bold text-slate-800 text-base">পেমেন্ট অ্যাকাউন্ট যোগ করুন</h2>
                  <p className="text-xs text-slate-400">লোনের টাকা পাওয়ার জন্য এটি আবশ্যক</p>
                </div>
              </div>

              {/* মেথড টাইল (ডাটাবেস থেকে) */}
              <div>
                <Label>পেমেন্ট মেথড</Label>
                {methods.length === 0 ? (
                  <p className="text-xs text-red-500">কোনো পেমেন্ট মেথড পাওয়া যায়নি</p>
                ) : (
                  <div className="grid grid-cols-4 gap-2.5">
                    {methods.map((m) => {
                      const active = payment.payment_method_id === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => selectMethod(m.id)}
                          className={`rounded-2xl border-2 py-3 px-1 flex flex-col items-center gap-1.5 text-xs font-bold transition active:scale-95 ${
                            active ? m.tile : "border-slate-200 bg-slate-50 text-slate-500"
                          }`}
                        >
                          <span
                            className={`w-9 h-9 rounded-full bg-gradient-to-br ${m.card} text-white flex items-center justify-center text-sm`}
                          >
                            {m.name.charAt(0)}
                          </span>
                          <span className="truncate max-w-full">{m.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* মোবাইল */}
              {isMobile && (
                <div>
                  <Label>{method.name} নম্বর</Label>
                  <input
                    name="mobile_wallet_number"
                    value={payment.mobile_wallet_number}
                    onChange={handleChange}
                    placeholder="০১৭XXXXXXXX"
                    inputMode="numeric"
                    maxLength={11}
                    className={inputCls}
                  />
                </div>
              )}

              {/* ব্যাংক */}
              {isBank && (
                <div className="space-y-4">
                  <div>
                    <Label>অ্যাকাউন্টের নাম</Label>
                    <input
                      name="bank_account_name"
                      value={payment.bank_account_name}
                      onChange={handleChange}
                      placeholder="অ্যাকাউন্ট হোল্ডারের নাম"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <Label>অ্যাকাউন্ট নম্বর</Label>
                    <input
                      name="bank_account_number"
                      value={payment.bank_account_number}
                      onChange={handleChange}
                      placeholder="অ্যাকাউন্ট নম্বর"
                      inputMode="numeric"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <Label>ব্যাংকের নাম</Label>
                    <input
                      name="bank_name"
                      value={payment.bank_name}
                      onChange={handleChange}
                      placeholder="যেমন: ডাচ-বাংলা ব্যাংক"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <Label>শাখা</Label>
                    <input
                      name="bank_branch_name"
                      value={payment.bank_branch_name}
                      onChange={handleChange}
                      placeholder="শাখার নাম"
                      className={inputCls}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-3.5 py-3">
                <ShieldIcon />
                <span>সংরক্ষণের পর এই তথ্য আর পরিবর্তন করা যাবে না। ভালোভাবে যাচাই করে জমা দিন।</span>
              </div>

              <button
                type="submit"
                disabled={loading || !method}
                className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold py-3.5 shadow-lg shadow-indigo-200 active:scale-[0.98] transition disabled:opacity-50"
              >
                {loading ? "সংরক্ষণ হচ্ছে..." : "✔ সংরক্ষণ করুন"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaymentInfo;
