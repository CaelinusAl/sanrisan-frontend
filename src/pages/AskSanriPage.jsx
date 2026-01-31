import { useState } from "react";

export default function AskSanriPage({ mode = "ayna_sade" }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  async function askSanri() {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch(${API_URL}/ask, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          mode,
        }),
      });

      const data = await res.json();
      setAnswer(data.answer || "Sessizlik de bir yanıttır.");
    } catch (e) {
      setAnswer("Bağlantı kurulamadı.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        background: "radial-gradient(circle at top, #2b145a, #0b0614)",
        display: "grid",
        placeItems: "center",
        padding: 24,
        color: "white",
        fontFamily: "system-ui",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 760,
          background: "rgba(0,0,0,0.45)",
          borderRadius: 28,
          padding: 28,
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 30px 80px rgba(0,0,0,.6)",
        }}
      >
        <h1 style={{ marginTop: 0, fontFamily: "serif", letterSpacing: 1 }}>
          ASK SANRI
        </h1>
        <p style={{ opacity: 0.7, marginBottom: 20 }}>
          Symbolic Consciousness Mirror
        </p>

        <textarea
          placeholder="Sorunu buraya yaz…"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={4}
          style={{
            width: "100%",
            borderRadius: 16,
            padding: 14,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "white",
            resize: "none",
          }}
        />

        <button
          onClick={askSanri}
          disabled={loading}
          style={{
            marginTop: 14,
            padding: "12px 18px",
            borderRadius: 14,
            background: "linear-gradient(135deg,#7b5cff,#a78bfa)",
            border: "none",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {loading ? "SANRI dinliyor…" : "Gönder"}
        </button>

        {answer && (
          <div
            style={{
              marginTop: 20,
              padding: 16,
              borderRadius: 16,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              whiteSpace: "pre-wrap",
            }}
          >
            {answer}
          </div>
        )}
      </div>
    </div>
  );
}