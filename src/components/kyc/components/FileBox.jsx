import React, { useRef, useState, useEffect } from "react";
import CameraIcon from "../../../assets/icons/Camera.jpg";

/* ================= IMAGE PREVIEW SAFE ================= */
const FileBox = ({ name, label, file, onChange, error }) => {
  const ref = useRef();
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div>
      <div
        onClick={() => ref.current.click()}
        className={`border p-3 rounded cursor-pointer text-center ${
          error ? "border-red-500" : ""
        }`}
      >
        <input
          ref={ref}
          type="file"
          hidden
          name={name}
          accept="image/*"
          onChange={onChange}
        />

        <img
          src={preview || CameraIcon}
          alt="upload"
          className="h-20 mx-auto object-contain"
        />

        <p className="text-xs mt-1">{label}</p>
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1">
          এই ফাইলটি আবশ্যক
        </p>
      )}
    </div>
  );
};

export default FileBox;
