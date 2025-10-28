"use client";
import React, { useCallback, useRef } from 'react';
import Draggable from 'react-draggable';
import WarTab from './WarTab';
import Circles from './Circles';
import {motion} from 'framer-motion';


interface CountryDetailsProps {
  getCountryData: () => { start_date: string; end_date: string; party1_iso: string[]; party2_iso: string[]; death_toll: string; place: string; }[]
}

const CountryDetails: React.FC<CountryDetailsProps> = ({getCountryData }) => {
  const data = getCountryData();
  if (!data) return null;
  console.log(data)
  
  const nodeRef = useRef(null);

  const handleStart = useCallback((e: any) => {
    e.preventDefault();
  }, []);

  return (
      <Draggable 
        nodeRef={nodeRef}
        handle=".handle"
        bounds="parent"
        onStart={handleStart}
      >
        <div ref={nodeRef} className='w-[275px] h-[400px] !z-[99999999999999999] '>
        <div  className='static w-[275px] h-[400px] bg-black flex flex-col p-4 rounded-[12px] shadow-xl shadow-[#F2613F]/30 hover:shadow-[#F2613F]  active:shadow-[#F2613F] ease-in duration-200 ' >
          <Circles />
          <div className='overflow-y-auto max-h-[300px]'>
          {/* {data.map((conflict, index) => (
            <WarTab key={index} conflictData={conflict} />
          ))} */}
          </div>
        </div>
        </div>
      </Draggable>
  );
};

export default CountryDetails;