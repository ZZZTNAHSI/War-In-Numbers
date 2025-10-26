import React from 'react';
import Draggable from 'react-draggable';
import WarTab from './WarTab';

interface CountryDetailsProps {
  country: string;
  conflictData: {
    party1_iso: string;
    party2_iso: string;
    death_toll: string;
    place: string;
    start_date: string;
    end_date: string;
  }[];
}

const CountryDetails: React.FC<CountryDetailsProps> = ({ country, conflictData }) => {
  if (!country || conflictData.length === 0) return null;
  console.log(conflictData);





  return (
    <>
      <Draggable bounds="parent">
        <div className='w-[200px] h-[400px] bg-black flex flex-col p-4 self-center justify-center rounded-lg shadow-lg absolute top-10 left-10 z-[1300] cursor-move'>
          {conflictData.map((conflict, index) => (<WarTab key={index} conflictData={conflict} />))}
        </div>
        
      </Draggable>

    </>
  );
};

export default CountryDetails;