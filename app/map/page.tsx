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
import { Inlet, useInlets } from "@/hooks/useInlets";
import { Outlet, useOutlets } from "@/hooks/useOutlets";
import { Drain, useDrain } from "@/hooks/useDrain";
import { Pipe, usePipes } from "@/hooks/usePipes";
import type { DatasetType } from "@/components/control-panel/types";
import { dummyReports } from "@/data/dummy-reports";

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

  const [selectedFeature, setSelectedFeature] = useState<{
    id: string | number;
    source: string;
    layer: string;
  } | null>(null);

  const selectedFeatureRef = useRef<{
    id: string | number;
    source: string;
    layer: string;
  } | null>(null);

  const layerIds = useMemo(() => LAYER_IDS, []);

  // Load data from hooks
  const { inlets } = useInlets();
  const { outlets } = useOutlets();
  const { pipes } = usePipes();
  const { drains } = useDrain();

  // Selection state for control panel detail view
  const [selectedInlet, setSelectedInlet] = useState<Inlet | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [selectedPipe, setSelectedPipe] = useState<Pipe | null>(null);
  const [selectedDrain, setSelectedDrain] = useState<Drain | null>(null);

  // Control panel state
  const [controlPanelTab, setControlPanelTab] = useState<string>("overlays");
  const [controlPanelDataset, setControlPanelDataset] =
    useState<DatasetType>("inlets");

  // Function to clear all selections
  const clearSelections = () => {
    setSelectedInlet(null);
    setSelectedOutlet(null);
    setSelectedPipe(null);
    setSelectedDrain(null);

    // Also clear the map's feature state if something was selected
    if (selectedFeatureRef.current && mapRef.current) {
      mapRef.current.setFeatureState(
        {
          source: selectedFeatureRef.current.source,
          id: selectedFeatureRef.current.id,
        },
        { selected: false }
      );
      setSelectedFeature(null);
    }
  };

  // Refs for data to avoid stale closures in map click handler
  const inletsRef = useRef<Inlet[]>([]);
  const outletsRef = useRef<Outlet[]>([]);
  const pipesRef = useRef<Pipe[]>([]);
  const drainsRef = useRef<Drain[]>([]);

  // Update refs when data changes
  useEffect(() => {
    inletsRef.current = inlets;
  }, [inlets]);

  useEffect(() => {
    outletsRef.current = outlets;
  }, [outlets]);

  useEffect(() => {
    pipesRef.current = pipes;
  }, [pipes]);

  useEffect(() => {
    drainsRef.current = drains;
  }, [drains]);

  // Sync ref with state to avoid stale closures
  useEffect(() => {
    selectedFeatureRef.current = selectedFeature;
  }, [selectedFeature]);

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
            // --- 🎨 CHANGE: Added promoteId ---
            promoteId: "Name",
          });
          map.addLayer({
            id: "man_pipes-layer",
            type: "line",
            source: "man_pipes",
            // --- 🎨 CHANGE: Updated paint properties for highlighting ---
            paint: {
              "line-color": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                "#00ffff", // Highlight color
                "#8B008B",
              ],
              "line-width": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                6, // Highlight width
                2.5,
              ],
            },
          });
        }
        if (!map.getSource("storm_drains")) {
          map.addSource("storm_drains", {
            type: "geojson",
            data: "/drainage/storm_drains.geojson",
            // --- 🎨 CHANGE: Added promoteId ---
            promoteId: "In_Name",
          });
          map.addLayer({
            id: "storm_drains-layer",
            type: "circle",
            source: "storm_drains",
            // --- 🎨 CHANGE: Updated paint properties for highlighting ---
            paint: {
              "circle-radius": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                10,
                4,
              ],
              "circle-color": "#0088ff",
              "circle-stroke-color": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                "#00ffff",
                "#000000",
              ],
              "circle-stroke-width": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                3,
                0.5,
              ],
            },
          });
        }
        if (!map.getSource("inlets")) {
          map.addSource("inlets", {
            type: "geojson",
            data: "/drainage/inlets.geojson",
            // --- 🎨 CHANGE: Added promoteId ---
            promoteId: "In_Name",
          });
          map.addLayer({
            id: "inlets-layer",
            type: "circle",
            source: "inlets",
            // --- 🎨 CHANGE: Updated paint properties for highlighting ---
            paint: {
              "circle-radius": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                12,
                6,
              ],
              "circle-color": "#00cc44",
              "circle-stroke-color": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                "#00ffff",
                "#000000",
              ],
              "circle-stroke-width": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                3,
                0.5,
              ],
            },
          });
        }

        if (!map.getSource("outlets")) {
          map.addSource("outlets", {
            type: "geojson",
            data: "/drainage/outlets.geojson",
            // --- 🎨 CHANGE: Added promoteId ---
            promoteId: "Out_Name",
          });
          map.addLayer({
            id: "outlets-layer",
            type: "circle",
            source: "outlets",
            // --- 🎨 CHANGE: Updated paint properties for highlighting ---
            paint: {
              "circle-radius": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                12,
                6,
              ],
              "circle-color": "#cc0000",
              "circle-stroke-color": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                "#00ffff",
                "#000000",
              ],
              "circle-stroke-width": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                3,
                0.5,
              ],
            },
          });
        }

        // Add reports layer
        if (!map.getSource("reports")) {
          map.addSource("reports", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: dummyReports.map((report) => ({
                type: "Feature" as const,
                geometry: {
                  type: "Point" as const,
                  coordinates: report.coordinates,
                },
                properties: {
                  id: report.id,
                  category: report.category,
                  status: report.status,
                  componentType: report.componentType,
                  componentId: report.componentId,
                  reporterName: report.reporterName,
                  description: report.description,
                  date: report.date,
                },
              })),
            },
          });

          map.addLayer({
            id: "reports-layer",
            type: "circle",
            source: "reports",
            paint: {
              "circle-radius": 8,
              "circle-color": [
                "match",
                ["get", "status"],
                "pending",
                "#eab308",
                "in-progress",
                "#3b82f6",
                "resolved",
                "#22c55e",
                "#9ca3af",
              ],
              "circle-stroke-color": "#ffffff",
              "circle-stroke-width": 2,
              "circle-opacity": 0.9,
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
          "reports-layer",
        ].filter((id) => map.getLayer(id));

        if (!validLayers.length) return;

        const features = map.queryRenderedFeatures(e.point, {
          layers: validLayers,
        });

        // If no features are clicked, clear all selections
        if (!features.length) {
          clearSelections();
          setControlPanelTab("overlays");
          return;
        }

        const feature = features[0];
        const props = feature.properties || {};
        if (!feature.layer) return;

        // Find the corresponding data and call the correct handler
        switch (feature.layer.id) {
          case "reports-layer": {
            const report = dummyReports.find((r) => r.id === props.id);
            if (report) {
              // Show popup with report bubble content
              const popupContent = `
                <div style="max-width: 300px;">
                  <div style="display: flex; align-items: start; gap: 12px; margin-bottom: 8px;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background-color: ${
                      report.componentType === "inlet"
                        ? "#22c55e"
                        : report.componentType === "outlet"
                        ? "#ef4444"
                        : report.componentType === "pipe"
                        ? "#a855f7"
                        : "#3b82f6"
                    }; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <div>
                      <h3 style="margin: 0; font-weight: 600; color: #111827;">${report.reporterName}</h3>
                      <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Report #${report.id}</p>
                    </div>
                  </div>
                  <div style="margin-left: 44px;">
                    <div style="margin-bottom: 8px;">
                      <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; border: 1px solid ${
                        report.status === "pending"
                          ? "#fde047"
                          : report.status === "in-progress"
                          ? "#93c5fd"
                          : "#86efac"
                      }; background-color: ${
                report.status === "pending"
                  ? "#fef9c3"
                  : report.status === "in-progress"
                  ? "#dbeafe"
                  : "#dcfce7"
              }; color: ${
                report.status === "pending"
                  ? "#854d0e"
                  : report.status === "in-progress"
                  ? "#1e40af"
                  : "#166534"
              };">
                        ${report.status.replace("-", " ").toUpperCase()}
                      </span>
                    </div>
                    <p style="margin: 8px 0; font-size: 12px; color: #4b5563;">
                      <strong>Component:</strong> ${
                        report.componentType.charAt(0).toUpperCase() +
                        report.componentType.slice(1)
                      } (${report.componentId})
                    </p>
                    <p style="margin: 8px 0; font-size: 12px; color: #4b5563;">
                      <strong>Category:</strong> ${report.category}
                    </p>
                    <p style="margin: 8px 0 0 0; font-size: 13px; color: #111827;">
                      ${report.description}
                    </p>
                  </div>
                </div>
              `;

              new mapboxgl.Popup()
                .setLngLat(report.coordinates)
                .setHTML(popupContent)
                .addTo(map);
            }
            break;
          }
          case "man_pipes-layer": {
            const pipe = pipesRef.current.find((p) => p.id === props.Name);
            if (pipe) handleSelectPipe(pipe);
            break;
          }
          case "inlets-layer": {
            const inlet = inletsRef.current.find((i) => i.id === props.In_Name);
            if (inlet) handleSelectInlet(inlet);
            break;
          }
          case "outlets-layer": {
            const outlet = outletsRef.current.find(
              (o) => o.id === props.Out_Name
            );
            if (outlet) handleSelectOutlet(outlet);
            break;
          }
          case "storm_drains-layer": {
            const drain = drainsRef.current.find((d) => d.id === props.In_Name);
            if (drain) handleSelectDrain(drain);
            break;
          }
        }
      });

      // Change cursor on hover (nice UX)
      [...layerIds, "reports-layer"].forEach((layerId) => {
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

  // Handler for the back button in control panel
  const handleControlPanelBack = () => {
    clearSelections();
    setControlPanelTab("stats");
  };

  const handleSelectInlet = (inlet: Inlet) => {
    if (!mapRef.current) return;
    const [lng, lat] = inlet.coordinates;

    // Clear any previous selections first
    clearSelections();

    // Set the new selection state for control panel
    setSelectedInlet(inlet);
    setControlPanelTab("stats");
    setControlPanelDataset("inlets");

    // Set new map feature state
    mapRef.current.setFeatureState(
      { source: "inlets", id: inlet.id },
      { selected: true }
    );
    setSelectedFeature({
      id: inlet.id,
      source: "inlets",
      layer: "inlets-layer",
    });

    // Fly to the location on the map
    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: 18,
      speed: 1.2,
      curve: 1,
    });

    // Add popup
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

    // Clear any previous selections first
    clearSelections();

    // Set the new selection state for control panel
    setSelectedOutlet(outlet);
    setControlPanelTab("stats");
    setControlPanelDataset("outlets");

    // Set new map feature state
    mapRef.current.setFeatureState(
      { source: "outlets", id: outlet.id },
      { selected: true }
    );
    setSelectedFeature({
      id: outlet.id,
      source: "outlets",
      layer: "outlets-layer",
    });

    // Fly to the location on the map
    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: 18,
      speed: 1.2,
      curve: 1,
    });

    // Add popup
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

    // Clear any previous selections first
    clearSelections();

    // Set the new selection state for control panel
    setSelectedDrain(drain);
    setControlPanelTab("stats");
    setControlPanelDataset("storm_drains");

    // Set new map feature state
    mapRef.current.setFeatureState(
      { source: "storm_drains", id: drain.id },
      { selected: true }
    );
    setSelectedFeature({
      id: drain.id,
      source: "storm_drains",
      layer: "storm_drains-layer",
    });

    // Fly to the location on the map
    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: 18,
      speed: 1.2,
      curve: 1,
    });

    // Add popup
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

    // Clear any previous selections first
    clearSelections();

    // Set the new selection state for control panel
    setSelectedPipe(pipe);
    setControlPanelTab("stats");
    setControlPanelDataset("man_pipes");

    // Set new map feature state
    mapRef.current.setFeatureState(
      { source: "man_pipes", id: pipe.id },
      { selected: true }
    );
    setSelectedFeature({
      id: pipe.id,
      source: "man_pipes",
      layer: "man_pipes-layer",
    });

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
          activeTab={controlPanelTab}
          dataset={controlPanelDataset}
          selectedInlet={selectedInlet}
          selectedOutlet={selectedOutlet}
          selectedPipe={selectedPipe}
          selectedDrain={selectedDrain}
          onTabChange={setControlPanelTab}
          onDatasetChange={setControlPanelDataset}
          onSelectInlet={handleSelectInlet}
          onSelectOutlet={handleSelectOutlet}
          onSelectDrain={handleSelectDrain}
          onSelectPipe={handleSelectPipe}
          onBack={handleControlPanelBack}
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
