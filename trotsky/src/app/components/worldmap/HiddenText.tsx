const HiddenText: React.FC<{text: string}> = ({text}) => {
    return (
        <p className="text-[#808080] items-center">{text}</p>
    );
}

export default HiddenText;