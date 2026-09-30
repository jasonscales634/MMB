import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import api from "../services/api";

/* ================= STYLES ================= */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');

.tb-root { font-family: 'Hind Siliguri', 'Noto Sans Bengali', 'Kalpurush', system-ui, sans-serif; }
`;

const TopBar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  // ================= API CALL =================
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
      console.log("User fetch error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ================= HELPERS =================
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "শুভ সকাল";
    if (h < 17) return "শুভ দুপুর";
    if (h < 20) return "শুভ বিকেল";
    return "শুভ রাত";
  };

  const getInitial = (name) =>
    name?.trim()?.charAt(0)?.toUpperCase() || "U";

  // works for both /uploads/kyc/... and full URL
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `https://loan.microfinancedevelopmentprojectbangladesh.com${path}`;
  };

  return (
    <header className="tb-root px-4 pt-4">
      <style>{styles}</style>

      <div
        className="mx-auto flex max-w-3xl items-center justify-between gap-4
                   rounded-2xl border border-[#C9A24B]/40 p-4 text-white
                   shadow-[0_18px_40px_-20px_rgba(10,31,46,0.85)]"
        style={{
          background:
            "radial-gradient(700px 300px at 10% -40%, #17495a 0%, #0A1F2E 68%)",
        }}
      >
        {/* LEFT */}
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold">
            ক্ষুদ্র-ঋণ উন্নয়ন প্রকল্প
          </h1>

          <p className="mt-0.5 truncate text-[15px] text-white/75">
            {getGreeting()},{" "}
            <span className="font-semibold text-[#E6C878]">
              {user?.full_name || "নতুন ইউজার"}
            </span>
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={() => navigate("/profile")}
            aria-label="প্রোফাইল দেখুন"
            className="relative flex h-11 w-11 items-center justify-center rounded-full
                       border border-white/15 bg-white/10 transition
                       hover:bg-white/15 active:translate-y-px
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-[#C9A24B]"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-[#E5484D] ring-2 ring-[#0F3040]" />
          </button>

          {/* AVATAR */}
          {loading ? (
            <div className="h-11 w-11 animate-pulse rounded-full bg-white/15" />
          ) : user?.selfie ? (
            <img
              src={getImageUrl(user.selfie)}
              alt="প্রোফাইল ছবি"
              className="h-11 w-11 rounded-full object-cover ring-2 ring-[#C9A24B]"
            />
          ) : (
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full
                         border border-[#C9A24B]/60 bg-[#C9A24B]/15
                         text-lg font-bold text-[#E6C878]"
            >
              {getInitial(user?.full_name)}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
