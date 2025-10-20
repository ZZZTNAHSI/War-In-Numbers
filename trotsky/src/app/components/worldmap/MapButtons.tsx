

import { useMap } from "react-leaflet";

const MapButton: React.FC<{}> = () => {
    const map = useMap();


    return (
    <>
        <div className="absolute flex flex-col">
            <button onClick={() => map.zoomIn()} className="origin-center text-center text-black text-[25px] text rounded-[2px] bg-[#F2613F] h-[35px] w-[35px] transition-all duration-100 ease-linear hover:text-[30px] active:text-[20px]">+</button>
            <button onClick={() => map.zoomOut()} className="origin-center text-center text-black text-[25px] text rounded-[2px] bg-[#F2613F] h-[35px] w-[35px] transition-all duration-100 ease-linear hover:text-[30px] active:text-[20px]">-</button>
        </div>
    </>);
}
export default MapButton