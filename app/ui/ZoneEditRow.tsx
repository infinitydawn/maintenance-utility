"use client";

import { useState } from 'react';
import InspectionMode from './InspectionMode';
import Input from './input';

export default function ZoneEditRow({ zone, system_id, node_number, loop_number, onUpdated }: { zone: any; system_id: string; node_number: string; loop_number: string; onUpdated?: () => void }) {
  const key = `edit_${zone.zone_prefix}_${zone.zone_number}`;
  const [open, setOpen] = useState(false);
  const [editingPrefix, setEditingPrefix] = useState(zone.zone_prefix === '_' ? '' : zone.zone_prefix);
  const [editingNumber, setEditingNumber] = useState(zone.zone_number);
  const [isSaving, setSaving] = useState(false);

  async function handleRename() {
    setSaving(true);
    try {
      const res = await fetch('/api/zones/rename', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system_id: Number(system_id), node_number: Number(node_number), loop_number: Number(loop_number), zone_number: zone.zone_number, zone_prefix: zone.zone_prefix, new_zone_number: Number(editingNumber), new_zone_prefix: editingPrefix }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to rename');
      // on success, notify parent to reload zones so the new key appears
      onUpdated?.();
    } catch (err) {
      console.error(err);
      alert('Failed to rename zone');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-base-100 rounded">
      <button className="w-full flex items-center justify-between p-3" onClick={() => setOpen((o) => !o)}>
        <div className="flex items-center gap-4">
          <div className="font-bold">{zone.zone_prefix === '_' ? '' : zone.zone_prefix}{zone.zone_number}</div>
          <div className="text-sm opacity-70">{zone.zone_tag_1 || ''}</div>
          <div className="text-sm opacity-70">{zone.zone_tag_2 || ''}</div>
        </div>
        <div className={`transform transition-transform ${open ? 'rotate-90' : ''}`}>▶</div>
      </button>

      {open ? (
        <div className="p-3 border-t space-y-3">
          <div className="flex gap-3 items-end">
            <div>
              <label className="label">Prefix</label>
              <input className="input input-sm" value={editingPrefix} onChange={(e) => setEditingPrefix(e.target.value)} />
            </div>
            <div>
              <label className="label">Zone Number</label>
              <input className="input input-sm" type="number" value={editingNumber} onChange={(e) => setEditingNumber(Number(e.target.value))} />
            </div>
            <div>
              <button className="btn btn-sm btn-primary" onClick={handleRename} disabled={isSaving}>{isSaving ? 'Saving...' : 'Rename'}</button>
            </div>
            <div className="flex-1" />
          </div>

            <div className="flex items-center gap-3">
              <button className="btn btn-sm btn-error" onClick={async () => {
                const ok = confirm('Are you sure you want to delete this zone? This cannot be undone.');
                if (!ok) return;
                try {
                  const res = await fetch('/api/zones/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system_id: Number(system_id), node_number: Number(node_number), loop_number: Number(loop_number), zone_number: zone.zone_number, zone_prefix: zone.zone_prefix }) });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || 'Delete failed');
                  onUpdated?.();
                } catch (err) {
                  console.error('Failed to delete', err);
                  alert('Failed to delete zone');
                }
              }}>Delete</button>
            </div>

          {/* Existing edit inputs — reuse the Input component for tag fields (no initials/passed/failed here) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input label={'Tag 1'} type="text" db_func={async (field: string, value: any) => {
              // call update endpoint
              await fetch('/api/zones/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field, value, info: { system_id: Number(system_id), node_number: Number(node_number), loop_number: Number(loop_number), zone_number: zone.zone_number, zone_prefix: zone.zone_prefix } }) });
              onUpdated?.();
            }} info={{}} id={`zone_edit_${zone.zone_prefix}_${zone.zone_number}_tag_1`} defaultValue={zone.zone_tag_1} />

            <Input label={'Tag 2'} type="text" db_func={async (field: string, value: any) => {
              await fetch('/api/zones/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field, value, info: { system_id: Number(system_id), node_number: Number(node_number), loop_number: Number(loop_number), zone_number: zone.zone_number, zone_prefix: zone.zone_prefix } }) });
              onUpdated?.();
            }} info={{}} id={`zone_edit_${zone.zone_prefix}_${zone.zone_number}_tag_2`} defaultValue={zone.zone_tag_2} />

            <Input label={'Tag 3'} type="text" db_func={async (field: string, value: any) => {
              await fetch('/api/zones/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field, value, info: { system_id: Number(system_id), node_number: Number(node_number), loop_number: Number(loop_number), zone_number: zone.zone_number, zone_prefix: zone.zone_prefix } }) });
              onUpdated?.();
            }} info={{}} id={`zone_edit_${zone.zone_prefix}_${zone.zone_number}_tag_3`} defaultValue={zone.zone_tag_3} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
