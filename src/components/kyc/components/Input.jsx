import React from "react";

const Input = ({ label, name, value, onChange, error, placeholder }) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border p-2 rounded outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />

      {error && (
        <p className="text-red-500 text-xs">এই ফিল্ডটি পূরণ করুন</p>
      )}
    </div>
  );
};

export default Input;
