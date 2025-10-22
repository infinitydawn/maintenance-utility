import { fetchLoopsInfo, fetchZonesInfo } from "@/lib/data";
import CreateButton from "@/app/ui/create_button";
import CreateModalWrapper from "@/app/ui/CreateModalWrapper";
import { createZone, updateZoneLevelInfo, updateLoopLevelInfo } from "@/lib/actions";
import Input from "@/app/ui/input";
import ZoneField from "@/app/ui/ZoneField";


type LoopPageParams = { building_id: string; system_id: string; node_number: string; loop_number: string };

export default async function Loops({ params }: { params: Promise<LoopPageParams> }) {
    const { building_id, system_id, node_number, loop_number } = await params;

    const loopInfo = await fetchLoopsInfo(system_id, node_number);

    const zonesInfo = await fetchZonesInfo(system_id, node_number, loop_number);
    return (
        <div>
            <div className="flex justify-center">
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Loop Information</legend>
                    <Input className="textarea h-24 w-80" label={""} type="text" db_func={updateLoopLevelInfo} info={{ system_id, node_number, loop_number }} id="loop_info" defaultValue={loopInfo[0].loop_info} as="textarea" />
                </fieldset>
            </div>
            <div className="divider"></div>

            <ul className="list bg-base-100 rounded-box shadow-md">
                <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
                    Zones in loop #{loop_number} /  node #{node_number} / system {system_id} / {(zonesInfo && zonesInfo.length > 0 ? zonesInfo[0].building_name : loopInfo[0].building_name)}
                </li>
            </ul>

            {zonesInfo && zonesInfo.length > 0 ? (
                <div className="overflow-x-auto">
                    <div>
                        <table className="table table-pin-rows table-zebra">
                            <thead className="sticky top-0 bg-base-100 z-30" style={{ position: "sticky", top: 0 }}>
                                <tr>
                                    <th>Zone</th>
                                    <th>Tag 1</th>
                                    <th>Tag 2</th>
                                    <th>Tag 3</th>
                                    <th>Passed</th>
                                    <th>Failed</th>
                                    <th>Initial</th>
                                    <th>Date Tested</th>
                                </tr>
                            </thead>
                            <tbody>
                                {zonesInfo.map((zone: any) => (
                                            <tr key={zone.zone_number + zone.zone_prefix}>
                                                <th>{zone.zone_prefix === "_" ? "" : zone.zone_prefix}{zone.zone_number}</th>
                                                <td>
                                                    <Input
                                                        label={"Tag 1"}
                                                        type="text"
                                                        db_func={updateZoneLevelInfo}
                                                        fieldName="zone_tag_1"
                                                        info={{ system_id: Number(system_id), node_number: Number(node_number), loop_number: Number(loop_number), zone_number: zone.zone_number, zone_prefix: zone.zone_prefix }}
                                                        id={`zone_${zone.zone_prefix}_${zone.zone_number}_tag_1`}
                                                        defaultValue={zone.zone_tag_1}
                                                    />
                                                </td>
                                                <td>
                                                    <Input
                                                        label={"Tag 2"}
                                                        type="text"
                                                        db_func={updateZoneLevelInfo}
                                                        fieldName="zone_tag_2"
                                                        info={{ system_id: Number(system_id), node_number: Number(node_number), loop_number: Number(loop_number), zone_number: zone.zone_number, zone_prefix: zone.zone_prefix }}
                                                        id={`zone_${zone.zone_prefix}_${zone.zone_number}_tag_2`}
                                                        defaultValue={zone.zone_tag_2}
                                                    />
                                                </td>
                                                <td>
                                                    <Input
                                                        label={"Tag 3"}
                                                        type="text"
                                                        db_func={updateZoneLevelInfo}
                                                        fieldName="zone_tag_3"
                                                        info={{ system_id: Number(system_id), node_number: Number(node_number), loop_number: Number(loop_number), zone_number: zone.zone_number, zone_prefix: zone.zone_prefix }}
                                                        id={`zone_${zone.zone_prefix}_${zone.zone_number}_tag_3`}
                                                        defaultValue={zone.zone_tag_3}
                                                    />
                                                </td>
                                                <td>
                                                    <ZoneField value={!!zone.passed} field="passed" info={{ system_id: Number(system_id), node_number: Number(node_number), loop_number: Number(loop_number), zone_number: zone.zone_number, zone_prefix: zone.zone_prefix }} />
                                                </td>
                                                <td>
                                                    <ZoneField value={!!zone.failed} field="failed" info={{ system_id: Number(system_id), node_number: Number(node_number), loop_number: Number(loop_number), zone_number: zone.zone_number, zone_prefix: zone.zone_prefix }} />
                                                </td>
                                                <td>
                                                    <Input
                                                        label={"Initials"}
                                                        type="text"
                                                        db_func={updateZoneLevelInfo}
                                                        fieldName="initials"
                                                        info={{ system_id: Number(system_id), node_number: Number(node_number), loop_number: Number(loop_number), zone_number: zone.zone_number, zone_prefix: zone.zone_prefix }}
                                                        id={`zone_${zone.zone_prefix}_${zone.zone_number}_initials`}
                                                        defaultValue={zone.initials}
                                                    />
                                                </td>
                                                <td>
                                                    {zone.date_tested ? new Date(zone.date_tested).toLocaleString() : ''}
                                                </td>
                                            </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : null}

            <CreateModalWrapper
                title={`Create A New Zone`}
                type="zone"
                btnName="Create Zone"
                info={{ building_id, system_id: loopInfo[0].system_id, node_number: loopInfo[0].node_number, loop_number }}
                fields={[
                    { label: 'Zone Number', type: 'number', placeholder: 'Zone Number', defaultValue: '', id: 'zone_number' },
                    { label: 'Zone Prefix', type: 'text', placeholder: 'Zone Prefix', defaultValue: '', id: 'zone_prefix' },
                    { label: 'Zone Tag 1', type: 'text', placeholder: 'Zone Tag 1', defaultValue: '', id: 'zone_tag_1' },
                    { label: 'Zone Tag 2', type: 'text', placeholder: 'Zone Tag 2', defaultValue: '', id: 'zone_tag_2' },
                ]}
            />
        </div>
    )
}