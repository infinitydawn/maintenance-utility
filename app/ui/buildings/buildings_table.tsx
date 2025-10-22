import { fetchBuildings } from '@/lib/data';
import Link from 'next/link';
import { Building } from '@/lib/types';

export default async function BuildingsTable() {
    const buildings = (await fetchBuildings()) as unknown as Building[];
    console.log('Buildings:', buildings);

    if (!buildings || buildings.length === 0) {
        return (
            <ul className="list bg-base-100 rounded-box shadow-md">
                <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">No buildings found</li>
            </ul>
        );
    }

    return (
        <ul className="list bg-base-100 rounded-box shadow-md">
            <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Buildings matching the search parameters</li>

            {buildings.map((building) => {
                return (
                    <li key={building.building_id} className="list-row">
                        <div>
                            <img
                                className="size-10 rounded-box invert"
                                src="https://cdn-icons-png.flaticon.com/512/24/24914.png"
                                alt="building"
                            />
                        </div>
                        <div>
                            <Link href={`/buildings/${building.building_id}`}>
                                <div>{building.building_name}</div>
                            </Link>
                            <div className="text-xs uppercase font-semibold opacity-60">Building ID: {building.building_id}</div>
                        </div>
                        <button className="btn btn-square btn-ghost" aria-label={`Edit ${building.building_name}`}>
                            <svg className="size-[1.3em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"></path></g></svg>
                        </button>
                    </li>
                );
            })}

        </ul>
    );

}
