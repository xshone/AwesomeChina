import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

export default async function AdminAttractionsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const attractions = await prisma.attraction.findMany({
    include: { city: { select: { nameEn: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attractions</h1>
        <Link href="/admin/attractions/new" className="flex items-center gap-1.5 bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
          <Plus className="w-4 h-4" /> New Attraction
        </Link>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">City</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Rating</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {attractions.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{a.nameEn}</td>
                <td className="px-4 py-3 text-gray-600">{a.city.nameEn}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{a.category}</td>
                <td className="px-4 py-3 text-gray-600">{a.rating.toFixed(1)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${a.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {a.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/attractions/${a.id}/edit`} className="text-gray-400 hover:text-red-600 transition-colors">
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
