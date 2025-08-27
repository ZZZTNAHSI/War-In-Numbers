"use client";
import Fogs from "../fog/Fogs";
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




  return (<>
  
    <motion.div className="flex justify-center items-center flex-col mt-[200px] gap-6" style={{y : top}} animate={{
        transition: {
            type: "keyframes",
            duration: 0.3
        }
    }}>

        

        <div className="flex ">
            <TitleHead />
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