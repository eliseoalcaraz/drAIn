"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { fetchYRTable } from "@/lib/Vulnerabilities/FetchDeets";
import { Spinner } from "@/components/ui/spinner";

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

interface NodeMaximumRateChartProps {
  nodeId: string;
  year: YearOption;
  maxNodes?: number;
}

interface ChartDataPoint {
  nodeId: string;
  maxRate: number;
  isSelected: boolean;
  rank: number;
}

export function NodeMaximumRateChart({
  nodeId,
  year,
  maxNodes = 50,
}: NodeMaximumRateChartProps) {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [selectedNodeData, setSelectedNodeData] =
    useState<ChartDataPoint | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const allNodes = await fetchYRTable(year);

        // Sort by Maximum_Rate descending
        const sortedNodes = [...allNodes].sort(
          (a, b) => b.Maximum_Rate - a.Maximum_Rate
        );

        // Find the selected node
        const selectedNode = sortedNodes.find(
          (node) => node.Node_ID === nodeId
        );
        const selectedNodeIndex = sortedNodes.findIndex(
          (node) => node.Node_ID === nodeId
        );

        // Take top N nodes or ensure selected node is included
        let nodesToShow = sortedNodes.slice(0, maxNodes);

        // If selected node is not in top N, add it
        if (selectedNode && selectedNodeIndex >= maxNodes) {
          nodesToShow = [...nodesToShow, selectedNode];
        }

        // Transform to chart format
        const transformed: ChartDataPoint[] = nodesToShow.map(
          (node, index) => ({
            nodeId: node.Node_ID,
            maxRate: node.Maximum_Rate,
            isSelected: node.Node_ID === nodeId,
            rank: sortedNodes.findIndex((n) => n.Node_ID === node.Node_ID) + 1,
          })
        );

        // Sort again by maxRate for consistent display
        transformed.sort((a, b) => b.maxRate - a.maxRate);

        setChartData(transformed);

        if (selectedNode) {
          setSelectedNodeData({
            nodeId: selectedNode.Node_ID,
            maxRate: selectedNode.Maximum_Rate,
            isSelected: true,
            rank: selectedNodeIndex + 1,
          });
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [nodeId, year, maxNodes]);

  const chartConfig = {
    maxRate: {
      label: "Maximum Rate (CMS)",
    },
  };

  if (loading) {
    return (
      <div className="w-full h-[200px] flex items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full pt-2">
      {selectedNodeData && (
        <div className="flex justify-center">
          <div className="w-48 text-xs h-6 rounded-xl border flex items-center justify-center bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20">
            Ranked #{selectedNodeData.rank} out of {chartData.length} nodes
          </div>
        </div>
      )}
      <ChartContainer config={chartConfig} className="h-[200px] pb-2 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <XAxis
              dataKey="rank"
              tick={{ fontSize: 10 }}
              label={{
                value: "Node Rank",
                position: "insideBottom",
                offset: -5,
                fontSize: 10,
              }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null;

                const data = payload[0].payload as ChartDataPoint;
                return (
                  <div className="bg-background border border-border rounded-lg px-3 py-2 shadow-lg">
                    <div className="text-xs space-y-1">
                      <div className="font-semibold">
                        Node: {data.nodeId}
                        {data.isSelected && (
                          <span className="ml-2 text-primary">(Selected)</span>
                        )}
                      </div>
                      <div className="text-muted-foreground">
                        Rank: #{data.rank}
                      </div>
                      <div className="text-foreground font-mono">
                        {data.maxRate.toFixed(3)} CMS
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Bar dataKey="maxRate" fill="#3b82f6" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(${
                    240 -
                    (entry.maxRate /
                      Math.max(...chartData.map((d) => d.maxRate))) *
                      240
                  }, 70%, 50%)`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
