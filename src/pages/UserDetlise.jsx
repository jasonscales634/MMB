import React, { useEffect, useState } from "react";
import api from "../services/api";

const UserDetlise = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH =================
  const fetchUser = async () => {
    try {
      setLoading(true);
      setError("");

      // ✅ interceptor already handles token
      const res = await api.get("/kyc/me");

      setData(res.data || null);
    } catch (err) {
      console.error(err);
      setError("ডাটা লোড করতে সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading user details...
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-center px-4">
        {error}
      </div>
    );
  }

  // ================= EMPTY =================
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No user data found
      </div>
    );
  }

  const user = data || {};

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">

      {/* HEADER */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">👤 ইউজার ডিটেইলস</h1>

        <div className="mt-2">
          <span className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
            স্ট্যাটাস: {user.status || "PENDING"}
          </span>
        </div>
      </div>

      {/* PERSONAL INFO */}
      <Section title="ব্যক্তিগত তথ্য">
        <InfoRow label="নাম" value={user.name} />
        <InfoRow label="ফোন" value={user.phone_number} />
        <InfoRow label="পূর্ণ নাম" value={user.full_name} />
        <InfoRow label="এনআইডি" value={user.nid_number} />
        <InfoRow label="ঠিকানা" value={user.current_address} />
        <InfoRow label="স্থায়ী ঠিকানা" value={user.permanent_address} />
        <InfoRow label="পেশা" value={user.profession} />
        <InfoRow label="লোন কারণ" value={user.loan_reason} />
        <InfoRow label="সাবমিট টাইম" value={user.last_submitted_at} />
      </Section>

      {/* ACCOUNT */}
      <Section title="অ্যাকাউন্ট">
        <InfoRow label="ID" value={user.unique_id} />
        <InfoRow label="ব্যালেন্স" value={`৳ ${user.balance || 0}`} />
        <InfoRow label="KYC সাবমিট" value={data.kyc_submitted ? "হ্যাঁ" : "না"} />
      </Section>

      {/* NOMINEE */}
      <Section title="নমিনি">
        <InfoRow label="নাম" value={user.nominee_name} />
        <InfoRow label="সম্পর্ক" value={user.nominee_relation} />
        <InfoRow label="ফোন" value={user.nominee_phone} />
      </Section>

      {/* STAFF */}
      <Section title="স্টাফ">
        <InfoRow label="অ্যাসাইন স্টাফ" value={user.assigned_staff_name} />
      </Section>

      {/* FILES */}
      <Section title="ডকুমেন্টস">
        <FileRow label="সেলফি" value={user.selfie} />
        <FileRow label="NID Front" value={user.nid_front} />
        <FileRow label="NID Back" value={user.nid_back} />
        <FileRow label="সিগনেচার" value={user.signature} />
      </Section>

      {/* PERMISSION */}
      <Section title="পারমিশন">
        <InfoRow label="এডিট" value={data.can_edit ? "হ্যাঁ" : "না"} />
        <InfoRow label="লক" value={data.is_locked ? "হ্যাঁ" : "না"} />
      </Section>

    </div>
  );
};

/* ================= COMPONENTS ================= */

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-md p-5 mb-5">
    <h2 className="text-xl font-semibold mb-3">{title}</h2>
    {children}
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between border-b py-2 text-sm">
    <span className="text-gray-600 font-medium">{label}</span>
    <span className="text-gray-800">{value || "N/A"}</span>
  </div>
);

const FileRow = ({ label, value }) => (
  <div className="flex justify-between items-center border-b py-2 text-sm">
    <span className="text-gray-600 font-medium">{label}</span>

    {value ? (
      <a
        href={value.startsWith("http") ? value : `https://loan-server-1-do86.onrender.com/${value}`}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 font-medium"
      >
        দেখুন
      </a>
    ) : (
      <span className="text-gray-400">N/A</span>
    )}
  </div>
);

export default UserDetlise;
