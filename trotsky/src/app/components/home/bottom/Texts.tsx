import TextPara from "./Text";
import { useEffect, useState } from "react";
import { useScroll, AnimatePresence } from "framer-motion";
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
                I had fun making it. This is the accumlation of all the years of self
                studying, blood, sweat and tears into this one project. The website itself
                is more so a momento to the skirmish that happened between Pakistan and India.
                The place where my parents came from and where most of my family live which is
                Jalandhar right on the border between those 2 nations. I know a lot of wars
                don't get reported as much as they should like the plethora of wars that are
                happening right now in Africa and some other wars which were in the media cycle
                for a week or 2 but then left the conscious of the general public. 
                `} /> }
            {showText.text2 && <TextPara key={2} text={
                `My goal for this website is for you to check your countries origin and see the data for yourself because I feel knowing about your
                home country is pretty gosh darn important. I also want to highlight the various wars that are happening in the world :).
                `}/>  }     
            </AnimatePresence>
        </div>
    </>);
}

export default Texts;
