import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { concurso, materia, banca } = await req.json();

    if (!concurso || !materia) {
      return NextResponse.json(
        { error: "concurso e materia são obrigatórios" },
        { status: 400 }
      );
    }

    const prompt = `Você é um especialista em elaborar questões de concursos públicos no Brasil.

Gere 1 questão de múltipla escolha INÉDITA para o concurso "${concurso}", matéria "${materia}"${
      banca ? `, no estilo da banca ${banca}` : ""
    }.

Regras:
- 5 alternativas (A a E), apenas 1 correta
- Nível de dificuldade compatível com concurso público real
- Depois da questão, escreva um gabarito comentado explicando por que a alternativa correta está certa e por que as outras estão erradas

Responda APENAS em JSON válido, nesse formato exato, sem markdown, sem texto antes ou depois:

{
  "enunciado": "texto da questão",
  "alternativas": {
    "A": "texto",
    "B": "texto",
    "C": "texto",
    "D": "texto",
    "E": "texto"
  },
  "correta": "A",
  "comentario": "explicação detalhada do gabarito"
}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq respondeu ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || "";

    const cleanText = rawText.replace(/```json|```/g, "").trim();
    const questao = JSON.parse(cleanText);

    // Embaralha as alternativas pra não ficar sempre a mesma letra certa
    const letras = ["A", "B", "C", "D", "E"] as const;
    const valoresOriginais = letras.map((letra) => questao.alternativas[letra]);
    const respostaCorretaTexto = questao.alternativas[questao.correta];

    // Embaralha o array de valores
    for (let i = valoresOriginais.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [valoresOriginais[i], valoresOriginais[j]] = [valoresOriginais[j], valoresOriginais[i]];
    }

    const novasAlternativas: Record<string, string> = {};
    let novaCorreta = "A";

    letras.forEach((letra, index) => {
      novasAlternativas[letra] = valoresOriginais[index];
      if (valoresOriginais[index] === respostaCorretaTexto) {
        novaCorreta = letra;
      }
    });

    const questaoFinal = {
      ...questao,
      alternativas: novasAlternativas,
      correta: novaCorreta,
    };

    return NextResponse.json(questaoFinal);
  } catch (error) {
    console.error("Erro ao gerar questão:", error);
    return NextResponse.json(
      { error: "Erro ao gerar questão" },
      { status: 500 }
    );
  }
}