"use client";
import React from 'react';

async function apiGetTables() {
  const res = await fetch('/api/tables', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch tables');
  return res.json();
}

async function apiCreateTable(tableName?: string) {
  const res = await fetch('/api/tables', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tableName }),
  });
  if (!res.ok) throw new Error('Failed to create table');
  return res.json();
}

export function ShowTables() {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={async () => {
        try {
          const data = await apiGetTables();
          console.log('Tables:', data);
          alert(JSON.stringify(data.tables || data, null, 2));
        } catch (err) {
          console.error(err);
          alert('Failed to fetch tables. See console for details.');
        }
      }}
    >
      Show Tables
    </button>
  );
}

export function CreateTableButton() {
  return (
    <button
      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      onClick={async () => {
        try {
          const data = await apiCreateTable('zones');
          console.log('Create result:', data);
          alert('Create table request sent (check console)');
        } catch (err) {
          console.error(err);
          alert('Failed to create table. See console for details.');
        }
      }}
    >
      Create Table
    </button>
  );
}
