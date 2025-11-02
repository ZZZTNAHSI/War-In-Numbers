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
import {AnimatePresence, motion} from "framer-motion";
import Slider from "./Slider";
import Header from "./Header";
import HiddenText from "./HiddenText";



type ConflictRecord = {conflict_id: string; start_date: string; end_date: string; party1_iso: string; party2_iso: string; death_toll: string; place: string; };
type ReturnConflictRecord = {conflict_id: string; start_date: string; end_date: string; party1_iso: string[]; party2_iso: string[]; death_toll: string; place: string; }[];
type ReturnConflictRecordSingle = {conflict_id: string; start_date: string; end_date: string; party1_iso: string[]; party2_iso: string[]; death_toll: string; place: string; };
const bounds = new L.LatLngBounds(
  [-110, -200], // Southwest corner of the world
  [110, 200]  // Northeast
);




const WorldMap: React.FC<{}> = () => {
    const [geoJsonData, setgeoJsonData] = useState(null!);
    const [geoData, setGeoData] = useState<ConflictRecord[]>([]);
    const [year, setYear] = useState(2000);
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

const onChangeYear = (e: number) => {
    setYear(e);
};

const getData = useCallback((isop: string) => {
    const placeData = geoData.filter(record => record.place.replace(",", '') === isop);
    if (placeData.length === 0) return [];
    let idList: string[] = [];

    for (const record of placeData) {   
        idList.push(record.conflict_id);
    }
    idList = [...new Set(idList)];
    const result: ReturnConflictRecord = [];

    for (const id of idList) {
        const wars = placeData.filter(record => record.conflict_id === id);
        const returnWar: ReturnConflictRecordSingle = {start_date: wars[0].start_date, end_date: wars[0].end_date, party1_iso: [], party2_iso: [], death_toll: "", place: wars[0].place, conflict_id: id};
        const isoaSet: Set<string> = new Set();
        const isobSet: Set<string> = new Set();
        let deathTollSum = 0;
        for (const war of wars) {
            deathTollSum += parseInt(war.death_toll) || 0;
            const party1isos = war.party1_iso.split(",").map(s => s.trim());
            const party2isos = war.party2_iso.split(",").map(s => s.trim());
            party1isos.forEach(iso => isoaSet.add(iso));
            party2isos.forEach(iso => isobSet.add(iso));
        }
        returnWar.party1_iso = Array.from(isoaSet);
        returnWar.party2_iso = Array.from(isobSet);
        returnWar.death_toll = deathTollSum.toString();
        result.push(returnWar);
    }
    return result;
    }, [geoData]);

    const ids = geoData.map(record => record.conflict_id);
    const uniqueIds = [...new Set(ids)];




    const deathToll: number | number[] = uniqueIds.map((id) => {
        const instance = geoData.filter((r) => r.conflict_id === id);
        const totalDeathToll = instance.reduce((sum, r) => sum + (parseInt(r.death_toll) || 0), 0);
        return totalDeathToll;
    });
    const highestDeathToll= Math.max(...deathToll);
    const lowestDeathToll = Math.min(...deathToll);
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
                        return false;
                    }
                    return (parseInt(record.start_date.substring(0,4)) <= year && parseInt(record.end_date.substring(0,4)) >= year) ?? false;
                })
                setGeoData(data);
            }
        });
    }, [year]);

        

        const style: L.StyleFunction = (feature) : L.PathOptions => {
            const iso = feature?.properties?.iso_a2;
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
    <div className="flex flex-col items-center justify-center !m-[200px]">
        <Header year={year} />
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
                            backdropFilter: 'blur(3px)',
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
        <Slider onChange={onChangeYear} year={year} />
        <AnimatePresence mode="sync">
        {year < 1989 && <motion.p layout initial={{opacity: 0}} exit={{opacity: 0}} animate={{opacity: 1}} key={1} className="text-[#808080] items-center ">Conflicts before 1989 become more innacurate inaccurate</motion.p>}
                <motion.p layout key={2} className="text-[#808080] items-center !mt-5 !mb-5">To be classified as a conflict, there has to be a conflict with 2 sides which sustained more than 25 battle deaths. Some sides are not included, for example the Russian annexation of Crimea doesn't include Russia as a party member of the war because they sustained less than 25 deaths due to war. </motion.p>
        <motion.p layout key={3} className="text-[#808080] items-center !mt-5">
Sources: 
• Davies, S., Pettersson, T., Sollenberg, M., & Öberg, M. (2025). Organized violence 1989-2024, and the challenges of identifying civilian victims. Journal of Peace Research, 62(4).
• Gleditsch, Nils Petter, Peter Wallensteen, Mikael Eriksson, Margareta Sollenberg, and Håvard Strand (2002) Armed Conflict 1946-2001: A New Dataset. Journal of Peace Research 39(5).
• UCDP is part of and funded by DEMSCORE, national research infrastructure grant 2021-00162 from the Swedish Research Council.
• Davies, S., Pettersson, T., Sollenberg, M., & Öberg, M. (2025). Organized violence 1989-2024, and the challenges of identifying civilian victims. Journal of Peace Research, 62(4).

</motion.p>
</AnimatePresence>
    </div>
    )
}

export default WorldMap;

