"use client";

import { useState } from "react";

interface Questao {
  enunciado: string;
  alternativas: { A: string; B: string; C: string; D: string; E: string };
  correta: string;
  comentario: string;
}

export default function Home() {
  const [concurso, setConcurso] = useState("PRF");
  const [materia, setMateria] = useState("Direito Constitucional");
  const [banca, setBanca] = useState("Cespe");
  const [questao, setQuestao] = useState<Questao | null>(null);
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function gerarQuestao() {
    setLoading(true);
    setErro("");
    setQuestao(null);
    setSelecionada(null);

    try {
      const res = await fetch("/api/gerar-questao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concurso, materia, banca }),
      });

      if (!res.ok) throw new Error("Falha ao gerar questão");

      const data = await res.json();
      setQuestao(data);
    } catch {
      setErro("Não foi possível gerar a questão. Tenta de novo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          📚 Questões pra Concurso
        </h1>

        <div className="bg-gray-900 rounded-xl p-6 mb-6 space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Concurso</label>
            <input
              className="w-full bg-gray-800 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              value={concurso}
              onChange={(e) => setConcurso(e.target.value)}
              placeholder="Ex: PRF, PM, TJ, INSS"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Matéria</label>
            <input
              className="w-full bg-gray-800 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              value={materia}
              onChange={(e) => setMateria(e.target.value)}
              placeholder="Ex: Direito Constitucional"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Banca (opcional)</label>
            <input
              className="w-full bg-gray-800 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              value={banca}
              onChange={(e) => setBanca(e.target.value)}
              placeholder="Ex: Cespe, FGV"
            />
          </div>

          <button
            onClick={gerarQuestao}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-lg p-3 font-semibold transition"
          >
            {loading ? "Gerando questão..." : "Gerar Questão"}
          </button>
        </div>

        {erro && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6">
            {erro}
          </div>
        )}

        {questao && (
          <div className="bg-gray-900 rounded-xl p-6 space-y-4">
            <p className="text-lg">{questao.enunciado}</p>

            <div className="space-y-2">
              {Object.entries(questao.alternativas).map(([letra, texto]) => {
                const isCorreta = letra === questao.correta;
                const isSelecionada = letra === selecionada;
                let estilo = "bg-gray-800 hover:bg-gray-700";

                if (selecionada) {
                  if (isCorreta) estilo = "bg-green-800 border border-green-500";
                  else if (isSelecionada) estilo = "bg-red-800 border border-red-500";
                }

                return (
                  <button
                    key={letra}
                    onClick={() => !selecionada && setSelecionada(letra)}
                    disabled={!!selecionada}
                    className={`w-full text-left rounded-lg p-3 transition ${estilo}`}
                  >
                    <span className="font-bold mr-2">{letra})</span>
                    {texto}
                  </button>
                );
              })}
            </div>

            {selecionada && (
              <div className="bg-gray-800 rounded-lg p-4 mt-4">
                <p className="font-semibold mb-2">
                  {selecionada === questao.correta ? "✅ Você acertou!" : "❌ Você errou."}
                </p>
                <p className="text-gray-300 text-sm">{questao.comentario}</p>
                <button
                  onClick={gerarQuestao}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 text-sm font-semibold"
                >
                  Próxima questão →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}