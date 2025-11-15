const Slider: React.FC<{ onChange: (year: number) => void; year: number }> = ({ onChange, year }) => {
    return (
        <div className="w-[1200px] flex justify-center items-center mt-4">
            <p className="title text-[#F2613F] text-[55px] !p-2 !mr-[20px]">1947</p>
            <input
                type="range"
                min="1947"
                max="2025"
                className="w-[90%] h-2  border-[#F2613F]  border-1 rounded-lg appearance-none cursor-pointer  accent-[#F2613F]"
                value={year}
                onChange={(e) => onChange(Number(e.target.value))}
            />
            <p className="title text-[#F2613F] text-[55px] !p-2 !ml-[20px]">2025</p>
        </div>
    );
};

export default Slider;