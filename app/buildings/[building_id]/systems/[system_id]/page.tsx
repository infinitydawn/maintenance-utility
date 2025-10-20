import { fetchNodesInfo } from "@/app/lib/data";
import { fetchBuildingInfo } from "@/app/lib/data";
import Link from "next/link";
import Image from 'next/image';
import CreateModal from "@/app/ui/CreateModal";
import CreateButton from "@/app/ui/create_button";
import Input from "@/app/ui/input";

import { createNode } from "@/app/lib/actions";
import { updateSystemLevelInfo } from "@/app/lib/actions";

export default async function System({ params }: { params: Promise<{ building_id: string, system_id: string }> }) {
    const { building_id, system_id } = await params;
    const nodesInfo = await fetchNodesInfo(system_id);
    let systemInfo = undefined;
    if (nodesInfo === undefined || nodesInfo.length === 0) {
        systemInfo = await fetchBuildingInfo(building_id);
    } else {
        systemInfo = nodesInfo;
    }
    console.log(systemInfo)

    return (

        <div>
            <div className="flex justify-center">
                <fieldset className="fieldset  p-4 w-90">
                    <legend className="fieldset-legend">System Information</legend>
                    <Input label={"Manufacturer"} type="text" db_func={updateSystemLevelInfo} info={{ system_id }} id="system_manufacturer" defaultValue={systemInfo[0].system_manufacturer} />

                    {/* <label className="label">Manufacturer</label>
                    <input type="text" className="input" placeholder="Manufacturer" defaultValue={systemInfo[0].system_manufacturer} /> */}

                    {/* <label className="label">Model</label>
                    <input type="text" className="input" placeholder="Model" defaultValue={systemInfo[0].system_model} /> */}
                    <Input label={"Model"} type="text" db_func={updateSystemLevelInfo} info={{ system_id }} id="system_model" defaultValue={systemInfo[0].system_model} />

                    {/* <label className="label">Type</label>
                    <input type="text" className="input" placeholder="Type" defaultValue={systemInfo[0].system_type} /> */}
                    <Input label={"Type"} type="text" db_func={updateSystemLevelInfo} info={{ system_id }} id="system_type" defaultValue={systemInfo[0].system_type} />

                    {/* <label className="label">System Name</label>
                    <input type="text" className="input" placeholder="System Name" defaultValue={systemInfo[0].system_name} /> */}
                    <Input label={"System Name"} type="text" db_func={updateSystemLevelInfo} info={{ system_id }} id="system_name" defaultValue={systemInfo[0].system_name} />
                </fieldset>
            </div>

            {(!nodesInfo || nodesInfo.length === 0) ? (
                <ul className="list bg-base-100 rounded-box shadow-md">
                    <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">No Nodes Found</li>
                </ul>
            ) : (
                <>


                    <ul className="list bg-base-100 rounded-box shadow-md">
                        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Nodes in this system</li>
                        {nodesInfo.map((node: any) => (
                            <li key={node.node_number} className="list-row">
                                <div className="text-4xl font-thin opacity-30 tabular-nums">{node.node_number}</div>
                                <div>
                                    <Image alt="Node Icon" width={40} height={40} className="size-10 rounded-box invert" src="/icons/node_icon.png" />
                                </div>
                                <div className="list-col-grow">
                                    <Link href={`/buildings/${building_id}/systems/${node.system_id}/nodes/${node.node_number}`}>
                                        <div>{`Node ${node.node_number} - ${node.node_location}`}</div>
                                    </Link>
                                    <div className="text-xs uppercase font-semibold opacity-60">{node.system_manufacturer + " " + node.system_model}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <CreateButton btnName="Create Node" />

            <CreateModal
                title={`Create A New Node In ${systemInfo[0].system_name}`}
                info={{ building_id, system_id: systemInfo[0].system_id }}
                db_func={createNode}
                fields={[
                    {
                        label: "Node Location",
                        type: "text",
                        placeholder: "Enter Node Location",
                        defaultValue: "",
                        id: "node_location"
                    },
                    {
                        label: "Node Number",
                        type: "number",
                        placeholder: "Enter Node Number",
                        defaultValue: "",
                        id: "node_number"
                    }
                ]}
            />


        </div>
    );
}
