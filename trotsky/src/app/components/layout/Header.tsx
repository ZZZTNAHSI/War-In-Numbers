import Image from "next/image";
import HeaderButton from "./HeaderButton";
import Link from "next/link";
const Header: React.FC<{}> = () => {
    return (
    <>
        <header className="w-full h-[75px] !z[11] flex justify-between !p-[20px]">
            <Link  href={"/"}  >
                <Image src="/amurica.png" alt="Crossed Guns" width={75} height={65}  />
            </Link>
            <div className="flex gap-2">
                <HeaderButton text="Globe" link="/globe" />
                <HeaderButton text="Graph" link="/graph" />
            </div>
        </header>
    </>);
}

export default Header;