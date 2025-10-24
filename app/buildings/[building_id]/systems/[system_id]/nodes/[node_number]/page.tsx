// "use client";

// import { useSearchParams } from 'next/navigation';
import { fetchLoopsInfo } from "@/lib/data";
import { fetchNodeInfoSingle } from "@/lib/data";
import Link from "next/link";
import CreateModalWrapper from "@/app/ui/CreateModalWrapper";
import CreateButton from "@/app/ui/create_button";
import IconImage from '@/app/ui/IconImage';
import { createLoop, updateNodeLevelInfo } from "@/lib/actions";
import Input from "@/app/ui/input";
//  function fakeFunction(){
//         return null;
//     }

type NodePageParams = { building_id: string; system_id: string; node_number: string };

export default async function Node({ params }: { params: Promise<NodePageParams> }) {
    const { building_id, system_id, node_number } = await params;

    const loopsInfo = await fetchLoopsInfo(system_id, node_number);
    let nodeInfo = undefined;

    if (loopsInfo === undefined || loopsInfo.length === 0) {
        nodeInfo = await fetchNodeInfoSingle(system_id, node_number);
    } else {
        nodeInfo = loopsInfo;
    }
   



    return (
        <div>
            <div className="flex justify-center">
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Node Location</legend>
                    <Input className="textarea h-24 w-80" label={""} type="text" db_func={updateNodeLevelInfo} info={{ system_id, node_number }} id="node_location" defaultValue={nodeInfo[0].node_location} as="textarea" />                   
                    {/* <textarea className="textarea h-24 w-80" defaultValue={nodeInfo[0].node_location} placeholder="Node location information"></textarea> */}
                </fieldset>
            </div>
            <div className="divider"></div>
            <h4 className="p-4 pb-2 text-xs opacity-60 tracking-wide">Loops in node #{nodeInfo[0].node_number} / system {nodeInfo[0].system_id} / {nodeInfo[0].building_name}  </h4>
            {(loopsInfo === undefined || loopsInfo.length === 0)
                ?
                (<p className="p-4 pb-2 text-xs opacity-60 tracking-wide" >No loops in this node</p>)
                : (
                    <ul className="list bg-base-100 rounded-box shadow-md">
                        {loopsInfo.map((loop: any) => {
                            return (

                                <li key={loop.loop_number} className="list-row">

                                    <div className="text-4xl font-thin opacity-30 tabular-nums">{loop.loop_number}</div>
                                    <div><IconImage className="size-10 rounded-box" src="https://cdn-icons-png.flaticon.com/512/649/649899.png" alt="loop" /></div>
                                    <div className="list-col-grow">
                                        <Link href={`/buildings/${building_id}/systems/${loop.system_id}/nodes/${loop.node_number}/loops/${loop.loop_number}`}>
                                            <div>{`Loop ${loop.loop_number}`}</div>
                                        </Link>
                                        <div className="text-xs uppercase font-semibold opacity-60">{loop.system_manufacturer + " " + loop.system_model}</div>
                                        <div className="text-xs font-semibold opacity-90">Loop Info: {loop.loop_info}</div>
                                    </div>
                                    {/* <button className="btn btn-square btn-ghost">
                                <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
                            </button> */}

                                </li>
                            );
                        })}
                    </ul>

                )}


            <CreateModalWrapper
                title={`Create A New Loop In ${nodeInfo[0].system_name}`}
                type="loop"
                btnName="Create Loop"
                info={{ building_id, system_id: nodeInfo[0].system_id, node_number: nodeInfo[0].node_number }}
                fields={[
                    { label: 'Loop Number', type: 'number', placeholder: 'Loop Number', defaultValue: '', id: 'loop_number' },
                    { label: 'Loop Info', type: 'text', placeholder: 'Loop Info', defaultValue: '', id: 'loop_info' },
                ]}
            />
        </div>



    )
}