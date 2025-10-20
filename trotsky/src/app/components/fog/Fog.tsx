"use client";
import { motion, Variants } from "framer-motion";

const Fog: React.FC<{delay: number}> = ({delay}) => {
    const variant: Variants = {
      fog: {
        x: ["-33%", "-16%", "0%", "16%, 33%", "16%", "0%", "-16%", "-33%"],
        transition: {
          duration: 75,
          repeat: Infinity,
          type: "keyframes",
          delay: delay
        },
        opacity: ["20%", "10%", "0%", "10%", "20%", "10%", "0%", "10%", "20%"]
      }
    }
    return (
    <motion.div
    className="z-[1] !mt-[-300px] pointer-events-none  opacity-20  bg-cover fog absolute top-0 left-0 w-[200vw] h-[200%] bg-[url(/fog.png)] "
    variants={variant}
    animate="fog"
    ></motion.div>
)
}
export default Fog;