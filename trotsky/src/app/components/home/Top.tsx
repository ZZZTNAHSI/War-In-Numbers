"use client";
import TitleHead from "../title/TitleHead";
import { useScroll, motion, useTransform } from "framer-motion";
import OrangeGlobe3D from "./Globe";
import Texts from "./bottom/Texts";
import { useEffect, useState } from "react";


const Top: React.FC<{}> =  ({}) => {
    const {scrollY} = useScroll(); 
    // const top = useTransform(scrollY, [0, 1200], [100, 1300]);

    const top = useTransform(scrollY, [0,1200 ], [100,1300 ]);
    const bar = useTransform(scrollY, [1200, 1500], [0, 1000]);
    const [isIdle, setIsIdle] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return; // ensure client-side only

    let timeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsIdle(false);
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        setIsIdle(true);
      }, 1000);
    };

    // Add scroll listener
    window.addEventListener("scroll", handleScroll);

    // Initialize timer
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  return (<>
  
    <motion.div className="flex justify-center items-center flex-col mt-[200px] gap-6" style={{y : top}} animate={{
        transition: {
            type: "keyframes",
            duration: 0.3
        }
    }}>

        

        <div className="flex ">
            {isIdle? <motion.p initial={{opacity: 0}} animate={{opacity: 1}} className="h-full w-[486px] text-[#808080] text-center self-center !p-4"> Scroll down to see the rest of the website </motion.p> :<TitleHead />}
            <div className="w-[500px] h-[500px] mx-[-350px] z-10 ">
                <OrangeGlobe3D />
            </div>
        </div>

    <motion.div className=" z-[100] sticky`" style={{height: "30px", width : bar, backgroundColor: "#F2613F"}}/>
    <Texts />

    
    </motion.div>



    
    </> 
    );
}

export default Top;