import React, { useEffect, useState } from "react";
import api from "../services/api";

const BASE_URL = "https://loan-server-1-do86.onrender.com";

const FromDetlise = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/user/kyc/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">লোড হচ্ছে...</div>;
  }

  if (!data) {
    return <div className="text-center mt-10">কোনো ডাটা পাওয়া যায়নি</div>;
  }

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">

      {/* 👤 PERSONAL INFO */}
      <Card title="👤 ব্যক্তিগত তথ্য">
        <Row label="নাম" value={data.full_name} />
        <Row label="এনআইডি" value={data.nid_number} />
        <Row label="মোবাইল" value={data.mobile_number} />
        <Row label="পেশা" value={data.profession} />
        <Row label="ঋণের কারণ" value={data.loan_reason} />
      </Card>

      {/* 🏠 ADDRESS */}
      <Card title="🏠 ঠিকানা">
        <Row label="বর্তমান ঠিকানা" value={data.current_address} />
        <Row label="স্থায়ী ঠিকানা" value={data.permanent_address} />
      </Card>

      {/* 👥 NOMINEE */}
      <Card title="👥 নমিনি তথ্য">
        <Row label="নাম" value={data.nominee_name} />
        <Row label="সম্পর্ক" value={data.nominee_relation} />
        <Row label="ফোন" value={data.nominee_phone} />
      </Card>

      {/* 📸 DOCUMENTS */}
      <Card title="📸 ডকুমেন্ট">
        <ImageBox label="সেলফি" src={data.selfie} />
        <ImageBox label="আইডি (সামনে)" src={data.nid_front} />
        <ImageBox label="আইডি (পেছনে)" src={data.nid_back} />
      </Card>

      {/* ✍️ SIGNATURE */}
      <Card title="✍️ স্বাক্ষর">
        {data.signature ? (
          <img
            src={`${BASE_URL}${data.signature}`}
            className="h-24 border rounded"
            alt="signature"
          />
        ) : (
          <p className="text-gray-400">স্বাক্ষর নেই</p>
        )}
      </Card>

    </div>
  );
};

export default FromDetlise;

/* ================= UI COMPONENTS ================= */

const Card = ({ title, children }) => (
  <div className="bg-white p-4 rounded-xl shadow space-y-2">
    <h3 className="font-bold mb-2">{title}</h3>
    {children}
  </div>
);

/* ✅ UPDATED ROW (ALIGNED FORMAT) */
const Row = ({ label, value }) => (
  <div className="flex text-sm py-1">
    <span className="w-32 text-gray-600">{label}</span>
    <span className="mx-1">:</span>
    <span className="font-medium">{value || "-"}</span>
  </div>
);

/* IMAGE VIEW */
const ImageBox = ({ label, src }) => (
  <div className="mb-3">
    <p className="text-sm text-gray-600">{label}</p>

    {src ? (
      <img
        src={src.startsWith("http") ? src : `${BASE_URL}${src}`}
        className="h-24 mt-1 rounded border"
        alt=""
      />
    ) : (
      <p className="text-gray-400 text-sm">নেই</p>
    )}
  </div>
);
