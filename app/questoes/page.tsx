"use client";

import { useState } from "react";

interface Questao {
  enunciado: string;
  alternativas: { A: string; B: string; C: string; D: string; E: string };
  correta: string;
  comentario: string;
}

const CONCURSOS = [
  "PRF", "PF", "PM", "PC", "Bombeiro Militar", "TJ", "TRT", "TRF", "TRE",
  "MPU", "INSS", "Receita Federal", "Receita Estadual", "Câmara dos Deputados",
  "Senado Federal", "Tribunal de Contas", "Banco Central", "Correios", "IBGE",
  "Agente Penitenciário", "Guarda Municipal", "Prefeitura Municipal",
  "Concurso Militar (Forças Armadas)",
];

const MATERIAS = [
  "Direito Constitucional", "Direito Administrativo", "Direito Penal",
  "Direito Civil", "Direito Processual Civil", "Direito Processual Penal",
  "Direito Tributário", "Direito do Trabalho", "Direito Previdenciário",
  "Direitos Humanos", "Português", "Redação Oficial", "Raciocínio Lógico",
  "Matemática", "Informática", "Atualidades", "Legislação Especial",
  "Administração Pública", "Contabilidade Pública", "Ética no Serviço Público",
];

const BANCAS = [
  "Cespe/Cebraspe", "FGV", "FCC", "Vunesp", "IBFC", "Cesgranrio",
  "AOCP", "Instituto Access", "Quadrix", "IADES", "Consulplan",
];

export default function Questoes() {
  const [concurso, setConcurso] = useState(CONCURSOS[0]);
  const [materia, setMateria] = useState(MATERIAS[0]);
  const [banca, setBanca] = useState(BANCAS[0]);
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
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center mt-4">
          Gerar Questão
        </h1>

        <div className="bg-gray-900 rounded-xl p-6 mb-6 space-y-4 border border-gray-800">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Concurso</label>
            <select
              className="w-full bg-gray-800 rounded-lg p-3 outline-none focus:ring-2 focus:ring-gray-500"
              value={concurso}
              onChange={(e) => setConcurso(e.target.value)}
            >
              {CONCURSOS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Matéria</label>
            <select
              className="w-full bg-gray-800 rounded-lg p-3 outline-none focus:ring-2 focus:ring-gray-500"
              value={materia}
              onChange={(e) => setMateria(e.target.value)}
            >
              {MATERIAS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Banca (opcional)</label>
            <select
              className="w-full bg-gray-800 rounded-lg p-3 outline-none focus:ring-2 focus:ring-gray-500"
              value={banca}
              onChange={(e) => setBanca(e.target.value)}
            >
              {BANCAS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <button
            onClick={gerarQuestao}
            disabled={loading}
            className="w-full bg-white text-black hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-400 rounded-lg p-3 font-semibold transition"
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
          <div className="bg-gray-900 rounded-xl p-6 space-y-4 border border-gray-800">
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
                  className="mt-4 bg-white text-black hover:bg-gray-200 rounded-lg px-4 py-2 text-sm font-semibold"
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