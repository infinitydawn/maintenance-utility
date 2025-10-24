import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { building_id } = body;

    if (!building_id) {
      return new Response(JSON.stringify({ error: 'Missing building_id' }), { status: 400 });
    }

    // Fetch building info
    const buildingRows = await sql`
      SELECT building_id, building_name
      FROM buildings
      WHERE building_id = ${building_id}
    `;
    const building = buildingRows[0] || null;

    // Fetch systems for this building
    const systems = await sql`
      SELECT system_id, system_name, system_type, system_model, system_manufacturer
      FROM systems
      WHERE building_id = ${building_id}
      ORDER BY system_id
    `;

    // Fetch nodes for systems in this building
    const nodes = await sql`
      SELECT n.node_number, n.node_location, n.system_id
      FROM nodes n
      INNER JOIN systems s ON n.system_id = s.system_id
      WHERE s.building_id = ${building_id}
      ORDER BY n.system_id, n.node_number
    `;

    // Fetch loops for systems in this building
    const loops = await sql`
      SELECT l.loop_number, l.loop_info, l.node_number, l.system_id
      FROM loops l
      INNER JOIN systems s ON l.system_id = s.system_id
      WHERE s.building_id = ${building_id}
      ORDER BY l.system_id, l.node_number, l.loop_number
    `;

    // Fetch all zones with full context (system, node, loop info)
    const zones = await sql`
      SELECT 
        b.building_id,
        b.building_name,
        s.system_id,
        s.system_name,
        s.system_type,
        s.system_model,
        s.system_manufacturer,
        n.node_number,
        n.node_location,
        l.loop_number,
        l.loop_info,
        z.zone_prefix,
        z.zone_number,
        z.zone_tag_1,
        z.zone_tag_2,
        z.date_tested
      FROM zones z
      INNER JOIN loops l ON z.loop_number = l.loop_number AND z.node_number = l.node_number AND z.system_id = l.system_id
      INNER JOIN nodes n ON l.node_number = n.node_number AND l.system_id = n.system_id
      INNER JOIN systems s ON n.system_id = s.system_id
      INNER JOIN buildings b ON s.building_id = b.building_id
      WHERE b.building_id = ${building_id}
      ORDER BY s.system_id, n.node_number, l.loop_number, z.zone_prefix, z.zone_number
    `;

    return new Response(JSON.stringify({
      ok: true,
      building,
      systems,
      nodes,
      loops,
      zones
    }), { status: 200 });

  } catch (err) {
    console.error('API /reports/building error', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
