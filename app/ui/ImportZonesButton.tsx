"use client";
import React, { useState } from 'react';
import MassImportModal from './MassImportModal';

export default function ImportZonesButton({ info, onImported }: { info: any; onImported?: (r: any) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="inline-block ml-2">
      <button className="btn btn-secondary" onClick={() => setOpen(true)}>Import Zones</button>
      <MassImportModal open={open} onCloseAction={() => setOpen(false)} info={info} onImported={onImported} />
    </div>
  );
}
