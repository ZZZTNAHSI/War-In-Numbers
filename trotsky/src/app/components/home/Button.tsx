import {motion} from "framer-motion";
const Button: React.FC<{}> =  ({}) => {
    return (
    <>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="bg-blue-500 text-white py-2 px-4 rounded">
            Click Me
        </motion.button>
    </>
        
    );
}

export default Button;
