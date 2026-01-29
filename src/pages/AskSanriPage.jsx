import React, { useMemo, useState } from "react";

function nowTime() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function AskSanriPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "system",
      text: "ASK SANRI hazır. Sorunu yaz; cevap akışı başlayacak.",
      time: nowTime(),
    },
  ]);

  const apiBase = useMemo(
    () => process.env.REACT_APP_API_URL || "",
    []
  );

  async function handleSend() {
    const q = input.trim();
    if (!q || loading) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", text: q, time: nowTime() }]);
    setLoading(true);

    try {
      if (apiBase) {
        const res = await fetch('${apiBase}/ask', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q }),
        });

        if (!res.ok) {
          throw new Error(API error: ${res.status});
        }

        const data = await res.json();

        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            text: data.answer || "(Boş cevap)",
            time: nowTime(),
          },
        ]);
      } else {
        // Mock cevap
        const mock = `Soru alındı: "${q}"

Backend bağlanınca gerçek cevap burada akacak.`;

        await new Promise((r) => setTimeout(r, 500));

        setMessages((m) => [
          ...m,
          { role: "assistant", text: mock, time: nowTime() },
        ]);
      }
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: Hata oldu: ${e.message || e},
          time: nowTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto", fontFamily: "system-ui" }}>
      <h2>ASK SANRI</h2>
      <p style={{ opacity: 0.7 }}>
        Sorunu yaz. Enter = gönder, Shift+Enter = alt satır.
      </p>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 12,
          height: 420,
          overflow: "auto",
          background: "#fff",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, opacity: 0.6 }}>
              {msg.role.toUpperCase()} • {msg.time}
            </div>
            <div
              style={{
                whiteSpace: "pre-wrap",
                padding: "10px 12px",
                borderRadius: 10,
                background:
                  msg.role === "user"
                    ? "#eee"
                    : "#f7f7f7",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <div>Yanıt hazırlanıyor…</div>}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Sorunu buraya yaz…"
          rows={3}
          style={{ flex: 1, padding: 12 }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          Gönder
        </button>
      </div>
    </div>
  );
}