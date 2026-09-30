// src/components/DownBar.jsx
import { useNavigate, useLocation } from "react-router-dom";

const NAVS = [
  { label: "হোম", path: "/dashboard", icon: "🏠" },
  { label: "ঋণ", path: "/loan", icon: "💰" },
  { label: "কার্ড", path: "/bank-info", icon: "💳" },
  { label: "সাহায্য", path: "/support", icon: "🆘" },
  { label: "প্রোফাইল", path: "/profile", icon: "👤" },
];

const DownBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md z-50">
      <div className="flex justify-around py-2">
        {NAVS.map((n) => {
          const active = location.pathname.startsWith(n.path);
          return (
            <button
              key={n.path}
              onClick={() => navigate(n.path)}
              className={`flex flex-col items-center text-xs font-semibold transition-colors duration-200 ${
                active
                  ? "text-indigo-600"
                  : "text-gray-500 hover:text-indigo-400"
              }`}
            >
              <span
                className={`text-lg mb-1 transition-transform duration-200 ${
                  active ? "scale-125" : ""
                }`}
              >
                {n.icon}
              </span>
              {n.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DownBar;
