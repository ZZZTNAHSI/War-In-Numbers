const Header: React.FC<{year: number}> = ({year}) => {
    return (
        <div className="w-full !m-2 !mb-10 justify-center flex items-center">
            <h1 className="title text-[#F2613F] text-[55px] !p-2">{year}</h1>
        </div>
    );
};

export default Header;