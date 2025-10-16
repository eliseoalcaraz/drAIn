export const DEFAULT_CENTER: [number, number] = [123.926, 10.337];
export const DEFAULT_ZOOM = 12;
export const DEFAULT_STYLE =
  "mapbox://styles/kiloukilou/cmgtsa66q001101staanz0253";

export const MAP_BOUNDS: [[number, number], [number, number]] = [
  [123.86601, 10.30209],
  [124.02689, 10.37254],
];

export const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1Ijoia2lsb3VraWxvdSIsImEiOiJjbWZsMmc5dWMwMGlxMmtwdXgxaHE0ZjVnIn0.TFZP0T-4zrLdI0Be-u0t3Q";

// ============================================
// LAYER COLOR CONFIGURATION
// Easily modify colors and borders for each layer here
// ============================================

// Transition settings for smooth animations
// For silky smooth transitions, use:
// - Longer duration (400-600ms)
// - Easing functions (handled by Mapbox internally)
export const TRANSITION_CONFIG = {
  duration: 500, // Animation duration in milliseconds (increased for smoother feel)
  delay: 0, // Delay before animation starts
};

// Camera animation settings for flyTo transitions
// For silky smooth camera movement:
// - Lower speed (0.6-1.0 for smooth, cinematic feel)
// - Moderate curve (1.0-1.5 for natural arc)
// - Add easing for smooth acceleration/deceleration
export const CAMERA_ANIMATION = {
  speed: 0.8, // Slower speed = smoother, more cinematic (was 1.2)
  curve: 1.2, // Gentle arc for natural movement (was 1)
  targetZoom: 18, // Zoom level when selecting a feature
  essential: true, // Ensures animation is not skipped even if user prefers reduced motion

  // Easing function for smooth acceleration/deceleration
  // Mapbox uses easeInOutCubic by default, which is already smooth
  // But we can ensure it's applied by setting these additional properties
  easing: (t: number) => t * (2 - t), // easeOutQuad for smooth deceleration
};

export const LAYER_COLORS = {
  man_pipes: {
    color: "#8558c9", // Dark magenta/purple for pipes
    selectedColor: "#dc2eef", // Cyan when selected
    width: 2.5, // Normal line width
    selectedWidth: 6, // Selected line width
  },
  storm_drains: {
    color: "#5687ca", // Blue for storm drains
    selectedColor: "#49a8ff", // Cyan when selected
    strokeColor: "#00346c", // Black border
    selectedStrokeColor: "#355491", // Cyan border when selected
    radius: 4, // Normal circle radius
    selectedRadius: 10, // Selected circle radius
    strokeWidth: 0.5, // Normal border width
    selectedStrokeWidth: 1, // Selected border width
  },
  inlets: {
    color: "#00ca67", // Green for inlets
    selectedColor: "#66ed7b", // Cyan when selected
    strokeColor: "#005400", // Black border
    selectedStrokeColor: "#307524", // Cyan border when selected
    radius: 6, // Normal circle radius
    selectedRadius: 12, // Selected circle radius
    strokeWidth: 0.5, // Normal border width
    selectedStrokeWidth: 1.2, // Selected border width
  },
  outlets: {
    color: "#dd4337", // Red for outlets
    selectedColor: "#ff4b50", // Cyan when selected
    strokeColor: "#6a0000", // Black border
    selectedStrokeColor: "#7e1c14", // Cyan border when selected
    radius: 6, // Normal circle radius
    selectedRadius: 12, // Selected circle radius
    strokeWidth: 0.5, // Normal border width
    selectedStrokeWidth: 1.2, // Selected border width
  },
} as const;

// OVERLAY_CONFIG synchronized with LAYER_COLORS
export const OVERLAY_CONFIG = [
  { id: "man_pipes-layer", name: "Pipes", color: LAYER_COLORS.man_pipes.color },
  {
    id: "storm_drains-layer",
    name: "Storm Drains",
    color: LAYER_COLORS.storm_drains.color,
  },
  { id: "inlets-layer", name: "Inlets", color: LAYER_COLORS.inlets.color },
  { id: "outlets-layer", name: "Outlets", color: LAYER_COLORS.outlets.color },
];

export const LAYER_IDS: string[] = [
  "man_pipes-layer",
  "storm_drains-layer",
  "inlets-layer",
  "outlets-layer",
];

export const MAP_STYLES = {
  STREETS: "mapbox://styles/mapbox/streets-v11",
  SATELLITE: "mapbox://styles/mapbox/satellite-streets-v11",
} as const;

// ============================================
// HELPER FUNCTIONS FOR LAYER PAINT CONFIGURATION
// ============================================

/**
 * Get paint configuration for line layers (pipes)
 */
export function getLinePaintConfig(layerType: keyof typeof LAYER_COLORS) {
  const config = LAYER_COLORS[layerType];
  if (!("width" in config)) {
    throw new Error(`Layer type ${layerType} is not a line layer`);
  }

  return {
    "line-color": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      config.selectedColor,
      config.color,
    ] as any,
    "line-width": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      config.selectedWidth,
      config.width,
    ] as any,
    "line-color-transition": {
      duration: TRANSITION_CONFIG.duration,
      delay: TRANSITION_CONFIG.delay,
    },
    "line-width-transition": {
      duration: TRANSITION_CONFIG.duration,
      delay: TRANSITION_CONFIG.delay,
    },
  };
}

/**
 * Get paint configuration for circle layers (storm drains, inlets, outlets)
 */
export function getCirclePaintConfig(layerType: keyof typeof LAYER_COLORS) {
  const config = LAYER_COLORS[layerType];
  if (!("radius" in config)) {
    throw new Error(`Layer type ${layerType} is not a circle layer`);
  }

  return {
    "circle-radius": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      config.selectedRadius,
      config.radius,
    ] as any,
    "circle-color": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      config.selectedColor,
      config.color,
    ] as any,
    "circle-stroke-color": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      config.selectedStrokeColor,
      config.strokeColor,
    ] as any,
    "circle-stroke-width": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      config.selectedStrokeWidth,
      config.strokeWidth,
    ] as any,
    "circle-radius-transition": {
      duration: TRANSITION_CONFIG.duration,
      delay: TRANSITION_CONFIG.delay,
    },
    "circle-color-transition": {
      duration: TRANSITION_CONFIG.duration,
      delay: TRANSITION_CONFIG.delay,
    },
    "circle-stroke-color-transition": {
      duration: TRANSITION_CONFIG.duration,
      delay: TRANSITION_CONFIG.delay,
    },
    "circle-stroke-width-transition": {
      duration: TRANSITION_CONFIG.duration,
      delay: TRANSITION_CONFIG.delay,
    },
  };
}
