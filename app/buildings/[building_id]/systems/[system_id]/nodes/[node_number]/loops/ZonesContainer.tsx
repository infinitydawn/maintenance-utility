'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CreateModalWrapper from '@/app/ui/CreateModalWrapper';
import ZonesModeToggle from '@/app/ui/ZonesModeToggle';
import EditView from '@/app/ui/EditView';
import { useMode } from '@/app/ui/ModeContext';
import ZoneEditRow from '@/app/ui/ZoneEditRow';

export default function ZonesContainer({ building_id, system_id, node_number, loop_number }: { building_id: string; system_id: string; node_number: string; loop_number: string }) {
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get('query') ?? undefined;

  async function loadZones(q?: string) {
    setLoading(true);
    try {
  const res = await fetch('/api/zones/fetch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system_id, node_number, loop_number, query: q }) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch zones');
  setZones(data.rows || []);
    } catch (err) {
      console.error('Failed to load zones', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadZones(query); }, [query]);
  const { mode } = useMode();

  return (
    <div>
      <div className="mb-4">
        <CreateModalWrapper
          title={`Create A New Zone`}
          type="zone"
          btnName="Create Zone"
          info={{ building_id, system_id, node_number, loop_number }}
          fields={[
            { label: 'Zone Number', type: 'number', placeholder: 'Zone Number', defaultValue: '', id: 'zone_number' },
            { label: 'Zone Prefix', type: 'text', placeholder: 'Zone Prefix', defaultValue: '', id: 'zone_prefix' },
            { label: 'Zone Tag 1', type: 'text', placeholder: 'Zone Tag 1', defaultValue: '', id: 'zone_tag_1' },
            { label: 'Zone Tag 2', type: 'text', placeholder: 'Zone Tag 2', defaultValue: '', id: 'zone_tag_2' },
          ]}
          onCreated={async (data: any) => {
            // After create, reload zones to show the new row
            await loadZones();
          }}
        />
      </div>

      {mode === 'inspect' ? (
        <ZonesModeToggle zones={zones} system_id={system_id} node_number={node_number} loop_number={loop_number} />
      ) : (
        <EditView>
          <div className="space-y-2">
            {zones.map((z) => (
              <ZoneEditRow key={`edit_${z.zone_prefix}_${z.zone_number}`} zone={z} system_id={system_id} node_number={node_number} loop_number={loop_number} onUpdated={loadZones} />
            ))}
          </div>
        </EditView>
      )}
    </div>
  );
}
