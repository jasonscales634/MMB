import React from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Select from "../components/Select";

const Step3Nominee = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Card title="👥 নমিনীর তথ্য">

        <Input
          label="পূর্ণ নাম"
          name="nominee_name"
          placeholder="নমিনীর নাম লিখুন"
          value={formData.nominee_name}
          onChange={handleChange}
          error={errors.nominee_name}
        />

        <Select
          label="সম্পর্ক"
          name="nominee_relation"
          value={formData.nominee_relation}
          onChange={handleChange}
          error={errors.nominee_relation}
          options={[
            "বাবা",
            "মা",
            "ভাই",
            "বোন",
            "স্বামী",
            "স্ত্রী",
            "ছেলে",
            "মেয়ে",
            "অন্যান্য",
          ]}
        />

        <Input
          label="মোবাইল নম্বর"
          name="nominee_phone"
          placeholder="01XXXXXXXXX"
          value={formData.nominee_phone}
          onChange={handleChange}
          error={errors.nominee_phone}
        />

      </Card>

      {/* INFO NOTE */}
      <div className="text-xs text-gray-500 px-2">
        ⚠️ নমিনীর তথ্য সঠিকভাবে দিন। এটি লোন অনুমোদনের ক্ষেত্রে গুরুত্বপূর্ণ।
      </div>
    </>
  );
};

export default Step3Nominee;
