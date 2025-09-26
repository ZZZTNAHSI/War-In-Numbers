"use client";
import Link from "next/link";
import { motion } from "framer-motion";
const BigButton: React.FC<{text: string, link: string, img: string, text2: string}> = ({text, link, img, text2}) => {
    return (
        <motion.button initial={{ backgroundSize: "140%" }} whileHover={{ backgroundSize: "100%",  }} whileTap={{ backgroundSize: "180%" }} style={{backgroundImage: `url(${img})`, transformOrigin: "center", backgroundPosition: "center"}} className="object-contain !z-10 w-[750px] mx-[75px] my-[15px] rounded-[9px] h-[300px] border-[#F2613F] border-[6px] ">
            <Link href={link} >
                <div className="flex flex-col w-full h-full hover:cursor-pointer items-start ">
                    <h3 className="text-[#F2613F] font-bold underline text-[65px] !ml-5">{text}</h3>
                    <p className="text-[20px]  !ml-5 text-[#e7e9ec]">{text2}</p>

                </div>
            </Link>
        </motion.button>

    );
}
export default BigButton;