// "use client";

// import { useSearchParams } from 'next/navigation';
import { fetchBuildingInfo } from "@/lib/data";
import Link from "next/link";
import CreateModalWrapper from "@/app/ui/CreateModalWrapper";
import CreateButton from "@/app/ui/create_button";
import IconImage from '@/app/ui/IconImage';

import { createSystem } from "@/lib/actions";

export default async function Building({ params }: { params: Promise<{ building_id: string | string[] }> }) {
    const { building_id: rawId } = await params;
    const building_id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!building_id) {
        throw new Error("Missing building_id");
    }

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
                                <IconImage className="size-10 rounded-box" src="https://www.pngall.com/wp-content/uploads/1/Electronic-PNG-Picture.png" alt="system" />
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

            <CreateModalWrapper
                title="Create New System"
                type="system"
                btnName="Create System"
                info={{ building_id }}
                fields={[
                    { label: 'System Name', type: 'text', placeholder: 'Enter system name', defaultValue: '', id: 'system_name' },
                    { label: 'System Type', type: 'text', placeholder: 'Enter system type', defaultValue: '', id: 'system_type' },
                    { label: 'System Model', type: 'text', placeholder: 'Enter system Model', defaultValue: '', id: 'system_model' },
                    { label: 'System Manufacturer', type: 'text', placeholder: 'Enter system Manufacturer', defaultValue: '', id: 'system_manufacturer' },
                ]}
            />
        </ul>
    );
}