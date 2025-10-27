

import { useMap } from "react-leaflet";

const MapButton: React.FC<{}> = () => {
    const map = useMap();


    return (
    <>
        <div className="absolute flex flex-col !z-[99999999]">
            <button onClick={() => map.zoomIn()} className="flex items-center justify-center origin-center text-center text-black text-[25px] text rounded-[2px] bg-[#F2613F] h-[35px] w-[35px] transition-all duration-100 ease-linear hover:text-[30px] active:text-[20px]">
                <span className="origin-center transition-all duration-100 ease-linear hover:scale-110 active:scale-110">+</span></button>
            <button onClick={() => map.zoomOut()} className="flex items-center justify-center origin-center text-center text-black text-[25px] text rounded-[2px] bg-[#F2613F] h-[35px] w-[35px] transition-all duration-100 ease-linear hover:text-[30px] active:text-[20px]">
                <span className="origin-center transition-all duration-100 ease-linear hover:scale-110 active:scale-110">-</span></button>
        </div>
    </>);
}
export default MapButton;