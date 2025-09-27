"use client";

import { ControlPanel } from "@/components/control-panel";
import { CameraControls } from "@/components/camera-controls";
import { useRef, useEffect, useState, useMemo } from "react";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  DEFAULT_STYLE,
  MAP_BOUNDS,
  MAPBOX_ACCESS_TOKEN,
  OVERLAY_CONFIG,
  LAYER_IDS,
  MAP_STYLES,
} from "@/lib/map/config";
import mapboxgl from "mapbox-gl";
import { Inlet } from "@/hooks/useInlets";
import { Outlet } from "@/hooks/useOutlets";
import { Drain } from "@/hooks/useDrain";
import { Pipe } from "@/hooks/usePipes";

import "mapbox-gl/dist/mapbox-gl.css";

export default function MapPage() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [overlayVisibility, setOverlayVisibility] = useState({
    "man_pipes-layer": true,
    "storm_drains-layer": true,
    "inlets-layer": true,
    "outlets-layer": true,
  });

  const layerIds = useMemo(() => LAYER_IDS, []);

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    if (mapContainerRef.current && !mapRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: DEFAULT_STYLE,
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        maxBounds: MAP_BOUNDS,
        pitch: 60, // Add this for a tilted view
        bearing: -17.6, // Add this for rotation
      });
      mapRef.current = map;

      const addCustomLayers = () => {
        if (!map.getSource("mapbox-dem")) {
          map.addSource("mapbox-dem", {
            type: "raster-dem",
            url: "mapbox://mapbox.mapbox-terrain-dem-v1",
            tileSize: 512,
            maxzoom: 14,
          });
          map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
        }

        if (!map.getLayer("3d-buildings")) {
          map.addLayer(
            {
              id: "3d-buildings",
              source: "composite", // built-in Mapbox Streets tileset
              "source-layer": "building", // building footprints
              filter: ["==", "extrude", "true"],
              type: "fill-extrusion",
              minzoom: 15,
              paint: {
                "fill-extrusion-color": "#aaa",
                "fill-extrusion-height": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  15,
                  0,
                  15.05,
                  ["get", "height"], // uses real building height if available
                ],
                "fill-extrusion-base": ["get", "min_height"],
                "fill-extrusion-opacity": 0.6,
              },
            },
            "waterway-label" // place it below labels so text stays visible
          );
        }

        if (!map.getSource("man_pipes")) {
          map.addSource("man_pipes", {
            type: "geojson",
            data: "/drainage/man_pipes.geojson",
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
            data: "/drainage/storm_drains.geojson",
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
            data: "/drainage/inlets.geojson",
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
            data: "/drainage/outlets.geojson",
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
        const validLayers = [
          "inlets-layer",
          "outlets-layer",
          "storm_drains-layer",
          "man_pipes-layer",
        ].filter((id) => map.getLayer(id));

        if (!validLayers.length) return;

        const features = map.queryRenderedFeatures(e.point, {
          layers: validLayers,
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
              <strong>Man Pipe (${props.Name ?? "N/A"})</strong><br/>
              Type: ${props.TYPE ?? "N/A"}<br/>
              Shape: ${props.Pipe_Shape ?? "N/A"}<br/>
              Length: ${props.Pipe_Lngth ?? "N/A"}<br/>
              Height: ${props.Height ?? "N/A"}
              Manning's n: ${props.Mannings ?? "N/A"}<br/>
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
      layerIds.forEach((layerId) => {
        map.on("mouseenter", layerId, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", layerId, () => {
          map.getCanvas().style.cursor = "";
        });
      });
    }
  }, [layerIds]);

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
      newStyle = MAP_STYLES.SATELLITE;
    } else if (currentStyle === "Mapbox Satellite Streets") {
      newStyle = MAP_STYLES.STREETS;
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

  const overlayData = OVERLAY_CONFIG.map((config) => ({
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

  const handleSelectInlet = (inlet: Inlet) => {
    if (!mapRef.current) return;
    const [lng, lat] = inlet.coordinates;

    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: 18,
      speed: 1.2,
      curve: 1,
    });

    new mapboxgl.Popup()
      .setLngLat([lng, lat])
      .setHTML(
        `
      <strong>Inlet (${inlet.id})</strong><br/>
      Inv Elev: ${inlet.Inv_Elev}<br/>
      Max Depth: ${inlet.MaxDepth}<br/>
      Length: ${inlet.Length}<br/>
      Height: ${inlet.Height}
    `
      )
      .addTo(mapRef.current);
  };

  const handleSelectOutlet = (outlet: Outlet) => {
    if (!mapRef.current) return;
    const [lng, lat] = outlet.coordinates;

    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: 18,
      speed: 1.2,
      curve: 1,
    });

    new mapboxgl.Popup()
      .setLngLat([lng, lat])
      .setHTML(
        `
      <strong>Outlet (${outlet.id})</strong><br/>
      Inv Elev: ${outlet.Inv_Elev ?? "N/A"}<br/>
      AllowQ: ${outlet.AllowQ ?? "N/A"}<br/>
      FlapGate: ${outlet.FlapGate ?? "N/A"}
    `
      )
      .addTo(mapRef.current);
  };

  const handleSelectDrain = (drain: Drain) => {
    if (!mapRef.current) return;
    const [lng, lat] = drain.coordinates;

    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: 18,
      speed: 1.2,
      curve: 1,
    });

    new mapboxgl.Popup()
      .setLngLat([lng, lat])
      .setHTML(
        `
      <strong>Storm Drain (${drain.id})</strong><br/>
      Inv Elev: ${drain.InvElev ?? "N/A"}<br/>
      Max Depth: ${drain.Max_Depth ?? "N/A"}<br/>
      Length: ${drain.Length ?? "N/A"}<br/>
      Height: ${drain.Height ?? "N/A"}<br/>
      Clog %: ${drain.clog_per ?? "N/A"}
    `
      )
      .addTo(mapRef.current);
  };

  const handleSelectPipe = (pipe: Pipe) => {
    if (!mapRef.current) return;

    if (!pipe.coordinates || pipe.coordinates.length === 0) return;

    // Fit map to line
    const bounds = new mapboxgl.LngLatBounds();
    pipe.coordinates.forEach((coord) => bounds.extend(coord));
    mapRef.current.fitBounds(bounds, { padding: 100, duration: 1200 });

    // Popup at midpoint
    const midIndex = Math.floor(pipe.coordinates.length / 2);
    const midpoint = pipe.coordinates[midIndex];

    new mapboxgl.Popup()
      .setLngLat(midpoint)
      .setHTML(
        `
      <strong>Pipe (${pipe.id})</strong><br/>
      Type: ${pipe.TYPE}<br/>
      Shape: ${pipe.Pipe_Shape}<br/>
      Length: ${pipe.Pipe_Lngth}<br/>
      Height: ${pipe.Height}<br/>
      Width: ${pipe.Width}<br/>
      Barrels: ${pipe.Barrels}<br/>
      Manning's: ${pipe.Mannings}<br/>
      Clog %: ${pipe.ClogPer}<br/>
      Clog Time: ${pipe.ClogTime}
    `
      )
      .addTo(mapRef.current);
  };

  return (
    <>
      <main className="relative min-h-screen flex flex-col bg-blue-200">
        <div className="w-full h-screen" ref={mapContainerRef} />
        <ControlPanel
          overlaysVisible={someVisible}
          onToggle={handleToggleAllOverlays}
          overlays={overlayData}
          onToggleOverlay={handleOverlayToggle}
          onSelectInlet={handleSelectInlet}
          onSelectOutlet={handleSelectOutlet}
          onSelectDrain={handleSelectDrain}
          onSelectPipe={handleSelectPipe}
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
