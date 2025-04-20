// app/api/search-entry/route.ts

import { sql } from "@vercel/postgres";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ message: "Consulta inválida" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const lower = query.toLowerCase();
    const terms = lower.split(" ");

    console.log("Buscando con términos:", terms);

    const { rows } = await sql`
      SELECT * FROM astro_entries
      WHERE
        LOWER(title) LIKE ${`%${lower}%`} OR
        LOWER(description) LIKE ${`%${lower}%`} OR
        planet ILIKE ${`%${lower}%`} OR
        sign ILIKE ${`%${lower}%`} OR
        related_planet ILIKE ${`%${lower}%`} OR
        tags && ARRAY[${terms.map((term) => `'${term}'`).join(",")}]::text[]
    `;
    return new Response(JSON.stringify({ results: rows }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Search error:", error);
    return new Response(JSON.stringify({ message: "Error en la búsqueda" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
