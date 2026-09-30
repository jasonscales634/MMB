import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import TopBar from "../components/TopBar";
import DownBar from "../components/DownBar";

// ICONS
import shieldIcon from "../assets/shield.png";
import padlockIcon from "../assets/padlock.png";
import logoutIcon from "../assets/log-out.png";
import idCardIcon from "../assets/id-card.png";
import creditIcon from "../assets/credit.jpg";

const BASE_URL = "https://loan.microfinancedevelopmentprojectbangladesh.com";

/* ================= STYLES (Loan পেজের সাথে একই ফন্ট ও রং) ================= */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');

.pf-root { font-family: 'Hind Siliguri', 'Noto Sans Bengali', 'Kalpurush', system-ui, sans-serif; }
.pf-num { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; font-variant-numeric: tabular-nums; }
`;

const NAVY_CARD_BG = "radial-gradient(900px 420px at 15% -20%, #17495a 0%, #0A1F2E 65%)";

const GOLD_BTN =
  "bg-gradient-to-b from-[#E8CB7E] via-[#C9A24B] to-[#B48A34] text-[#1B1405] " +
  "shadow-[0_10px_24px_-8px_rgba(201,162,75,0.75),inset_0_1px_0_rgba(255,255,255,0.55)] " +
  "hover:brightness-105 active:translate-y-px " +
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C9A24B]/40";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, []);

  // ================= FETCH USER =================
  const fetchUser = async () => {
    try {
      const token =
        localStorage.getItem("access") ||
        localStorage.getItem("token");

      const res = await api.get("/user/kyc/me", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      setUser(res.data);
    } catch (err) {
      console.log(err);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ================= IMAGE FIX =================
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const getInitial = (name) =>
    name?.trim()?.charAt(0)?.toUpperCase() || "U";

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="pf-root min-h-screen bg-[#FAF8F3]">
        <style>{styles}</style>
        <TopBar />
        <div className="mx-auto mt-6 max-w-3xl animate-pulse space-y-4 px-4">
          <div className="h-40 rounded-3xl bg-[#E9E2CF]" />
          <div className="h-44 rounded-3xl bg-[#EFE9D8]" />
          <div className="h-16 rounded-2xl bg-[#EFE9D8]" />
        </div>
      </div>
    );
  }

  return (
    <div className="pf-root min-h-screen bg-[#FAF8F3] pb-28 text-[#0A1F2E]">
      <style>{styles}</style>
      <TopBar />

      <div className="mx-auto mt-6 max-w-3xl space-y-6 px-4">
        {/* ===== PROFILE HEADER ===== */}
        <section
          className="relative overflow-hidden rounded-3xl border border-[#C9A24B]/40 shadow-[0_24px_60px_-24px_rgba(10,31,46,0.8)]"
          style={{ background: NAVY_CARD_BG }}
        >
          {/* সোনালি হেয়ারলাইন */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E6C878] to-transparent" />

          <div className="relative flex flex-col items-center px-5 pb-6 pt-7 text-center">
            <div className="rounded-full bg-gradient-to-b from-[#E8CB7E] via-[#C9A24B] to-[#B48A34] p-[3px] shadow-[0_10px_24px_-8px_rgba(201,162,75,0.75)]">
              {user?.selfie ? (
                <img
                  src={getImageUrl(user.selfie)}
                  alt="avatar"
                  className="h-20 w-20 rounded-full border-2 border-[#0A1F2E] object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#0A1F2E] bg-[#0F2C3F] text-3xl font-bold text-[#E6C878]">
                  {getInitial(user?.full_name)}
                </div>
              )}
            </div>

            <h2 className="mt-4 max-w-full break-words text-lg font-bold tracking-wide text-white">
              {user?.full_name || "ব্যবহারকারী"}
            </h2>

            {user?.phone_number && (
              <div className="pf-num mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#C9A24B]/40 bg-white/10 px-3.5 py-1.5 text-[13px] font-medium text-[#F3E2A9]">
                <PhoneSvg />
                {user.phone_number}
              </div>
            )}
          </div>
        </section>

        {/* ===== GROUP 1 ===== */}
        <MenuGroup title="অ্যাকাউন্ট">
          <MenuItem
            label="ব্যক্তিগত তথ্য"
            sub="আপনার KYC তথ্য দেখুন"
            icon={idCardIcon}
            onClick={() => navigate("/personal-info")}
          />
          <MenuItem
            label="ব্যাংক অ্যাকাউন্ট"
            sub="পেমেন্ট মেথড ও অ্যাকাউন্ট"
            icon={creditIcon}
            onClick={() => navigate("/payment-info")}
          />
        </MenuGroup>

        {/* ===== GROUP 2 ===== */}
        <MenuGroup title="সেটিংস ও নিরাপত্তা">
          <MenuItem
            label="নিয়মাবলী ও শর্তাবলী"
            sub="ব্যবহারের নিয়ম জানুন"
            icon={shieldIcon}
            onClick={() => navigate("/terms")}
          />
          <MenuItem
            label="পাসওয়ার্ড পরিবর্তন"
            sub="অ্যাকাউন্ট সুরক্ষিত রাখুন"
            icon={padlockIcon}
            onClick={() => navigate("/change-password")}
          />
        </MenuGroup>

        {/* ===== LOGOUT ===== */}
        <button
          type="button"
          onClick={() => setConfirmLogout(true)}
          className="flex w-full items-center justify-between rounded-2xl border border-[#F0C9C9] bg-white px-4 py-3.5 shadow-[0_10px_40px_-20px_rgba(176,47,47,0.35)] transition active:scale-[0.98]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B02F2F]">
              <img src={logoutIcon} alt="logout" className="h-5 w-5 invert" />
            </div>
            <span className="text-[16px] font-semibold text-[#B02F2F]">লগ আউট</span>
          </div>
          <Chevron className="text-[#E3A9A9]" />
        </button>
      </div>

      {/* ===== LOGOUT CONFIRM ===== */}
      {confirmLogout && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1F2E]/70 p-4 backdrop-blur-sm"
          onClick={() => setConfirmLogout(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-[#E9E2CF] bg-white p-6 text-center shadow-[0_24px_60px_-24px_rgba(10,31,46,0.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A1F2E]">
              <img src={logoutIcon} alt="logout" className="h-6 w-6 invert" />
            </div>
            <h3 className="text-lg font-bold text-[#0A1F2E]">লগ আউট করবেন?</h3>
            <p className="mt-1 text-[15px] text-[#5B6770]">
              আবার ব্যবহার করতে আপনাকে লগইন করতে হবে।
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmLogout(false)}
                className="flex-1 rounded-xl border border-[#E2DAC2] bg-[#FAF8F3] py-3 font-semibold text-[#0A1F2E] transition hover:border-[#C9A24B] active:scale-95"
              >
                বাতিল
              </button>
              <button
                onClick={handleLogout}
                className={`flex-1 rounded-xl py-3 font-semibold transition ${GOLD_BTN}`}
              >
                লগ আউট
              </button>
            </div>
          </div>
        </div>
      )}

      <DownBar />
    </div>
  );
};

// ================= SMALL ICONS =================
const Chevron = ({ className = "text-[#C9A24B]" }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 6l6 6-6 6" />
  </svg>
);

const PhoneSvg = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

// ================= MENU GROUP =================
const MenuGroup = ({ title, children }) => (
  <div>
    <p className="mb-2 px-2 text-[14px] font-semibold text-[#8A6A1F]">{title}</p>
    <div className="divide-y divide-[#F0EBDD] overflow-hidden rounded-3xl border border-[#E9E2CF] bg-white shadow-[0_10px_40px_-20px_rgba(10,31,46,0.25)]">
      {children}
    </div>
  </div>
);

// ================= MENU ITEM =================
const MenuItem = ({ label, sub, icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-[#FAF8F3] active:bg-[#F5F0E2]"
  >
    <div className="flex min-w-0 items-center gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#C9A24B]/50 bg-[#0A1F2E] shadow-[0_8px_20px_-8px_rgba(10,31,46,0.7)]">
        <img src={icon} alt="" className="h-5 w-5 invert" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-[16px] font-semibold text-[#0A1F2E]">{label}</p>
        {sub && <p className="mt-0.5 truncate text-[13px] text-[#5B6770]">{sub}</p>}
      </div>
    </div>

    <Chevron />
  </button>
);

export default Profile;
