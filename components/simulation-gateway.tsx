"use client";

import { useState } from "react";
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
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { Play, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { IconCloud } from "@tabler/icons-react";

export function SimulationGateway() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleEnterSimulation = () => {
    router.push("/simulation?active=true");
  };

  return (
    <Empty className="h-5/6 flex gap-8">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="!size-13 border border-input">
          <IconCloud className="w-16 h-16" />
        </EmptyMedia>
        <EmptyTitle>Simulation Mode</EmptyTitle>
        <EmptyDescription className="text-sm">
          Try out our drainage vulnerability simulation model
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          onClick={handleEnterSimulation}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex w-32 h-10 justify-center"
        >
          {isHovered ? <IconPlayerPlayFilled className="w-4 h-4" /> : <Play />}
          Simulate
        </Button>
        {/* <Link
          href="https://github.com/eliseoalcaraz/pjdsc/tree/main/app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm flex flex-row text-muted-foreground hover:text-primary hover:underline underline-offset-4 items-center gap-1"
          className="text-sm flex flex-row text-muted-foreground hover:text-primary hover:underline underline-offset-4 items-center gap-1"
        >
          Learn More
          <ArrowUpRight className="w-4.5 h-4.5" />
        </Link> */}
      </EmptyContent>
    </Empty>
  );
}
