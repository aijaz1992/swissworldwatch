"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", textAlign: "center", padding: "96px 16px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Something went wrong</h1>
        <p style={{ marginTop: 12, color: "#555" }}>Please try again in a moment.</p>
        <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={reset} style={{ padding: "10px 18px", border: "1px solid #111", borderRadius: 6 }}>
            Try again
          </button>
          <a href="/" style={{ padding: "10px 18px", border: "1px solid #111", borderRadius: 6 }}>
            Go to homepage
          </a>
        </div>
      </body>
    </html>
  );
}
