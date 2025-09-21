"use client";

import { ControlPanel } from "@/components/control-panel";
import { CameraControls } from "@/components/camera-controls";
import { useRef, useEffect, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

const DEFAULT_CENTER: [number, number] = [123.926, 10.337];
const DEFAULT_ZOOM = 12;
const DEFAULT_STYLE = "mapbox://styles/mapbox/streets-v11";

export default function Map() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [overlayVisibility, setOverlayVisibility] = useState({
    "man_pipes-layer": true,
    "storm_drains-layer": true,
    "inlets-layer": true,
    "outlets-layer": true,
  });

  const overlayConfig = [
    { id: "man_pipes-layer", name: "Man Pipes", color: "#8B008B" },
    { id: "storm_drains-layer", name: "Storm Drains", color: "#0088ff" },
    { id: "inlets-layer", name: "Inlets", color: "#00cc44" },
    { id: "outlets-layer", name: "Outlets", color: "#cc0000" },
  ];

  const layerIds = useMemo(
    () => [
      "man_pipes-layer",
      "storm_drains-layer",
      "inlets-layer",
      "outlets-layer",
    ],
    []
  );

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoia2lsb3VraWxvdSIsImEiOiJjbWZsMmc5dWMwMGlxMmtwdXgxaHE0ZjVnIn0.TFZP0T-4zrLdI0Be-u0t3Q";

    if (mapContainerRef.current && !mapRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: DEFAULT_STYLE,
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        maxBounds: [
          [123.86601, 10.30209],
          [124.02689, 10.37254],
        ],
      });
      mapRef.current = map;

      const addCustomLayers = () => {
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
            },
          });
        }
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
              "circle-radius": 4,
              "circle-color": "#0088ff",
              "circle-stroke-color": "#000000",
              "circle-stroke-width": 0.5,
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
              "circle-radius": 6,
              "circle-color": "#00cc44",
              "circle-stroke-color": "#000000",
              "circle-stroke-width": 0.5,
            },
          });
        }

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
              "circle-color": "#cc0000",
              "circle-stroke-color": "#000000",
              "circle-stroke-width": 0.5,
            },
          });
        }
      };

      map.on("load", addCustomLayers);
      map.on("style.load", addCustomLayers);

      map.on("click", (e) => {
        // query features at the click location
        const features = map.queryRenderedFeatures(e.point, {
          layers: [
            "inlets-layer",
            "outlets-layer",
            "storm_drains-layer",
            "man_pipes-layer",
          ],
        });

        if (!features.length) return;

        // always get the top-most feature (index 0)
        const feature = features[0];
        const props = feature.properties || {};

        let html = "";
        if (!feature.layer) return;

        switch (feature.layer.id) {
          case "man_pipes-layer":
            html = `
              <strong>Man Pipe</strong><br/>
              Name: ${props.Name ?? "N/A"}<br/>
              Type: ${props.TYPE ?? "N/A"}<br/>
              Shape: ${props.Pipe_Shape ?? "N/A"}<br/>
              Length: ${props.Pipe_Lngth ?? "N/A"}<br/>
              Height: ${props.Height ?? "N/A"}
              Manning’s n: ${props.Mannings ?? "N/A"}<br/>
              Barrels: ${props.Barrels ?? "N/A"}<br/>
              Clog %: ${props.ClogPer ?? "N/A"}<br/>
              Clog Time: ${props.ClogTime ?? "N/A"}
            `;
            break;

          case "inlets-layer":
            html = `
              <strong>Inlet (${props.In_Name ?? "N/A"})</strong><br/>
              Type: ${props.In_Type ?? "N/A"}<br/>
              Inv Elev: ${props.Inv_Elev ?? "N/A"}<br/>
              Max Depth: ${props.MaxDepth ?? "N/A"}
              Length: ${props.Length ?? "N/A"} m<br/>
              Height: ${props.Height ?? "N/A"} m<br/>
              Weir Coeff: ${props.Weir_Coeff ?? "N/A"}<br/>
              Clog %: ${props.ClogFac ?? "N/A"}<br/>
              Clog Time: ${props.ClogTime ?? "N/A"}
            `;
            break;

          case "outlets-layer":
            html = `
              <strong>Outlet (${props.Out_Name ?? "N/A"})</strong><br/>
              Inv Elev: ${props.Inv_Elev ?? "N/A"}<br/>
              AllowQ: ${props.AllowQ ?? "N/A"}<br/>
              FlapGate: ${props.FlapGate ?? "N/A"}
            `;
            break;

          case "storm_drains-layer":
            html = `
              <strong>Storm Drain (${props.In_Name ?? "N/A"})</strong><br/>
              Inv Elev: ${props.InvElev ?? "N/A"}<br/>
              Max Depth: ${props.Max_Depth ?? "N/A"}
              Length: ${props.Length ?? "N/A"}<br/>
              Height: ${props.Height ?? "N/A"}<br/>
              Clog %: ${props.clog_per ?? "N/A"}
            `;
            break;
        }

        if (html) {
          new mapboxgl.Popup().setLngLat(e.lngLat).setHTML(html).addTo(map);
        }
      });

      // Change cursor on hover (nice UX)
      map.on("mouseenter", "man_pipes-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "man_pipes-layer", () => {
        map.getCanvas().style.cursor = "";
      });

      map.on("mouseenter", "storm_drains-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "storm_drains-layer", () => {
        map.getCanvas().style.cursor = "";
      });

      map.on("mouseenter", "inlets-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "inlets-layer", () => {
        map.getCanvas().style.cursor = "";
      });

      map.on("mouseenter", "outlets-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "outlets-layer", () => {
        map.getCanvas().style.cursor = "";
      });
    }
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      layerIds.forEach((layerId) => {
        if (mapRef.current?.getLayer(layerId)) {
          mapRef.current.setLayoutProperty(
            layerId,
            "visibility",
            overlayVisibility[layerId as keyof typeof overlayVisibility]
              ? "visible"
              : "none"
          );
        }
      });
    }
  }, [overlayVisibility, layerIds]);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleResetPosition = () =>
    mapRef.current?.flyTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });

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

  const handleOverlayToggle = (layerId: string) => {
    setOverlayVisibility((prev) => ({
      ...prev,
      [layerId]: !prev[layerId as keyof typeof prev],
    }));
  };

  const overlayData = overlayConfig.map((config) => ({
    ...config,
    visible: overlayVisibility[config.id as keyof typeof overlayVisibility],
  }));

  const handleToggleAllOverlays = () => {
    const someVisible = Object.values(overlayVisibility).some(Boolean);

    const updated: typeof overlayVisibility = {
      "man_pipes-layer": !someVisible,
      "storm_drains-layer": !someVisible,
      "inlets-layer": !someVisible,
      "outlets-layer": !someVisible,
    };

    setOverlayVisibility(updated);
  };

  const someVisible = Object.values(overlayVisibility).some(Boolean);

  return (
    <>
      <main className="relative min-h-screen flex flex-col bg-blue-200">
        <div className="w-full h-screen" ref={mapContainerRef} />
        <ControlPanel
          overlaysVisible={someVisible}
          onToggle={handleToggleAllOverlays}
          overlays={overlayData}
          onToggleOverlay={handleOverlayToggle}
        />
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
