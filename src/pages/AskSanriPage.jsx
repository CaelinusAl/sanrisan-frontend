import React, { useMemo, useState } from "react";

/** Saat */
function nowTime() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** Basit frekans skoru (frontend tarafı) */
function scoreInput(text) {
  const t = (text || "").toLowerCase().trim();

  const emotionalWords = [
    "korku",
    "kaygı",
    "üzgün",
    "yalnız",
    "bıktım",
    "yoruldum",
    "ağlıyorum",
    "terk",
    "değersiz",
    "kırıldım",
    "sıkıştım",
    "bunaldım",
    "panik",
    "öfke",
  ];
  const actionWords = [
    "ne yapayım",
    "nasıl",
    "hemen",
    "şimdi",
    "bugün",
    "plan",
    "adım",
    "yap",
    "başla",
    "çöz",
    "düzenle",
    "kur",
  ];
  const clarityMarkers = ["çünkü", "yani", "aslında", "bu yüzden", "net", "tam olarak"];

  const emotionalLoad = Math.min(1, emotionalWords.filter((w) => t.includes(w)).length / 3);
  const actionReadiness = Math.min(1, actionWords.filter((w) => t.includes(w)).length / 2);

  const len = t.length;
  const hasPunct = /[.!?]/.test(t);
  const clarityScore = Math.min(
    1,
    (len > 80 ? 0.45 : len > 40 ? 0.3 : 0.15) +
      (hasPunct ? 0.2 : 0) +
      Math.min(0.45, clarityMarkers.filter((w) => t.includes(w)).length * 0.15)
  );

  return { emotionalLoad, actionReadiness, clarityScore };
}

/** Mod seçimi */
function pickMode({ emotionalLoad, actionReadiness, clarityScore }) {
  if (actionReadiness >= 0.6) return "ayna_eylem";
  if (emotionalLoad >= 0.6 && clarityScore < 0.55) return "ayna_sade";
  return "ayna_derin";
}

/** Mod etiketi */
function modeLabel(mode) {
  if (mode === "ayna_eylem") return "AYNA / EYLEM";
  if (mode === "ayna_derin") return "AYNA / DERİN";
  return "AYNA / SADE";
}

/** Mock cevaplar */
function mockAnswer(mode, q) {
  if (mode === "ayna_eylem") {
    return `Tamam. Şimdi 60 saniyelik netlik:

1) Tek cümle hedef: (Ne istiyorum?)
2) Tek cümle engel: (Neyi bırakmalıyım?)
3) Tek küçük adım: (Bugün 10 dakikada ne yapabilirim?)

Sorun: “${q}”`;
  }

  if (mode === "ayna_derin") {
    return `Bu cümlede iki katman var:

* His: Şu an bedenin ne söylüyor?
* İhtiyaç: Aslında hangi güveni arıyorsun?

Bir soru:
“Kendime hangi eski rolü giydiriyorum?”

Sorun: “${q}”`;
  }

  return `Seni duydum.

Şu an sadece bunu taşıyalım:
“En çok neye ihtiyacım var?”

Sorun: “${q}”`;
}export default function AskSanriPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState(() => [
    {
      role: "system",
      mode: "ayna_sade",
      text: "ASK SANRI hazır. Sorunu yaz; Ayna Akışı başlayacak.",
      time: nowTime(),
    },
  ]);

  // ENV varsa backend'e gider, yoksa mock çalışır.
  const apiBase = useMemo(() => (process.env.REACT_APP_API_URL || "").trim(), []);

  async function handleSend() {
    const q = input.trim();
    if (!q || loading) return;

    const scores = scoreInput(q);
    const mode = pickMode(scores);

    setInput("");
    setMessages((m) => [...m, { role: "user", mode, text: q, time: nowTime() }]);
    setLoading(true);

    try {
      if (apiBase) {
        const res = await fetch('${apiBase}/ask', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q, mode }),
        });

        if (!res.ok) {
          throw new Error('API error: ${res.status}');
        }

        const data = await res.json();
        const answerText = data?.answer || "(Boş cevap)";
        const serverMode = data?.mode || mode;

        setMessages((m) => [
          ...m,
          { role: "assistant", mode: serverMode, text: answerText, time: nowTime() },
        ]);
      } else {
        // Mock cevap (şimdilik)
        const answerText = mockAnswer(mode, q);
        await new Promise((r) => setTimeout(r, 450));

        setMessages((m) => [
          ...m,
          { role: "assistant", mode, text: answerText, time: nowTime() },
        ]);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          mode: "ayna_sade",
          text: Hata oldu: ${msg}\n\n(Şimdilik mock moduna devam edebiliriz.),
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
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto", fontFamily: "system-ui" }}>
      <h2 style={{ margin: 0 }}>ASK SANRI</h2>
      <p style={{ marginTop: 8, opacity: 0.75 }}>
        Sorunu yaz. <b>Enter</b> = gönder, <b>Shift+Enter</b> = alt satır.
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
            <div style={{ fontSize: 12, opacity: 0.65 }}>
              <b>{modeLabel(msg.mode)}</b> • {String(msg.role).toUpperCase()} • {msg.time}
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

        {loading && (
          <div style={{ fontSize: 12, opacity: 0.6, marginTop: 10 }}>Yanıt hazırlanıyor…</div>
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
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.18)",
            resize: "vertical",
          }}
        />

        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            width: 140,
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