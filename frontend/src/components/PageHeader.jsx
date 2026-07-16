import React from "react";

export function PageHeader({ title, subtitle, breadcrumb = [], actions, currentPath = "/" }) {
  const crumbs = [
    { label: "Home", path: "/" },
    ...breadcrumb,
  ];

  return (
    <div
      style={{
        marginBottom: "32px",
        padding: "28px 32px",
        background: "linear-gradient(145deg, #17101d 0%, #1b1323 100%)",
        border: "1px solid #3a3340",
        borderRadius: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(240,77,244,0.4), transparent)",
        }}
      />
      
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
            {crumbs.map((crumb, i) => (
              <React.Fragment key={crumb.path || i}>
                {i > 0 && (
                  <span style={{ color: "#6b7280", fontSize: "13px" }}>›</span>
                )}
                {crumb.path ? (
                  <a
                    href={crumb.path}
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: currentPath === crumb.path ? "#f04df4" : "#9ca3af",
                      textDecoration: "none",
                      transition: "color 0.2s",
                      cursor: "pointer",
                    }}
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#ffffff",
                      pointerEvents: "none",
                    }}
                  >
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#ffffff",
              margin: "0 0 6px 0",
              letterSpacing: "-0.8px",
              lineHeight: 1.1,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontSize: "15px",
                color: "#9ca3af",
                margin: 0,
                fontWeight: 400,
                maxWidth: "600px",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              flexShrink: 0,
            }}
          >
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}