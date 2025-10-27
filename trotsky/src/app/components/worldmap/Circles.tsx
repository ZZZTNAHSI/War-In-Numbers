const Circles: React.FC<{}> = () => {
    return (
        <>
        <div className="flex flex-col gap-1 justify-center items-center draggable-cursor handle w-full h-[60px] rounded-[12px]">
            <div className="flex gap-2">
                <div className="h-[12px] w-[12px] rounded-full bg-stone-400 " />
                <div className="h-[12px] w-[12px] rounded-full bg-stone-400 " />
                <div className="h-[12px] w-[12px] rounded-full bg-stone-400 " />
            </div>
            <div className="flex gap-2">
                <div className="h-[12px] w-[12px] rounded-full bg-stone-400 " />
                <div className="h-[12px] w-[12px] rounded-full bg-stone-400 " />
                <div className="h-[12px] w-[12px] rounded-full bg-stone-400 " />
            </div>
        </div>
        <div className="bg-[#F2613F] w-full h-[4px]"/>
        </>
    );
}
export default Circles;