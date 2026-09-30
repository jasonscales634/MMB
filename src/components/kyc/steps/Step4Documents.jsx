import React, { useRef } from "react";
import Card from "../components/Card";
import FileBox from "../components/FileBox";
import SignaturePad from "../components/SignaturePad";

const Step4Documents = ({ formData, setFormData, errors }) => {
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { name } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  const setSignature = (dataURL) => {
    setFormData((prev) => ({
      ...prev,
      signature: dataURL,
    }));
  };

  return (
    <>
      {/* ================= DOCUMENT UPLOAD ================= */}
      <Card title="📸 ডকুমেন্ট আপলোড">

        <FileBox
          name="selfie"
          label="সেলফি (নিজের ছবি)"
          file={formData.selfie}
          onChange={handleFile}
          error={errors.selfie}
        />

        <FileBox
          name="nid_front"
          label="NID (সামনের দিক)"
          file={formData.nid_front}
          onChange={handleFile}
          error={errors.nid_front}
        />

        <FileBox
          name="nid_back"
          label="NID (পেছনের দিক)"
          file={formData.nid_back}
          onChange={handleFile}
          error={errors.nid_back}
        />

      </Card>

      {/* ================= SIGNATURE ================= */}
      <Card title="✍️ স্বাক্ষর">

        <SignaturePad
          value={formData.signature}
          onChange={setSignature}
        />

        {errors.signature && (
          <p className="text-red-500 text-xs mt-2">
            স্বাক্ষর আবশ্যক
          </p>
        )}

      </Card>

      {/* ================= NOTE ================= */}
      <div className="text-xs text-gray-500 px-2">
        ⚠️ সঠিক ডকুমেন্ট আপলোড করুন। ভুল তথ্য KYC reject হতে পারে।
      </div>
    </>
  );
};

export default Step4Documents;
