import AstroAdminForm from "@/app/astro-admin/page";

export default function AdminPage() {
  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">
        Agregar Nueva Entrada Astrológica
      </h1>
      <AstroAdminForm />
    </div>
  );
}
