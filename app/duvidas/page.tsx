"use client";

import { useState, useRef, useEffect } from "react";

interface Mensagem {
  role: "user" | "assistant";
  content: string;
}

type Categoria = "escolar" | "concurso";

export default function Duvidas() {
  const [categoria, setCategoria] = useState<Categoria>("escolar");
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const fimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  function trocarCategoria(nova: Categoria) {
    setCategoria(nova);
    setMensagens([]);
    setErro("");
  }

  async function enviarMensagem() {
    if (!input.trim() || loading) return;

    const novaMensagem: Mensagem = { role: "user", content: input };
    const historico = [...mensagens, novaMensagem];
    setMensagens(historico);
    setInput("");
    setLoading(true);
    setErro("");

    try {
      const res = await fetch("/api/tira-duvidas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoria, mensagens: historico }),
      });

      if (!res.ok) throw new Error("Falha ao responder");

      const data = await res.json();
      setMensagens([...historico, { role: "assistant", content: data.resposta }]);
    } catch {
      setErro("Não foi possível responder agora. Tenta de novo.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1">
        <h1 className="text-2xl font-bold mb-4 text-center mt-4">
          Tira-Dúvidas
        </h1>

        <div className="flex gap-2 mb-4 justify-center">
          <button
            onClick={() => trocarCategoria("escolar")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              categoria === "escolar"
                ? "bg-blue-600"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            🏫 Matérias escolares
          </button>
          <button
            onClick={() => trocarCategoria("concurso")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              categoria === "concurso"
                ? "bg-blue-600"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            📋 Matérias pra concurso
          </button>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 flex-1 flex flex-col min-h-[400px] max-h-[60vh]">
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {mensagens.length === 0 && (
              <p className="text-gray-500 text-center mt-8">
                {categoria === "escolar"
                  ? "Manda sua dúvida de matéria escolar aqui embaixo 👇"
                  : "Manda sua dúvida sobre matéria de concurso aqui embaixo 👇"}
              </p>
            )}

            {mensagens.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-blue-600"
                      : "bg-gray-800"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-lg p-3 text-gray-400">
                  Pensando...
                </div>
              </div>
            )}

            <div ref={fimRef} />
          </div>

          {erro && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 mb-3 text-sm">
              {erro}
            </div>
          )}

          <div className="flex gap-2">
            <textarea
              className="flex-1 bg-gray-800 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua dúvida..."
            />
            <button
              onClick={enviarMensagem}
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-lg px-5 font-semibold transition"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}