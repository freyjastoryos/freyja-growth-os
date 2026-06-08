import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "48px", fontWeight: 300, color: "#2D2A28" }}>404</h1>
        <p style={{ color: "#6F625B", marginBottom: "24px" }}>This page doesn't exist.</p>
        <Link href="/" style={{ color: "#B8927A" }}>Go home</Link>
      </div>
    </div>
  );
}
