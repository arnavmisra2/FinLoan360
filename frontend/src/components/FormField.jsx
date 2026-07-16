import React from "react";

export function FormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  className = "",
  style = {},
  inputStyle = {},
  ...props
}) {
  const [focused, setFocused] = React.useState(false);
  const hasError = !!error;

  return (
    <div className={className} style={{ ...style, position: "relative" }}>
      {label && (
        <label
          htmlFor={props.id}
          style={{
            display: "block",
            fontSize: "11px",
            fontWeight: 600,
            color: "#9ca3af",
            marginBottom: "8px",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            transition: "color 0.2s",
          }}
        >
          {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
        </label>
      )}
      <input
        id={props.id}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e)}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        style={{
          width: "100%",
          height: "52px",
          padding: "0 18px",
          fontSize: "15px",
          fontFamily: "inherit",
          color: "#ffffff",
          background: disabled ? "#0e0e12" : "#17101d",
          border: `1px solid ${hasError ? "#ef4444" : focused ? "#f04df4" : "#3a3340"}`,
          borderRadius: "12px",
          outline: "none",
          transition: "all 0.2s ease",
          boxSizing: "border-box",
          boxShadow: focused && !hasError ? "0 0 0 3px rgba(240,77,244,0.15)" : "none",
          ...inputStyle,
        }}
        {...props}
      />
      {hasError && (
        <p style={{ fontSize: "12px", color: "#ef4444", margin: "6px 0 0 2px" }}>{error}</p>
      )}
      {!hasError && helperText && (
        <p style={{ fontSize: "12px", color: "#6b7280", margin: "6px 0 0 2px" }}>{helperText}</p>
      )}
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  className = "",
  style = {},
  selectStyle = {},
  ...props
}) {
  const [focused, setFocused] = React.useState(false);
  const hasError = !!error;

  return (
    <div className={className} style={{ ...style, position: "relative" }}>
      {label && (
        <label
          htmlFor={props.id}
          style={{
            display: "block",
            fontSize: "11px",
            fontWeight: 600,
            color: "#9ca3af",
            marginBottom: "8px",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
        </label>
      )}
      <select
        id={props.id}
        value={value}
        onChange={(e) => onChange?.(e)}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        disabled={disabled}
        required={required}
        style={{
          width: "100%",
          height: "52px",
          padding: "0 18px",
          fontSize: "15px",
          fontFamily: "inherit",
          color: "#ffffff",
          background: disabled ? "#0e0e12" : "#17101d",
          border: `1px solid ${hasError ? "#ef4444" : focused ? "#f04df4" : "#3a3340"}`,
          borderRadius: "12px",
          outline: "none",
          transition: "all 0.2s ease",
          boxSizing: "border-box",
          boxShadow: focused && !hasError ? "0 0 0 3px rgba(240,77,244,0.15)" : "none",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 16px center",
          paddingRight: "48px",
          ...selectStyle,
        }}
        {...props}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hasError && (
        <p style={{ fontSize: "12px", color: "#ef4444", margin: "6px 0 0 2px" }}>{error}</p>
      )}
      {!hasError && helperText && (
        <p style={{ fontSize: "12px", color: "#6b7280", margin: "6px 0 0 2px" }}>{helperText}</p>
      )}
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  rows = 4,
  className = "",
  style = {},
  ...props
}) {
  const [focused, setFocused] = React.useState(false);
  const hasError = !!error;

  return (
    <div className={className} style={{ ...style, position: "relative" }}>
      {label && (
        <label
          htmlFor={props.id}
          style={{
            display: "block",
            fontSize: "11px",
            fontWeight: 600,
            color: "#9ca3af",
            marginBottom: "8px",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
        </label>
      )}
      <textarea
        id={props.id}
        value={value}
        onChange={(e) => onChange?.(e)}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        style={{
          width: "100%",
          minHeight: "120px",
          padding: "16px 18px",
          fontSize: "15px",
          fontFamily: "inherit",
          color: "#ffffff",
          background: disabled ? "#0e0e12" : "#17101d",
          border: `1px solid ${hasError ? "#ef4444" : focused ? "#f04df4" : "#3a3340"}`,
          borderRadius: "12px",
          outline: "none",
          transition: "all 0.2s ease",
          boxSizing: "border-box",
          resize: "vertical",
          boxShadow: focused && !hasError ? "0 0 0 3px rgba(240,77,244,0.15)" : "none",
          ...style,
        }}
        {...props}
      />
      {hasError && (
        <p style={{ fontSize: "12px", color: "#ef4444", margin: "6px 0 0 2px" }}>{error}</p>
      )}
      {!hasError && helperText && (
        <p style={{ fontSize: "12px", color: "#6b7280", margin: "6px 0 0 2px" }}>{helperText}</p>
      )}
    </div>
  );
}