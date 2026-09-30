import React from "react";
import Input from "../components/Input";
import Select from "../components/Select";
import Card from "../components/Card";

const Step1PersonalInfo = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Card title="👤 ব্যক্তিগত তথ্য">

      <Input
        label="পূর্ণ নাম"
        name="full_name"
        placeholder="আপনার নাম লিখুন"
        value={formData.full_name}
        onChange={handleChange}
        error={errors.full_name}
      />

      <Input
        label="জাতীয় পরিচয়পত্র নম্বর"
        name="nid_number"
        placeholder="NID নম্বর"
        value={formData.nid_number}
        onChange={handleChange}
        error={errors.nid_number}
      />

      <Input
        label="মোবাইল নম্বর"
        name="mobile_number"
        placeholder="01XXXXXXXXX"
        value={formData.mobile_number}
        onChange={handleChange}
        error={errors.mobile_number}
      />

      <Input
        label="পেশা"
        name="profession"
        placeholder="আপনার পেশা"
        value={formData.profession}
        onChange={handleChange}
        error={errors.profession}
      />

      <Select
        label="ঋণের কারণ"
        name="loan_reason"
        value={formData.loan_reason}
        onChange={handleChange}
        error={errors.loan_reason}
        options={[
          "ব্যবসা",
          "চাকরি",
          "কৃষি",
          "ব্যক্তিগত",
          "গৃহ নির্মাণ",
          "গাড়ি",
        ]}
      />
    </Card>
  );
};

export default Step1PersonalInfo;
