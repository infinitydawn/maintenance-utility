'use client';
import React, { useState } from 'react';
import CreateModal from './CreateModal';
import CreateButton from './create_button';

interface Field {
  label: string;
  type: string;
  placeholder?: string;
  defaultValue?: string;
  id: string;
}

export default function CreateModalWrapper({
  title,
  type,
  fields,
  info,
  btnName,
}: {
  title: string;
  type: 'building' | 'system' | 'node' | 'loop' | 'zone';
  fields: Field[];
  info?: Record<string, any>;
  btnName: string;
}) {
  const [open, setOpen] = useState(false);

  const handleCreate = async (payload: Record<string, any>) => {
    const res = await fetch('/api/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, payload }),
    });
    if (!res.ok) throw new Error('Create failed');
    return res.json();
  };

  return (
    <>
      <CreateButton btnName={btnName} onClick={() => setOpen(true)} />
      <CreateModal
        title={title}
        fields={fields}
        info={info}
        open={open}
        onClose={() => setOpen(false)}
        onCreate={handleCreate}
      />
    </>
  );
}
