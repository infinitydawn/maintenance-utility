
import BuildingsTable from "@/app/ui/buildings/buildings_table";
import Search from "@/app/ui/search";
import CreateModalWrapper from "@/app/ui/CreateModalWrapper";

import { createBuilding } from "@/lib/actions"; 

export default async function Buildings(props: any) {
    // `searchParams` may be a Promise in some Next.js versions; await it before accessing properties
    const sp = props?.searchParams ? await props.searchParams : undefined;
    const query = sp?.query ?? undefined;
    return (
        <main>
            <CreateModalWrapper
                title="Create New Building"
                type="building"
                btnName="New Building"
                info={{}}
                fields={[
                    { label: 'Building Name', type: 'text', placeholder: 'Enter building name', defaultValue: '', id: 'building_name' },
                    { label: 'Building Address', type: 'text', placeholder: 'Enter building address', defaultValue: '', id: 'building_address' },
                    { label: 'Building Description', type: 'text', placeholder: 'Enter building description', defaultValue: '', id: 'building_description' },
                ]}
            />
            <Search placeholder="Search buildings..." />
            {/* Pass the query from URL search params into the server-side BuildingsTable */}
            {/* BuildingsTable is a server component and will fetch filtered data */}
            <BuildingsTable query={query} />
            {/* <button className="btn btn-primary fixed bottom-3 right-3">+</button> */}

        </main>
    )
}