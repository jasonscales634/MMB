import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

/* ============================================================
   কনফিগ
============================================================ */
const BASE_URL = "https://loan.microfinancedevelopmentprojectbangladesh.com";
const DRAFT_KEY = "kyc_draft_v2";

const fileUrl = (v) => {
  if (!v) return null;
  if (v.startsWith("http")) return v;
  return `${BASE_URL}${v.startsWith("/") ? "" : "/"}${v}`;
};

const PROFESSIONS = ["ব্যবসায়ী", "চাকরিজীবী", "কৃষক", "শিক্ষক", "ড্রাইভার", "গৃহিণী", "শিক্ষার্থী", "অন্যান্য"];
const LOAN_REASONS = ["ব্যবসা", "চিকিৎসা", "শিক্ষা", "বিবাহ", "বাড়ি নির্মাণ", "কৃষি", "ব্যক্তিগত প্রয়োজন"];
const RELATIONS = ["পিতা", "মাতা", "স্বামী", "স্ত্রী", "ভাই", "বোন", "ছেলে", "মেয়ে", "অন্যান্য"];

const STEPS = [
  { title: "ব্যক্তিগত", icon: "user" },
  { title: "ঠিকানা", icon: "pin" },
  { title: "নমিনি", icon: "users" },
  { title: "ডকুমেন্ট", icon: "doc" },
];

const STEP_FIELDS = {
  1: ["full_name", "nid_number", "mobile_number", "profession", "loan_reason"],
  2: ["current_address", "permanent_address"],
  3: ["nominee_name", "nominee_relation", "nominee_phone"],
  4: ["selfie", "nid_front", "nid_back", "signature"],
};

const INITIAL = {
  full_name: "",
  nid_number: "",
  mobile_number: "",
  profession: "",
  loan_reason: "",
  current_address: "",
  permanent_address: "",
  nominee_name: "",
  nominee_relation: "",
  nominee_phone: "",
  selfie: null,
  nid_front: null,
  nid_back: null,
  signature: null,
};

/* ============================================================
   স্টাইল (Loan পেজের সাথে একই navy + gold)
============================================================ */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');

.kc-root { font-family: 'Hind Siliguri', 'Noto Sans Bengali', 'Kalpurush', system-ui, sans-serif; }
.kc-num { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; font-variant-numeric: tabular-nums; }
`;

const NAVY_BG = "radial-gradient(900px 420px at 15% -20%, #17495a 0%, #0A1F2E 65%)";

const GOLD_BTN =
  "bg-gradient-to-b from-[#E8CB7E] via-[#C9A24B] to-[#B48A34] text-[#1B1405] " +
  "shadow-[0_10px_24px_-8px_rgba(201,162,75,0.75),inset_0_1px_0_rgba(255,255,255,0.55)] " +
  "hover:brightness-105 active:translate-y-px " +
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C9A24B]/40 " +
  "disabled:opacity-60 disabled:cursor-not-allowed";

/* ============================================================
   আইকন
============================================================ */
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

const BackIcon = () => (
  <Svg className="w-5 h-5">
    <path d="M15 18l-6-6 6-6" />
  </Svg>
);

const CheckIcon = ({ className = "w-4 h-4" }) => (
  <Svg className={className}>
    <path d="M5 13l4 4L19 7" />
  </Svg>
);

const CameraSvg = () => (
  <Svg className="w-8 h-8">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </Svg>
);

const ClockIcon = () => (
  <Svg className="w-4 h-4">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

const AlertIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v5M12 16.5h.01" />
  </Svg>
);

const IconByName = ({ name, className }) => {
  switch (name) {
    case "user":
      return (
        <Svg className={className}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" />
        </Svg>
      );
    case "pin":
      return (
        <Svg className={className}>
          <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </Svg>
      );
    case "users":
      return (
        <Svg className={className}>
          <circle cx="9" cy="8" r="3.5" />
          <path d="M2.5 20c.8-3.4 3.4-5 6.5-5s5.7 1.6 6.5 5" />
          <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 15.3c1.9.7 3.1 2.2 3.5 4.7" />
        </Svg>
      );
    default:
      return (
        <Svg className={className}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" />
          <path d="M14 3v5h5M9 13h6M9 17h6" />
        </Svg>
      );
  }
};

/* ============================================================
   ছোট UI অংশ
============================================================ */
const Shell = ({ title, children }) => (
  <div className="kc-root min-h-screen bg-[#FAF8F3] text-[#0A1F2E]">
    <style>{styles}</style>
    <div
      className="sticky top-0 z-30 border-b border-[#C9A24B]/40 text-white shadow-[0_12px_30px_-16px_rgba(10,31,46,0.8)]"
      style={{ background: NAVY_BG }}
    >
      <div className="mx-auto flex max-w-xl items-center gap-3 px-4 py-3.5">
        <button
          onClick={() => window.history.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#E6C878] transition hover:bg-white/20 active:scale-95"
          aria-label="পেছনে যান"
        >
          <BackIcon />
        </button>
        <h1 className="text-lg font-bold tracking-wide">{title}</h1>
      </div>
    </div>
    <div className="mx-auto max-w-xl px-4 py-5">{children}</div>
  </div>
);

const IconTile = ({ name }) => (
  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#C9A24B]/50 bg-[#0A1F2E] text-[#E6C878]">
    <IconByName name={name} className="h-5 w-5" />
  </span>
);

const Card = ({ title, icon, children }) => (
  <div className="mb-4 rounded-3xl border border-[#E9E2CF] bg-white p-5 shadow-[0_10px_40px_-20px_rgba(10,31,46,0.25)]">
    {title && (
      <div className="mb-4 flex items-center gap-3">
        {icon && <IconTile name={icon} />}
        <h2 className="text-[18px] font-bold text-[#0A1F2E]">{title}</h2>
      </div>
    )}
    <div className="space-y-4">{children}</div>
  </div>
);

const inputBase =
  "w-full rounded-xl border bg-[#FAF8F3] px-4 py-3 text-[16px] text-[#0A1F2E] outline-none transition placeholder:text-[#9AA3AA] focus:bg-white focus:ring-4";
const inputOk = "border-[#E2DAC2] focus:border-[#C9A24B] focus:ring-[#C9A24B]/25";
const inputErr = "border-[#E29B9B] bg-[#FCEFEF] focus:border-[#B02F2F] focus:ring-[#B02F2F]/15";

const Label = ({ children }) => (
  <label className="mb-1.5 block text-[14px] font-semibold text-[#33404A]">{children}</label>
);

const ErrText = ({ children }) => (
  <p className="mt-1.5 text-[13px] font-medium text-[#B02F2F]">{children}</p>
);

const Field = ({ label, name, value, onChange, error, placeholder, type = "text", inputMode, textarea, maxLength }) => (
  <div>
    <Label>{label}</Label>
    {textarea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className={`${inputBase} resize-none ${error ? inputErr : inputOk}`}
      />
    ) : (
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        className={`${inputBase} ${inputMode === "numeric" ? "kc-num" : ""} ${error ? inputErr : inputOk}`}
      />
    )}
    {error && <ErrText>{typeof error === "string" ? error : "এই ঘরটি পূরণ করুন"}</ErrText>}
  </div>
);

const SelectField = ({ label, name, value, onChange, options, error }) => (
  <div>
    <Label>{label}</Label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`${inputBase} appearance-none ${error ? inputErr : inputOk}`}
    >
      <option value="">-- নির্বাচন করুন --</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    {error && <ErrText>একটি অপশন নির্বাচন করুন</ErrText>}
  </div>
);

/* ============================================================
   ফাইল আপলোড বক্স
============================================================ */
const FileBox = ({ label, file, onPick, error }) => {
  const ref = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!(file instanceof File)) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div>
      <div
        onClick={() => ref.current?.click()}
        className={`relative flex h-36 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed text-center transition active:scale-[0.98] ${
          error
            ? "border-[#E29B9B] bg-[#FCEFEF]"
            : preview
            ? "border-[#C9A24B] bg-[#FDF6E3]"
            : "border-[#D9CFAF] bg-[#FAF8F3] hover:border-[#C9A24B] hover:bg-[#FDF6E3]"
        }`}
      >
        <input
          ref={ref}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0])}
        />
        {preview ? (
          <>
            <img src={preview} alt={label} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-gradient-to-t from-[#0A1F2E]/90 to-transparent py-2 text-[12px] font-semibold text-[#F3E2A9]">
              <CheckIcon className="h-3.5 w-3.5" /> {label} • পরিবর্তন করুন
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-[#B07A10]">
            <CameraSvg />
            <p className="text-[13px] font-semibold text-[#0A1F2E]">{label}</p>
            <p className="text-[11px] text-[#5B6770]">ট্যাপ করে আপলোড করুন</p>
          </div>
        )}
      </div>
      {error && <ErrText>এই ফাইলটি আবশ্যক</ErrText>}
    </div>
  );
};

/* ============================================================
   সিগনেচার প্যাড
============================================================ */
const SignaturePad = ({ value, onChange, error }) => {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const dirty = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = 180 * ratio;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0A1F2E";
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, rect.width, 180);

    // আগে আঁকা সিগনেচার ফিরিয়ে আনা (ধাপে ফিরে এলে)
    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, 180);
      img.src = value;
    }
    // eslint-disable-next-line
  }, []);

  const pos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e) => {
    e.preventDefault();
    canvasRef.current.setPointerCapture?.(e.pointerId);
    drawing.current = true;
    const ctx = canvasRef.current.getContext("2d");
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };

  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    dirty.current = true;
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (dirty.current) onChange(canvasRef.current.toDataURL("image/png"));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, rect.width, 180);
    dirty.current = false;
    onChange(null);
  };

  return (
    <div>
      <Label>ডিজিটাল সিগনেচার</Label>
      <div
        className={`overflow-hidden rounded-2xl border-2 border-dashed ${
          error ? "border-[#E29B9B]" : "border-[#D9CFAF]"
        }`}
      >
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: 180, touchAction: "none", display: "block", background: "#fff" }}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          onPointerCancel={end}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[12px] text-[#5B6770]">উপরের বক্সে আঙুল/মাউস দিয়ে সই করুন</span>
        <button type="button" onClick={clear} className="text-[13px] font-semibold text-[#B02F2F]">
          মুছে ফেলুন
        </button>
      </div>
      {error && <ErrText>সিগনেচার আবশ্যক</ErrText>}
    </div>
  );
};

/* ============================================================
   কেওয়াইসি ফর্ম
============================================================ */
const KycForm = ({ onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [formData, setFormData] = useState(INITIAL);

  /* ড্রাফট: শুধু টেক্সট ফিল্ড সেভ হবে (ফাইল/Base64 না) */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (saved) setFormData((p) => ({ ...p, ...saved }));
    } catch {}
  }, []);

  useEffect(() => {
    const textOnly = {};
    Object.entries(formData).forEach(([k, v]) => {
      if (typeof v === "string" && k !== "signature") textOnly[k] = v;
    });
    localStorage.setItem(DRAFT_KEY, JSON.stringify(textOnly));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const setFile = (name, value) => {
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const validate = () => {
    const err = {};
    STEP_FIELDS[step].forEach((k) => {
      const v = formData[k];
      if (!v || (typeof v === "string" && !v.trim())) err[k] = true;
    });
    if (step === 1) {
      if (!err.nid_number && ![10, 13, 17].includes(formData.nid_number.trim().length))
        err.nid_number = "এনআইডি 10, 13 বা 17 ডিজিটের হতে হবে";
      if (!err.mobile_number && !/^01[3-9]\d{8}$/.test(formData.mobile_number.trim()))
        err.mobile_number = "সঠিক 11 ডিজিটের মোবাইল নম্বর দিন";
    }
    if (step === 3 && !err.nominee_phone && !/^01[3-9]\d{8}$/.test(formData.nominee_phone.trim()))
      err.nominee_phone = "সঠিক 11 ডিজিটের মোবাইল নম্বর দিন";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prev = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      setServerError("");

      const form = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (!v || k === "signature") return;
        form.append(k, typeof v === "string" ? v.trim() : v);
      });

      if (formData.signature) {
        const blob = await (await fetch(formData.signature)).blob();
        form.append("signature", blob, "signature.png");
      }

      // Content-Type ম্যানুয়ালি সেট করবেন না
      await api.put("/user/kyc/submit-personal-info", form);

      localStorage.removeItem(DRAFT_KEY);
      onSuccess?.(); // সফল হলে পেমেন্ট ইনফো পেজে যাবে
    } catch (err) {
      const d = err?.response?.data?.detail;
      setServerError(
        typeof d === "string" ? d : "জমা দিতে সমস্যা হয়েছে, আবার চেষ্টা করুন"
      );
    } finally {
      setLoading(false);
    }
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="pb-28">
      {/* ধাপ নির্দেশক */}
      <div
        className="relative mb-4 overflow-hidden rounded-3xl border border-[#C9A24B]/40 p-5 shadow-[0_24px_60px_-24px_rgba(10,31,46,0.8)]"
        style={{ background: NAVY_BG }}
      >
        <div className="relative flex justify-between">
          <div className="absolute left-5 right-5 top-5 h-1 rounded-full bg-white/15" />
          <div
            className="absolute left-5 top-5 h-1 rounded-full bg-gradient-to-r from-[#E8CB7E] to-[#C9A24B] transition-all duration-500"
            style={{ width: `calc((100% - 2.5rem) * ${progress / 100})` }}
          />
          {STEPS.map((s, i) => {
            const n = i + 1;
            const done = n < step;
            const active = n === step;
            return (
              <div key={s.title} className="relative z-10 flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                    done
                      ? "bg-gradient-to-b from-[#E8CB7E] to-[#B48A34] text-[#1B1405]"
                      : active
                      ? "scale-110 border-2 border-[#E6C878] bg-[#0A1F2E] text-[#E6C878] ring-4 ring-[#C9A24B]/25"
                      : "border-2 border-white/20 bg-[#0F2C3F] text-white/50"
                  }`}
                >
                  {done ? <CheckIcon /> : <IconByName name={s.icon} className="h-[18px] w-[18px]" />}
                </div>
                <span className={`text-[12px] font-semibold ${active || done ? "text-[#F3E2A9]" : "text-white/50"}`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ধাপ ১ */}
      {step === 1 && (
        <Card title="ব্যক্তিগত তথ্য" icon="user">
          <Field label="পূর্ণ নাম" name="full_name" value={formData.full_name} onChange={handleChange} error={errors.full_name} placeholder="এনআইডি অনুযায়ী নাম" />
          <Field label="এনআইডি নম্বর" name="nid_number" value={formData.nid_number} onChange={handleChange} error={errors.nid_number} placeholder="10 / 13 / 17 ডিজিট" inputMode="numeric" maxLength={17} />
          <Field label="মোবাইল নম্বর" name="mobile_number" value={formData.mobile_number} onChange={handleChange} error={errors.mobile_number} placeholder="017XXXXXXXX" inputMode="numeric" maxLength={11} />
          <SelectField label="পেশা" name="profession" value={formData.profession} onChange={handleChange} options={PROFESSIONS} error={errors.profession} />
          <SelectField label="লোনের কারণ" name="loan_reason" value={formData.loan_reason} onChange={handleChange} options={LOAN_REASONS} error={errors.loan_reason} />
        </Card>
      )}

      {/* ধাপ ২ */}
      {step === 2 && (
        <Card title="ঠিকানা" icon="pin">
          <Field textarea label="বর্তমান ঠিকানা" name="current_address" value={formData.current_address} onChange={handleChange} error={errors.current_address} placeholder="গ্রাম/মহল্লা, থানা, জেলা" />
          <Field textarea label="স্থায়ী ঠিকানা" name="permanent_address" value={formData.permanent_address} onChange={handleChange} error={errors.permanent_address} placeholder="গ্রাম/মহল্লা, থানা, জেলা" />
          <button
            type="button"
            onClick={() => setFormData((p) => ({ ...p, permanent_address: p.current_address }))}
            className="text-[14px] font-semibold text-[#8A6A1F] underline underline-offset-4"
          >
            বর্তমান ঠিকানাই স্থায়ী ঠিকানা
          </button>
        </Card>
      )}

      {/* ধাপ ৩ */}
      {step === 3 && (
        <Card title="নমিনি তথ্য" icon="users">
          <Field label="নমিনির নাম" name="nominee_name" value={formData.nominee_name} onChange={handleChange} error={errors.nominee_name} placeholder="নমিনির পূর্ণ নাম" />
          <SelectField label="সম্পর্ক" name="nominee_relation" value={formData.nominee_relation} onChange={handleChange} options={RELATIONS} error={errors.nominee_relation} />
          <Field label="নমিনির ফোন" name="nominee_phone" value={formData.nominee_phone} onChange={handleChange} error={errors.nominee_phone} placeholder="017XXXXXXXX" inputMode="numeric" maxLength={11} />
        </Card>
      )}

      {/* ধাপ ৪ */}
      {step === 4 && (
        <Card title="ডকুমেন্ট আপলোড" icon="doc">
          <div className="grid grid-cols-2 gap-3">
            <FileBox label="সেলফি" file={formData.selfie} onPick={(f) => setFile("selfie", f)} error={errors.selfie} />
            <FileBox label="এনআইডি সামনে" file={formData.nid_front} onPick={(f) => setFile("nid_front", f)} error={errors.nid_front} />
            <FileBox label="এনআইডি পেছনে" file={formData.nid_back} onPick={(f) => setFile("nid_back", f)} error={errors.nid_back} />
          </div>
          <SignaturePad value={formData.signature} onChange={(v) => setFile("signature", v)} error={errors.signature} />
          {serverError && (
            <div className="flex items-start gap-3 rounded-2xl border border-[#F0C9C9] bg-[#FCEFEF] p-4 text-[15px] font-medium text-[#B02F2F]">
              <AlertIcon />
              <p>{serverError}</p>
            </div>
          )}
        </Card>
      )}

      {/* নিচের বাটন বার */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E9E2CF] bg-[#FAF8F3]/95 backdrop-blur">
        <div className="mx-auto flex max-w-xl gap-3 px-4 py-3">
          {step > 1 && (
            <button
              onClick={prev}
              className="w-1/3 rounded-xl border border-[#E2DAC2] bg-white py-3.5 text-[16px] font-semibold text-[#0A1F2E] transition hover:border-[#C9A24B] active:scale-95"
            >
              পেছনে
            </button>
          )}
          {step < 4 ? (
            <button onClick={next} className={`flex-1 rounded-xl py-3.5 text-[17px] font-semibold transition ${GOLD_BTN}`}>
              পরবর্তী ধাপ
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={loading}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-[17px] font-semibold transition ${GOLD_BTN}`}
            >
              {loading ? (
                "জমা হচ্ছে..."
              ) : (
                <>
                  <CheckIcon className="h-5 w-5" /> জমা দিন
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   বিস্তারিত (শুধু দেখার জন্য)
============================================================ */
const DetailCard = ({ title, icon, children }) => (
  <div className="mb-4 overflow-hidden rounded-3xl border border-[#E9E2CF] bg-white shadow-[0_10px_40px_-20px_rgba(10,31,46,0.25)]">
    <div className="h-px bg-gradient-to-r from-transparent via-[#C9A24B] to-transparent" />
    <div className="p-5">
      <div className="mb-3 flex items-center gap-3">
        <IconTile name={icon} />
        <h2 className="text-[18px] font-bold text-[#0A1F2E]">{title}</h2>
      </div>
      {children}
    </div>
  </div>
);

const InfoRow = ({ label, value, num }) => (
  <div className="flex justify-between gap-4 border-b border-[#F0EBDD] py-3 last:border-0">
    <span className="shrink-0 text-[14px] text-[#5B6770]">{label}</span>
    <span className={`break-words text-right text-[16px] font-bold text-[#0A1F2E] ${num ? "kc-num" : ""}`}>
      {value || "—"}
    </span>
  </div>
);

const DocThumb = ({ label, src, onOpen }) => {
  const url = fileUrl(src);
  return (
    <button
      type="button"
      disabled={!url}
      onClick={() => url && onOpen({ url, label })}
      className="group relative h-32 overflow-hidden rounded-2xl border border-[#E2DAC2] bg-[#FAF8F3] transition active:scale-[0.97] disabled:opacity-60"
    >
      {url ? (
        <>
          <img src={url} alt={label} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A1F2E]/90 to-transparent py-2 text-[12px] font-semibold text-[#F3E2A9]">
            {label}
          </div>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-1 text-[12px] text-[#B07A10]">
          <CameraSvg />
          {label}
          <span className="text-[11px] text-[#5B6770]">আপলোড নেই</span>
        </div>
      )}
    </button>
  );
};

const formatDate = (v) => {
  if (!v) return null;
  const d = new Date(v);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const KycDetails = ({ data }) => {
  const [viewer, setViewer] = useState(null);
  const submittedAt = formatDate(data.last_submitted_at || data.updated_at);

  return (
    <div className="pb-8">
      <DetailCard title="ব্যক্তিগত তথ্য" icon="user">
        <div className="-my-2">
          <InfoRow label="পূর্ণ নাম" value={data.full_name} />
          <InfoRow label="ফোন" value={data.phone_number} num />
          <InfoRow label="মোবাইল" value={data.mobile_number} num />
          <InfoRow label="এনআইডি" value={data.nid_number} num />
          <InfoRow label="পেশা" value={data.profession} />
          <InfoRow label="লোনের কারণ" value={data.loan_reason} />
        </div>
      </DetailCard>

      <DetailCard title="ঠিকানা" icon="pin">
        <div className="-my-2">
          <InfoRow label="বর্তমান" value={data.current_address} />
          <InfoRow label="স্থায়ী" value={data.permanent_address} />
        </div>
      </DetailCard>

      <DetailCard title="নমিনি" icon="users">
        <div className="-my-2">
          <InfoRow label="নাম" value={data.nominee_name} />
          <InfoRow label="সম্পর্ক" value={data.nominee_relation} />
          <InfoRow label="ফোন" value={data.nominee_phone} num />
        </div>
      </DetailCard>

      <DetailCard title="ডকুমেন্টস" icon="doc">
        <div className="grid grid-cols-2 gap-3">
          <DocThumb label="সেলফি" src={data.selfie} onOpen={setViewer} />
          <DocThumb label="এনআইডি সামনে" src={data.nid_front} onOpen={setViewer} />
          <DocThumb label="এনআইডি পেছনে" src={data.nid_back} onOpen={setViewer} />
          <DocThumb label="সিগনেচার" src={data.signature} onOpen={setViewer} />
        </div>
      </DetailCard>

      {/* জমা দেওয়ার তারিখ — সবার নিচে */}
      {submittedAt && (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#EBDCA8] bg-[#FDF6E3] px-4 py-3.5 text-[14px] font-semibold text-[#5C4512]">
          <ClockIcon />
          <span>জমা দেওয়ার তারিখ:</span>
          <span className="kc-num text-[#0A1F2E]">{submittedAt}</span>
        </div>
      )}

      {/* ছবি বড় করে দেখা */}
      {viewer && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A1F2E]/95 p-4"
          onClick={() => setViewer(null)}
        >
          <p className="mb-3 font-semibold text-[#F3E2A9]">{viewer.label}</p>
          <img
            src={viewer.url}
            alt={viewer.label}
            className="max-h-[75vh] max-w-full rounded-2xl border border-[#C9A24B]/50 bg-white object-contain"
          />
          <button className={`mt-5 rounded-xl px-6 py-2.5 text-[15px] font-semibold ${GOLD_BTN}`}>বন্ধ করুন</button>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   মূল কম্পোনেন্ট (ফর্ম বা বিস্তারিত অটো দেখাবে)
============================================================ */
const PersonalInfo = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/user/kyc/me"); // টোকেন interceptor-ই দিচ্ছে
      setData(res.data || null);
    } catch (err) {
      console.error("কেওয়াইসি ডাটা লোডে সমস্যা:", err);
      setData(null);
      setError("ডাটা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // জমা সফল হলে পেমেন্ট ইনফো পেজে নিয়ে যাবে
  const handleSuccess = () => {
    navigate("/payment-info", { replace: true });
  };

  if (loading) {
    return (
      <Shell title="ব্যক্তিগত তথ্য">
        <div className="animate-pulse space-y-4">
          <div className="h-44 rounded-3xl bg-[#E9E2CF]" />
          <div className="h-32 rounded-3xl bg-[#EFE9D8]" />
          <div className="h-32 rounded-3xl bg-[#EFE9D8]" />
        </div>
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell title="ব্যক্তিগত তথ্য">
        <div className="py-16 text-center">
          <p className="mb-4 font-medium text-[#B02F2F]">{error}</p>
          <button onClick={fetchData} className={`rounded-xl px-6 py-2.5 font-semibold ${GOLD_BTN}`}>
            আবার চেষ্টা করুন
          </button>
        </div>
      </Shell>
    );
  }

  // শুধু kyc_submitted দিয়ে চেক (full_name রেজিস্ট্রেশনে থাকলেও ফর্ম দেখাবে)
  const submitted = data?.kyc_submitted === true;

  return (
    <Shell title={submitted ? "আমার কেওয়াইসি তথ্য" : "কেওয়াইসি যাচাইকরণ"}>
      {submitted ? <KycDetails data={data} /> : <KycForm onSuccess={handleSuccess} />}
    </Shell>
  );
};

export default PersonalInfo;
