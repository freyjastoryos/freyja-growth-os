"use client";

import { useState } from "react";

const SLUG = "ava-vale-inner-circle";

interface Props {
  heroMode?: boolean;
  signupMode?: boolean;
  minimal?: boolean;
}

export function AvaValeSubscribeForm({ heroMode, signupMode }: Props) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, firstName, slug: SLUG }),
    });
    setStatus(res.ok ? "success" : "error");
  }

  if (status === "success") {
    return (
      <div style={{
        padding: "36px 24px",
        textAlign: "center",
        fontFamily: "'Cormorant Garamond', serif",
      }}>
        <p style={{ fontSize: "22px", fontStyle: "italic", color: "#4A3F38", lineHeight: "1.7" }}>
          The door is open. Welcome inside. 🗝️<br />
          <span style={{ color: "#B8927A" }}>Your welcome gift is on its way.</span>
        </p>
      </div>
    );
  }

  /* ── Hero mode: just one big button ── */
  if (heroMode) {
    return (
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", maxWidth: "420px", margin: "0 auto" }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Your email address"
          style={heroInputStyle}
        />
        <button type="submit" disabled={status === "loading"} style={heroButtonStyle}>
          {status === "loading" ? "One moment…" : "🗝️  Open the Secret Door"}
        </button>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#B8927A", letterSpacing: "0.05em", fontStyle: "italic" }}>
          Watch your inbox — something beautiful is on its way.
        </p>
      </form>
    );
  }

  /* ── Signup section mode: full form ── */
  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
        style={signupInputStyle}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Email Address"
        style={signupInputStyle}
      />
      {status === "error" && (
        <p style={{ color: "#c0706a", fontSize: "13px", textAlign: "center" }}>
          Something went wrong. Please try again.
        </p>
      )}
      <button type="submit" disabled={status === "loading"} style={signupButtonStyle}>
        {status === "loading" ? "One moment…" : "✨  Yes, I Want to Open the Secret Door"}
      </button>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "12px",
        color: "#B8927A",
        textAlign: "center",
        fontStyle: "italic",
        letterSpacing: "0.03em",
      }}>
        Watch your inbox — something beautiful is on its way.
      </p>
    </form>
  );
}

const heroInputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid rgba(200,178,138,0.5)",
  borderRadius: "4px",
  padding: "15px 20px",
  fontSize: "15px",
  fontFamily: "'Inter', sans-serif",
  fontWeight: 300,
  backgroundColor: "#FFFDFB",
  color: "#2D2A28",
  outline: "none",
  textAlign: "center",
};

const heroButtonStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#A67868",
  color: "#FDF7F2",
  border: "none",
  borderRadius: "3px",
  padding: "17px 28px",
  fontSize: "11px",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  cursor: "pointer",
  fontFamily: "'Inter', sans-serif",
  fontWeight: 500,
  boxShadow: "0 4px 20px rgba(166,120,104,0.3)",
};

const signupInputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid rgba(200,178,138,0.4)",
  borderRadius: "4px",
  padding: "16px 20px",
  fontSize: "15px",
  fontFamily: "'Inter', sans-serif",
  fontWeight: 300,
  backgroundColor: "#FFFDFB",
  color: "#2D2A28",
  outline: "none",
  textAlign: "center",
};

const signupButtonStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#A67868",
  color: "#FDF7F2",
  border: "none",
  borderRadius: "3px",
  padding: "18px 28px",
  fontSize: "11px",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  cursor: "pointer",
  fontFamily: "'Inter', sans-serif",
  fontWeight: 500,
  marginTop: "4px",
  boxShadow: "0 4px 20px rgba(166,120,104,0.28)",
};
