import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Estudo",
  description: "Estude com IA",
};

const NAV_ITEMS = [
  { href: "/", label: "Início", icon: "🏠" },
  { href: "/duvidas", label: "Tira Dúvidas", icon: "❓" },
  { href: "/resumos", label: "Resumos", icon: "📄" },
  { href: "/questoes", label: "Provas", icon: "✅" },
  { href: "/progresso", label: "Meu Progresso", icon: "📊" },
  { href: "/configuracoes", label: "Configurações", icon: "⚙️" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-white">
        <div className="flex min-h-screen">
          <aside className="w-64 bg-black border-r border-yellow-500/20 flex flex-col p-4 shrink-0">
            <Link href="/" className="flex items-center gap-2 mb-8 px-2">
              <span className="text-2xl">🎓</span>
              <span className="font-bold text-xl">Estudo</span>
            </Link>

            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative flex items-center gap-3 px-4 py-3 rounded-lg overflow-hidden bg-gray-950 hover:bg-yellow-500 hover:text-black transition-colors"
                >
                  <span className="relative z-10 text-lg">{item.icon}</span>
                  <span className="relative z-10 font-semibold text-sm">
                    {item.label}
                  </span>
                  <span className="absolute right-0 top-0 h-full w-3 bg-yellow-500 skew-x-[-20deg] translate-x-1 opacity-70 group-hover:opacity-0 transition-opacity" />
                </Link>
              ))}
            </nav>

            <div className="mt-auto">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-900 hover:text-white transition"
              >
                <span className="text-lg">🚪</span>
                <span className="font-semibold text-sm">Sair</span>
              </Link>
            </div>
          </aside>

          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}