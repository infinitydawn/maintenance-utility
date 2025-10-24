"use server";
import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function showTables() {
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    return tables;
}
export async function createTable(table_name: string) {
    table_name = table_name || "zones";
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


export async function updateZoneLevelInfo(
    fieldName: string,
    newValue: string | boolean,
    info: { system_id: number, node_number: number, loop_number: number, zone_number: number, zone_prefix?: string }
) {
    const { system_id, node_number, loop_number, zone_number } = info;
    // DB uses empty string for no prefix in your sample data
    const zone_prefix = info.zone_prefix ?? '';
    if (typeof fieldName !== 'string') {
        console.log(typeof fieldName)
        throw new Error(`${fieldName} must be a string`);
    }
    // whitelist allowed columns to prevent SQL injection / invalid columns
    const allowedFields = new Set([
        'zone_tag_1',
        'zone_tag_2',
        'zone_tag_3',
        'initials',
        'passed',
        'failed',
        'date_tested',
    ]);

    if (!allowedFields.has(fieldName)) {
        throw new Error(`Field ${fieldName} is not allowed to be updated`);
    }

    try {
        // If updating pass/fail fields, coerce to boolean and set date_tested accordingly
        if (fieldName === 'passed' || fieldName === 'failed') {
            // Accept boolean or 'yes'/'no' strings from client
            const asStr = String(newValue);
            const newBool = (asStr === 'true' || asStr === 'yes' || asStr === '1');
            if (newBool) {
                const result = await sql`
                    UPDATE zones
                    SET ${sql(fieldName)} = ${newBool}, date_tested = CURRENT_TIMESTAMP
                    WHERE system_id = ${system_id} AND node_number = ${node_number} AND loop_number = ${loop_number} AND zone_number = ${zone_number} AND zone_prefix = ${zone_prefix}`;
                return result;
            } else {
                const result = await sql`
                    UPDATE zones
                    SET ${sql(fieldName)} = ${newBool}, date_tested = NULL
                    WHERE system_id = ${system_id} AND node_number = ${node_number} AND loop_number = ${loop_number} AND zone_number = ${zone_number} AND zone_prefix = ${zone_prefix}`;
                return result;
            }
        }

        const result = await sql`
            UPDATE zones
            SET ${sql(fieldName)} = ${newValue}
            WHERE system_id = ${system_id} AND node_number = ${node_number} AND loop_number = ${loop_number} AND zone_number = ${zone_number} AND zone_prefix = ${zone_prefix}`;
        return result;
    } catch (error) {
        console.error('Database Error (updateZoneLevelInfo):', error);
        // include original error message for easier debugging
        throw new Error('Failed to update zone data: ' + (error instanceof Error ? error.message : String(error)));
    }
}

// Rename (change primary key fields) for a zone. This performs an UPDATE to set
// a new zone_number and/or zone_prefix for a single zone identified by the
// current keys. Caller must ensure no collisions with existing zone keys.
export async function renameZone(
    info: { system_id: number; node_number: number; loop_number: number; zone_number: number; zone_prefix?: string },
    newZoneNumber: number,
    newZonePrefix?: string
) {
    const zone_prefix = info.zone_prefix ?? '';
    const new_prefix = newZonePrefix ?? '';
    try {
        const result = await sql`
            UPDATE zones
            SET zone_number = ${newZoneNumber}, zone_prefix = ${new_prefix}
            WHERE system_id = ${info.system_id} AND node_number = ${info.node_number} AND loop_number = ${info.loop_number} AND zone_number = ${info.zone_number} AND zone_prefix = ${zone_prefix}`;
        return result;
    } catch (err) {
        console.error('renameZone error', err);
        throw err;
    }
}

// Delete a zone by its composite key. Returns the deleted rows (should be 1 or 0).
export async function deleteZone(info: { system_id: number; node_number: number; loop_number: number; zone_number: number; zone_prefix?: string }) {
    const zone_prefix = info.zone_prefix ?? '';
    try {
        const result = await sql`
            DELETE FROM zones
            WHERE system_id = ${info.system_id} AND node_number = ${info.node_number} AND loop_number = ${info.loop_number} AND zone_number = ${info.zone_number} AND zone_prefix = ${zone_prefix}
            RETURNING *`;
        return result;
    } catch (err) {
        console.error('deleteZone error', err);
        throw err;
    }
}

// Inspections: store inspection history per zone
export async function createInspection(data: { system_id: number; node_number: number; loop_number: number; zone_number: number; zone_prefix?: string; passed: boolean; comments?: string }) {
    const zone_prefix = data.zone_prefix ?? '';
    try {
        const result = await sql`
            INSERT INTO inspections (system_id, node_number, loop_number, zone_number, zone_prefix, passed, comments, tested_at)
            VALUES (${data.system_id}, ${data.node_number}, ${data.loop_number}, ${data.zone_number}, ${zone_prefix}, ${data.passed}, ${data.comments || null}, CURRENT_TIMESTAMP)
            RETURNING *`;
        return result;
    } catch (err) {
        console.error('createInspection error', err);
        throw err;
    }
}

export async function fetchInspectionsForZone(info: { system_id: number; node_number: number; loop_number: number; zone_number: number; zone_prefix?: string }) {
    const zone_prefix = info.zone_prefix ?? '';
    try {
        const rows = await sql`
            SELECT id, passed, comments, tested_at
            FROM inspections
            WHERE system_id = ${info.system_id} AND node_number = ${info.node_number} AND loop_number = ${info.loop_number} AND zone_number = ${info.zone_number} AND zone_prefix = ${zone_prefix}
            ORDER BY tested_at DESC`;
        return rows;
    } catch (err) {
        // If the inspections table does not exist yet, return empty array instead of throwing
        const message = err instanceof Error ? err.message : String(err);
        if (message.includes('relation "inspections" does not exist') || message.includes('does not exist')) {
            return [] as any[];
        }
        console.error('fetchInspectionsForZone error', err);
        throw err;
    }
}

// User management for basic auth
export async function createUser(data: { username: string; password_hash: string; salt: string; is_admin?: boolean }) {
    try {
        const result = await sql`
            INSERT INTO users (username, password_hash, salt, is_admin)
            VALUES (${data.username}, ${data.password_hash}, ${data.salt}, ${data.is_admin || false})
            RETURNING user_id, username, is_admin`;
        return result[0];
    } catch (err) {
        console.error('createUser error', err);
        throw err;
    }
}

export async function getUserByUsername(username: string) {
    try {
        const rows = await sql`SELECT user_id, username, password_hash, salt, is_admin FROM users WHERE username = ${username} LIMIT 1`;
        return rows[0] ?? null;
    } catch (err) {
        console.error('getUserByUsername error', err);
        throw err;
    }
}
