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
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center: defaultCenter,
        zoom: defaultZoom,
        maxBounds: [
          [123.86601, 10.30209],
          [124.02689, 10.37254],
        ],
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
