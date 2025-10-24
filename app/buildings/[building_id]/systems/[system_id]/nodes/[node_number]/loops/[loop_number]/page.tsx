import { fetchLoopsInfo, fetchZonesInfo } from "@/lib/data";
import CreateButton from "@/app/ui/create_button";
import CreateModalWrapper from "@/app/ui/CreateModalWrapper";
import ImportZonesButton from '@/app/ui/ImportZonesButton';
import { createZone, updateZoneLevelInfo, updateLoopLevelInfo } from "@/lib/actions";
import Input from "@/app/ui/input";
import ZoneField from "@/app/ui/ZoneField";
import ZonesModeToggle from '@/app/ui/ZonesModeToggle';
import ZoneEditRow from '@/app/ui/ZoneEditRow';
import EditView from '@/app/ui/EditView';
import ZonesContainer from '../ZonesContainer';
import Search from '@/app/ui/search';


type LoopPageParams = { building_id: string; system_id: string; node_number: string; loop_number: string };

export default async function Loops({ params }: { params: Promise<LoopPageParams> }) {
    const { building_id, system_id, node_number, loop_number } = await params;

    const loopInfo = await fetchLoopsInfo(system_id, node_number);
        // zones will be loaded client-side to allow immediate refresh after create
        const zonesInfo = [] as any[];

    return (
        <div>
            <div className="flex justify-center">
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Loop Information</legend>
                    <Input
                        className="textarea h-24 w-80"
                        label={""}
                        type="text"
                        db_func={updateLoopLevelInfo}
                        info={{ system_id, node_number, loop_number }}
                        id="loop_info"
                        defaultValue={loopInfo[0].loop_info}
                        as="textarea"
                    />
                </fieldset>
            </div>

            <div className="divider" />

            <ul className="list bg-base-100 rounded-box shadow-md">
                <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
                    Zones in loop #{loop_number} / node #{node_number} / system {system_id} / {(zonesInfo && zonesInfo.length > 0 ? zonesInfo[0].building_name : loopInfo[0].building_name)}
                </li>
            </ul>

                {/* Zones are loaded client-side via ZonesContainer */}
                <div className="mb-4">
                    <Search placeholder="Search zones..." />
                        <ZonesContainer building_id={building_id} system_id={system_id} node_number={node_number} loop_number={loop_number} />
                </div>

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
                <div className="mt-4">
                    <ImportZonesButton info={{ building_id, system_id: loopInfo[0].system_id, node_number: loopInfo[0].node_number, loop_number }} />
                </div>
        </div>
    )
}