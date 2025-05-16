'use server';


import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function showTables() {
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    return tables;
}
export async function createTable(table_name : string) {
    table_name = "zones"
    const result = await sql`
    CREATE TABLE ${sql(table_name)} (
    zone_number INTEGER NOT NULL, 
    zone_prefix VARCHAR(5),
    zone_tag_1 VARCHAR(255),
    zone_tag_2 VARCHAR(255),
    system_id INTEGER NOT NULL,
    node_number INTEGER NOT NULL,
    loop_number INTEGER NOT NULL,
    PRIMARY KEY (zone_number, zone_prefix, loop_number, node_number, system_id),
    FOREIGN KEY (loop_number, node_number, system_id) REFERENCES loops(loop_number, node_number, system_id)
    )`;
    return result;
}






// table_name = "buildings"
//     const result = await sql`CREATE TABLE ${sql(table_name)} (building_id SERIAL PRIMARY KEY, building_name VARCHAR(255) NOT NULL)`;
//     return result;

// table_name = "systems"
//     const result = await sql`
//     CREATE TABLE ${sql(table_name)} (
//     system_id SERIAL PRIMARY KEY, 
//     system_type VARCHAR(255) NOT NULL, 
//     system_model VARCHAR(255) NOT NULL, 
//     system_manufacturer VARCHAR(255) NOT NULL, 
//     system_name VARCHAR(255) NOT NULL UNIQUE,
//     building_id INTEGER NOT NULL REFERENCES buildings(building_id)
//     )`;
//     return result;


//  table_name = "nodes"
//     const result = await sql`
//     CREATE TABLE ${sql(table_name)} (
//     node_number INTEGER PRIMARY KEY, 
//     node_location VARCHAR(255) NOT NULL,
//     system_id INTEGER NOT NULL REFERENCES systems(system_id)
//     )`;
//     return result;



// export async function createTable(table_name : string) {
//     table_name = "loops"
//     const result = await sql`
//     CREATE TABLE ${sql(table_name)} (
//     loop_id SERIAL PRIMARY KEY, 
//     loop_info VARCHAR(255),
//     node_id INTEGER NOT NULL REFERENCES nodes(node_id)
//     )`;
//     return result;
// }
