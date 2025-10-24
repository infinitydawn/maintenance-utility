'use client';

import React from 'react';
import { useMode } from './ModeContext';

export default function ModeToggle() {
  const { mode, setMode } = useMode();
  return (
    <div className="ml-auto flex flex-col md:flex-row items-center gap-2">
      <button className={`btn btn-sm w-full md:w-auto ${mode === 'edit' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setMode('edit')}>Edit</button>
      <button className={`btn btn-sm w-full md:w-auto ${mode === 'inspect' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setMode('inspect')}>Inspect</button>
    </div>
  );
}
