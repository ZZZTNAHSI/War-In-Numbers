"use client";
import { motion, useScroll, useTransform } from "framer-motion";

const TitleWord: React.FC<{word: String, prev: number}> =  ({word, prev}) => {
    const w = word.length * 100;
    const {scrollY}  = useScroll();
    const width = useTransform(scrollY, [prev, w + prev], [w, 0]); 

    
    return (<div className="relative">
        <motion.div className="absolute bg-black h-[128px]"
        style={{
            width
        }}
        ></motion.div>
        <p className="text-[#F2613F] text-9xl font-semibold tracking-tight">{word}</p>
    </div>)
}
export default TitleWord;