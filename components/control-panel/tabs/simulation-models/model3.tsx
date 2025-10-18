"use client";

import React from "react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { IconTool } from "@tabler/icons-react";
import type { Inlet, Outlet, Pipe, Drain } from "../../types";

interface Model3Props {
  selectedPointId?: string | null;
  selectedInlet?: Inlet | null;
  selectedOutlet?: Outlet | null;
  selectedPipe?: Pipe | null;
  selectedDrain?: Drain | null;
}

export default function Model3({
  selectedPointId = null,
  selectedInlet = null,
  selectedOutlet = null,
  selectedPipe = null,
  selectedDrain = null,
}: Model3Props) {
  return (
    <div className="flex flex-col flex-1 pt-3 pb-5 pl-5 pr-4 space-y-4">
      <CardHeader className="py-0 px-1 mb-3">
        <CardTitle>Infrastructure Health Model</CardTitle>
        <CardDescription className="text-xs">
          Assess structural integrity and maintenance requirements
        </CardDescription>
      </CardHeader>

      <Empty className="h-96 flex gap-8">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="!size-13 border border-input">
            <IconTool className="w-16 h-16" />
          </EmptyMedia>
          <EmptyTitle>Coming Soon</EmptyTitle>
          <EmptyDescription className="text-sm">
            The Infrastructure Health Model is currently under development. This
            simulation will evaluate component condition, predict maintenance
            needs, and assess structural integrity of drainage infrastructure.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
