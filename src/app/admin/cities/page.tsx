import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

export default async function AdminCitiesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const cities = await prisma.city.findMany({
    include: { _count: { select: { attractions: true, foods: true } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cities</h1>
        <Link href="/admin/cities/new" className="flex items-center gap-1.5 bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
          <Plus className="w-4 h-4" /> New City
        </Link>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">City</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Attractions</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Foods</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {cities.map((city) => (
              <tr key={city.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{city.nameEn} <span className="text-gray-400 font-normal">({city.nameZh})</span></td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{city.slug}</td>
                <td className="px-4 py-3 text-gray-600">{city._count.attractions}</td>
                <td className="px-4 py-3 text-gray-600">{city._count.foods}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${city.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {city.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/cities/${city.id}/edit`} className="text-gray-400 hover:text-red-600 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
