"use client";

import { useState } from "react";

export default function Resumos() {
  const [pedido, setPedido] = useState("");
  const [resumo, setResumo] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function gerarResumo() {
    if (!pedido.trim()) {
      setErro("Escreve o que você quer estudar.");
      return;
    }

    setLoading(true);
    setErro("");
    setResumo("");

    try {
      const res = await fetch("/api/gerar-resumo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pedido }),
      });

      if (!res.ok) throw new Error("Falha ao gerar resumo");

      const data = await res.json();
      setResumo(data.resumo);
    } catch {
      setErro("Não foi possível gerar o resumo. Tenta de novo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-8 mt-6">
          <div className="flex-1 border-t border-dashed border-yellow-500 max-w-24" />
          <div className="flex items-center gap-2">
            <span className="bg-yellow-500 text-black rounded-md p-1.5 text-lg">
              📄
            </span>
            <h1 className="text-2xl font-bold">Gerar Resumo</h1>
          </div>
          <div className="flex-1 border-t border-dashed border-yellow-500 max-w-24" />
        </div>

        <div className="bg-gray-900 rounded-xl p-6 mb-6 space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-400">
              O que você quer estudar?
            </label>
            <textarea
              className="w-full bg-gray-800 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              value={pedido}
              onChange={(e) => setPedido(e.target.value)}
              placeholder='Ex: "quero um resumo de produtos notáveis", "explica crase de um jeito simples", "resumo completo de princípios da administração pública"'
            />
          </div>

          <button
            onClick={gerarResumo}
            disabled={loading}
            className="w-full bg-white text-black hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-400 rounded-lg p-3 font-semibold transition"
          >
            {loading ? "Gerando resumo..." : "Gerar Resumo"}
          </button>
        </div>

        {erro && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6">
            {erro}
          </div>
        )}

        {resumo && (
          <div className="bg-gray-900 rounded-xl p-6 whitespace-pre-wrap leading-relaxed">
            {resumo}
          </div>
        )}
      </div>
    </div>
  );
}