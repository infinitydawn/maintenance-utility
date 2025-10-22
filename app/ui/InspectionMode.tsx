'use client';

import { useState } from 'react';
import InspectionForm from './InspectionForm';
import InspectionList from './InspectionList';
import { useMode } from './ModeContext';

export default function InspectionMode({ info }: { info: { system_id: number; node_number: number; loop_number: number; zone_number: number; zone_prefix?: string } }) {
  const { mode } = useMode();
  // simple counter to trigger list refresh when a new inspection is created
  const [refreshCounter, setRefreshCounter] = useState(0);

  function handleCreated(row: any) {
    // bump counter to trigger InspectionList reload
    setRefreshCounter((c) => c + 1);
  }

  return (
    <div className="p-3 border rounded">
      {mode === 'inspect' ? (
        <div className="space-y-3">
          <InspectionForm info={info} onCreated={handleCreated} />
          <InspectionList info={info} refreshTrigger={refreshCounter} />
        </div>
      ) : (
        <div className="text-sm opacity-60">Edit mode: use the page inputs to change tags, numbers and prefixes.</div>
      )}
    </div>
  );
}
