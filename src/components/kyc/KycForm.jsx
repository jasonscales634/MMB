import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

/* STEPS */
import Step1PersonalInfo from "./steps/Step1PersonalInfo";
import Step2Address from "./steps/Step2Address";
import Step3Nominee from "./steps/Step3Nominee";
import Step4Documents from "./steps/Step4Documents";

const STORAGE_KEY = "kyc_draft";

const KycForm = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    full_name: "",
    nid_number: "",
    mobile_number: "",
    profession: "",
    loan_reason: "",

    current_address: "",
    permanent_address: "",

    nominee_name: "",
    nominee_relation: "",
    nominee_phone: "",

    selfie: null,
    nid_front: null,
    nid_back: null,
    signature: null,
  });

  /* LOAD DRAFT */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  /* VALIDATION */
  const validateStep = () => {
    const map = {
      1: ["full_name", "nid_number", "mobile_number", "profession", "loan_reason"],
      2: ["current_address", "permanent_address"],
      3: ["nominee_name", "nominee_relation", "nominee_phone"],
      4: ["selfie", "nid_front", "nid_back", "signature"],
    };

    let err = {};

    map[step].forEach((key) => {
      if (!formData[key]) err[key] = true;
    });

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  /* ================= SUBMIT FIXED ================= */
  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      setLoading(true);

      const form = new FormData();

      // TEXT
      Object.entries(formData).forEach(([key, value]) => {
        if (
          !value ||
          key === "signature"
        )
          return;

        // FILES
        if (value instanceof File) {
          form.append(key, value);
        } else {
          form.append(key, value);
        }
      });

      // SIGNATURE (BASE64 → BLOB FIX)
      if (formData.signature) {
        const res = await fetch(formData.signature);
        const blob = await res.blob();
        form.append("signature", blob, "signature.png");
      }

      // ⚠️ IMPORTANT: DO NOT set headers manually
      await api.put("/user/kyc/submit-personal-info", form);

      localStorage.removeItem(STORAGE_KEY);
      navigate("/loan");
    } catch (err) {
      console.log("ERROR:", err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">

      <div className="flex justify-between text-sm">
        <span>Step {step}/4</span>
      </div>

      {step === 1 && (
        <Step1PersonalInfo
          formData={formData}
          setFormData={setFormData}
          errors={errors}
        />
      )}

      {step === 2 && (
        <Step2Address
          formData={formData}
          setFormData={setFormData}
          errors={errors}
        />
      )}

      {step === 3 && (
        <Step3Nominee
          formData={formData}
          setFormData={setFormData}
          errors={errors}
        />
      )}

      {step === 4 && (
        <Step4Documents
          formData={formData}
          setFormData={setFormData}
          errors={errors}
        />
      )}

      {/* BUTTONS */}
      <div className="flex gap-2 pt-4">
        {step > 1 && (
          <button
            onClick={prevStep}
            className="w-1/2 bg-gray-400 p-2 text-white"
          >
            Back
          </button>
        )}

        {step < 4 ? (
          <button
            onClick={nextStep}
            className="w-full bg-blue-600 text-white p-2"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-600 text-white p-2"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
};

export default KycForm;
