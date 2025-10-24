"use client";
import React, { useEffect, useState, useRef } from 'react';

interface MassImportModalProps {
  open: boolean;
  onCloseAction: () => void;
  info: { building_id: string; system_id: string; node_number: string; loop_number: string } | any;
  onImported?: (result: any) => void;
}

export default function MassImportModal({ open, onCloseAction, info, onImported }: MassImportModalProps) {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);
  const [errors, setErrors] = useState<string | null>(null);

  const modalBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      setText('');
      setFileName(null);
      setPreview([]);
      setErrors(null);
    } else {
      // Focus the dialog container to avoid auto-focusing inputs and triggering mobile zoom
      setTimeout(() => modalBoxRef.current?.focus(), 0);
    }
  }, [open]);

  const handleFile = (f?: File) => {
    if (!f) return;
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      setText(result);
      buildPreview(result);
    };
    reader.readAsText(f);
  };

  const buildPreview = (csvText: string) => {
    const rows = csvText
      .split(/\r?\n/)
      .map((r) => r.trim())
      .filter(Boolean)
      .map((r) => r.split(',').map((c) => c.trim()));
    if (rows.length === 0) {
      setPreview([]);
      return;
    }
    // If header detected, use it
    const header = rows[0].map((h) => h.toLowerCase());
    let dataRows = rows;
    let hasHeader = false;
    if (header.includes('zone') || header.includes('zone_number') || header.includes('zone_prefix')) {
      hasHeader = true;
      dataRows = rows.slice(1);
    }
    const parsed = dataRows.map((cols) => ({
      zone_number: cols[0] ?? '',
      zone_prefix: cols[1] ?? '',
      zone_tag_1: cols[2] ?? '',
      zone_tag_2: cols[3] ?? '',
      raw: cols,
    }));
    setPreview(parsed.slice(0, 50));
  };

  const handleParseClick = () => {
    try {
      setErrors(null);
      buildPreview(text);
    } catch (err: any) {
      setErrors(String(err));
    }
  };

  const handleImport = async () => {
    setLoading(true);
    setErrors(null);
    try {
      const rows = text
        .split(/\r?\n/)
        .map((r) => r.trim())
        .filter(Boolean)
        .map((r) => r.split(',').map((c) => c.trim()));

      // detect header
      const header = rows[0] ? rows[0].map((h:any) => String(h).toLowerCase()) : [];
      let dataRows = rows;
      if (header.includes('zone') || header.includes('zone_number') || header.includes('zone_prefix')) {
        dataRows = rows.slice(1);
      }

      const payload = dataRows.map((cols) => ({
        zone_number: Number(cols[0]) || 0,
        zone_prefix: cols[1] ?? '',
        zone_tag_1: cols[2] ?? '',
        zone_tag_2: cols[3] ?? '',
      }));

      const res = await fetch('/api/zones/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ info, rows: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Import failed');
  onImported?.(data);
  onCloseAction();
    } catch (err: any) {
      setErrors(String(err));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal modal-open">
  <div ref={modalBoxRef} tabIndex={-1} className="modal-box w-11/12 max-w-3xl">
        <h3 className="font-bold text-lg">Mass Import Zones</h3>
        <p className="text-sm opacity-70">CSV format: zone_number,zone_prefix,zone_tag_1,zone_tag_2 (header optional)</p>

        <div className="mt-4">
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => handleFile(e.target.files ? e.target.files[0] : undefined)}
          />
          <div className="mt-2">or paste CSV:</div>
          <textarea
            className="textarea w-full h-44 mt-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="1,,Tag A,Tag B\n2,A,Tag C,Tag D"
          />
          <div className="flex gap-2 mt-2">
            <button className="btn" onClick={handleParseClick} type="button">Preview</button>
            <button className="btn btn-primary" onClick={handleImport} disabled={loading}>{loading ? 'Importing...' : 'Import'}</button>
          </div>
        </div>

        {errors && <div className="mt-4 text-red-600">{errors}</div>}

        <div className="mt-4">
          <div className="text-xs opacity-70">Preview (first 50 rows):</div>
          <div className="overflow-auto max-h-48 mt-2 border rounded p-2 bg-base-100">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>zone_number</th>
                  <th>zone_prefix</th>
                  <th>zone_tag_1</th>
                  <th>zone_tag_2</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((r, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{r.zone_number}</td>
                    <td>{r.zone_prefix}</td>
                    <td>{r.zone_tag_1}</td>
                    <td>{r.zone_tag_2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onCloseAction} disabled={loading}>Close</button>
        </div>
      </div>
    </div>
  );
}
