import CountryDetails from "../components/worldmap/CountryDetails";
import WarTab from "../components/worldmap/WarTab";
import WorldMapWrapper from "../components/worldmap/WorldMapWrapper";
import "../globals.css";

export default function GlobeHome() {

    return (
    // <div className="flex flex-col items-center justify-center !m-[250px]">
    //     <WorldMapWrapper />
    // </div>
        <CountryDetails country={"US"} conflictData={[{
            party1_iso: "US",
            party2_iso: "CA",
            death_toll: "1000",
            place: "North America",
            start_date: "1990-01-01",
            end_date: "1995-01-01",
        }]} />
    );
}

