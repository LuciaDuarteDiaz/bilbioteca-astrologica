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

    const lower = query.toLowerCase().trim();

    // Separar por comas
    const terms = lower
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    console.log("Buscando con términos:", terms);

    // Construimos condiciones manualmente
    const conditions: string[] = [];
    const values: string[] = [];

    for (const term of terms) {
      const likeTerm = `%${term}%`;
      values.push(likeTerm, likeTerm, likeTerm, likeTerm, likeTerm, term);

      conditions.push(`
        LOWER(title) LIKE $${values.length - 5} OR
        LOWER(description) LIKE $${values.length - 4} OR
        planet ILIKE $${values.length - 3} OR
        sign ILIKE $${values.length - 2} OR
        related_planet ILIKE $${values.length - 1} OR
        EXISTS (
          SELECT 1 FROM unnest(tags) AS tag WHERE LOWER(tag) = $${values.length}
        )
      `);
    }

    const whereSQL = conditions.map((c) => `(${c})`).join(" OR ");
    const querySQL = `SELECT * FROM astro_entries WHERE ${whereSQL}`;

    const { rows } = await sql.query(querySQL, values);

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
