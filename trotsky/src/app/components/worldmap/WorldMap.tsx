"use client";
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import { MapContainer, TileLayer, Marker, Popup, GeoJSON  } from "react-leaflet";
import { Suspense, useEffect, useState } from "react";
import * as Papa from "papaparse";
import * as L from "leaflet";


type ConflictRecord = { start_date: string; end_date: string; party1_iso: string; party2_iso: string; death_toll: string; place: string; };
const bounds = new L.LatLngBounds(
  [-90, -180], // Southwest corner of the world
  [90, 180]  // Northeast
);

const WorldMap: React.FC<{}> = () => {
    const [geoJsonData, setgeoJsonData] = useState(null!);
    const [geoData, setGeoData] = useState<ConflictRecord[]>([]);

    useEffect(() => {
        fetch("/custom.geo.json").then((data) => data.json()).then((data) => {
            setgeoJsonData(data);
        });
        Papa.parse<ConflictRecord>("/data.csv", {
            header: true,
            download: true,
            complete: (results) => {
                setGeoData(results.data);
            }
        });
    }, []);

    return (
        <Suspense>
            <MapContainer maxBounds={bounds} center={[40, 0]} minZoom={2} zoom={2} scrollWheelZoom={false} style={{ height: "750px", width: "1300px", backgroundColor: "black" }} >
                {geoJsonData && <GeoJSON   data={geoJsonData}/>}
            </MapContainer>
        </Suspense>

    )
}

export default WorldMap;