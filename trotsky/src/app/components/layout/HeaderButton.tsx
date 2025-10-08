import Link from "next/link";
const HeaderButton: React.FC<{text: string, link: string}> = ({text, link}) => {
    return (
        <Link href={link} className="!ml-[15px] w-[175px] h-[65px] bg-transparent border-[#F2613F] text-[#F2613F] border-[5px] text-[25px] rounded-[999px] hover:cursor-pointer hover:bg-[#F2613F] hover:text-[#e7e9ec] hover:transition-colors duration-300 ease-in-out flex justify-center items-center">
            {text}
        </Link>
    );
}
export default HeaderButton;