"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    // Validación de campos obligatorios
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
      const response = await fetch("/api/save-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      alert(data.message || "Guardado exitosamente");

      // Limpiar el formulario
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
    }
  };

  return (
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
        <div key={name} className="mb-4">
          <Label className="block mb-1 capitalize">
            {label}
            {(name === "title" || name === "tags") && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </Label>
          <Input
            name={name}
            value={(form as any)[name]}
            onChange={handleChange}
            placeholder={name === "tags" ? "Ej: sol, casa 4, hogar" : ""}
          />
        </div>
      ))}

      <div className="mb-4">
        <Label className="block mb-1">
          Descripción <span className="text-red-500">*</span>
        </Label>
        <Textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Escribe aquí el texto astrológico..."
        />
      </div>

      <Button
        onClick={handleSubmit}
        className="bg-black text-white px-6 py-2 rounded-full w-full hover:bg-gray-800 transition duration-300"
      >
        Guardar entrada
      </Button>
    </div>
  );
}
