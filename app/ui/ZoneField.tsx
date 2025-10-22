'use client';
import React, { useState } from 'react';
import Checkmark from './checkmark';
import Crossmark from './crossmark';

export default function ZoneField({
  value,
  field,
  info,
  className,
}: {
  value: boolean;
  field: 'passed' | 'failed';
  info: { system_id: number; node_number: number; loop_number: number; zone_number: number; zone_prefix?: string };
  className?: string;
}) {
  const [isUpdating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    setUpdating(true);
    setFailed(false);
    try {
      const res = await fetch('/api/zones/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value: val, info }),
      });
      if (!res.ok) throw new Error('Update failed');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error(err);
      setFailed(true);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="relative inline-block">
      <select
        defaultValue={value ? 'yes' : 'no'}
        onChange={handleChange}
        className={`select select-sm ${className ?? ''}`}
        disabled={isUpdating}
      >
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
      {success ? <Checkmark /> : null}
      {failed ? <Crossmark /> : null}
      {isUpdating ? <span className="absolute right-0 w-4 h-4 loading loading-spinner"></span> : null}
    </div>
  );
}
