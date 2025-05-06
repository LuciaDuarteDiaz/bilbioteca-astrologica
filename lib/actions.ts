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
export async function updateEntry(data: any) {
  const {
    id,
    title,
    description,
    planet,
    house,
    sign,
    aspect,
    related_planet,
    tags,
  } = data;

  if (!id) {
    return { message: "ID requerido para actualizar la entrada" };
  }

  try {
    await sql`
      UPDATE astro_entries
      SET
        title = ${title},
        description = ${description},
        planet = ${planet},
        house = ${house},
        sign = ${sign},
        aspect = ${aspect},
        related_planet = ${related_planet},
        tags = ${tags}
      WHERE id = ${id}
    `;

    return { message: "Entrada actualizada correctamente" };
  } catch (error) {
    console.error("DB Update Error:", error);
    return {
      message: "Error al actualizar la base de datos: " + error.detail,
    };
  }
}
export async function getAllEntries() {
  try {
    const { rows } = await sql`SELECT * FROM astro_entries ORDER BY id DESC`;
    console.log("Fetched entries:", rows.length);
    return rows;
  } catch (error) {
    console.error("DB Fetch Error:", error);
    return [];
  }
}
export async function deleteEntry(id: number) {
  try {
    await sql`DELETE FROM astro_entries WHERE id = ${id}`;
    return { message: "Entrada eliminada correctamente" };
  } catch (error) {
    console.error("DB Delete Error:", error);
    return { message: "Error al eliminar la entrada" + error.detail };
  }
}
