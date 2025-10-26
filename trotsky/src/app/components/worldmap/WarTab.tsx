interface WarTabProps   {
    conflictData: {
        party1_iso: string;
        party2_iso: string;
        death_toll: string;
        place: string;
        start_date: string;
        end_date: string;
    }
  };

const WarTab: React.FC<WarTabProps> = ({ conflictData }) => {
    return (
        <div className="flex gap-4 ">
            
        </div>
    );
};
export default WarTab;