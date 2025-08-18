import TitleWord from "./titleWord";

const TitleHead : React.FC<{}> = ({}) => {
    return (<>
    <div className="flex flex-col justify-center items-center sticky">
      <div>
        <TitleWord word={"War"} prev={0}/>
        <TitleWord word={"In"} prev={300}/>
        <TitleWord word={"Numbers"} prev={500}/>
      </div>
    </div>
    </>);
}

export default TitleHead;