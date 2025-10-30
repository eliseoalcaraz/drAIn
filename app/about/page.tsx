"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Droplets,
  Target,
  Users,
  Code,
  Heart,
  FileText,
} from "lucide-react";

export default function About() {
  // Add scrollbar-gutter to body only for this page
  React.useEffect(() => {
    document.body.style.overflowY = "scroll";
    return () => {
      document.body.style.overflowY = "";
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#e8e8e8]/50">
      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="w-[1280px] mx-auto px-4 md:px-6 space-y-16">
          {/* Hero Section */}
          <section className="bg-white border border-[#ced1cd] rounded-xl py-10 px-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              AI-Driven Urban Flood Intelligence
            </h2>
            <p className="text-base text-foreground leading-relaxed">
              drAin combines hydrological modeling, machine learning, and
              satellite data to help cities understand, predict, and manage
              urban flooding through actionable insights.
            </p>
          </section>
          {/* Key Features Grid */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
              What Makes drAin Unique
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-[#ced1cd] rounded-xl py-6 px-6 hover:border-[#3B82F6] transition-colors">
                <div className="w-12 h-12 bg-secondary rounded-sm flex items-center justify-center mb-4">
                  <Droplets className="w-6 h-6 text-[#3B82F6]" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  SWMM Integration
                </h3>
                <p className="text-muted-foreground text-base md:text-sm">
                  Industry-standard hydrological modeling for accurate drainage
                  network simulation
                </p>
              </div>

              <div className="bg-white border border-[#ced1cd] rounded-xl py-6 px-6 hover:border-[#3B82F6] transition-colors">
                <div className="w-12 h-12 bg-secondary rounded-sm flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-[#3B82F6]" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  AI Clustering
                </h3>
                <p className="text-muted-foreground text-base md:text-sm">
                  K-means algorithms identify vulnerability patterns and weak
                  points in drainage systems
                </p>
              </div>

              <div className="bg-white border border-[#ced1cd] rounded-xl py-6 px-6 hover:border-[#3B82F6] transition-colors">
                <div className="w-12 h-12 bg-secondary rounded-sm flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-[#3B82F6]" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Citizen Engagement
                </h3>
                <p className="text-muted-foreground text-base md:text-sm">
                  Real-time reporting and monitoring capabilities for community
                  participation
                </p>
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="bg-white border border-[#ced1cd] rounded-xl py-6 px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block px-4 py-2 bg-secondary text-foreground rounded-sm text-sm font-semibold mb-4">
                  Our Story
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Born from Real-World Challenges
                </h2>
                <div className="space-y-4 text-foreground leading-relaxed text-base md:text-sm">
                  <p>
                    drAin emerged from a university research initiative at the{" "}
                    <strong>University of the Philippines Cebu</strong>, driven
                    by Computer Science students who witnessed the devastating
                    impact of recurring floods in <strong>Mandaue City</strong>.
                  </p>
                  <p>
                    While traditional flood maps show <em>where</em> flooding
                    occurs, drAin reveals <em>why</em>—identifying which
                    drainage components are at risk and how infrastructure
                    changes affect resilience.
                  </p>
                  <p>
                    We bridge the gap between academic research, AI innovation,
                    and civic technology to deliver actionable flood
                    intelligence.
                  </p>
                </div>
              </div>

              <div className="bg-[#f7f7f7] border border-[#ced1cd] rounded-xl py-6 px-6">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Our Vision
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#3B82F6] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <p className="text-foreground text-base md:text-sm">
                      Empower local governments with actionable flood data
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#3B82F6] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <p className="text-foreground text-base md:text-sm">
                      Enable citizens to report and monitor drainage conditions
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#3B82F6] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <p className="text-foreground text-base md:text-sm">
                      Reduce hydrological study costs using AI and open data
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#3B82F6] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <p className="text-foreground text-base md:text-sm">
                      Promote open-source collaboration for urban resilience
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Principles */}
          <section className="bg-white rounded-xl border border-[#ced1cd] py-6 px-6">
            <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
              Our Principles
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-sm flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-[#3B82F6]" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Transparency
                </h3>
                <p className="text-base md:text-sm text-muted-foreground">
                  Built with open-source tools and public datasets
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-sm flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-[#3B82F6]" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Reproducibility
                </h3>
                <p className="text-base md:text-sm text-muted-foreground">
                  Consistent simulation results you can trust
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-sm flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-[#3B82F6]" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Scalability
                </h3>
                <p className="text-base md:text-sm text-muted-foreground">
                  Adaptable to new cities and datasets
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-sm flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-[#3B82F6]" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  User-Centricity
                </h3>
                <p className="text-base md:text-sm text-muted-foreground">
                  Designed for experts and citizens alike
                </p>
              </div>
            </div>
          </section>

          {/* Contribution */}
          <section className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Join Our Mission
              </h2>
              <p className="text-gray-700 mb-6">
                We welcome developers, researchers, and civic innovators to
                contribute to sustainable flood management.
              </p>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">
                  Contribution Areas:
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Frontend UI
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Backend API
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Data Science
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Documentation
                  </span>
                </div>
              </div>
            </div>

            <Card className="md:col-span-3 border-2 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Quick Start Guide
                </h3>
                <ol className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <span>
                      Fork the{" "}
                      <a
                        href="https://github.com/eliseoalcaraz/drAIn"
                        target="_blank"
                      >
                        <span className="font-bold underline decoration-blue-500 text-blue-500">
                          repository
                        </span>
                      </a>{" "}
                      and set up your environment
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <div className="flex-1">
                      <span className="block mb-1">Install dependencies:</span>
                      <code className="block bg-gray-900 text-green-400 px-3 py-2 rounded text-xs">
                        pnpm install
                      </code>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <div className="flex-1">
                      <span className="block mb-1">Run the backend:</span>
                      <code className="block bg-gray-900 text-green-400 px-3 py-2 rounded text-xs">
                        uvicorn server:app --reload
                      </code>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      4
                    </span>
                    <span>Create a branch and submit a pull request</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </section>

          {/* Team & Contact */}
          <section className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#ced1cd] rounded-xl py-6 pb-8 px-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Meet the Team
              </h2>

              <p className="text-foreground mb-6 text-base md:text-sm">
                Developed and maintained by <strong>Team 2Ls</strong> from the
                University of the Philippines Cebu, Department of Computer
                Science.
              </p>
              <div className="space-y-4">
                <a
                  href="mailto:epalcaraz@up.edu.ph"
                  className="flex items-center gap-3 text-[#3B82F6] hover:text-[#2563EB] transition-colors group"
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-base md:text-sm">
                    epalcaraz@up.edu.ph
                  </span>
                </a>
                <a
                  href="mailto:kborbano@up.edu.ph"
                  className="flex items-center gap-3 text-[#3B82F6] hover:text-[#2563EB] transition-colors group"
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-base md:text-sm">
                    kborbano@up.edu.ph
                  </span>
                </a>
                <a
                  href="mailto:ccbayadog@up.edu.ph"
                  className="flex items-center gap-3 text-[#3B82F6] hover:text-[#2563EB] transition-colors group"
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-base md:text-sm">
                    ccbayadog@up.edu.ph
                  </span>
                </a>
                <a
                  href="mailto:najazul@up.edu.ph"
                  className="flex items-center gap-3 text-[#3B82F6] hover:text-[#2563EB] transition-colors group"
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-base md:text-sm">
                    najazul@up.edu.ph
                  </span>
                </a>
                <a
                  href="mailto:jpsandro@up.edu.ph"
                  className="flex items-center gap-3 text-[#3B82F6] hover:text-[#2563EB] transition-colors group"
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-base md:text-sm">
                    jpsandro@up.edu.ph
                  </span>
                </a>

                {/*
                  <a href="https://github.com/team-2Ls" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#3B82F6] hover:text-[#2563EB] transition-colors">
                    <Github className="w-5 h-5" />
                    <span>github.com/eliseoalcaraz/drAIn</span> 
                  </a> */}
              </div>
            </div>

            <div className="bg-white border border-[#ced1cd] rounded-xl py-6 px-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                License
              </h2>

              <p className="text-foreground mb-6 text-base md:text-sm">
                This project is licensed under the{" "}
                <strong>GNU General Public License v2.0 (GPL-2.0)</strong>. You
                are free to use, modify, and distribute the code with proper
                attribution.
              </p>
              <Button
                className="bg-[#4b72f3] hover:bg-[#2563EB] text-white border border-[#2b3ea7] rounded-sm transition-colors"
                asChild
              >
                <a href="/LICENSE" download>
                  View License
                </a>
              </Button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white text-foreground py-8 mt-8 border-t border-[#ced1cd]">
        <div className="w-[1280px] mx-auto px-4 md:px-6 text-center">
          <p className="text-base md:text-sm">
            © 2025 Team 2Ls, University of the Philippines Cebu. Building
            resilient cities through open-source innovation.
          </p>
        </div>
      </footer>
    </div>
  );
}
