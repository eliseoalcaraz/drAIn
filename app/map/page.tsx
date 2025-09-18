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

      const addCustomLayers = () => {
        if (!map.getSource("storm_drains")) {
          map.addSource("storm_drains", {
            type: "geojson",
            data: "/storm_drains.geojson",
          });
          map.addLayer({
            id: "storm_drains-layer",
            type: "circle",
            source: "storm_drains",
            paint: {
              "circle-radius": 6,
              "circle-color": "#000000", // black fill
              "circle-stroke-color": "#ffffff", // white outline for contrast
              "circle-stroke-width": 2,
            },
          });
        }
        if (!map.getSource("inlets")) {
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
        }

        if (!map.getSource("man_pipes")) {
          map.addSource("man_pipes", {
            type: "geojson",
            data: "/man_pipes.geojson",
          });
          map.addLayer({
            id: "man_pipes-layer",
            type: "line",
            source: "man_pipes",
            paint: {
              "line-color": "#8B008B",
              "line-width": 2.5,
              "line-dasharray": [2, 2],
            },
          });
        }

        if (map.getLayer("man_pipes-highlight")) {
          map.removeLayer("man_pipes-highlight");
        }
        map.addLayer({
          id: "man_pipes-highlight",
          type: "line",
          source: "man_pipes",
          paint: {
            "line-color": "#00ffff",
            "line-width": 6,
          },
          filter: ["==", ["get", "id"], ""],
        });
        map.on("mousemove", "man_pipes-layer", (e) => {
          if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            const id = feature.properties?.id;

            if (id) {
              map.setFilter("man_pipes-highlight", ["==", ["get", "id"], id]);
            }
          } else {
            // Clear highlight if not hovering any feature
            map.setFilter("man_pipes-highlight", ["==", ["get", "id"], ""]);
          }
        });
        if (!map.getSource("outlets")) {
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
        }
      };

      map.on("load", addCustomLayers);
      map.on("style.load", addCustomLayers);
    }
  }, []);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleResetPosition = () =>
    mapRef.current?.flyTo({ center: defaultCenter, zoom: defaultZoom });

  const handleChangeStyle = () => {
    const currentStyle = mapRef.current?.getStyle().name;
    let newStyle = "";

    if (currentStyle === "Mapbox Streets") {
      newStyle = "mapbox://styles/mapbox/satellite-streets-v11";
    } else if (currentStyle === "Mapbox Satellite Streets") {
      newStyle = "mapbox://styles/mapbox/streets-v11";
    }

    if (newStyle) {
      mapRef.current?.setStyle(newStyle);
    }
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
