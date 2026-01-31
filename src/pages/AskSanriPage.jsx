import { useState } from "react";

export default function AskSanriPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("ayna_sade");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "system",
      text: "ASK SANRI hazır. Sorunu yaz; Ayna akışı başlayacak.",
    },
  ]);

  const API = process.env.REACT_APP_API_URL;

  const send = async () => {
    if (!input.trim()) return;

    const question = input;
    setInput("");
    setLoading(true);

    setMessages((m) => [...m, { role: "user", text: question }]);

    try {
      if (!API) throw new Error("API tanımlı değil");

      const res = await fetch(${API}/ask, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, mode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "API hatası");

      setMessages((m) => [...m, { role: "assistant", text: data.answer }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text:
            "Şu an aynayı tutuyorum.\n\n" +
            "Cevap içsel alanda oluşuyor.\n" +
            "(Mock mod)",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #2b145c, #07040e)",
        color: "white",
        padding: 32,
      }}
    >
      <h1 style={{ textAlign: "center", fontFamily: "serif" }}>Ask SANRI</h1>

      <div style={{ maxWidth: 700, margin: "40px auto" }}>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="ayna_sade">Ayna · Sade</option>
          <option value="ayna_derin">Ayna · Derin</option>
          <option value="ayna_eylem">Ayna · Eylem</option>
        </select>

        <div style={{ marginTop: 20 }}>
          {messages.map((m, i) => (
            <p key={i}>
              <b>{m.role}:</b> {m.text}
            </p>
          ))}
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Sorunu yaz…"
          style={{ width: "100%", marginTop: 20 }}
        />

        <button onClick={send} disabled={loading}>
          {loading ? "…" : "Gönder"}
        </button>
      </div>
    </div>
  );
}