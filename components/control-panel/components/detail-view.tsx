import type { DetailItem, FieldConfig } from "../types";
import ModelViewer from "../../ModelViewer";

interface DetailViewProps {
  item: DetailItem;
  fields: FieldConfig[];
  modelUrl: string;
}

export function DetailView({ item, fields, modelUrl }: DetailViewProps) {
  return (
    <div className="px-4 space-y-4">
      <div className="flex justify-center">
        <ModelViewer
          url={modelUrl}
          defaultRotationX={0}
          defaultRotationY={0}
          autoRotate
          width={250}
          height={250}
          defaultZoom={1.3}
          showScreenshotButton={false}
          enableManualZoom={false}
          autoFrame
        />
      </div>
      <div className="p-4 space-y-4">
        <div className="text-sm space-y-2">
          {fields.map((field) => (
            <p key={field.key}>
              <strong>{field.label}:</strong>{" "}
              {String(item[field.key as keyof typeof item])}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
