"use client";

import { ControlPanel } from "@/components/control-panel";
import { CameraControls } from "@/components/camera-controls";
import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Map() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const defaultCenter: [number, number] = [123.926, 10.337];
  const defaultZoom = 12;

  const [mapStyle, setMapStyle] = useState(
    "mapbox://styles/mapbox/streets-v11"
  );

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoia2lsb3VraWxvdSIsImEiOiJjbWZsMmc5dWMwMGlxMmtwdXgxaHE0ZjVnIn0.TFZP0T-4zrLdI0Be-u0t3Q";

    if (mapContainerRef.current && !mapRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center: defaultCenter,
        zoom: defaultZoom,
        // maxBounds: [
        //   [123.86601, 10.30209],
        //   [124.02689, 10.37254],
        // ],
      });
      mapRef.current = map;
      map.on("load", () => {
        map.addSource("inlets", {
          type: "geojson",
          data: "/inlets.geojson",
        });
        map.addLayer({
          id: "inlets-layer",
          type: "circle",
          source: "inlets",
          paint: {
            "circle-radius": 4,
            "circle-color": "#ffaa00",
          },
        });

        map.addSource("man_pipes", {
          type: "geojson",
          data: "/man_pipes.geojson", // place this file in /public
        });

        map.addLayer({
          id: "man_pipes-layer",
          type: "line",
          source: "man_pipes",
          paint: {
            "line-color": "#8B008B", // dark magenta for distinction
            "line-width": 2.5,
            "line-dasharray": [2, 2], // optional: dashed to differentiate from main pipes
          },
        });

        map.addSource("outlets", {
          type: "geojson",
          data: "/outlets.geojson",
        });
        map.addLayer({
          id: "outlets-layer",
          type: "circle",
          source: "outlets",
          paint: {
            "circle-radius": 6,
            "circle-color": "#00cc44",
          },
        });

        map.addSource("storm_drains", {
          type: "geojson",
          data: "/storm_drains.geojson", // put file in /public
        });

        map.addLayer({
          id: "storm_drains-layer",
          type: "line",
          source: "storm_drains",
          paint: {
            "line-color": "#1E90FF", // Dodger Blue
            "line-width": 3,
            "line-dasharray": [4, 2], // longer dash pattern to stand out
          },
        });
      });
    }
  }, []);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleResetPosition = () =>
    mapRef.current?.flyTo({ center: defaultCenter, zoom: defaultZoom });

  const handleChangeStyle = () => {
    const newStyle = mapStyle.includes("streets-v11")
      ? "mapbox://styles/mapbox/satellite-streets-v11"
      : "mapbox://styles/mapbox/streets-v11";

    setMapStyle(newStyle);

    mapRef.current?.setStyle(newStyle);
  };

  return (
    <>
      <main className="relative min-h-screen flex flex-col bg-blue-200">
        <div className="w-full h-screen" ref={mapContainerRef} />
        <ControlPanel />
        <CameraControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetPosition={handleResetPosition}
          onChangeStyle={handleChangeStyle}
        />
      </main>
    </>
  );
}
