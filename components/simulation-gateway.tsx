"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Play, Droplets } from "lucide-react";
import Link from "next/link";

export function SimulationGateway() {
  const router = useRouter();

  const handleEnterSimulation = () => {
    router.push("/simulation?active=true");
  };

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Droplets className="size-6" />
        </EmptyMedia>
        <EmptyTitle>Simulation Mode</EmptyTitle>
        <EmptyDescription>
          Try out our drainage vulnerability model
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          onClick={handleEnterSimulation}
          size="lg"
          className="w-full h-12"
        >
          <Play className="mr-2 h-5 w-5" />
          Enter Simulation Mode
        </Button>
        <Link
          href="https://github.com/eliseoalcaraz/pjdsc/tree/main/app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4"
        >
          Learn more
        </Link>
      </EmptyContent>
    </Empty>
  );
}
