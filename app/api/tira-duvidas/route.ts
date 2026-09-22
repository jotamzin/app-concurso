import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { categoria, mensagens } = await req.json();

    if (!mensagens || !Array.isArray(mensagens)) {
      return NextResponse.json(
        { error: "mensagens é obrigatório" },
        { status: 400 }
      );
    }

    const instrucaoEscolar = `Você é um professor particular paciente e didático, ajudando um aluno do ensino fundamental/médio com dúvidas escolares (matemática, português, ciências, história, geografia, etc). Explique de forma simples, com exemplos práticos, passo a passo. Evite jargões desnecessários.`;

    const instrucaoConcurso = `Você é um professor especialista em preparação para concursos públicos no Brasil. Ajude o candidato a entender o tópico com profundidade técnica adequada pro nível de concurso, citando legislação/artigos relevantes quando aplicável, e focando no que costuma ser cobrado em prova.`;

    const systemPrompt = categoria === "concurso" ? instrucaoConcurso : instrucaoEscolar;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          ...mensagens,
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq respondeu ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const resposta = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({ resposta });
  } catch (error) {
    console.error("Erro ao responder dúvida:", error);
    return NextResponse.json(
      { error: "Erro ao responder dúvida" },
      { status: 500 }
    );
  }
}