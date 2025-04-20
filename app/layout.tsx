// app/layout.tsx

import "@/app/ui/global.css"; // Importa los estilos globales de Tailwind

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gradient-to-r from-[#9e7b29] via-[#f7f4ed] to-[#d1c7b7]">
        {children}
      </body>
    </html>
  );
}
