import React, { useState } from "react";

export default function AskSanriPage({ mode }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!question.trim()) return;

    const userText = question;
    setQuestion("");
    setLoading(true);

    setMessages((m) => [...m, { role: "user", text: userText }]);

    try {
      const API_BASE = "https://sanri-api-production.up.railway.app";  
      const res = await fetch('${API_BASE}/ask', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      question: userText,
      mode: mode,
     }),
  }); 
      const data = await res.json();

      setMessages((m) => [
        ...m,
        { role: "assistant", text: data.answer },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Şu an sessizlik var. Bir nefes alıp tekrar sor.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <div
        style={{
          borderRadius: 18,
          padding: 18,
          background: "rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "white",
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10, opacity: 0.9 }}>
            <b>{m.role === "user" ? "Sen" : "SANRI"}:</b> {m.text}
          </div>
        ))}

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <textarea
            rows={3}
            placeholder="Sorunu buraya yaz…"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
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
              background: loading ? "#444" : "white",
              color: loading ? "#ccc" : "black",
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