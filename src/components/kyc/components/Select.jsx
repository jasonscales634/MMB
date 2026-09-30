import React from "react";

const Select = ({ label, name, value, options, onChange, error }) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full border p-2 rounded ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">-- নির্বাচন করুন --</option>

        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-red-500 text-xs">একটি অপশন নির্বাচন করুন</p>
      )}
    </div>
  );
};

export default Select;
