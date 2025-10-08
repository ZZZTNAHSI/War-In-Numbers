import SVG from "./SVG";
import {motion} from "framer-motion";
import Link from "next/link";

const Footer: React.FC<{}> = () => {
    return (<footer className="w-full h-[375px] bg-[#F2613F] !mt-[800px] !z[1000]">
        <div className="flex flex-col !ml-8 !pt-8 !z[11] gap-3">
            <p className="text-black text-[20px] title ">Contact Me: </p>
            <SVG />
            <Link href="mailto:${Ishantmahey1@gmail.com}" className="text-black text-[15px] !ml-5 title !mt-[-13px] underline ">Email me</Link>
            <Link href="tel:+18168097140" className="text-black text-[15px] !ml-5 title !mt-[7px] underline ">Call me</Link>
        </div>
    
    </footer>);
}

export default Footer;