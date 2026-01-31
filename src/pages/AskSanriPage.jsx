import React, { useState } from "react";

export default function AskSanriPage({ mode }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "system",
      text: "ASK SANRI hazır. Sorunu yaz; Ayna akışı başlayacak.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!question.trim()) return;

    const userText = question;
    setQuestion("");
    setLoading(true);

    setMessages((m) => [...m, { role: "user", text: userText }]);

    try {
      const res = await fetch(
        ${process.env.REACT_APP_API_URL}/ask,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: userText,
            mode,
          }),
        }
      );

      const data = await res.json();

      setMessages((m) => [
        ...m,
        { role: "assistant", text: data.answer },
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Şu an sessizlik var. Birazdan tekrar dene.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px 16px",
        background:
          "radial-gradient(circle at top, #2b1a4d, #0a0a12 60%)",
        color: "white",
        fontFamily: "system-ui",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 24,
          padding: 24,
          backdropFilter: "blur(14px)",
        }}
      >
        <h1
          style={{
            fontFamily: "serif",
            fontSize: 36,
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          Ask SANRI
        </h1>

        <div style={{ opacity: 0.7, marginBottom: 16 }}>
          Consciousness Mirror • {mode.replace("_", " ")}
        </div>

        <div
          style={{
            minHeight: 260,
            padding: 16,
            borderRadius: 16,
            background: "rgba(0,0,0,0.35)",
            marginBottom: 16,
            overflowY: "auto",
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                marginBottom: 10,
                opacity: m.role === "system" ? 0.7 : 1,
              }}
            >
              <b>
                {m.role === "user"
                  ? "Sen"
                  : m.role === "assistant"
                  ? "SANRI"
                  : "Sistem"}
                :
              </b>{" "}
              {m.text}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            placeholder="Sorunu buraya yaz…"
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(0,0,0,0.35)",
              color: "white",
              resize: "vertical",
            }}
          />

          <button
            onClick={send}
            disabled={loading || !question.trim()}
            style={{
              width: 140,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.18)",
              background: loading
                ? "rgba(255,255,255,0.2)"
                : "#ffffff",
              color: loading ? "#000" : "#000",
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "…" : "Gönder"}
          </button>
        </div>
      </div>
    </main>
  );
}