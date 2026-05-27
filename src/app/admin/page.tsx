import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Building2, UtensilsCrossed, Users, MessageSquare, MapPin } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const [cityCount, attractionCount, foodCount, userCount, reviewCount] = await Promise.all([
    prisma.city.count(),
    prisma.attraction.count(),
    prisma.food.count(),
    prisma.user.count(),
    prisma.review.count(),
  ]);

  const stats = [
    { label: "Cities", value: cityCount, icon: MapPin, href: "/admin/cities", color: "bg-blue-50 text-blue-600" },
    { label: "Attractions", value: attractionCount, icon: Building2, href: "/admin/attractions", color: "bg-green-50 text-green-600" },
    { label: "Foods", value: foodCount, icon: UtensilsCrossed, href: "/admin/foods", color: "bg-amber-50 text-amber-600" },
    { label: "Users", value: userCount, icon: Users, href: "/admin/users", color: "bg-purple-50 text-purple-600" },
    { label: "Reviews", value: reviewCount, icon: MessageSquare, href: "/admin/reviews", color: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/admin/cities/new" className="flex items-center gap-2 text-sm text-red-600 hover:underline"><MapPin className="w-4 h-4" /> Add new city</Link>
            <Link href="/admin/attractions/new" className="flex items-center gap-2 text-sm text-red-600 hover:underline"><Building2 className="w-4 h-4" /> Add new attraction</Link>
            <Link href="/admin/foods/new" className="flex items-center gap-2 text-sm text-red-600 hover:underline"><UtensilsCrossed className="w-4 h-4" /> Add new food</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
