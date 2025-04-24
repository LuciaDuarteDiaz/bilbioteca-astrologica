"use server";
import { sql } from "@vercel/postgres";

export async function saveEntry(data: any) {
  const {
    title,
    description,
    planet,
    house,
    sign,
    aspect,
    related_planet,
    tags,
  } = data;

  console.log("Received data:", data);
  try {
    await sql`
      INSERT INTO astro_entries (title, description, planet, house, sign, aspect, related_planet, tags)
      VALUES (${title}, ${description}, ${planet}, ${house}, ${sign}, ${aspect}, ${related_planet}, ${tags})
    `;

    return { message: "Entrada guardada correctamente" };
  } catch (error) {
    console.error("DB Error:", error);
    return {
      message: "Error al guardar en la base de datos " + error.detail,
    };
  }
}

export async function searchEntries(data: any) {
  try {
    const { query } = data;

    if (!query || typeof query !== "string") {
      return { message: "Consulta inválida" };
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

    return { results: rows };
  } catch (error) {
    console.error("Search error:", error);
    return { message: "Error en la búsqueda" + error.detail };
  }
}
