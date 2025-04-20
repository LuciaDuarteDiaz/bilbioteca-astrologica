// app/api/save-entry/route.ts

import { sql } from "@vercel/postgres";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      planet,
      house,
      sign,
      aspect,
      related_planet,
      tags,
    } = body;

    console.log("Received data:", body);

    await sql`
      INSERT INTO astro_entries (title, description, planet, house, sign, aspect, related_planet, tags)
      VALUES (${title}, ${description}, ${planet}, ${house}, ${sign}, ${aspect}, ${related_planet}, ${tags})
    `;

    return new Response(
      JSON.stringify({ message: "Entrada guardada correctamente" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("DB Error:", error);
    return new Response(
      JSON.stringify({ message: "Error al guardar en la base de datos" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
