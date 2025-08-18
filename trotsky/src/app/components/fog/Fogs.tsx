"use client"
import { motion } from "framer-motion";
import Fog from "./Fog";



const Fogs: React.FC<{}> = () => {
    return (<>
        <motion.div className="w-[100%] h-[200vh] " style={{position: "absolute"}} >
            <Fog key={"1"} delay={0} />
            <Fog key={"2"} delay={5} />
            <Fog key={"3"} delay={10} />
        </motion.div>
    </>);
}
export default Fogs