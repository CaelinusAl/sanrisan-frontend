import { useState } from "react";

export default function AskSanriPage({ mode = "ayna_sade" }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    { role: "system", text: "ASK SANRI hazır. Sorunu yaz; Ayna akışı başlayacak." },
  ]);

  const API = process.env.REACT_APP_API_URL; // ör: https://sanri-api-production.up.railway.app

  const send = async () => {
    const q = question.trim();
    if (!q || loading) return;

    setQuestion("");
    setLoading(true);
    setMessages((m) => [...m, { role: "user", text: q }]);

    try {
      if (!API) {
        // API yoksa mock
        const mock =
          mode === "ayna_eylem"
            ? Tamam.\n1) Tek cümle hedef: (Ne istiyorum?)\n2) Tek cümle engel: (Neyi bırakmalıyım?)\n3) Tek küçük adım: (Bugün 10 dk ne yapabilirim?)
            : mode === "ayna_derin"
            ? "Bu cümlede iki katman var:\n- His: Şu an bedenin ne söylüyor?\n- İhtiyaç: Aslında hangi güveni arıyorsun?\nTek soru: “Şu an hangi eski rol çalışıyor?”"
            : "Seni duydum.\nŞu an en çok neye ihtiyacın var? (Tek cümle)";

        setMessages((m) => [...m, { role: "assistant", text: mock }]);
        return;
      }

      const res = await fetch(${API}/ask, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, mode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "API error");

      setMessages((m) => [...m, { role: "assistant", text: data.answer || "(Boş cevap)" }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: Hata oldu: ${String(e?.message || e)}\n\n(Şimdilik mock moduna devam edebiliriz.),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        padding: 24,
        backgroundImage: "url('/images/sanri-hologram-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        fontFamily: "system-ui",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <h2 style={{ margin: 0, fontFamily: "serif", letterSpacing: 1 }}>ASK SANRI</h2>
        <p style={{ marginTop: 8, opacity: 0.85 }}>
          Sorunu yaz. <b>Enter</b> = gönder, <b>Shift+Enter</b> = alt satır.
        </p>

        <div
          style={{
            marginTop: 14,
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.16)",
            background: "rgba(0,0,0,0.40)",
            padding: 14,
            height: 420,
            overflow: "auto",
          }}
        >
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, opacity: 0.7, textTransform: "uppercase" }}>
                {m.role}
              </div>
              <div style={{ whiteSpace: "pre-wrap", marginTop: 6 }}>{m.text}</div>
            </div>
          ))}

          {loading && <div style={{ opacity: 0.7 }}>Yanıt hazırlanıyor…</div>}
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Sorunu buraya yaz…"
            rows={3}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(0,0,0,0.35)",
              color: "white",
              outline: "none",
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
              background: loading || !question.trim() ? "rgba(255,255,255,0.10)" : "white",
              color: loading || !question.trim() ? "rgba(255,255,255,0.65)" : "black",
              fontWeight: 800,
              cursor: loading || !question.trim() ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "…" : "Gönder"}
          </button>
        </div>

        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
          Backend bağlamak için: <code>REACT_APP_API_URL</code> env ekleyip <code>/ask</code> endpoint’ini kullanıyoruz.
        </div>
      </div>
    </div>
  );
}