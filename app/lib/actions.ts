'use server';


import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function showTables() {
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    return tables;
}
export async function createTable(table_name: string) {
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

export async function createBuilding(data: { building_name: string }) {
    if (typeof data.building_name !== 'string') {
        console.log(typeof data.building_name)
        throw new Error('building_name must be a string');
    }
    const result = await sql`
        INSERT INTO buildings (building_name)
        VALUES (${data.building_name})`;
    return result;
}


export async function createSystem(data: { system_name: string, system_type: string, system_model: string, system_manufacturer: string, building_id: number }) {

    console.log(data)
    if (typeof data.system_name !== 'string') {
        console.log(typeof data.system_name)
        throw new Error('system_name must be a string');
    }
    const result = await sql`
         INSERT INTO systems (system_type, system_model, system_manufacturer, system_name, building_id)
         VALUES (${data.system_type}, ${data.system_model}, ${data.system_manufacturer},${data.system_name},${data.building_id});`
    return result;
}

export async function createNode(data: { node_location: string, node_number: number, system_id: number, building_id: number }) {

    console.log(data)
    if (typeof data.node_location !== 'string') {
        console.log(typeof data.node_location)
        throw new Error('system_name must be a string');
    }
    const result = await sql`
            INSERT INTO nodes (node_location, node_number, system_id)
            VALUES (${data.node_location}, ${data.node_number}, ${data.system_id});`
    return result;
}


export async function createLoop(data: { loop_number: number, loop_info: string, node_number: number, system_id: number, building_id: number }) {

    console.log(data)
    if (typeof data.loop_info !== 'string') {
        console.log(typeof data.loop_info)
        throw new Error('system_name must be a string');
    }
    const result = await sql`
            INSERT INTO loops (loop_number, loop_info, node_number, system_id)
            VALUES (${data.loop_number},${data.loop_info}, ${data.node_number}, ${data.system_id});`
    return result;
}


export async function createZone(data: { zone_number: number, zone_prefix: string, zone_tag_1: string, zone_tag_2: string, loop_number: number, loop_info: string, node_number: number, system_id: number, building_id: number }) {

    console.log("data")
    console.log(data)

    const result = await sql`
            INSERT INTO zones (zone_number,loop_number,node_number,system_id,zone_prefix, zone_tag_1, zone_tag_2)
            VALUES (${data.zone_number},
            ${data.loop_number},
            ${data.node_number},
            ${data.system_id},
            ${data.zone_prefix},
            ${data.zone_tag_1}, 
            ${data.zone_tag_2});`
    return result;
}


export async function updateSystemLevelInfo(
    fieldName: string,
    newValue: string,
    info: { system_id: number }
) {
    const system_id = info.system_id;
    if (typeof newValue !== 'string') {
        console.log(typeof newValue)
        throw new Error(`${fieldName} must be a string`);
    }
    const result = await sql`
        UPDATE systems
        SET ${sql(fieldName)} = ${newValue}
        WHERE system_id = ${system_id}`;
    return result;

}


export async function updateNodeLevelInfo(
    fieldName: string,
    newValue: string,
    info: { system_id: number, node_number: number }
) {
    const system_id = info.system_id;
    const node_number = info.node_number;
    if (typeof fieldName !== 'string') {
        console.log(typeof fieldName)
        throw new Error(`${fieldName} must be a string`);
    }
    const result = await sql`
        UPDATE nodes
        SET ${sql(fieldName)} = ${newValue}
        WHERE system_id = ${system_id} AND node_number = ${node_number}`;
    return result;

}


export async function updateLoopLevelInfo(
    fieldName: string,
    newValue: string,
    info: { system_id: number, node_number: number, loop_number: number }
) {
    const system_id = info.system_id;
    const node_number = info.node_number;
    if (typeof fieldName !== 'string') {
        console.log(typeof fieldName)
        throw new Error(`${fieldName} must be a string`);
    }
    const result = await sql`
        UPDATE loops
        SET ${sql(fieldName)} = ${newValue}
        WHERE system_id = ${system_id} AND node_number = ${node_number} AND loop_number = ${info.loop_number}`;
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
