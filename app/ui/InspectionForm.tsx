'use client';

import { useState } from 'react';

export default function InspectionForm({ info, onCreated }: { info: { system_id: number; node_number: number; loop_number: number; zone_number: number; zone_prefix?: string }; onCreated?: (row: any) => void }) {
  // selected: '' | 'yes' | 'no' — default empty to force explicit choice
  const [selected, setSelected] = useState<string>('');
  const [comments, setComments] = useState('');
  const [isSaving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // require explicit selection
      if (selected !== 'yes' && selected !== 'no') {
        alert('Please select Passed or Failed before saving');
        setSaving(false);
        return;
      }
      const passed = selected === 'yes';
      const res = await fetch('/api/inspections/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...info, passed, comments }),
      });
      let data: any;
      try {
        data = await res.json();
      } catch (parseErr) {
        const text = await res.text();
        throw new Error(text || 'Invalid JSON response from server');
      }
      if (!res.ok) throw new Error(data?.error || 'Failed');
      setComments('');
      setSelected('');
      onCreated?.(data.inspection);
    } catch (err) {
      console.error(err);
      alert('Failed to save inspection');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="label">Result</label>
        <select className="select select-sm" value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="">Select result</option>
          <option value="yes">Passed</option>
          <option value="no">Failed</option>
        </select>
      </div>

      <div>
        <label className="label">Comments</label>
        <textarea value={comments} onChange={(e) => setComments(e.target.value)} className="textarea textarea-sm w-full" />
      </div>

      <div>
        <button className="btn btn-primary btn-sm" type="submit" disabled={isSaving || (selected !== 'yes' && selected !== 'no')}>{isSaving ? 'Saving...' : 'Save Inspection'}</button>
      </div>
    </form>
  );
}
