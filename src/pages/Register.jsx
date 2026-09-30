import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import BankLogo from "../assets/icons/bank.png";

const MIN_PASSWORD = 6; // নিচের মেসেজেও "৬" লেখা আছে, বদলালে সেটাও বদলান

/* ================= STYLES ================= */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');

.lg-root { font-family: 'Hind Siliguri', 'Noto Sans Bengali', 'Kalpurush', system-ui, sans-serif; }

@keyframes lgCardIn  { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes lgOverlay { from { opacity: 0; } to { opacity: 1; } }
@keyframes lgPop     { 0% { opacity: 0; transform: scale(.9); } 100% { opacity: 1; transform: scale(1); } }
@keyframes lgShake   { 0%,100% { transform: translateX(0); } 20%,60% { transform: translateX(-5px); } 40%,80% { transform: translateX(5px); } }
@keyframes lgDraw    { to { stroke-dashoffset: 0; } }
@keyframes lgProgress{ from { width: 0; } to { width: 100%; } }

.lg-card-in  { animation: lgCardIn .5s ease-out both; }
.lg-overlay  { animation: lgOverlay .2s ease-out both; }
.lg-pop      { animation: lgPop .25s cubic-bezier(.2,.9,.3,1.2) both; }
.lg-shake    { animation: lgShake .4s ease-in-out; }
.lg-draw     { stroke-dasharray: 1; stroke-dashoffset: 1; animation: lgDraw .45s .15s ease-out forwards; }
.lg-progress { animation: lgProgress 1.6s linear forwards; }

@media (prefers-reduced-motion: reduce) {
  .lg-card-in, .lg-overlay, .lg-pop, .lg-shake { animation: none !important; }
  .lg-draw { animation: none !important; stroke-dashoffset: 0; }
  .lg-progress { animation: none !important; width: 100%; }
}
`;

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

const UserIcon = (p) => (
  <Svg {...p}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Svg>
);

const PhoneIcon = (p) => (
  <Svg {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

const LockIcon = (p) => (
  <Svg {...p}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

const EyeIcon = (p) => (
  <Svg {...p}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);

const EyeOffIcon = (p) => (
  <Svg {...p}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </Svg>
);

const Spinner = () => (
  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
    <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

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

/* ================= POPUP THEMES ================= */

const POPUP_THEME = {
  success: { circle: "bg-[#E6F6EF] text-[#1F9D6B]", button: GOLD_BTN },
  error: { circle: "bg-[#FCEAEA] text-[#D64545]", button: INK_BTN },
  warning: { circle: "bg-[#FDF1DD] text-[#D98E1F]", button: INK_BTN },
};

const PopupIcon = ({ type }) => {
  if (type === "success") {
    return (
      <Svg className="w-10 h-10" strokeWidth={2.6}>
        <path className="lg-draw" pathLength="1" d="M5 13l4 4L19 7" />
      </Svg>
    );
  }

  if (type === "error") {
    return (
      <Svg className="w-10 h-10" strokeWidth={2.6}>
        <path className="lg-draw" pathLength="1" d="M6 6l12 12" />
        <path className="lg-draw" pathLength="1" d="M18 6L6 18" />
      </Svg>
    );
  }

  return (
    <Svg className="w-10 h-10" strokeWidth={2.6}>
      <path d="M12 7v6" />
      <path d="M12 17h.01" />
    </Svg>
  );
};

/* ================= POPUP (স্ক্রিনের মাঝখানে) ================= */

const Popup = ({ popup, onClose }) => {
  const btnRef = useRef(null);

  const isSuccess = popup.type === "success";
  const theme = POPUP_THEME[popup.type] || POPUP_THEME.error;

  useEffect(() => {
    if (!popup.open) return;
    btnRef.current?.focus();
  }, [popup.open]);

  if (!popup.open) return null;

  return (
    <div
      className="lg-overlay fixed inset-0 z-50 flex items-center justify-center px-5
                 bg-[#06141d]/70 backdrop-blur-sm"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lg-popup-title"
        aria-describedby="lg-popup-msg"
        onClick={(e) => e.stopPropagation()}
        className="lg-pop w-full max-w-sm rounded-3xl bg-white
                   px-7 pt-9 pb-7 text-center
                   shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)]"
      >
        <div
          className={`mx-auto mb-5 flex h-20 w-20 items-center
                      justify-center rounded-full ${theme.circle}`}
        >
          <PopupIcon type={popup.type} />
        </div>

        <h3 id="lg-popup-title" className="text-xl font-bold text-[#0A1F2E]">
          {popup.title}
        </h3>

        <p id="lg-popup-msg" className="mt-2 text-[15px] leading-relaxed text-[#5B6770]">
          {popup.message}
        </p>

        {isSuccess && (
          <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-[#EFE9D8]">
            <div className="lg-progress h-full rounded-full bg-[#C9A24B]" />
          </div>
        )}

        {/* শুধু ভুল / সতর্কতায় বাটন থাকবে */}
        {!isSuccess && (
          <button
            ref={btnRef}
            type="button"
            onClick={onClose}
            className={`mt-6 w-full rounded-xl py-3.5 text-[16px] font-semibold transition ${theme.button}`}
          >
            ঠিক আছে
          </button>
        )}
      </div>
    </div>
  );
};

/* ================= INPUT FIELD ================= */

const InputField = ({
  id,
  label,
  icon,
  value,
  onChange,
  type = "text",
  placeholder,
  maxLength,
  inputMode,
  autoComplete,
  hasError,
  rightSlot,
}) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-medium text-[#33404A]">
      {label}
    </label>

    <div className={`group relative ${hasError ? "lg-shake" : ""}`}>
      <span
        className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-colors
          ${hasError ? "text-[#D64545]" : "text-[#8A8571] group-focus-within:text-[#B48A34]"}`}
      >
        {icon}
      </span>

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={hasError ? "true" : "false"}
        className={`w-full rounded-xl border bg-white
          py-3.5 pl-12 pr-12 text-[16px] text-[#0A1F2E]
          placeholder:text-[#B5B09F] transition
          focus:outline-none focus:ring-4
          ${
            hasError
              ? "border-[#D64545] focus:border-[#D64545] focus:ring-[#D64545]/15"
              : "border-[#E3DDCC] focus:border-[#C9A24B] focus:ring-[#C9A24B]/20"
          }`}
      />

      {rightSlot && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightSlot}</div>
      )}
    </div>
  </div>
);

/* ================= REGISTER ================= */

const Register = () => {
  const navigate = useNavigate();
  const redirectTimer = useRef(null);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [fieldError, setFieldError] = useState({
    name: false,
    phone: false,
    password: false,
  });

  const [popup, setPopup] = useState({
    open: false,
    type: "error",
    title: "",
    message: "",
  });

  /* আগে থেকে লগইন করা থাকলে সরাসরি পরের পেজে */
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      navigate("/personal-info", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    return () => clearTimeout(redirectTimer.current);
  }, []);

  const showPopup = (type, title, message) => {
    setPopup({ open: true, type, title, message });
  };

  const closePopup = () => {
    setPopup((current) => ({ ...current, open: false }));
  };

  const redirectAfter = (path) => {
    redirectTimer.current = setTimeout(() => {
      navigate(path, { replace: true });
    }, 1600);
  };

  const clearError = (key) => {
    if (fieldError[key]) {
      setFieldError((current) => ({ ...current, [key]: false }));
    }
  };

  /* ================= CHANGE HANDLERS ================= */

  const handleNameChange = (e) => {
    setName(e.target.value);
    clearError("name");
  };

  // Only digits + max 13 digit
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 13);
    setPhoneNumber(value);
    clearError("phone");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    clearError("password");
  };

  /* ================= REGISTER ================= */

  const handleRegister = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    if (popup.open && popup.type === "success") return;

    const cleanName = name.trim();

    /* ---------- VALIDATION ---------- */

    if (!cleanName) {
      setFieldError({ name: true, phone: false, password: false });
      showPopup("warning", "নাম দিন", "নাম ঘরটি ফাঁকা রাখা যাবে না।");
      return;
    }

    if (phoneNumber.length < 11) {
      setFieldError({ name: false, phone: true, password: false });
      showPopup("warning", "ফোন নম্বর অসম্পূর্ণ", "১১ ডিজিটের সঠিক ফোন নম্বর দিন।");
      return;
    }

    if (password.length < MIN_PASSWORD) {
      setFieldError({ name: false, phone: false, password: true });
      showPopup(
        "warning",
        "পাসওয়ার্ড ছোট হয়েছে",
        "কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন।"
      );
      return;
    }

    /* ---------- API ---------- */

    setLoading(true);

    try {
      await api.post("/auth/register", {
        name: cleanName,
        phone_number: phoneNumber,
        password,
      });

      setFieldError({ name: false, phone: false, password: false });

      // রেজিস্ট্রেশনের পর নিজে থেকে লগইন
      let token = null;
      let role = null;

      try {
        const loginRes = await api.post("/auth/login/user", {
          phone_number: phoneNumber,
          password,
        });

        token = loginRes.data?.access_token || null;
        role = loginRes.data?.role || null;
      } catch (loginErr) {
        token = null;
      }

      if (token) {
        localStorage.setItem("access", token);
        if (role) localStorage.setItem("role", role);

        showPopup(
          "success",
          "নিবন্ধন সফল হয়েছে",
          "আপনার অ্যাকাউন্ট তৈরি হয়েছে। তথ্য পূরণের পেজে নিয়ে যাওয়া হচ্ছে।"
        );

        redirectAfter("/personal-info");
      } else {
        // অ্যাকাউন্ট তৈরি হয়েছে, কিন্তু অটো লগইন হয়নি
        showPopup(
          "success",
          "অ্যাকাউন্ট তৈরি হয়েছে",
          "এখন ফোন নম্বর ও পাসওয়ার্ড দিয়ে লগইন করুন।"
        );

        redirectAfter("/login");
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setFieldError({ name: false, phone: true, password: false });

        showPopup(
          "error",
          "অ্যাকাউন্ট আগে থেকেই আছে",
          "এই ফোন নম্বর দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে। লগইন করুন অথবা অন্য নম্বর দিন।"
        );

        return;
      }

      if (!err.response) {
        showPopup(
          "error",
          "ইন্টারনেট সংযোগ নেই",
          "ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।"
        );

        return;
      }

      showPopup(
        "error",
        "নিবন্ধন করা যায়নি",
        "সার্ভারে সমস্যা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div
      className="lg-root min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background:
          "radial-gradient(1100px 560px at 50% -10%, #17495a 0%, #0A1F2E 62%)",
      }}
    >
      <style>{styles}</style>

      <div className="lg-card-in w-full max-w-md">
        <div
          className="rounded-3xl border border-[#C9A24B]/30 bg-[#FAF8F3]
                     px-6 py-8 sm:px-9 sm:py-10
                     shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
        >
          {/* LOGO */}
          <div className="flex justify-center mb-6">
            <img
              src={BankLogo}
              alt="ব্যাংকের লোগো"
              className="w-44 sm:w-52 object-contain"
            />
          </div>

          {/* TITLE */}
          <h2 className="text-center text-2xl font-bold text-[#0A1F2E]">
            অ্যাকাউন্ট তৈরি করুন
          </h2>

          <p className="mt-1.5 mb-7 text-center text-[15px] leading-relaxed text-[#5B6770]">
            নাম, ফোন নম্বর ও পাসওয়ার্ড দিয়ে নতুন অ্যাকাউন্ট খুলুন।
          </p>

          {/* FORM */}
          <form onSubmit={handleRegister} noValidate className="flex flex-col gap-5">
            <InputField
              id="name"
              label="নাম (ইংরেজি)"
              icon={<UserIcon />}
              value={name}
              onChange={handleNameChange}
              placeholder="Robiul Alom"
              autoComplete="name"
              hasError={fieldError.name}
            />

            <InputField
              id="phone"
              label="ফোন নম্বর (ইংরেজি)"
              icon={<PhoneIcon />}
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="01523456789"
              maxLength={13}
              inputMode="numeric"
              autoComplete="tel"
              hasError={fieldError.phone}
            />

            <InputField
              id="password"
              label="পাসওয়ার্ড"
              icon={<LockIcon />}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              placeholder="কমপক্ষে ৬ অক্ষর"
              autoComplete="new-password"
              hasError={fieldError.password}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
                  className="flex h-10 w-10 items-center justify-center rounded-lg
                             text-[#8A8571] transition hover:text-[#0A1F2E]
                             focus-visible:outline-none focus-visible:ring-2
                             focus-visible:ring-[#C9A24B]/50"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            />

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-1 flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5
                text-[17px] font-semibold transition
                disabled:cursor-not-allowed disabled:opacity-70
                ${GOLD_BTN}`}
            >
              {loading ? (
                <>
                  <Spinner />
                  <span>অ্যাকাউন্ট তৈরি হচ্ছে...</span>
                </>
              ) : (
                <span>নিবন্ধন করুন</span>
              )}
            </button>

            {/* LOGIN LINK */}
            <p className="text-center text-[15px] text-[#5B6770]">
              একটি অ্যাকাউন্ট আছে?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#8A6A1F] underline-offset-4 hover:underline
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-[#C9A24B]/50 rounded"
              >
                লগইন করুন
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* POPUP */}
      <Popup popup={popup} onClose={closePopup} />
    </div>
  );
};

export default Register;
