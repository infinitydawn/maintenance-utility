'use client';

import { useEffect, useState } from 'react';

export default function InspectionList({ info, refreshTrigger }: { info: { system_id: number; node_number: number; loop_number: number; zone_number: number; zone_prefix?: string }; refreshTrigger?: number }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function load(limit?: number) {
    setLoading(true);
    try {
      const body = { ...info } as any;
      if (typeof limit === 'number') body.limit = limit;
      const res = await fetch('/api/inspections/fetch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      let data: any;
      try {
        data = await res.json();
      } catch (parseErr) {
        const text = await res.text();
        throw new Error(text || 'Invalid JSON response from server');
      }
      if (!res.ok) throw new Error(data.error || 'Failed');
      setItems(data.inspections || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(1); }, []);
  // reload when refreshTrigger changes (e.g. after creating a new inspection)
  useEffect(() => { if (typeof refreshTrigger === 'number') load(1); }, [refreshTrigger]);

  if (loading) return <div>Loading…</div>;
  if (!items.length) return <div className="text-sm opacity-60">No inspections yet</div>;

  const last = items[0];

  return (
    <div className="space-y-2">
      {!expanded ? (
        <>
          <div className="text-xs opacity-70">Last inspection</div>
          <div className="p-2 bg-base-200 rounded">
            <div className="flex items-center justify-between text-sm">
              <div>{last.passed ? 'Passed' : 'Failed'}</div>
              <div className="opacity-60 text-xs">{new Date(last.tested_at).toLocaleString()}</div>
            </div>
            {last.comments ? <div className="mt-1 text-sm">{last.comments}</div> : null}
          </div>
        </>
      ) : null}

      <div>
        <button className="btn btn-ghost btn-sm" onClick={async () => {
          if (expanded) {
            // Collapse: hide full history and reload only the latest inspection
            setExpanded(false);
            await load(1);
            return;
          }
          // Expand: load full history
          await load();
          setExpanded(true);
        }}>{expanded ? 'Hide all' : 'Show all inspections'}</button>
      </div>

      {expanded ? (
        <div className="space-y-2">
          {items.map((it: any) => (
            <div key={it.id} className="p-2 bg-base-100 rounded">
              <div className="flex items-center justify-between text-sm">
                <div>{it.passed ? 'Passed' : 'Failed'}</div>
                <div className="opacity-60 text-xs">{new Date(it.tested_at).toLocaleString()}</div>
              </div>
              {it.comments ? <div className="mt-1 text-sm">{it.comments}</div> : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
