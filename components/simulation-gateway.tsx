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
import { Play, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { IconCloud } from "@tabler/icons-react";

export function SimulationGateway() {
  const router = useRouter();

  const handleEnterSimulation = () => {
    router.push("/simulation?active=true");
  };

  return (
    <Empty className="h-5/6">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconCloud />
        </EmptyMedia>
        <EmptyTitle>Simulation Mode</EmptyTitle>
        <EmptyDescription>
          Try out our drainage vulnerability simulation model
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={handleEnterSimulation} className="flex justify-center">
          <Play />
          Simulate
        </Button>
        {/* <Link
          href="https://github.com/eliseoalcaraz/pjdsc/tree/main/app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm flex flex-row text-muted-foreground hover:text-primary hover:underline underline-offset-4 items-center gap-1"
        >
          Learn More
          <ArrowUpRight className="w-4.5 h-4.5" />
        </Link> */}
      </EmptyContent>
    </Empty>
  );
}
