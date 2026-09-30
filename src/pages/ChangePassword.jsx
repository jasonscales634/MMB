// src/pages/ChangePassword.jsx
import React, { useState } from "react";
import TopBar from "../components/TopBar";
import DownBar from "../components/DownBar";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("নতুন পাসওয়ার্ড মিলছে না!");
      return;
    }
    // API কল করে পাসওয়ার্ড চেঞ্জ করা যাবে
    alert("পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!");
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <TopBar />
      <div className="max-w-md mx-auto p-6 space-y-4 mt-4 bg-white rounded-2xl shadow">
        <h2 className="text-xl font-semibold">পাসওয়ার্ড পরিবর্তন</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="বর্তমান পাসওয়ার্ড"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="password"
            placeholder="নতুন পাসওয়ার্ড"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="password"
            placeholder="নতুন পাসওয়ার্ড পুনরায় লিখুন"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg"
          >
            পরিবর্তন করুন
          </button>
        </form>
      </div>
      <DownBar />
    </div>
  );
};

export default ChangePassword;
