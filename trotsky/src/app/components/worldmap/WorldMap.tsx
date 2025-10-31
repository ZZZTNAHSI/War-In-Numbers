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


type ConflictRecord = {conflict_id: string; start_date: string; end_date: string; party1_iso: string; party2_iso: string; death_toll: string; place: string; };
type ReturnConflictRecord = {conflict_id: string; start_date: string; end_date: string; party1_iso: string[]; party2_iso: string[]; death_toll: string; place: string; }[];
const bounds = new L.LatLngBounds(
  [-110, -200], // Southwest corner of the world
  [110, 200]  // Northeast
);

type CountryObject = {
    iso: string;
    data: (iso: string) => ReturnConflictRecord | undefined;
}




const WorldMap: React.FC<{}> = () => {
    const [geoJsonData, setgeoJsonData] = useState(null!);
    const [geoData, setGeoData] = useState<ConflictRecord[]>([]);
    const [year, setYear] = useState(1960);
    const [isoOfCountry, setCountryData] = useState<string>("");
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

const getData = useCallback((isop: string) => {
    const placeData = geoData.filter(record => record.place.replace(",", '') === isop);
    if (placeData.length === 0) return [];
    console.log("placeData", placeData);

    // Group by start_date
    const grouped: { [date: string]: ConflictRecord[] } = {};
    for (const record of placeData) {
        if (!grouped[record.start_date]) grouped[record.start_date] = [];
        grouped[record.start_date].push(record);
    }

    const result: ReturnConflictRecord = [];
    for (const start_date in grouped) {
        const group = grouped[start_date];
        const party1Set = new Set<string>();
        const party2Set = new Set<string>();
        let deathTollSum = 0;
        let end_date = group[0].end_date;
        let place = group[0].place;

        for (const rec of group) {
            party1Set.add(rec.party1_iso);
            party2Set.add(rec.party2_iso);
            deathTollSum += parseInt(rec.death_toll) || 0;
            if (rec.end_date > end_date) end_date = rec.end_date;
        }

        // result.push({
        //     start_date,
        //     end_date,
        //     party1_iso: Array.from(party1Set),
        //     party2_iso: Array.from(party2Set),
        //     death_toll: deathTollSum.toString(),
        //     place,
        // });
    }

    return result;
    }, [geoData]);




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
                const data = results.data.filter((record) => {
                    try  {
                        const erm = parseInt(record.start_date.substring(0,4));
                        const erm2 = parseInt(record.end_date.substring(0,4));
                    } catch {
                        console.log("error parsing date for record", record);
                        return false;
                    }
                    return (parseInt(record.start_date.substring(0,4)) <= year && parseInt(record.end_date.substring(0,4)) >= year) ?? false;
                })
                setGeoData(data);
            }
        });
    }, []);

    console.log("geoData", geoData);

        

        const style: L.StyleFunction = (feature) : L.PathOptions => {
            const iso = feature?.properties?.iso_a2;
            // this is .includes, some iso's have commas which results in some places not having color when clicked on. 
            const placeData = geoData.filter((record) => record.place.replace(",",'') === (iso));

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
        // if there is no iso it will .innclude all terriroties including the letters
        const placeData = geoData.filter((record) => record.place.replace(",",'') === (iso));
        const death = placeData.reduce((sum, record) => sum + (parseInt(record.death_toll) || 0), 0);
        const fillColor = death > 0 ? colorScale(death) : "#000000";

        layer.addEventListener("click", () => {
            if (!mapRef) return;
            // zoom so the country fills the screen
            const bounds = (layer as any).getBounds?.();
            if (bounds) {
                mapRef.fitBounds(bounds, { padding: [40, 40], maxZoom: 6});
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
                setCountryData(() => iso);
                setOverlayInfo({ d, matrix: matrixStr, dimensions, fillColor });
                


            });
            });
    }
    const handleCloseDetails = () => {
        setOverlayInfo(null);
        setCountryData("");
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
                    <>
                    <div className="!z-[99999999] absolute h-[750px] w-[1300px] top-0 left-0">
                        
                        <CountryDetails getData={getData} iso={isoOfCountry}  />
                    </div>
                    
                    <CountryOverlay
                        info={overlayInfo}
                        container={mapRef.getContainer().parentElement ?? mapRef.getContainer()}
                        onClose={handleCloseDetails}
                        fillColor={overlayInfo.fillColor}
                    />
                    </>
                ) : null}
            </div>
        </Suspense>
    )
}

export default WorldMap;