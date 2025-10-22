'use client';

import { useState } from 'react';
import InspectionMode from './InspectionMode';
import { useMode } from './ModeContext';

export default function ZonesModeToggle({ zones, system_id, node_number, loop_number }: { zones: any[]; system_id: string; node_number: string; loop_number: string }) {
  const { mode } = useMode();
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  if (mode !== 'inspect') return null;

  function toggle(key: string) {
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="w-full mt-3 space-y-2">
      {zones.map((zone) => {
        const key = `inspect_${zone.zone_prefix}_${zone.zone_number}`;
        const open = !!openMap[key];
        const displayPrefix = zone.zone_prefix === '_' ? '' : zone.zone_prefix;

        return (
          <div key={key} className="bg-base-100 rounded">
            <button type="button" onClick={() => toggle(key)} className="w-full flex items-center justify-between p-3">
              <div className="flex items-center gap-4">
                <div className="font-bold">{displayPrefix}{zone.zone_number}</div>
                <div className="text-sm opacity-70">{zone.zone_tag_1 || ''}</div>
                <div className="text-sm opacity-70">{zone.zone_tag_2 || ''}</div>
              </div>
              <div className={`transform transition-transform ${open ? 'rotate-90' : ''}`}>
                ▶
              </div>
            </button>

            {open ? (
              <div className="p-3 border-t">
                <InspectionMode info={{ system_id: Number(system_id), node_number: Number(node_number), loop_number: Number(loop_number), zone_number: zone.zone_number, zone_prefix: zone.zone_prefix }} />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
