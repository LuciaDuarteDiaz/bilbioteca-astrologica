"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const mockData = {
  "sol en acuario":
    "El Sol en Acuario indica una personalidad independiente, visionaria y orientada al futuro.",
  "sol en casa 4":
    "El Sol en la Casa 4 sugiere que la identidad está profundamente conectada con el hogar y la familia.",
  "aspectos a pluton":
    "Aspectos al planeta Plutón traen intensidad, transformación y poder personal en la carta natal.",
  "aspectos a jupiter":
    "Los aspectos con Júpiter expanden y benefician las áreas involucradas, trayendo suerte y optimismo.",
};

export default function AstroBiblioteca() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = () => {
    const terms = input
      .toLowerCase()
      .split(",")
      .map((t) => t.trim());
    const texts = terms.map((term) => mockData[term]).filter(Boolean);
    setResults(texts);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#f7f4ed] via-[#f7f4ed] to-[#d1c7b7] text-[#2f2f2f] font-serif px-6 py-10">
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

        <div className="space-y-6">
          {results.map((text, i) => (
            <Card
              key={i}
              className="bg-white border border-[#ddd] rounded-xl shadow-sm"
            >
              <CardContent className="p-6">
                <p className="text-lg leading-relaxed">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
