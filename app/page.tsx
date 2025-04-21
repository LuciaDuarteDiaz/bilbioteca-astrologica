"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { AstroEntry } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({
  entry,
  onRemove,
}: {
  entry: AstroEntry;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: entry.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 bg-white border border-[#ccc] rounded-xl shadow mb-2 flex justify-between items-start gap-4"
    >
      <div>
        <strong>{entry.title}</strong>
        <p className="text-sm mt-1">{entry.description}</p>
      </div>
      <button
        onClick={onRemove}
        className="text-red-500 text-sm font-bold hover:text-red-700"
        aria-label="Eliminar"
      >
        ✖
      </button>
    </div>
  );
}

export default function AstroBiblioteca() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<AstroEntry[]>([]);
  const [selectedEntries, setSelectedEntries] = useState<AstroEntry[]>([]);
  const router = useRouter();

  const handleSearch = async () => {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: input }),
    });

    const data = await response.json();
    setResults(data.results || []);
    setSelectedEntries([]); // limpiar seleccionados
  };

  const handleGoToAdmin = () => {
    router.push("/astro-admin");
  };

  const toggleEntry = (entry: AstroEntry) => {
    const alreadySelected = selectedEntries.find(
      (e) => e.title === entry.title
    );
    if (alreadySelected) {
      setSelectedEntries(
        selectedEntries.filter((e) => e.title !== entry.title)
      );
    } else {
      setSelectedEntries([...selectedEntries, entry]);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const combinedText = selectedEntries
      .map((entry) => `• ${entry.title}\n${entry.description}\n\n`)
      .join("");
    const lines = doc.splitTextToSize(combinedText, 180);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(lines, 10, 10);
    doc.save("informe-astrologico.pdf");
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="min-h-screen bg-[#f8f4ee] text-[#2f2f2f] font-serif px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-5xl font-bold tracking-tight text-center text-[#3b2f2f]">
          Biblioteca Astrológica
        </h1>

        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ej. sol en acuario, sol en casa 4..."
          className="w-full p-5 border border-[#ddd] bg-white text-base rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-[#bca472]"
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Button
            onClick={handleSearch}
            className="bg-[#bca472] text-white rounded-full px-8 py-2 hover:bg-[#a78a5f] transition"
          >
            Buscar
          </Button>

          <Button
            onClick={handleGoToAdmin}
            className="bg-[#7d9c87] text-white rounded-full px-8 py-2 hover:bg-[#6a8c78] transition"
          >
            Agregar Nueva Entrada
          </Button>
        </div>

        <div className="space-y-6">
          {results.map((entry, i) => {
            const isSelected = selectedEntries.find(
              (e) => e.title === entry.title
            );
            return (
              <Card
                key={i}
                className={`bg-white border ${
                  isSelected ? "border-[#7d9c87]" : "border-[#e2dfda]"
                } rounded-3xl shadow-lg transition hover:shadow-xl cursor-pointer`}
                onClick={() => toggleEntry(entry)}
              >
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold mb-2 text-[#3b2f2f]">
                    {entry.title}
                  </h3>
                  <p className="text-lg leading-relaxed text-[#4b4440]">
                    {entry.description}
                  </p>
                  <div className="mt-4 text-sm text-[#7d9c87] font-semibold space-y-1">
                    <div>Planeta: {entry.planet}</div>
                    <div>Casa: {entry.house}</div>
                    <div>Signo: {entry.sign}</div>
                    <div>Aspecto: {entry.aspect}</div>
                    <div>Planeta Relacionado: {entry.related_planet}</div>
                    <div>Etiquetas: {entry.tags.join(", ")}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {results.length === 0 && (
            <p className="text-center text-gray-400 italic">
              No se encontraron resultados.
            </p>
          )}
        </div>

        {selectedEntries.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Informe (arrastrá o quitá)
            </h2>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => {
                const { active, over } = event;
                if (!active || !over || active.id === over.id) return;

                const oldIndex = selectedEntries.findIndex(
                  (e) => e.id === active.id
                );
                const newIndex = selectedEntries.findIndex(
                  (e) => e.id === over.id
                );

                if (oldIndex !== -1 && newIndex !== -1) {
                  setSelectedEntries((entries) =>
                    arrayMove(entries, oldIndex, newIndex)
                  );
                }
              }}
            >
              <SortableContext
                items={selectedEntries.map((entry) => entry.id)}
                strategy={verticalListSortingStrategy}
              >
                {selectedEntries.map((entry) => (
                  <SortableItem
                    key={entry.id}
                    entry={entry}
                    onRemove={() =>
                      setSelectedEntries((prev) =>
                        prev.filter((e) => e.id !== entry.id)
                      )
                    }
                  />
                ))}
              </SortableContext>
            </DndContext>

            <Button
              onClick={handleExportPDF}
              className="bg-[#3b2f2f] text-white rounded-full px-8 py-2 hover:bg-[#2e2424] transition"
            >
              Exportar a PDF
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
