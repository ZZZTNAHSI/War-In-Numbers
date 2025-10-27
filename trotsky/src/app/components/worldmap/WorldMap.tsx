"use client";
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import "./map.css"
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from "react-leaflet";
import { Suspense, useEffect, useState, useCallback } from "react";
import * as Papa from "papaparse";
import * as L from "leaflet";
import {scaleLinear, scaleLog} from "d3";
import MapButtons from "./MapButtons";
import CountryDetails from "./CountryDetails";
import { GeoJSONOptions, Layer} from "leaflet";
import { Geometry, Feature } from "geojson";
import { geoPath, geoMercator } from "d3-geo";
import CountryOverlay from "./CountryOverlay";
import {motion} from "framer-motion";
import { Return } from "three/examples/jsm/transpiler/AST.js";


type ConflictRecord = { start_date: string; end_date: string; party1_iso: string; party2_iso: string; death_toll: string; place: string; };
type ReturnConflictRecord = { start_date: string; end_date: string; party1_iso: string[]; party2_iso: string[]; death_toll: string; place: string; }[];
const bounds = new L.LatLngBounds(
  [-110, -200], // Southwest corner of the world
  [110, 200]  // Northeast
);




const WorldMap: React.FC<{}> = () => {
    const [geoJsonData, setgeoJsonData] = useState(null!);
    const [geoData, setGeoData] = useState<ConflictRecord[]>([]);
    const [year, setYear] = useState(1991);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [mapRef, setMapRef] = useState<L.Map | null>(null);
    const [overlayInfo, setOverlayInfo] = useState<{ 
        d: string; 
        matrix: string;
        dimensions: {
            width: number;
            height: number;
            top: number;
            left: number;
        };
        fillColor: string;
    } | null>(null);




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

    const colorScale = scaleLinear<string>().domain([lowestDeathToll, highestDeathToll]).range(["#FFCCCB", "#8B0000"]);



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

    let getCountryData: () => ReturnConflictRecord;
        

        const style: L.StyleFunction = (feature) : L.PathOptions => {
            const iso = feature?.properties?.iso_a2;
            const placeData = geoData.filter((record) => record.place.includes(iso));
            const death = placeData.reduce((sum, record) => sum + (parseInt(record.death_toll) || 0), 0);
            const color = death > 0 ? colorScale(death) : "#000000";
        return {
            fillColor: color,
            weight: 1,
            opacity: 1,
            fillOpacity: 1,
            color: '#F2613F',
            
            
        };
    }

 

    const onEachFeature = (feature: Feature, layer: Layer) => {
        const iso = feature?.properties?.iso_a2;
        const placeData = geoData.filter((record) => record.place.includes(iso));
        const death = placeData.reduce((sum, record) => sum + (parseInt(record.death_toll) || 0), 0);
        const fillColor = death > 0 ? colorScale(death) : "#000000";

        layer.addEventListener("click", () => {
            if (!mapRef) return;
            // zoom so the country fills the screen
            const bounds = (layer as any).getBounds?.();
            if (bounds) {
                mapRef.fitBounds(bounds, { padding: [40, 40], maxZoom: 6});
            }

            getCountryData = () => {
                const returnObject: ReturnConflictRecord = [];
                let obj;
                for (let i = 0; i < geoData.length; i++) {
                    const record = geoData[i];
                    if (!obj) {
                        obj = record;
                    } else if (obj.start_date === record.start_date) {
                        const tempObj: any = {start_date: obj.start_date, end_date: obj.end_date, party1_iso: [], party2_iso: [], death_toll: null, place: obj.place};
                        let deathTollTemp = obj.death_toll ? parseInt(obj.death_toll) || 0 : 0 + parseInt(record.death_toll) || 0;
                        tempObj.party1_iso.push(obj.party1_iso);
                        tempObj.party2_iso.push(obj.party2_iso);
                        tempObj.party1_iso.push(record.party1_iso);
                        tempObj.party2_iso.push(record.party2_iso);
                        for (let j = i + 1; j < geoData.length; j++) {
                            const rec = geoData[j];
                            if (rec.start_date === obj.start_date) {
                                const isoaTemp = rec.party1_iso;
                                const isobTemp = rec.party2_iso;
                                tempObj.party1_iso.push(isoaTemp);
                                tempObj.party2_iso.push(isobTemp);
                                deathTollTemp += parseInt(rec.death_toll) || 0;
                            }
                    }
                    tempObj.death_toll = deathTollTemp.toString();
                    returnObject.push(tempObj);
                    obj = record;
            } else {
                const tempObj: any = {start_date: obj.start_date, end_date: obj.end_date, party1_iso: [obj.party1_iso], party2_iso: [obj.party2_iso], death_toll: obj.death_toll, place: obj.place};
                returnObject.push(tempObj);
                obj = record;
            }
        }
        return returnObject;
    }

            // wait for the map animation to finish, then capture the path
            mapRef.once('moveend', () => {
                let pathEl: SVGPathElement | null = null;
                if (typeof (layer as any).getElement === 'function') {
                pathEl = (layer as any).getElement?.() ?? null;
                }
                if (!pathEl && (layer as any)._path) {
                pathEl = (layer as any)._path as SVGPathElement;
                }
                if (!pathEl) {
                console.warn('Could not locate SVG path element for layer', feature);
                return;
                }

                const ownerSvg = pathEl.ownerSVGElement as SVGSVGElement | null;
                if (!ownerSvg) return;
                const svgRect = ownerSvg.getBoundingClientRect();
                const mapRect = mapRef.getContainer().getBoundingClientRect();
                const dimensions = {
                width: svgRect.width,
                height: svgRect.height,
                top: svgRect.top - mapRect.top,
                left: svgRect.left - mapRect.left,
                };

                let matrixStr = '';
                try {
                const ctm = pathEl.getCTM();
                if (ctm) matrixStr = `matrix(${ctm.a} ${ctm.b} ${ctm.c} ${ctm.d} ${ctm.e} ${ctm.f})`;
                } catch (err) {
                console.warn('getCTM failed', err);
                }

                const d = pathEl.getAttribute('d') ?? '';
                setOverlayInfo({ d, matrix: matrixStr, dimensions, fillColor });


            });
            });
    }
    const handleCloseDetails = () => {
        setOverlayInfo(null);
        if (mapRef) {
            mapRef.setView([40, 0], 2);
        }
    }

    return (
        <Suspense>
            <div style={{ position: 'relative' }}>
                {overlayInfo && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 1000,
                            pointerEvents: 'none',
                            background: 'rgba(0,0,0,0.2)',
                            backdropFilter: 'blur(4px)',
                        }}
                    />
                )}
                <motion.div className="relative" style={{}} transition={{ duration: 0.3 }}>
                    <div>
                        <MapContainer 
                            ref={(ref) => setMapRef(ref)}
                            zoomControl={false} 
                            attributionControl={false} 
                            maxBounds={bounds} 
                            center={[40, 0]} 
                            minZoom={2} 
                            zoom={2} 
                            scrollWheelZoom={false} 
                            style={{ height: "750px", width: "1300px", backgroundColor: "black" }} 
                        >
                            {geoJsonData && <>
                                <GeoJSON style={style} onEachFeature={onEachFeature} data={geoJsonData}/>
                            </>}
                            {(geoJsonData && !overlayInfo) ? <MapButtons /> : null}
                        </MapContainer>
                    </div>
                </motion.div>
                {overlayInfo && mapRef ? (
                    <CountryOverlay
                        info={overlayInfo}
                        container={mapRef.getContainer().parentElement ?? mapRef.getContainer()}
                        onClose={handleCloseDetails}
                        fillColor={overlayInfo.fillColor}
                    />
                ) : null}
            </div>
        </Suspense>
    )
}

export default WorldMap;