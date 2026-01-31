import React, { useMemo, useState } from "react";

// Saat: 12:34 formatı
function nowTime() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// API base: önce REACT_APP_API_URL, yoksa boş (mock)
function normalizeBase(url) {
  if (!url) return "";
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export default function AskSanriPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("ayna_sade"); // ayna_sade | ayna_derin | ayna_eylem
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState(() => [
    {
      role: "system",
      mode: "ayna_sade",
      text: "ASK SANRI hazır. Sorunu yaz; Ayna akışı başlayacak.",
      time: nowTime(),
    },
  ]);

  const apiBase = useMemo(() => normalizeBase(process.env.REACT_APP_API_URL || ""), []);

  async function handleSend() {
    const q = input.trim();
    if (!q || loading) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", mode, text: q, time: nowTime() }]);
    setLoading(true);

    try {
      // Backend varsa gerçek istek
      if (apiBase) {
        const res = await fetch(${apiBase}/ask, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q, mode }),
        });

        if (!res.ok) {
          const msg = API error: ${res.status};
          throw new Error(msg);
        }

        const data = await res.json();
        const answer = (data && data.answer) ? String(data.answer) : "(Boş cevap)";

        setMessages((m) => [
          ...m,
          { role: "assistant", mode: data?.mode || mode, text: answer, time: nowTime() },
        ]);
      } else {
        // Mock (backend yoksa)
        const mock = [
          Soru alındı: “${q}”.,
          "",
          "Backend bağlanınca gerçek cevap burada akacak.",
        ].join("\n");

        await new Promise((r) => setTimeout(r, 450));
        setMessages((m) => [...m, { role: "assistant", mode, text: mock, time: nowTime() }]);
      }
    } catch (e) {
      const safe = String(e?.message || e || "Bilinmeyen hata");
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          mode,
          text: [
            Hata oldu: ${safe},
            "",
            "(Şimdilik mock moduna devam edebiliriz.)",
          ].join("\n"),
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

  // Hologram arka plan: public/images/sanri-hologram-bg.png
  const bgUrl = "/images/sanri-hologram-bg.png";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `radial-gradient(1200px 700px at 70% 20%, rgba(160,120,255,0.18), transparent 55%),
                          radial-gradient(900px 600px at 30% 80%, rgba(110,170,255,0.10), transparent 60%),
                          url(${bgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div style={{ padding: 24, maxWidth: 980, margin: "0 auto", fontFamily: "system-ui" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "14px 16px",
            borderRadius: 14,
            background: "rgba(10,12,16,0.55)",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src="/branding/sanri-icon.png"
              alt="SANRI"
              style={{ width: 28, height: 28, borderRadius: 8 }}
            />
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ color: "white", fontWeight: 700, letterSpacing: 0.5 }}>SANRI</div>
              <div style={{ color: "rgba(255,255,255,0.70)", fontSize: 12 }}>Consciousness Mirror</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <label style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>Mod</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              style={{
                height: 36,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(0,0,0,0.35)",
                color: "white",
                padding: "0 10px",
                outline: "none",
              }}
            >
              <option value="ayna_sade">Ayna • Sade</option>
              <option value="ayna_derin">Ayna • Derin</option>
              <option value="ayna_eylem">Ayna • Eylem</option>
            </select>
          </div>
        </div>

        <h2 style={{ margin: "18px 0 0", color: "white" }}>ASK SANRI</h2>
        <p style={{ marginTop: 8, color: "rgba(255,255,255,0.75)" }}>
          Sorunu yaz. <b>Enter</b> = gönder, <b>Shift+Enter</b> = alt satır.
        </p>

        <div
          style={{
            marginTop: 16,
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 14,
            padding: 12,
            height: 440,
            overflow: "auto",
            background: "rgba(255,255,255,0.85)",
          }}
        >
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, opacity: 0.65 }}>
                {msg.mode ? msg.mode.replace("_", " / ").toUpperCase() : "MODE"} •{" "}
                {msg.role.toUpperCase()} • {msg.time}
              </div>
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  padding: "10px 12px",
                  borderRadius: 12,
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

          {loading && (
            <div style={{ fontSize: 12, opacity: 0.65, marginTop: 10 }}>
              Yanıt hazırlanıyor…
            </div>
          )}
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
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.18)",
              resize: "vertical",
              outline: "none",
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              width: 120,
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.18)",
              background: loading || !input.trim() ? "rgba(0,0,0,0.06)" : "black",
              color: loading || !input.trim() ? "rgba(0,0,0,0.45)" : "white",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              fontWeight: 700,
            }}
          >
            {loading ? "…" : "Gönder"}
          </button>
        </div>

        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.8, color: "white" }}>
          Backend bağlamak için: <code>REACT_APP_API_URL</code> env ekleyip{" "}
          <code>/ask</code> endpoint’ini kullanıyoruz.
        </div>
      </div>
    </div>
  );
}