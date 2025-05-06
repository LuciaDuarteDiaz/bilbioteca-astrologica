"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  saveEntry,
  updateEntry,
  getAllEntries,
  deleteEntry,
} from "@/lib/actions";
import { useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";

export default function AstroAdminForm() {
  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    planet: "",
    house: "",
    sign: "",
    aspect: "",
    related_planet: "",
    tags: "",
  });

  const [entries, setEntries] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchEntries();
  }, [submitting]);
  const fetchEntries = async () => {
    const res = await fetch("/api/search");
    const data = await res.json();
    setEntries(data);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.tags.trim()) {
      setErrorMessage(
        "Por favor completa los campos obligatorios: título, descripción y etiquetas."
      );
      return;
    }

    const payload = {
      ...form,
      house: form.house ? Number(form.house) : null,
      tags: form.tags.split(",").map((tag) => tag.trim().toLowerCase()),
    };

    try {
      setSubmitting(true);
      let data;
      if (editing && form.id) {
        data = await updateEntry(payload);
      } else {
        data = await saveEntry(payload);
      }

      alert(data.message || "Guardado exitosamente");
      await fetchEntries(); // <- Esperamos a que termine antes de limpiar
      setForm({
        id: null,
        title: "",
        description: "",
        planet: "",
        house: "",
        sign: "",
        aspect: "",
        related_planet: "",
        tags: "",
      });
      setErrorMessage("");
      setEditing(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Hubo un error al guardar la entrada.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (entry) => {
    setForm({
      ...entry,
      tags: entry.tags.join(", "),
    });
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta entrada?")) return;

    try {
      const res = await deleteEntry(id);
      alert(res.message);
      await fetchEntries(); // <- Aseguramos que se actualice la lista
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Error al eliminar la entrada.");
    }
  };
  const handleCancelEdit = () => {
    setForm({
      id: null,
      title: "",
      description: "",
      planet: "",
      house: "",
      sign: "",
      aspect: "",
      related_planet: "",
      tags: "",
    });
    setErrorMessage("");
    setEditing(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="astro-biblioteca-container flex flex-col md:flex-row gap-8">
      <div className="left-column w-full md:w-1/2">
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2 mb-6 text-gray-700 hover:text-black cursor-pointer transition-colors duration-200"
        >
          <FaHome size={20} />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">
          {editing
            ? "Editar entrada astrológica"
            : "Agregar nueva entrada astrológica"}
        </h2>

        {errorMessage && (
          <div className="mb-4 text-red-600 font-medium">{errorMessage}</div>
        )}

        {[
          { name: "title", label: "Título" },
          { name: "planet", label: "Planeta" },
          { name: "house", label: "Casa" },
          { name: "sign", label: "Signo" },
          { name: "aspect", label: "Aspecto" },
          { name: "related_planet", label: "Planeta Relacionado" },
          { name: "tags", label: "Etiquetas" },
        ].map(({ name, label }) => (
          <div key={name} className="mb-6">
            <Label className="block mb-2 capitalize text-gray-700">
              {label}
              {(name === "title" || name === "tags") && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </Label>
            <Input
              name={name}
              value={form[name] || ""}
              onChange={handleChange}
              placeholder={name === "tags" ? "Ej: sol, casa 4, hogar" : ""}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        ))}

        <div className="mb-6">
          <Label className="block mb-2 text-gray-700">
            Descripción <span className="text-red-500">*</span>
          </Label>
          <Textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Escribe aquí el texto astrológico..."
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {editing ? (
          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-black text-white px-6 py-3 rounded-full w-1/2 hover:bg-gray-800 transition duration-300 flex justify-center items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="spinner"></div>
                  Guardando...
                </>
              ) : (
                "Actualizar entrada"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditing(false);
                setForm({
                  id: null,
                  title: "",
                  description: "",
                  planet: "",
                  house: "",
                  sign: "",
                  aspect: "",
                  related_planet: "",
                  tags: "",
                });
                setErrorMessage("");
              }}
              className="px-6 py-3 rounded-full w-1/2"
            >
              Cancelar edición
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-black text-white px-6 py-3 rounded-full w-full hover:bg-gray-800 transition duration-300 flex justify-center items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="spinner"></div>
                Guardando...
              </>
            ) : (
              "Guardar entrada"
            )}
          </Button>
        )}
      </div>
      <div className="right-column w-full md:w-1/2">
        <h3 className="text-xl font-bold mb-4">Entradas existentes</h3>
        {entries.map((entry) => (
          <div key={entry.id}>
            <div className="font-bold text-lg">{entry.title}</div>
            <div className="text-sm text-gray-700 mb-2">
              {entry.description}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleEdit(entry)}>
                Editar
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(entry.id)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
