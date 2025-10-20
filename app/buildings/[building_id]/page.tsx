// "use client";

// import { useSearchParams } from 'next/navigation';
import { fetchBuildingInfo } from "@/app/lib/data";
import Link from "next/link";
import CreateModal from "@/app/ui/CreateModal";
import CreateButton from "@/app/ui/create_button";

import { createSystem } from "@/app/lib/actions";

export default async function Building({ params }: { params: { building_id: string } }) {
    const { building_id } = await params;

    const bldgInfo = await fetchBuildingInfo(building_id);

    return (
        <ul className="list bg-base-100 rounded-box shadow-md">
            {(!bldgInfo || bldgInfo.length === 0) ? (
                <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">No Systems Found</li>
            ) : (
                <>
                    <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
                        Systems In <span className="font-bold opacity-100 white">{bldgInfo[0].building_name}</span>
                    </li>
                    {bldgInfo.map((bldg: any, index: number) => (
                        <li key={bldg.system_id} className="list-row">
                            <div className="text-4xl font-thin opacity-30 tabular-nums">{index + 1}</div>
                            <div>
                                <img className="size-10 rounded-box invert" src="https://www.pngall.com/wp-content/uploads/1/Electronic-PNG-Picture.png" />
                            </div>
                            <div className="list-col-grow">
                                <Link href={`/buildings/${building_id}/systems/${bldg.system_id}`}>
                                    <div>{bldg.system_name}</div>
                                </Link>
                                <div className="text-xs uppercase font-semibold opacity-60">
                                    {bldg.system_manufacturer + " " + bldg.system_model}
                                </div>
                            </div>
                        </li>
                    ))}
                </>
            )}

            <CreateButton btnName="Create System" />



            <CreateModal
                title="Create New System"
                info = {{building_id}}
                db_func={createSystem}
                fields={[
                    {
                        label: "System Name",
                        type: "text",
                        placeholder: "Enter system name",
                        defaultValue: "",
                        id: "system_name"
                    },
                    {
                        label: "System Type",
                        type: "text",
                        placeholder: "Enter system type",
                        defaultValue: "",
                        id: "system_type"
                    },
                    {
                        label: "System Model",
                        type: "text",
                        placeholder: "Enter system Model",
                        defaultValue: "",
                        id: "system_model"
                    },
                    {
                        label: "System Manufacturer",
                        type: "text",
                        placeholder: "Enter system Manufacturer",
                        defaultValue: "",
                        id: "system_manufacturer"
                    },
                ]}
            />
        </ul>
    );
}