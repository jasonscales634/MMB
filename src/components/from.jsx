import React, { useState, useRef, useEffect } from "react";
import api from "../services/api";
import CameraIcon from "../assets/icons/Camera.jpg";
import { useNavigate } from "react-router-dom";

const From = () => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
   const navigate = useNavigate();   // ✅ ADD HERE

  const [loading, setLoading] = useState(false);   // ✅ ADD HERE
  const [success, setSuccess] = useState(false);    // ✅ ADD HERE


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

  /* ================= CANVAS ================= */
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
  }, []);

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    setFormData((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  /* ================= FILE ================= */
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((p) => ({
      ...p,
      [e.target.name]: file,
    }));
  };

  /* ================= SIGNATURE ================= */
  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
  };

  const startDraw = (e) => {
    isDrawing.current = true;
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDraw = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    const dataURL = canvasRef.current.toDataURL("image/png");
    setFormData((p) => ({ ...p, signature: dataURL }));
  };

  const clearSignature = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, 350, 180);
    setFormData((p) => ({ ...p, signature: null }));
  };

  /* ================= SUBMIT ================= */
const handleSubmit = async () => {
  const form = new FormData();

  const required = [
    "full_name",
    "nid_number",
    "mobile_number",
    "profession",
    "loan_reason",
    "current_address",
    "permanent_address",
    "nominee_name",
    "nominee_relation",
    "nominee_phone",
    "selfie",
    "nid_front",
    "nid_back",
    "signature"
  ];

  for (let key of required) {
    if (!formData[key] || formData[key].toString().trim() === "") {
      console.log("Missing:", key);
      return;
    }
  }

  // append normal fields
  Object.keys(formData).forEach((key) => {
    if (
      key !== "signature" &&
      key !== "selfie" &&
      key !== "nid_front" &&
      key !== "nid_back"
    ) {
      form.append(key, formData[key]);
    }
  });

  // files
  if (formData.selfie) form.append("selfie", formData.selfie);
  if (formData.nid_front) form.append("nid_front", formData.nid_front);
  if (formData.nid_back) form.append("nid_back", formData.nid_back);

  // signature
  if (formData.signature) {
    const res = await fetch(formData.signature);
    const blob = await res.blob();
    form.append("signature", blob, "signature.png");
  }

  try {
    setLoading(true);

    await api.put("/user/kyc/submit-personal-info", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // ✅ DIRECT NAVIGATION (BEST PRACTICE)
    navigate("/loan");

  } catch (err) {
    console.log(err.response?.data?.detail || err.message);
  } finally {
    setLoading(false);
  }
};
return (
  <div className="p-4 max-w-xl mx-auto space-y-4 bg-gray-50">

    {/* PERSONAL */}
    <Card title="👤 ব্যক্তিগত তথ্য">
      <Input name="full_name" label="পূর্ণ নাম" example="জাকির আলী" onChange={handleChange} />
      <Input name="nid_number" label="জাতীয় পরিচয়পত্র নম্বর" example="১২৩৪৫৬৭৮৯" onChange={handleChange} />
      <Input name="mobile_number" label="মোবাইল নম্বর" example="০১৫১২৩৪৫৬৭৮" onChange={handleChange} />
      <Input name="profession" label="পেশা" example="শিক্ষক, ব্যবসায়ী" onChange={handleChange} />

      <Select
        name="loan_reason"
        label="ঋণের কারণ"
        options={[
          "ব্যবসায়িক লোন",
          "চাকরিজীবী লোন",
          "কৃষি লোন",
          "গৃহায়ণ লোন",
          "নির্মাণ লোন",
          "প্রবাসী লোন",
          "যানবাহন লোন",
          "ব্যক্তিগত লোন",
        ]}
        onChange={handleChange}
      />
    </Card>

    {/* ADDRESS */}
    <Card title="🏠 ঠিকানা">
      <Input name="current_address" label="বর্তমান ঠিকানা" example="মতিঝিল, ঢাকা-১২১০" onChange={handleChange} />
      <Input name="permanent_address" label="স্থায়ী ঠিকানা" example="ঝাড়খণ্ড, চট্টগ্রাম-৩০২৫" onChange={handleChange} />
    </Card>

    {/* NOMINEE */}
    <Card title="👥 নমিনীর তথ্য">
      <Input name="nominee_name" label="পূর্ণ নাম" example="জাকির আলী" onChange={handleChange} />

      <Select
        name="nominee_relation"
        label="সম্পর্ক"
        options={["বাবা", "মা", "ভাই", "বোন", "স্বামী", "স্ত্রী", "ছেলে", "মেয়ে"]}
        onChange={handleChange}
      />

      <Input name="nominee_phone" label="মোবাইল নম্বর" example="০১৫১২৩৪৫৬৭৮" onChange={handleChange} />
    </Card>

    {/* FILE */}
    <Card title="📸 ডকুমেন্ট">
      <FileBox name="selfie" label="সেলফি আপলোড করুন" file={formData.selfie} onChange={handleFile} />
      <FileBox name="nid_front" label="আইডি (সামনের দিক)" file={formData.nid_front} onChange={handleFile} />
      <FileBox name="nid_back" label="আইডি (পেছনের দিক)" file={formData.nid_back} onChange={handleFile} />
    </Card>

    {/* SIGNATURE */}
    <Card title="✍️ স্বাক্ষর">
      <canvas
        ref={canvasRef}
        width={350}
        height={180}
        className="border w-full"
        style={{ touchAction: "none" }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />

      <button
        onClick={clearSignature}
        className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
      >
        মুছুন
      </button>
    </Card>

    {/* SUBMIT */}
{/* SUBMIT */}
<button
  onClick={handleSubmit}
  disabled={loading}
  className={`w-full py-3 rounded text-white font-semibold transition-all duration-300 transform
  ${
    loading
      ? "bg-gray-500 cursor-not-allowed scale-95"
      : "bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95"
  }`}
>
  {loading ? "Submitting..." : "পরবর্তী পেজ"}
</button>

  </div>
);
};

export default From;




/* ================= COMPONENTS ================= */

const Card = ({ title, children }) => (
  <div className="bg-white p-4 rounded shadow space-y-3">
    <h2 className="font-bold">{title}</h2>
    {children}
  </div>
);

/* ✅ UPDATED INPUT */
const Input = ({ label, name, example, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      name={name}
      placeholder={` ${example}`}
      onChange={onChange}
      className="w-full border p-2 rounded text-sm"
    />
  </div>
);

/* ✅ UPDATED SELECT */
const Select = ({ label, name, options, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select name={name} onChange={onChange} className="w-full border p-2 rounded text-sm">
      <option value="">-- নির্বাচন করুন --</option>
      {options.map((o, i) => (
        <option key={i} value={o}>{o}</option>
      ))}
    </select>
  </div>
);

const FileBox = ({ name, label, file, onChange }) => {
  const inputRef = React.useRef(); // 👈 CHANGE THIS

  return (
    <div
      onClick={() => inputRef.current.click()}
      className="border p-3 rounded cursor-pointer"
    >
      <input
        ref={inputRef}
        type="file"
        hidden
        name={name}
        onChange={onChange}
      />
      <p className="text-sm">{label}</p>
      <img
        src={file ? URL.createObjectURL(file) : CameraIcon}
        className="h-24 mt-2 rounded object-cover"
        alt=""
      />
    </div>
  );
};
