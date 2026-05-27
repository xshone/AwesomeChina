import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CityForm from "../CityForm";

export default async function NewCityPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New City</h1>
      <CityForm />
    </div>
  );
}
