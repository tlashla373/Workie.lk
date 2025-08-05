// components/ui/FloatingInput.jsx
import React from "react";

export default function FloatingInput({
  type = "text",
  label,
  value,
  onChange,
  name,
}) {
  return (
    <label className="relative block">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="h-14 w-full px-4 text-lg bg-black bg-opacity-90 text-white rounded-md border-2 border-white border-opacity-50 outline-none focus:border-blue-500 focus:text-white transition duration-200"
      />
      <span className="absolute left-4 top-3 text-lg text-white text-opacity-70 transition-all duration-200 input-text">
        {label}
      </span>
    </label>
  );
}
