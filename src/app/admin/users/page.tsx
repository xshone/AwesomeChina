import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import { User } from "lucide-react";

export default async function AdminUsersPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") redirect("/");

    const users = await prisma.user.findMany({
        include: { _count: { select: { reviews: true, favorites: true } } },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Users ({users.length})</h1>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">Reviews</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">Favorites</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        {u.image ? (
                                            <Image src={u.image} alt="" width={28} height={28} className="rounded-full" />
                                        ) : (
                                            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                                                <User className="w-3.5 h-3.5 text-gray-400" />
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-medium text-gray-900">{u.name}</div>
                                            <div className="text-xs text-gray-400">{u.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.role === "ADMIN" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-600">{u._count.reviews}</td>
                                <td className="px-4 py-3 text-gray-600">{u._count.favorites}</td>
                                <td className="px-4 py-3 text-xs text-gray-400">{u.createdAt.toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
