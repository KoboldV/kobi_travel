import { neon } from "@neondatabase/serverless";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { Config } from "@netlify/functions";

const sql = neon(process.env.DATABASE_URL!);
const authUrl = process.env.NEON_AUTH_BASE_URL!;
const authOrigin = new URL(authUrl).origin;
const jwks = createRemoteJWKSet(new URL(`${authUrl}/.well-known/jwks.json`));

async function getUserId(req: Request): Promise<string | null> {
  const header = req.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) return null;
  try {
    const { payload } = await jwtVerify(header.slice(7), jwks, {
      algorithms: ["EdDSA"],
      issuer: authOrigin,
      audience: authOrigin,
    });
    return payload.sub ?? null;
  } catch (err) {
    return null;
  }
}

export default async (req: Request) => {
  const userId = await getUserId(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const id = new URL(req.url).searchParams.get("id");

  if (req.method === "GET") {
    if (id) {
      const rows = await sql`
        select * from cities where id = ${id} and user_id = ${userId}`;
      if (rows.length === 0) return new Response("Not found", { status: 404 });
      return Response.json(rows[0]);
    }
    const rows = await sql`
      select * from cities where user_id = ${userId} order by date`;
    return Response.json(rows);
  }

  if (req.method === "POST") {
    const c = await req.json();
    if (!c.id || !c.cityName) {
      return new Response("Bad request", { status: 400 });
    }
    await sql`
      insert into cities (id, "cityName", country, emoji, date, notes, position, user_id)
      values (${c.id}, ${c.cityName}, ${c.country}, ${c.emoji}, ${c.date},
              ${c.notes}, ${JSON.stringify(c.position)}::jsonb, ${userId})`;
    return Response.json(c, { status: 201 });
  }

  if (req.method === "DELETE") {
    if (!id) return new Response("Bad request", { status: 400 });
    await sql`delete from cities where id = ${id} and user_id = ${userId}`;
    return new Response(null, { status: 204 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = { path: "/api/cities" };
