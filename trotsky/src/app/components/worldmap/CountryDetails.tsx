"use client";
import React, { useCallback, useRef } from 'react';
import Draggable from 'react-draggable';
import WarTab from './WarTab';
import Circles from './Circles';


interface CountryDetailsProps {
  getCountryData: () => { start_date: string; end_date: string; party1_iso: string[]; party2_iso: string[]; death_toll: string; place: string; }[]
}

const CountryDetails: React.FC<CountryDetailsProps> = ({getCountryData }) => {
  const data = getCountryData();
  if (!data) return null;
  
  const nodeRef = useRef(null);

  const handleStart = useCallback((e: any) => {
    e.preventDefault();
  }, []);

  return (
    <div className="relative w-[1000px] h-[800px]">
      <Draggable
        nodeRef={nodeRef}
        handle=".handle"
        bounds="parent"
        onStart={handleStart}
      >
        <div ref={nodeRef} className='w-[250px] h-[400px] bg-white flex flex-col p-4 rounded-[12px] shadow-lg '>
          <Circles />
          {data.map((conflict, index) => (
            <WarTab key={index} conflictData={conflict} />
          ))}
        </div>
      </Draggable>
    </div>
  );
};

export default CountryDetails;