"use client";

import { ControlPanel } from "@/components/control-panel";
import { CameraControls } from "@/components/camera-controls";
import { useRef, useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  MAP_BOUNDS,
  MAPBOX_ACCESS_TOKEN,
} from "@/lib/map/config";
import {
  SIMULATION_MAP_STYLE,
  SIMULATION_PITCH,
  SIMULATION_BEARING,
  SIMULATION_LAYER_IDS,
} from "@/lib/map/simulation-config";
import mapboxgl from "mapbox-gl";
import { Inlet, useInlets } from "@/hooks/useInlets";
import { Outlet, useOutlets } from "@/hooks/useOutlets";
import { Drain, useDrain } from "@/hooks/useDrain";
import { Pipe, usePipes } from "@/hooks/usePipes";
import type { DatasetType } from "@/components/control-panel/types";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import "mapbox-gl/dist/mapbox-gl.css";

export default function SimulationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSimulationActive = searchParams.get("active") === "true";

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

  const layerIds = useMemo(() => SIMULATION_LAYER_IDS, []);

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
  const [controlPanelTab, setControlPanelTab] = useState<string>("simulations");
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
        style: SIMULATION_MAP_STYLE,
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        maxBounds: MAP_BOUNDS,
        pitch: SIMULATION_PITCH,
        bearing: SIMULATION_BEARING,
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
              source: "composite",
              "source-layer": "building",
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
                  ["get", "height"],
                ],
                "fill-extrusion-base": ["get", "min_height"],
                "fill-extrusion-opacity": 0.6,
              },
            },
            "waterway-label"
          );
        }

        if (!map.getSource("man_pipes")) {
          map.addSource("man_pipes", {
            type: "geojson",
            data: "/drainage/man_pipes.geojson",
            promoteId: "Name",
          });
          map.addLayer({
            id: "man_pipes-layer",
            type: "line",
            source: "man_pipes",
            paint: {
              "line-color": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                "#00ffff",
                "#8B008B",
              ],
              "line-width": [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                6,
                2.5,
              ],
            },
          });
        }

        if (!map.getSource("storm_drains")) {
          map.addSource("storm_drains", {
            type: "geojson",
            data: "/drainage/storm_drains.geojson",
            promoteId: "In_Name",
          });
          map.addLayer({
            id: "storm_drains-layer",
            type: "circle",
            source: "storm_drains",
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
            promoteId: "In_Name",
          });
          map.addLayer({
            id: "inlets-layer",
            type: "circle",
            source: "inlets",
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
            promoteId: "Out_Name",
          });
          map.addLayer({
            id: "outlets-layer",
            type: "circle",
            source: "outlets",
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
      };

      map.on("load", addCustomLayers);
      map.on("style.load", addCustomLayers);

      // Click handlers
      map.on("click", (e) => {
        if (!isSimulationActive) return;

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

        if (!features.length) {
          clearSelections();
          setControlPanelTab("simulations");
          return;
        }

        const feature = features[0];
        const props = feature.properties || {};
        if (!feature.layer) return;

        switch (feature.layer.id) {
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
            const outlet = outletsRef.current.find((o) => o.id === props.Out_Name);
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

      // Cursor style
      layerIds.forEach((layerId) => {
        map.on("mouseenter", layerId, () => {
          if (isSimulationActive) {
            map.getCanvas().style.cursor = "pointer";
          }
        });
        map.on("mouseleave", layerId, () => {
          map.getCanvas().style.cursor = "";
        });
      });
    }
  }, [layerIds, isSimulationActive]);

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
    // Keep dark style in simulation mode
    return;
  };

  const handleOverlayToggle = (layerId: string) => {
    setOverlayVisibility((prev) => ({
      ...prev,
      [layerId]: !prev[layerId as keyof typeof prev],
    }));
  };

  const overlayData = [
    {
      id: "man_pipes-layer",
      name: "Man Pipes",
      color: "#8B008B",
      visible: overlayVisibility["man_pipes-layer"],
    },
    {
      id: "storm_drains-layer",
      name: "Storm Drains",
      color: "#0088ff",
      visible: overlayVisibility["storm_drains-layer"],
    },
    {
      id: "inlets-layer",
      name: "Inlets",
      color: "#00cc44",
      visible: overlayVisibility["inlets-layer"],
    },
    {
      id: "outlets-layer",
      name: "Outlets",
      color: "#cc0000",
      visible: overlayVisibility["outlets-layer"],
    },
  ];

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
    setControlPanelTab("simulations");
  };

  const handleSelectInlet = (inlet: Inlet) => {
    if (!mapRef.current) return;
    const [lng, lat] = inlet.coordinates;

    // Clear any previous selections first
    clearSelections();

    // Set the new selection state for control panel
    setSelectedInlet(inlet);
    setControlPanelTab("simulations");
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
    setControlPanelTab("simulations");
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
    setControlPanelTab("simulations");
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
    setControlPanelTab("simulations");
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

  const handleExitSimulation = () => {
    router.push("/map");
  };

  return (
    <>
      <main className="relative min-h-screen flex flex-col bg-gray-900">
        <div
          className="w-full h-screen relative"
          style={{ pointerEvents: isSimulationActive ? "auto" : "none" }}
        >
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Grey overlay when simulation is not active */}
          {!isSimulationActive && (
            <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
              <div className="text-white text-xl font-medium">
                Enter Simulation Mode to activate map
              </div>
            </div>
          )}

          {/* Exit button when simulation is active */}
          {isSimulationActive && (
            <Button
              onClick={handleExitSimulation}
              variant="outline"
              className="absolute top-4 right-4 z-20"
            >
              <X className="mr-2 h-4 w-4" />
              Exit Simulation Mode
            </Button>
          )}
        </div>

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
          isSimulationMode={isSimulationActive}
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
