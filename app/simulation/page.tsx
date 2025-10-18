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
  LAYER_COLORS,
  CAMERA_ANIMATION,
  getLinePaintConfig,
  getCirclePaintConfig,
} from "@/lib/map/simulation-config";
import mapboxgl from "mapbox-gl";
import { useInlets } from "@/hooks/useInlets";
import { useOutlets } from "@/hooks/useOutlets";
import { useDrain } from "@/hooks/useDrain";
import { usePipes } from "@/hooks/usePipes";
import type {
  DatasetType,
  Inlet,
  Outlet,
  Drain,
  Pipe,
} from "@/components/control-panel/types";

import "mapbox-gl/dist/mapbox-gl.css";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { VulnerabilityDataTable } from "@/components/vulnerability-data-table";
import { fetchYRTable } from "@/lib/Vulnerabilities/FetchDeets";
import { NodeSimulationSlideshow } from "@/components/node-simulation-slideshow";

type YearOption = 2 | 5 | 10 | 15 | 20 | 25 | 50 | 100;

interface NodeDetails {
  Node_ID: string;
  Vulnerability_Category: string;
  Vulnerability_Rank: number;
  Cluster: number;
  Cluster_Score: number;
  YR: number;
  Time_Before_Overflow: number;
  Hours_Flooded: number;
  Maximum_Rate: number;
  Time_Of_Max_Occurence: number;
  Total_Flood_Volume: number;
}

export default function SimulationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSimulationActive = searchParams.get("active") === "true";
  const { setOpen, isMobile, setOpenMobile, open } = useSidebar();

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
  const [selectedPointForSimulation, setSelectedPointForSimulation] = useState<
    string | null
  >(null);

  // Vulnerability table state
  const [selectedYear, setSelectedYear] = useState<YearOption | null>(null);
  const [tableData, setTableData] = useState<NodeDetails[] | null>(null);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [isTableMinimized, setIsTableMinimized] = useState(false);
  const [tablePosition, setTablePosition] = useState<{ x: number; y: number }>({
    x: typeof window !== "undefined" ? window.innerWidth * 0.6 - 250 : 400,
    y: typeof window !== "undefined" ? window.innerHeight * 0.5 - 300 : 100,
  });
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(
    new Set()
  );

  // Slideshow state
  const [slideshowNode, setSlideshowNode] = useState<string | null>(null);

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

  // Auto-close sidebar when simulation page loads (only once on mount)
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    // Only initialize map after sidebar is closed to ensure proper sizing
    if (mapContainerRef.current && !mapRef.current && !open) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: SIMULATION_MAP_STYLE,
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        maxBounds: MAP_BOUNDS,
        pitch: SIMULATION_PITCH,
        bearing: SIMULATION_BEARING,
        attributionControl: false,
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
            paint: getLinePaintConfig("man_pipes"),
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
            paint: getCirclePaintConfig("storm_drains"),
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
            paint: getCirclePaintConfig("inlets"),
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
            paint: getCirclePaintConfig("outlets"),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layerIds, isSimulationActive, open]);

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
      name: "Pipes",
      color: LAYER_COLORS.man_pipes.color,
      visible: overlayVisibility["man_pipes-layer"],
    },
    {
      id: "storm_drains-layer",
      name: "Storm Drains",
      color: LAYER_COLORS.storm_drains.color,
      visible: overlayVisibility["storm_drains-layer"],
    },
    {
      id: "inlets-layer",
      name: "Inlets",
      color: LAYER_COLORS.inlets.color,
      visible: overlayVisibility["inlets-layer"],
    },
    {
      id: "outlets-layer",
      name: "Outlets",
      color: LAYER_COLORS.outlets.color,
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
    setControlPanelTab("simulations"); // Switch to simulations tab
    setControlPanelDataset("inlets");
    setSelectedPointForSimulation(inlet.id); // Pass to simulations content

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

    // Fly to the selected feature with smooth animation
    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: CAMERA_ANIMATION.targetZoom,
      speed: CAMERA_ANIMATION.speed,
      curve: CAMERA_ANIMATION.curve,
      essential: CAMERA_ANIMATION.essential,
      easing: CAMERA_ANIMATION.easing,
    });

    // Show toast notification
    toast.info(
      <div>
        Outlet distance updated. Go{" "}
        <button
          className="underline hover:text-[#5a525a] cursor-pointer bg-transparent border-none p-0"
          onClick={() => {
            setControlPanelTab("stats");
          }}
        >
          here
        </button>{" "}
        to view more details
      </div>
    );
  };

  const handleSelectOutlet = (outlet: Outlet) => {
    if (!mapRef.current) return;
    const [lng, lat] = outlet.coordinates;

    // Clear any previous selections first
    clearSelections();

    // Set the new selection state for control panel
    setSelectedOutlet(outlet);
    // DON'T change tab - stay on current tab
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

    // Fly to the selected feature with smooth animation
    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: CAMERA_ANIMATION.targetZoom,
      speed: CAMERA_ANIMATION.speed,
      curve: CAMERA_ANIMATION.curve,
      essential: CAMERA_ANIMATION.essential,
      easing: CAMERA_ANIMATION.easing,
    });

    // Show toast notification
    toast.info(
      <div>
        <strong>{outlet.id}</strong> is selected. Go{" "}
        <button
          className="underline hover:text-[#5a525a] cursor-pointer bg-transparent border-none p-0"
          onClick={() => {
            setControlPanelTab("stats");
          }}
        >
          here
        </button>{" "}
        to view more details
      </div>
    );
  };

  const handleSelectDrain = (drain: Drain) => {
    if (!mapRef.current) return;
    const [lng, lat] = drain.coordinates;

    // Clear any previous selections first
    clearSelections();

    // Set the new selection state for control panel
    setSelectedDrain(drain);
    setControlPanelTab("simulations"); // Switch to simulations tab
    setControlPanelDataset("storm_drains");
    setSelectedPointForSimulation(drain.id); // Pass to simulations content

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

    // Fly to the selected feature with smooth animation
    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: CAMERA_ANIMATION.targetZoom,
      speed: CAMERA_ANIMATION.speed,
      curve: CAMERA_ANIMATION.curve,
      essential: CAMERA_ANIMATION.essential,
      easing: CAMERA_ANIMATION.easing,
    });

    // Show toast notification
    toast.info(
      <div>
        Outlet distance updated. Go{" "}
        <button
          className="underline hover:text-[#5a525a] cursor-pointer bg-transparent border-none p-0"
          onClick={() => {
            setControlPanelTab("stats");
          }}
        >
          here
        </button>{" "}
        for more details
      </div>
    );
  };

  const handleSelectPipe = (pipe: Pipe) => {
    if (!mapRef.current) return;
    if (!pipe.coordinates || pipe.coordinates.length === 0) return;

    // Clear any previous selections first
    clearSelections();

    // Set the new selection state for control panel
    setSelectedPipe(pipe);
    // DON'T change tab - stay on current tab
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

    // Popup at midpoint
    const midIndex = Math.floor(pipe.coordinates.length / 2);
    const midpoint = pipe.coordinates[midIndex];

    // Fly to the selected feature with smooth animation (center on midpoint)
    mapRef.current.flyTo({
      center: midpoint,
      zoom: CAMERA_ANIMATION.targetZoom,
      speed: CAMERA_ANIMATION.speed,
      curve: CAMERA_ANIMATION.curve,
      essential: CAMERA_ANIMATION.essential,
      easing: CAMERA_ANIMATION.easing,
    });

    // Show toast notification
    toast.info(
      <div>
        <strong>{pipe.id}</strong> is selected. Go{" "}
        <button
          className="underline hover:text-[#5a525a] cursor-pointer bg-transparent border-none p-0"
          onClick={() => {
            setControlPanelTab("stats");
          }}
        >
          here
        </button>{" "}
        for more details
      </div>
    );
  };

  const handleExitSimulation = () => {
    // Close sidebar first
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }

    // Navigate after a delay to ensure sidebar closes
    setTimeout(() => {
      router.push("/map");
    }, 200);
  };

  // Vulnerability table handlers
  const handleGenerateTable = async () => {
    if (!selectedYear) return;

    setIsLoadingTable(true);
    try {
      const data = await fetchYRTable(selectedYear);
      setTableData(data);
      setIsTableMinimized(false);
      toast.success(
        `Successfully loaded ${data.length} nodes for ${selectedYear}YR`
      );
    } catch (error) {
      console.error("Error fetching vulnerability data:", error);
      toast.error("Failed to load vulnerability data. Please try again.");
      setTableData(null);
    } finally {
      setIsLoadingTable(false);
    }
  };

  const handleToggleTableMinimize = () => {
    setIsTableMinimized(!isTableMinimized);
  };

  const handleCloseTable = () => {
    setTableData(null);
    setIsTableMinimized(false);
  };

  const handleYearChange = (year: number | null) => {
    setSelectedYear(year as YearOption | null);
  };

  // Helper function to parse Node_ID and determine source and feature ID
  const parseNodeId = (
    nodeId: string
  ): { source: string | null; featureId: string | null } => {
    if (nodeId.startsWith("ISD-")) {
      // Storm drain: ISD-* maps to storm_drains source with In_Name as promoteId
      return { source: "storm_drains", featureId: nodeId };
    } else if (nodeId.startsWith("I-")) {
      // Inlet: I-* maps to inlets source with In_Name as promoteId
      return { source: "inlets", featureId: nodeId };
    }
    return { source: null, featureId: null };
  };

  // Handler for highlighting nodes from vulnerability table
  const handleHighlightNodes = (nodeIds: Set<string>) => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous highlights
    highlightedNodes.forEach((nodeId) => {
      const { source, featureId } = parseNodeId(nodeId);
      if (source && featureId && map.getSource(source)) {
        map.setFeatureState({ source, id: featureId }, { selected: false });
      }
    });

    // Apply new highlights
    nodeIds.forEach((nodeId) => {
      const { source, featureId } = parseNodeId(nodeId);
      if (source && featureId && map.getSource(source)) {
        map.setFeatureState({ source, id: featureId }, { selected: true });
      }
    });

    setHighlightedNodes(nodeIds);
  };

  // Handler for opening node simulation slideshow
  const handleOpenNodeSimulation = async (nodeId: string) => {
    const map = mapRef.current;
    if (!map) return;

    // Parse node ID to get source and feature ID
    const { source, featureId } = parseNodeId(nodeId);
    if (!source || !featureId) {
      toast.error("Unable to locate node on map");
      return;
    }

    // Find the node coordinates from our data
    let coordinates: [number, number] | null = null;
    if (source === "inlets") {
      const inlet = inletsRef.current.find((i) => i.id === featureId);
      if (inlet) coordinates = inlet.coordinates;
    } else if (source === "storm_drains") {
      const drain = drainsRef.current.find((d) => d.id === featureId);
      if (drain) coordinates = drain.coordinates;
    }

    if (!coordinates) {
      toast.error("Unable to locate node coordinates");
      return;
    }

    // Step 1: Close the table first
    handleCloseTable();

    // Step 2: Wait for table to close (300ms delay)
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Step 3: Fly to the node
    map.flyTo({
      center: coordinates,
      zoom: CAMERA_ANIMATION.targetZoom,
      speed: CAMERA_ANIMATION.speed,
      curve: CAMERA_ANIMATION.curve,
      essential: CAMERA_ANIMATION.essential,
      easing: CAMERA_ANIMATION.easing,
    });

    // Step 4: Wait for flyTo animation to mostly complete
    // Calculate approximate duration based on distance and speed
    const flyDuration = 1500; // ~1.5 seconds for fly animation
    await new Promise((resolve) => setTimeout(resolve, flyDuration));

    // Step 5: Highlight the node on the map
    map.setFeatureState({ source, id: featureId }, { selected: true });

    // Step 6: Wait a bit for highlight to be visible (200ms)
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Step 7: Show the slideshow
    setSlideshowNode(nodeId);
  };

  // Handler for closing slideshow
  const handleCloseSlideshowNode = () => {
    const map = mapRef.current;
    if (!map || !slideshowNode) return;

    // Clear highlight
    const { source, featureId } = parseNodeId(slideshowNode);
    if (source && featureId && map.getSource(source)) {
      map.setFeatureState({ source, id: featureId }, { selected: false });
    }

    setSlideshowNode(null);
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
          selectedPointForSimulation={selectedPointForSimulation}
          reports={[]}
          onRefreshReports={async () => {}}
          isRefreshingReports={false}
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
          onGenerateTable={handleGenerateTable}
          isLoadingTable={isLoadingTable}
          onCloseTable={handleCloseTable}
        />
        <CameraControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetPosition={handleResetPosition}
          onChangeStyle={handleChangeStyle}
          isSimulationActive={isSimulationActive}
          onExitSimulation={handleExitSimulation}
        />

        {/* Vulnerability Data Table Overlay */}
        {tableData && (
          <div
            className="absolute z-20 pointer-events-auto"
            style={{
              left: `${tablePosition.x}px`,
              top: `${tablePosition.y}px`,
            }}
          >
            <VulnerabilityDataTable
              data={tableData}
              isMinimized={isTableMinimized}
              onToggleMinimize={handleToggleTableMinimize}
              onClose={handleCloseTable}
              position={tablePosition}
              onPositionChange={setTablePosition}
              onHighlightNodes={handleHighlightNodes}
              onOpenNodeSimulation={handleOpenNodeSimulation}
            />
          </div>
        )}

        {/* Node Simulation Slideshow */}
        {slideshowNode && (
          <NodeSimulationSlideshow
            nodeId={slideshowNode}
            onClose={handleCloseSlideshowNode}
            tableData={tableData}
          />
        )}
      </main>
    </>
  );
}
