'use client';

import React from 'react';
import { useMode } from './ModeContext';

export default function ModeToggle() {
  const { mode, setMode } = useMode();
  return (
    <div className="ml-auto">
      <button className={`btn btn-sm ${mode === 'edit' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setMode('edit')}>Edit</button>
      <button className={`btn btn-sm ml-2 ${mode === 'inspect' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setMode('inspect')}>Inspect</button>
    </div>
  );
}
