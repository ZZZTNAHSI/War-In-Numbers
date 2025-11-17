"use client";
import TextPara from "./Text";
import { useEffect, useState } from "react";
import { useScroll, AnimatePresence, motion, stagger, delay } from "framer-motion";
import BigButton from "./BigButton";
import Footer from "../../layout/Footer";
// initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.5}}
const VariantsButton = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
            transition: {  duration: 0.5 },
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.5 },
        }
    
};
const VariantsWrapper = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.25,
        }
    }
};
const Texts: React.FC<{}> = ({}) => {
    const {scrollY} = useScroll(); 
    const [showText, setShowText] = useState({
        text1: false,
        text2: false,
    });
        useEffect(() => {
            scrollY.on("change", (latest) => {
                console.log(latest);
                if (latest > 1500) {
                    setShowText(prev => {
                        return {...prev, text1: true};
                    });
                }
                else if (latest < 1500) {
                        setShowText(prev => {
                        return {...prev, text1: false};
                    });
                }
                if (latest > 1700) {
                    setShowText(prev => {
                        return {...prev, text2: true};
                    });
                }
                else if (latest < 1700) {
                        setShowText(prev => {
                        return {...prev, text2: false};
                    });
                }
            });
        }, [scrollY]);
    return (<>
    <div className="flex gap-5 flex-col justify-center items-center max-w-[800px] mx-auto mt-10 px-5">
        <AnimatePresence >
            {showText.text1 && <TextPara key={1} text={
                `Yo Yo Yo Ishant up in the house. I hope you enjoy the website as much as
                I had fun making it. The inspiration for this website stems comes from the conflict between India and Pakistan that happened
                earlier in 2025. Me being an Indian and having my family living on the border gave me the eureka moment needed to make this website.
                Wars hapepening on foreign land don't last very long in the news cycle so they leave people's consciousness or they go unnoticed
                completely. I want to show the sheer amount of human life lost due something that feels so far from us.
                `} /> }
            {showText.text2 && <TextPara key={2} text={
                `My goal for this website is for you to check your countries origin and see the data for yourself because I feel knowing about your
                home country is pretty important :).
                `}/>  }
            <AnimatePresence mode="wait" >
                {showText.text2 && <motion.div variants={VariantsWrapper} initial="hidden" animate="visible" exit="exit">
                    <motion.div  className="!z-[11] !mt-10" variants={VariantsButton} >
                        <BigButton text="Globe" link="/globe" img='/FakeGlobe.jpg' text2="See the development of wars throughout the years"/>
                    </motion.div>
                    <div className="!my-10"/>
                    </motion.div>
                }
                </AnimatePresence>
            
            </AnimatePresence>

        </div>
        <Footer />
    </>);
}   

export default Texts;
