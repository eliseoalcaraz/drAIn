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
import { useOutlets } from "@/hooks/useOutlets";
import type { Outlet } from "@/components/control-panel/types";
import { Drain, useDrain } from "@/hooks/useDrain";
import { Pipe, usePipes } from "@/hooks/usePipes";
import type { DatasetType } from "@/components/control-panel/types";
import ReactDOM from "react-dom/client";
import { ReportBubble, type ReportBubbleRef } from "@/components/report-bubble";
import { fetchReports, subscribeToNewReports } from "@/lib/supabase/report";
import { useSearchParams, useRouter } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";

import "mapbox-gl/dist/mapbox-gl.css";

export default function MapPage() {
  const { setOpen, isMobile, setOpenMobile } = useSidebar();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [isRefreshingReports, setIsRefreshingReports] = useState(false);

  const [overlayVisibility, setOverlayVisibility] = useState({
    "man_pipes-layer": true,
    "storm_drains-layer": true,
    "inlets-layer": true,
    "outlets-layer": true,
    "reports-layer": true,
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

  const reportPopupsRef = useRef<mapboxgl.Popup[]>([]);

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("activetab") || "overlays";

  const [controlPanelTab, setControlPanelTab] = useState<string>(initialTab);
  useEffect(() => {
    const tab = searchParams.get("activetab") || "overlays";
    setControlPanelTab(tab);
  }, [searchParams]);

  const dataConsumerTabs = ["report", "simulations", "admin"];

  // Auto-close sidebar when map page loads (only once on mount)
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchReports();
        setReports(data);
        console.log("Fetched reports:", data);
      } catch (err) {
        console.error("Failed to load reports:", err);
      }
    };
    loadReports();
    const unsubscribe = subscribeToNewReports((newReport) => {
      setReports((currentReports) => [...currentReports, newReport]);
    });
    return () => {
      unsubscribe();
    };
  }, []);

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

  // Toggle report popups visibility
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const isVisible = overlayVisibility["reports-layer"];
    const popups = reportPopupsRef.current;

    popups.forEach((popup) => {
      if (isVisible) {
        if (!popup.isOpen()) {
          popup.addTo(map);
        }
      } else {
        popup.remove();
      }
    });
  }, [overlayVisibility]);

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    if (mapContainerRef.current && !mapRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: DEFAULT_STYLE,
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        maxBounds: MAP_BOUNDS,
        pitch: 60,
        bearing: -17.6,
        attributionControl: false, // Disable default attribution
      });

      // Disable all default navigation controls since we have custom CameraControls
      // map.addControl(
      //   new mapboxgl.AttributionControl({ compact: true }),
      //   "bottom-left"
      // );

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
          setControlPanelTab("overlays");
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
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", layerId, () => {
          map.getCanvas().style.cursor = "";
        });
      });
    }
  }, [layerIds]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !reports || reports.length === 0) return;

    // Remove old popups
    reportPopupsRef.current.forEach((popup) => popup.remove());
    reportPopupsRef.current = [];

    const reportBubbleRefs: Array<ReportBubbleRef | null> = [];

    const coordinateCounts = new Map<string, number>();
    reports.forEach((report) => {
      const key = JSON.stringify(report.coordinates);
      coordinateCounts.set(key, (coordinateCounts.get(key) || 0) + 1);
    });

    reports.forEach((report, index) => {
      const container = document.createElement("div");
      const root = ReactDOM.createRoot(container);

      const popup = new mapboxgl.Popup({
        maxWidth: "320px",
        closeButton: false,
        className: "no-bg-popup",
        closeOnClick: false,
      })
        .setLngLat(report.coordinates)
        .setDOMContent(container)
        .addTo(map);

      reportPopupsRef.current.push(popup);

      const handleOpenBubble = () => {
        reportBubbleRefs.forEach((ref, i) => {
          if (i !== index && ref) ref.close();
        });
      };

      const key = JSON.stringify(report.coordinates);
      const count = coordinateCounts.get(key) ?? 1;

      root.render(
        <ReportBubble
          ref={(ref) => {
            reportBubbleRefs[index] = ref;
          }}
          report={report}
          map={map}
          coordinates={report.coordinates}
          onOpen={handleOpenBubble}
          count={count}
        />
      );
    });
  }, [reports]);

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
      "reports-layer": !someVisible,
    };

    setOverlayVisibility(updated);
  };

  const someVisible = Object.values(overlayVisibility).some(Boolean);

  // Handler for the back button in control panel
  const handleControlPanelBack = () => {
    clearSelections();
    setControlPanelTab("stats");
  };

  // Handler for refreshing reports
  const handleRefreshReports = async () => {
    setIsRefreshingReports(true);
    try {
      const data = await fetchReports();
      setReports(data);
      console.log("Refreshed reports:", data);
    } catch (err) {
      console.error("Failed to refresh reports:", err);
    } finally {
      setIsRefreshingReports(false);
    }
  };

  const handleSelectInlet = (inlet: Inlet) => {
    if (!mapRef.current) return;
    const [lng, lat] = inlet.coordinates;

    // Clear any previous selections first
    clearSelections();

    // Set the new selection state for control panel
    setSelectedInlet(inlet);
    if (!dataConsumerTabs.includes(controlPanelTab)) {
      setControlPanelTab("stats");
    }
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
    if (!dataConsumerTabs.includes(controlPanelTab)) {
      setControlPanelTab("stats");
    }
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
    if (!dataConsumerTabs.includes(controlPanelTab)) {
      setControlPanelTab("stats");
    }
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
    if (!dataConsumerTabs.includes(controlPanelTab)) {
      setControlPanelTab("stats");
    }
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

    // Fly to the location on the map
    mapRef.current.flyTo({
      center: midpoint,
      zoom: 18,
      speed: 1.2,
      curve: 1,
    });

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
          onTabChange={(tab) => {
            setControlPanelTab(tab);
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set("activetab", tab);
            router.replace(`?${newParams.toString()}`);
          }}
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
          reports={reports}
          onRefreshReports={handleRefreshReports}
          isRefreshingReports={isRefreshingReports}
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
