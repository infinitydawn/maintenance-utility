'use server';
import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });


export async function fetchBuildings() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching buildings data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql`SELECT * FROM buildings`;
    console.log('Fetching finished.');
   
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to get buildings data.');
  }
}