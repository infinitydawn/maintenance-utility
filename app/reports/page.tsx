"use client";

import { useState, useEffect } from 'react';

export default function ReportsPage() {
  const [buildings, setBuildings] = useState<any[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    async function fetchBuildings() {
      try {
        const res = await fetch('/api/buildings');
        const data = await res.json();
        setBuildings(data || []);
      } catch (err) {
        console.error('Failed to fetch buildings', err);
      }
    }
    fetchBuildings();
  }, []);

  async function generateReport() {
    if (!selectedBuilding) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/reports/building', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ building_id: Number(selectedBuilding) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate report');
      setReportData(data);
    } catch (err) {
      console.error('Failed to generate report', err);
      alert('Failed to generate report: ' + String(err));
    } finally {
      setLoading(false);
    }
  }

  function downloadCSV() {
    if (!reportData) return;

    const rows = [];
    // Header
    rows.push(['Building', 'System ID', 'System Name', 'System Type', 'Node Number', 'Node Location', 'Loop Number', 'Loop Info', 'Zone Prefix', 'Zone Number', 'Zone Tag 1', 'Zone Tag 2']);

    // Data rows
    reportData.zones.forEach((zone: any) => {
      rows.push([
        zone.building_name || '',
        zone.system_id || '',
        zone.system_name || '',
        zone.system_type || '',
        zone.node_number || '',
        zone.node_location || '',
        zone.loop_number || '',
        zone.loop_info || '',
        zone.zone_prefix || '',
        zone.zone_number || '',
        zone.zone_tag_1 || '',
        zone.zone_tag_2 || ''
      ]);
    });

    // Convert to CSV string
    const csvContent = rows.map(row => 
      row.map(cell => {
        // Escape quotes and wrap in quotes if contains comma or quote
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return '"' + cellStr.replace(/"/g, '""') + '"';
        }
        return cellStr;
      }).join(',')
    ).join('\n');

    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `building_${selectedBuilding}_report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Building Reports</h1>

        <div className="card bg-base-100 shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Generate Report</h2>
          
          <div className="flex gap-4 items-end mb-4">
            <div className="flex-1">
              <label className="label">
                <span className="label-text">Select Building</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedBuilding}
                onChange={(e) => setSelectedBuilding(e.target.value)}
              >
                <option value="">Choose a building...</option>
                {buildings.map((b) => (
                  <option key={b.building_id} value={b.building_id}>
                    {b.building_name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={generateReport}
              disabled={!selectedBuilding || loading}
              className="btn btn-primary"
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>

        {reportData && (
          <div className="card bg-base-100 shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Report Results</h2>
              <button onClick={downloadCSV} className="btn btn-success">
                Download CSV
              </button>
            </div>

            <div className="stats stats-vertical lg:stats-horizontal shadow mb-6">
              <div className="stat">
                <div className="stat-title">Building</div>
                <div className="stat-value text-2xl">{reportData.building?.building_name}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Systems</div>
                <div className="stat-value">{reportData.systems?.length || 0}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Nodes</div>
                <div className="stat-value">{reportData.nodes?.length || 0}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Loops</div>
                <div className="stat-value">{reportData.loops?.length || 0}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Zones</div>
                <div className="stat-value">{reportData.zones?.length || 0}</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>System</th>
                    <th>Node</th>
                    <th>Loop</th>
                    <th>Zone</th>
                    <th>Tag 1</th>
                    <th>Tag 2</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.zones?.map((zone: any, idx: number) => (
                    <tr key={idx}>
                      <td>
                        <div className="font-bold">{zone.system_name}</div>
                        <div className="text-sm opacity-50">{zone.system_type}</div>
                      </td>
                      <td>
                        <div>Node {zone.node_number}</div>
                        <div className="text-sm opacity-50">{zone.node_location}</div>
                      </td>
                      <td>
                        <div>Loop {zone.loop_number}</div>
                        <div className="text-sm opacity-50">{zone.loop_info}</div>
                      </td>
                      <td className="font-mono">
                        {zone.zone_prefix}{zone.zone_number}
                      </td>
                      <td>{zone.zone_tag_1}</td>
                      <td>{zone.zone_tag_2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
