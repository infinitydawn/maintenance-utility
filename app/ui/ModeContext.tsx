'use client';

import React, { createContext, useContext, useState } from 'react';

type Mode = 'edit' | 'inspect';

const ModeContext = createContext<{ mode: Mode; setMode: (m: Mode) => void } | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('edit');
  return <ModeContext.Provider value={{ mode, setMode }}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within ModeProvider');
  return ctx;
}
