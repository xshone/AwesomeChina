import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import StarRating from "@/components/ui/StarRating";

export default async function AdminReviewsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const reviews = await prisma.review.findMany({
    include: {
      user: { select: { name: true, email: true } },
      attraction: { select: { nameEn: true } },
      food: { select: { nameEn: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reviews ({reviews.length})</h1>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Target</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Rating</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Comment</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{r.user.name}</div>
                  <div className="text-xs text-gray-400">{r.user.email}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">{r.attraction?.nameEn ?? r.food?.nameEn}</td>
                <td className="px-4 py-3"><StarRating rating={r.rating} size="sm" /></td>
                <td className="px-4 py-3 max-w-xs">
                  <p className="text-gray-600 line-clamp-2 text-xs">{r.content}</p>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">{r.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
