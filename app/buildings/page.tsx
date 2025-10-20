
import BuildingsTable from "@/app/ui/buildings/buildings_table";
import Search from "@/app/ui/search";
import CreateModal from "@/app/ui/CreateModal";
import CreateButton from "@/app/ui/create_button";

import { createBuilding } from "@/app/lib/actions"; 

export default function Buildings() {
    return (
        <main>
            <CreateButton btnName="New Building" />
            <CreateModal
                title="Create New Building"
                db_func={createBuilding}
                info={{}}
                fields={[
                    {
                        label: "Building Name",
                        type: "text",
                        placeholder: "Enter building name",
                        defaultValue: "",
                        id: "building_name"
                    },
                    {
                        label: "Building Address",
                        type: "text",
                        placeholder: "Enter building address",
                        defaultValue: "",
                        id: "building_address"
                    },
                    {
                        label: "Building Description",
                        type: "text",
                        placeholder: "Enter building description",
                        defaultValue: "",
                        id: "building_description"
                    }
                ]}
            />
            <Search placeholder="Search buildings..." />
            <BuildingsTable />
            {/* <button className="btn btn-primary fixed bottom-3 right-3">+</button> */}

        </main>
    )
}