import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function PasswordInput({ label, value, onChange, placeholder, error, name, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div className="field">
      {label && <label htmlFor={name}>{label}</label>}
      <div className={`input-shell with-toggle ${error ? "has-error" : ""}`}>
        <Lock className="icon" />
        <input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="toggle"
          onClick={() => setShow((prev) => !prev)}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      <div className="field-error">{error || ""}</div>
    </div>
  );
}
