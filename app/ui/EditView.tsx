"use client";

import { ReactNode } from 'react';
import { useMode } from './ModeContext';

export default function EditView({ children }: { children: ReactNode }) {
  const { mode } = useMode();
  if (mode === 'inspect') return null;
  return <div id="edit-view">{children}</div>;
}
