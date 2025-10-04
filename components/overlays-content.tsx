"use client";

import { useState, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { OverlayLegend } from "./overlay-legend";
import { ChartPieDonutText } from "./chart-pie";
import { ReportsToggle } from "./reports-toggle";
import { GripVertical } from "lucide-react";

interface OverlayContentProps {
  overlays: {
    id: string;
    name: string;
    color: string;
    visible: boolean;
  }[];
  onToggleOverlay: (id: string) => void;
  onNavigateToTable?: (
    dataset: "inlets" | "outlets" | "storm_drains" | "man_pipes"
  ) => void;
  onNavigateToReportForm?: () => void;
  searchTerm?: string;
}

type ComponentId = "chart" | "layers" | "reports";

interface ComponentMetadata {
  id: ComponentId;
  keywords: string[];
  component: React.ReactNode;
}

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      {children}
    </div>
  );
}

export default function OverlaysContent({
  overlays,
  onToggleOverlay,
  onNavigateToTable,
  onNavigateToReportForm,
  searchTerm = "",
}: OverlayContentProps) {
  const [componentOrder, setComponentOrder] = useState<ComponentId[]>([
    "chart",
    "layers",
    "reports",
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const componentsMetadata: ComponentMetadata[] = useMemo(
    () => [
      {
        id: "chart" as ComponentId,
        keywords: [
          "drainage",
          "infrastructure",
          "statistics",
          "chart",
          "pipes",
          "inlets",
          "outlets",
          "drains",
          "donut",
          "pie",
          "graph",
          "visualization",
          "data",
          "count",
          "total",
          "distribution",
        ],
        component: <ChartPieDonutText onNavigate={onNavigateToTable} />,
      },
      {
        id: "layers" as ComponentId,
        keywords: [
          "layers",
          "map",
          "toggle",
          "visibility",
          "overlays",
          "show",
          "hide",
          "legend",
          "controls",
          "switch",
        ],
        component: (
          <OverlayLegend
            overlays={overlays}
            onToggleOverlay={onToggleOverlay}
          />
        ),
      },
      {
        id: "reports" as ComponentId,
        keywords: [
          "reports",
          "issues",
          "user",
          "submissions",
          "problems",
          "complaints",
          "feedback",
          "form",
          "clogged",
          "damage",
          "overflow",
        ],
        component: (
          <ReportsToggle
            isVisible={
              overlays.find((o) => o.id === "reports-layer")?.visible ?? true
            }
            onToggle={() => onToggleOverlay("reports-layer")}
            onNavigateToReportForm={onNavigateToReportForm}
          />
        ),
      },
    ],
    [overlays, onToggleOverlay, onNavigateToTable, onNavigateToReportForm]
  );

  // Calculate relevance scores and reorder based on search
  const orderedComponents = useMemo(() => {
    if (!searchTerm.trim()) {
      return componentOrder.map(
        (id) => componentsMetadata.find((c) => c.id === id)!
      );
    }

    const query = searchTerm.toLowerCase();
    const scoredComponents = componentsMetadata.map((comp) => {
      const score = comp.keywords.reduce((total, keyword) => {
        if (keyword.includes(query)) {
          return total + (keyword.startsWith(query) ? 2 : 1);
        }
        return total;
      }, 0);
      return { ...comp, score };
    });

    return scoredComponents
      .filter((comp) => comp.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [searchTerm, componentOrder, componentsMetadata]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setComponentOrder((items) => {
        const oldIndex = items.indexOf(active.id as ComponentId);
        const newIndex = items.indexOf(over.id as ComponentId);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 pl-3.5 pr-5">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedComponents.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {orderedComponents.map((comp) => (
            <SortableItem key={comp.id} id={comp.id}>
              {comp.component}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
