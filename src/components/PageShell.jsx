import React from "react";

export default function PageShell({ children, maxWidth = "1120px" }) {
  return (
    <div className="page-shell">
      <div className="orb one" />
      <div className="orb two" />
      <div className="orb three" />
      <div className="content-layer" style={{ maxWidth }}>
        {children}
      </div>
    </div>
  );
}
