const Slider: React.FC = () => {
    return (
        <div className="w-[1200px] flex justify-center items-center mt-4">
            <p className="title text-[#F2613F] text-[55px] !p-2 !mr-[20px]">1947</p>
            <input
                type="range"
                min="1947"
                max="2022"
                className="w-[90%] h-2  border-[#F2613F]  border-1 rounded-lg appearance-none cursor-pointer  accent-[#F2613F]"
            />
            <p className="title text-[#F2613F] text-[55px] !p-2 !ml-[20px]">2022</p>
        </div>
    );
};

export default Slider;