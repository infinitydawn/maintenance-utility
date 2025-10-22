'use client';

import { useState } from 'react';

export default function DeleteButton({ endpoint, payload, label = 'Delete', className = '' }: { endpoint: string; payload: any; label?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Delete request failed: ' + res.statusText);
      setOpen(false);
    } catch (err) {
      console.error('Delete failed', err);
      alert('Delete failed: ' + String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
  <button className={`btn btn-error btn-sm ${className}`} type="button" onClick={() => setOpen(true)}> {label} </button>

      {open ? (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm delete</h3>
            <p className="py-4">Are you sure you want to delete this item? This action cannot be undone.</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setOpen(false)} disabled={loading}>Cancel</button>
              <button className="btn btn-error" onClick={handleConfirm} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
