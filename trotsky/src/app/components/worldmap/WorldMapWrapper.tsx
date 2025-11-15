"use client";
import dynamic from "next/dynamic";


export default function WorldMapWrapper() {
    const WorldMap = dynamic(() => import("./WorldMap"), {
        ssr: false, // ensures it never renders on server
    });
    return (<>
    <WorldMap />
    <div className="!mb-[-700px]"/>
    
    </>
);
}
