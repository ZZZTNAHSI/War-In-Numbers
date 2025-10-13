"use client";
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import { MapContainer, TileLayer, Marker, Popup, GeoJSON  } from "react-leaflet";
import { useEffect, useState } from "react";




const WorldMap: React.FC<{}> = () => {
    const [geoJsonData, setgeoJsonData] = useState(null!);

    useEffect(() => {
        fetch("/custom.geo.json").then((data) => data.json()).then((data) => {
            setgeoJsonData(data);
        });
    });

    return (
        <MapContainer center={[0, 0]}  zoom={2} scrollWheelZoom={false} style={{ height: "750px", width: "1300px" }} >
            {geoJsonData && <GeoJSON   data={geoJsonData}/>}
        </MapContainer>
    )
}

export default WorldMap;