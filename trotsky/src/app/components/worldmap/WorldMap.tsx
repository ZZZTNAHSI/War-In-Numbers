"use client";
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import { MapContainer, TileLayer, Marker, Popup, GeoJSON  } from "react-leaflet";
import { Suspense, useEffect, useState } from "react";
import * as Papa from "papaparse";
import * as L from "leaflet";
import { StyleFunction } from "leaflet";
import {scaleLinear, scaleLog} from "d3";
type ConflictRecord = { start_date: string; end_date: string; party1_iso: string; party2_iso: string; death_toll: string; place: string; };
const bounds = new L.LatLngBounds(
  [-90, -180], // Southwest corner of the world
  [90, 180]  // Northeast
);



const WorldMap: React.FC<{}> = () => {
    const [geoJsonData, setgeoJsonData] = useState(null!);
    const [geoData, setGeoData] = useState<ConflictRecord[]>([]);
    const [year, setYear] = useState(2000);


    let highestDeathToll: number | number[] = geoData.map((record) => {
        const startDate = record.start_date;
        const instance = geoData.filter((r) => r.start_date === startDate);
        const totalDeathToll = instance.reduce((sum, r) => sum + (parseInt(r.death_toll) || 0), 0);
        return totalDeathToll;
    });
    highestDeathToll= Math.max(...highestDeathToll);
    let lowestDeathToll: number | number[] = geoData.map((record) => {
        const startDate = record.start_date;
        const instance = geoData.filter((r) => r.start_date === startDate);
        const totalDeathToll = instance.reduce((sum, r) => sum + (parseInt(r.death_toll) || 0), 0);
        return totalDeathToll;
    });
    lowestDeathToll = Math.min(...lowestDeathToll);

    const colorScale = scaleLinear<string>().domain([lowestDeathToll, highestDeathToll]).range(["#FFADB0", "#8b0000"]);



    useEffect(() => {
        fetch("/custom.geo.json").then((data) => data.json()).then((data) => {
            setgeoJsonData(data);
        });
        Papa.parse<ConflictRecord>("/data.csv", {
            header: true,
            download: true,
            complete: (results) => {
                const data = results.data.filter((record) => parseInt(record.start_date.substring(0,4)) <= year && parseInt(record.end_date.substring(0,4)) >= year);
                setGeoData(data);
            }
        });
    }, []);

        const style: L.StyleFunction = (feature) : L.PathOptions => {
            const iso = feature?.properties?.iso_a2;
            const placeData = geoData.filter((record) => record.place.includes(iso));
            const death = placeData.reduce((sum, record) => sum + (parseInt(record.death_toll) || 0), 0);
            const color = death > 0 ? colorScale(death) : "#000000";

        return {
            fillColor: color,
            weight: 1,
            opacity: 1,
            color: '#F2613F',
        };
    }

    return (

        <Suspense>
            <MapContainer maxBounds={bounds} center={[40, 0]} minZoom={2} zoom={2} scrollWheelZoom={false} style={{ height: "750px", width: "1300px", backgroundColor: "black" }} >
                {geoJsonData && <GeoJSON style={style}  data={geoJsonData}/>}
            </MapContainer>
        </Suspense>

    )
}

export default WorldMap;