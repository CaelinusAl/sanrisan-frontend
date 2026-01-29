import React, { useMemo, useState } from "react";

function nowTime() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function AskSanriPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState(() => [
    { role: "system", text: "ASK SANRI hazır. Sorunu yaz; cevap akışı başlayacak.", time: nowTime() },
  ]);

  const apiBase = useMemo(() => (process.env.REACT_APP_API_URL || "").trim(), []);

  async function handleSend() {
    const q = input.trim();
    if (!q || loading) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", text: q, time: nowTime() }]);
    setLoading(true);

    try {
      if (apiBase) {
        const res = await fetch(${apiBase}/ask, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q }),
        });

        if (!res.ok) throw new Error(API error: ${res.status});
        const data = await res.json();

        setMessages((m) => [
          ...m,
          { role: "assistant", text: data.answer || "(Boş cevap)", time: nowTime() },
        ]);
      } else {
        const mock = Soru alındı: “${q}”.\n\nBackend bağlanınca gerçek cevap burada akacak.;
        await new Promise((r) => setTimeout(r, 400));
        setMessages((m) => [...m, { role: "assistant", text: mock, time: nowTime() }]);
      }
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: Hata oldu: ${String(e.message || e)}, time: nowTime() },
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
      <h2 style={{ margin: 0 }}>ASK SANRI</h2>
      <p style={{ marginTop: 8, opacity: 0.75 }}>
        Sorunu yaz. Enter = gönder, Shift+Enter = alt satır.
      </p>

      <div
        style={{
          marginTop: 16,
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 12,
          padding: 12,
          height: 420,
          overflow: "auto",
          background: "white",
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
                marginTop: 6,
                background:
                  msg.role === "user"
                    ? "rgba(0,0,0,0.06)"
                    : msg.role === "assistant"
                    ? "rgba(0,0,0,0.03)"
                    : "rgba(0,0,0,0.02)",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <div style={{ fontSize: 12, opacity: 0.6, marginTop: 10 }}>Yanıt hazırlanıyor…</div>}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Sorunu buraya yaz…"
          rows={3}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.18)",
            resize: "vertical",
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            width: 120,
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.18)",
            background: loading || !input.trim() ? "rgba(0,0,0,0.06)" : "black",
            color: loading || !input.trim() ? "rgba(0,0,0,0.4)" : "white",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "…" : "Gönder"}
        </button>
      </div>

      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.65 }}>
        Backend bağlamak için: <code>REACT_APP_API_URL</code> env ekleyip <code>/ask</code> endpoint’i açacağız.
      </div>
    </div>
  );
}