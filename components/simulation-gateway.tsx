"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Play } from "lucide-react";

export function SimulationGateway() {
  const router = useRouter();

  const handleEnterSimulation = () => {
    router.push("/simulation?active=true");
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Simulation Mode</CardTitle>
        <CardDescription className="text-base mt-2">
          Enter simulation mode to run flood predictions and interact with the
          drainage network in real-time on a dedicated dark-themed map.
        </CardDescription>
      </CardHeader>

      <Button
        onClick={handleEnterSimulation}
        size="lg"
        className="w-full max-w-sm h-14 text-lg"
      >
        <Play className="mr-2 h-5 w-5" />
        Enter Simulation Mode
      </Button>
    </div>
  );
}
