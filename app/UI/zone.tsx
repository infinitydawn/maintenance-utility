'use client';
import React, { useState } from 'react';

interface ZoneProps {
    zone: number;
    floor: string;
    location: string;
}

export default function about(props: ZoneProps) {

    const [zoneValue, setZoneValue] = useState(props.zone);
    const [floorValue, setFloorValue] = useState(props.floor);
    const [locationValue, setlocationValue] = useState(props.location);

    const handleZoneChange = (event: any) => {
        setZoneValue(event.target.value);
    };
    const handleFloorChange = (event: any) => {
        setFloorValue(event.target.value);
    };
    const handleLocationChange = (event: any) => {
        setlocationValue(event.target.value);
    };

    return (
        <div className="border-2 w-5/6 p-10">
            <input className="border-1" type="number" value={zoneValue} onChange={handleZoneChange} />
            <input className="border-1" value={floorValue} onChange={handleFloorChange} />
            <input className="border-1" value={locationValue} onChange={handleLocationChange} />
        </div>

    )
}