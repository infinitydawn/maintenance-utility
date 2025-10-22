"use server";
import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });


export async function fetchBuildings() {
  try {
    console.log('Fetching buildings data...');
    const data = await sql`SELECT * FROM buildings`;
    console.log('Fetching finished.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to get buildings data.');
  }
}

export async function fetchBuildingInfo(building_id: string) {
  try {
    console.log('Fetching single building data...');
    const data = await sql`
    SELECT * FROM buildings AS b
    INNER JOIN systems AS s ON b.building_id = s.building_id
    WHERE b.building_id = ${building_id}`;
    console.log('Fetching finished.');
    console.log('Data:', data);
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to get building data.');
  }
}


export async function fetchNodesInfo(system_id: string) {
  try {
    console.log('Fetching single building data...');
    const data = await sql`
    SELECT * FROM systems AS s
    INNER JOIN nodes AS n ON s.system_id = n.system_id
    WHERE s.system_id = ${system_id}`;
    console.log('Fetching finished.');

    console.log('Data:', data);

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to get building data.');
  }
}


export async function fetchLoopsInfo(system_id: string, node_number: string) {
  try {
    console.log('Fetching single building data...');
    const data = await sql`
    SELECT * FROM nodes AS n
    INNER JOIN loops AS l ON l.node_number = n.node_number AND l.system_id = n.system_id
    INNER JOIN systems AS s ON s.system_id = n.system_id
    INNER JOIN buildings AS b ON b.building_id = s.building_id
    WHERE l.system_id = ${system_id} AND l.node_number = ${node_number}`;
    console.log('Fetching finished.');

    console.log('Data:', data);

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to get building data.');
  }
}


export async function fetchZonesInfo(system_id: string, node_number: string, loop_number: string) {
  try {
    console.log('Fetching single building data...');
    const data = await sql`
    SELECT * FROM nodes AS n
    INNER JOIN loops AS l ON l.node_number = n.node_number AND l.system_id = n.system_id
    INNER JOIN systems AS s ON s.system_id = n.system_id
    INNER JOIN buildings AS b ON b.building_id = s.building_id
    INNER JOIN zones AS z ON z.loop_number = l.loop_number AND z.node_number = n.node_number AND z.system_id = n.system_id
    WHERE l.system_id = ${system_id} AND l.node_number = ${node_number} AND l.loop_number = ${loop_number}
    ORDER BY z.zone_prefix,z.zone_number`;
    console.log('Fetching finished.');

    console.log('Data:', data);

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to get building data.');
  }
}

export async function fetchNodeInfoSingle(system_id: string, node_number: string) {
  try {
    console.log('Fetching single node data...');
    const data = await sql`
    SELECT * FROM nodes AS n
    INNER JOIN systems AS s ON s.system_id = n.system_id
    WHERE n.system_id = ${system_id} AND n.node_number = ${node_number}`;
    console.log('Fetching finished.');

    console.log('Data:', data);

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to get node data.');
  }
}
