"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { saveEntry } from "@/lib/actions";
import TestCard from "./test";

export default function AstroAdminForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    planet: "",
    house: "",
    sign: "",
    aspect: "",
    related_planet: "",
    tags: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      const data = await saveEntry(payload);
      alert(data.message || "Guardado exitosamente");

      setForm({
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
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Hubo un error al guardar la entrada.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto py-10 px-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Agregar nueva entrada astrológica
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
              value={form[name]}
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
      </div>
    </>
  );
}
