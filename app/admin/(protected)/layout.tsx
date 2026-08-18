import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import LogoutButton from "@/components/admin/LogoutButton";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/carrossel", label: "Carrossel" },
  { href: "/admin/videos", label: "Vídeos" },
  { href: "/admin/portfolio", label: "Portfólio" },
  { href: "/admin/depoimentos", label: "Depoimentos" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/financiamento", label: "Financiamento" },
  { href: "/admin/configuracoes", label: "Configurações" },
];

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-brand-navy-light">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <span className="text-base font-extrabold tracking-tight text-brand-navy">
              SUMART
            </span>
            <span className="ml-1 text-xs font-semibold uppercase tracking-widest text-brand-orange">
              admin
            </span>
          </div>
          <nav className="hidden gap-6 sm:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-brand-navy/70 hover:text-brand-orange"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <LogoutButton />
        </div>
        <nav className="flex gap-4 overflow-x-auto border-t border-black/5 px-4 py-2 sm:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-sm font-medium text-brand-navy/70"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}
