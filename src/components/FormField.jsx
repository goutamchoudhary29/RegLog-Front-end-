import React from "react";
import { Mail, Phone, User as UserIcon } from "lucide-react";

const icons = {
  name: UserIcon,
  email: Mail,
  mobile: Phone,
  identifier: Mail,
  default: UserIcon,
};

export default function FormField({ label, name, value, onChange, placeholder, error, type = "text", icon, autoComplete }) {
  const Icon = icons[icon || name] || icons.default;
  return (
    <div className="field">
      {label && <label htmlFor={name}>{label}</label>}
      <div className="input-shell">
        <Icon className="icon" />
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
      </div>
      <div className="field-error">{error || ""}</div>
    </div>
  );
}
