import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import CityForm from "../../CityForm";

interface Props { params: Promise<{ id: string }> }

export default async function EditCityPage({ params }: Props) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") redirect("/");

    const { id } = await params;
    const city = await prisma.city.findUnique({ where: { id } });
    if (!city) notFound();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit: {city.nameEn}</h1>
            <CityForm initial={{
                id: city.id,
                slug: city.slug,
                nameEn: city.nameEn,
                nameZh: city.nameZh,
                nameJa: city.nameJa ?? "",
                nameKo: city.nameKo ?? "",
                nameFr: city.nameFr ?? "",
                descEn: city.descEn,
                descZh: city.descZh,
                heroImage: city.heroImage,
                lat: city.lat,
                lng: city.lng,
                published: city.published,
            }} />
        </div>
    );
}
