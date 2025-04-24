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
import { searchEntries } from "@/lib/actions";

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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="sortable-item"
    >
      <div>
        <strong>{entry.title}</strong>
        <p>{entry.description}</p>
      </div>
    </div>
  );
}

export default function AstroBiblioteca() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<AstroEntry[]>([]);
  const [selectedEntries, setSelectedEntries] = useState<AstroEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const router = useRouter();

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setSearchError("");
      const data = await searchEntries({ query: input });
      setResults(data.results || []);
      setSelectedEntries([]);
    } catch (error) {
      setSearchError("Error al buscar entradas. Intenta nuevamente.");
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
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
    <div className="astro-biblioteca-container">
      <div className="left-column">
        <h1>Biblioteca Astrológica</h1>

        <div className="search-container">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ej. sol, acuario, casa 4..."
            className="search-input"
          />

          <div className="button-group">
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? <div className="spinner"></div> : "Buscar"}
            </Button>
            <Button onClick={handleGoToAdmin}>Agregar Nueva Entrada</Button>
          </div>
          {searchError && <p className="error-message">{searchError}</p>}
        </div>
      </div>

      <div className="right-column">
        <div className="results-section">
          {isLoading ? (
            <div className="loading-overlay">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="results-grid">
              {results.map((entry, i) => {
                const isSelected = selectedEntries.find(
                  (e) => e.title === entry.title
                );
                return (
                  <Card
                    key={i}
                    className={isSelected ? "selected" : ""}
                    onClick={() => toggleEntry(entry)}
                  >
                    <CardContent>
                      <h3>{entry.title}</h3>
                      <p>{entry.description}</p>
                      <div className="entry-details">
                        <div>Etiquetas: {entry.tags.join(", ")}</div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {results.length === 0 && !isLoading && (
                <p className="no-results">No se encontraron resultados.</p>
              )}
            </div>
          )}

          {selectedEntries.length > 0 && (
            <div className="report-section">
              <h2>Informe (arrastrá y reordená los elementos):</h2>

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

              <div className="export-container">
                <Button onClick={handleExportPDF} className="export-button">
                  Exportar a PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
