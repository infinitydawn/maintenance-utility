import { fetchBuildings } from '@/app/lib/data';

export default async function ProjectsTable() {
    let buildings = await fetchBuildings();
    console.log('Projects:', buildings);
    return (
        <div>
            <p>{buildings.toString()}</p>
        </div>
    );

}
