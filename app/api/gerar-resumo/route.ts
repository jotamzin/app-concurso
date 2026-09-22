import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { pedido } = await req.json();

    if (!pedido) {
      return NextResponse.json(
        { error: "pedido é obrigatório" },
        { status: 400 }
      );
    }

    const prompt = `Você é um professor especialista em preparar candidatos para concursos públicos no Brasil.

Um aluno pediu o seguinte: "${pedido}"

Escreva um resumo teórico completo e didático atendendo exatamente esse pedido.

Regras:
- Organize em tópicos claros, com subtítulos
- Foque nos pontos mais cobrados em prova
- Use linguagem direta, sem enrolação
- Inclua exemplos práticos quando ajudar a fixar o conteúdo
- Tamanho: médio (não muito curto, não excessivamente longo)

Responda em texto simples, usando quebras de linha e "##" para subtítulos. Não use markdown com asteriscos.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq respondeu ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const resumo = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({ resumo });
  } catch (error) {
    console.error("Erro ao gerar resumo:", error);
    return NextResponse.json(
      { error: "Erro ao gerar resumo" },
      { status: 500 }
    );
  }
}