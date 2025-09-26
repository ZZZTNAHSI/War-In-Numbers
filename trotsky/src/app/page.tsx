import Top from "./components/home/Top";
import Fogs from "./components/fog/Fogs";
import BigButton from "./components/home/bottom/BigButton";
import img from "/globe.jpg";

export default function Home() {
  return (<>
  <div className="">
    {/* <Fogs />
    <Top /> */}
    <BigButton text2="erm" text="Enter" link="/" img='/FakeGlobe.jpg' />

    
  </div>
    </>
    );
}
