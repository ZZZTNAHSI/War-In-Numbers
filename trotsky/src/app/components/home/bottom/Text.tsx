"use client";
import {motion} from "framer-motion";
const TextPara: React.FC<{text: string}> = ({text}) => {
    return (
        <motion.p className="para " initial={{
            opacity:0,
        }} animate={{
            opacity:1,
        }} transition={{
            duration:0.5
        }}
        exit={{
            opacity: 0,
            transition: {
                duration: 0.5
            }
        }}
        
        >{text}</motion.p>
    );
}

export default TextPara;