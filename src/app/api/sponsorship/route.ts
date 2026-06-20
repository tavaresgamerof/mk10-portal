import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, empresa, cidade, whatsapp, email, plano, mensagem } = body;

    if (!nome || !empresa || !cidade || !whatsapp || !email || !plano) {
      return NextResponse.json({ error: "Campos obrigatorios faltando" }, { status: 400 });
    }

    console.log("=== NOVA PROPOSTA DE PATROCINIO ===");
    console.log(`Nome: ${nome}`);
    console.log(`Empresa: ${empresa}`);
    console.log(`Cidade: ${cidade}`);
    console.log(`WhatsApp: ${whatsapp}`);
    console.log(`Email: ${email}`);
    console.log(`Plano: ${plano}`);
    console.log(`Mensagem: ${mensagem || "N/A"}`);
    console.log(`Data: ${new Date().toLocaleString("pt-BR")}`);
    console.log("===================================");

    return NextResponse.json({ success: true, message: "Proposta recebida com sucesso" });
  } catch {
    return NextResponse.json({ error: "Erro ao processar proposta" }, { status: 500 });
  }
}
