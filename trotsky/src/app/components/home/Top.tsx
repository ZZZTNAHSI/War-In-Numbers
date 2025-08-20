"use client";
import Fogs from "../fog/Fogs";
import TitleHead from "../title/TitleHead";
import { useScroll, motion, useTransform, useMotionValue } from "framer-motion";
import OrangeGlobe3D from "./Globe";

const Top: React.FC<{}> =  ({}) => {
    const {scrollY} = useScroll(); 
    // const top = useTransform(scrollY, [0, 1200], [100, 1300]);
    const top = useTransform(scrollY, [0,1200 ], [100,1300 ]);
    const bar = useTransform(scrollY, [1200, 1500], [0, 400]);
    


  return (<><div className="flex items-center justify-center mt-[200px] flex-col ">
    <div >
    <motion.div className="" style={{y : top}} animate={{
        transition: {
            type: "keyframes",
            duration: 0.3
        }
    }}>

        
        <div className="sticky h-[200vh]">
        <div className="flex ">
            <TitleHead />
            <div className="w-[500px] h-[500px] mx-[-350px] z-10 ">
                <OrangeGlobe3D />
            </div>
        </div>
        </div>
    </motion.div>
    </div>
    <div className="items-start">
    <motion.div className="" style={{height: "30px", width : bar, backgroundColor: "#F2613F"}}/>
    </div>
    </div>
    
    </>
    );
}

export default Top;