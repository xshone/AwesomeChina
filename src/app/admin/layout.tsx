import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MapPin, Building2, UtensilsCrossed, Users, MessageSquare, LayoutDashboard } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/cities", label: "Cities", icon: MapPin },
    { href: "/admin/attractions", label: "Attractions", icon: Building2 },
    { href: "/admin/foods", label: "Foods", icon: UtensilsCrossed },
    { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
    { href: "/admin/users", label: "Users", icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 shrink-0">
        <div className="p-4 border-b border-gray-100">
          <p className="font-bold text-gray-900 text-sm">🇨🇳 Admin Panel</p>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100 mt-auto">
          <Link href="/en" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-700">
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
