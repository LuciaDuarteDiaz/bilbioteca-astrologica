"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { AstroEntry } from "@/lib/definitions";
import { useRouter } from "next/navigation"; // Para redirección

export default function AstroBiblioteca() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<AstroEntry[]>([]);
  const router = useRouter(); // Usar router para redirigir

  const handleSearch = async () => {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: input }),
    });

    const data = await response.json();
    setResults(data.results || []);
  };

  const handleGoToAdmin = () => {
    router.push("/astro-admin"); // Redirigir a la página de administración
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#f7f4ed] via-[#96711a] to-[#d1c7b7] text-[#2f2f2f] font-serif px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 tracking-tight text-center">
          Biblioteca Astrológica
        </h1>

        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe combinaciones como: sol en acuario, sol en casa 4..."
          className="mb-6 w-full p-4 border border-[#cfcfcf] bg-white text-base rounded-lg shadow-sm"
        />

        <Button
          onClick={handleSearch}
          className="w-full sm:w-auto bg-black text-white rounded-full px-6 py-2 hover:bg-[#333] transition-colors mb-10"
        >
          Buscar
        </Button>

        <Button
          onClick={handleGoToAdmin}
          className="w-full sm:w-auto bg-green-600 text-white rounded-full px-6 py-2 hover:bg-green-700 transition-colors"
        >
          Agregar Nueva Entrada
        </Button>

        <div className="space-y-6">
          {results.map((entry, i) => (
            <Card
              key={i}
              className="bg-white border border-[#ddd] rounded-xl shadow-sm"
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{entry.title}</h3>
                <p className="text-lg leading-relaxed">{entry.description}</p>
              </CardContent>
            </Card>
          ))}
          {results.length === 0 && (
            <p className="text-center text-gray-500">
              No se encontraron resultados.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
